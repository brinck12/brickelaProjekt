<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Verify user authentication and admin role
        $decoded = verifyToken();
        
        // Check if user is admin
        $stmt = $conn->prepare("SELECT Osztaly FROM ugyfelek WHERE UgyfelID = ?");
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if (!$result || $result['Osztaly'] !== 'Adminisztrátor') {
            throw new Exception('Unauthorized access');
        }

        // Get total appointments
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM foglalasok");
        $stmt->execute();
        $totalAppointments = $stmt->get_result()->fetch_assoc()['total'];

        // Get today's appointments
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM foglalasok WHERE DATE(FoglalasDatum) = CURDATE()");
        $stmt->execute();
        $todayAppointments = $stmt->get_result()->fetch_assoc()['total'];

        // Get total customers
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM ugyfelek WHERE Osztaly = 'Felhasználó'");
        $stmt->execute();
        $totalCustomers = $stmt->get_result()->fetch_assoc()['total'];

        // Get total barbers
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM fodraszok");
        $stmt->execute();
        $totalBarbers = $stmt->get_result()->fetch_assoc()['total'];

        // Get recent appointments
        $stmt = $conn->prepare("
            SELECT 
                f.FoglalasID as id,
                CONCAT(u.Keresztnev, ' ', u.Vezeteknev) as customerName,
                s.SzolgaltatasNev as service,
                DATE_FORMAT(f.FoglalasDatum, '%Y-%m-%d') as date,
                TIME_FORMAT(f.FoglalasIdo, '%H:%i') as time,
                f.Allapot as status
            FROM foglalasok f
            JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
            JOIN szolgaltatasok s ON f.SzolgaltatasID = s.SzolgaltatasID
            ORDER BY f.FoglalasDatum DESC, f.FoglalasIdo DESC
            LIMIT 10
        ");
        $stmt->execute();
        $recentAppointments = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'success' => true,
            'stats' => [
                'totalAppointments' => (int)$totalAppointments,
                'todayAppointments' => (int)$todayAppointments,
                'totalCustomers' => (int)$totalCustomers,
                'totalBarbers' => (int)$totalBarbers
            ],
            'recentAppointments' => $recentAppointments
        ]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 