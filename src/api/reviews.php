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

$data = json_decode(file_get_contents('php://input'), true);
$barberId = $data['barberId'];

$sql = "SELECT 
    e.ErtekelesID AS ReviewID,
    e.Ertekeles AS ertekeles,
    e.Velemeny AS velemeny,
    e.LetrehozasIdopontja AS LetrehozasIdopontja,
    CONCAT(u.Keresztnev, ' ', u.Vezeteknev) as ertekelo_neve,  -- Concatenate first and last name of the reviewer
    f.Keresztnev AS BarberFirstName,                             -- Barber first name
    f.Vezeteknev AS BarberLastName                               -- Barber last name
FROM 
    ertekelesek e
JOIN 
    foglalasok fo ON e.FoglalasID = fo.FoglalasID
JOIN 
    ugyfelek u ON fo.UgyfelID = u.UgyfelID
JOIN 
    fodraszok f ON fo.FodraszID = f.FodraszID
WHERE 
    f.FodraszID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $barberId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}
//var_dump($reviews);
echo json_encode($reviews);
$conn->close();
?>
