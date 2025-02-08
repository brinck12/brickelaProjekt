<?php

function getThankYouEmailTemplate($customerName, $barberName, $serviceName, $reviewToken) {
    $reviewLink = "http://localhost:5173/review?token=" . $reviewToken;
    
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Köszönjük a látogatást!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
        <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <h1 style="color: #c0a080; margin: 0; font-size: 24px;">BrickEla Cuts</h1>
            </div>
            
            <div style="padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                <h2 style="color: #c0a080; font-size: 20px;">Kedves ' . htmlspecialchars($customerName) . '!</h2>
                
                <p style="font-size: 14px; line-height: 1.5;">Köszönjük, hogy minket választott! Reméljük, elégedett volt ' . htmlspecialchars($barberName) . ' munkájával és a(z) ' . htmlspecialchars($serviceName) . ' szolgáltatásunkkal.</p>
                
                <p style="font-size: 14px; line-height: 1.5;">Nagy segítség lenne számunkra, ha megosztaná velünk véleményét és értékelné szolgáltatásunkat.</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="' . $reviewLink . '" 
                       style="display: inline-block; padding: 10px 20px; background-color: #c0a080; color: #ffffff; 
                              text-decoration: none; border-radius: 4px; font-size: 14px;">
                        Értékelés írása
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #ffffff;">Az értékelés mindössze pár percet vesz igénybe, és segít nekünk abban, hogy még jobb szolgáltatást nyújthassunk.</p>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="font-size: 14px; color: #ffffff;">Várjuk vissza szeretettel!</p>
                    <p style="font-size: 14px; color: #ffffff;">BrickEla Cuts csapata</p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 15px; color: rgba(255,255,255,0.5); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 20px;">
                <p style="margin: 5px 0;">© 2024 BrickEla Cuts - Minden jog fenntartva</p>
                <p style="margin: 5px 0;">1234 Budapest, Példa utca 123.</p>
            </div>
        </div>
    </body>
    </html>';
} 