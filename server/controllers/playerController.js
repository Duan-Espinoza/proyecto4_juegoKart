const playerService = require('../services/playerService');


const registerGamePlayer = async (req, res) => {
    const { nickname, idSession, isHost } = req.body;
    console.log('Registering player with data (backend/controllers):', { nickname, idSession, isHost });
    try {
        if (!nickname) { return res.status(400).json({ message: 'The nickname is required (backend/controllers).' }); }
        if (!idSession) {
            return res.status(400).json({ message: "The session ID is required (backend/controllers)." });
        }

        const player = await playerService.registerPlayer(idSession, nickname, isHost);
        if (!player) {
            console.error("Error al registrar el jugador (backend/controllers): No se pudo crear el jugador.");
            return res.status(500).json({ message: "Error al registrar el jugador (backend/controllers)." });
        }
        console.log('Player registered successfully (backend/controllers):', player);
        res.status(201).json({ message: "Jugador registrado exitosamente (backend/controllers).", player });

    } catch (error) {
        console.error("Error al registrar el jugador (backend/controllers):", error.message);
        res.status(500).json({ message: "Error interno al registrar el jugador (backend/controllers)." });
    }
};
module.exports = {
    registerGamePlayer
};