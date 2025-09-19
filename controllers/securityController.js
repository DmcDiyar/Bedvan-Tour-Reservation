const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Rate limiting
exports.limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Rate limiting for login attempts
exports.loginLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: 'Too many login attempts, please try again in 15 minutes!',
});

// Security headers (CSP dahil)
exports.securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://js.stripe.com',
        'https://api.mapbox.com',
        'blob:',
      ],
      workerSrc: [
        "'self'",
        'blob:',
        'https://m.stripe.network',
        'https://b.stripecdn.com',
      ],
      frameSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.stripe.com',
        'https://m.stripe.network',
        'https://b.stripecdn.com',
      ],
      connectSrc: [
        "'self'",
        'https://api.stripe.com',
        'https://m.stripe.network',
        'https://api.mapbox.com',
        'https://r.stripe.com',
        'https://events.mapbox.com', // Add this line to fix CSP error
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
        'https://cdnjs.cloudflare.com',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
      ],
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
  },
});

// Data sanitization
exports.mongoSanitize = mongoSanitize({ allowDots: true, replaceWith: '_' });
exports.xssClean = xss();

// Prevent parameter pollution
exports.preventParameterPollution = hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price',
  ],
});

// Enable CORS
exports.cors = cors();