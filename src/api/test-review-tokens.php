<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Function to generate a secure random token
function generateToken() {
    return bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get some completed appointments that don't have reviews yet
        $stmt = $conn->prepare("
            SELECT f.FoglalasID, f.FodraszID, f.UgyfelID, f.FoglalasDatum, f.FoglalasIdo,
                   u.Email as user_email, u.Keresztnev as user_firstname
            FROM foglalasok f
            JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
            LEFT JOIN reviews r ON f.FoglalasID = r.FoglalasID
            WHERE f.Allapot = 'Teljesítve'
            AND r.ID IS NULL
            LIMIT 5
        ");

        $stmt->execute();
        $result = $stmt->get_result();
        $appointments = $result->fetch_all(MYSQLI_ASSOC);

        $tokens = [];
        foreach ($appointments as $appointment) {
            // Generate token
            $token = generateToken();
            $expiryDate = date('Y-m-d H:i:s', strtotime('+7 days'));

            // Insert new review token
            $insertToken = $conn->prepare("
                INSERT INTO reviews
                (FoglalasID, Token, ExpiresAt, Used, CreatedAt)
                VALUES (?, ?, ?, FALSE, NOW())
            ");

            $insertToken->bind_param("iss",
                $appointment['FoglalasID'],
                $token,
                $expiryDate
            );

            if ($insertToken->execute()) {
                $tokens[] = [
                    'token' => $token,
                    'expires' => $expiryDate,
                    'user_email' => $appointment['user_email'],
                    'user_firstname' => $appointment['user_firstname']
                ];
            }

            $insertToken->close();
        }

        echo json_encode([
            'success' => true,
            'tokens' => $tokens
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'error' => $e->getMessage()
        ]);
    }
}

$conn->close();
?> 