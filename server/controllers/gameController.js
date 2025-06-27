const gameService = require('../services/gameService');
const db = require('../config/database');


const createGameSession = async (req, res) => {
    const { idTrack, gameType, laps, players } = req.body;
    const io = req.app.get("io");

    console.log('Creating game session with data (backend/controllers):', { idTrack, gameType, laps, players });
    try {
        const gameSession = await gameService.createGameSession(idTrack, gameType, laps, players);
        console.log('Game session created successfully (backend/controllers):', gameSession);

        const updatedGames= await gameService.getAvailableGames();
        io.emit('availableGames', updatedGames);

        res.status(201).json(gameSession);
    } catch (error) {
        console.error('Error creating game session (backend/controllers):', error);
        res.status(500).json({ error: 'Failed to create game session (backend/controllers)' });
    }
};


const getAvailableGames = async (req, res) => {
  try {
    const availableGames = await gameService.getAvailableGames();
    console.log('Available games fetched successfully (backend/controllers):', availableGames);
    res.status(200).json(availableGames);
  } catch (error) {
    console.error('Error fetching available games (backend/controllers):', error);
    res.status(500).json({ error: 'Failed to fetch available games (backend/controllers)' });
  }
};


module.exports = {
  createGameSession,
  getAvailableGames
};