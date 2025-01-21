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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['barberId'])) {
            throw new Exception('Missing barber ID');
        }

        $stmt = $conn->prepare("
            SELECT ReferenciaID, KepUtvonal, Leiras, LetrehozasIdopontja
            FROM referenciak
            WHERE FodraszID = ?
            ORDER BY LetrehozasIdopontja DESC
        ");
        
        $stmt->bind_param("i", $data['barberId']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $references = [];
        while ($row = $result->fetch_assoc()) {
            $references[] = [
                'id' => $row['ReferenciaID'],
                'image' => $row['KepUtvonal'],
                'description' => $row['Leiras'],
                'createdAt' => $row['LetrehozasIdopontja']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $references
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} 