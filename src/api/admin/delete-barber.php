<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once '../config.php';
require_once '../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $decoded = verifyToken();
    
    // Check if user is admin
    $stmt = $conn->prepare("SELECT Osztaly FROM ugyfelek WHERE UgyfelID = ?");
    $stmt->bind_param("i", $decoded->user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    if (!$result || $result['Osztaly'] !== 'Adminisztrátor') {
        throw new Exception('Unauthorized access');
    }

    $barberId = isset($_POST['id']) ? intval($_POST['id']) : null;
    if (!$barberId) {
        throw new Exception('Barber ID is required');
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Get UgyfelID for the barber
        $stmt = $conn->prepare("SELECT UgyfelID FROM fodraszok WHERE FodraszID = ?");
        $stmt->bind_param("i", $barberId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if (!$result) {
            throw new Exception('Barber not found');
        }
        
        $userId = $result['UgyfelID'];

        // Deactivate barber
        $stmt = $conn->prepare("UPDATE fodraszok SET Aktiv = 0 WHERE FodraszID = ?");
        $stmt->bind_param("i", $barberId);
        $stmt->execute();

        // Update user role back to 'Felhasználó'
        $stmt = $conn->prepare("UPDATE ugyfelek SET Osztaly = 'Felhasználó' WHERE UgyfelID = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        // Update all future appointments to 'Lemondva'
        $stmt = $conn->prepare("
            UPDATE foglalasok 
            SET Allapot = 'Lemondva' 
            WHERE FodraszID = ? 
            AND FoglalasDatum >= CURDATE() 
            AND Allapot = 'Foglalt'
        ");
        $stmt->bind_param("i", $barberId);
        $stmt->execute();

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Barber successfully deactivated'
        ]);

    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
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