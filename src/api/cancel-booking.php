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
        
        // Verify and get booking details using the secure token
        $stmt = $conn->prepare("
            SELECT f.FoglalasID, f.Allapot, f.FoglalasDatum, f.FoglalasIdo, f.CancellationToken
            FROM foglalasok f
            WHERE f.CancellationToken = ?
            AND f.Allapot = 'Foglalt'
        ");
        
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception('Érvénytelen vagy lejárt lemondási link');
        }
        
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