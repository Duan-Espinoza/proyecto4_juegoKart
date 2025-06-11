-- File: server/database/schema.sql

-- Crear la base de datos y seleccionarla
CREATE DATABASE luiki_kart;
USE luiki_kart;

-- Crear tabla de pistas
CREATE TABLE Track (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nameTrack VARCHAR(50) NOT NULL, 
    thematic VARCHAR(50) NOT NULL,
    totalLanes INT,
    layout JSON NOT NULL
);	

-- Crear tabla de sesiones de juego
CREATE TABLE GameSession (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idTrack INT NOT NULL,
    gameMode ENUM ('VS', 'TIEMPO') NOT NULL,
    totalLaps INT NOT NULL,
    gameState ENUM ('WAITING','ACTIVE','FINISHED') DEFAULT 'WAITING',
    gameTime INT,
    startDate DATETIME,
    finishDate DATETIME,
    FOREIGN KEY (idTrack) REFERENCES Track(id)
);

-- Crear tabla de jugadores
CREATE TABLE Player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickName VARCHAR(50) NOT NULL,
    idGame INT NOT NULL,
    gamePosition INT,
    completedLaps INT DEFAULT 0,
    totalTime INT DEFAULT 0,
    FOREIGN KEY (idGame) REFERENCES GameSession(id)
);

-- Crear tabla de ranking
CREATE TABLE Ranking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gameWinner INT NOT NULL,
    timePlaying INT,
    trackId INT,
    laps INT,
    idGame INT,
    FOREIGN KEY (gameWinner) REFERENCES Player(id),
    FOREIGN KEY (trackId) REFERENCES Track(id),
    FOREIGN KEY (idGame) REFERENCES GameSession(id)
    -- No FOREIGN KEY en laps
);

