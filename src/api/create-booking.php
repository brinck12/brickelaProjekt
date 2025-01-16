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
        
        // Get and validate input data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['barberId'], $data['serviceId'], $data['date'], $data['time'])) {
            throw new Exception('Missing required fields');
        }
        
        // Validate date and time format
        $bookingDate = date('Y-m-d', strtotime($data['date']));
        $bookingTime = date('H:i', strtotime($data['time']));
        
        if ($bookingDate < date('Y-m-d')) {
            throw new Exception('Cannot book appointments in the past');
        }
        
        // Check if the time slot is available
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM foglalasok 
            WHERE FodraszID = ? AND FoglalasDatum = ? AND FoglalasIdo = ?");
        $stmt->bind_param("iss", $data['barberId'], $bookingDate, $bookingTime);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if ($result['count'] > 0) {
            throw new Exception('This time slot is already booked');
        }
        
        // Create the booking
        $stmt = $conn->prepare("INSERT INTO foglalasok 
            (UgyfelID, FodraszID, SzolgaltatasID, FoglalasDatum, FoglalasIdo, Megjegyzes, LetrehozasIdopontja) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())");
            
        $megjegyzes = $data['megjegyzes'] ?? '';
        $stmt->bind_param("iiisss", 
            $decoded->user_id,
            $data['barberId'],
            $data['serviceId'],
            $bookingDate,
            $bookingTime,
            $megjegyzes
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Booking created successfully']);
        } else {
            throw new Exception('Failed to create booking');
        }
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?> 