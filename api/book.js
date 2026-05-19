// Booking request endpoint — Vercel Serverless Function.
// Receives the booking form payload, validates, and logs it for now.
//
// Next steps (when ready):
//   - Wire up email delivery (Resend / SendGrid / Postmark) using an env var,
//     so each request lands in your inbox.
//   - Or push to a CRM / sheet / Slack webhook.
//   - To actually charge, swap the success path for a Stripe Payment Link
//     or a Checkout Session created with `stripe.checkout.sessions.create`.

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

  // Show up in Vercel logs. Replace with real delivery when ready.
  console.log('Booking request:', {
    name: firstName + ' ' + lastName,
    email,
    phone,
    dates,
    days,
    estimateUsd,
    notes
  });

  return res.status(200).json({ ok: true });
};
