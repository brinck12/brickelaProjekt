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
require_once 'middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $decoded = verifyToken();
        $sql = "SELECT UgyfelID, Keresztnev, Email, Telefonszam, Osztaly FROM ugyfelek WHERE UgyfelID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if ($result) {
            echo json_encode([
                'id' => $result['UgyfelID'],
                'Keresztnev' => $result['Keresztnev'],
                'Email' => $result['Email'],
                'Telefonszam' => $result['Telefonszam'],
                'Osztaly' => $result['Osztaly']
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?> 