-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 24. 08:05
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
(1, 'László', 'Varga', 12, 'karoly king boss ceo', 'ceoceoceoceoceoceoceoceoceoceoceoceoceoceoceoceoceov', 'goatok.jpg', 1, 16, NULL, 1),
(2, 'Katalin', 'Szabó', 4, 'fortnite man', 'tanczeo reinkarnacio', 'negyiman.jpg', 8, 16, NULL, 1),
(3, 'Gábor', 'Kiss', 5, 'lightskin negyela', '123456789', 'brick.jpg', 10, 18, NULL, 1),
(5, 'Slime', 'Gyela', 23, 'CEOSKODAS', 'king ', '6793d01ad7b05.png', 20, 1, NULL, 1),
(22, 'brickskiiii', 'brickskiiii', 1, '2', '3', 'barber_679f7676c1e39.png', 1, 2, 3, 1),
(23, 'King', 'Slime', 12, 'cig', 'asd', 'barber_679f8efd44069.png', 1, 5, 7, 1),
(24, 'Gergő', 'Csibrikkk', 5, 'cigany oles', 'bahiii', 'barber_67bc76c59c83a.jpg', 8, 16, 34, 1),
(25, 'rah', 'rah', 69, 'faszveres (boldi style)', 'bahiiii', 'barber_67c9d81951f9b.jpg', 8, 16, 32, 0),
(26, 'brickski', 'brickski', 19, 'ingyen vagas luh rd', 'egy ket ha ', 'barber_67c9d949ee914.webp', 8, 11, 2, 0),
(27, 'BrickCEO', 'KingBoss', 255, 'ceoooo', 'bahiman', 'barber_67c9da3d55000.png', 8, 16, 8, 1),
(28, 'Gergő', 'Csibrik', 1, 'cigaaaaany', 'bahiii', 'barber_67c9db1331e4c.png', 10, 16, 6, 1);

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
(8, 1, 2, 3, '2025-01-17', '10:00:00', 'Teljesítve', 'cigaaany', '2025-01-16 18:16:15', 0, NULL, 0, NULL),
(12, 1, 2, 5, '2025-01-23', '08:30:00', 'Teljesítve', '', '2025-01-22 18:05:35', 0, NULL, 0, NULL),
(13, 1, 2, 5, '2025-01-23', '15:00:00', 'Teljesítve', '', '2025-01-22 18:15:06', 0, NULL, 0, NULL),
(21, 1, 2, 2, '2025-01-24', '08:30:00', 'Lemondva', '', '2025-01-22 19:41:50', 0, NULL, 0, NULL),
(22, 1, 2, 2, '2025-01-23', '09:00:00', 'Teljesítve', '', '2025-01-22 20:07:32', 0, NULL, 0, NULL),
(26, 1, 3, 1, '2025-02-18', '14:30:00', 'Teljesítve', '', '2025-02-02 14:37:20', 0, NULL, 0, NULL),
(27, 7, 23, 1, '2025-02-13', '01:00:00', 'Lemondva', ' ', '2025-02-02 15:02:52', 0, NULL, 0, NULL),
(28, 1, 2, 2, '2025-02-07', '08:30:00', 'Teljesítve', '', '2025-02-06 16:43:15', 1, NULL, 0, NULL),
(29, 21, 2, 2, '2025-02-07', '13:00:00', 'Teljesítve', '', '2025-02-06 17:10:08', 1, NULL, 0, NULL),
(30, 34, 3, 2, '2025-02-07', '12:30:00', 'Teljesítve', '', '2025-02-06 17:27:09', 1, NULL, 0, NULL),
(31, 1, 2, 2, '2025-02-07', '11:00:00', 'Teljesítve', '', '2025-02-06 17:49:39', 0, NULL, 0, NULL),
(32, 1, 2, 2, '2025-02-07', '09:00:00', 'Teljesítve', '', '2025-02-06 17:53:46', 0, NULL, 0, NULL),
(33, 1, 1, 2, '2025-02-07', '01:30:00', 'Teljesítve', '', '2025-02-06 17:54:53', 0, NULL, 0, NULL),
(34, 1, 1, 2, '2025-02-12', '06:00:00', 'Lemondva', '', '2025-02-06 18:03:50', 0, '2025-02-06 18:05:45', 0, NULL),
(35, 1, 1, 2, '2025-02-13', '03:30:00', 'Lemondva', '', '2025-02-06 18:06:06', 0, '2025-02-06 18:06:14', 0, NULL),
(36, 1, 2, 2, '2025-02-19', '10:30:00', 'Lemondva', '', '2025-02-06 18:06:33', 0, '2025-02-06 18:06:50', 0, NULL),
(37, 1, 23, 2, '2025-02-19', '02:00:00', 'Lemondva', '', '2025-02-06 18:07:52', 0, '2025-02-06 18:08:02', 0, NULL),
(38, 1, 22, 2, '2025-02-20', '01:00:00', 'Lemondva', '', '2025-02-06 18:09:38', 0, '2025-02-06 18:09:50', 0, NULL),
(39, 1, 1, 1, '2025-02-09', '01:30:00', 'Teljesítve', '', '2025-02-08 17:57:36', 1, NULL, 0, NULL),
(40, 1, 1, 1, '2025-02-09', '08:30:00', 'Teljesítve', '', '2025-02-08 17:58:28', 1, NULL, 0, NULL),
(41, 1, 1, 1, '2025-02-09', '04:30:00', 'Teljesítve', '', '2025-02-08 18:00:34', 1, NULL, 0, NULL),
(42, 1, 1, 1, '2025-02-09', '07:00:00', 'Teljesítve', '', '2025-02-08 18:02:07', 1, NULL, 0, NULL),
(43, 1, 1, 1, '2025-02-15', '06:00:00', 'Teljesítve', '', '2025-02-08 18:03:15', 0, NULL, 0, NULL),
(44, 1, 1, 1, '2025-02-09', '10:00:00', 'Teljesítve', '', '2025-02-08 18:05:06', 1, NULL, 0, NULL),
(45, 1, 1, 1, '2025-02-08', '20:30:00', 'Teljesítve', '', '2025-02-08 18:06:58', 1, NULL, 1, NULL),
(46, 35, 3, 2, '2025-02-09', '10:30:00', 'Teljesítve', '', '2025-02-08 18:09:40', 1, NULL, 0, NULL),
(47, 1, 3, 4, '2025-02-09', '13:00:00', 'Teljesítve', '', '2025-02-08 18:20:59', 1, NULL, 0, NULL),
(48, 11, 5, 5, '2025-02-09', '20:30:00', 'Teljesítve', NULL, '2025-02-08 19:25:02', 1, NULL, 0, NULL),
(49, 1, 1, 1, '2025-02-08', '21:20:00', 'Teljesítve', NULL, '2025-02-08 19:49:47', 0, NULL, 0, NULL),
(50, 1, 1, 5, '2025-02-08', '20:30:00', 'Teljesítve', NULL, '2025-02-08 19:57:05', 0, NULL, 0, NULL),
(51, 1, 1, 1, '2025-02-08', '20:30:00', 'Teljesítve', '', '2025-02-08 18:06:58', 1, NULL, 0, NULL),
(57, 1, 22, 1, '2025-02-14', '01:00:00', 'Teljesítve', '', '2025-02-13 16:30:09', 0, NULL, 0, 'f54379a6cb61d857018a221b14d034c90099d7ca116ec65a1f8da4316cf8992b'),
(58, 1, 2, 2, '2025-02-14', '09:00:00', 'Teljesítve', '', '2025-02-13 16:35:01', 0, NULL, 0, '89d3a98f2fea7b2c895af7506f0b4d84561d48b40347f7279b71e7854f22ef26'),
(59, 1, 1, 2, '2025-02-14', '06:00:00', 'Teljesítve', '', '2025-02-13 16:37:20', 0, NULL, 0, 'ede0f0abf78387ced5a2eabdd29cd38666d021dbb884bb6955e80dfbdea40d1e'),
(60, 1, 3, 2, '2025-02-21', '11:00:00', 'Lemondva', '', '2025-02-13 16:37:44', 0, '2025-02-13 16:37:51', 0, NULL),
(61, 1, 2, 5, '2025-02-22', '08:30:00', 'Lemondva', '', '2025-02-20 17:28:49', 0, '2025-02-20 17:32:43', 0, NULL),
(62, 1, 3, 3, '2025-02-21', '10:00:00', 'Teljesítve', '', '2025-02-20 17:35:58', 0, NULL, 0, '43074f1aa12c1cae2772f559a47205c7ea976d321dde6897d697e92a0f210200'),
(63, 1, 2, 2, '0000-00-00', '00:00:00', 'Lemondva', '', '2025-02-20 17:36:32', 0, '2025-02-20 17:38:15', 0, NULL),
(64, 1, 2, 5, '2025-02-25', '10:30:00', 'Lemondva', '', '2025-02-24 13:35:54', 0, NULL, 0, '4904f47c70d8eed189e1e3080d841c370b62236eb220c0deba32b28249b1a8b2'),
(65, 34, 24, 5, '2025-02-27', '14:30:00', 'Teljesítve', '', '2025-02-24 13:40:59', 0, NULL, 0, '476151711b30b84174ac401449979be3bb600a3e0a2f63dbf869258368348fcc'),
(66, 1, 22, 8, '2025-02-24', '14:10:00', 'Teljesítve', NULL, '2025-02-24 13:42:36', 0, NULL, 1, NULL),
(67, 1, 25, 3, '2025-03-20', '08:30:00', 'Foglalt', '', '2025-03-06 17:15:58', 0, NULL, 0, 'f5e2abf3ce062891d16047327080d1577fcc60b22f252afbd4bd49f53f79ee99'),
(70, 1, 3, 4, '2025-03-11', '10:00:00', 'Teljesítve', '', '2025-03-10 16:57:57', 0, NULL, 0, 'f967e13dce170a2cee795488e21b213924ec3bdf7c15ec803f0987943fe82709'),
(71, 1, 1, 1, '2025-03-13', '01:30:00', 'Teljesítve', '', '2025-03-12 17:08:17', 0, NULL, 0, '0ab08e9a8e2c7ebb96b89ad489340e18689298798b80eb835d180f08569ec2ad'),
(72, 1, 2, 1, '2025-03-15', '01:00:00', 'Teljesítve', '', '2025-03-12 17:27:05', 0, NULL, 0, 'a5a436a8e2db50e130776f6d7820c1756b74851ac29d8a947b8cf065228f8971'),
(73, 1, 2, 1, '0000-00-00', '00:00:00', 'Lemondva', '', '2025-03-12 17:27:06', 0, '2025-03-12 18:10:17', 0, NULL),
(74, 1, 2, 1, '2025-03-15', '01:00:00', 'Teljesítve', '', '2025-03-12 17:27:07', 0, NULL, 0, 'e75fc3debc7da3d6526f2f60fbec68ec58bb0f5b340d822e15acec7723ffc443'),
(75, 1, 1, 1, '0000-00-00', '00:00:00', 'Lemondva', '', '2025-03-12 17:47:56', 0, '2025-03-12 18:04:59', 0, NULL),
(76, 1, 2, 2, '2025-03-27', '08:30:00', 'Foglalt', '', '2025-03-12 18:11:54', 0, NULL, 0, 'e428b511960795c8ed4652d76b4e839a33698ac2c860e1651c94b6b82aa04ce0'),
(77, 1, 2, 2, '2025-03-13', '01:00:00', 'Teljesítve', '', '2025-03-12 19:20:33', 0, NULL, 0, 'e0d3b24fa26538d57bf9380b9b230227b1fc93dc0bd892d9c67adaad8e1c69fe'),
(78, 1, 2, 2, '2025-03-14', '01:00:00', 'Teljesítve', '', '2025-03-12 19:20:34', 0, NULL, 0, '55e5d67fd2c730f2aee0eca63a49ac8ae4338c718bb56281b8c2ba49985ba450'),
(79, 1, 3, 3, '2025-03-13', '01:00:00', 'Teljesítve', '', '2025-03-12 20:09:51', 0, NULL, 0, 'b88890e547c01fc8246510234e4de1b712f64195540e8abfad94a67bfdd8b922'),
(80, 1, 3, 3, '2025-03-14', '01:00:00', 'Teljesítve', '', '2025-03-12 20:09:52', 0, NULL, 0, '57d02c20e586da3b6f63213e10e6c9737e7cf38e732bf55d8c15e9f1f842abc6'),
(81, 1, 3, 3, '2025-03-13', '14:30:00', 'Teljesítve', '', '2025-03-12 20:13:20', 0, NULL, 0, '008f86f32f49e0dea1b503d38bec5790b7f93d7e89e2f1de0a9338274c822738'),
(82, 1, 1, 1, '2025-03-13', '06:00:00', 'Teljesítve', 'bahiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', '2025-03-12 20:32:34', 0, NULL, 0, '1d22cfff086b37b1b6098441b4c2a3f1b494d7076d5b641e5f48f4061eb0862c'),
(83, 1, 1, 1, '2025-03-20', '05:30:00', 'Foglalt', '', '2025-03-13 19:46:38', 0, NULL, 0, '7f8ef9a0dd82b35ca26ceb64a813f9ed7272c452be14c6d86b3ce53762736625'),
(84, 1, 2, 1, '0000-00-00', '00:00:00', 'Lemondva', '', '2025-03-15 16:26:21', 0, '2025-03-15 16:27:18', 0, NULL),
(85, 1, 1, 1, '2025-05-30', '11:30:00', 'Foglalt', '', '2025-03-15 16:37:03', 0, NULL, 0, '66bcad7f03091acefc7828fef3182af79b255017e07fab4deaca6599be28b309'),
(86, 1, 2, 1, '2025-03-16', '12:30:00', 'Teljesítve', '', '2025-03-15 19:43:00', 0, NULL, 0, '8f43680cc83b941c00dd1c2e1c9d998f262b86a9e2beb99bc960be66ba35965e'),
(87, 1, 1, 1, '2025-03-22', '05:30:00', 'Foglalt', '', '2025-03-15 20:07:46', 0, NULL, 0, '07dc1f45e02039d0c0941c47c601b759d06ad38151314e3fabdbe1f8b83e6182');

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

