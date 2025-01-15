<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once 'config.php'; // Database connection configuration

$sql = 
"SELECT FodraszID as id, CONCAT(Vezeteknev, ' ', Keresztnev) AS nev, specializacio, evtapasztalat, reszletek, kep FROM Fodraszok";
$result = $conn->query($sql);

$barbers = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $barbers[] = $row;
    }
}

echo json_encode($barbers);
$conn->close();
?>
