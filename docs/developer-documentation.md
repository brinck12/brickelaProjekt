# BrickEla Cuts - Developer Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Setup and Installation](#setup-and-installation)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Authentication System](#authentication-system)
9. [Frontend Components](#frontend-components)
10. [State Management](#state-management)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Security Considerations](#security-considerations)
14. [Troubleshooting](#troubleshooting)
15. [Contributing Guidelines](#contributing-guidelines)

## Introduction

BrickEla Cuts is a full-stack barber shop management system built with React, TypeScript, and PHP. This documentation provides technical details for developers who want to understand, maintain, or extend the application.

## System Architecture

The application follows a client-server architecture:

- **Frontend**: React single-page application (SPA) with TypeScript
- **Backend**: PHP RESTful API
- **Database**: MySQL relational database
- **Authentication**: JWT-based token authentication

### Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │<────>│   PHP API       │<────>│  MySQL Database │
│  (TypeScript)   │      │                 │      │                 │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Technology Stack

### Frontend

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Routing**: React Router 6.22.3
- **Styling**: TailwindCSS 3.4.1
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion 12.4.7
- **HTTP Client**: Axios 1.7.9
- **Form Validation**: Zod 3.24.1
- **Date Handling**: date-fns 4.1.0, react-calendar 5.1.0
- **Build Tool**: Vite 5.4.11

### Backend

- **Language**: PHP 7.4+
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: PHPMailer

## Project Structure

```
project/
├── src/                    # Source code
│   ├── api/                # PHP API endpoints
│   │   ├── admin/          # Admin-specific endpoints
│   │   ├── cron/           # Scheduled tasks
│   │   ├── email-templates/ # Email templates
│   │   ├── middleware/     # API middleware
│   │   ├── services/       # Service-related endpoints
│   │   └── config.php      # API configuration
│   ├── components/         # React components
│   │   ├── admin/          # Admin components
│   │   ├── barber/         # Barber components
│   │   └── ui/             # UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility functions
│   ├── imgs/               # Image assets
│   ├── logs/               # Application logs
│   ├── uploads/            # User uploads
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── tests/                  # Test files
│   ├── selenium/           # Selenium UI tests
│   ├── postman/            # Postman API tests
│   └── documentation/      # Test documentation
├── public/                 # Static assets
├── dist/                   # Build output
├── scripts/                # Build and utility scripts
├── docs/                   # Documentation
├── node_modules/           # Node.js dependencies
├── vendor/                 # PHP dependencies
├── package.json            # Node.js package configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── composer.json           # PHP dependencies
└── brickelacuts.sql        # Database schema
```

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PHP 7.4+
- MySQL 5.7+
- XAMPP, WAMP, or similar local server environment

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   VITE_API_URL=http://localhost/project/src/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Configure your local server (XAMPP, WAMP, etc.) to point to the project directory.

2. Import the database schema:

   ```bash
   mysql -u root -p < brickelacuts.sql
   ```

3. Configure the API by editing `src/api/config.php`:

   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'brickelacuts');
   define('DB_USER', 'root');
   define('DB_PASSWORD', '');
   define('JWT_SECRET', 'your_secret_key');
   ```

4. Install PHP dependencies:
   ```bash
   composer install
   ```

## Database Schema

The database consists of the following main tables:

### `ugyfelek` (Customers)

- `UgyfelID` (PK): Customer ID
- `Email`: Email address
- `Jelszo`: Hashed password
- `Keresztnev`: First name
- `Vezeteknev`: Last name
- `Telefonszam`: Phone number
- `Osztaly`: User role (Admin, User, Barber)
- `EmailVerified`: Email verification status
- `VerificationToken`: Email verification token
- `RegistrationDate`: Registration date

### `fodraszok` (Barbers)

- `FodraszID` (PK): Barber ID
- `Nev`: Name
- `Email`: Email address
- `Telefonszam`: Phone number
- `Leiras`: Description
- `Kep`: Profile image path
- `Aktiv`: Active status

### `szolgaltatasok` (Services)

- `SzolgaltatasID` (PK): Service ID
- `Nev`: Service name
- `Leiras`: Description
- `Ar`: Price
- `Idotartam`: Duration in minutes
- `Kep`: Service image path
- `Aktiv`: Active status

### `foglalasok` (Appointments)

- `FoglalasID` (PK): Appointment ID
- `UgyfelID` (FK): Customer ID
- `FodraszID` (FK): Barber ID
- `SzolgaltatasID` (FK): Service ID
- `Datum`: Appointment date
- `Idopont`: Appointment time
- `Megjegyzes`: Notes
- `Allapot`: Status (Pending, Confirmed, Completed, Cancelled)
- `LetrehozasIdopontja`: Creation timestamp
- `CancellationToken`: Token for cancellation

### `ertekelesek` (Reviews)

- `ErtekelesID` (PK): Review ID
- `FoglalasID` (FK): Appointment ID
- `Ertekeles`: Rating (1-5)
- `Velemeny`: Review text
- `LetrehozasIdopontja`: Creation timestamp

### `review_tokens` (Review Tokens)

- `id` (PK): Token ID
- `token`: Unique token
- `foglalasID` (FK): Appointment ID
- `created_at`: Creation timestamp
- `expires_at`: Expiration timestamp
- `used`: Usage status

## API Documentation

### Authentication Endpoints

#### `POST /login.php`

Authenticates a user and returns a JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "Email": "user@example.com",
    "Keresztnev": "John",
    "Vezeteknev": "Doe",
    "Telefonszam": "+36123456789",
    "Osztaly": "Felhasználó",
    "UgyfelID": 1
  }
}
```

#### `POST /register.php`

Registers a new user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "telefonszam": "+36123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification."
}
```

#### `GET /verify-email.php?token={token}`

Verifies a user's email address.

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

### Booking Endpoints

#### `GET /services.php`

Returns a list of available services.

**Response:**

```json
{
  "success": true,
  "services": [
    {
      "SzolgaltatasID": 1,
      "Nev": "Haircut",
      "Leiras": "Basic haircut",
      "Ar": 3000,
      "Idotartam": 30,
      "Kep": "haircut.jpg",
      "Aktiv": 1
    }
  ]
}
```

#### `GET /barbers.php`

Returns a list of available barbers.

**Response:**

```json
{
  "success": true,
  "barbers": [
    {
      "FodraszID": 1,
      "Nev": "John Smith",
      "Email": "john@example.com",
      "Telefonszam": "+36123456789",
      "Leiras": "Experienced barber",
      "Kep": "john.jpg",
      "Aktiv": 1
    }
  ]
}
```

#### `POST /check-appointments.php`

Checks available appointment slots for a specific date, barber, and service.

**Request:**

```json
{
  "date": "2023-05-15",
  "barberId": 1,
  "serviceId": 1
}
```

**Response:**

```json
{
  "success": true,
  "availableSlots": ["09:00", "09:30", "10:00", "10:30"]
}
```

#### `POST /create-booking.php`

Creates a new appointment.

**Request:**

```json
{
  "barberId": 1,
  "serviceId": 1,
  "date": "2023-05-15",
  "time": "09:00",
  "notes": "First time visit"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "bookingId": 123
}
```

#### `GET /cancel-booking.php?token={token}`

Cancels an appointment using a cancellation token.

**Response:**

```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### Review Endpoints

#### `POST /submit-review.php`

Submits a review for a completed appointment.

**Request:**

```json
{
  "token": "review_token_here",
  "rating": 5,
  "comment": "Great service!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Review submitted successfully"
}
```

#### `GET /reviews.php`

Returns a list of reviews.

**Response:**

```json
{
  "success": true,
  "reviews": [
    {
      "ErtekelesID": 1,
      "FoglalasID": 123,
      "Ertekeles": 5,
      "Velemeny": "Great service!",
      "LetrehozasIdopontja": "2023-05-16 10:00:00",
      "BarberName": "John Smith"
    }
  ]
}
```

### User Endpoints

#### `GET /get-user-data.php`

Returns the authenticated user's data.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "Email": "user@example.com",
    "Keresztnev": "John",
    "Vezeteknev": "Doe",
    "Telefonszam": "+36123456789",
    "Osztaly": "Felhasználó",
    "UgyfelID": 1
  }
}
```

#### `POST /adatvaltoztatas.php`

Updates the user's profile information.

**Request:**

```json
{
  "Keresztnev": "John",
  "Vezeteknev": "Doe",
  "Email": "user@example.com",
  "Telefonszam": "+36123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

## Authentication System

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login Process**:

   - User submits credentials to `/login.php`
   - Server validates credentials and generates a JWT token
   - Token is returned to the client and stored in localStorage
   - Token is included in the Authorization header for subsequent requests

2. **Token Validation**:

   - Each protected API endpoint validates the JWT token
   - Invalid or expired tokens result in 401 Unauthorized responses

3. **Authentication Context**:

   - The `AuthContext` React context manages authentication state
   - Provides login, logout, and user data functions to components
   - Automatically refreshes user data when needed

4. **Protected Routes**:
   - `ProtectedRoute` component ensures users are authenticated
   - `AdminRoute` component restricts access to admin users
   - `BarberRoute` component restricts access to barber users

## Frontend Components

### Core Components

#### `App.tsx`

The main application component that sets up routing and context providers.

#### `HomePage.tsx`

The landing page component with service highlights and call-to-action buttons.

#### `Navbar.tsx`

The navigation bar component with responsive design and user menu.

### Authentication Components

#### `LoginPage.tsx`

Handles user login with form validation and error handling.

#### `RegisterPage.tsx`

Handles user registration with form validation and error handling.

#### `EmailVerification.tsx`

Verifies user email addresses using tokens.

### Booking Components

#### `ServiceSelection.tsx`

Displays available services for booking.

#### `ServiceCard.tsx`

Individual service card component with image, name, price, and description.

#### `BarberSelection.tsx`

Displays available barbers for the selected service.

#### `BarberCard.tsx`

Individual barber card component with image, name, and description.

#### `BookingForm.tsx`

Form for selecting date, time, and providing booking details.

#### `BookingConfirmation.tsx`

Confirmation page after successful booking.

#### `CancelBooking.tsx`

Handles appointment cancellation using tokens.

### User Components

#### `AccountDetails.tsx`

Displays and allows editing of user profile information.

#### `AppointmentsPage.tsx`

Displays user's appointments.

#### `AppointmentCard.tsx`

Individual appointment card with details and actions.

### Review Components

#### `ReviewPage.tsx`

Form for submitting reviews with star rating and comments.

#### `ReviewCard.tsx`

Individual review card displaying rating, comment, and user information.

### Admin Components

#### `AdminDashboard.tsx`

Dashboard for administrators with statistics and management links.

#### `ManageBarbers.tsx`

Interface for managing barbers (add, edit, delete).

#### `ManageServices.tsx`

Interface for managing services (add, edit, delete).

### Barber Components

#### `BarberDashboard.tsx`

Dashboard for barbers to view and manage their appointments.

### UI Components

#### `FormInput.tsx`

Reusable form input component with validation.

#### `PageTransition.tsx`

Wrapper component for page transition animations.

#### `NavLink.tsx`

Custom navigation link component with active state.

## State Management

The application uses React Context API for state management:

### `AuthContext`

Manages authentication state, including:

- User information
- Authentication status
- Login/logout functions
- User data refreshing

## Deployment

### Production Deployment Checklist

1. **Environment Setup**:

   - Set up a production server with LAMP stack
   - Configure domain and SSL certificates
   - Set up proper file permissions

2. **Frontend Build**:

   ```bash
   npm run build
   ```

   This creates optimized production files in the `dist` directory.

3. **Backend Configuration**:

   - Update `config.php` with production database credentials
   - Configure email settings for production
   - Set secure JWT secret

4. **Database Setup**:

   - Create production database
   - Import schema and initial data
   - Set up database backups

5. **Security Measures**:
   - Enable HTTPS
   - Set up proper CORS headers
   - Configure rate limiting
   - Set up proper error logging

## Security Considerations

### Frontend Security

1. **Authentication**:

   - JWT tokens are stored in localStorage
   - Tokens are included in Authorization headers
   - Protected routes prevent unauthorized access

2. **Input Validation**:
   - All form inputs are validated using Zod
   - XSS protection through React's built-in escaping

### Backend Security

1. **Database Security**:

   - Prepared statements prevent SQL injection
   - Password hashing using bcrypt
   - Input sanitization for all user inputs

2. **API Security**:

   - JWT validation for protected endpoints
   - Rate limiting for login attempts
   - CORS configuration to prevent unauthorized access
   - CSRF protection

3. **Email Security**:
   - Verification tokens for email confirmation
   - Secure booking cancellation tokens
   - Review submission tokens

## Troubleshooting

### Common Issues

#### API Connection Issues

- Check that the API URL is correctly configured in `.env`
- Verify CORS headers are properly set in `cors_headers.php`
- Check for network errors in the browser console

#### Database Connection Issues

- Verify database credentials in `config.php`
- Check that the MySQL server is running
- Verify table structure matches the expected schema

#### Authentication Issues

- Clear localStorage and try logging in again
- Check JWT token expiration settings
- Verify that the JWT secret is consistent

## Contributing Guidelines

### Code Style

- Follow the existing code style and structure
- Use TypeScript for all new frontend code
- Document all functions and components
- Write meaningful commit messages

### Development Workflow

1. Create a feature branch from `main`
2. Implement and test your changes
3. Write or update tests as needed
4. Submit a pull request with a clear description
5. Address any review comments

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if necessary
3. Get approval from at least one reviewer
4. Merge into the main branch
