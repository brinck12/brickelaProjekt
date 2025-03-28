<?php
require_once __DIR__ . '/cors_headers.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../vendor/autoload.php';
require_once 'config.php';
use Firebase\JWT\JWT;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $sql = "SELECT * FROM ugyfelek WHERE Email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $data['email']);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        
        if ($user && password_verify($data['password'], $user['Jelszo'])) {
            // Check if email is verified
            if ($user['Aktiv'] != 1) {
                throw new Exception('Kérjük erősítse meg az email címét a bejelentkezés előtt.');
            }
            
            $token = JWT::encode([
                'user_id' => $user['UgyfelID'],
                'email' => $user['Email'],
                'exp' => time() + (60 * 60 * 24)
            ], JWT_SECRET_KEY, 'HS256');

            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['UgyfelID'],
                    'Keresztnev' => $user['Keresztnev'],
                    'Vezeteknev' => $user['Vezeteknev'],
                    'Email' => $user['Email'],
                    'Telefonszam' => $user['Telefonszam'],
                    'Osztaly' => $user['Osztaly']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Érvénytelen email cím vagy jelszó']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
