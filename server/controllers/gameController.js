const gameService = require('../services/gameService');

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

module.exports = {
    createGameSession
};
