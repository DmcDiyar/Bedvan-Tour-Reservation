/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const submitReview = async (tourId, rating, review) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: { rating, review },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Yorum gönderildi!');
      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'Yorum gönderilemedi';
    showAlert('error', msg);
  }
};



