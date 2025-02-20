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
        // Rate limiting
        $ip = $_SERVER['REMOTE_ADDR'];
        $rateLimitKey = "cancel_attempt_{$ip}";
        
        // Check if there are too many attempts
        $stmt = $conn->prepare("SELECT COUNT(*) as attempts FROM rate_limits WHERE ip_address = ? AND action = 'cancel' AND timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
        $stmt->bind_param("s", $ip);
        $stmt->execute();
        $result = $stmt->get_result();
        $attempts = $result->fetch_assoc()['attempts'];
        
        if ($attempts > 10) {
            throw new Exception('Túl sok próbálkozás. Kérjük próbálja újra később.');
        }
        
        // Log attempt
        $stmt = $conn->prepare("INSERT INTO rate_limits (ip_address, action) VALUES (?, 'cancel')");
        $stmt->bind_param("s", $ip);
        $stmt->execute();

        if (!isset($_GET['token'])) {
            throw new Exception('Hiányzó lemondási token');
        }

        $token = $_GET['token'];
        
        // First check if the token exists at all
        $checkStmt = $conn->prepare("
            SELECT FoglalasID, Allapot
            FROM foglalasok
            WHERE CancellationToken = ?
        ");
        
        $checkStmt->bind_param("s", $token);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            throw new Exception('Érvénytelen lemondási token');
        }
        
        $booking = $checkResult->fetch_assoc();
        
        // Check booking status
        if ($booking['Allapot'] !== 'Foglalt') {
            throw new Exception('Ez az időpont már le van mondva vagy nem érvényes');
        }
        
        // Now get the full booking details
        $stmt = $conn->prepare("
            SELECT f.FoglalasID, f.Allapot, f.FoglalasDatum, f.FoglalasIdo, f.CancellationToken
            FROM foglalasok f
            WHERE f.FoglalasID = ?
        ");
        
        $stmt->bind_param("i", $booking['FoglalasID']);
        $stmt->execute();
        $result = $stmt->get_result();
        $booking = $result->fetch_assoc();
        
        // Check if the appointment is in the future and more than 24 hours away
        $appointmentDateTime = strtotime($booking['FoglalasDatum'] . ' ' . $booking['FoglalasIdo']);
        $now = time();
        
        if ($appointmentDateTime < $now) {
            throw new Exception('Múltbeli időpontot nem lehet lemondani');
        }
        
        if ($appointmentDateTime - $now < 24 * 60 * 60) {
            throw new Exception('Időpontot csak 24 órával előtte lehet lemondani');
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Update booking status to cancelled and clear the cancellation token
            $updateStmt = $conn->prepare("
                UPDATE foglalasok 
                SET Allapot = 'Lemondva',
                    LemondasIdopontja = NOW(),
                    CancellationToken = NULL
                WHERE FoglalasID = ?
            ");
            
            $updateStmt->bind_param("i", $booking['FoglalasID']);
            
            if (!$updateStmt->execute()) {
                throw new Exception('Nem sikerült lemondani az időpontot');
            }
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Az időpont sikeresen lemondva'
            ]);
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
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