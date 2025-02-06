<?php
// Load environment variables
$env = parse_ini_file(__DIR__ . '/.env');

if ($env === false) {
    die('Error loading .env file');
}

// Database configuration
$host = $env['DB_HOST'];
$dbname = $env['DB_NAME'];
$username = $env['DB_USER'];
$password = $env['DB_PASSWORD'];

$conn = mysqli_connect($host, $username, $password, $dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// JWT configuration
define('JWT_SECRET_KEY', $env['JWT_SECRET_KEY']);

// Set secure headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// SMTP configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'sziateszeplany@gmail.com');
define('SMTP_PASSWORD', 'fbnijximdfiywsnz');
define('SMTP_PORT', 587);

// Set timezone
date_default_timezone_set('Europe/Budapest');
?> 