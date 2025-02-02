<?php
require_once '../config.php';
require_once '../cors_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Kép kezelése
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Kérjük töltsön fel egy képet');
    }

    $uploadDir = '../../imgs/';
    $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $newFileName = uniqid('service_') . '.' . $fileExtension;
    $uploadFile = $uploadDir . $newFileName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
        throw new Exception('Nem sikerült feltölteni a képet');
    }

    try {
        // Adatok validálása
        $name = isset($_POST['name']) ? $_POST['name'] : null;
        $price = isset($_POST['price']) ? intval($_POST['price']) : null;
        $duration = isset($_POST['duration']) ? intval($_POST['duration']) : null;
        $description = isset($_POST['description']) ? $_POST['description'] : null;

        if (!$name || !$price || !$duration) {
            throw new Exception('Minden mező kitöltése kötelező');
        }

        // Ellenőrizzük, hogy létezik-e már ilyen nevű szolgáltatás
        $checkStmt = $conn->prepare("SELECT SzolgaltatasID FROM szolgaltatasok WHERE SzolgaltatasNev = ?");
        $checkStmt->bind_param("s", $name);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception('Már létezik ilyen nevű szolgáltatás');
        }

        // Szolgáltatás hozzáadása
        $stmt = $conn->prepare("INSERT INTO szolgaltatasok (SzolgaltatasNev, Ar, IdotartamPerc, Leiras, KepURL) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("siiss", $name, $price, $duration, $description, $newFileName);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Szolgáltatás sikeresen hozzáadva'
            ]);
        } else {
            throw new Exception('Nem sikerült hozzáadni a szolgáltatást');
        }

    } catch (Exception $e) {
        // Hiba esetén töröljük a feltöltött képet
        if (file_exists($uploadFile)) {
            unlink($uploadFile);
        }
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 