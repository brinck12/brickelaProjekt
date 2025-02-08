<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../email-templates/thank-you-email.php';

try {
    // Create test data
    $testData = [
        'customer_name' => 'Test User',
        'barber_name' => 'Test Barber',
        'service_name' => 'Test Service',
        'reviewToken' => 'test_token_' . time()
    ];
    
    // Initialize email service
    $emailService = new EmailService();
    
    // Get email template content
    $emailContent = getThankYouEmailTemplate(
        $testData['customer_name'],
        $testData['barber_name'],
        $testData['service_name'],
        $testData['reviewToken']
    );
    
    // Send test email
    $result = $emailService->sendThankYouEmail(
        SMTP_USERNAME, // Send to the same email configured in config.php for testing
        $emailContent
    );
    
    // Log success
    $logMessage = date('Y-m-d H:i:s') . " - Test email sent successfully\n";
    file_put_contents(__DIR__ . '/../../logs/email-test.log', $logMessage, FILE_APPEND);
    
    echo "Test email sent successfully. Check " . SMTP_USERNAME . " for the email.\n";
    
} catch (Exception $e) {
    // Log error
    $errorMessage = date('Y-m-d H:i:s') . " - Error sending test email: " . $e->getMessage() . "\n";
    file_put_contents(__DIR__ . '/../../logs/email-test.log', $errorMessage, FILE_APPEND);
    
    echo "Error sending test email: " . $e->getMessage() . "\n";
} 