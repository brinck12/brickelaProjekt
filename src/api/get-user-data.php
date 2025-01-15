<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once 'config.php';
require_once 'middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $decoded = verifyToken();
    $sql = "SELECT UgyfelID, Keresztnev, Email, Telefonszam FROM ugyfelek WHERE UgyfelID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $decoded->user_id);
    $stmt->execute();
    echo json_encode($stmt->get_result()->fetch_assoc());
}
?> 