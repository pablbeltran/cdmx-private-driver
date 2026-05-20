// Booking request endpoint — Vercel Serverless Function.
//
// On submit:
//   1. Validate payload
//   2. Email the request to the operator (Resend)
//   3. Send a WhatsApp ping to the operator (CallMeBot)
//   4. Always respond OK to the user — notifications never block the form
//
// Env vars (configure in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY            from resend.com
//   BOOKING_NOTIFY_EMAIL      where requests get emailed (default: pablo@...)
//   BOOKING_FROM_EMAIL        verified sender (default: bookings@mexicocityprivatecar.com)
//   CALLMEBOT_API_KEY         from callmebot.com/blog/free-api-whatsapp-messages/
//   WHATSAPP_NOTIFY_PHONE     E.164 without "+" (default: 525547828496)

const NOTIFY_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || 'pablo@mexicocityprivatecar.com';
const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || 'CDMX Private Cars <bookings@mexicocityprivatecar.com>';
const WHATSAPP_NOTIFY_PHONE = process.env.WHATSAPP_NOTIFY_PHONE || '525547828496';

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function buildHtml(p) {
  const row = (label, val) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-weight:600">${esc(label)}</td>` +
    `<td style="padding:6px 0">${val}</td></tr>`;

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;color:#111827;max-width:560px">
  <h2 style="margin:0 0 8px;font-size:20px">New booking request</h2>
  <p style="margin:0 0 20px;color:#6b7280">Someone just requested a reservation through the site.</p>
  <table style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
    ${row('Name', esc(p.firstName + ' ' + p.lastName))}
    ${row('Email', `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`)}
    ${row('Phone / WhatsApp', esc(p.phone) || '—')}
    ${row('Dates', esc(p.dates) || '—')}
    ${row('Days', esc(p.days) || '—')}
    ${row('Estimate', p.estimateUsd ? `$${esc(p.estimateUsd)} USD` : '—')}
  </table>
  <h3 style="margin:0 0 6px;font-size:15px">Notes</h3>
  <p style="margin:0;white-space:pre-wrap;color:#374151">${esc(p.notes) || '<em>(none)</em>'}</p>
</div>`;
}

function buildText(p) {
  return [
    'New booking request',
    '',
    'Name: ' + p.firstName + ' ' + p.lastName,
    'Email: ' + p.email,
    'Phone / WhatsApp: ' + (p.phone || '—'),
    'Dates: ' + (p.dates || '—'),
    'Days: ' + (p.days || '—'),
    'Estimate: ' + (p.estimateUsd ? '$' + p.estimateUsd + ' USD' : '—'),
    '',
    'Notes:',
    p.notes || '(none)'
  ].join('\n');
}

async function sendEmail(payload) {
  if (!process.env.RESEND_API_KEY) {
    return { skipped: 'RESEND_API_KEY not set' };
  }
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: payload.email,
      subject: `New booking — ${payload.firstName} ${payload.lastName} (${payload.days || '?'} days)`,
      html: buildHtml(payload),
      text: buildText(payload)
    })
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error('Resend ' + resp.status + ': ' + body);
  }
  return { ok: true };
}

async function sendWhatsApp(payload) {
  if (!process.env.CALLMEBOT_API_KEY) {
    return { skipped: 'CALLMEBOT_API_KEY not set' };
  }
  const text =
    '📩 New booking request\n' +
    payload.firstName + ' ' + payload.lastName + '\n' +
    payload.email + (payload.phone ? ' · ' + payload.phone : '') + '\n' +
    (payload.dates || '?') + (payload.days ? ' (' + payload.days + ' days)' : '') + '\n' +
    (payload.estimateUsd ? '~$' + payload.estimateUsd + ' USD' : '');
  const url =
    'https://api.callmebot.com/whatsapp.php' +
    '?phone=' + encodeURIComponent(WHATSAPP_NOTIFY_PHONE) +
    '&text=' + encodeURIComponent(text) +
    '&apikey=' + encodeURIComponent(process.env.CALLMEBOT_API_KEY);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('CallMeBot ' + resp.status);
  }
  return { ok: true };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { firstName, lastName, email, phone, dates, days, estimateUsd, notes } = body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const payload = { firstName, lastName, email, phone, dates, days, estimateUsd, notes };

  // Fire both notifications in parallel. Failures are logged but don't
  // fail the request — the user already saw "Request Sent!".
  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail(payload),
    sendWhatsApp(payload)
  ]);

  const notifications = {
    email: emailResult.status === 'fulfilled'
      ? emailResult.value
      : { error: String((emailResult.reason && emailResult.reason.message) || emailResult.reason) },
    whatsapp: whatsappResult.status === 'fulfilled'
      ? whatsappResult.value
      : { error: String((whatsappResult.reason && whatsappResult.reason.message) || whatsappResult.reason) }
  };

  // Surfaced in the response and the Vercel logs so delivery can be checked.
  console.log('booking notifications:', JSON.stringify(notifications));

  return res.status(200).json({ ok: true, notifications: notifications });
};
