<?php
require_once 'config.php';
require_once 'middleware/auth.php';

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $decoded = verifyToken();
    if (!$decoded) {
        throw new Exception('Nincs token megadva');
    }

    $userId = $decoded->user_id;
    if (!$userId) {
        throw new Exception('Érvénytelen token');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('Érvénytelen adatok');
    }

    $keresztnev = $data['Keresztnev'] ?? null;
    $vezeteknev = $data['Vezeteknev'] ?? null;
    $email = $data['Email'] ?? null;
    $telefonszam = $data['Telefonszam'] ?? null;

    if (!$keresztnev || !$vezeteknev || !$email || !$telefonszam) {
        throw new Exception('Hiányzó adatok');
    }

    $stmt = $conn->prepare('UPDATE ugyfelek SET Keresztnev = ?, Vezeteknev = ?, Email = ?, Telefonszam = ? WHERE UgyfelID = ?');
    $stmt->bind_param("ssssi", $keresztnev, $vezeteknev, $email, $telefonszam, $userId);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Adatok sikeresen frissítve'
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>