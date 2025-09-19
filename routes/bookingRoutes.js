const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.route('/my-bookings').get(bookingController.getMyBookings);

router.route('/create-booking').post(
  authController.restrictTo('user'),
  bookingController.createBooking
);

router.route('/update-status/:id').patch(
  authController.restrictTo('admin', 'lead-guide'),
  bookingController.updateBookingStatus
);

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.getAllBookings
  )
  .post(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.createBooking
  );

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.updateBooking
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.deleteBooking
  );

module.exports = router;