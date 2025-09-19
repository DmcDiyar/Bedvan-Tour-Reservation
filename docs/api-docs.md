# Bedvan Tour Reservation System API Documentation

## Authentication

### User Signup
**POST** `/api/v1/users/signup`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "5f9d88d8f3b4b000150b6d8f",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Authentication successful"
}
```

### User Login
**POST** `/api/v1/users/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "5f9d88d8f3b4b000150b6d8f",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Authentication successful"
}
```

### Refresh Token
**POST** `/api/v1/users/refresh-token`

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

### Logout
**GET** `/api/v1/users/logout`

Response:
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

## Tours

### Get All Tours
**GET** `/api/v1/tours`

Query Parameters:
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page
- `sort` (string): Sort field (e.g., "price", "-price" for descending)
- `fields` (string): Comma-separated list of fields to include

Response:
```json
{
  "success": true,
  "data": {
    "results": 10,
    "data": [
      {
        "id": "5f9d88d8f3b4b000150b6d90",
        "name": "The Forest Hiker",
        "duration": 5,
        "maxGroupSize": 25,
        "difficulty": "easy",
        "ratingsAverage": 4.7,
        "ratingsQuantity": 32,
        "price": 397,
        "summary": "Breathtaking hike through the Canadian Banff National Park",
        "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "imageCover": "tour-1-cover.jpg",
        "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
        "startDates": ["2021-04-25T09:00:00.000Z", "2021-07-20T09:00:00.000Z", "2021-10-05T09:00:00.000Z"],
        "slug": "the-forest-hiker",
        "startLocation": {
          "type": "Point",
          "coordinates": [-114.987793, 51.179048],
          "address": "Banff National Park, Alberta, Canada",
          "description": "Banff National Park, Canada"
        },
        "locations": [
          {
            "type": "Point",
            "coordinates": [-115.09203, 51.154787],
            "address": "Banff National Park, Canada",
            "description": "Hiking to Lake Louise",
            "day": 1
          }
        ],
        "guides": ["5c8a1dfa2f8fb814b56fa181", "5c8a1e1a2f8fb814b56fa182"]
      }
    ]
  },
  "message": "Tours retrieved successfully"
}
```

### Search Tours
**GET** `/api/v1/tours/search?query=forest`

Response:
```json
{
  "success": true,
  "data": {
    "results": 1,
    "data": [
      {
        "id": "5f9d88d8f3b4b000150b6d90",
        "name": "The Forest Hiker",
        // ... tour data
      }
    ]
  },
  "message": "Search results retrieved successfully"
}
```

### Get Tours by Difficulty
**GET** `/api/v1/tours/difficulty/easy`

Response:
```json
{
  "success": true,
  "data": {
    "results": 5,
    "data": [
      // ... array of easy tours
    ]
  },
  "message": "Tours with easy difficulty retrieved successfully"
}
```

### Get Tours Within Radius
**GET** `/api/v1/tours/tours-within/200/center/51.179048,-114.987793/unit/mi`

Response:
```json
{
  "success": true,
  "data": {
    "results": 3,
    "data": [
      // ... array of tours within 200 miles
    ]
  },
  "message": "Tours within radius retrieved successfully"
}
```

### Get Distances to Tours
**GET** `/api/v1/tours/distances/51.179048,-114.987793/unit/mi`

Response:
```json
{
  "success": true,
  "data": {
    "results": 10,
    "data": [
      {
        "distance": 0,
        "name": "The Forest Hiker"
      },
      {
        "distance": 12.5,
        "name": "The Sea Explorer"
      }
    ]
  },
  "message": "Distances calculated successfully"
}
```

## Bookings

### Create Booking
**POST** `/api/v1/bookings/create-booking`

Request Body:
```json
{
  "tour": "5f9d88d8f3b4b000150b6d90",
  "startDate": "2021-04-25T09:00:00.000Z",
  "endDate": "2021-04-30T09:00:00.000Z"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "5f9d88d8f3b4b000150b6d91",
      "tour": "5f9d88d8f3b4b000150b6d90",
      "user": "5f9d88d8f3b4b000150b6d8f",
      "price": 397,
      "paid": true,
      "status": "pending",
      "createdAt": "2020-10-31T12:00:00.000Z",
      "startDate": "2021-04-25T09:00:00.000Z",
      "endDate": "2021-04-30T09:00:00.000Z"
    }
  },
  "message": "Booking created successfully"
}
```

### Get My Bookings
**GET** `/api/v1/bookings/my-bookings`

Response:
```json
{
  "success": true,
  "data": {
    "results": 2,
    "data": [
      {
        "id": "5f9d88d8f3b4b000150b6d91",
        "tour": {
          "id": "5f9d88d8f3b4b000150b6d90",
          "name": "The Forest Hiker"
        },
        "user": "5f9d88d8f3b4b000150b6d8f",
        "price": 397,
        "paid": true,
        "status": "confirmed",
        "createdAt": "2020-10-31T12:00:00.000Z",
        "startDate": "2021-04-25T09:00:00.000Z",
        "endDate": "2021-04-30T09:00:00.000Z"
      }
    ]
  },
  "message": "User bookings retrieved successfully"
}
```

## Reviews

### Create Review
**POST** `/api/v1/reviews`

Request Body:
```json
{
  "tour": "5f9d88d8f3b4b000150b6d90",
  "review": "This was an amazing tour! Highly recommended.",
  "rating": 5
}
```

Response:
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "5f9d88d8f3b4b000150b6d92",
      "tour": "5f9d88d8f3b4b000150b6d90",
      "user": {
        "id": "5f9d88d8f3b4b000150b6d8f",
        "name": "John Doe",
        "photo": "user-1.jpg"
      },
      "review": "This was an amazing tour! Highly recommended.",
      "rating": 5,
      "createdAt": "2020-10-31T12:00:00.000Z"
    }
  },
  "message": "Review created successfully"
}
```

### Get My Reviews
**GET** `/api/v1/reviews/my-reviews`

Response:
```json
{
  "success": true,
  "data": {
    "results": 3,
    "data": [
      {
        "id": "5f9d88d8f3b4b000150b6d92",
        "tour": {
          "id": "5f9d88d8f3b4b000150b6d90",
          "name": "The Forest Hiker"
        },
        "user": {
          "id": "5f9d88d8f3b4b000150b6d8f",
          "name": "John Doe",
          "photo": "user-1.jpg"
        },
        "review": "This was an amazing tour! Highly recommended.",
        "rating": 5,
        "createdAt": "2020-10-31T12:00:00.000Z"
      }
    ]
  },
  "message": "User reviews retrieved successfully"
}
```

### Update My Review
**PATCH** `/api/v1/reviews/:id`

Request Body:
```json
{
  "review": "This was an amazing tour! Highly recommended. Updated review.",
  "rating": 4
}
```

Response:
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "5f9d88d8f3b4b000150b6d92",
      "tour": "5f9d88d8f3b4b000150b6d90",
      "user": {
        "id": "5f9d88d8f3b4b000150b6d8f",
        "name": "John Doe",
        "photo": "user-1.jpg"
      },
      "review": "This was an amazing tour! Highly recommended. Updated review.",
      "rating": 4,
      "createdAt": "2020-10-31T12:00:00.000Z"
    }
  },
  "message": "Review updated successfully"
}
```

### Delete My Review
**DELETE** `/api/v1/reviews/:id`

Response:
```json
{
  "success": true,
  "data": null,
  "message": "Review deleted successfully"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "data": null,
  "message": "Error message here"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error