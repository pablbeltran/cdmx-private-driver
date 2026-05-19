# CDMX Private Driver

Landing page for a private driver service in Mexico City — hourly and daily
rates, an interactive route planner, and a booking form.

## Features

- Responsive single-page site (no build step)
- Interactive map route planner (Leaflet + OpenStreetMap)
- Date-range booking form (flatpickr)
- Hero background slideshow
- FIFA World Cup 2026 section

## Tech

Plain HTML, CSS, and JavaScript. Third-party libraries (Leaflet, Leaflet
Routing Machine, flatpickr) are loaded from CDNs.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Structure

```
index.html      Page markup
css/styles.css  Styles
js/main.js      Slideshow, map, booking form
images/         Local photos
```
