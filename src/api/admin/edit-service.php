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

    // Ellenőrizzük, hogy létezik-e a szolgáltatás
    $checkStmt = $conn->prepare("SELECT KepURL FROM szolgaltatasok WHERE SzolgaltatasID = ?");
    $checkStmt->bind_param("i", $serviceId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('A szolgáltatás nem található');
    }

    $service = $result->fetch_assoc();
    $oldImageName = $service['KepURL'];

    // Adatok validálása
    $name = isset($_POST['name']) ? $_POST['name'] : null;
    $price = isset($_POST['price']) ? intval($_POST['price']) : null;
    $duration = isset($_POST['duration']) ? intval($_POST['duration']) : null;
    $description = isset($_POST['description']) ? $_POST['description'] : null;

    if (!$name || !$price || !$duration) {
        throw new Exception('Minden mező kitöltése kötelező');
    }

    // Ellenőrizzük, hogy létezik-e már ilyen nevű szolgáltatás (kivéve a jelenlegi)
    $checkNameStmt = $conn->prepare("SELECT SzolgaltatasID FROM szolgaltatasok WHERE SzolgaltatasNev = ? AND SzolgaltatasID != ?");
    $checkNameStmt->bind_param("si", $name, $serviceId);
    $checkNameStmt->execute();
    $nameResult = $checkNameStmt->get_result();
    
    if ($nameResult->num_rows > 0) {
        throw new Exception('Már létezik ilyen nevű szolgáltatás');
    }

    // Ha van új kép feltöltve
    $newFileName = $oldImageName;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../imgs/';
        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid('service_') . '.' . $fileExtension;
        $uploadFile = $uploadDir . $newFileName;

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            throw new Exception('Nem sikerült feltölteni a képet');
        }

        // Régi kép törlése
        $oldImagePath = $uploadDir . $oldImageName;
        if (file_exists($oldImagePath)) {
            unlink($oldImagePath);
        }
    }

    // Szolgáltatás frissítése
    $stmt = $conn->prepare("UPDATE szolgaltatasok SET SzolgaltatasNev = ?, Ar = ?, IdotartamPerc = ?, Leiras = ?, KepURL = ? WHERE SzolgaltatasID = ?");
    $stmt->bind_param("siissi", $name, $price, $duration, $description, $newFileName, $serviceId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Szolgáltatás sikeresen módosítva'
        ]);
    } else {
        // Ha a frissítés sikertelen és új kép lett feltöltve, töröljük azt
        if ($newFileName !== $oldImageName) {
            $newImagePath = $uploadDir . $newFileName;
            if (file_exists($newImagePath)) {
                unlink($newImagePath);
            }
        }
        throw new Exception('Nem sikerült módosítani a szolgáltatást');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 