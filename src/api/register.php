<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid request data');
        }

        // Input validation
        if (!isset($data['email'], $data['password'], $data['name'], $data['telefonszam'])) {
            throw new Exception('Missing required fields');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        if (strlen($data['password']) < 8) {
            throw new Exception('Password must be at least 8 characters long');
        }

        if (empty($data['name']) || strlen($data['name']) < 2) {
            throw new Exception('Name is required and must be at least 2 characters');
        }

        if (empty($data['telefonszam']) || !preg_match('/^[0-9+\-\s()]{6,20}$/', $data['telefonszam'])) {
            throw new Exception('Invalid phone number format');
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

        // Check if email already exists
        $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            throw new Exception('Email is already registered');
        }
        $stmt->close();

        // Check if phone number already exists
        $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Telefonszam = ?");
        $stmt->bind_param("s", $telefonszam);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            throw new Exception('Phone number is already registered');
        }
        $stmt->close();

        // Insert new user
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
            throw new Exception('Registration failed: ' . $stmt->error);
        }

        $stmt->close();
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
