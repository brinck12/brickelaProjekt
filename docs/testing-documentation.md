# BrickEla Cuts - Testing Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Strategy](#testing-strategy)
3. [Test Environment Setup](#test-environment-setup)
4. [Automated Testing](#automated-testing)
   - [Selenium UI Tests](#selenium-ui-tests)
   - [Postman API Tests](#postman-api-tests)
5. [Manual Testing](#manual-testing)
6. [Test Results](#test-results)
7. [Known Issues](#known-issues)
8. [Future Testing Improvements](#future-testing-improvements)

## Introduction

This document outlines the testing approach for the BrickEla Cuts Barber Shop Management System. It covers both automated and manual testing strategies, test environment setup, and current test results.

## Testing Strategy

The testing strategy for BrickEla Cuts follows a multi-layered approach:

1. **Unit Testing**: Testing individual components and functions in isolation
2. **Integration Testing**: Testing interactions between components
3. **API Testing**: Verifying API endpoints functionality
4. **UI Testing**: Automated testing of user interfaces and workflows
5. **Manual Testing**: Human verification of features and usability

The testing pyramid is structured as follows:

```
    /\
   /  \
  /    \  Manual Testing
 /      \
/________\
\        /
 \      /  UI Testing (Selenium)
  \    /
   \__/
   /  \
  /    \  API Testing (Postman)
 /      \
/________\
\        /
 \      /  Integration Testing
  \    /
   \__/
   /  \
  /    \  Unit Testing
 /      \
/________\
```

## Test Environment Setup

### Prerequisites

- Node.js and npm installed
- Chrome browser installed
- ChromeDriver installed and in your PATH
- Postman application installed
- XAMPP, WAMP, or similar local server environment
- MySQL database with test data

### Local Development Environment

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the test database:

   ```bash
   mysql -u root -p < brickelacuts.sql
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Ensure the API server is accessible at http://localhost/project/src/api

### Test Data

The test database includes:

- Test users with different roles (admin, barber, customer)
- Sample services and barbers
- Test appointments in various states
- Sample reviews

## Automated Testing

### Selenium UI Tests

Selenium WebDriver is used for automated UI testing. These tests simulate user interactions with the application and verify that the UI behaves as expected.

#### Test Files

- `tests/selenium/login.test.cjs`: Tests user authentication
- `tests/selenium/booking.test.cjs`: Tests the appointment booking process
- `tests/selenium/review.test.cjs`: Tests the review submission functionality

#### Running Selenium Tests

To run all Selenium tests:

```bash
npm run test:selenium
```

To run a specific test file:

```bash
npm run test:selenium -- --grep "Login Tests"
npm run test:selenium -- --grep "Booking Tests"
npm run test:selenium -- --grep "Review Submission Tests"
```

#### Test Cases

##### Login Tests

1. **should login with valid credentials**

   - Navigates to the login page
   - Enters valid credentials
   - Submits the form
   - Verifies successful login

2. **should show error with invalid credentials**
   - Navigates to the login page
   - Enters invalid credentials
   - Submits the form
   - Verifies error message is displayed

##### Booking Tests

1. **should navigate through the booking process**
   - Logs in with valid credentials
   - Navigates to the services page
   - Selects a service
   - Selects a barber
   - Fills out the booking form
   - Selects a date and time
   - Submits the booking
   - Verifies booking confirmation

##### Review Tests

1. **should submit a review with a valid token**

   - Navigates to the review page with a valid token
   - Selects a rating
   - Enters a comment
   - Submits the review
   - Verifies success message

2. **should show error with invalid token**
   - Navigates to the review page with an invalid token
   - Selects a rating
   - Enters a comment
   - Submits the review
   - Verifies error message is displayed

#### Test Element Selectors

The Selenium tests rely on specific ID attributes in the HTML elements:

##### Login Page

- `id="login-page"` - Main container
- `id="login-email"` - Email input field
- `id="login-password"` - Password input field
- `id="login-submit"` - Submit button
- `id="login-error"` - Error message container

##### Service Selection

- `data-testid="service-card"` - Service card element
- `id="service-card-{serviceId}"` - Specific service card by ID

##### Barber Selection

- `.bg-barber-dark.rounded-lg` - Barber card element

##### Booking Form

- `id="booking-page"` - Main container
- `id="booking-notes"` - Notes textarea
- `id="submit-booking"` - Submit button
- `.react-calendar__tile:not(.react-calendar__tile--disabled)` - Calendar day
- `[id^="time-slot-"]` - Time slot element

##### Review Page

- `id="review-page-container"` - Main container
- `id="rating-star-1"` through `id="rating-star-5"` - Rating stars
- `id="review-comment"` - Comment textarea
- `id="submit-review-button"` - Submit button
- `id="success-message"` - Success message container
- `id="error-message"` - Error message container

### Postman API Tests

Postman is used for API testing. These tests verify that the API endpoints function correctly and return the expected responses.

#### Test Collection

The Postman test collection is located at `tests/postman/barbershop-api-tests.postman_collection.json`.

#### Environment Variables

Environment variables are defined in `tests/postman/barbershop-environment.postman_environment.json`.

#### Importing and Running Tests

1. Open Postman
2. Click on "Import" in the top left
3. Select the `barbershop-api-tests.postman_collection.json` file
4. Also import the `barbershop-environment.postman_environment.json` environment file
5. Select the "Barbershop Environment" from the environment dropdown
6. Open the "Barbershop API Tests" collection
7. Click the "Run" button to run all tests in the collection

#### API Test Cases

1. **Authentication Tests**

   - Login with valid credentials
   - Login with invalid credentials
   - Register new user
   - Verify email

2. **Service Tests**

   - Get all services
   - Get service by ID

3. **Barber Tests**

   - Get all barbers
   - Get barber by ID

4. **Booking Tests**

   - Check available appointments
   - Create booking
   - Cancel booking

5. **Review Tests**

   - Submit review
   - Get reviews

6. **User Tests**
   - Get user data
   - Update user profile

## Manual Testing

Manual testing is performed to verify features that are difficult to automate and to ensure the overall user experience is satisfactory.

### Manual Testing Checklist

A comprehensive manual testing checklist is available in `tests/manual-testing-checklist.md`. This checklist covers:

1. **User Authentication**

   - Registration
   - Login
   - Email verification
   - Profile management

2. **Appointment Booking**

   - Service selection
   - Barber selection
   - Date and time selection
   - Booking confirmation
   - Booking cancellation

3. **Review System**

   - Submitting reviews
   - Viewing reviews

4. **Admin Functions**

   - Managing barbers
   - Managing services
   - Viewing appointments

5. **Barber Functions**
   - Viewing assigned appointments
   - Managing availability

### Usability Testing

Usability testing focuses on the user experience and includes:

- Navigation flow
- Responsive design
- Accessibility
- Error handling
- Form validation
- Performance

## Test Results

### Current Test Status

#### Selenium UI Tests

| Test Case                        | Status  | Notes                                              |
| -------------------------------- | ------- | -------------------------------------------------- |
| Login with valid credentials     | Pending | Requires valid credentials                         |
| Login with invalid credentials   | Passing |                                                    |
| Navigate through booking process | Pending | Requires valid credentials and service/barber data |
| Submit review with valid token   | Pending | Requires valid token                               |
| Show error with invalid token    | Passing |                                                    |

#### Postman API Tests

| Test Case            | Status  | Notes |
| -------------------- | ------- | ----- |
| Authentication Tests | Passing |       |
| Service Tests        | Passing |       |
| Barber Tests         | Passing |       |
| Booking Tests        | Passing |       |
| Review Tests         | Passing |       |
| User Tests           | Passing |       |

#### Manual Testing

| Feature             | Status  | Notes |
| ------------------- | ------- | ----- |
| User Authentication | Passing |       |
| Appointment Booking | Passing |       |
| Review System       | Passing |       |
| Admin Functions     | Passing |       |
| Barber Functions    | Passing |       |
| Responsive Design   | Passing |       |

### Test Coverage

Current test coverage:

- **Frontend Components**: ~70%
- **API Endpoints**: ~90%
- **User Workflows**: ~80%

## Known Issues

1. **Selenium Test Dependencies**

   - Some Selenium tests are skipped because they require valid credentials or tokens
   - The booking test requires specific data-testid attributes that may not be present in all environments

2. **API Test Environment**

   - API tests require a specific database state to pass consistently
   - Some tests may fail if run multiple times due to data changes

3. **Browser Compatibility**
   - Automated tests are currently only run on Chrome
   - Manual testing is needed for other browsers

## Future Testing Improvements

1. **Expand Test Coverage**

   - Add unit tests for frontend components
   - Add integration tests for complex workflows
   - Increase API test coverage

2. **Improve Test Automation**

   - Set up continuous integration for automated testing
   - Implement test data management for consistent test environments
   - Add cross-browser testing

3. **Performance Testing**

   - Implement load testing for API endpoints
   - Add performance metrics to UI tests
   - Monitor application performance in production

4. **Security Testing**
   - Implement security scanning
   - Add penetration testing
   - Verify authentication and authorization mechanisms
