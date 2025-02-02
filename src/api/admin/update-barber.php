<?php
require_once '../config.php';
require_once '../cors_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $barberId = isset($_POST['id']) ? intval($_POST['id']) : null;
    if (!$barberId) {
        throw new Exception('Barber ID is required');
    }

    $experience = isset($_POST['experience']) ? intval($_POST['experience']) : null;
    $specialization = isset($_POST['specialization']) ? $_POST['specialization'] : null;
    $details = isset($_POST['details']) ? $_POST['details'] : null;
    $startTime = isset($_POST['startTime']) ? $_POST['startTime'] : null;
    $endTime = isset($_POST['endTime']) ? $_POST['endTime'] : null;

    // Ellenőrizzük, hogy létezik-e a borbély
    $checkStmt = $conn->prepare("SELECT FodraszID FROM fodraszok WHERE FodraszID = ?");
    $checkStmt->bind_param("i", $barberId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Barber not found');
    }

    // Kép kezelése
    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../imgs/';
        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid('barber_') . '.' . $fileExtension;
        $uploadFile = $uploadDir . $newFileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imagePath = $newFileName;
        }
    }

    // SQL lekérdezés építése a frissítéshez
    $updateFields = [];
    $types = "";
    $params = [];

 

    if ($experience !== null) {
        $updateFields[] = "evtapasztalat = ?";
        $types .= "i";
        $params[] = $experience;
    }

    if ($specialization !== null) {
        $updateFields[] = "specializacio = ?";
        $types .= "s";
        $params[] = $specialization;
    }

    if ($details !== null) {
        $updateFields[] = "reszletek = ?";
        $types .= "s";
        $params[] = $details;
    }

    if ($startTime !== null) {
        $updateFields[] = "KezdesIdo = ?";
        $types .= "s";
        $params[] = $startTime;
    }

    if ($endTime !== null) {
        $updateFields[] = "BefejezesIdo = ?";
        $types .= "s";
        $params[] = $endTime;
    }

    if ($imagePath !== null) {
        $updateFields[] = "kep = ?";
        $types .= "s";
        $params[] = $imagePath;
    }

    if (empty($updateFields)) {
        throw new Exception('No fields to update');
    }

    // Hozzáadjuk a barberId-t a paraméterekhez
    $types .= "i";
    $params[] = $barberId;

    $sql = "UPDATE fodraszok SET " . implode(", ", $updateFields) . " WHERE FodraszID = ?";
    $stmt = $conn->prepare($sql);

    // Paraméterek dinamikus bind-olása
    $bindParams = array_merge([$types], $params);
    $stmt->bind_param(...$bindParams);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Barber updated successfully'
        ]);
    } else {
        throw new Exception('Failed to update barber');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 