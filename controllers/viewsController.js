const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Build query based on filters
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Tour.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Execute query
  const tours = await query;

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    user: res.locals.user || null,
  });
});

exports.getAbout = (req, res) => {
  res.status(200).render('about', {
    title: 'About Bedvan Tours',
    user: res.locals.user || null,
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    user: res.locals.user || null,
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    user: res.locals.user || null,
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
    user: res.locals.user || null,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: res.locals.user || null,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
    user: res.locals.user || null,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser || res.locals.user || null,
  });
});

// Add search results handler
exports.getSearchResults = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.redirect('/');
  }

  // Build search query
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'startLocation.description': { $regex: query, $options: 'i' } },
      { 'locations.description': { $regex: query, $options: 'i' } },
    ],
  };

  // Apply additional filters if present
  const queryObj = { ...req.query };
  delete queryObj.query; // Remove the search query from filters
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Combine search and filters
  const finalQuery = { ...searchQuery, ...queryObj };

  // Build Mongoose query
  let mongooseQuery = Tour.find(finalQuery);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  }

  // Execute query
  const tours = await mongooseQuery;

  res.status(200).render('searchResults', {
    title: `Search Results for "${query}"`,
    tours,
    query,
    user: res.locals.user || null,
  });
});