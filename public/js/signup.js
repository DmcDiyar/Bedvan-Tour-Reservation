import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  console.log('Signup function called with:', {
    name,
    email,
    password,
    passwordConfirm,
  }); // Debugging
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log('Response:', res.data); // Debugging
    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message); // Debugging
    showAlert('error', err.response?.data?.message || 'Something went wrong');
  }
};
