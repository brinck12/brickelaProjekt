# Database Schema Documentation

## Overview

The BrickelaCuts database is designed to manage barber shop appointments, users, services, and reviews. The schema follows normalized database design principles and includes foreign key relationships to maintain data integrity.

## Tables

### Users (`ugyfelek`)

Stores user account information.

```sql
CREATE TABLE ugyfelek (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Jelszo VARCHAR(255) NOT NULL,
    Vezeteknev VARCHAR(100) NOT NULL,
    Keresztnev VARCHAR(100) NOT NULL,
    Telefonszam VARCHAR(20),
    Osztaly ENUM('Admin', 'Felhasználó') DEFAULT 'Felhasználó',
    LetrehozasDatum TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Barbers (`fodraszmester`)

Stores barber information and working hours.

```sql
CREATE TABLE fodraszmester (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Nev VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Telefonszam VARCHAR(20),
    kep VARCHAR(255),
    evtapasztalat VARCHAR(2),
    specializacio TEXT,
    reszletek TEXT,
    KezdesIdo INT NOT NULL,
    BefejezesIdo INT NOT NULL
);
```

### Services (`szolgaltatasok`)

Defines available services and their details.

```sql
CREATE TABLE szolgaltatasok (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    duration INT NOT NULL,
    description TEXT
);
```

### Appointments (`foglalasok`)

Manages booking information.

```sql
CREATE TABLE foglalasok (
    FoglalasID INT PRIMARY KEY AUTO_INCREMENT,
    UgyfelID INT NOT NULL,
    FodraszID INT NOT NULL,
    ServiceID INT NOT NULL,
    FoglalasDatum DATE,
    FoglalasIdo TIME,
    LetrehozasDatum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Allapot ENUM('Foglalt', 'Teljesítve', 'Lemondva') DEFAULT 'Foglalt',
    LemondasIdopontja DATETIME,
    megjegyzes TEXT,
    review_rating INT,
    review_comment TEXT,
    review_date DATETIME,
    CancellationToken VARCHAR(64),
    FOREIGN KEY (UgyfelID) REFERENCES ugyfelek(ID),
    FOREIGN KEY (FodraszID) REFERENCES fodraszmester(id),
    FOREIGN KEY (ServiceID) REFERENCES szolgaltatasok(id)
);
```

### Reviews (`ertekelesek`)

Stores customer reviews and ratings.

```sql
CREATE TABLE ertekelesek (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    FodraszID INT NOT NULL,
    UgyfelID INT NOT NULL,
    Ertekeles INT NOT NULL CHECK (Ertekeles BETWEEN 1 AND 5),
    Megjegyzes TEXT,
    Datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FodraszID) REFERENCES fodraszmester(id),
    FOREIGN KEY (UgyfelID) REFERENCES ugyfelek(ID)
);
```

### Review Tokens (`review_tokens`)

Manages one-time tokens for review submission.

```sql
CREATE TABLE review_tokens (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    FoglalasID INT NOT NULL,
    Token VARCHAR(64) NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    Used BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FoglalasID) REFERENCES foglalasok(FoglalasID)
);
```

### Rate Limiting (`rate_limits`)

Tracks API request rates for security.

```sql
CREATE TABLE rate_limits (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45) NOT NULL,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

### Primary Relationships

1. Appointments (`foglalasok`):

   - `UgyfelID` → `ugyfelek(ID)`
   - `FodraszID` → `fodraszmester(id)`
   - `ServiceID` → `szolgaltatasok(id)`

2. Reviews (`ertekelesek`):

   - `FodraszID` → `fodraszmester(id)`
   - `UgyfelID` → `ugyfelek(ID)`

3. Review Tokens (`review_tokens`):
   - `FoglalasID` → `foglalasok(FoglalasID)`

## Indexes

```sql
-- Appointments indexes
CREATE INDEX idx_foglalasok_datum ON foglalasok(FoglalasDatum);
CREATE INDEX idx_foglalasok_allapot ON foglalasok(Allapot);
CREATE INDEX idx_foglalasok_fodrasz ON foglalasok(FodraszID);

-- Reviews indexes
CREATE INDEX idx_ertekelesek_fodrasz ON ertekelesek(FodraszID);
CREATE INDEX idx_ertekelesek_datum ON ertekelesek(Datum);

-- Rate limiting indexes
CREATE INDEX idx_rate_limits_ip_action ON rate_limits(ip_address, action);
CREATE INDEX idx_rate_limits_timestamp ON rate_limits(timestamp);
```

## Triggers

### Appointment Status Update

```sql
DELIMITER //
CREATE TRIGGER after_appointment_complete
AFTER UPDATE ON foglalasok
FOR EACH ROW
BEGIN
    IF NEW.Allapot = 'Teljesítve' AND OLD.Allapot != 'Teljesítve' THEN
        -- Generate review token
        INSERT INTO review_tokens (FoglalasID, Token, ExpiresAt)
        VALUES (NEW.FoglalasID, UUID(), DATE_ADD(NOW(), INTERVAL 7 DAY));
    END IF;
END //
DELIMITER ;
```

## Data Integrity

### Constraints

1. Rating values must be between 1 and 5
2. Appointment times must be within barber working hours
3. Future dates only for new appointments
4. Unique email addresses for users
5. Valid status transitions for appointments

### Cascading Rules

1. Review deletion on appointment deletion
2. Token invalidation on appointment cancellation
3. Preserve user data even when appointments are deleted

## Sample Queries

### Get Available Time Slots

```sql
SELECT TIME_FORMAT(t.slot, '%H:%i') as available_time
FROM (
    SELECT MAKETIME(hour, minute, 0) AS slot
    FROM (
        SELECT @rn := @rn + 1 as hour
        FROM (SELECT 0 union all SELECT 1 union all SELECT 2 union all SELECT 3) t1,
             (SELECT 0 union all SELECT 1 union all SELECT 2 union all SELECT 3) t2,
             (SELECT @rn:=-1) t0
    ) hours
    CROSS JOIN (SELECT 0 as minute union all SELECT 30) minutes
    HAVING hour BETWEEN ? AND ?
) t
LEFT JOIN foglalasok f ON DATE(f.FoglalasDatum) = ?
    AND TIME_FORMAT(f.FoglalasIdo, '%H:%i') = TIME_FORMAT(t.slot, '%H:%i')
    AND f.FodraszID = ?
    AND f.Allapot = 'Foglalt'
WHERE f.FoglalasID IS NULL
ORDER BY t.slot;
```

### Get Barber Rating

```sql
SELECT
    f.Nev,
    ROUND(AVG(e.Ertekeles), 1) as atlag_ertekeles,
    COUNT(e.ID) as ertekelesek_szama
FROM fodraszmester f
LEFT JOIN ertekelesek e ON f.id = e.FodraszID
GROUP BY f.id;
```
