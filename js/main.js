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
// Flatpickr Date Range Picker
// ========================================
const daysCountEl = document.getElementById('daysCount');

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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      daysCountEl.textContent = diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' selected';
    } else {
      daysCountEl.textContent = '';
    }
  }
});

// ========================================
// Form Handling
// ========================================
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    dates: document.getElementById('dateRange').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    notes: document.getElementById('notes').value
  };

  // For now, show a confirmation message
  // Replace this with actual form submission (API, email service, etc.)
  const btn = bookingForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Request Sent!';
  btn.style.background = '#22c55e';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);

  console.log('Booking request:', formData);
});

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
const animateOnScroll = () => {
  const elements = document.querySelectorAll(
    '.step, .wc-feature, .safety-item, .driver-card'
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
// Map Explorer — Leaflet + OpenStreetMap
// ========================================
const HOME_COORDS = [19.4115, -99.1710]; // Condesa

const POI_DATA = [
  {
    id: 'teotihuacan',
    name: 'Teotihuacan Pyramids',
    coords: [19.6925, -98.8438],
    img: 'https://images.unsplash.com/photo-1586933613001-b003c20beac0?w=200&h=200&fit=crop&q=60',
    imgCard: 'https://images.unsplash.com/photo-1586933613001-b003c20beac0?w=400&h=300&fit=crop&q=80',
    driveMin: 63,
    description: 'Climb the Pyramid of the Sun and Moon at one of the most impressive ancient cities in the Americas. Arrive early to beat the crowds and walk the Avenue of the Dead in morning light.'
  },
  {
    id: 'frida',
    name: 'Frida Kahlo Museum',
    coords: [19.3550, -99.1626],
    img: 'images/museo frida kahlo.jpg',
    imgCard: 'images/museo frida kahlo.jpg',
    driveMin: 29,
    description: 'Visit Casa Azul in Coyoacán, the iconic cobalt-blue house where Frida Kahlo was born, lived, and created her art. The museum displays personal artifacts, paintings, and the lush garden courtyard.'
  },
  {
    id: 'airport',
    name: 'Airport (AICM)',
    coords: [19.4363, -99.0721],
    img: 'https://images.unsplash.com/photo-1553619948-505cc1cdc320?w=200&h=200&fit=crop&q=60',
    imgCard: 'https://images.unsplash.com/photo-1553619948-505cc1cdc320?w=400&h=300&fit=crop&q=80',
    driveMin: 23,
    description: 'Stress-free airport pickups and drop-offs at Mexico City International Airport. Skip the taxi lines and ride in comfort with your driver waiting at arrivals.'
  },
  {
    id: 'zocalo',
    name: 'Historic Center & Zócalo',
    coords: [19.4326, -99.1332],
    img: 'https://images.unsplash.com/photo-1573485905785-f8f87e7bf82c?w=200&h=200&fit=crop&q=60',
    imgCard: 'https://images.unsplash.com/photo-1573485905785-f8f87e7bf82c?w=400&h=300&fit=crop&q=80',
    driveMin: 17,
    description: 'The beating heart of Mexico City. Explore the massive cathedral, Palacio Nacional with Diego Rivera murals, and Templo Mayor — the ruins of the Aztec capital hidden in plain sight.'
  },
  {
    id: 'chapultepec',
    name: 'Chapultepec Castle',
    coords: [19.4205, -99.1818],
    img: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=200&h=200&fit=crop&q=60',
    imgCard: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&h=300&fit=crop&q=80',
    driveMin: 12,
    description: 'The only royal castle in the Americas, perched atop Chapultepec Hill with sweeping views of the city. Inside you\'ll find stunning murals, period rooms, and the National History Museum.'
  },
  {
    id: 'xochimilco',
    name: 'Xochimilco',
    coords: [19.2574, -99.1038],
    img: 'images/xochimilco.jpeg',
    imgCard: 'images/xochimilco.jpeg',
    driveMin: 45,
    description: 'Float through the ancient Aztec canals on colorful trajinera boats while mariachi bands play from passing vessels. A unique, vibrant experience you won\'t find anywhere else in the world.'
  },
  {
    id: 'vasconcelos',
    name: 'Biblioteca Vasconcelos',
    coords: [19.4439, -99.1530],
    img: 'images/Biblioteca_Vasconcelos,_Ciudad_de_México,_México,_2015-07-20,_DD_13-15_HDR.jpg',
    imgCard: 'images/Biblioteca_Vasconcelos,_Ciudad_de_México,_México,_2015-07-20,_DD_13-15_HDR.jpg',
    driveMin: 15,
    description: 'One of the most stunning modern libraries in the world. Rows of bookshelves appear to float in mid-air inside this massive steel-and-glass structure — a must-see for architecture and design lovers.'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    coords: [19.3029, -99.1505],
    img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=200&h=200&fit=crop&q=60',
    imgCard: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop&q=80',
    driveMin: 35,
    description: 'The legendary 87,000-seat stadium hosting World Cup 2026 matches. Home to two World Cup finals and countless historic moments in football history.'
  }
];

// Roma/Condesa approximate polygon
const ROMA_CONDESA_POLYGON = [
  [19.4220, -99.1830],
  [19.4220, -99.1560],
  [19.4140, -99.1520],
  [19.4020, -99.1560],
  [19.4020, -99.1780],
  [19.4100, -99.1830]
];

let explorerMap = null;
let poiMarkers = {};
let selectedStops = []; // ordered array of POI ids
let routingControl = null;
let fallbackLines = [];

function initExplorerMap() {
  const mapEl = document.getElementById('explorerMap');
  if (!mapEl) return;

  explorerMap = L.map(mapEl, {
    center: [19.42, -99.15],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // CartoDB Positron tiles (light, minimal)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(explorerMap);

  // Roma/Condesa polygon overlay
  const romaPolygon = L.polygon(ROMA_CONDESA_POLYGON, {
    color: '#000000',
    weight: 1.5,
    dashArray: '6, 6',
    fillColor: '#000000',
    fillOpacity: 0.05,
    interactive: false
  }).addTo(explorerMap);

  // Permanent label for the polygon
  romaPolygon.bindTooltip('Roma & Condesa', {
    permanent: true,
    direction: 'center',
    className: 'roma-condesa-label'
  });

  // Home marker (Condesa) — pulsing pink circle
  const homeIcon = L.divIcon({
    className: 'home-marker',
    html: '<div class="home-marker-pulse"></div><div class="home-marker-dot"></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  L.marker(HOME_COORDS, { icon: homeIcon, interactive: false })
    .addTo(explorerMap)
    .bindTooltip('Starting Point', {
      permanent: true,
      direction: 'top',
      offset: [0, -20],
      className: 'roma-condesa-label'
    });

  // POI markers with circular thumbnails
  POI_DATA.forEach(poi => {
    const icon = L.divIcon({
      className: '',
      html: '<div class="poi-marker" data-poi="' + poi.id + '" style="background-image:url(\'' + poi.img + '\')">' +
            '<span class="marker-order"></span></div>',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    const marker = L.marker(poi.coords, { icon: icon })
      .addTo(explorerMap)
      .bindTooltip(poi.name, { direction: 'top', offset: [0, -28] });

    marker.on('click', function () {
      toggleStop(poi.id);
    });

    poiMarkers[poi.id] = marker;
  });

  // Clear button
  var clearBtn = document.getElementById('clearAllBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllStops);
  }
}

function toggleStop(poiId) {
  var idx = selectedStops.indexOf(poiId);
  if (idx > -1) {
    selectedStops.splice(idx, 1);
  } else {
    selectedStops.push(poiId);
  }
  updateMarkerStates();
  updateRouteDisplay();
  updatePanel();
  renderPOICards();
}

function clearAllStops() {
  selectedStops = [];
  updateMarkerStates();
  updateRouteDisplay();
  updatePanel();
  renderPOICards();
}

function updateMarkerStates() {
  POI_DATA.forEach(function (poi) {
    var marker = poiMarkers[poi.id];
    if (!marker) return;
    var el = marker.getElement();
    if (!el) return;
    var div = el.querySelector('.poi-marker');
    if (!div) return;

    var orderIdx = selectedStops.indexOf(poi.id);
    if (orderIdx > -1) {
      div.classList.add('selected');
      var badge = div.querySelector('.marker-order');
      if (badge) badge.textContent = orderIdx + 1;
    } else {
      div.classList.remove('selected');
      var badge2 = div.querySelector('.marker-order');
      if (badge2) badge2.textContent = '';
    }
  });
}

function updatePanel() {
  var summaryBar = document.getElementById('routeSummaryBar');

  if (selectedStops.length === 0) {
    if (summaryBar) summaryBar.style.display = 'none';
    return;
  }

  if (summaryBar) summaryBar.style.display = '';

  // Calculate total drive time
  var totalTime = 0;
  selectedStops.forEach(function (id) {
    var poi = POI_DATA.find(function (p) { return p.id === id; });
    if (poi) totalTime += poi.driveMin;
  });

  // Update summary values
  var summaryStops = document.getElementById('summaryStops');
  var summaryTime = document.getElementById('summaryTime');
  if (summaryStops) summaryStops.textContent = selectedStops.length;
  if (summaryTime) {
    var hrs = Math.floor(totalTime / 60);
    var mins = totalTime % 60;
    summaryTime.textContent = hrs > 0 ? hrs + ' hr ' + mins + ' min' : totalTime + ' min';
  }
}

function moveStop(poiId, direction) {
  var idx = selectedStops.indexOf(poiId);
  if (idx === -1) return;
  var newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= selectedStops.length) return;
  // Swap
  var temp = selectedStops[newIdx];
  selectedStops[newIdx] = selectedStops[idx];
  selectedStops[idx] = temp;
  updateMarkerStates();
  updateRouteDisplay();
  updatePanel();
  renderPOICards();
}

function updateRouteDisplay() {
  // Clear existing route
  clearRouteLines();

  if (selectedStops.length === 0) return;

  // Build waypoints: Condesa -> stop1 -> stop2 -> ...
  var waypoints = [L.latLng(HOME_COORDS[0], HOME_COORDS[1])];
  selectedStops.forEach(function (id) {
    var poi = POI_DATA.find(function (p) { return p.id === id; });
    if (poi) waypoints.push(L.latLng(poi.coords[0], poi.coords[1]));
  });

  // Try Leaflet Routing Machine (OSRM) for visual route
  try {
    routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: function () { return null; },
      lineOptions: {
        styles: [
          { color: '#000000', opacity: 0.15, weight: 7 },
          { color: '#000000', opacity: 0.8, weight: 4 }
        ],
        addWaypoints: false
      }
    }).addTo(explorerMap);

    routingControl.on('routingerror', function () {
      drawFallbackLines(waypoints);
    });

    // Fit bounds to include all waypoints
    var bounds = L.latLngBounds(waypoints);
    explorerMap.fitBounds(bounds, { padding: [50, 50] });
  } catch (e) {
    drawFallbackLines(waypoints);
  }
}

function drawFallbackLines(waypoints) {
  clearRouteLines();
  for (var i = 0; i < waypoints.length - 1; i++) {
    var line = L.polyline([waypoints[i], waypoints[i + 1]], {
      color: '#000000',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.6
    }).addTo(explorerMap);
    fallbackLines.push(line);
  }
}

function clearRouteLines() {
  if (routingControl && explorerMap) {
    try { explorerMap.removeControl(routingControl); } catch (e) {}
    routingControl = null;
  }
  fallbackLines.forEach(function (line) {
    if (explorerMap) explorerMap.removeLayer(line);
  });
  fallbackLines = [];
}

// ========================================
// POI Cards
// ========================================

function renderPOICards() {
  var list = document.getElementById('poiCardList');
  if (!list) return;
  var html = '';
  POI_DATA.forEach(function (poi) {
    var isSelected = selectedStops.indexOf(poi.id) > -1;
    var orderIdx = selectedStops.indexOf(poi.id);
    var selectedClass = isSelected ? ' poi-card--selected' : '';

    html += '<div class="poi-card' + selectedClass + '" data-poi-id="' + poi.id + '">' +
      '<div class="poi-card-img-wrap"><img src="' + poi.imgCard + '" alt="' + poi.name + '" loading="lazy"></div>' +
      '<div class="poi-card-body">' +
      '<h4>' + poi.name + '</h4>' +
      '<span class="drive-badge">~' + poi.driveMin + ' min drive</span>' +
      '<p class="poi-card-desc">' + poi.description + '</p>' +
      '<div class="poi-card-actions">';

    if (isSelected) {
      html += '<span class="poi-card-order">' + (orderIdx + 1) + '</span>' +
        '<button class="poi-toggle-btn">Remove</button>' +
        '<div class="poi-reorder-btns">' +
        '<button class="poi-reorder-btn" data-dir="-1" data-poi="' + poi.id + '" title="Move up">&#9650;</button>' +
        '<button class="poi-reorder-btn" data-dir="1" data-poi="' + poi.id + '" title="Move down">&#9660;</button>' +
        '</div>';
    } else {
      html += '<button class="poi-toggle-btn">Add to Route</button>';
    }

    html += '</div></div></div>';
  });
  list.innerHTML = html;

  // Attach click handlers
  list.querySelectorAll('.poi-card').forEach(function (card) {
    var poiId = card.getAttribute('data-poi-id');
    // Clicking the card body pans the map
    card.addEventListener('click', function (e) {
      if (e.target.classList.contains('poi-toggle-btn') ||
          e.target.classList.contains('poi-reorder-btn')) return;
      var poi = POI_DATA.find(function (p) { return p.id === poiId; });
      if (poi && explorerMap) {
        explorerMap.flyTo(poi.coords, 14, { duration: 0.6 });
      }
    });
    // Toggle button
    var btn = card.querySelector('.poi-toggle-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleStop(poiId);
      });
    }
    // Reorder buttons
    card.querySelectorAll('.poi-reorder-btn').forEach(function (rb) {
      rb.addEventListener('click', function (e) {
        e.stopPropagation();
        var dir = parseInt(rb.getAttribute('data-dir'));
        var pid = rb.getAttribute('data-poi');
        moveStop(pid, dir);
      });
    });
  });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initExplorerMap();
  renderPOICards();
});

// ========================================
// Inline Content Editing
// ========================================
const STORAGE_KEY = 'cdmx-driver-edits';

// Elements that should be editable (text content only, not nav/form/buttons)
const editableSelectors = [
  '.hero h1',
  '.trust-label',
  '.trust-statement',
  '.section-title',
  '.section-subtitle',
  '.step h3',
  '.step p',
  '.world-cup-badge',
  '.wc-feature h3',
  '.wc-feature p',
  '.safety-item h3',
  '.safety-item p',
  '.driver-card h3',
  '.driver-meta',
  '.driver-card p',
  '.booking-info h3',
  '.booking-info li',
  '.booking-contact p',
  '.footer-brand h3',
  '.footer-brand p',
  '.footer-contact li',
];

let editMode = false;

// Assign a stable ID to each editable element based on selector + index
function getEditableElements() {
  const elements = [];
  editableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      const key = selector + '[' + i + ']';
      elements.push({ el, key });
    });
  });
  return elements;
}

