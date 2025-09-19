const Booking = require('./../models/bookingModel');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIResponse = require('./../utils/apiResponse');

// Add Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // 2) Create checkout session with updated API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json(
    APIResponse.success(
      {
        session
      },
      'Checkout session created successfully',
      200
    )
  );
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { tour, startDate, endDate } = req.body;
  
  // Get tour to get the price
  const tourDoc = await Tour.findById(tour);
  if (!tourDoc) {
    return next(new AppError('No tour found with that ID', 404));
  }
  
  const booking = await Booking.create({
    tour,
    user: req.user.id,
    price: tourDoc.price,
    startDate,
    endDate
  });
  
  res.status(201).json(
    APIResponse.success(
      {
        data: booking
      },
      'Booking created successfully',
      201
    )
  );
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  
  res.status(200).json(
    APIResponse.success(
      {
        results: bookings.length,
        data: bookings
      },
      'User bookings retrieved successfully',
      200
    )
  );
});

exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  res.status(200).json(
    APIResponse.success(
      {
        data: booking
      },
      'Booking status updated successfully',
      200
    )
  );
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);