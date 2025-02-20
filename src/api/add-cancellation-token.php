<?php
require_once 'config.php';

try {
    // Add CancellationToken column to foglalasok table
    $sql = "
    ALTER TABLE foglalasok 
    ADD COLUMN IF NOT EXISTS CancellationToken VARCHAR(255) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS LemondasIdopontja DATETIME DEFAULT NULL;
    ";
    
    if ($conn->query($sql)) {
        echo "Successfully added CancellationToken and LemondasIdopontja columns to foglalasok table\n";
    } else {
        throw new Exception("Error adding columns: " . $conn->error);
    }
    
    // Create index for better performance
    $sql = "
    CREATE INDEX IF NOT EXISTS idx_cancellation_token 
    ON foglalasok(CancellationToken);
    ";
    
    if ($conn->query($sql)) {
        echo "Successfully created index on CancellationToken\n";
    } else {
        throw new Exception("Error creating index: " . $conn->error);
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    $conn->close();
} 