<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';
require_once 'middleware/auth.php';

// Parse JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check database connection
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify user authentication
    $decoded = verifyToken();
    
    // Input validation
    if (empty($data['Keresztnev']) || strlen($data['Keresztnev']) < 2) {
        echo json_encode(['success' => false, 'message' => 'Name is required and must be at least 2 characters']);
        exit;
    }

    if (!filter_var($data['Email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    if (empty($data['Telefonszam']) || !preg_match('/^[0-9+\-\s()]{6,20}$/', $data['Telefonszam'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid phone number format']);
        exit;
    }

    // Check if email is already used by another user
    $stmt = $conn->prepare("SELECT UgyfelID FROM ugyfelek WHERE Email = ? AND UgyfelID != ?");
    $stmt->bind_param("si", $data['Email'], $decoded->user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email is already used by another user']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Check if phone is already used by another user
    $stmt = $conn->prepare("SELECT UgyfelID FROM ugyfelek WHERE Telefonszam = ? AND UgyfelID != ?");
    $stmt->bind_param("si", $data['Telefonszam'], $decoded->user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number is already used by another user']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Update user data using prepared statement
    $stmt = $conn->prepare("UPDATE ugyfelek SET 
        Keresztnev = ?,
        Vezeteknev = ?,
        Email = ?,
        Telefonszam = ?
        WHERE UgyfelID = ?");
    
    $stmt->bind_param("ssssi", 
        $data['Keresztnev'],
        $data['Keresztnev'],
        $data['Email'],
        $data['Telefonszam'],
        $decoded->user_id
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User data updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
    }

    $stmt->close();
    mysqli_close($conn);
}
?>