/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// public/js/booking.js
export const bookTour = async (tourId) => {
  try {
    // doğrudan backend’den gelen anahtarı kullan
    const stripe = Stripe(window.STRIPE_PUBLIC_KEY);

    const response = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    // Updated to check for success property instead of status
    if (!response.data.success)
      throw new Error('Checkout session oluşturulamadı');

    await stripe.redirectToCheckout({
      sessionId: response.data.data.session.id,
    });
  } catch (err) {
    console.error('Booking error:', err);
    showAlert('error', err.message);
  }
};

console.log('🎟️ Public key (front):', window.STRIPE_PUBLIC_KEY);
// console.log for session is logged after request above when needed