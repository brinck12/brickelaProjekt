<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';
require_once '../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verify user authentication and admin role
        $decoded = verifyToken();
        
        // Check if user is admin
        $stmt = $conn->prepare("SELECT Osztaly FROM ugyfelek WHERE UgyfelID = ?");
        $stmt->bind_param("i", $decoded->user_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if (!$result || $result['Osztaly'] !== 'Adminisztrátor') {
            throw new Exception('Unauthorized access');
        }

        // Handle file upload
        if (!isset($_FILES['image'])) {
            throw new Exception('No image file uploaded');
        }

        $image = $_FILES['image'];
        $imageFileType = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($imageFileType, $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPG, JPEG, PNG & WEBP files are allowed.');
        }

        // Generate unique filename
        $newFileName = uniqid() . '.' . $imageFileType;
        $uploadPath = '../../uploads/barbers/' . $newFileName;

        // Create directory if it doesn't exist
        if (!file_exists('../../uploads/barbers/')) {
            mkdir('../../uploads/barbers/', 0777, true);
        }

        if (!move_uploaded_file($image['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to upload image');
        }

        // Get form data
        $data = $_POST;
        
        if (!isset($data['firstName'], $data['lastName'], $data['experience'], $data['specialization'], $data['startTime'], $data['endTime'])) {
            throw new Exception('Missing required fields');
        }

        // Insert barber data
        $stmt = $conn->prepare("
            INSERT INTO fodraszok (
                Keresztnev,
                Vezeteknev,
                evtapasztalat,
                specializacio,
                reszletek,
                kep,
                KezdesIdo,
                BefejezesIdo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "ssisssss",
            $data['firstName'],
            $data['lastName'],
            $data['experience'],
            $data['specialization'],
            $data['details'],
            $newFileName,
            $data['startTime'],
            $data['endTime']
        );

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Barber added successfully',
                'barberId' => $stmt->insert_id
            ]);
        } else {
            // Delete uploaded image if database insert fails
            unlink($uploadPath);
            throw new Exception('Failed to add barber');
        }

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}
?> 