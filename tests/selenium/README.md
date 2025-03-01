# Selenium UI Tests

This directory contains automated UI tests using Selenium WebDriver for the Barbershop application.

## Prerequisites

- Node.js and npm installed
- Chrome browser installed
- ChromeDriver installed and in your PATH

## Setup for Testing

Before running the tests, make sure:

1. The application is running at http://localhost:5173

   ```bash
   npm run dev
   ```

2. The API server is accessible at http://localhost/project/src/api
   - Make sure your XAMPP server is running
   - The PHP API files are in the correct location

## Router Configuration

The application uses React Router's `BrowserRouter` for client-side routing. This means URLs do not contain hash symbols (#) and look like:

- http://localhost:5173/login
- http://localhost:5173/review
- http://localhost:5173/booking

## Running the Tests

To run the Selenium tests:

```bash
npm run test:selenium
```

To run a specific test file:

```bash
npm run test:selenium -- --grep "Login Tests"
npm run test:selenium -- --grep "Booking Tests"
npm run test:selenium -- --grep "Review Submission Tests"
```

## Current Test Status

The test suite currently includes:

- **Passing Tests**:

  - Login Tests: "should show error with invalid credentials"
  - Review Tests: "should show error with invalid token"

- **Skipped Tests** (require valid credentials or tokens):
  - Login Tests: "should login with valid credentials"
  - Review Tests: "should submit a review with a valid token"
  - Booking Tests: "should navigate through the booking process"

To enable the skipped tests, you would need to:

1. Remove the `this.skip()` line
2. Uncomment the test code
3. Provide valid credentials and ensure the application has the necessary data (services, barbers, etc.)

## Making the Booking Test Work

The booking test requires several components to be in place:

1. **Valid login credentials**: Update the credentials in the login function
2. **Service Cards with correct data-testid**: Make sure your ServiceCard component includes:

   ```jsx
   <div data-testid="service-card">
   ```

3. **Barber Selection Elements**: The test is looking for barber cards with the selector:

   ```
   .bg-barber-dark.rounded-lg
   ```

   If your barber cards have a different structure, update the selector in the test.

4. **Booking Form Elements**: Make sure all form elements have the correct IDs:

   - `id="booking-page"`
   - `id="booking-notes"`
   - `id="submit-booking"`

5. **Calendar & Time Slots**: Your calendar and time slots must have the correct structure:

   - Calendar days: `.react-calendar__tile:not(.react-calendar__tile--disabled)`
   - Time slots: `[id^="time-slot-"]`

6. **Confirmation Page**: The booking confirmation page should include:
   - `.booking-confirmation` element

## Test Files

- `login.test.cjs` - Tests for user authentication
- `booking.test.cjs` - Tests for the appointment booking process
- `review.test.cjs` - Tests for the review submission functionality

## Notes on Test IDs

The tests rely on specific ID attributes in the HTML elements. Make sure your components have the following IDs:

### Service Cards

- `data-testid="service-card"` - For selecting any service card
- `id="service-card-{serviceId}"` - For selecting a specific service card by ID
- `id="service-image-container-{serviceId}"` - For the image container within a service card

You can select service cards in tests using:

```javascript
// Select any service card:
const serviceCard = await driver.findElement(
  By.css("[data-testid='service-card']")
);

// Select a specific service card by ID (e.g., service with ID 1):
const specificServiceCard = await driver.findElement(By.id("service-card-1"));

// Select all service cards and use the first one:
const serviceCards = await driver.findElements(
  By.css("[data-testid='service-card']")
);
await serviceCards[0].click();
```

### Login Page

- `id="login-page"` - Main container
- `id="login-email"` - Email input field
- `id="login-password"` - Password input field
- `id="login-submit"` - Submit button
- `id="login-error"` - Error message container

### Booking Page

- `id="booking-page"` - Main container
- `id="back-button"` - Back navigation button
- `id="booking-form-container"` - Form container
- `id="booking-title"` - Title of the booking form
- `id="booking-loading"` - Loading indicator
- `id="booking-form"` - Form element
- `id="booking-name"` - Name input field
- `id="booking-email"` - Email input field
- `id="booking-phone"` - Phone input field
- `id="booking-notes"` - Notes textarea
- `id="date-time-heading"` - Date and time selection heading
- `id="calendar-container"` - Calendar component
- `id="time-slots-container"` - Available time slots section
- `id="submit-booking"` - Submit button

### Review Page

- `id="review-page-container"` - Main container
- `id="rating-star-1"` through `id="rating-star-5"` - Rating stars
- `id="review-comment"` - Comment textarea
- `id="submit-review-button"` - Submit button
- `id="success-message"` - Success message container
- `id="error-message"` - Error message container

## Troubleshooting

If tests are failing, check:

1. The application is running at the correct URL
2. The API server is accessible
3. The HTML elements have the correct ID attributes
4. The test selectors match your actual component structure
5. You have valid data in your database (services, barbers, available time slots)
