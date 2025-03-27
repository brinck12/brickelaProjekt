<?php
require_once 'config.php';
require_once 'cors_headers.php';

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['token']) || !isset($data['rating']) || !isset($data['comment'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$token = $data['token'];
$rating = intval($data['rating']);
$comment = $data['comment'];

// Validate rating
if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Rating must be between 1 and 5']);
    exit;
}

try {
    // Get review token details and check if it's valid
    $stmt = $conn->prepare("
        SELECT r.FoglalasID, r.Used, r.ExpiresAt, f.FodraszID, f.UgyfelID
        FROM reviews r
        JOIN foglalasok f ON r.FoglalasID = f.FoglalasID
        WHERE r.Token = ? AND r.Used = FALSE AND r.ExpiresAt > NOW()
    ");
    
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Invalid or expired review token');
    }
    
    $review = $result->fetch_assoc();
    
    // Begin transaction
    $conn->begin_transaction();
    
    // Update the review
    $updateReview = $conn->prepare("
        UPDATE reviews 
        SET rating = ?, 
            comment = ?, 
            review_date = NOW(),
            Used = TRUE 
        WHERE Token = ?
    ");
    
    $updateReview->bind_param("iss",
        $rating,
        $comment,
        $token
    );
    
    if (!$updateReview->execute()) {
        throw new Exception('Failed to submit review');
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Köszönjük az értékelést!'
    ]);
    
} catch (Exception $e) {
    if ($conn->connect_error === false) {
        $conn->rollback();
    }
    
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$stmt->close();
$updateReview->close();
$conn->close();
?> 