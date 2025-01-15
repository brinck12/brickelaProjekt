<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php'; // Database configuration and connection

// Parse JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check database connection
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Input validation
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    if (strlen($data['password']) < 8) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
        exit;
    }

    if (empty($data['name']) || strlen($data['name']) < 2) {
        echo json_encode(['success' => false, 'message' => 'Name is required and must be at least 2 characters']);
        exit;
    }

    if (empty($data['telefonszam']) || !preg_match('/^[0-9+\-\s()]{6,20}$/', $data['telefonszam'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid phone number format']);
        exit;
    }

    // Prepare data
    $name = $data['name'];
    $name_parts = explode(' ', $name);
    $vezeteknev = $name_parts[0];
    $keresztnev = isset($name_parts[1]) ? $name_parts[1] : '';
    $email = $data['email'];
    $telefonszam = $data['telefonszam'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $osztaly = 'Felhasználó';
    $regisztracioIdopontja = date('Y-m-d H:i:s');

    // Check if email already exists using prepared statement
    $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $emailCheckResult = $stmt->get_result();
    if ($emailCheckResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email is already registered']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Check if phone number already exists using prepared statement
    $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Telefonszam = ?");
    $stmt->bind_param("s", $telefonszam);
    $stmt->execute();
    $phoneCheckResult = $stmt->get_result();
    if ($phoneCheckResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number is already registered']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Insert new user using prepared statement
    $stmt = $conn->prepare("INSERT INTO ugyfelek 
        (Keresztnev, Vezeteknev, Telefonszam, Email, Jelszo, Osztaly, RegisztracioIdopontja) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("sssssss", 
        $keresztnev,
        $vezeteknev,
        $telefonszam,
        $email,
        $password,
        $osztaly,
        $regisztracioIdopontja
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
