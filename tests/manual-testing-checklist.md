# Manual Testing Checklist for Barbershop Application

## User Authentication

| Test Case                        | Steps                                                                                    | Expected Result                                              | Actual Result | Pass/Fail | Notes |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------- | --------- | ----- |
| Register with valid inputs       | 1. Navigate to register page<br>2. Fill in all fields with valid data<br>3. Submit form  | User account is created and user is redirected to login page |               |           |       |
| Register with existing email     | 1. Navigate to register page<br>2. Fill in email that already exists<br>3. Submit form   | Error message is displayed                                   |               |           |       |
| Login with correct credentials   | 1. Navigate to login page<br>2. Enter valid email and password<br>3. Click login button  | User is logged in and redirected to home page                |               |           |       |
| Login with incorrect credentials | 1. Navigate to login page<br>2. Enter invalid email or password<br>3. Click login button | Error message is displayed                                   |               |           |       |
| Logout functionality             | 1. Login to the application<br>2. Click logout button in navbar                          | User is logged out and redirected to login page              |               |           |       |

## Appointment Booking

| Test Case                 | Steps                                                                                            | Expected Result                                                  | Actual Result | Pass/Fail | Notes |
| ------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------- | --------- | ----- |
| View available services   | 1. Navigate to services page<br>2. Observe the list of services                                  | Services are displayed with names, prices, and durations         |               |           |       |
| Select a service          | 1. Navigate to services page<br>2. Click on a service                                            | User is redirected to barber selection page                      |               |           |       |
| Select a barber           | 1. Navigate to barber selection page<br>2. Click on a barber                                     | User is redirected to booking form                               |               |           |       |
| View available time slots | 1. Navigate to booking form<br>2. Select a date from calendar                                    | Available time slots for the selected date are displayed         |               |           |       |
| Book an appointment       | 1. Fill in booking form<br>2. Select date and time<br>3. Submit form                             | Booking is confirmed and user is redirected to confirmation page |               |           |       |
| View booked appointments  | 1. Login to the application<br>2. Navigate to appointments page                                  | User's booked appointments are displayed                         |               |           |       |
| Cancel an appointment     | 1. Navigate to appointments page<br>2. Click cancel on an appointment<br>3. Confirm cancellation | Appointment is cancelled and removed from the list               |               |           |       |

## User Profile

| Test Case               | Steps                                                                               | Expected Result                                              | Actual Result | Pass/Fail | Notes |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------- | --------- | ----- |
| View user profile       | 1. Login to the application<br>2. Navigate to profile page                          | User's profile information is displayed                      |               |           |       |
| Update user information | 1. Navigate to profile page<br>2. Edit user information<br>3. Save changes          | User information is updated and success message is displayed |               |           |       |
| Change password         | 1. Navigate to profile page<br>2. Enter current and new password<br>3. Save changes | Password is updated and success message is displayed         |               |           |       |

## Admin Functions

| Test Case                  | Steps                                                                                                     | Expected Result                                                 | Actual Result | Pass/Fail | Notes |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------- | --------- | ----- |
| Admin login                | 1. Navigate to login page<br>2. Enter admin credentials<br>3. Click login button                          | Admin is logged in and redirected to admin dashboard            |               |           |       |
| View all appointments      | 1. Login as admin<br>2. Navigate to appointments page                                                     | All appointments are displayed                                  |               |           |       |
| Manage barber availability | 1. Login as admin<br>2. Navigate to barber management<br>3. Update barber availability<br>4. Save changes | Barber availability is updated and success message is displayed |               |           |       |
| Add new service            | 1. Login as admin<br>2. Navigate to services management<br>3. Add new service<br>4. Save changes          | New service is added and displayed in the services list         |               |           |       |

## Responsive Design

| Test Case                  | Steps                                                                           | Expected Result                                        | Actual Result | Pass/Fail | Notes |
| -------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------- | --------- | ----- |
| Mobile view - Home page    | 1. Open application on mobile device or emulator<br>2. Navigate to home page    | Page displays correctly with proper layout for mobile  |               |           |       |
| Mobile view - Booking form | 1. Open application on mobile device or emulator<br>2. Navigate to booking form | Form displays correctly with proper layout for mobile  |               |           |       |
| Tablet view - Home page    | 1. Open application on tablet device or emulator<br>2. Navigate to home page    | Page displays correctly with proper layout for tablet  |               |           |       |
| Desktop view - Home page   | 1. Open application on desktop<br>2. Navigate to home page                      | Page displays correctly with proper layout for desktop |               |           |       |

## Review Functionality

| Test Case                        | Steps                                                                                                     | Expected Result                                      | Actual Result | Pass/Fail | Notes |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------- | --------- | ----- |
| Submit review with valid token   | 1. Navigate to review page with valid token<br>2. Select rating<br>3. Enter comment<br>4. Submit review   | Review is submitted and success message is displayed |               |           |       |
| Submit review with invalid token | 1. Navigate to review page with invalid token<br>2. Select rating<br>3. Enter comment<br>4. Submit review | Error message is displayed                           |               |           |       |
| View reviews                     | 1. Navigate to barber details page                                                                        | Barber's reviews are displayed                       |               |           |       |
