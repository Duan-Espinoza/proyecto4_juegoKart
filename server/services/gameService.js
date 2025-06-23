const Game = require('../models/Game');
const pool = require('../config/database');

async function createGameSession(idTrack, gameType, laps, players) {
    try {
        const newGame = new Game(idTrack, gameType, laps);
        const [result] = await pool.execute(
            'INSERT INTO Gamesession (idTrack, gameMode, totalLaps, gameState, gameTime, startDate, finishDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                newGame.idTrack,
                newGame.gameMode,
                newGame.totalLaps,
                newGame.gameState,
                newGame.gameTime,
                newGame.startDate,
                newGame.finishDate,
            ]
        );
        newGame.setId(result.insertId); 
        newGame.setPlayers(players);
        console.log('Game session created (backend/services):', result);
        return { sessionId: result.insertId, ...newGame };
    } catch (error) {
        console.error('Error creating game session:', error);
        throw error;
    }
}

async function getAvailableGames() {
    try {
        const [rows] = await pool.execute('SELECT * FROM Gamesession WHERE gameState = "WAITING"');
        console.log('Available games fetched (backend/services):', rows);
        const games = rows.map(row => Game.fromDatabase(row));
        // Añadir jugador al juego con mismo ID de sesión
        for (const game of games) {
            const [players] = await pool.execute('SELECT * FROM Player WHERE idGame = ?', [game.getId()]);
            game.setPlayers(players);
        }
        return games;
    } catch (error) {
        console.error('Error fetching available games:', error);
        throw error;
    }
}

module.exports = {
    createGameSession,
    getAvailableGames
};
