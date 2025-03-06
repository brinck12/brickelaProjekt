<?php
require_once '../config.php';
require_once '../cors_headers.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Először keressük meg az ügyfelet email alapján
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    if (!$email) {
        throw new Exception('Email is required');
    }

    // Form adatok validálása
    $experience = isset($_POST['experience']) ? intval($_POST['experience']) : null;
    $specialization = isset($_POST['specialization']) ? $_POST['specialization'] : null;
    $details = isset($_POST['details']) ? $_POST['details'] : null;
    $startTime = isset($_POST['startTime']) ? $_POST['startTime'] : null;
    $endTime = isset($_POST['endTime']) ? $_POST['endTime'] : null;

    // Ügyfél keresése email alapján
    $userStmt = $conn->prepare("SELECT UgyfelID, Vezeteknev, Keresztnev FROM ugyfelek WHERE Email = ?");
    $userStmt->bind_param("s", $email);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    
    if ($userResult->num_rows === 0) {
        throw new Exception('User not found with this email');
    }

    $user = $userResult->fetch_assoc();
    $ugyfelId = $user['UgyfelID'];

    // Ellenőrizzük, hogy létezik-e már a felhasználó a fodraszok táblában
    $stmt = $conn->prepare("SELECT FodraszID, Aktiv FROM fodraszok WHERE UgyfelID = ?");
    $stmt->bind_param("i", $ugyfelId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $barber = $result->fetch_assoc();
        if ($barber['Aktiv'] == 0) {
            // Ha van új kép feltöltve
            $newFileName = null;
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = '../../imgs/';
                $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $newFileName = uniqid('barber_') . '.' . $fileExtension;
                $uploadFile = $uploadDir . $newFileName;

                if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                    throw new Exception('Failed to save image');
                }
            }

            // Ha létezik, de inaktív, akkor aktiváljuk és frissítjük az adatait
            $updateQuery = "UPDATE fodraszok SET 
                Aktiv = 1, 
                evtapasztalat = ?, 
                specializacio = ?, 
                reszletek = ?, 
                KezdesIdo = ?, 
                BefejezesIdo = ?";
            
            // Ha van új kép, azt is frissítjük
            if ($newFileName) {
                $updateQuery .= ", kep = ?";
            }
            
            $updateQuery .= " WHERE UgyfelID = ?";
            
            $stmt = $conn->prepare($updateQuery);
            
            if ($newFileName) {
                $stmt->bind_param("isssssi", $experience, $specialization, $details, $startTime, $endTime, $newFileName, $ugyfelId);
            } else {
                $stmt->bind_param("issssi", $experience, $specialization, $details, $startTime, $endTime, $ugyfelId);
            }
            
            if ($stmt->execute()) {
                // Frissítsük az ügyfél szerepkörét is
                $stmt = $conn->prepare("UPDATE ugyfelek SET Osztaly = 'Barber' WHERE UgyfelID = ?");
                $stmt->bind_param("i", $ugyfelId);
                $stmt->execute();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Borbély sikeresen újraaktiválva és adatai frissítve'
                ]);
            } else {
                throw new Exception('Nem sikerült aktiválni a borbélyt');
            }
        } else {
            throw new Exception('Ez a felhasználó már aktív borbély');
        }
        exit;
    }

    // Ha idáig eljutunk, akkor új borbélyt hozzáadása következik
    // Kép kezelése
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Image upload failed');
    }

    $uploadDir = '../../imgs/';
    $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $newFileName = uniqid('barber_') . '.' . $fileExtension;
    $uploadFile = $uploadDir . $newFileName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
        throw new Exception('Failed to save image');
    }

    try {
        // Adatok validálása
        $vezeteknev = $user['Vezeteknev'];
        $keresztnev = $user['Keresztnev'];
        
        // Aktív állapot beállítása
        $aktiv = 1;

        // Borbély hozzáadása
        $stmt = $conn->prepare("INSERT INTO fodraszok (UgyfelID, Vezeteknev, Keresztnev, evtapasztalat, specializacio, reszletek, KezdesIdo, BefejezesIdo, kep, Aktiv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ississsssi", $ugyfelId, $vezeteknev, $keresztnev, $experience, $specialization, $details, $startTime, $endTime, $newFileName, $aktiv);
        
        if ($stmt->execute()) {
            // Get the newly inserted barber ID
            $newBarberId = $conn->insert_id;
            
            // Create a response with the new barber data
            $newBarber = [
                'id' => $newBarberId,
                'nev' => $vezeteknev . ' ' . $keresztnev,
                'kep' => $newFileName,
                'evtapasztalat' => $experience,
                'specializacio' => $specialization,
                'reszletek' => $details,
                'KezdesIdo' => $startTime,
                'BefejezesIdo' => $endTime,
                'Aktiv' => $aktiv,
                'Vezeteknev' => $vezeteknev,
                'Keresztnev' => $keresztnev
            ];
            
            echo json_encode([
                'success' => true,
                'message' => 'Barber added successfully',
                'barber' => $newBarber
            ]);
        } else {
            throw new Exception('Failed to add barber');
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