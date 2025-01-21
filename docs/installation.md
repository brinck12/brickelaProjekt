# Installation Guide

## Prerequisites

- Node.js (v14 or higher)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- XAMPP/WAMP/MAMP
- Composer
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/brickelacuts.git
cd brickelacuts
```

## Step 2: Frontend Setup

1. Navigate to the project directory:

```bash
cd brickelacuts
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost/project/src/api
```

4. Start the development server:

```bash
npm run dev
```

## Step 3: Backend Setup

1. Install PHP dependencies:

```bash
composer install
```

2. Configure your database:

   - Create a new MySQL database named `brickelacuts`
   - Import the database schema from `database/brickelacuts.sql`

3. Configure the database connection:
   - Copy `src/api/config.example.php` to `src/api/config.php`
   - Update the database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'brickelacuts');
define('JWT_SECRET_KEY', 'your_secret_key');
```

## Step 4: Web Server Configuration

1. If using XAMPP:

   - Copy the project folder to `htdocs` directory
   - Start Apache and MySQL services
   - Access the application at `http://localhost:5173`

2. Configure CORS:
   - Update the allowed origins in PHP files if needed
   - Default configuration allows requests from `http://localhost:5173`

## Step 5: Initial Setup

1. Create an admin user:
   - Register a new user through the application
   - Update the user's role in the database:

```sql
UPDATE ugyfelek SET Osztaly = 'Admin' WHERE Email = 'your_email@example.com';
```

2. Add initial data:
   - Add barbers through the admin interface
   - Configure services and working hours

## Troubleshooting

### Common Issues

1. Database Connection Errors:

   - Verify database credentials
   - Check if MySQL service is running
   - Ensure proper database permissions

2. CORS Issues:

   - Check if the frontend URL matches the allowed origins
   - Verify CORS headers in PHP files

3. JWT Token Issues:
   - Ensure JWT_SECRET_KEY is properly set
   - Check token expiration settings

### Support

For additional help:

- Check the [issues page](https://github.com/yourusername/brickelacuts/issues)
- Contact the development team
- Review the troubleshooting guide
