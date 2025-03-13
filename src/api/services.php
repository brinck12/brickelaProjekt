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
        $sql = "SELECT * FROM szolgaltatasok";
        $result = $conn->query($sql);
        
        $services = [];
        while($row = $result->fetch_assoc()) {
            $services[] = [
                'id' => $row['SzolgaltatasID'],
                'name' => $row['SzolgaltatasNev'],
                'description' => $row['Leiras'],
                'duration' => $row['IdotartamPerc'],
                'price' => intval($row['Ar']),
            ];
        }
        
        echo json_encode($services);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>