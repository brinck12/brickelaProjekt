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

    public function sendThankYouEmail($email, $emailContent) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($email);
            $this->mailer->Subject = 'Köszönjük a látogatást! - BrickEla Cuts';
            
            $this->mailer->Body = $emailContent;
            $this->mailer->AltBody = strip_tags($emailContent);
            
            return $this->mailer->send();
        } catch (Exception $e) {
            throw new Exception('Failed to send thank you email: ' . $e->getMessage());
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
        
        // Use the actual cancellation token from the database
        $cancellationLink = "http://localhost:5173/cancel-booking?token=" . $booking['CancellationToken'];
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Foglalás visszaigazolása</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
            <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h1 style="color: #c0a080; margin: 0; font-size: 24px;">BrickEla Cuts</h1>
                </div>
                
                <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <h2 style="color: #c0a080; font-size: 20px;">Foglalás visszaigazolása</h2>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px; color: #ffffff;">
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Időpont:</strong> <span style="color: #ffffff;">' . $date . ' ' . $time . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Szolgáltatás:</strong> <span style="color: #ffffff;">' . htmlspecialchars($booking['szolgaltatas_nev']) . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Borbély:</strong> <span style="color: #ffffff;">' . htmlspecialchars($booking['borbely_nev']) . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Időtartam:</strong> <span style="color: #ffffff;">' . $booking['idotartam'] . ' perc</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Ár:</strong> <span style="color: #ffffff;">' . number_format($booking['ar'], 0, ',', ' ') . ' Ft</span></p>
                    </div>
                    
                    <p style="font-size: 14px; color: #ffffff;">Az időpontot sikeresen lefoglaltuk számodra. Kérjük, érkezz 5-10 perccel korábban.</p>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px;">
                        <h3 style="color: #c0a080; margin-top: 0; font-size: 16px;">Helyszín</h3>
                        <p style="margin: 8px 0; color: #ffffff;">1234 Budapest, Példa utca 123.</p>
                        <p style="margin: 8px 0; color: #ffffff;">Tel: +36 30 123 4567</p>
                    </div>
                    
                    <p style="font-size: 14px; color: #ffffff;">Ha mégsem tudsz eljönni, az alábbi gombra kattintva lemondhatod az időpontot:</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="' . $cancellationLink . '" 
                           style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #ffffff; 
                                  text-decoration: none; border-radius: 4px; font-size: 14px;">
                            Időpont lemondása
                        </a>
                    </div>
                    
                    <p style="color: #ffffff; font-size: 12px;">
                        * Az időpontot csak 24 órával az időpont előtt lehet lemondani.
                    </p>
                </div>
                
                <div style="text-align: center; padding: 15px; color: #ffffff; font-size: 11px;">
                    <p style="margin: 5px 0;">© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                </div>
            </div>
        </body>
        </html>';
    }

    private function getAppointmentReminderTemplate($customerName, $date, $time, $duration, $barberName, $serviceName, $price) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Időpont Emlékeztető</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
            <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h1 style="color: #c0a080; margin: 0; font-size: 24px;">BrickEla Cuts</h1>
                </div>
                
                <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <h2 style="color: #c0a080; font-size: 20px; margin-bottom: 15px;">Időpont Emlékeztető</h2>
                    
                    <p style="font-size: 14px; line-height: 1.5; color: #ffffff;">Kedves ' . htmlspecialchars($customerName) . '!</p>
                    
                    <p style="font-size: 14px; line-height: 1.5; color: #ffffff;">Ez egy emlékeztető a holnapi időpontjáról a BrickEla Cuts-nál.</p>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px;">
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Dátum:</strong> <span style="color: #ffffff;">' . $date . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Időpont:</strong> <span style="color: #ffffff;">' . $time . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Időtartam:</strong> <span style="color: #ffffff;">' . $duration . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Fodrász:</strong> <span style="color: #ffffff;">' . htmlspecialchars($barberName) . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Szolgáltatás:</strong> <span style="color: #ffffff;">' . htmlspecialchars($serviceName) . '</span></p>
                        <p style="margin: 8px 0;"><strong style="color: #c0a080;">Ár:</strong> <span style="color: #ffffff;">' . $price . '</span></p>
                    </div>
                    
                    <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 4px; margin: 15px 0; font-size: 14px;">
                        <h3 style="color: #c0a080; margin-top: 0; font-size: 16px;">Helyszín</h3>
                        <p style="margin: 8px 0; color: #ffffff;">1234 Budapest, Példa utca 123.</p>
                        <p style="margin: 8px 0; color: #ffffff;">Tel: +36 30 123 4567</p>
                    </div>
                    
                    <p style="font-size: 14px; color: #ffffff;">Kérjük, érkezzen 5-10 perccel korábban. Ha nem tud megjelenni az időponton, kérjük, értesítsen minket időben.</p>
                </div>
                
                <div style="text-align: center; padding: 15px; color: rgba(255,255,255,0.5); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 20px;">
                    <p style="margin: 5px 0;">© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                    <p style="margin: 5px 0;">Cím: 1234 Budapest, Példa utca 123.</p>
                </div>
            </div>
        </body>
        </html>';
    }
} 