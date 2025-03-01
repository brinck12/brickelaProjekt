<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and decode the request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['token'], $data['rating'])) {
            throw new Exception('Hiányzó kötelező mezők');
        }
        
        // Validate rating
        $rating = intval($data['rating']);
        if ($rating < 1 || $rating > 5) {
            throw new Exception('Érvénytelen értékelés');
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Get booking ID and related info from review token
            $stmt = $conn->prepare("
                SELECT rt.FoglalasID, rt.Used, rt.ExpiresAt, f.FodraszID, f.UgyfelID
                FROM review_tokens rt
                JOIN foglalasok f ON rt.FoglalasID = f.FoglalasID
                WHERE rt.Token = ?
                AND rt.Used = 0
                AND rt.ExpiresAt > NOW()
            ");
            
            $stmt->bind_param("s", $data['token']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception('Érvénytelen vagy lejárt értékelési token');
            }
            
            $tokenData = $result->fetch_assoc();
            
            // Mark token as used
            $updateToken = $conn->prepare("
                UPDATE review_tokens 
                SET Used = 1 
                WHERE Token = ?
            ");
            
            $updateToken->bind_param("s", $data['token']);
            $updateToken->execute();
            
            // Store the review in foglalasok table
            $updateBooking = $conn->prepare("
                UPDATE foglalasok 
                SET 
                    review_rating = ?,
                    review_comment = ?,
                    review_date = NOW()
                WHERE FoglalasID = ?
            ");
            
            $comment = isset($data['comment']) ? $data['comment'] : null;
            $updateBooking->bind_param("isi", 
                $rating,
                $comment,
                $tokenData['FoglalasID']
            );
            
            if (!$updateBooking->execute()) {
                throw new Exception('Nem sikerült menteni az értékelést');
            }

            // Insert into ertekelesek table with correct field names
            $insertReview = $conn->prepare("
                INSERT INTO ertekelesek 
                (FoglalasID, Ertekeles, Velemeny, LetrehozasIdopontja)
                VALUES (?, ?, ?, NOW())
            ");

            $insertReview->bind_param("iis",
                $tokenData['FoglalasID'],
                $rating,
                $comment
            );

            if (!$insertReview->execute()) {
                throw new Exception('Nem sikerült menteni az értékelést az értékelések táblába');
            }
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Köszönjük az értékelést!'
            ]);
            
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