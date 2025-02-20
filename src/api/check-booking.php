<?php
require_once 'config.php';

try {
    // Check for bookings with cancellation tokens
    $query = "
        SELECT 
            FoglalasID,
            FoglalasDatum,
            FoglalasIdo,
            Allapot,
            CancellationToken,
            LemondasIdopontja
        FROM foglalasok 
        WHERE CancellationToken IS NOT NULL 
        OR Allapot = 'Foglalt'
        LIMIT 5
    ";
    
    $result = $conn->query($query);
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "Booking ID: " . $row['FoglalasID'] . "\n";
            echo "Date: " . $row['FoglalasDatum'] . "\n";
            echo "Time: " . $row['FoglalasIdo'] . "\n";
            echo "Status: " . $row['Allapot'] . "\n";
            echo "Cancellation Token: " . ($row['CancellationToken'] ?? 'NULL') . "\n";
            echo "Cancellation Date: " . ($row['LemondasIdopontja'] ?? 'NULL') . "\n";
            echo "----------------------------------------\n";
        }
    } else {
        echo "No bookings found with cancellation tokens.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    $conn->close();
} 