<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyToken() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    try {
        return JWT::decode(
            str_replace('Bearer ', '', $headers['Authorization']), 
            new Key(JWT_SECRET_KEY, 'HS256')
        );
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
}
?> 