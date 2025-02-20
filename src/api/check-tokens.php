<?php
require_once 'config.php';

try {
    // Query to get bookings with cancellation tokens
    $query = "
        SELECT FoglalasID, FoglalasDatum, FoglalasIdo, Allapot, CancellationToken, LemondasIdopontja
        FROM foglalasok
        WHERE CancellationToken IS NOT NULL
           OR Allapot = 'Foglalt'
        ORDER BY FoglalasDatum DESC, FoglalasIdo DESC
        LIMIT 5
    ";
    
    $result = $conn->query($query);
    
    if ($result->num_rows > 0) {
        echo "Found " . $result->num_rows . " bookings:\n\n";
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
    if (isset($conn)) {
        $conn->close();
    }
}
?> 