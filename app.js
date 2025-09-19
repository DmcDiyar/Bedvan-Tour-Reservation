const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser'); // Add this line
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const securityController = require('./controllers/securityController');

const app = express();
app.use('/img', express.static(path.join(__dirname, 'dev-data', 'img')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(securityController.securityHeaders);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add cookie parser middleware
app.use(cookieParser()); // Add this line

// Limit requests from same API
app.use('/api', securityController.limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Temporarily disable security middlewares to test search functionality
// Data sanitization against NoSQL query injection
// app.use(securityController.mongoSanitize);

// Data sanitization against XSS
// app.use(securityController.xssClean);

// Prevent parameter pollution
app.use(securityController.preventParameterPollution);

// Compression middleware
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Middleware to set global variables for all views
app.use((req, res, next) => {
  // Set Stripe public key for frontend
  res.locals.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;