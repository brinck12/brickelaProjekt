<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        error_log("Cancel booking request received with token: " . ($_GET['token'] ?? 'no token'));

        if (!isset($_GET['token'])) {
            throw new Exception('Hiányzó lemondási token');
        }

        $token = $_GET['token'];
        error_log("Looking up booking with token: " . $token);
        
        // Verify and get booking details
        $stmt = $conn->prepare("
            SELECT f.FoglalasID, f.Allapot, f.FoglalasDatum, f.FoglalasIdo, f.LetrehozasIdopontja
            FROM foglalasok f
            WHERE MD5(CONCAT(f.FoglalasID, f.LetrehozasIdopontja)) = ?
            AND f.Allapot = 'Foglalt'
        ");
        
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        error_log("Found " . $result->num_rows . " matching bookings");
        
        if ($result->num_rows === 0) {
            // Log the actual values we're trying to match
            $debugQuery = $conn->prepare("
                SELECT f.FoglalasID, f.Allapot, f.FoglalasDatum, f.FoglalasIdo, f.LetrehozasIdopontja,
                       MD5(CONCAT(f.FoglalasID, f.LetrehozasIdopontja)) as generated_token
                FROM foglalasok f
                WHERE f.Allapot = 'Foglalt'
            ");
            $debugQuery->execute();
            $debugResult = $debugQuery->get_result();
            while ($row = $debugResult->fetch_assoc()) {
                error_log("Debug - Booking ID: " . $row['FoglalasID'] . 
                         ", Status: " . $row['Allapot'] . 
                         ", Generated Token: " . $row['generated_token']);
            }
            throw new Exception('Érvénytelen vagy lejárt lemondási link');
        }
        
        $booking = $result->fetch_assoc();
        
        // Check if the appointment is in the future and within 24 hours
        $appointmentDateTime = strtotime($booking['FoglalasDatum'] . ' ' . $booking['FoglalasIdo']);
        $now = time();
        
        if ($appointmentDateTime < $now) {
            throw new Exception('Múltbeli időpontot nem lehet lemondani');
        }
        
        if ($appointmentDateTime - $now < 24 * 60 * 60) {
            throw new Exception('Időpontot csak 24 órával előtte lehet lemondani');
        }
        
        // Update booking status to cancelled
        $updateStmt = $conn->prepare("
            UPDATE foglalasok 
            SET Allapot = 'Lemondva',
                LemondasIdopontja = NOW()
            WHERE FoglalasID = ?
        ");
        
        $updateStmt->bind_param("i", $booking['FoglalasID']);
        
        if (!$updateStmt->execute()) {
            throw new Exception('Nem sikerült lemondani az időpontot');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Az időpont sikeresen lemondva'
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 