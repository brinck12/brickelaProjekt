<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once '../config.php';
require_once '../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $decoded = verifyToken();
        
        // Check user role
        $stmt = $conn->prepare("SELECT Osztaly, UgyfelID FROM ugyfelek WHERE UgyfelID = ?");
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if (!$result || !in_array($result['Osztaly'], ['Adminisztrátor', 'Barber'])) {
            throw new Exception('Unauthorized access');
        }

        $isAdmin = $result['Osztaly'] === 'Adminisztrátor';
        $userId = $result['UgyfelID'];

        // Get barber ID if user is a barber
        $barberId = null;
        if (!$isAdmin) {
            $stmt = $conn->prepare("SELECT FodraszID FROM fodraszok WHERE UgyfelID = ?");
            if (!$stmt) {
                throw new Exception('Failed to prepare barber query: ' . $conn->error);
            }
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $barberResult = $stmt->get_result()->fetch_assoc();
            
            if (!$barberResult) {
                throw new Exception('No barber profile found for this user. Please contact an administrator.');
            }
            
            $barberId = $barberResult['FodraszID'];
            if (!$barberId) {
                throw new Exception('Invalid barber ID');
            }
        }

        // Base query parts
        $whereClause = $isAdmin ? "" : "WHERE f.FodraszID = ?";
        
        // Get total appointments
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM foglalasok f " . $whereClause);
        if (!$isAdmin) $stmt->bind_param("i", $barberId);
        $stmt->execute();
        $totalAppointments = $stmt->get_result()->fetch_assoc()['total'];

        // Get today's appointments
        $stmt = $conn->prepare("SELECT COUNT(*) as today FROM foglalasok f " . 
            ($isAdmin ? "WHERE DATE(FoglalasDatum) = CURDATE()" : 
            "WHERE DATE(FoglalasDatum) = CURDATE() AND f.FodraszID = ?"));
        if (!$isAdmin) $stmt->bind_param("i", $barberId);
        $stmt->execute();
        $todayAppointments = $stmt->get_result()->fetch_assoc()['today'];

        // Get total customers (unique customers for barber)
        if ($isAdmin) {
            $stmt = $conn->prepare("SELECT COUNT(*) as total FROM ugyfelek WHERE Osztaly = 'Felhasználó'");
        } else {
            $stmt = $conn->prepare("SELECT COUNT(DISTINCT UgyfelID) as total FROM foglalasok WHERE FodraszID = ?");
            $stmt->bind_param("i", $barberId);
        }
        $stmt->execute();
        $totalCustomers = $stmt->get_result()->fetch_assoc()['total'];

        // Get recent appointments
        $query = "
            SELECT 
                f.FoglalasID as id,
                CONCAT(u.Vezeteknev, ' ', u.Keresztnev) as customerName,
                sz.SzolgaltatasNev as service,
                f.FoglalasDatum as date,
                f.FoglalasIdo as time,
                f.Allapot as status,
                f.Megjegyzes as note,
                fo.FodraszID as barberId,
                CONCAT(fo.Vezeteknev, ' ', fo.Keresztnev) as barberName
            FROM foglalasok f
            JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
            JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
            JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
            " . ($isAdmin ? "" : "WHERE f.FodraszID = ? ") . "
            ORDER BY f.FoglalasDatum DESC, f.FoglalasIdo DESC
            LIMIT 10
        ";
        
        $stmt = $conn->prepare($query);
        if (!$isAdmin) $stmt->bind_param("i", $barberId);
        $stmt->execute();
        $recentAppointments = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        $response = [
            'success' => true,
            'stats' => [
                'totalAppointments' => $totalAppointments,
                'todayAppointments' => $todayAppointments,
                'totalCustomers' => $totalCustomers
            ],
            'recentAppointments' => $recentAppointments
        ];

        // Add total barbers count only for admin
        if ($isAdmin) {
            $stmt = $conn->prepare("SELECT COUNT(*) as total FROM fodraszok");
            $stmt->execute();
            $response['stats']['totalBarbers'] = $stmt->get_result()->fetch_assoc()['total'];
        }

        echo json_encode($response);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 