-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 24. 23:53
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
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ErtekelesID` int(11) NOT NULL,
  `FoglalasID` int(11) NOT NULL,
  `Ertekeles` int(11) DEFAULT NULL CHECK (`Ertekeles` between 1 and 5),
  `Velemeny` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ertekelesek`
--

INSERT INTO `ertekelesek` (`ErtekelesID`, `FoglalasID`, `Ertekeles`, `Velemeny`, `LetrehozasIdopontja`) VALUES
(16, 4, 3, 'Nagyon elégedettek voltunk, a fodrász remek munkát végzett!', '2025-01-15 11:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fodraszok`
--

CREATE TABLE `fodraszok` (
  `FodraszID` int(11) NOT NULL,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `evtapasztalat` int(2) NOT NULL,
  `specializacio` varchar(50) NOT NULL,
  `reszletek` varchar(100) NOT NULL,
  `kep` varchar(50) NOT NULL,
  `KezdesIdo` int(11) NOT NULL,
  `BefejezesIdo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fodraszok`
--

INSERT INTO `fodraszok` (`FodraszID`, `Keresztnev`, `Vezeteknev`, `evtapasztalat`, `specializacio`, `reszletek`, `kep`, `KezdesIdo`, `BefejezesIdo`) VALUES
(1, 'László', 'Varga', 12, 'karoly king boss ceo', 'ceoceoceoceoceoceoceoceoceoceoceoceoceoceoceoceoceov', 'goatok.jpg', 8, 16),
(2, 'Katalin', 'Szabó', 4, 'fortnite man', 'tanczeo reinkarnacio', 'negyiman.jpg', 8, 16),
(3, 'Gábor', 'Kiss', 5, 'lightskin negyela', '123456789', 'brick.jpg', 10, 18),
(4, 'Balázs', 'Nagy', 7, 'Férfi hajvágás', 'Tapasztalt fodrász férfi hajvágásra.', 'ceok.jpg', 9, 20),
(5, 'Slime', 'Gyela', 23, 'CEOSKODAS', 'king ', '6793d01ad7b05.png', 20, 1);

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
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`FoglalasID`, `UgyfelID`, `FodraszID`, `SzolgaltatasID`, `FoglalasDatum`, `FoglalasIdo`, `Allapot`, `Megjegyzes`, `LetrehozasIdopontja`) VALUES
(4, 5, 4, 5, '2025-01-15', '10:30:00', 'Foglalt', 'Első alkalom a gyerekkel.', '2025-01-14 09:10:00'),
(6, 1, 4, 3, '2025-01-16', '17:00:00', 'Teljesítve', NULL, '2025-01-16 15:26:51'),
(7, 1, 4, 1, '2025-01-17', '09:00:00', 'Teljesítve', NULL, '2025-01-16 17:28:06'),
(8, 1, 2, 3, '2025-01-17', '10:00:00', 'Teljesítve', 'cigaaany', '2025-01-16 18:16:15'),
(9, 1, 4, 1, '2025-01-17', '12:00:00', 'Teljesítve', '', '2025-01-16 18:18:31'),
(10, 1, 4, 1, '2025-01-22', '11:30:00', 'Teljesítve', '', '2025-01-21 17:40:11'),
(11, 1, 4, 5, '2025-01-23', '09:00:00', 'Teljesítve', '', '2025-01-22 18:01:27'),
(12, 1, 2, 5, '2025-01-23', '08:30:00', 'Teljesítve', '', '2025-01-22 18:05:35'),
(13, 1, 2, 5, '2025-01-23', '15:00:00', 'Teljesítve', '', '2025-01-22 18:15:06'),
(14, 1, 4, 4, '2025-01-23', '12:00:00', 'Teljesítve', '', '2025-01-22 18:26:00'),
(15, 1, 4, 4, '2025-01-23', '09:30:00', 'Teljesítve', '', '2025-01-22 18:34:54'),
(16, 1, 4, 4, '2025-01-23', '10:30:00', 'Teljesítve', '', '2025-01-22 18:43:55'),
(17, 1, 4, 5, '2025-01-29', '09:00:00', 'Lemondva', '', '2025-01-22 18:45:03'),
(18, 1, 4, 5, '2025-01-23', '10:00:00', 'Teljesítve', '', '2025-01-22 18:46:21'),
(19, 1, 4, 4, '2025-01-23', '11:00:00', 'Teljesítve', '', '2025-01-22 18:50:07'),
(20, 1, 4, 3, '2025-01-23', '11:30:00', 'Teljesítve', '', '2025-01-22 19:09:42'),
(21, 1, 2, 2, '2025-01-24', '08:30:00', 'Lemondva', '', '2025-01-22 19:41:50'),
(22, 1, 2, 2, '2025-01-23', '09:00:00', 'Teljesítve', '', '2025-01-22 20:07:32');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatasok`
--

CREATE TABLE `szolgaltatasok` (
  `SzolgaltatasID` int(11) NOT NULL,
  `SzolgaltatasNev` varchar(100) NOT NULL,
  `IdotartamPerc` int(11) NOT NULL,
  `Ar` decimal(10,2) NOT NULL,
  `Leiras` varchar(100) NOT NULL,
  `KepURL` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `szolgaltatasok`
--

INSERT INTO `szolgaltatasok` (`SzolgaltatasID`, `SzolgaltatasNev`, `IdotartamPerc`, `Ar`, `Leiras`, `KepURL`) VALUES
(1, 'Hajvágás', 30, 4500.00, 'dickey', ''),
(2, 'Szakálligazítás', 20, 2500.00, 'rah', ''),
(3, 'Hajfestés', 30, 15000.00, 'rah', ''),
(4, 'Gyors hajvágás', 15, 3000.00, 'rah', ''),
(5, 'Gyerek hajvágás', 20, 3000.00, 'Hajvágás gyerekeknek, gyors és professzionális.', '');

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
  `Osztaly` enum('Felhasználó','Adminisztrátor') DEFAULT 'Felhasználó',
  `RegisztracioIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ugyfelek`
--

INSERT INTO `ugyfelek` (`UgyfelID`, `Keresztnev`, `Vezeteknev`, `Telefonszam`, `Email`, `Jelszo`, `Osztaly`, `RegisztracioIdopontja`) VALUES
(1, 'Gergő', 'Csibrik', '06703274210', 'csibrikgergo@gmail.com', '$2y$10$lgkyId3u/GRmNsfXzDxiheLKJ39k5GLmBl39j9TIulx.Kvu2gC4gu', 'Adminisztrátor', '2025-01-06 15:43:53'),
(2, 'brickski', 'brickski', '12357', 'ceo456@gmail.com', '$2y$10$hbX8ohv.rvStpCEjVjff8uFJ9nptVsldDx6kbrUj2Po2MufpBlNdy', 'Felhasználó', '2025-01-09 19:25:11'),
(3, 'brickskiiii', 'brickskiiii', '12357555', 'ceiiio456@gmail.com', '$2y$10$SBHjgfU1oLV7An8iAapWz.u81zby1J6vIaTsa/6fV5OaYvGmHqHJq', 'Felhasználó', '2025-01-09 19:28:24'),
(4, 'win gyula', 'win gyula', '12323346', 'ciganygyula@gmail.com', '$2y$10$Mn4Ww8Zx4Z0wTl4GvEz2SezebUNiDlnx2FdiWb16hKAgQQK14uZiG', 'Felhasználó', '2025-01-09 21:58:56'),
(5, 'Anna', 'Kovács', '06701234567', 'anna.kovacs@gmail.com', '$2y$10$examplehash', 'Felhasználó', '2025-01-14 09:00:00'),
(6, 'Gergő', 'Csibrik', '123573425', 'geri127@gmail.com', '$2y$10$2zn4sX7S3vZnlj1nOFNbEOO4cqKu29q0AgfvPu1O/miFi14EUV2vm', 'Felhasználó', '2025-01-16 18:22:26'),
(7, '', 'Slime', '06703274211', 'ceo999@gmail.com', '$2y$10$Mi8EZq1dPTMvNoKEIvRD4uyP6JbYXxOJNNf0p4eR4Tery6Mrpy5l.', 'Felhasználó', '2025-01-24 14:32:56'),
(8, 'BrickCEO', 'KingBoss', '06703274212', 'brick@gmail.com', '$2y$10$2Q9MzgsGO7VBFRWMWm8LT.0m3FvoBJON.XNUT3EmKRAWAjUEmLKjG', 'Felhasználó', '2025-01-24 16:47:11');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ErtekelesID`),
  ADD KEY `FoglalasID` (`FoglalasID`);

--
-- A tábla indexei `fodraszok`
--
ALTER TABLE `fodraszok`
  ADD PRIMARY KEY (`FodraszID`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`FoglalasID`),
  ADD KEY `UgyfelID` (`UgyfelID`),
  ADD KEY `FodraszID` (`FodraszID`),
  ADD KEY `SzolgaltatasID` (`SzolgaltatasID`);

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
-- AUTO_INCREMENT a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  MODIFY `ErtekelesID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `fodraszok`
--
ALTER TABLE `fodraszok`
  MODIFY `FodraszID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `FoglalasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `szolgaltatasok`
--
ALTER TABLE `szolgaltatasok`
  MODIFY `SzolgaltatasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `ugyfelek`
--
ALTER TABLE `ugyfelek`
  MODIFY `UgyfelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`FoglalasID`) REFERENCES `foglalasok` (`FoglalasID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`UgyfelID`) REFERENCES `ugyfelek` (`UgyfelID`) ON DELETE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`) ON DELETE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`SzolgaltatasID`) REFERENCES `szolgaltatasok` (`SzolgaltatasID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

