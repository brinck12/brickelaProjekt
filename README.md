# BrickEla Cuts - Barber Shop Management System

A modern, full-stack booking system for barber shops built with React, TypeScript, and PHP.

## Features

- 🔐 Secure user authentication with email verification
- 📅 Advanced appointment booking system
- 💈 Barber and service management
- 📧 Automated email notifications
- 📱 Responsive design
- 👥 Role-based access control (Admin, Barber, Customer)
- 📊 Dashboard with analytics
- 🔄 Appointment cancellation system

## Tech Stack

- **Frontend:**

  - React with TypeScript
  - TailwindCSS for styling
  - Framer Motion for animations
  - Axios for API communication

- **Backend:**
  - PHP 7.4+
  - MySQL Database
  - JWT for authentication
  - PHPMailer for email handling

## Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install frontend dependencies

```bash
cd frontend
npm install
```

3. Set up the database

- Import the `brickelacuts.sql` file to your MySQL server
- Configure database connection in `.env`

4. Configure environment variables
   Create `.env` file in the root directory:

```env
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET_KEY=your_secret_key

SMTP_HOST=your_smtp_host
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_PORT=587
```

5. Start the development server

```bash
# Frontend
npm run dev

# Backend
# Ensure your PHP server is running and pointing to the /src/api directory
```

## Security Features

- SQL injection protection with prepared statements
- XSS protection
- CSRF protection
- Rate limiting for login attempts
- Secure password hashing
- JWT-based authentication
- Email verification
- Secure booking cancellation tokens

## Customization

The system can be customized for specific client needs:

- Branding (colors, logos, themes)
- Service types and pricing
- Email templates
- Booking rules and restrictions
- Language localization

## Production Deployment

Before deploying to production:

1. Set up proper SSL certificates
2. Configure proper email service (e.g., SendGrid, Amazon SES)
3. Set up proper database backups
4. Configure proper error logging
5. Set up monitoring
6. Implement proper caching strategies

## License

[Your chosen license]

## Support

For support, please contact [your contact information]
