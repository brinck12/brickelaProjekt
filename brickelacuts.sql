-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 29. 10:06
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `brickelacuts`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fodraszok`
--

CREATE TABLE `fodraszok` (
  `FodraszID` int(11) NOT NULL,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `evtapasztalat` tinyint(3) UNSIGNED NOT NULL,
  `specializacio` text DEFAULT NULL,
  `reszletek` text DEFAULT NULL,
  `kep` varchar(50) NOT NULL,
  `KezdesIdo` int(11) NOT NULL,
  `BefejezesIdo` int(11) NOT NULL,
  `UgyfelID` int(11) DEFAULT NULL,
  `Aktiv` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `fodraszok`
--

INSERT INTO `fodraszok` (`FodraszID`, `Keresztnev`, `Vezeteknev`, `evtapasztalat`, `specializacio`, `reszletek`, `kep`, `KezdesIdo`, `BefejezesIdo`, `UgyfelID`, `Aktiv`) VALUES
(1, 'László', 'Varga', 12, 'Átmenetek', 'Precíz és sima átmenetek készítése különböző hajhosszokon, modern és klasszikus stílusban.', 'barber1.png', 1, 16, NULL, 1),
(2, 'Attila', 'Szabó', 4, 'Szakáll igazítás', 'Egyedi hajminták és borotvált designok precíz kidolgozása, valamint szakáll igazítása az arcformához illően.', 'barber2.jpg', 8, 16, NULL, 1),
(3, 'Gábor', 'Kiss', 5, 'Hajfestés', 'Prémium minőségű hajfestékekkel dolgozik, különös figyelmet fordítva a haj egészségének megőrzésére.', 'barber3.jpg', 10, 18, NULL, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `FoglalasID` int(11) NOT NULL,
  `UgyfelID` int(11) NOT NULL,
  `FodraszID` int(11) NOT NULL,
  `SzolgaltatasID` int(11) NOT NULL,
  `FoglalasDatum` date NOT NULL,
  `FoglalasIdo` time NOT NULL,
  `Allapot` enum('Foglalt','Teljesítve','Lemondva') DEFAULT 'Foglalt',
  `Megjegyzes` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  `emlekeztetoElkuldve` tinyint(1) DEFAULT 0,
  `LemondasIdopontja` timestamp NULL DEFAULT NULL,
  `thankyou_email_sent` tinyint(1) DEFAULT 0,
  `CancellationToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`FoglalasID`, `UgyfelID`, `FodraszID`, `SzolgaltatasID`, `FoglalasDatum`, `FoglalasIdo`, `Allapot`, `Megjegyzes`, `LetrehozasIdopontja`, `emlekeztetoElkuldve`, `LemondasIdopontja`, `thankyou_email_sent`, `CancellationToken`) VALUES
(1, 36, 1, 1, '2025-03-29', '13:30:00', 'Foglalt', '', '2025-03-29 07:22:33', 0, NULL, 0, 'd9de40a56677894a99df84274826cb023641a6b3033f1ae96ad9e051df87e2bc'),
(2, 36, 1, 1, '2025-03-29', '13:30:00', 'Foglalt', '', '2025-03-29 07:22:35', 0, NULL, 0, '522e822e128028e6bd50a9678df1ffb7965f6324b67c242cf52802a491991e3d');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `ID` int(11) NOT NULL,
  `FoglalasID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Used` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `rating` tinyint(3) UNSIGNED DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatasok`
--

CREATE TABLE `szolgaltatasok` (
  `SzolgaltatasID` int(11) NOT NULL,
  `SzolgaltatasNev` varchar(100) NOT NULL,
  `IdotartamPerc` tinyint(3) UNSIGNED NOT NULL,
  `Ar` decimal(10,2) NOT NULL,
  `Leiras` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `szolgaltatasok`
--

INSERT INTO `szolgaltatasok` (`SzolgaltatasID`, `SzolgaltatasNev`, `IdotartamPerc`, `Ar`, `Leiras`) VALUES
(1, 'Hajvágás', 30, 6000.00, 'Klasszikus vagy modern frizurák precíz kialakítása, az egyéni igényeknek megfelelően formázva és igazítva.'),
(2, 'Szakálligazítás', 20, 2500.00, ' A szakáll formázása, igazítása és kontúrozása, hogy ápolt és rendezett megjelenést biztosítson.'),
(3, 'Hajfestés', 30, 15000.00, 'Teljes vagy részleges hajszínezés professzionális technikákkal, a kívánt árnyalat eléréséhez.'),
(4, 'Gyors hajvágás', 15, 3000.00, 'Rövid, gyors frissítés a haj számára, ideális azoknak, akik minimális igazításra vagy gyors fazonkarbantartásra vágynak.'),
(5, 'Gyerek hajvágás', 20, 3000.00, 'Hajvágás gyerekeknek, gyors és professzionális.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ugyfelek`
--

