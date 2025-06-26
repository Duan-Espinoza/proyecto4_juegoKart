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

async function closeGameSession(roomId) {
    
    try {
        console.log(`Closing game session with id: ${roomId}`);
        const [result] = await pool.execute('UPDATE Gamesession SET gameState = "CLOSED", finishDate = NOW() WHERE id = ?', [roomId]);
        if (result.affectedRows > 0) {
            console.log(`Game session ${roomId} closed successfully.`);
            return { success: true };
        } else {
            console.warn(`No game session found with id ${roomId}.`);
            return { success: false, message: 'Game session not found.' };
        }
    } catch (error) {
        console.error('Error closing game session:', error);
        throw error;
    }
}

module.exports = {
    createGameSession,
    getAvailableGames,
    closeGameSession
};