# Barbershop Application Testing

This directory contains tests for the Barbershop application, including UI tests with Selenium and API tests with Postman.

## Selenium UI Tests

The `selenium` directory contains automated UI tests using Selenium WebDriver.

### Prerequisites

- Node.js and npm installed
- Chrome browser installed
- ChromeDriver installed and in your PATH

### Setup for Testing

Before running the tests, make sure:

1. The application is running at http://localhost:5173

   ```bash
   npm run dev
   ```

2. The API server is accessible at http://localhost/project/src/api
   - Make sure your XAMPP server is running
   - The PHP API files are in the correct location

### Running the Tests

To run the Selenium tests:

```bash
npm run test:selenium
```

### Current Test Status

The test suite currently includes:

- **Passing Tests**:

  - Login Tests: "should show error with invalid credentials"
  - Review Tests: "should show error with invalid token"

- **Skipped Tests** (require valid credentials or tokens):
  - Login Tests: "should login with valid credentials"
  - Review Tests: "should submit a review with a valid token"
  - Booking Tests: "should navigate through the booking process"

### Test Files

- `login.test.cjs` - Tests for user authentication
- `booking.test.cjs` - Tests for the appointment booking process
- `review.test.cjs` - Tests for the review submission functionality

For more detailed information about the Selenium tests, see the [Selenium README](./selenium/README.md).

## Postman API Tests

The `postman` directory contains API tests using Postman.

### Prerequisites

- Postman application installed

### Importing the Tests

1. Open Postman
2. Click on "Import" in the top left
3. Select the `barbershop-api-tests.postman_collection.json` file
4. Also import the `barbershop-environment.postman_environment.json` environment file

### Running the Tests

1. In Postman, select the "Barbershop Environment" from the environment dropdown
2. Open the "Barbershop API Tests" collection
3. Click the "Run" button to run all tests in the collection

### Test Endpoints

- GET Services - Tests retrieving the list of services
- GET Barbers - Tests retrieving the list of barbers
- Check Appointments - Tests checking available appointment slots
- Create Booking - Tests creating a new appointment
- Submit Review - Tests submitting a review

## Manual Testing Checklist

A manual testing checklist is available in the `manual-testing-checklist.md` file. This spreadsheet includes test cases for:

- User Authentication
- Appointment Booking
- User Profile Management
- Admin Functions

## Test Documentation

Screenshots and detailed test results should be saved in the `documentation` directory for inclusion in the final test report.