--
-- A tábla adatainak kiíratása `reviews`
--

INSERT INTO `reviews` (`ID`, `FoglalasID`, `Token`, `ExpiresAt`, `Used`, `CreatedAt`, `rating`, `comment`, `review_date`) VALUES
(1, 45, 'f6f47352dcac75b2919197dda28a2e745ca8b155f53c891cad1c3e56f1ecd0b3', '2025-02-15 20:00:02', 1, '2025-02-08 20:00:02', 5, 'king slime\n', '2025-02-08 20:03:53'),
(2, 66, '502354b2ab65214f6278a040648576bfcd2e0f87d154002bcdb047fbd3dc51da', '2025-03-03 13:44:08', 0, '2025-02-24 13:44:08', NULL, NULL, NULL),
(3, 33, '61d3a1b3b2e252ff4079e927f1c37eaa', '2025-03-04 19:22:09', 0, '2025-02-25 19:22:09', NULL, NULL, NULL),
(4, 39, 'd0aff18b1af7808b7da9d1a0d194852b', '2025-03-04 19:22:09', 1, '2025-02-25 19:22:09', 5, 'szaros\n', '2025-02-25 19:25:22'),
(5, 40, 'caa512e7dbd202f39a6bd2cb317fec9e', '2025-03-04 19:22:09', 0, '2025-02-25 19:22:09', NULL, NULL, NULL),
(6, 41, 'a4e0b42c650dd84a66a3056f898a02bb', '2025-03-04 19:22:09', 0, '2025-02-25 19:22:09', 4, 'This was a great service! Very professional and friendly.', '2025-03-01 20:57:28'),
(7, 42, '6b497b2a53aa0e90fef2243685df3934', '2025-03-04 19:22:09', 0, '2025-02-25 19:22:09', 5, 'geci hard', '2025-03-01 13:12:18'),
(8, 33, '3fb343411c62482739d25089537213d0', '2025-03-04 19:22:17', 0, '2025-02-25 19:22:17', NULL, NULL, NULL),
(9, 39, '7cbf0f27699e6edd1677ee77fa50742c', '2025-03-04 19:22:17', 0, '2025-02-25 19:22:17', 5, 'szaros\n', '2025-02-25 19:25:22'),
(10, 40, '94c66f74bebd9f7bd0bf12ad6e92d21e', '2025-03-04 19:22:17', 0, '2025-02-25 19:22:17', NULL, NULL, NULL),
(11, 41, 'a8fd367aec9da0cfb6d5ec1f302cb483', '2025-03-04 19:22:17', 0, '2025-02-25 19:22:17', 4, 'This was a great service! Very professional and friendly.', '2025-03-01 20:57:28'),
(12, 42, '02a42efc2af3246c5359419118b8d7f4', '2025-03-04 19:22:17', 0, '2025-02-25 19:22:17', 5, 'geci hard', '2025-03-01 13:12:18'),
(13, 33, 'a224bd9cd23f92197bf8cd516b03da12', '2025-03-04 19:23:33', 0, '2025-02-25 19:23:33', NULL, NULL, NULL),
(14, 39, 'c8d93bf1594701aa25a2e8ec00b0803a', '2025-03-04 19:23:33', 0, '2025-02-25 19:23:33', 5, 'szaros\n', '2025-02-25 19:25:22'),
(15, 40, 'c782e0db3883b369366a60784c6fb484', '2025-03-04 19:23:33', 0, '2025-02-25 19:23:33', NULL, NULL, NULL),
(16, 41, 'c5f03d3ec17016e1018837963ede6f8f', '2025-03-04 19:23:33', 1, '2025-02-25 19:23:33', 4, 'This was a great service! Very professional and friendly.', '2025-03-01 20:57:28'),
(17, 42, '0d92f636568e1dc1d331cdb104376e45', '2025-03-04 19:23:33', 1, '2025-02-25 19:23:33', 5, 'geci hard', '2025-03-01 13:12:18'),
(18, 8, '', '0000-00-00 00:00:00', 0, '2025-03-15 19:24:04', 5, 'ccccccc', '2025-02-06 17:26:31'),
(21, 86, 'cigany', '2025-03-15 19:44:49', 1, '2025-03-15 19:44:49', 5, 'cigany', '2025-03-15 19:44:23');

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
(1, 'Hajvágás', 30, 4500.00, 'dickey'),
(2, 'Szakálligazítás', 20, 2500.00, 'rah'),
(3, 'Hajfestés', 30, 15000.00, 'rah'),
(4, 'Gyors hajvágás', 15, 3000.00, 'rah'),
(5, 'Gyerek hajvágás', 20, 3000.00, 'Hajvágás gyerekeknek, gyors és professzionális.'),
(8, '2', 3, 2.00, '1'),
(10, 'bahi ember vagas', 29, 6969.00, 'trimm asl nahh fr');

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
(2, 'brickski', 'brickski', '12357', 'ceo456@gmail.com', '$2y$10$hbX8ohv.rvStpCEjVjff8uFJ9nptVsldDx6kbrUj2Po2MufpBlNdy', 'Felhasználó', '2025-01-09 19:25:11', NULL, 0, NULL),
(3, 'brickskiiii', 'brickskiiii', '12357555', 'ceiiio456@gmail.com', '$2y$10$SBHjgfU1oLV7An8iAapWz.u81zby1J6vIaTsa/6fV5OaYvGmHqHJq', 'Barber', '2025-01-09 19:28:24', NULL, 0, NULL),
(4, 'win gyula', 'win gyula', '12323346', 'ciganygyula@gmail.com', '$2y$10$Mn4Ww8Zx4Z0wTl4GvEz2SezebUNiDlnx2FdiWb16hKAgQQK14uZiG', 'Felhasználó', '2025-01-09 21:58:56', NULL, 0, NULL),
(5, 'Anna', 'Kovács', '06701234567', 'anna.kovacs@gmail.com', '$2y$10$examplehash', 'Barber', '2025-01-14 09:00:00', NULL, 0, NULL),
(6, 'Gergő', 'Csibrik', '123573425', 'geri127@gmail.com', '$2y$10$2zn4sX7S3vZnlj1nOFNbEOO4cqKu29q0AgfvPu1O/miFi14EUV2vm', 'Barber', '2025-01-16 18:22:26', NULL, 0, NULL),
(7, 'King', 'Slime', '06703274211', 'ceo999@gmail.com', '$2y$10$Mi8EZq1dPTMvNoKEIvRD4uyP6JbYXxOJNNf0p4eR4Tery6Mrpy5l.', 'Barber', '2025-01-24 14:32:56', NULL, 0, NULL),
(8, 'BrickCEO', 'KingBoss', '06703274212', 'brick@gmail.com', '$2y$10$2Q9MzgsGO7VBFRWMWm8LT.0m3FvoBJON.XNUT3EmKRAWAjUEmLKjG', 'Barber', '2025-01-24 16:47:11', NULL, 0, NULL),
(10, 'A cigány', 'Gyula', '1231231234', 'laszlogyula10@gmail.com', '$2y$10$5DXfbugKSpdLOfB4boyr3uVP/.ZKTicrpGz./EpRNMfTg/At71klG', 'Felhasználó', '2025-02-05 17:45:06', NULL, 0, NULL),
(11, 'A cigány', 'Gyula', '1231231235', 'laszlogyula11@gmail.com', '$2y$10$GF4.Nm/KtKfcRlNAeklb9uTT1snS8ObfLsFPQirBRLdqvla05z6Om', 'Felhasználó', '2025-02-05 17:45:46', NULL, 0, NULL),
(14, 'A cigány', 'Gyula', '12323346999', 'laszlogyula9@gmail.com', '$2y$10$gdnQNhZEJQwLTce7fCTHnOwf7sOunhdUeP9uPonHmgIPXNLy65voK', 'Felhasználó', '2025-02-05 18:02:20', NULL, 0, NULL),
(15, 'Károly Boss', 'NegyiMan', '1232334699999', 'geri122@gmail.com', '$2y$10$TNImM6Rd7UaQJMaReAEdDOqe2fhZT3IBgy12dhjkdeF.SLmn.zfdC', 'Felhasználó', '2025-02-05 18:04:25', NULL, 0, NULL),
(17, 'C.E.O', 'Boldizsar', '999999999123123', 'kissboldizsar2005@gmail.com', '$2y$10$H4zFov86duvKuvQnzyiPr.WNjGjab3Fk9p0xpv24vvLzJ5qyCgZ6y', 'Felhasználó', '2025-02-05 18:09:11', NULL, 0, NULL),
(18, 'Boldizsár', 'Kiss', '0620123456', 'kissboldizsar2006@gmail.com', '$2y$10$YbCg4Kjx26INj47LXOX2je917oFBu9PLTFA8CCJZaleBGYx713vHm', 'Felhasználó', '2025-02-05 18:12:24', NULL, 0, NULL),
(19, 'A cigány', 'KingBoss', '123233469999999', 'sziteszeplany@gmail.com', '$2y$10$a2jh5Sy9f2nPPECOYKb2GOE73z8ZULNg8Mc89ztZBhCf1DoaBmRVq', 'Felhasználó', '2025-02-05 18:14:38', NULL, 0, NULL),
(20, 'CEOzsar', 'Boldizsar', '1234566654535', 'kissboldizsar2004@gmail.com', '$2y$10$imha603jfYUfXaLWzVGbdO4MftmulkB4MU3JaP0iopQkR0FHwqwNS', 'Felhasználó', '2025-02-05 18:18:59', NULL, 1, '2025-02-06 17:06:55'),
(21, 'C.E.O', 'Boldizsar', '888888888', 'ger127@gmail.com', '$2y$10$MgO5WFalYR/KLtIHEJfwe.vU5/GW5cdJVDinlv0rol2hb.N4tCLMS', 'Felhasználó', '2025-02-05 18:20:12', NULL, 0, NULL),
(22, 'CEO', 'Danesz', '55555555', 'silaged2004@gmail.com', '$2y$10$aIc1xJE.uu7z7YbNTwrP1.SfivD/wPFDcGfjXOwuuFYq7QHCfRqBW', 'Felhasználó', '2025-02-05 18:29:06', NULL, 0, NULL),
(23, 'C.E.O', 'Gyula', '0670327421999', 'sziateszeplay@gmail.com', '$2y$10$xL/8mX/GiLswXFVxyE9h7.LydHChodMvZEPzJHJXw//u9fzy8u7bi', 'Felhasználó', '2025-02-05 18:54:22', NULL, 1, NULL),
(24, 'Boss', 'Ceo', '213123123123123', 'rajmi.hu@gmail.com', '$2y$10$Q34z4Hcw2N0dTYxPEBnMzeIECLvgG7vz9Qy3lYh.oc6hpvMIGhx5a', 'Felhasználó', '2025-02-06 15:32:34', NULL, 0, NULL),
(25, 'BrickCEO', 'Gyula', '16703274210', 'sziateszeplany@gmail.co', '$2y$10$wh2UfPbaG3OxPE2pmRxT7eH./BuCZhOxQhSxx1tDsZ6YXypOMV5he', 'Felhasználó', '2025-02-06 15:37:04', NULL, 1, NULL),
(26, 'BrickCEO', 'Boldizsar', '067032742199999', 'sziatezeplany@gmail.com', '$2y$10$kxe18k2.fQXX7PeS/Kjd7ufJo1wJhtPJLB.dgBl241vVJesQUQ1ue', 'Felhasználó', '2025-02-06 15:40:11', NULL, 0, NULL),
(27, 'Boldizsár', 'Gyula', '12357999999999', 'siateszeplany@gmail.com', '$2y$10$gSGnIQCt.bLXT24Ii5Z9tedlE/91521cY5VVLODgQzmNaRU5rhI/y', 'Felhasználó', '2025-02-06 16:45:07', '76ac111a317d2844b16840c727f1589e58d9871cfe3c2e1bb53453adc8dae792', 1, '2025-02-08 18:31:22'),
(32, 'rah', 'rah', '394823874', 'ffff@gmail.com', '$2y$10$NePebObr66y185RjKaTmDOhEqc4mPQf2w5e6kwBDGVkRU1n8Nsq.m', 'Felhasználó', '2025-02-06 17:02:01', NULL, 1, '2025-02-06 17:02:18'),
(34, 'Gergő', 'Csibrikkk', '0678827421000', 'sziateszeplany@gmail.com', '$2y$10$EJTW2e7/5qxnLMNuVkP0ouFOULMZ43TK/XYxWONPF29WZDP7NHNn.', 'Barber', '2025-02-06 17:24:01', NULL, 1, '2025-02-06 17:24:18'),
(35, 'Gergő', 'Negyela', '06309413730', 'geri1227@gmail.com', '$2y$10$1l.PjgM6hdcaCyD6uPO8ZeZmImSTMdSAqHn8QdLkaNtvVOMb56YRK', 'Felhasználó', '2025-02-08 18:09:17', '09aae283de945e66cf5414485431eafb7c3168ccd537a9046452ed7bae5a0d7b', 0, NULL);

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
  MODIFY `FoglalasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `szolgaltatasok`
--
ALTER TABLE `szolgaltatasok`
  MODIFY `SzolgaltatasID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `ugyfelek`
--
ALTER TABLE `ugyfelek`
  MODIFY `UgyfelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
