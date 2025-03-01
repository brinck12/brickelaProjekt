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

// Get current time
$currentTime = new DateTime();
$selectedDate = new DateTime($date);
$isToday = $currentTime->format('Y-m-d') === $selectedDate->format('Y-m-d');

// First, get the barber's working hours
$barberSql = "SELECT KezdesIdo, BefejezesIdo FROM fodraszok WHERE FodraszID = ?";
$barberStmt = $conn->prepare($barberSql);
$barberStmt->bind_param("i", $barberId);
$barberStmt->execute();
$barberResult = $barberStmt->get_result();
$barberHours = $barberResult->fetch_assoc();

if (!$barberHours) {
    echo json_encode([
        'success' => false,
        'message' => 'Barber not found'
    ]);
    exit;
}

$startTime = (int)$barberHours['KezdesIdo'];
$endTime = (int)$barberHours['BefejezesIdo'];

// Get all appointments for the specified barber and date where status is not cancelled
$sql = "SELECT FoglalasIdo FROM foglalasok WHERE FodraszID = ? AND DATE(FoglalasDatum) = ? AND Allapot != 'Lemondva'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $barberId, $date);
$stmt->execute();
$result = $stmt->get_result();

$bookedTimes = [];
while ($row = $result->fetch_assoc()) {
    $time = date('H:i', strtotime($row['FoglalasIdo']));
    
    // If it's today, only add times that are in the future
    if ($isToday) {
        $appointmentTime = new DateTime($date . ' ' . $time);
        if ($appointmentTime > $currentTime) {
            $bookedTimes[] = $time;
        }
    } else {
        $bookedTimes[] = $time;
    }
}

// If it's today, we'll also add all past times to bookedTimes
if ($isToday) {
    $currentHour = (int)$currentTime->format('H');
    $currentMinute = (int)$currentTime->format('i');
    
    // Loop through all possible time slots during the barber's working hours
    for ($hour = $startTime; $hour < $endTime; $hour++) {
        // For each hour, check both :00 and :30 slots
        foreach(['00', '30'] as $minute) {
            $timeString = sprintf("%02d:%s", $hour, $minute);
            
            // If this time is before or equal to current time, mark it as booked
            if ($hour < $currentHour || ($hour === $currentHour && (int)$minute <= $currentMinute)) {
                if (!in_array($timeString, $bookedTimes)) {
                    $bookedTimes[] = $timeString;
                }
            }
        }
    }
} else {
    // For non-today dates, add times before start time and after end time as booked
    for ($hour = 0; $hour < 24; $hour++) {
        foreach(['00', '30'] as $minute) {
            $timeString = sprintf("%02d:%s", $hour, $minute);
            // If time is outside working hours, mark as booked
            if ($hour < $startTime || $hour >= $endTime) {
                if (!in_array($timeString, $bookedTimes)) {
                    $bookedTimes[] = $timeString;
                }
            }
        }
    }
}

// Sort the times for consistency
sort($bookedTimes);

echo json_encode([
    'success' => true,
    'bookedTimes' => $bookedTimes,
]);

$stmt->close();
$barberStmt->close();
$conn->close();
?> 