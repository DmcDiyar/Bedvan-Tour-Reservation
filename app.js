const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.use('/img', express.static(path.join(__dirname, 'dev-data', 'img')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files

// Set security HTTP headers
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Not supported' });
});
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      // Stripe.js + inline script + blob worker’lar
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://js.stripe.com',
        'https://api.mapbox.com',
        'blob:', // ← blob URL’lerinden gelen script’lere izin
      ],

      workerSrc: [
        "'self'",
        'blob:', // ← blob-URL worker’larını kabul et
        'https://m.stripe.network',
        'https://b.stripecdn.com', // ← Stripe CDN’den gelen worker’lara izin
      ],

      frameSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.stripe.com',
        'https://m.stripe.network',
        'https://b.stripecdn.com', // ← Stripe’ın HCaptcha iframe’ine izin
      ],

      connectSrc: [
        "'self'",
        'https://api.stripe.com',
        'https://m.stripe.network',
        'https://api.mapbox.com',
        'https://r.stripe.com',
        'ws://localhost:*',
        'ws://127.0.0.1:*',
        'ws:',
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://api.mapbox.com',
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
      ],

      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],

      imgSrc: [
        "'self'",
        'data:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://m.stripe.network',
        'https://r.stripe.com',
      ],

      childSrc: ["'self'", 'blob:'],
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL operator injection (Express 5-safe)
function sanitizeInPlace(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      sanitizeInPlace(value[i]);
    }
    return;
  }
  Object.keys(value).forEach((key) => {
    const hasDollar = key.includes('$');
    const hasDot = key.includes('.');
    if (hasDollar || hasDot) {
      delete value[key];
      return;
    }
    sanitizeInPlace(value[key]);
  });
}

app.use((req, res, next) => {
  if (req.body) sanitizeInPlace(req.body);
  if (req.params) sanitizeInPlace(req.params);
  if (req.query) sanitizeInPlace(req.query);
  next();
});


// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
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
