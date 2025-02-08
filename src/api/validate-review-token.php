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
        if (!isset($_GET['token'])) {
            throw new Exception('Hiányzó token');
        }

        $token = $_GET['token'];
        
        // Check if token exists and is valid
        $stmt = $conn->prepare("
            SELECT rt.*, f.FoglalasID
            FROM review_tokens rt
            JOIN foglalasok f ON rt.FoglalasID = f.FoglalasID
            WHERE rt.Token = ?
            AND rt.Used = 0
            AND rt.ExpiresAt > NOW()
        ");
        
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception('Érvénytelen vagy lejárt értékelési link');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Érvényes token'
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} 