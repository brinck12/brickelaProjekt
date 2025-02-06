<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (!isset($_GET['token'])) {
            throw new Exception('A megerősítő token hiányzik');
        }

        $token = $_GET['token'];
        error_log("Verifying token: " . $token); // Debug log
        
        // Find user with this verification token
        $stmt = $conn->prepare("
            SELECT UgyfelID, Email, Aktiv, VerificationToken 
            FROM ugyfelek 
            WHERE VerificationToken = ?
        ");
        
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        error_log("Found rows: " . $result->num_rows); // Debug log
        
        if ($result->num_rows === 0) {
            throw new Exception('Érvénytelen vagy lejárt megerősítő token');
        }
        
        $user = $result->fetch_assoc();
        error_log("User found: " . json_encode($user)); // Debug log
        
        if ($user['Aktiv'] == 1) {
            throw new Exception('Ez az email cím már meg van erősítve');
        }
        
        // Update user status to active
        $updateStmt = $conn->prepare("
            UPDATE ugyfelek 
            SET Aktiv = 1, 
                VerificationToken = NULL,
                EmailVerifiedAt = CURRENT_TIMESTAMP 
            WHERE UgyfelID = ?
        ");
        
        $updateStmt->bind_param("i", $user['UgyfelID']);
        $success = $updateStmt->execute();
        error_log("Update success: " . ($success ? "yes" : "no")); // Debug log
        
        if (!$success) {
            throw new Exception('Nem sikerült megerősíteni az email címet');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Az email cím sikeresen megerősítve. Most már bejelentkezhetsz.'
        ]);
        
        $stmt->close();
        $updateStmt->close();
        
    } catch (Exception $e) {
        error_log("Verification error: " . $e->getMessage()); // Debug log
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 