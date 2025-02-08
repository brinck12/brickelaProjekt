@echo off
REM Send appointment reminders for tomorrow's appointments
"C:\xampp\php\php.exe" "C:\xampp\htdocs\project\src\api\cron\send-reminders.php" >> "C:\xampp\htdocs\project\logs\reminders.log" 2>&1

REM Send thank you emails for completed appointments
"C:\xampp\php\php.exe" "C:\xampp\htdocs\project\src\api\cron\send-thank-you-emails.php" >> "C:\xampp\htdocs\project\logs\thank-you-emails.log" 2>&1
