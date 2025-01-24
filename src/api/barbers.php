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
        $sql = "SELECT * FROM fodraszok";
        $result = $conn->query($sql);
        
        $barbers = [];
        while($row = $result->fetch_assoc()) {
            $barbers[] = [
                'id' => $row['FodraszID'],
                'nev' => $row['Vezeteknev'] . ' ' . $row['Keresztnev'],
                'kep' => $row['kep'],
                'evtapasztalat' => $row['evtapasztalat'],
                'specializacio' => $row['specializacio'],
                'reszletek' => $row['reszletek'],
                'KezdesIdo' => intval($row['KezdesIdo']),
                'BefejezesIdo' => intval($row['BefejezesIdo'])
            ];
        }
        
        echo json_encode($barbers);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
