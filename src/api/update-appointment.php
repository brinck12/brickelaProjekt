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
        // Verify user authentication and admin role
        $decoded = verifyToken();
        
        // Check if user is admin or barber
        $stmt = $conn->prepare("SELECT Osztaly, UgyfelID FROM ugyfelek WHERE UgyfelID = ?");
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if (!$result || !in_array($result['Osztaly'], ['Adminisztrátor', 'Barber'])) {
            throw new Exception('Unauthorized access');
        }

        $isAdmin = $result['Osztaly'] === 'Adminisztrátor';
        $userId = $result['UgyfelID'];

        // Get barber ID if user is a barber
        $barberId = null;
        if (!$isAdmin) {
            $stmt = $conn->prepare("SELECT FodraszID FROM fodraszok WHERE UgyfelID = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $barberResult = $stmt->get_result()->fetch_assoc();
            
            if (!$barberResult) {
                throw new Exception('No barber profile found for this user');
            }
            $barberId = $barberResult['FodraszID'];
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['appointmentId'], $data['date'], $data['time'], $data['status'])) {
            throw new Exception('Missing required fields');
        }

        // If barber, verify the appointment belongs to them
        if (!$isAdmin) {
            $stmt = $conn->prepare("SELECT FodraszID FROM foglalasok WHERE FoglalasID = ?");
            $stmt->bind_param("i", $data['appointmentId']);
            $stmt->execute();
            $appointmentResult = $stmt->get_result()->fetch_assoc();
            
            if (!$appointmentResult || $appointmentResult['FodraszID'] !== $barberId) {
                throw new Exception('You can only update your own appointments');
            }
        }

        // Update the appointment
        $stmt = $conn->prepare("
            UPDATE foglalasok 
            SET FoglalasDatum = ?,
                FoglalasIdo = ?,
                Allapot = ?,
                Megjegyzes = ?
            WHERE FoglalasID = ?
        ");

        $stmt->bind_param(
            "ssssi",
            $data['date'],
            $data['time'],
            $data['status'],
            $data['note'],
            $data['appointmentId']
        );

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Appointment updated successfully'
            ]);
        } else {
            throw new Exception('Failed to update appointment');
        }

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 