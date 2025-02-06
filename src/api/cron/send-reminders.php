<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../services/EmailService.php';

try {
    // Get all appointments for tomorrow
    $tomorrow = date('Y-m-d', strtotime('+1 day'));
    
    $query = "
        SELECT 
            f.FoglalasDatum as datum,
            f.FoglalasIdo as idopont,
            sz.IdotartamPerc as idotartam,
            sz.Ar as ar,
            u.Email as email,
            u.Keresztnev,
            fo.Keresztnev as borbely_nev,
            sz.SzolgaltatasNev as szolgaltatas_nev
        FROM foglalasok f
        JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
        JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
        JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
        WHERE 
            DATE(f.FoglalasDatum) = ? 
            AND f.Allapot = 'Foglalt'
            AND f.emlekeztetoElkuldve = 0
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $tomorrow);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $emailService = new EmailService();
    $remindersSent = 0;
    
    while ($booking = $result->fetch_assoc()) {
        try {
            $emailService->sendAppointmentReminder($booking['email'], $booking);
            
            // Mark reminder as sent
            $updateQuery = "
                UPDATE foglalasok 
                SET emlekeztetoElkuldve = 1 
                WHERE 
                    UgyfelID = (SELECT UgyfelID FROM ugyfelek WHERE Email = ?)
                    AND FoglalasDatum = ?
                    AND FoglalasIdo = ?
            ";
            
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("sss", $booking['email'], $booking['datum'], $booking['idopont']);
            $updateStmt->execute();
            $updateStmt->close();
            
            $remindersSent++;
            
        } catch (Exception $e) {
            error_log("Failed to send reminder to {$booking['email']}: " . $e->getMessage());
            continue;
        }
    }
    
    $stmt->close();
    
    echo "Successfully sent {$remindersSent} reminder(s) for tomorrow's appointments.\n";
    
} catch (Exception $e) {
    error_log("Error in reminder script: " . $e->getMessage());
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close(); 