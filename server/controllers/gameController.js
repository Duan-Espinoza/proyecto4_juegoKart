const gameService = require('../services/gameService');
const db = require('../config/database');


const createGameSession = async (req, res) => {
    const { idTrack, gameType, laps } = req.body;
    console.log('Creating game session with data (backend/controllers):', { idTrack, gameType, laps });
    try {
        const gameSession = await gameService.createGameSession(idTrack, gameType, laps);
        console.log('Game session created successfully (backend/controllers):', gameSession);
        res.status(201).json(gameSession);
    } catch (error) {
        console.error('Error creating game session (backend/controllers):', error);
        res.status(500).json({ error: 'Failed to create game session (backend/controllers)' });
    }
};


const getActiveGames = async (req, res) => {
  try {
    const [games] = await db.query(`
      SELECT 
        g.id, 
        t.nameTrack AS track, 
        t.thematic AS theme, 
        g.totalLaps, 
        g.gameMode, 
        g.gameState,
        t.totalLanes AS max_players
      FROM GameSession g
      JOIN Track t ON g.idTrack = t.id
      WHERE g.gameState = 'WAITING'
    `);

    // Para cada partida, obtener los jugadores unidos
    for (let game of games) {
      const [players] = await db.query(
        'SELECT nickName FROM Player WHERE idGame = ?', [game.id]
      );
      game.joined = players.length;
      game.players = players.map(p => p.nickName);
    }

    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener partidas activas' });
  }
};

module.exports = {
  createGameSession,
  getActiveGames
};