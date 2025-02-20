<?php
require_once 'config.php';

try {
    // Get the most recent booking
    $query = "
        SELECT 
            f.FoglalasID,
            f.FoglalasDatum,
            f.FoglalasIdo,
            f.Allapot,
            f.CancellationToken,
            f.LetrehozasIdopontja,
            CONCAT(u.Keresztnev, ' ', u.Vezeteknev) as UgyfelNev,
            u.Email as UgyfelEmail
        FROM foglalasok f
        JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
        ORDER BY f.LetrehozasIdopontja DESC
        LIMIT 1
    ";
    
    $result = $conn->query($query);
    
    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        echo "Most recent booking:\n";
        echo "Booking ID: " . $booking['FoglalasID'] . "\n";
        echo "Customer: " . $booking['UgyfelNev'] . "\n";
        echo "Email: " . $booking['UgyfelEmail'] . "\n";
        echo "Date: " . $booking['FoglalasDatum'] . "\n";
        echo "Time: " . $booking['FoglalasIdo'] . "\n";
        echo "Status: " . $booking['Allapot'] . "\n";
        echo "Created At: " . $booking['LetrehozasIdopontja'] . "\n";
        echo "Cancellation Token: " . ($booking['CancellationToken'] ?? 'NULL') . "\n";
        
        if ($booking['CancellationToken'] === null) {
            echo "\nWARNING: No cancellation token was generated for this booking!\n";
        } else {
            echo "\nCancellation token was generated successfully.\n";
            echo "Token length: " . strlen($booking['CancellationToken']) . " characters\n";
        }
    } else {
        echo "No bookings found in the database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 