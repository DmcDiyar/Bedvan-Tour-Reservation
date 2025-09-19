# Bedvan Tour Reservation System

A modern, full-featured tour reservation system built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to browse tours, make reservations, and manage their bookings.

## Features

### User Features
- User authentication (signup, login, logout)
- Password reset via email
- Profile management
- Tour browsing with search, filter, and sort capabilities
- Interactive maps with Mapbox
- Tour booking with calendar picker
- Review system (create, edit, delete reviews)
- Booking history

### Admin Features
- Admin dashboard with statistics
- Tour management (CRUD operations)
- User management
- Booking management
- Review management
- Role-based access control

### Technical Features
- RESTful API design
- JWT-based authentication with refresh tokens
- Role-based authorization
- Input validation and sanitization
- Security headers and middleware
- Rate limiting
- XSS and NoSQL injection protection
- Password hashing with bcrypt
- Email notifications (Mailtrap integration)
- Payment processing simulation (Stripe)

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email
- Stripe for payments

### Frontend
- Pug templates for server-side rendering
- CSS3 with custom styling
- JavaScript (ES6+)
- Mapbox GL JS for interactive maps

### Security
- Helmet.js for HTTP headers
- Express rate limiting
- CORS protection
- XSS protection
- NoSQL injection protection
- Content Security Policy (CSP)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/bedvan.git
cd bedvan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp config.env.example config.env
```

Edit `config.env` with your own values:
- Database connection string
- JWT secrets
- Email configuration
- Stripe keys
- Mapbox access token

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/users/signup` - User signup
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgotPassword` - Forgot password
- `PATCH /api/v1/users/resetPassword/:token` - Reset password

### Tours
- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/search?query=...` - Search tours
- `GET /api/v1/tours/difficulty/:difficulty` - Get tours by difficulty
- `GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit` - Get tours within radius
- `GET /api/v1/tours/distances/:latlng/unit/:unit` - Get distances to tours
- `POST /api/v1/tours` - Create a new tour (admin only)
- `GET /api/v1/tours/:id` - Get a specific tour
- `PATCH /api/v1/tours/:id` - Update a tour (admin only)
- `DELETE /api/v1/tours/:id` - Delete a tour (admin only)

### Users
- `GET /api/v1/users/me` - Get current user data
- `PATCH /api/v1/users/updateMe` - Update current user data
- `DELETE /api/v1/users/deleteMe` - Delete current user
- `PATCH /api/v1/users/updateMyPassword` - Update current user password
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get a specific user (admin only)
- `PATCH /api/v1/users/:id` - Update a user (admin only)
- `DELETE /api/v1/users/:id` - Delete a user (admin only)

### Reviews
- `GET /api/v1/reviews` - Get all reviews (admin only)
- `POST /api/v1/reviews` - Create a new review
- `GET /api/v1/reviews/:id` - Get a specific review
- `PATCH /api/v1/reviews/:id` - Update a review
- `DELETE /api/v1/reviews/:id` - Delete a review

### Bookings
- `GET /api/v1/bookings/checkout-session/:tourId` - Get checkout session
- `GET /api/v1/bookings/my-bookings` - Get current user's bookings
- `POST /api/v1/bookings/create-booking` - Create a new booking
- `PATCH /api/v1/bookings/update-status/:id` - Update booking status (admin only)
- `GET /api/v1/bookings` - Get all bookings (admin only)
- `GET /api/v1/bookings/:id` - Get a specific booking
- `PATCH /api/v1/bookings/:id` - Update a booking (admin only)
- `DELETE /api/v1/bookings/:id` - Delete a booking (admin only)

## Role-Based Access Control

The application implements role-based access control with the following roles:
- **User**: Can browse tours, make bookings, and manage their profile
- **Guide**: Can manage tours they're assigned to
- **Lead Guide**: Can manage all tours
- **Admin**: Full access to all features

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication with refresh token support
- Rate limiting to prevent abuse
- Input validation and sanitization
- Security headers with Helmet.js
- XSS protection
- NoSQL injection protection
- Parameter pollution prevention
- CORS protection

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

## Testing

Unit and integration tests are implemented with Jest. To run tests:

```bash
npm test
```

## Deployment

For production deployment:

```bash
npm start
```

Make sure to set the `NODE_ENV` environment variable to `production`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Mapbox](https://www.mapbox.com/) for interactive maps
- [Stripe](https://stripe.com/) for payment processing
- [Mailtrap](https://mailtrap.io/) for email testing