-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 18. 09:37
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

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GeneralBeosztasokHaromHonapra` ()   BEGIN
    -- Változók deklarálása
    DECLARE AktDatum DATE;
    DECLARE VegDatum DATE;
    DECLARE Done INT DEFAULT 0;
    DECLARE CurrentFodraszID INT;
    DECLARE Start TIME;
    DECLARE End TIME;

    -- Kurzor deklaráció
    DECLARE FodraszCursor CURSOR FOR SELECT FodraszID FROM Fodraszok;

    -- Hiba kezelés
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET Done = 1;

    -- A kezdő és végdátum beállítása
    SET AktDatum = CURDATE(); -- Ma kezdjük
    SET VegDatum = DATE_ADD(CURDATE(), INTERVAL 3 MONTH); -- 3 hónap múlva ér véget

    -- Nyissuk meg a kurzort
    OPEN FodraszCursor;

    FodraszLoop: LOOP
        FETCH FodraszCursor INTO CurrentFodraszID;
        IF Done THEN
            LEAVE FodraszLoop;
        END IF;

        -- Napok generálása az adott fodrászra
        WHILE AktDatum <= VegDatum DO
            -- Ellenőrzés, hogy van-e elérhetőség az adott napon
            -- A Start és End időpontot itt generálhatjuk (például fix időpontokkal, vagy egy logikával)
            SET Start = '09:00:00'; -- Például, kezdő időpont
            SET End = ADDTIME(Start, '02:00:00'); -- 2 óra hosszú műszak

            -- Adat beszúrása
            INSERT INTO fodraszbeosztasok (FodraszID, BeosztasDatum, KezdesIdo, BefejezesIdo)
            VALUES (CurrentFodraszID, AktDatum, Start, End);

            -- Növeljük az AktDatum-ot, hogy a következő napra lépjünk
            SET AktDatum = DATE_ADD(AktDatum, INTERVAL 1 DAY);
        END WHILE;

    END LOOP;

    -- Bezárjuk a kurzort
    CLOSE FodraszCursor;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `elerhetosegkapcsolat`
--

CREATE TABLE `elerhetosegkapcsolat` (
  `FodraszID` int(11) NOT NULL,
  `ElerhetosegID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Tábla szerkezet ehhez a táblához `fodraszbeosztasok`
--

