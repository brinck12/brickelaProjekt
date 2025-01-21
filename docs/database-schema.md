# Database Schema

## Tables Overview

### ugyfelek (Users)

```sql
CREATE TABLE `ugyfelek` (
  `UgyfelID` int(11) NOT NULL AUTO_INCREMENT,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL UNIQUE,
  `Telefonszam` varchar(20) NOT NULL UNIQUE,
  `Jelszo` varchar(255) NOT NULL,
  `Osztaly` enum('Admin','Felhasználó') DEFAULT 'Felhasználó',
  `RegisztracioIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UgyfelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### fodraszok (Barbers)

```sql
CREATE TABLE `fodraszok` (
  `FodraszID` int(11) NOT NULL AUTO_INCREMENT,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `KezdesIdo` time NOT NULL,
  `BefejezesIdo` time NOT NULL,
  PRIMARY KEY (`FodraszID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### szolgaltatasok (Services)

```sql
CREATE TABLE `szolgaltatasok` (
  `SzolgaltatasID` int(11) NOT NULL AUTO_INCREMENT,
  `SzolgaltatasNev` varchar(100) NOT NULL,
  `Ar` int(11) NOT NULL,
  `Idotartam` int(11) NOT NULL,
  `Leiras` text DEFAULT NULL,
  PRIMARY KEY (`SzolgaltatasID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### foglalasok (Appointments)

```sql
CREATE TABLE `foglalasok` (
  `FoglalasID` int(11) NOT NULL AUTO_INCREMENT,
  `UgyfelID` int(11) NOT NULL,
  `FodraszID` int(11) NOT NULL,
  `SzolgaltatasID` int(11) NOT NULL,
  `FoglalasDatum` date NOT NULL,
  `FoglalasIdo` time NOT NULL,
  `Allapot` enum('Foglalt','Teljesítve','Lemondva') DEFAULT 'Foglalt',
  `Megjegyzes` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`FoglalasID`),
  FOREIGN KEY (`UgyfelID`) REFERENCES `ugyfelek` (`UgyfelID`),
  FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`),
  FOREIGN KEY (`SzolgaltatasID`) REFERENCES `szolgaltatasok` (`SzolgaltatasID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### ertekelesek (Reviews)

```sql
CREATE TABLE `ertekelesek` (
  `ErtekelesID` int(11) NOT NULL AUTO_INCREMENT,
  `FoglalasID` int(11) NOT NULL,
  `Ertekeles` int(11) NOT NULL CHECK (Ertekeles BETWEEN 1 AND 5),
  `Velemeny` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ErtekelesID`),
  FOREIGN KEY (`FoglalasID`) REFERENCES `foglalasok` (`FoglalasID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### referenciak (Reference Works)

```sql
CREATE TABLE `referenciak` (
  `ReferenciaID` int(11) NOT NULL AUTO_INCREMENT,
  `FodraszID` int(11) NOT NULL,
  `KepUtvonal` varchar(255) NOT NULL,
  `Leiras` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ReferenciaID`),
  FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Relationships

### Primary Relationships

1. **Users to Appointments**

   - One-to-Many: One user can have multiple appointments
   - Foreign Key: `foglalasok.UgyfelID` → `ugyfelek.UgyfelID`

2. **Barbers to Appointments**

   - One-to-Many: One barber can have multiple appointments
   - Foreign Key: `foglalasok.FodraszID` → `fodraszok.FodraszID`

3. **Services to Appointments**

   - One-to-Many: One service can be used in multiple appointments
   - Foreign Key: `foglalasok.SzolgaltatasID` → `szolgaltatasok.SzolgaltatasID`

4. **Appointments to Reviews**
   - One-to-One: One appointment can have one review
   - Foreign Key: `ertekelesek.FoglalasID` → `foglalasok.FoglalasID`

## Data Types

### Common Fields

- **ID Fields**: `int(11)` with AUTO_INCREMENT
- **Names**: `varchar(50)`
- **Email**: `varchar(100)`
- **Phone**: `varchar(20)`
- **Timestamps**: `timestamp`
- **Text Fields**: `text`
- **Status Enums**: Custom enumerated types

### Specific Constraints

1. **Users**

   - Unique email addresses
   - Unique phone numbers
   - Hashed passwords
   - Default user class

2. **Appointments**

   - Status tracking
   - Timestamp tracking
   - Optional notes

3. **Reviews**
   - Rating scale (1-5)
   - Optional review text
   - Creation timestamp

## Indexes

- Primary keys on all ID fields
- Foreign key indexes for relationships
- Unique indexes on email and phone number
- Index on appointment dates for faster searching

## Data Integrity

- Foreign key constraints prevent orphaned records
- CHECK constraints ensure valid ratings
- DEFAULT values for status fields
- NOT NULL constraints on required fields
