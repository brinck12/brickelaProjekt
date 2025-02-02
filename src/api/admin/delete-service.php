<?php
require_once '../config.php';
require_once '../cors_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $serviceId = isset($_POST['id']) ? intval($_POST['id']) : null;
    if (!$serviceId) {
        throw new Exception('Szolgáltatás ID megadása kötelező');
    }

    // Kép nevének lekérése törlés előtt
    $imageStmt = $conn->prepare("SELECT KepURL FROM szolgaltatasok WHERE SzolgaltatasID = ?");
    $imageStmt->bind_param("i", $serviceId);
    $imageStmt->execute();
    $imageResult = $imageStmt->get_result();
    
    if ($imageResult->num_rows === 0) {
        throw new Exception('A szolgáltatás nem található');
    }

    $service = $imageResult->fetch_assoc();
    $imageName = $service['KepURL'];

    // Szolgáltatás törlése
    $deleteStmt = $conn->prepare("DELETE FROM szolgaltatasok WHERE SzolgaltatasID = ?");
    $deleteStmt->bind_param("i", $serviceId);
    
    if ($deleteStmt->execute()) {
        // Kép törlése a szerverről
        $imagePath = '../../imgs/' . $imageName;
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Szolgáltatás sikeresen törölve'
        ]);
    } else {
        throw new Exception('Nem sikerült törölni a szolgáltatást');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 