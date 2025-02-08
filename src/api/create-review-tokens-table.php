<?php
require_once 'config.php';

try {
    // Create review_tokens table
    $sql = "
    CREATE TABLE IF NOT EXISTS review_tokens (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        FoglalasID INT NOT NULL,
        Token VARCHAR(255) NOT NULL,
        ExpiresAt DATETIME NOT NULL,
        Used TINYINT(1) DEFAULT 0,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (FoglalasID) REFERENCES foglalasok(FoglalasID),
        UNIQUE KEY unique_token (Token)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    if ($conn->query($sql)) {
        echo "review_tokens table created successfully\n";
    } else {
        throw new Exception("Error creating review_tokens table: " . $conn->error);
    }
    
    // Add thankyou_email_sent column to foglalasok table if it doesn't exist
    $sql = "
    ALTER TABLE foglalasok 
    ADD COLUMN IF NOT EXISTS thankyou_email_sent TINYINT(1) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS review_rating INT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS review_comment TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS review_date TIMESTAMP NULL DEFAULT NULL;
    ";
    
    if ($conn->query($sql)) {
        echo "foglalasok table updated successfully\n";
    } else {
        throw new Exception("Error updating foglalasok table: " . $conn->error);
    }
    
    // Create index for performance
    $sql = "
    CREATE INDEX IF NOT EXISTS idx_thankyou_email 
    ON foglalasok(Allapot, thankyou_email_sent, FoglalasDatum, FoglalasIdo);
    ";
    
    if ($conn->query($sql)) {
        echo "Index created successfully\n";
    } else {
        throw new Exception("Error creating index: " . $conn->error);
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

$conn->close(); 