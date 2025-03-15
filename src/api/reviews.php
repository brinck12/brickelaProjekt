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

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    $barberId = isset($data['barberId']) ? intval($data['barberId']) : null;

    // Debug log
    error_log("Fetching reviews for barber ID: " . ($barberId ?? 'all'));

    // Base query - simplified to ensure we get all reviews
    $sql = "SELECT 
        r.ID as id,
        r.rating as ertekeles,
        r.comment as velemeny,
        r.review_date as letrehozasIdopontja,
        CONCAT(u.Keresztnev, ' ', u.Vezeteknev) as ertekelo_neve,
        f.FodraszID as barberId,
        s.SzolgaltatasNev as szolgaltatas_neve
    FROM reviews r
    INNER JOIN foglalasok f ON r.FoglalasID = f.FoglalasID
    INNER JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
    INNER JOIN szolgaltatasok s ON f.SzolgaltatasID = s.SzolgaltatasID
    WHERE r.Used = TRUE 
    AND r.rating IS NOT NULL";

    // Add barber filter if barberId is provided
    if ($barberId !== null) {
        $sql .= " AND f.FodraszID = ?";
    }

    $sql .= " ORDER BY r.review_date DESC LIMIT 50";

    // Debug log
    error_log("SQL Query: " . $sql);

    $stmt = $conn->prepare($sql);
    
    if ($barberId !== null) {
        $stmt->bind_param("i", $barberId);
        // Debug log
        error_log("Binding parameter barberId: " . $barberId);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    
    if (!$result) {
        throw new Exception("Error fetching reviews: " . $conn->error);
    }
    
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'id' => intval($row['id']),
            'barberId' => intval($row['barberId']),
            'ertekeles' => intval($row['ertekeles']),
            'velemeny' => $row['velemeny'],
            'letrehozasIdopontja' => $row['letrehozasIdopontja'],
            'ertekelo_neve' => $row['ertekelo_neve'],
            'szolgaltatas_neve' => $row['szolgaltatas_neve']
        ];
    }

    // Debug log
    error_log("Found " . count($reviews) . " reviews");
    
    echo json_encode([
        'success' => true,
        'data' => $reviews
    ]);
    
} catch (Exception $e) {
    error_log("Error in reviews.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
