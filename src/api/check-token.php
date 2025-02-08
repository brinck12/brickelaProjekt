<?php
require_once 'config.php';

$token = 'f6f47352dcac75b2919197dda28a2e745ca8b155f53c891cad1c3e56f1ecd0b3';

$stmt = $conn->prepare("SELECT * FROM review_tokens WHERE Token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    var_dump($row);
} else {
    echo "Token not found in database";
} 