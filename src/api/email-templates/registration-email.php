<?php

function getRegistrationEmailContent($name, $activationLink) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aktiváld a fiókodat</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 30px;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }
            .footer {
                font-size: 12px;
                color: #666;
                margin-top: 30px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Üdvözlünk ' . htmlspecialchars($name) . '!</h2>
            <p>Köszönjük, hogy regisztráltál a BrickelaCuts oldalán!</p>
            <p>Kérjük, kattints az alábbi gombra a fiókod aktiválásához:</p>
            <p style="text-align: center;">
                <a href="' . htmlspecialchars($activationLink) . '" class="button">Fiók aktiválása</a>
            </p>
            <p>Ha a gomb nem működik, másold be ezt a linket a böngésződbe:</p>
            <p style="word-break: break-all;">' . htmlspecialchars($activationLink) . '</p>
        </div>
        <div class="footer">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszolj rá.</p>
            <p>&copy; ' . date('Y') . ' BrickelaCuts. Minden jog fenntartva.</p>
        </div>
    </body>
    </html>';
} 