<?php
// Set CORS headers to allow requests from the frontend application
header('Access-Control-Allow-Origin: http://localhost:5173');  // Csak erről a domainről engedélyezünk kérést
header('Access-Control-Allow-Credentials: true');              // Engedélyezünk hitelesítési adatokat
header('Access-Control-Allow-Methods: POST, OPTIONS');         // Csak POST és OPTIONS metódusokat engedélyezünk
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Engedélyezünk Authorization fejlécet
header('Content-Type: application/json');                      // A válasz tartalma JSON formátumú

// OPTIONS kérés kezelése (előzetes kérés a tényleges kérés előtt)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Konfiguráció és hitelesítés szükséges fájlok beleértése
require_once 'config.php';         // Adatbázis kapcsolat és konfiguráció
require_once 'middleware/auth.php'; // Hitelesítés middleware
require_once 'services/EmailService.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Ellenőrizzük a felhasználó JWT tokent és dekódoljuk a felhasználói információt
        $decoded = verifyToken();
        
        // Olvassuk a raw POST adatot és konvertáljuk JSON-t PHP tömbbe
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Ellenőrizzük, hogy minden szükséges mező jelen van-e a kérésben
        if (!isset($data['barberId'], $data['serviceId'], $data['date'], $data['time'])) {
            throw new Exception('Hiányzó szükséges mezők');
        }
        
        // Konvertáljuk és ellenőrizzük a dátum és idő formátumokat
        $bookingDate = date('Y-m-d', strtotime($data['date']));
        $bookingTime = date('H:i', strtotime($data['time']));
        
        // Megakadályozzuk a múltbeli foglalásokat
        if ($bookingDate < date('Y-m-d')) {
            throw new Exception('Nem lehet foglalásokat múltbeli dátumokra');
        }
        
        // Ellenőrizzük, hogy a kért időpont már foglalt-e
        // Lekérjük a foglalasok (bookings) táblát, hogy megszámoljuk a meglévő foglalásokat
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM foglalasok 
            WHERE FodraszID = ? AND FoglalasDatum = ? AND FoglalasIdo = ?");
        // A bind_paramban az "iss" a változónak a típusát jelöli, például i az int, s az string ilyesmik
        $stmt->bind_param("iss", $data['barberId'], $bookingDate, $bookingTime);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        // Ha a megszámlálás > 0, az időpont már foglalt
        if ($result['count'] > 0) {
            throw new Exception('Ezt az időpontot már foglalták');
        }
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert booking
            $stmt = $conn->prepare("INSERT INTO foglalasok 
                (UgyfelID, FodraszID, SzolgaltatasID, FoglalasDatum, FoglalasIdo, Megjegyzes, LetrehozasIdopontja, Allapot) 
                VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Foglalt')");
            
            // Választható megjegyzések lekérdezése a kérésből vagy üres karakterlánc, ha nincs megadva
            $megjegyzes = $data['megjegyzes'] ?? '';
            
            // Bind parameters to the prepared statement
            $stmt->bind_param("iiisss", 
                $decoded->user_id,      // A dekódolt JWT tokenből lekérjük a felhasználó ID-jét
                $data['barberId'],      // Fodrasz ID a kérésből
                $data['serviceId'],     // Szolgáltatás ID a kérésből
                $bookingDate,           // Ellenőrzött foglalás dátuma
                $bookingTime,           // Ellenőrzött foglalás időpontja
                $megjegyzes            // Megjegyzések (opcionális)
            );
            
            // Végrehajtjuk az inserthez és visszaadjuk a megfelelő választ
            if (!$stmt->execute()) {
                throw new Exception('Foglalás létrehozása sikertelen');
            }

            $bookingId = $conn->insert_id;

            // Generate secure cancellation token
            $randomBytes = random_bytes(32);
            $cancellationToken = hash('sha256', $randomBytes . $bookingId . $decoded->user_id);
            
            // Store the cancellation token
            $tokenStmt = $conn->prepare("
                UPDATE foglalasok 
                SET CancellationToken = ?
                WHERE FoglalasID = ?
            ");
            $tokenStmt->bind_param("si", $cancellationToken, $bookingId);
            $tokenStmt->execute();

            // Get booking details for email
            $bookingQuery = $conn->prepare("
                SELECT 
                    f.FoglalasID,
                    f.FoglalasDatum as datum,
                    f.FoglalasIdo as idopont,
                    f.LetrehozasIdopontja,
                    f.CancellationToken,
                    sz.IdotartamPerc as idotartam,
                    sz.Ar as ar,
                    sz.SzolgaltatasNev as szolgaltatas_nev,
                    CONCAT(fo.Keresztnev, ' ', fo.Vezeteknev) as borbely_nev,
                    u.Email as email
                FROM foglalasok f
                JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
                JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
                JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
                WHERE f.FoglalasID = LAST_INSERT_ID()
            ");
            
            $bookingQuery->execute();
            $bookingDetails = $bookingQuery->get_result()->fetch_assoc();

            // Send confirmation email
            $emailService = new EmailService();
            $emailService->sendBookingConfirmation($bookingDetails['email'], $bookingDetails);

            // Commit transaction
            $conn->commit();
            
            echo json_encode(['success' => true, 'message' => 'Foglalás sikeresen létrehozva']);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        // Ha bármely hiba történik, visszaadjuk 400 Bad Request hibakódot és hibaüzenetet
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?> 