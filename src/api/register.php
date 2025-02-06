<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'services/EmailService.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid request data');
        }

        // Input validation
        if (!isset($data['email'], $data['password'], $data['keresztnev'], $data['vezeteknev'], $data['telefonszam'])) {
            throw new Exception('Missing required fields');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        if (strlen($data['password']) < 8) {
            throw new Exception('Password must be at least 8 characters long');
        }

        if (empty($data['keresztnev']) || strlen($data['keresztnev']) < 2) {
            throw new Exception('First name is required and must be at least 2 characters');
        }

        if (empty($data['vezeteknev']) || strlen($data['vezeteknev']) < 2) {
            throw new Exception('Last name is required and must be at least 2 characters');
        }

        if (empty($data['telefonszam']) || !preg_match('/^[0-9+\-\s()]{6,20}$/', $data['telefonszam'])) {
            throw new Exception('Invalid phone number format');
        }

        // Prepare data
        $keresztnev = $data['keresztnev'];
        $vezeteknev = $data['vezeteknev'];
        $email = $data['email'];
        $telefonszam = $data['telefonszam'];
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $osztaly = 'Felhasználó';
        $regisztracioIdopontja = date('Y-m-d H:i:s');
        $verificationToken = bin2hex(random_bytes(32));
        $aktiv = 0; // Account starts as inactive

        // Check if email already exists
        $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            throw new Exception('Email is already registered');
        }
        $stmt->close();

        // Check if phone number already exists
        $stmt = $conn->prepare("SELECT 1 FROM ugyfelek WHERE Telefonszam = ?");
        $stmt->bind_param("s", $telefonszam);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            throw new Exception('Phone number is already registered');
        }
        $stmt->close();

        // Start transaction
        $conn->begin_transaction();

        try {
            // Insert new user
            $stmt = $conn->prepare("INSERT INTO ugyfelek 
                (Keresztnev, Vezeteknev, Telefonszam, Email, Jelszo, Osztaly, RegisztracioIdopontja, VerificationToken, Aktiv) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->bind_param("ssssssssi", 
                $keresztnev,
                $vezeteknev,
                $telefonszam,
                $email,
                $password,
                $osztaly,
                $regisztracioIdopontja,
                $verificationToken,
                $aktiv
            );

            if (!$stmt->execute()) {
                throw new Exception('Registration failed: ' . $stmt->error);
            }

            // Send verification email
            $emailService = new EmailService();
            $emailService->sendRegistrationEmail($email, $keresztnev, $verificationToken);

            // Commit transaction
            $conn->commit();

            echo json_encode([
                'success' => true, 
                'message' => 'Registration successful. Please check your email to verify your account.'
            ]);

        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            throw $e;
        } finally {
            $stmt->close();
        }

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
