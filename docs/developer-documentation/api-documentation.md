# API Documentation

## Overview

The BrickelaCuts API is a RESTful service that provides endpoints for managing barber shop appointments, users, and services. All endpoints return JSON responses and accept JSON payloads where applicable.

## Base URL

```
http://localhost/project/src/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Login

```http
POST /login.php

Request:
{
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "customer"
    }
}
```

#### Register

```http
POST /register.php

Request:
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+36201234567"
}

Response:
{
    "success": true,
    "message": "Registration successful"
}
```

### Appointments

#### Check Available Times

```http
POST /check-appointments.php

Request:
{
    "barberId": 1,
    "date": "2024-03-01"
}

Response:
{
    "success": true,
    "bookedTimes": ["10:00", "14:30"]
}
```

#### Create Booking

```http
POST /create-booking.php

Request:
{
    "barberId": 1,
    "serviceId": 2,
    "date": "2024-03-01",
    "time": "11:00",
    "megjegyzes": "Optional note"
}

Response:
{
    "success": true,
    "message": "Booking created successfully",
    "bookingId": 123
}
```

#### Cancel Booking

```http
GET /cancel-booking.php?token=<cancellation_token>

Response:
{
    "success": true,
    "message": "Booking cancelled successfully"
}
```

### Reviews

#### Submit Review

```http
POST /submit-review.php

Request:
{
    "token": "review_token",
    "rating": 5,
    "comment": "Great service!"
}

Response:
{
    "success": true,
    "message": "Review submitted successfully"
}
```

#### Generate Review Token

```http
GET /generate-test-tokens.php

Response:
{
    "success": true,
    "message": "Test tokens created successfully",
    "tokens": [
        {
            "token": "token_string",
            "expires_at": "2024-03-10 12:00:00",
            "booking_id": 123,
            "details": {
                "date": "2024-03-03",
                "time": "14:30",
                "barber": "Barber Name",
                "client": "Client Name"
            }
        }
    ]
}
```

### Barbers

#### Get All Barbers

```http
GET /get-barbers.php

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "details": "Expert barber with 10 years experience",
            "image": "john.jpg",
            "startTime": "9",
            "endTime": "17"
        }
    ]
}
```

#### Get Barber Services

```http
GET /get-services.php?barberId=1

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Haircut",
            "price": 5000,
            "duration": 30
        }
    ]
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP Status Codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting

Some sensitive operations (like booking cancellation and review submission) have rate limiting:

- Maximum 10 attempts per hour per IP address
- Exceeded limits return a 429 (Too Many Requests) status code

## CORS Configuration

The API allows requests from:

- http://localhost:5173 (development)
- https://yourdomain.com (production)

## Data Validation

### Appointment Times

- Must be in HH:mm format
- Must be within barber's working hours
- Cannot be in the past
- Must be available (not already booked)

### Reviews

- Rating must be between 1 and 5
- Comment is optional but limited to 500 characters
- Review token must be valid and not expired

## Testing

Use the provided test endpoints for development:

- `/generate-test-tokens.php`: Creates test review tokens
- `/test-booking.php`: Creates test bookings
- `/test-notification.php`: Tests email notifications
