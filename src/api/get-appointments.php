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
        // Verify user authentication
        $decoded = verifyToken();
        
        // Update past appointments to 'Teljesítve' status
        $updateStmt = $conn->prepare("
            UPDATE foglalasok 
            SET Allapot = 'Teljesítve'
            WHERE UgyfelID = ? 
            AND CONCAT(FoglalasDatum, ' ', FoglalasIdo) < NOW()
            AND Allapot = 'Foglalt'
        ");
        $updateStmt->bind_param("i", $decoded->user_id);
        $updateStmt->execute();
        
        // Fetch all appointments for the user
        $stmt = $conn->prepare("
            SELECT f.*, 
                   s.SzolgaltatasNev as szolgaltatas_nev,
                   CONCAT(fo.Keresztnev, ' ', fo.Vezeteknev) as fodrasz_nev
            FROM foglalasok f
            JOIN szolgaltatasok s ON f.SzolgaltatasID = s.SzolgaltatasID
            JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
            WHERE f.UgyfelID = ?
            ORDER BY f.FoglalasDatum DESC, f.FoglalasIdo DESC
        ");
        
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $appointments = [];
        while ($row = $result->fetch_assoc()) {
            $appointments[] = [
                'id' => $row['FoglalasID'],
                'date' => $row['FoglalasDatum'],
                'time' => date('H:i', strtotime($row['FoglalasIdo'])),
                'status' => $row['Allapot'],
                'barberName' => $row['fodrasz_nev'],
                'service' => $row['szolgaltatas_nev'],
                'note' => $row['Megjegyzes']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'appointments' => $appointments
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} 