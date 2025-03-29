<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/services/EmailService.php';

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
            b.Vezeteknev as barber_lastname,
            sz.SzolgaltatasNev as szolgaltatas_nev,
            sz.Ar as ar
        FROM foglalasok f
        JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
        JOIN fodraszok b ON f.FodraszID = b.FodraszID
        JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
        WHERE f.Allapot = 'Teljesítve'
        AND f.thankyou_email_sent = 0
        AND f.FoglalasDatum <= CURDATE()
        AND f.FoglalasIdo <= CURTIME()
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    // Initialize email service
    $emailService = new EmailService();

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
            // Create HTML email content
            $reviewLink = "http://localhost:5173/review?token=" . $token;
            $emailContent = '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Köszönjük a látogatást!</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
                <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <h1 style="color: #c0a080; margin: 0; font-size: 24px;">BrickEla Cuts</h1>
                    </div>
                    
                    <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                        <h2 style="color: #c0a080; font-size: 20px; margin-bottom: 15px;">Köszönjük a látogatást!</h2>
                        
                        <p style="font-size: 14px; line-height: 1.5; color: #ffffff;">Kedves ' . htmlspecialchars($booking['user_firstname']) . '!</p>
                        
                        <p style="font-size: 14px; line-height: 1.5; color: #ffffff;">Köszönjük, hogy ' . htmlspecialchars($booking['barber_firstname'] . ' ' . $booking['barber_lastname']) . ' szolgáltatását választotta.</p>
                        
                        <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px;">
                            <p style="margin: 8px 0;"><strong style="color: #c0a080;">Szolgáltatás:</strong> <span style="color: #ffffff;">' . htmlspecialchars($booking['szolgaltatas_nev']) . '</span></p>
                            <p style="margin: 8px 0;"><strong style="color: #c0a080;">Ár:</strong> <span style="color: #ffffff;">' . number_format($booking['ar'], 0, ',', ' ') . ' Ft</span></p>
                        </div>
                        
                        <p style="font-size: 14px; line-height: 1.5; color: #ffffff;">Kérjük, értékelje a szolgáltatást az alábbi gombra kattintva:</p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="' . $reviewLink . '" 
                               style="display: inline-block; padding: 10px 20px; background-color: #c0a080; color: #ffffff; 
                                      text-decoration: none; border-radius: 4px; font-size: 14px;">
                                Értékelés írása
                            </a>
                        </div>
                        
                        <p style="font-size: 12px; color: #888;">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:</p>
                        <p style="word-break: break-all; color: #c0a080; font-size: 12px;">' . $reviewLink . '</p>
                        
                        <p style="font-size: 12px; color: #888; margin-top: 20px;">Az értékelési link 7 napig érvényes.</p>
                    </div>
                    
                    <div style="text-align: center; padding: 15px; color: rgba(255,255,255,0.5); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 20px;">
                        <p style="margin: 5px 0;">© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                        <p style="margin: 5px 0;">Cím: 1234 Budapest, Példa utca 123.</p>
                    </div>
                </div>
            </body>
            </html>';

            // Send thank you email
            if ($emailService->sendThankYouEmail($booking['Email'], $emailContent)) {
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