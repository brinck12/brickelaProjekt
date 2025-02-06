<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../config.php';

class EmailService {
    private $mailer;
    private $fromEmail;
    private $fromName;

    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->setupMailer();
        $this->fromEmail = SMTP_USERNAME;
        $this->fromName = 'BrickEla Cuts';
    }

    private function setupMailer() {
        try {
            $this->mailer->isSMTP();
            $this->mailer->Host = SMTP_HOST;
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = SMTP_USERNAME;
            $this->mailer->Password = SMTP_PASSWORD;
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = SMTP_PORT;
            $this->mailer->CharSet = 'UTF-8';
            $this->mailer->isHTML(true);
            
            // Set sender information
            $this->fromEmail = SMTP_USERNAME;
            $this->fromName = 'BrickEla Cuts';
            $this->mailer->setFrom($this->fromEmail, $this->fromName);
        } catch (Exception $e) {
            throw new Exception('Mailer configuration failed: ' . $e->getMessage());
        }
    }

    public function sendRegistrationEmail($email, $keresztnev, $token) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($email);
            $this->mailer->Subject = 'Regisztráció megerősítése - BrickEla Cuts';
            
            $activationLink = "http://localhost:5173/activate?token=" . $token;
            $emailBody = $this->getRegistrationEmailTemplate($keresztnev, $activationLink);
            
            $this->mailer->Body = $emailBody;
            $this->mailer->AltBody = strip_tags($emailBody);
            
            return $this->mailer->send();
        } catch (Exception $e) {
            throw new Exception('Failed to send registration email: ' . $e->getMessage());
        }
    }

    public function sendBookingConfirmation($email, $booking) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($email);
            $this->mailer->Subject = 'Foglalás visszaigazolása - BrickEla Cuts';
            
            $emailBody = $this->getBookingConfirmationTemplate($booking);
            
            $this->mailer->Body = $emailBody;
            $this->mailer->AltBody = strip_tags($emailBody);
            
            return $this->mailer->send();
        } catch (Exception $e) {
            throw new Exception('Failed to send booking confirmation: ' . $e->getMessage());
        }
    }

    public function sendAppointmentReminder($to, $booking) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($to);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Emlékeztető: Holnapi időpontja a BrickEla Cuts-nál';
            
            // Format the appointment time
            $appointmentTime = date('H:i', strtotime($booking['idopont']));
            $duration = $booking['idotartam'] . ' perc';
            
            $this->mailer->Body = $this->getAppointmentReminderTemplate(
                $booking['Keresztnev'],
                date('Y. m. d.', strtotime($booking['datum'])),
                $appointmentTime,
                $duration,
                $booking['borbely_nev'],
                $booking['szolgaltatas_nev'],
                number_format($booking['ar'], 0, '.', ' ') . ' Ft'
            );
            
            return $this->mailer->send();
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function getRegistrationEmailTemplate($keresztnev, $activationLink) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Regisztráció megerősítése</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
            <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h1 style="color: #c0a080; margin: 0; font-size: 24px;">BrickEla Cuts</h1>
                </div>
                
                <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <h2 style="color: #c0a080; font-size: 20px; margin-bottom: 15px;">Kedves ' . htmlspecialchars($keresztnev) . '!</h2>
                    
                    <p style="font-size: 14px; line-height: 1.5;">Köszönjük, hogy regisztráltál a BrickEla Cuts oldalán!</p>
                    
                    <p style="font-size: 14px; line-height: 1.5;">A fiókod aktiválásához kérjük, kattints az alábbi gombra:</p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="' . $activationLink . '" 
                           style="display: inline-block; padding: 10px 20px; background-color: #c0a080; color: #ffffff; 
                                  text-decoration: none; border-radius: 4px; font-size: 14px;">
                            Fiók aktiválása
                        </a>
                    </div>
                    
                    <p style="font-size: 12px; color: #888;">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:</p>
                    <p style="word-break: break-all; color: #c0a080; font-size: 12px;">' . $activationLink . '</p>
                    
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">Ha nem te hoztad létre ezt a fiókot, kérjük, hagyd figyelmen kívül ezt az e-mailt.</p>
                </div>
                
                <div style="text-align: center; padding: 15px; color: rgba(255,255,255,0.5); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 20px;">
                    <p style="margin: 5px 0;">© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                    <p style="margin: 5px 0;">Cím: 1234 Budapest, Példa utca 123.</p>
                </div>
            </div>
        </body>
        </html>';
    }

    private function getBookingConfirmationTemplate($booking) {
        $date = date('Y. m. d.', strtotime($booking['datum']));
        $time = date('H:i', strtotime($booking['idopont']));
        
        // Generate cancellation token
        $cancellationToken = md5($booking['FoglalasID'] . $booking['LetrehozasIdopontja']);
        $cancellationLink = "http://localhost:5173/cancel-booking?token=" . $cancellationToken;
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Foglalás visszaigazolása</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h1 style="color: #c0a080; margin: 0;">BrickEla Cuts</h1>
                </div>
                
                <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <h2 style="color: #c0a080;">Foglalás visszaigazolása</h2>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <p><strong style="color: #c0a080;">Időpont:</strong> ' . $date . ' ' . $time . '</p>
                        <p><strong style="color: #c0a080;">Szolgáltatás:</strong> ' . htmlspecialchars($booking['szolgaltatas_nev']) . '</p>
                        <p><strong style="color: #c0a080;">Borbély:</strong> ' . htmlspecialchars($booking['borbely_nev']) . '</p>
                        <p><strong style="color: #c0a080;">Időtartam:</strong> ' . $booking['idotartam'] . ' perc</p>
                        <p><strong style="color: #c0a080;">Ár:</strong> ' . number_format($booking['ar'], 0, ',', ' ') . ' Ft</p>
                    </div>
                    
                    <p>Az időpontot sikeresen lefoglaltuk számodra. Kérjük, érkezz 5-10 perccel korábban.</p>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <h3 style="color: #c0a080; margin-top: 0;">Helyszín</h3>
                        <p>1234 Budapest, Példa utca 123.</p>
                        <p>Tel: +36 30 123 4567</p>
                    </div>
                    
                    <p>Ha mégsem tudsz eljönni, az alábbi gombra kattintva lemondhatod az időpontot:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="' . $cancellationLink . '" 
                           style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; 
                                  text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Időpont lemondása
                        </a>
                    </div>
                    
                    <p style="color: #dc3545; font-size: 14px;">
                        * Az időpontot csak 24 órával az időpont előtt lehet lemondani.
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.7); font-size: 12px;">
                    <p>© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                </div>
            </div>
        </body>
        </html>';
    }

    private function getAppointmentReminderTemplate($customerName, $date, $time, $duration, $barberName, $serviceName, $price) {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
                <h1 style='color: #333; text-align: center; margin-bottom: 20px;'>Időpont Emlékeztető</h1>
                
                <p style='font-size: 16px; color: #666;'>Kedves {$customerName}!</p>
                
                <p style='font-size: 16px; color: #666;'>Ez egy emlékeztető a holnapi időpontjáról a BrickEla Cuts-nál.</p>
                
                <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                    <h2 style='color: #333; font-size: 18px; margin-bottom: 15px;'>Foglalás Részletei:</h2>
                    <ul style='list-style: none; padding: 0;'>
                        <li style='margin-bottom: 10px;'><strong>Dátum:</strong> {$date}</li>
                        <li style='margin-bottom: 10px;'><strong>Időpont:</strong> {$time}</li>
                        <li style='margin-bottom: 10px;'><strong>Időtartam:</strong> {$duration}</li>
                        <li style='margin-bottom: 10px;'><strong>Fodrász:</strong> {$barberName}</li>
                        <li style='margin-bottom: 10px;'><strong>Szolgáltatás:</strong> {$serviceName}</li>
                        <li style='margin-bottom: 10px;'><strong>Ár:</strong> {$price}</li>
                    </ul>
                </div>
                
                <p style='font-size: 14px; color: #666; margin-top: 20px;'>Ha nem tud megjelenni az időponton, kérjük, értesítsen minket időben.</p>
                
                <div style='text-align: center; margin-top: 30px;'>
                    <p style='font-size: 14px; color: #666;'>Üdvözlettel,<br>BrickEla Cuts Csapata</p>
                </div>
            </div>
        </div>";
    }
} 