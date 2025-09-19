// Debug script to test Mapbox functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Map debug script loaded');
  
  // Check if map container exists
  const mapElement = document.getElementById('map');
  console.log('Map element:', mapElement);
  
  if (mapElement) {
    console.log('Map element dataset:', mapElement.dataset);
    
    // Check if locations data exists
    if (mapElement.dataset.locations) {
      try {
        const locations = JSON.parse(mapElement.dataset.locations);
        console.log('Parsed locations:', locations);
        
        // Check if Mapbox library is loaded
        if (typeof mapboxgl !== 'undefined') {
          console.log('Mapbox GL JS is loaded');
          console.log('Mapbox version:', mapboxgl.version);
        } else {
          console.error('Mapbox GL JS is NOT loaded');
        }
      } catch (e) {
        console.error('Error parsing locations:', e);
      }
    } else {
      console.log('No locations data in map element');
    }
  } else {
    console.log('Map element not found');
  }
});