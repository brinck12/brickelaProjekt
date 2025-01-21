# API Documentation

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### POST /login.php

Authenticates a user and returns a JWT token.

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "Keresztnev": "John",
    "Email": "user@example.com",
    "Telefonszam": "+36201234567",
    "Osztaly": "Felhasználó"
  }
}
```

#### POST /register.php

Registers a new user.

Request:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "telefonszam": "+36201234567"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful"
}
```

### User Management

#### POST /adatvaltoztatas.php

Updates user profile data.

Request:

```json
{
  "Keresztnev": "John",
  "Email": "new.email@example.com",
  "Telefonszam": "+36201234567"
}
```

Response:

```json
{
  "success": true,
  "message": "User data updated successfully"
}
```

### Appointments

#### GET /get-appointments.php

Retrieves user's appointments.

Response:

```json
{
  "success": true,
  "appointments": [
    {
      "id": 1,
      "date": "2024-03-15",
      "time": "10:00",
      "status": "Foglalt",
      "barberName": "James Wilson",
      "service": "Haircut",
      "note": "Optional note"
    }
  ]
}
```

#### POST /create-booking.php

Creates a new appointment.

Request:

```json
{
  "barberId": 1,
  "serviceId": 1,
  "date": "2024-03-15",
  "time": "10:00",
  "megjegyzes": "Optional note"
}
```

Response:

```json
{
  "success": true,
  "message": "Booking created successfully"
}
```

#### POST /check-appointments.php

Checks available time slots.

Request:

```json
{
  "barberId": 1,
  "date": "2024-03-15"
}
```

Response:

```json
{
  "success": true,
  "bookedTimes": ["10:00", "11:00"]
}
```

### Barbers and Services

#### GET /barbers.php

Retrieves list of barbers.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nev": "James Wilson",
      "kep": "james.jpg",
      "evtapasztalat": "5",
      "specializacio": "Classic Cuts",
      "reszletek": "Specializes in classic men's cuts",
      "startTime": 8,
      "endTime": 16
    }
  ]
}
```

#### GET /services.php

Retrieves available services.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Classic Haircut",
      "price": 5000,
      "duration": 30,
      "description": "Traditional men's haircut"
    }
  ]
}
```

### Reviews

#### POST /reviews.php

Retrieves reviews for a barber.

Request:

```json
{
  "barberId": 1
}
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "ertekeles": 5,
      "velemeny": "Great service!",
      "ertekelo_neve": "John Doe"
    }
  ]
}
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## CORS Configuration

All endpoints include the following CORS headers:

```php
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