CREATE TABLE `ugyfelek` (
  `UgyfelID` int(11) NOT NULL,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `Telefonszam` varchar(15) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `Jelszo` varchar(255) NOT NULL,
  `Osztaly` enum('Felhasználó','Adminisztrátor','Barber') DEFAULT 'Felhasználó',
  `RegisztracioIdopontja` timestamp NOT NULL DEFAULT current_timestamp(),
  `VerificationToken` varchar(64) DEFAULT NULL,
  `Aktiv` tinyint(1) DEFAULT 0,
  `EmailVerifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `ugyfelek`
--

INSERT INTO `ugyfelek` (`UgyfelID`, `Keresztnev`, `Vezeteknev`, `Telefonszam`, `Email`, `Jelszo`, `Osztaly`, `RegisztracioIdopontja`, `VerificationToken`, `Aktiv`, `EmailVerifiedAt`) VALUES
(1, 'Gergő', 'Csibrik', '06703274210', 'csibrikgergo@gmail.com', '$2y$10$lgkyId3u/GRmNsfXzDxiheLKJ39k5GLmBl39j9TIulx.Kvu2gC4gu', 'Adminisztrátor', '2025-01-06 15:43:53', NULL, 1, NULL),
(7, 'King', 'Slime', '06703274211', 'ceo999@gmail.com', '$2y$10$Mi8EZq1dPTMvNoKEIvRD4uyP6JbYXxOJNNf0p4eR4Tery6Mrpy5l.', 'Barber', '2025-01-24 14:32:56', NULL, 1, NULL),
(36, 'Gergo', 'Negyela', '06201948128', 'sajtgameplay@gmail.com', '$2y$10$Ie1/.Yb7U2k.T1Kp/5mzauE6varLhEypiT.OcdGqNG.Gf07miX70q', 'Felhasználó', '2025-03-26 08:18:40', NULL, 1, '2025-03-26 08:19:18'),
(38, 'Géza', 'Kiss', '06209491837', 'kecske1227@gmail.com', '$2y$10$08Rf.5e7.IW7iMd87Hc1ne8RR/Yrt.iH5tmYS.sOHJKQLn/GYx/fS', 'Felhasználó', '2025-03-29 07:26:37', '94dfcc95388e9a13998b6d0d2138d2682cf07f7e17682f8e21b0affc4f33c91c', 0, NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `fodraszok`
--
ALTER TABLE `fodraszok`
  ADD PRIMARY KEY (`FodraszID`),
  ADD KEY `UgyfelID` (`UgyfelID`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`FoglalasID`),
  ADD KEY `UgyfelID` (`UgyfelID`),
  ADD KEY `FodraszID` (`FodraszID`),
  ADD KEY `SzolgaltatasID` (`SzolgaltatasID`),
  ADD KEY `idx_thankyou_email` (`Allapot`,`thankyou_email_sent`,`FoglalasDatum`,`FoglalasIdo`),
  ADD KEY `idx_cancellation_token` (`CancellationToken`),
  ADD KEY `idx_appointment_search` (`FoglalasDatum`,`FoglalasIdo`,`FodraszID`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_token` (`Token`),
  ADD KEY `idx_foglalasid_used` (`FoglalasID`,`Used`),
  ADD KEY `idx_expires` (`ExpiresAt`);

--
-- A tábla indexei `szolgaltatasok`
--
ALTER TABLE `szolgaltatasok`
  ADD PRIMARY KEY (`SzolgaltatasID`);

--
-- A tábla indexei `ugyfelek`
--
ALTER TABLE `ugyfelek`
  ADD PRIMARY KEY (`UgyfelID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `fodraszok`
--
ALTER TABLE `fodraszok`
  MODIFY `FodraszID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `FoglalasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `szolgaltatasok`
--
ALTER TABLE `szolgaltatasok`
  MODIFY `SzolgaltatasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `ugyfelek`
--
ALTER TABLE `ugyfelek`
  MODIFY `UgyfelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `fodraszok`
--
ALTER TABLE `fodraszok`
  ADD CONSTRAINT `fodraszok_ibfk_1` FOREIGN KEY (`UgyfelID`) REFERENCES `ugyfelek` (`UgyfelID`);

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`UgyfelID`) REFERENCES `ugyfelek` (`UgyfelID`) ON DELETE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`) ON DELETE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`SzolgaltatasID`) REFERENCES `szolgaltatasok` (`SzolgaltatasID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`FoglalasID`) REFERENCES `foglalasok` (`FoglalasID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