CREATE TABLE `fodraszbeosztasok` (
  `BeosztasID` int(11) NOT NULL,
  `FodraszID` int(11) NOT NULL,
  `HetNapja` enum('Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap') NOT NULL,
  `KezdesIdo` time NOT NULL,
  `BefejezesIdo` time NOT NULL,
  `BeosztasDatum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fodraszbeosztasok`
--

INSERT INTO `fodraszbeosztasok` (`BeosztasID`, `FodraszID`, `HetNapja`, `KezdesIdo`, `BefejezesIdo`, `BeosztasDatum`) VALUES
(1, 1, 'Hétfő', '08:00:00', '08:30:00', '2024-12-19'),
(2, 1, 'Hétfő', '08:30:00', '09:00:00', '2024-12-19'),
(3, 1, 'Hétfő', '09:00:00', '09:30:00', '2024-12-19'),
(4, 1, 'Hétfő', '09:30:00', '10:00:00', '2024-12-19'),
(5, 1, 'Hétfő', '10:00:00', '10:30:00', '2024-12-19'),
(6, 1, 'Hétfő', '10:30:00', '11:00:00', '2024-12-19'),
(7, 1, 'Hétfő', '11:00:00', '11:30:00', '2024-12-19'),
(8, 1, 'Hétfő', '11:30:00', '12:00:00', '2024-12-19'),
(9, 1, 'Hétfő', '12:00:00', '12:30:00', '2024-12-19'),
(10, 1, 'Hétfő', '12:30:00', '13:00:00', '2024-12-19'),
(11, 1, 'Hétfő', '13:00:00', '13:30:00', '2024-12-19'),
(12, 1, 'Hétfő', '13:30:00', '14:00:00', '2024-12-19'),
(13, 1, 'Hétfő', '14:00:00', '14:30:00', '2024-12-19'),
(14, 1, 'Hétfő', '14:30:00', '15:00:00', '2024-12-19'),
(15, 1, 'Hétfő', '15:00:00', '15:30:00', '2024-12-19'),
(16, 1, 'Hétfő', '15:30:00', '16:00:00', '2024-12-19'),
(17, 2, 'Hétfő', '08:00:00', '08:30:00', '2024-12-20'),
(18, 2, 'Hétfő', '08:30:00', '09:00:00', '2024-12-20'),
(19, 2, 'Hétfő', '09:00:00', '09:30:00', '2024-12-20'),
(20, 2, 'Hétfő', '09:30:00', '10:00:00', '2024-12-20'),
(21, 2, 'Hétfő', '10:00:00', '10:30:00', '2024-12-20'),
(22, 2, 'Hétfő', '10:30:00', '11:00:00', '2024-12-20'),
(23, 2, 'Hétfő', '11:00:00', '11:30:00', '2024-12-20'),
(24, 2, 'Hétfő', '11:30:00', '12:00:00', '2024-12-20'),
(25, 2, 'Hétfő', '12:00:00', '12:30:00', '2024-12-20'),
(26, 2, 'Hétfő', '12:30:00', '13:00:00', '2024-12-20'),
(27, 2, 'Hétfő', '13:00:00', '13:30:00', '2024-12-20'),
(28, 2, 'Hétfő', '13:30:00', '14:00:00', '2024-12-20'),
(29, 2, 'Hétfő', '14:00:00', '14:30:00', '2024-12-20'),
(30, 2, 'Hétfő', '14:30:00', '15:00:00', '2024-12-20'),
(31, 2, 'Hétfő', '15:00:00', '15:30:00', '2024-12-20'),
(32, 2, 'Hétfő', '15:30:00', '16:00:00', '2024-12-20'),
(33, 3, 'Hétfő', '08:00:00', '08:30:00', '2024-12-20'),
(34, 3, 'Hétfő', '08:30:00', '09:00:00', '2024-12-20'),
(35, 3, 'Hétfő', '09:00:00', '09:30:00', '2024-12-20'),
(36, 3, 'Hétfő', '09:30:00', '10:00:00', '2024-12-20'),
(37, 3, 'Hétfő', '10:00:00', '10:30:00', '2024-12-20'),
(38, 3, 'Hétfő', '10:30:00', '11:00:00', '2024-12-20'),
(39, 3, 'Hétfő', '11:00:00', '11:30:00', '2024-12-20'),
(40, 3, 'Hétfő', '11:30:00', '12:00:00', '2024-12-20'),
(41, 3, 'Hétfő', '12:00:00', '12:30:00', '2024-12-20'),
(42, 3, 'Hétfő', '12:30:00', '13:00:00', '2024-12-20'),
(43, 3, 'Hétfő', '13:00:00', '13:30:00', '2024-12-20'),
(44, 3, 'Hétfő', '13:30:00', '14:00:00', '2024-12-20'),
(45, 3, 'Hétfő', '14:00:00', '14:30:00', '2024-12-20'),
(46, 3, 'Hétfő', '14:30:00', '15:00:00', '2024-12-20'),
(47, 3, 'Hétfő', '15:00:00', '15:30:00', '2024-12-20'),
(48, 3, 'Hétfő', '15:30:00', '16:00:00', '2024-12-20'),
(49, 1, 'Hétfő', '08:00:00', '08:30:00', '2024-12-19'),
(50, 1, 'Hétfő', '08:30:00', '09:00:00', '2024-12-19'),
(51, 1, 'Hétfő', '09:00:00', '09:30:00', '2024-12-19'),
(52, 1, 'Hétfő', '09:30:00', '10:00:00', '2024-12-19'),
(53, 1, 'Hétfő', '10:00:00', '10:30:00', '2024-12-19'),
(54, 1, 'Hétfő', '10:30:00', '11:00:00', '2024-12-19'),
(55, 1, 'Hétfő', '11:00:00', '11:30:00', '2024-12-19'),
(56, 1, 'Hétfő', '11:30:00', '12:00:00', '2024-12-19'),
(57, 1, 'Hétfő', '12:00:00', '12:30:00', '2024-12-19'),
(58, 1, 'Hétfő', '12:30:00', '13:00:00', '2024-12-19'),
(59, 1, 'Hétfő', '13:00:00', '13:30:00', '2024-12-19'),
(60, 1, 'Hétfő', '13:30:00', '14:00:00', '2024-12-19'),
(61, 1, 'Hétfő', '14:00:00', '14:30:00', '2024-12-19'),
(62, 1, 'Hétfő', '14:30:00', '15:00:00', '2024-12-19'),
(63, 1, 'Hétfő', '15:00:00', '15:30:00', '2024-12-19'),
(64, 1, 'Hétfő', '15:30:00', '16:00:00', '2024-12-19'),
(65, 2, 'Hétfő', '08:00:00', '08:30:00', '2024-12-20'),
(66, 2, 'Hétfő', '08:30:00', '09:00:00', '2024-12-20'),
(67, 2, 'Hétfő', '09:00:00', '09:30:00', '2024-12-20'),
(68, 2, 'Hétfő', '09:30:00', '10:00:00', '2024-12-20'),
(69, 2, 'Hétfő', '10:00:00', '10:30:00', '2024-12-20'),
(70, 2, 'Hétfő', '10:30:00', '11:00:00', '2024-12-20'),
(71, 2, 'Hétfő', '11:00:00', '11:30:00', '2024-12-20'),
(72, 2, 'Hétfő', '11:30:00', '12:00:00', '2024-12-20'),
(73, 2, 'Hétfő', '12:00:00', '12:30:00', '2024-12-20'),
(74, 2, 'Hétfő', '12:30:00', '13:00:00', '2024-12-20'),
(75, 2, 'Hétfő', '13:00:00', '13:30:00', '2024-12-20'),
(76, 2, 'Hétfő', '13:30:00', '14:00:00', '2024-12-20'),
(77, 2, 'Hétfő', '14:00:00', '14:30:00', '2024-12-20'),
(78, 2, 'Hétfő', '14:30:00', '15:00:00', '2024-12-20'),
(79, 2, 'Hétfő', '15:00:00', '15:30:00', '2024-12-20'),
(80, 2, 'Hétfő', '15:30:00', '16:00:00', '2024-12-20'),
(81, 3, 'Hétfő', '08:00:00', '08:30:00', '2024-12-20'),
(82, 3, 'Hétfő', '08:30:00', '09:00:00', '2024-12-20'),
(83, 3, 'Hétfő', '09:00:00', '09:30:00', '2024-12-20'),
(84, 3, 'Hétfő', '09:30:00', '10:00:00', '2024-12-20'),
(85, 3, 'Hétfő', '10:00:00', '10:30:00', '2024-12-20'),
(86, 3, 'Hétfő', '10:30:00', '11:00:00', '2024-12-20'),
(87, 3, 'Hétfő', '11:00:00', '11:30:00', '2024-12-20'),
(88, 3, 'Hétfő', '11:30:00', '12:00:00', '2024-12-20'),
(89, 3, 'Hétfő', '12:00:00', '12:30:00', '2024-12-20'),
(90, 3, 'Hétfő', '12:30:00', '13:00:00', '2024-12-20'),
(91, 3, 'Hétfő', '13:00:00', '13:30:00', '2024-12-20'),
(92, 3, 'Hétfő', '13:30:00', '14:00:00', '2024-12-20'),
(93, 3, 'Hétfő', '14:00:00', '14:30:00', '2024-12-20'),
(94, 3, 'Hétfő', '14:30:00', '15:00:00', '2024-12-20'),
(95, 3, 'Hétfő', '15:00:00', '15:30:00', '2024-12-20'),
(96, 3, 'Hétfő', '15:30:00', '16:00:00', '2024-12-20'),
(97, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-18'),
(98, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-19'),
(99, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-20'),
(100, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-21'),
(101, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-22'),
(102, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-23'),
(103, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-24'),
(104, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-25'),
(105, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-26'),
(106, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-27'),
(107, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-28'),
(108, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-29'),
(109, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-30'),
(110, 1, 'Hétfő', '09:00:00', '11:00:00', '2024-12-31'),
(111, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-01'),
(112, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-02'),
(113, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-03'),
(114, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-04'),
(115, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-05'),
(116, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-06'),
(117, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-07'),
(118, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-08'),
(119, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-09'),
(120, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-10'),
(121, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-11'),
(122, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-12'),
(123, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-13'),
(124, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-14'),
(125, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-15'),
(126, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-16'),
(127, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-17'),
(128, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-18'),
(129, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-19'),
(130, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-20'),
(131, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-21'),
(132, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-22'),
(133, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-23'),
(134, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-24'),
(135, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-25'),
(136, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-26'),
(137, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-27'),
(138, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-28'),
(139, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-29'),
(140, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-30'),
(141, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-01-31'),
(142, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-01'),
(143, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-02'),
(144, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-03'),
(145, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-04'),
(146, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-05'),
(147, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-06'),
(148, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-07'),
(149, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-08'),
(150, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-09'),
(151, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-10'),
(152, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-11'),
(153, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-12'),
(154, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-13'),
(155, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-14'),
(156, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-15'),
(157, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-16'),
(158, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-17'),
(159, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-18'),
(160, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-19'),
(161, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-20'),
(162, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-21'),
(163, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-22'),
(164, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-23'),
(165, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-24'),
(166, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-25'),
(167, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-26'),
(168, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-27'),
(169, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-02-28'),
(170, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-01'),
(171, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-02'),
(172, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-03'),
(173, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-04'),
(174, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-05'),
(175, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-06'),
(176, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-07'),
(177, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-08'),
(178, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-09'),
(179, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-10'),
(180, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-11'),
(181, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-12'),
(182, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-13'),
(183, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-14'),
(184, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-15'),
(185, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-16'),
(186, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-17'),
(187, 1, 'Hétfő', '09:00:00', '11:00:00', '2025-03-18');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fodraszelerhetosegek`
--

CREATE TABLE `fodraszelerhetosegek` (
  `ElerhetosegID` int(11) NOT NULL,
  `ElerhetoNap` date NOT NULL,
  `KezdesIdo` time NOT NULL,
  `BefejezesIdo` time NOT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fodraszelerhetosegek`
--

INSERT INTO `fodraszelerhetosegek` (`ElerhetosegID`, `ElerhetoNap`, `KezdesIdo`, `BefejezesIdo`, `LetrehozasIdopontja`) VALUES
(1, '2024-12-19', '09:00:00', '17:00:00', '2024-12-18 08:00:47'),
(2, '2024-12-20', '09:00:00', '17:00:00', '2024-12-18 08:00:47'),
(3, '2024-12-20', '12:00:00', '18:00:00', '2024-12-18 08:00:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fodraszok`
--

CREATE TABLE `fodraszok` (
  `FodraszID` int(11) NOT NULL,
  `Keresztnev` varchar(50) NOT NULL,
  `Vezeteknev` varchar(50) NOT NULL,
  `Specialitas` varchar(100) DEFAULT NULL,
  `RegisztracioIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fodraszok`
--

INSERT INTO `fodraszok` (`FodraszID`, `Keresztnev`, `Vezeteknev`, `Specialitas`, `RegisztracioIdopontja`) VALUES
(1, 'László', 'Varga', 'Hajvágás, szakálligazítás', '2024-12-18 08:00:47'),
(2, 'Katalin', 'Szabó', 'Női hajvágás és festés', '2024-12-18 08:00:47'),
(3, 'Gábor', 'Kiss', 'Gyors hajvágás', '2024-12-18 08:00:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `FoglalasID` int(11) NOT NULL,
  `UgyfelID` int(11) NOT NULL,
  `FodraszID` int(11) NOT NULL,
  `SzolgaltatasID` int(11) NOT NULL,
  `FoglalasIdopont` datetime NOT NULL,
  `Allapot` enum('Foglalt','Teljesítve','Lemondva') DEFAULT 'Foglalt',
  `Megjegyzes` text DEFAULT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`FoglalasID`, `UgyfelID`, `FodraszID`, `SzolgaltatasID`, `FoglalasIdopont`, `Allapot`, `Megjegyzes`, `LetrehozasIdopontja`) VALUES
(1, 1, 1, 1, '2024-12-19 10:00:00', 'Foglalt', 'Hagyományos hajvágás', '2024-12-18 08:00:47'),
(2, 2, 2, 3, '2024-12-20 11:30:00', 'Foglalt', 'Festés a megszokott színnel', '2024-12-18 08:00:47'),
(3, 3, 3, 4, '2024-12-20 14:00:00', 'Foglalt', 'Gyors igazítás', '2024-12-18 08:00:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatasok`
--

CREATE TABLE `szolgaltatasok` (
  `SzolgaltatasID` int(11) NOT NULL,
  `SzolgaltatasNev` varchar(100) NOT NULL,
  `IdotartamPerc` int(11) NOT NULL,
  `Ar` decimal(10,2) NOT NULL,
  `LetrehozasIdopontja` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `szolgaltatasok`
--

INSERT INTO `szolgaltatasok` (`SzolgaltatasID`, `SzolgaltatasNev`, `IdotartamPerc`, `Ar`, `LetrehozasIdopontja`) VALUES
(1, 'Hajvágás', 30, 4500.00, '2024-12-18 08:00:47'),
(2, 'Szakálligazítás', 20, 2500.00, '2024-12-18 08:00:47'),
(3, 'Hajfestés', 30, 15000.00, '2024-12-18 08:00:47'),
(4, 'Gyors hajvágás', 15, 3000.00, '2024-12-18 08:00:47');

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
-- A tábla indexei `elerhetosegkapcsolat`
--
ALTER TABLE `elerhetosegkapcsolat`
  ADD KEY `FodraszID` (`FodraszID`,`ElerhetosegID`),
  ADD KEY `ElerhetosegID` (`ElerhetosegID`);

--
-- A tábla indexei `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ErtekelesID`),
  ADD KEY `FoglalasID` (`FoglalasID`);

--
-- A tábla indexei `fodraszbeosztasok`
--
ALTER TABLE `fodraszbeosztasok`
  ADD PRIMARY KEY (`BeosztasID`),
  ADD KEY `FodraszID` (`FodraszID`);

--
-- A tábla indexei `fodraszelerhetosegek`
--
ALTER TABLE `fodraszelerhetosegek`
  ADD PRIMARY KEY (`ElerhetosegID`);

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
-- AUTO_INCREMENT a táblához `fodraszbeosztasok`
--
ALTER TABLE `fodraszbeosztasok`
  MODIFY `BeosztasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT a táblához `fodraszelerhetosegek`
--
ALTER TABLE `fodraszelerhetosegek`
  MODIFY `ElerhetosegID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Megkötések a táblához `elerhetosegkapcsolat`
--
ALTER TABLE `elerhetosegkapcsolat`
  ADD CONSTRAINT `elerhetosegkapcsolat_ibfk_1` FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`),
  ADD CONSTRAINT `elerhetosegkapcsolat_ibfk_2` FOREIGN KEY (`ElerhetosegID`) REFERENCES `fodraszelerhetosegek` (`ElerhetosegID`);

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`FoglalasID`) REFERENCES `foglalasok` (`FoglalasID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `fodraszbeosztasok`
--
ALTER TABLE `fodraszbeosztasok`
  ADD CONSTRAINT `fodraszbeosztasok_ibfk_1` FOREIGN KEY (`FodraszID`) REFERENCES `fodraszok` (`FodraszID`) ON DELETE CASCADE;

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
