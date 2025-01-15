<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php'; // Database configuration and connection

// Kapcsolódási hiba ellenőrzése
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}
// SQL lekérdezés a szolgáltatások lekéréséhez
$sql = "SELECT SzolgaltatasID, SzolgaltatasNev, IdotartamPerc, Ar, Leiras, KepURL FROM szolgaltatasok";
$result = $conn->query($sql);

$services = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $services[] = [
            'id' => $row['SzolgaltatasID'],
            'name' => $row['SzolgaltatasNev'],
            'duration' => $row['IdotartamPerc'],
            'price' => $row['Ar'],
            'description' => $row['Leiras'],  // Ha van leírás
            'image' => $row['KepURL']         // Ha van kép URL
        ];
    }
}

echo json_encode($services);
$conn->close();

?>