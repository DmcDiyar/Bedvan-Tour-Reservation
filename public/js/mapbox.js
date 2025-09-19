/* eslint-disable */
export const displayMap = (locations) => {
  console.log('Initializing map with locations:', locations);

  // Mapbox access token should be set via environment variable
  const accessToken = window.MAPBOX_TOKEN;

  if (!accessToken) {
    console.error('Mapbox access token not found.');
    return;
  }

  mapboxgl.accessToken = accessToken;
  console.log('Mapbox access token set');

  // Check if map container exists
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  console.log('Map container found:', mapContainer);

  // Initialize map with a modern, light style that matches the site's theme
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11', // Clean, modern style
    scrollZoom: false,
    center: locations[0].coordinates,
    zoom: 10,
  });

  console.log('Map initialized');

  // Add navigation controls (zoom and rotation)
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  const bounds = new mapboxgl.LngLatBounds();

  // Create an array to store coordinates for the polyline
  const routeCoordinates = [];

  locations.forEach((loc, index) => {
    console.log(`Processing location ${index}:`, loc);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
    routeCoordinates.push(loc.coordinates);

    // Create custom marker element with proper sizing
    const el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `
      <div class="marker-pin"></div>
      <div class="marker-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
        </svg>
      </div>
    `;

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup with proper sizing
    new mapboxgl.Popup({
      offset: 30,
      closeButton: true,
      className: 'map-popup',
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<div class="popup-content">
          <h3 class="popup-title">Day ${loc.day}: ${loc.description}</h3>
        </div>`,
      )
      .addTo(map);
  });

  // Fit map to bounds with appropriate padding
  map.fitBounds(bounds, {
    padding: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
    animate: true,
    duration: 1000,
  });

  // Add polyline connecting locations
  map.on('load', () => {
    console.log('Map loaded, adding route layer');

    // Check if source already exists
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    // Check if layer already exists
    if (map.getLayer('route')) {
      map.removeLayer('route');
    }

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
        'line-color': '#00BFA6',
        'line-width': 3,
        'line-opacity': 0.7,
      },
    });
  });

  console.log('Map setup complete');
};
