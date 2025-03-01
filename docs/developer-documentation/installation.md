# Installation Guide

## Prerequisites

Before installing BrickelaCuts, ensure you have the following installed:

### Required Software

- Node.js (version 16 or higher)
- PHP (version 8.0 or higher)
- MySQL/MariaDB
- Composer
- XAMPP/WAMP/MAMP

### Development Tools (Recommended)

- Visual Studio Code
- MySQL Workbench
- Postman (for API testing)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BrickelaCuts.git
cd BrickelaCuts
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Edit VITE_API_URL and other environment variables
```

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install PHP dependencies
composer install

# Create configuration file
cp config.example.php config.php

# Update database credentials in config.php
```

### 4. Database Setup

1. Create a new MySQL database:

```sql
CREATE DATABASE brickelacuts;
```

2. Import the database schema:

```bash
mysql -u your_username -p brickelacuts < database/schema.sql
```

3. (Optional) Import sample data:

```bash
mysql -u your_username -p brickelacuts < database/sample_data.sql
```

### 5. Configure Web Server

#### Using XAMPP

1. Copy the backend files to your htdocs directory
2. Configure Apache virtual host (optional)
3. Enable required PHP extensions:
   - pdo_mysql
   - json
   - mbstring
   - openssl

#### Using Built-in PHP Server

```bash
cd public
php -S localhost:8000
```

### 6. Start Development Servers

1. Start Frontend Development Server:

```bash
# In the frontend directory
npm run dev
```

2. Start Backend Server (if using built-in PHP server):

```bash
# In the backend directory
php -S localhost:8000
```

## Configuration

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=BrickelaCuts
VITE_APP_ENV=development
```

### Backend Configuration

Key settings in `config.php`:

```php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'brickelacuts');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// JWT configuration
define('JWT_SECRET', 'your_secret_key');
define('JWT_EXPIRATION', 3600);
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Verify database credentials
   - Check if MySQL service is running
   - Ensure proper permissions are set

2. **CORS Issues**

   - Check API URL in frontend .env
   - Verify CORS headers in backend
   - Clear browser cache

3. **Composer Dependencies**

   - Run `composer dump-autoload`
   - Check PHP version compatibility
   - Verify extension requirements

4. **Node Modules Issues**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Clear npm cache if needed

## Post-Installation

1. Create an admin account:

```sql
INSERT INTO users (username, email, role, password)
VALUES ('admin', 'admin@example.com', 'admin', 'hashed_password');
```

2. Verify installation:

   - Access frontend at `http://localhost:5173`
   - Test API endpoints
   - Check database connections

3. Security checklist:
   - Update default credentials
   - Set proper file permissions
   - Configure SSL if needed
   - Review security settings

## Support

For additional help:

- Check our [Troubleshooting Guide](./troubleshooting.md)
- Submit an issue on GitHub
- Contact support team
