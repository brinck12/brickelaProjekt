<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/email-templates/registration-email.php';

try {
    $email = "kissboldizsar2004@gmail.com";
    $token = bin2hex(random_bytes(32));
    
    // First, check if user exists and get their current status
    $checkStmt = $conn->prepare("SELECT UgyfelID, Keresztnev, Aktiv, VerificationToken FROM ugyfelek WHERE Email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("User not found with email: " . $email);
    }
    
    $user = $result->fetch_assoc();
    echo "User found:\n";
    echo "ID: " . $user['UgyfelID'] . "\n";
    echo "Current Aktiv status: " . $user['Aktiv'] . "\n";
    echo "Current Token: " . ($user['VerificationToken'] ?? 'NULL') . "\n";
    
    // Update user with new token
    $updateStmt = $conn->prepare("UPDATE ugyfelek SET VerificationToken = ?, Aktiv = 0, EmailVerifiedAt = NULL WHERE UgyfelID = ?");
    $updateStmt->bind_param("si", $token, $user['UgyfelID']);
    
    if (!$updateStmt->execute()) {
        throw new Exception("Failed to update user: " . $updateStmt->error);
    }
    
    echo "Rows affected by update: " . $updateStmt->affected_rows . "\n";
    
    // Verify the update
    $verifyStmt = $conn->prepare("SELECT Aktiv, VerificationToken FROM ugyfelek WHERE UgyfelID = ?");
    $verifyStmt->bind_param("i", $user['UgyfelID']);
    $verifyStmt->execute();
    $verifyResult = $verifyStmt->get_result();
    $updatedUser = $verifyResult->fetch_assoc();
    
    echo "\nAfter update:\n";
    echo "New Aktiv status: " . $updatedUser['Aktiv'] . "\n";
    echo "New Token: " . $updatedUser['VerificationToken'] . "\n";
    
    // Send the email
    $activationLink = "http://localhost:5173/activate?token=" . $token;
    $emailContent = getRegistrationEmailContent($user['Keresztnev'], $activationLink);
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: BrickelaCuts <noreply@brickelacuts.com>' . "\r\n";
    
    if (mail($email, "Aktiváld a fiókodat", $emailContent, $headers)) {
        echo "\nTest registration email sent successfully!\n";
    } else {
        throw new Exception("Failed to send email");
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    if (isset($conn)) {
        $conn->close();
    }
} 