# Email Rendszer Dokumentáció

## Áttekintés

A BrickEla Cuts alkalmazás a PHPMailer könyvtárat használja az emailek küldéséhez SMTP protokollon keresztül. A rendszer különböző típusú automatizált emaileket kezel:

- Regisztrációs visszaigazolások
- Foglalási visszaigazolások
- Időpont emlékeztetők
- Köszönő emailek értékelési kéréssel

## Konfiguráció

Az email rendszer beállításai a `src/api/config.php` fájlban találhatók:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'sziateszeplany@gmail.com');
define('SMTP_PORT', 587);
```

## Email Szolgáltatás Osztály

A fő email funkcionalitás az `EmailService.php` osztályban van implementálva, amely különböző típusú emailek küldéséhez biztosít metódusokat:

### 1. Regisztrációs Email

```php
public function sendRegistrationEmail($email, $keresztnev, $token) {
    // Regisztrációs visszaigazolás küldése aktivációs linkkel
    $activationLink = "http://localhost:5173/activate?token=" . $token;
    $emailBody = $this->getRegistrationEmailTemplate($keresztnev, $activationLink);
}
```

### 2. Foglalási Visszaigazolás

```php
public function sendBookingConfirmation($email, $booking) {
    // Foglalási visszaigazolás küldése időpont részletekkel
    $emailBody = $this->getBookingConfirmationTemplate($booking);
}
```

### 3. Időpont Emlékeztető

```php
public function sendAppointmentReminder($to, $booking) {
    // Következő napi időpont emlékeztető küldése
    $appointmentTime = date('H:i', strtotime($booking['idopont']));
    $duration = $booking['idotartam'] . ' perc';
}
```

### 4. Köszönő Email Értékelési Kéréssel

```php
public function sendThankYouEmail($email, $emailContent) {
    // Köszönő email küldése értékelési linkkel
    $reviewLink = "http://localhost:5173/review?token=" . $token;
}
```

## Email Sablonok

A rendszer HTML email sablonokat használ, amelyek a `src/api/email-templates/` mappában találhatók:

### 1. Regisztrációs Email Sablon

```php
function getRegistrationEmailContent($name, $activationLink) {
    // Regisztrációs visszaigazolás HTML sablonja
    // Tartalmazza:
    // - Üdvözlő üzenetet
    // - Aktivációs gombot
    // - Tartalék linket
    // - Biztonsági figyelmeztetést
}
```

### 2. Köszönő Email Sablon

```php
function getThankYouEmailTemplate($customerName, $barberName, $serviceName, $reviewToken) {
    // Köszönő email HTML sablonja
    // Tartalmazza:
    // - Személyre szabott üdvözlést
    // - Szolgáltatás részleteket
    // - Értékelési kérést
    // - Értékelési linket
}
```

## Automatizált Email Küldés

A rendszer cron feladatokon keresztül küld automatizált emaileket:

### 1. Időpont Emlékeztetők

`src/api/cron/send-reminders.php`:

```php
// Holnapra eső időpontok lekérdezése
$query = "
    SELECT
        f.FoglalasDatum as datum,
        f.FoglalasIdo as idopont,
        sz.IdotartamPerc as idotartam,
        sz.Ar as ar,
        u.Email as email,
        u.Keresztnev,
        fo.Keresztnev as borbely_nev,
        sz.SzolgaltatasNev as szolgaltatas_nev
    FROM foglalasok f
    JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
    JOIN fodraszok fo ON f.FodraszID = fo.FodraszID
    JOIN szolgaltatasok sz ON f.SzolgaltatasID = sz.SzolgaltatasID
    WHERE
        DATE(f.FoglalasDatum) = ?
        AND f.Allapot = 'Foglalt'
        AND f.emlekeztetoElkuldve = 0
";
```

### 2. Köszönő Emailek

`src/api/cron/send-thank-you-emails.php`:

```php
// Teljesített időpontok feldolgozása
$stmt = $conn->prepare("
    SELECT
        f.FoglalasID,
        f.FoglalasDatum,
        f.FoglalasIdo,
        u.Email,
        u.Keresztnev as user_firstname,
        b.Keresztnev as barber_firstname,
        b.Vezeteknev as barber_lastname
    FROM foglalasok f
    JOIN ugyfelek u ON f.UgyfelID = u.UgyfelID
    JOIN fodraszok b ON f.FodraszID = b.FodraszID
    WHERE f.Allapot = 'Teljesítve'
    AND f.thankyou_email_sent = FALSE
");
```

## Email Funkciók

1. **HTML Támogatás**: Minden email HTML formátumban küld, egyszerű szöveges verzióval
2. **UTF-8 Kódolás**: Magyar karakterek megfelelő kezelése
3. **Reszponzív Design**: Mobilbarát email sablonok
4. **Biztonság**:
   - SMTP hitelesítés
   - TLS titkosítás
   - Biztonságos fejlécek
5. **Követés**:
   - Email küldési státusz követése
   - Értékelési token követése
   - Emlékeztető státusz követése

## Hibakezelés

A rendszer átfogó hibakezelést tartalmaz:

```php
try {
    // Email küldési logika
} catch (Exception $e) {
    error_log("Email küldés sikertelen: " . $e->getMessage());
    throw $e;
}
```

## Tesztelés

Tesztelő script elérhető a `src/api/cron/test-email.php` fájlban:

```php
$testData = [
    'customer_name' => 'Test User',
    'barber_name' => 'Test Barber',
    'service_name' => 'Test Service',
    'reviewToken' => 'test_token_' . time()
];
```

## Naplózás

Az email rendszerrel kapcsolatos naplók a következő helyeken találhatók:

- `logs/email-test.log`: Teszt email eredmények
- Szerver hiba naplók: Sikertelen email küldési kísérletek

## Email Sablonok Tartalma

### Regisztrációs Email

- Üdvözlő üzenet a felhasználó nevével
- Aktivációs gomb
- Tartalék link az aktivációhoz
- Biztonsági figyelmeztetés
- BrickEla Cuts logó és branding

### Foglalási Visszaigazolás

- Időpont részletek (dátum, idő)
- Szolgáltatás neve
- Borbély neve
- Időtartam
- Ár
- Instrukciók az időpontra való érkezéshez

### Időpont Emlékeztető

- Emlékeztető a következő napi időpontra
- Időpont részletek
- Borbély és szolgáltatás információ
- Instrukciók az időpontra való érkezéshez

### Köszönő Email

- Személyre szabott köszönés
- Szolgáltatás és borbély részletek
- Értékelési kérés
- Értékelési link (7 napig érvényes)
- BrickEla Cuts branding
