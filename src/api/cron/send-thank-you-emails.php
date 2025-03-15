<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/mail.php';

try {
    // Get completed appointments that haven't had thank you emails sent
    $stmt = $conn->prepare("
        SELECT 
            f.FoglalasID,
            f.FoglalasDatum,
            f.FoglalasIdo,
            u.Email,
            u.Keresztnev as user_firstname,
            b.Keresztnev as barber_firstname,
            b.Vezeteknev as barber_lastname
        FROM foglalasok f
        JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
        JOIN fodraszok b ON f.FodraszID = b.FodraszID
        WHERE f.Allapot = 'Teljesítve'
        AND f.thankyou_email_sent = FALSE
        AND f.FoglalasDatum <= CURDATE()
        AND f.FoglalasIdo <= CURTIME()
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    while ($booking = $result->fetch_assoc()) {
        // Generate review token
        $token = bin2hex(random_bytes(32));
        $expiryDate = date('Y-m-d H:i:s', strtotime('+7 days'));

        // Insert review token
        $insertToken = $conn->prepare("
            INSERT INTO reviews (
                FoglalasID,
                Token,
                ExpiresAt,
                Used,
                CreatedAt
            ) VALUES (?, ?, ?, FALSE, NOW())
        ");

        $insertToken->bind_param("iss", 
            $booking['FoglalasID'],
            $token,
            $expiryDate
        );

        if ($insertToken->execute()) {
            // Send thank you email with review link
            $to = $booking['Email'];
            $subject = "Köszönjük a látogatást!";
            
            $reviewLink = "http://localhost:5173/review?token=" . $token;
            
            $message = "Kedves {$booking['user_firstname']}!\n\n";
            $message .= "Köszönjük, hogy {$booking['barber_firstname']} {$booking['barber_lastname']} szolgáltatását választotta.\n";
            $message .= "Kérjük, értékelje a szolgáltatást az alábbi linken:\n";
            $message .= $reviewLink . "\n\n";
            $message .= "Az értékelési link 7 napig érvényes.\n\n";
            $message .= "Üdvözlettel,\nBrickelaCuts csapata";

            if (sendMail($to, $subject, $message)) {
                // Update booking to mark thank you email as sent
                $updateBooking = $conn->prepare("
                    UPDATE foglalasok 
                    SET thankyou_email_sent = TRUE 
                    WHERE FoglalasID = ?
                ");
                
                $updateBooking->bind_param("i", $booking['FoglalasID']);
                $updateBooking->execute();
            }
        }
    }

    echo "Thank you emails processed successfully.\n";

} catch (Exception $e) {
    echo "Error processing thank you emails: " . $e->getMessage() . "\n";
    exit(1);
}

$conn->close(); 