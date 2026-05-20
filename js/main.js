// ========================================
// Hero Background Slideshow
// ========================================
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

setInterval(() => {
  heroSlides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
}, 4000);

// ========================================
// Mobile Navigation Toggle
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// ========================================
// Navbar background on scroll
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 1px 8px rgba(0, 0, 0, 0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ========================================
// Flatpickr Date Range Picker + Estimate
// ========================================
// Starting daily rate (Comfort Sedan). The form shows a "from" estimate;
// the final price depends on which vehicle is picked from the fleet.
const RATE_PER_DAY_USD = 240;

const daysCountEl = document.getElementById('daysCount');
let currentDays = 0;
let currentEstimate = 0;

function formatUsd(n) {
  return '$' + n.toLocaleString('en-US') + ' USD';
}

const datePicker = flatpickr('#dateRange', {
  mode: 'range',
  minDate: 'today',
  dateFormat: 'M d, Y',
  disableMobile: true,
  onChange: function (selectedDates) {
    if (selectedDates.length === 2) {
      const start = selectedDates[0];
      const end = selectedDates[1];
      const diffTime = Math.abs(end - start);
      currentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      currentEstimate = currentDays * RATE_PER_DAY_USD;
      daysCountEl.textContent =
        currentDays + ' day' + (currentDays > 1 ? 's' : '') +
        ' · Est. from ' + formatUsd(currentEstimate);
    } else {
      currentDays = 0;
      currentEstimate = 0;
      daysCountEl.textContent = '';
    }
  }
});

// ========================================
// Form Handling
// ========================================
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    dates: document.getElementById('dateRange').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    notes: document.getElementById('notes').value,
    days: currentDays,
    estimateUsd: currentEstimate
  };

  const btn = bookingForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  let ok = false;
  try {
    const resp = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    ok = resp.ok;
  } catch (err) {
    console.error('Booking request failed:', err);
  }

  if (ok) {
    btn.textContent = 'Request Sent!';
    btn.style.background = '#22c55e';
    bookingForm.reset();
    daysCountEl.textContent = '';
    currentDays = 0;
    currentEstimate = 0;
  } else {
    btn.textContent = 'Try again';
    btn.style.background = '#ef4444';
  }

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 3500);
});

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
const animateOnScroll = () => {
  const elements = document.querySelectorAll(
    '.step, .wc-feature, .safety-item, .driver-card, .fleet-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

animateOnScroll();

// ========================================
// Map Explorer (Leaflet)
// ========================================
const EXP_HOME = [19.4115, -99.1710]; // Roma & Condesa

// Landmarks with real lat/lng. Ordered nearest-first.
const EXP_POIS = [
  {
    id: 'chapultepec',
    name: 'Chapultepec Castle',
    coords: [19.4205, -99.1818],
    driveMin: 12,
    img: 'images/chapultepec-castle.webp',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chapultepec+Castle+Mexico+City',
    description: 'The only royal castle in the Americas, perched atop Chapultepec Hill with sweeping views of the city. Inside you\'ll find stunning murals, period rooms, and the National History Museum.'
  },
  {
    id: 'vasconcelos',
    name: 'Biblioteca Vasconcelos',
    coords: [19.4439, -99.1530],
    driveMin: 15,
    img: 'images/Biblioteca_Vasconcelos,_Ciudad_de_México,_México,_2015-07-20,_DD_13-15_HDR.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Biblioteca+Vasconcelos',
    description: 'One of the most stunning modern libraries in the world. Rows of bookshelves appear to float in mid air inside this massive steel and glass structure. A must see for architecture and design lovers.'
  },
  {
    id: 'zocalo',
    name: 'Historic Center & Zócalo',
    coords: [19.4326, -99.1332],
    driveMin: 17,
    img: 'https://images.unsplash.com/photo-1573485905785-f8f87e7bf82c?w=400&h=300&fit=crop&q=80',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zocalo+Mexico+City',
    description: 'The beating heart of Mexico City. Explore the massive cathedral, Palacio Nacional with Diego Rivera murals, and Templo Mayor, the ruins of the Aztec capital hidden in plain sight.'
  },
  {
    id: 'airport',
    name: 'Airport (AICM)',
    coords: [19.4363, -99.0721],
    driveMin: 23,
    img: 'https://images.unsplash.com/photo-1553619948-505cc1cdc320?w=400&h=300&fit=crop&q=80',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mexico+City+International+Airport',
    description: 'Stress free airport pickups and drop offs at Mexico City International Airport. Skip the taxi lines and ride in comfort with your driver waiting at arrivals.'
  },
  {
    id: 'frida',
    name: 'Frida Kahlo Museum',
    coords: [19.3550, -99.1626],
    driveMin: 29,
    img: 'images/museo frida kahlo.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Frida+Kahlo+Museum+Mexico+City',
    description: 'Visit Casa Azul in Coyoacán, the iconic cobalt blue house where Frida Kahlo was born, lived, and created her art. The museum displays personal artifacts, paintings, and the lush garden courtyard.'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    coords: [19.3029, -99.1505],
    driveMin: 35,
    img: 'images/estadio-azteca.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Estadio+Azteca',
    description: 'The legendary 87,000 seat stadium hosting World Cup 2026 matches. Home to two World Cup finals and countless historic moments in football history.'
  },
  {
    id: 'xochimilco',
    name: 'Xochimilco',
    coords: [19.2574, -99.1038],
    driveMin: 45,
    img: 'images/xochimilco.jpeg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Xochimilco+Mexico+City',
    description: 'Float through the ancient Aztec canals on colorful trajinera boats while mariachi bands play from passing vessels. A unique, vibrant experience you won\'t find anywhere else in the world.'
  },
  {
    id: 'teotihuacan',
    name: 'Teotihuacan Pyramids',
    coords: [19.6925, -98.8438],
    driveMin: 63,
    img: 'https://images.unsplash.com/photo-1586933613001-b003c20beac0?w=400&h=300&fit=crop&q=80',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Teotihuacan+Pyramids',
    description: 'Climb the Pyramid of the Sun and Moon at one of the most impressive ancient cities in the Americas. Arrive early to beat the crowds and walk the Avenue of the Dead in morning light.'
  }
];

function expInit() {
  const mapEl = document.getElementById('exploreMap');
  if (!mapEl || !window.L) return;

  const sidebar = document.getElementById('explorerSidebar');
  let selectedId = null;
  let routeLine = null;
  let routeTip = null;
  const markers = {};

  // CartoDB Positron tiles: clean, minimal, professional
  const map = L.map(mapEl, {
    center: [19.39, -99.13],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  // Home marker (Roma & Condesa): pulsing dot with permanent label
  const homeIcon = L.divIcon({
    className: '',
    html: '<div class="exp-home-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  L.marker(EXP_HOME, { icon: homeIcon, interactive: false })
    .addTo(map)
    .bindTooltip('Roma & Condesa', {
      permanent: true,
      direction: 'top',
      offset: [0, -10],
      className: 'exp-home-label'
    });

  // POI markers
  EXP_POIS.forEach(function (p) {
    const icon = L.divIcon({
      className: '',
      html: '<div class="exp-pin" data-id="' + p.id + '">' +
        '<svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0z" fill="currentColor"/>' +
        '<circle cx="12" cy="12" r="4.6" fill="#ffffff"/>' +
        '</svg></div>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    const m = L.marker(p.coords, { icon: icon, riseOnHover: true }).addTo(map);
    m.bindTooltip(p.name + ' · ~' + p.driveMin + ' min', {
      direction: 'top',
      offset: [0, -40],
      className: 'exp-tip'
    });
    m.on('click', function () { expSelect(p.id); });
    markers[p.id] = m;
  });

  // Fit the initial view to include every place
  const all = [EXP_HOME].concat(EXP_POIS.map(function (p) { return p.coords; }));
  map.fitBounds(all, { padding: [40, 40] });

  function expSelect(id) {
    if (selectedId === id) { expClear(); return; }
    selectedId = id;
    const p = EXP_POIS.find(function (x) { return x.id === id; });

    // Marker active state
    Object.keys(markers).forEach(function (mid) {
      const el = markers[mid].getElement();
      if (!el) return;
      const div = el.querySelector('.exp-pin');
      if (div) div.classList.toggle('active', mid === id);
    });

    // Route polyline from home to the selected POI
    if (routeLine) map.removeLayer(routeLine);
    if (routeTip) map.removeLayer(routeTip);
    routeLine = L.polyline([EXP_HOME, p.coords], {
      color: '#e07a5f',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '8 6',
      lineCap: 'round'
    }).addTo(map);

    // Drive-time pill at the route midpoint
    const mid = [(EXP_HOME[0] + p.coords[0]) / 2, (EXP_HOME[1] + p.coords[1]) / 2];
    routeTip = L.tooltip({
      permanent: true,
      direction: 'center',
      className: 'exp-drive-tip'
    })
      .setLatLng(mid)
      .setContent('🚗 ~' + p.driveMin + ' min')
      .addTo(map);

    map.flyToBounds([EXP_HOME, p.coords], { padding: [70, 70], duration: 0.6 });
    renderSidebar();
  }

  function expClear() {
    selectedId = null;
    Object.keys(markers).forEach(function (mid) {
      const el = markers[mid].getElement();
      if (!el) return;
      const div = el.querySelector('.exp-pin');
      if (div) div.classList.remove('active');
    });
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    if (routeTip) { map.removeLayer(routeTip); routeTip = null; }
    renderSidebar();
  }

  function renderSidebar() {
    if (!sidebar) return;
    if (!selectedId) {
      let rows = '';
      EXP_POIS.forEach(function (p) {
        rows += '<button class="exp-row" data-id="' + p.id + '">' +
          '<img src="' + p.img + '" alt="">' +
          '<div class="exp-row-body">' +
          '<div class="exp-row-name">' + p.name + '</div>' +
          '<div class="exp-row-time">~' + p.driveMin + ' min from Roma &amp; Condesa</div>' +
          '</div></button>';
      });
      sidebar.innerHTML =
        '<div class="exp-header">' +
        '<div class="exp-eyebrow">Starting point</div>' +
        '<div class="exp-home-name">Roma &amp; Condesa</div>' +
        '</div>' +
        '<div class="exp-list">' + rows + '</div>';
      sidebar.querySelectorAll('.exp-row').forEach(function (b) {
        b.addEventListener('click', function () { expSelect(b.getAttribute('data-id')); });
      });
      return;
    }

    const p = EXP_POIS.find(function (x) { return x.id === selectedId; });
    sidebar.innerHTML =
      '<div class="exp-detail">' +
      '<button class="exp-back" id="expBack">&larr; All destinations</button>' +
      '<img class="exp-detail-img" src="' + p.img + '" alt="' + p.name + '">' +
      '<span class="exp-detail-time">🚗 ~' + p.driveMin + ' min from Roma &amp; Condesa</span>' +
      '<h3 class="exp-detail-name">' + p.name + '</h3>' +
      '<p class="exp-detail-desc">' + p.description + '</p>' +
      '<div class="exp-detail-actions">' +
      '<a class="exp-maps" href="' + p.mapsUrl + '" target="_blank" rel="noopener">' +
      'Open in Google Maps &#8599;</a>' +
      '<a class="exp-book" href="#booking">Book this trip</a>' +
      '</div></div>';
    document.getElementById('expBack').addEventListener('click', expClear);
  }

  renderSidebar();
}

document.addEventListener('DOMContentLoaded', expInit);

// ========================================
// World Cup First Visit Popup
// ========================================
(function () {
  const STORAGE_KEY = 'cdmx-wc-popup-shown';
  const popup = document.getElementById('wcPopup');
  if (!popup) return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  function open() {
    popup.removeAttribute('hidden');
    // Force a frame so the transition runs from the hidden state.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        popup.classList.add('is-open');
      });
    });
    localStorage.setItem(STORAGE_KEY, '1');
  }

  function close() {
    popup.classList.remove('is-open');
    setTimeout(function () {
      popup.setAttribute('hidden', '');
    }, 320);
  }

  // Give the slideshow a beat before slipping the popup in.
  setTimeout(open, 900);

  const closeBtn = document.getElementById('wcPopupClose');
  const ctaBtn = document.getElementById('wcPopupCta');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (ctaBtn) ctaBtn.addEventListener('click', close);
})();
