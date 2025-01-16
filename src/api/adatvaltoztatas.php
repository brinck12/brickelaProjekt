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
require_once 'middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verify user authentication
        $decoded = verifyToken();
        
        // Parse JSON input
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid request data');
        }

        // Input validation
        if (empty($data['Keresztnev']) || strlen($data['Keresztnev']) < 2) {
            throw new Exception('Name is required and must be at least 2 characters');
        }

        if (!filter_var($data['Email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        if (empty($data['Telefonszam']) || !preg_match('/^[0-9+\-\s()]{6,20}$/', $data['Telefonszam'])) {
            throw new Exception('Invalid phone number format');
        }

        // Check if email is already used by another user
        $stmt = $conn->prepare("SELECT UgyfelID FROM ugyfelek WHERE Email = ? AND UgyfelID != ?");
        $stmt->bind_param("si", $data['Email'], $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            throw new Exception('Email is already used by another user');
        }
        $stmt->close();

        // Check if phone is already used by another user
        $stmt = $conn->prepare("SELECT UgyfelID FROM ugyfelek WHERE Telefonszam = ? AND UgyfelID != ?");
        $stmt->bind_param("si", $data['Telefonszam'], $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            throw new Exception('Phone number is already used by another user');
        }
        $stmt->close();

        // Update user data
        $stmt = $conn->prepare("UPDATE ugyfelek SET 
            Keresztnev = ?,
            Email = ?,
            Telefonszam = ?
            WHERE UgyfelID = ?");
        
        $stmt->bind_param("sssi", 
            $data['Keresztnev'],
            $data['Email'],
            $data['Telefonszam'],
            $decoded->user_id
        );

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User data updated successfully']);
        } else {
            throw new Exception('Update failed: ' . $stmt->error);
        }

        $stmt->close();
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>