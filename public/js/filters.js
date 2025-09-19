/* eslint-disable */
// Filter functionality for tour overview and search results pages

document.addEventListener('DOMContentLoaded', () => {
  const difficultyFilter = document.getElementById('difficultyFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetFiltersBtn = document.getElementById('resetFilters');
  const tourContainer = document.getElementById('tourContainer');

  // Only run this code on pages with filters
  if (!difficultyFilter || !sortFilter) return;

  // Get current URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Set initial filter values from URL if present
  if (urlParams.has('difficulty')) {
    difficultyFilter.value = urlParams.get('difficulty');
  }

  if (urlParams.has('sort')) {
    sortFilter.value = urlParams.get('sort');
  }

  // Apply filters when they change
  difficultyFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);

  // Reset filters
  resetFiltersBtn.addEventListener('click', () => {
    difficultyFilter.value = '';
    sortFilter.value = 'price';
    applyFilters();
  });

  function applyFilters() {
    // Get current filter values
    const difficulty = difficultyFilter.value;
    const sort = sortFilter.value;

    // Build query parameters
    const params = new URLSearchParams();

    // Add search query if present (for search results page)
    if (urlParams.has('query')) {
      params.set('query', urlParams.get('query'));
    }

    // Add filters
    if (difficulty) {
      params.set('difficulty', difficulty);
    }

    if (sort) {
      params.set('sort', sort);
    }

    // For overview page, use client-side filtering
    if (window.location.pathname === '/') {
      filterToursClientSide(difficulty, sort);
    }
    // For search results page, reload with new parameters
    else if (window.location.pathname === '/search') {
      const newUrl = `/search?${params.toString()}`;
      window.location.href = newUrl;
    }
  }

  async function filterToursClientSide(difficulty, sort) {
    try {
      // Build API query
      const params = new URLSearchParams();

      if (difficulty) {
        params.set('difficulty', difficulty);
      }

      if (sort) {
        params.set('sort', sort);
      }

      // Make API call to filter tours using the correct endpoint
      const response = await fetch(`/api/v1/tours?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        renderTours(result.data.data);
      }
    } catch (error) {
      console.error('Error filtering tours:', error);
    }
  }

  function renderTours(tours) {
    if (!tourContainer) return;

    if (tours.length === 0) {
      tourContainer.innerHTML =
        '<div class="no-results"><h2>No tours found matching your filters</h2><p>Try adjusting your filters</p></div>';
      return;
    }

    let html = '';
    tours.forEach((tour) => {
      html += `
        <div class="card">
          <div class="card__header">
            <div class="card__picture">
              <div class="card__picture-overlay">&nbsp;</div>
              <img class="card__picture-img" src="/img/tours/${tour.imageCover}" alt="${tour.name}">
            </div>
            <div class="card__badges">
              <span class="badge badge--${tour.difficulty}">${tour.difficulty}</span>
            </div>
            <h3 class="card__title">
              <span>${tour.name}</span>
            </h3>
          </div>
          
          <div class="card__details">
            <div class="card__location">
              <i class="fas fa-map-marker-alt card__icon"></i>
              <span>${tour.startLocation.description}</span>
            </div>
            <div class="card__duration">
              <i class="fas fa-calendar card__icon"></i>
              <span>${tour.duration} days</span>
            </div>
            <div class="card__group-size">
              <i class="fas fa-users card__icon"></i>
              <span>${tour.maxGroupSize} people</span>
            </div>
            <div class="card__rating">
              <div class="stars">`;

      // Generate star ratings
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(tour.ratingsAverage)) {
          html += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= tour.ratingsAverage) {
          html += '<i class="fas fa-star-half-alt"></i>';
        } else {
          html += '<i class="far fa-star"></i>';
        }
      }

      html += `
              </div>
              <span class="card__rating-value">${tour.ratingsAverage}</span>
              <span class="card__rating-count">(${tour.ratingsQuantity})</span>
            </div>
          </div>
          
          <div class="card__footer">
            <div class="card__price">
              <span class="card__price-value">$${tour.price}</span>
              <span class="card__price-text">per person</span>
            </div>
            <a href="/tour/${tour.slug}" class="btn btn--primary btn--small">View Details</a>
          </div>
        </div>
      `;
    });

    tourContainer.innerHTML = html;
  }
});
