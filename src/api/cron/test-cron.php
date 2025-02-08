<?php
$logFile = __DIR__ . '/../../logs/cron-test.log';
$timestamp = date('Y-m-d H:i:s');
$message = "[{$timestamp}] Cron job test successful\n";

// Create logs directory if it doesn't exist
if (!file_exists(dirname($logFile))) {
    mkdir(dirname($logFile), 0755, true);
}

// Append message to log file
file_put_contents($logFile, $message, FILE_APPEND);

echo $message; 