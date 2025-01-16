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

// Log raw input
error_log("Raw input: " . file_get_contents('php://input'));

$data = json_decode(file_get_contents('php://input'), true);
error_log("Decoded data: " . print_r($data, true));

$barberId = $data['barberId'];
$date = $data['date'];

error_log("barberId: " . $barberId . " (type: " . gettype($barberId) . ")");
error_log("date: " . $date . " (type: " . gettype($date) . ")");

// Get all appointments for the specified barber and date
$sql = "SELECT FoglalasIdo FROM foglalasok WHERE FodraszID = ? AND DATE(FoglalasDatum) = ?";



$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $barberId, $date);
$stmt->execute();
$result = $stmt->get_result();

$bookedTimes = [];
while ($row = $result->fetch_assoc()) {
    $time = date('H:i', strtotime($row['FoglalasIdo']));
    $bookedTimes[] = $time;
}

echo json_encode([
    'success' => true,
    'bookedTimes' => $bookedTimes,
]);

$stmt->close();
$conn->close();
?> 