-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 18. 10:19
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `brickelav4`
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
(1, 1, 5, 'Tökéletes hajvágás, nagyon elégedett vagyok!', '2024-12-18 08:00:47'),
(2, 2, 4, 'Jó lett, de kicsit hosszú volt a folyamat.', '2024-12-18 08:00:47'),
(3, 3, 3, 'Gyors, de nem lett tökéletes.', '2024-12-18 08:00:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fodraszok`
--

CREATE TABLE `fodraszok` (
  `FodraszID` int(11) NOT NULL,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `KezdesIdo` time NOT NULL,
  `BefejezesIdo` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fodraszok`
--

INSERT INTO `fodraszok` (`FodraszID`, `Keresztnev`, `Vezeteknev`, `KezdesIdo`, `BefejezesIdo`) VALUES
(1, 'László', 'Varga', '08:00:00', '16:00:00'),
(2, 'Katalin', 'Szabó', '08:00:00', '16:00:00'),
(3, 'Gábor', 'Kiss', '10:00:00', '18:00:00');

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
(1, 1, 1, 1, '2024-12-19', '10:00:00', 'Foglalt', 'Hagyományos hajvágás', '2024-12-18 08:00:47'),
(2, 2, 2, 3, '2024-12-20', '13:00:00', 'Foglalt', 'Festés a megszokott színnel', '2024-12-18 08:00:47'),
(3, 3, 3, 4, '2024-12-20', '12:00:00', 'Foglalt', 'Gyors igazítás', '2024-12-18 08:00:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatasok`
--

CREATE TABLE `szolgaltatasok` (
  `SzolgaltatasID` int(11) NOT NULL,
  `SzolgaltatasNev` varchar(100) NOT NULL,
  `IdotartamPerc` int(11) NOT NULL,
  `Ar` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `szolgaltatasok`
--

INSERT INTO `szolgaltatasok` (`SzolgaltatasID`, `SzolgaltatasNev`, `IdotartamPerc`, `Ar`) VALUES
(1, 'Hajvágás', 30, 4500.00),
(2, 'Szakálligazítás', 20, 2500.00),
(3, 'Hajfestés', 30, 15000.00),
(4, 'Gyors hajvágás', 15, 3000.00);

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
(1, 'János', 'Kovács', '06101234567', 'janos.kovacs@example.com', '871b32b5f4e1b9ac25237dc7e4e175954c2dc6098aade48a8abefb585cbd53f2', 'Felhasználó', '2024-12-18 08:00:47'),
(2, 'Éva', 'Nagy', '06109876543', 'eva.nagy@example.com', '3543352c40d1a91fbe5df537d3dc6f6c613f819e0ef4eab16e3344cf41273b5c', 'Felhasználó', '2024-12-18 08:00:47'),
(3, 'Péter', 'Tóth', '06201234567', 'peter.toth@example.com', '8f0e2f76e22b43e2855189877e7dc1e1e7d98c226c95db247cd1d547928334a9', 'Felhasználó', '2024-12-18 08:00:47');

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
  MODIFY `ErtekelesID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `fodraszok`
--
ALTER TABLE `fodraszok`
  MODIFY `FodraszID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `FoglalasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `szolgaltatasok`
--
ALTER TABLE `szolgaltatasok`
  MODIFY `SzolgaltatasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `ugyfelek`
--
ALTER TABLE `ugyfelek`
  MODIFY `UgyfelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
