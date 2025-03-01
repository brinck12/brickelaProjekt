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

function generateToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Start transaction
        $conn->begin_transaction();

        try {
            // Get some completed appointments that don't have reviews yet
            $stmt = $conn->prepare("
                SELECT f.FoglalasID, f.FodraszID, f.UgyfelID, f.FoglalasDatum, f.FoglalasIdo,
                       CONCAT(b.Keresztnev, ' ', b.Vezeteknev) as FodraszNev, 
                       CONCAT(u.Vezeteknev, ' ', u.Keresztnev) as UgyfelNev
                FROM foglalasok f
                JOIN fodraszok b ON f.FodraszID = b.FodraszID
                JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
                WHERE f.review_rating IS NULL 
                AND f.Allapot = 'Teljesítve'
                LIMIT 5
            ");

            $stmt->execute();
            $result = $stmt->get_result();
            
            $generatedTokens = [];

            if ($result->num_rows === 0) {
                // If no completed appointments found, create a test appointment and mark it as completed
                $createTestAppointment = $conn->prepare("
                    INSERT INTO foglalasok (UgyfelID, FodraszID, SzolgaltatasID, FoglalasDatum, FoglalasIdo, Allapot)
                    SELECT 
                        (SELECT UgyfelID FROM ugyfelek LIMIT 1),
                        (SELECT FodraszID FROM fodraszok LIMIT 1),
                        (SELECT id FROM szolgaltatasok LIMIT 1),
                        CURDATE(),
                        '14:00:00',
                        'Teljesítve'
                ");
                
                $createTestAppointment->execute();
                $newAppointmentId = $conn->insert_id;
                
                // Get the details of the created appointment
                $getNewAppointment = $conn->prepare("
                    SELECT f.FoglalasID, f.FodraszID, f.UgyfelID, f.FoglalasDatum, f.FoglalasIdo,
                           CONCAT(b.Keresztnev, ' ', b.Vezeteknev) as FodraszNev, 
                           CONCAT(u.Vezeteknev, ' ', u.Keresztnev) as UgyfelNev
                    FROM foglalasok f
                    JOIN fodraszok b ON f.FodraszID = b.FodraszID
                    JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
                    WHERE f.FoglalasID = ?
                ");
                
                $getNewAppointment->bind_param("i", $newAppointmentId);
                $getNewAppointment->execute();
                $result = $getNewAppointment->get_result();
            }

            while ($booking = $result->fetch_assoc()) {
                $token = generateToken();
                $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days')); // Token expires in 7 days

                // Insert new review token
                $insertToken = $conn->prepare("
                    INSERT INTO review_tokens 
                    (FoglalasID, Token, ExpiresAt, Used) 
                    VALUES (?, ?, ?, 0)
                ");

                $insertToken->bind_param("iss", 
                    $booking['FoglalasID'],
                    $token,
                    $expiresAt
                );

                if ($insertToken->execute()) {
                    $generatedTokens[] = [
                        'token' => $token,
                        'expires_at' => $expiresAt,
                        'booking_id' => $booking['FoglalasID'],
                        'details' => [
                            'date' => $booking['FoglalasDatum'],
                            'time' => $booking['FoglalasIdo'],
                            'barber' => $booking['FodraszNev'],
                            'client' => $booking['UgyfelNev']
                        ],
                        'test_url' => 'http://localhost:5173/review?token=' . $token
                    ];
                }
            }

            // Commit transaction
            $conn->commit();

            if (empty($generatedTokens)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Nem sikerült teszt tokeneket létrehozni. Ellenőrizze, hogy vannak-e teljesített foglalások.'
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'message' => 'Teszt tokenek sikeresen létrehozva',
                    'tokens' => $generatedTokens,
                    'instructions' => 'Használja a test_url címet a teszt értékelés beküldéséhez, vagy küldje el a tokent közvetlenül a submit-review.php-nak.'
                ]);
            }

        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 