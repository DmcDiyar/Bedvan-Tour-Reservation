/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { submitReview } from './reviews';
import './filters'; // Import the filters module

// Add a simple test to check if DOM is ready
console.log('Index.js loaded');

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const bookTourBtn = document.getElementById('bookTour');
const reviewForm = document.querySelector('#review-form');
const alertMessage = document.body.dataset.alert;

console.log('DOM elements initialized');
console.log('mapBox:', mapBox);
console.log('loginForm:', loginForm);
console.log('signupForm:', signupForm);

// Show alert if there's a message
if (alertMessage) showAlert('success', alertMessage, 20);

// DELEGATION
if (mapBox) {
  console.log('Map box found, initializing map');
  console.log('Map box dataset:', mapBox.dataset);
  try {
    // Check if locations data exists
    if (!mapBox.dataset.locations) {
      console.error('No locations data found in map element');
    } else {
      const locations = JSON.parse(mapBox.dataset.locations);
      console.log('Map locations:', locations);
      
      // Validate locations data
      if (!Array.isArray(locations) || locations.length === 0) {
        console.error('Invalid or empty locations data');
      } else {
        // Wait for the mapbox library to be fully loaded
        if (typeof mapboxgl !== 'undefined') {
          console.log('Mapbox GL JS is available, initializing map');
          displayMap(locations);
        } else {
          console.log('Mapbox GL JS not yet available, waiting for it to load');
          // If mapboxgl is not yet available, wait for it
          const checkMapbox = setInterval(() => {
            if (typeof mapboxgl !== 'undefined') {
              console.log('Mapbox GL JS loaded, initializing map');
              clearInterval(checkMapbox);
              displayMap(locations);
            }
          }, 100);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkMapbox);
            if (typeof mapboxgl === 'undefined') {
              console.error('Mapbox GL JS failed to load within 5 seconds');
            }
          }, 5000);
        }
      }
    }
  } catch (error) {
    console.error('Error parsing map locations:', error);
    console.error('Locations data:', mapBox.dataset.locations);
  }
} else {
  console.log('Map box NOT found');
}

// Review star rating selection
if (reviewForm) {
  const stars = reviewForm.querySelectorAll('.star-rating__star');
  const ratingInput = reviewForm.querySelector('#review-rating');
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = this.dataset.rating;
      ratingInput.value = rating;
      
      // Update star visuals
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
    
    // Add hover effect
    star.addEventListener('mouseenter', function() {
      const rating = this.dataset.rating;
      stars.forEach((s, index) => {
        if (index < rating) {
          s.style.fill = '#ff6f61';
        }
      });
    });
    
    star.addEventListener('mouseleave', function() {
      stars.forEach(s => {
        if (s.classList.contains('active')) {
          s.style.fill = '#ff6f61';
        } else {
          s.style.fill = '#e5e5e5';
        }
      });
    });
  });
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn)
  logOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn--save-password');
    btn.textContent = 'Updating...';
    btn.disabled = true;

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    try {
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );

      btn.textContent = 'Save password';
      btn.disabled = false;

      // Clear form fields
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';

      showAlert('success', 'Password updated successfully!');
    } catch (err) {
      btn.textContent = 'Save password';
      btn.disabled = false;
      showAlert('error', err.message);
    }
  });

// Handle both booking buttons
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    e.target.disabled = true;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (bookTourBtn)
  bookTourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    e.target.disabled = true;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (reviewForm)
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = reviewForm.querySelector('#submit-review');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const tourId = e.target.dataset.tourId;
    const rating = Number(document.getElementById('review-rating').value);
    const review = document.getElementById('review-text').value;

    // Validate rating
    if (rating === 0) {
      showAlert('error', 'Please select a rating');
      submitBtn.textContent = 'Submit Review';
      submitBtn.disabled = false;
      return;
    }

    try {
      await submitReview(tourId, rating, review);
      submitBtn.textContent = 'Submit Review';
      submitBtn.disabled = false;
      showAlert('success', 'Review submitted successfully!');

      // Clear form
      document.getElementById('review-rating').value = '0';
      document.getElementById('review-text').value = '';
      
      // Reset star visuals
      const stars = reviewForm.querySelectorAll('.star-rating__star');
      stars.forEach(star => {
        star.classList.remove('active');
        star.style.fill = '#e5e5e5';
      });
    } catch (err) {
      submitBtn.textContent = 'Submit Review';
      submitBtn.disabled = false;
      showAlert('error', err.message);
    }
  });

// Add animation to cards on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    // Add a staggered animation delay
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    });
  });

  // Add hover effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
  
  // Additional check for map after DOM is loaded
  setTimeout(() => {
    const delayedMapBox = document.getElementById('map');
    console.log('Delayed map check:', delayedMapBox);
    if (delayedMapBox && !mapBox) {
      console.log('Map box found on delayed check');
      const locations = JSON.parse(delayedMapBox.dataset.locations);
      displayMap(locations);
    }
  }, 1000);
});