// Load saved edits from localStorage
function loadEdits() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  const edits = JSON.parse(saved);
  getEditableElements().forEach(({ el, key }) => {
    if (edits[key] !== undefined) {
      el.innerHTML = edits[key];
    }
  });
}

// Save all current text to localStorage
function saveEdits() {
  const edits = {};
  getEditableElements().forEach(({ el, key }) => {
    edits[key] = el.innerHTML;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

// Toggle edit mode
function enableEditMode() {
  editMode = true;
  getEditableElements().forEach(({ el }) => {
    el.contentEditable = 'true';
    el.classList.add('editable');
  });
  editToggleBtn.textContent = 'Save Changes';
  editToggleBtn.style.background = '#22c55e';
  resetBtn.style.display = 'inline-block';
}

function disableEditMode() {
  editMode = false;
  saveEdits();
  getEditableElements().forEach(({ el }) => {
    el.contentEditable = 'false';
    el.classList.remove('editable');
  });
  editToggleBtn.textContent = 'Edit Content';
  editToggleBtn.style.background = '';
  resetBtn.style.display = 'none';
}

// Build the floating edit toolbar
const editToolbar = document.createElement('div');
editToolbar.id = 'editToolbar';
editToolbar.innerHTML = `
  <button id="editToggleBtn">Edit Content</button>
  <button id="resetEditsBtn" style="display:none">Reset to Original</button>
`;
document.body.appendChild(editToolbar);

const editToggleBtn = document.getElementById('editToggleBtn');
const resetBtn = document.getElementById('resetEditsBtn');

editToggleBtn.addEventListener('click', () => {
  if (editMode) {
    disableEditMode();
  } else {
    enableEditMode();
  }
});

resetBtn.addEventListener('click', () => {
  if (confirm('Reset all text to the original? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
});

// Load any previously saved edits on page load
loadEdits();
