const Game = require('../models/Game');
const pool = require('../config/database');

async function createGameSession(idTrack, gameType, laps) {
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

        return { sessionId: result.insertId, ...newGame };
    } catch (error) {
        console.error('Error creating game session:', error);
        throw error;
    }
}

module.exports = {
    createGameSession,
};
