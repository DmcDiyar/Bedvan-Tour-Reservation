/* eslint-disable */
export const displayMap = (locations) => {
  // Mapbox access token should be set via environment variable
  // For development, you can set it in your browser console: window.MAPBOX_TOKEN = 'your_token'
  const accessToken = window.MAPBOX_TOKEN || 'pk.eyJ1Ijoiam9uYXNzY2hmZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';
  
  if (!accessToken) {
    console.error('Mapbox access token not found. Please set window.MAPBOX_TOKEN in your browser console.');
    return;
  }

  mapboxgl.accessToken = accessToken;

  // Initialize map with a modern, light style that matches the site's theme
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11', // Clean, modern style
    scrollZoom: false,
  });

  // Add navigation controls (zoom and rotation)
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  const bounds = new mapboxgl.LngLatBounds();

  // Create an array to store coordinates for the polyline
  const routeCoordinates = [];

  locations.forEach((loc, index) => {
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
    routeCoordinates.push(loc.coordinates);

    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundColor = 'var(--secondary-color)'; // #55c57a
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid var(--white)';
    el.style.boxShadow = 'var(--shadow-sm)';
    el.style.cursor = 'pointer';
    el.style.transition = 'transform 0.3s ease';
    // Add hover effect
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // Add marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup with animation
    const popup = new mapboxgl.Popup({
      offset: 20,
      closeButton: false,
      className: 'custom-popup',
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `
        <div class="popup-content">
          <h3>Day ${loc.day}: ${loc.description}</h3>
          <p>Click for weather info</p>
        </div>
      `,
      )
      .addTo(map);

    // Optional: Add weather info on click (placeholder)
    marker.getElement().addEventListener('click', async () => {
      // Placeholder for weather API integration
      // Example: Fetch weather data using OpenWeatherMap or similar
      popup.setHTML(`
        <div class="popup-content">
          <h3>Day ${loc.day}: ${loc.description}</h3>
          <p>Weather: Fetching weather data is not implemented.</p>
          <p>Use an API like OpenWeatherMap with coords: ${loc.coordinates}</p>
        </div>
      `);
    });
  });

  // Fit map to bounds with padding
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

  // Add polyline connecting locations
  map.on('load', () => {
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      },
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'var(--primary-color)', // #0071eb
        'line-width': 4,
        'line-opacity': 0.7,
      },
    });

    // Animate the polyline drawing
    let progress = 0;
    const totalLength = routeCoordinates.length;
    const animateLine = () => {
      if (progress < totalLength - 1) {
        progress += 0.05;
        const partialCoords = routeCoordinates.slice(0, Math.ceil(progress));
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: partialCoords,
          },
        });
        requestAnimationFrame(animateLine);
      }
    };
    requestAnimationFrame(animateLine);
  });
};
