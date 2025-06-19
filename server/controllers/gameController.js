const gameService = require('../services/gameService');

const createGameSession = async (req, res) => {
    const { idTrack, gameType, laps } = req.body;
    console.log('Creating game session with data:', { idTrack, gameType, laps });
    try {
        const gameSession = await gameService.createGameSession(idTrack, gameType, laps);
        console.log('Game session created successfully:', gameSession);
        res.status(201).json(gameSession);
    } catch (error) {
        console.error('Error creating game session:', error);
        res.status(500).json({ error: 'Failed to create game session' });
    }
};

module.exports = {
    createGameSession
};
