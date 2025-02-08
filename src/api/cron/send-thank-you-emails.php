<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../email-templates/thank-you-email.php';

try {
    // Get appointments that ended 30 minutes ago and haven't received a thank you email
    $query = "
        SELECT 
            f.FoglalasID,
            f.FoglalasDatum,
            f.FoglalasIdo,
            sz.IdotartamPerc,
            u.Email,
            u.Keresztnev as customer_name,
            CONCAT(fo.Keresztnev, ' ', fo.Vezeteknev) as barber_name,
            sz.SzolgaltatasNev as service_name
        FROM foglalasok f
        JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
        JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
        JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
        WHERE 
            f.Allapot = 'Teljesítve'
            AND f.thankyou_email_sent = 0
            AND CONCAT(f.FoglalasDatum, ' ', f.FoglalasIdo) <= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
            AND CONCAT(f.FoglalasDatum, ' ', f.FoglalasIdo) >= DATE_SUB(NOW(), INTERVAL 35 MINUTE)
    ";
    
    $result = $conn->query($query);
    $emailService = new EmailService();
    $emailsSent = 0;
    
    while ($booking = $result->fetch_assoc()) {
        try {
            // Generate review token
            $reviewToken = bin2hex(random_bytes(32));
            
            // Store review token in database
            $storeToken = $conn->prepare("
                INSERT INTO review_tokens (
                    FoglalasID,
                    Token,
                    ExpiresAt
                ) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
            ");
            
            $storeToken->bind_param("is", 
                $booking['FoglalasID'],
                $reviewToken
            );
            $storeToken->execute();
            
            // Send thank you email
            $emailContent = getThankYouEmailTemplate(
                $booking['customer_name'],
                $booking['barber_name'],
                $booking['service_name'],
                $reviewToken
            );
            
            $emailService->sendThankYouEmail(
                $booking['Email'],
                $emailContent
            );
            
            // Mark email as sent
            $updateBooking = $conn->prepare("
                UPDATE foglalasok 
                SET thankyou_email_sent = 1 
                WHERE FoglalasID = ?
            ");
            
            $updateBooking->bind_param("i", $booking['FoglalasID']);
            $updateBooking->execute();
            
            $emailsSent++;
            
        } catch (Exception $e) {
            error_log("Failed to send thank you email for booking {$booking['FoglalasID']}: " . $e->getMessage());
            continue;
        }
    }
    
    echo "Successfully sent {$emailsSent} thank you email(s).\n";
    
} catch (Exception $e) {
    error_log("Error in thank you email script: " . $e->getMessage());
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close(); 