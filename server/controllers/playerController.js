const playerService = require('../services/playerService');


const registerGamePlayer = async (req, res) => {
    const { nickname, IdTrack } = req.body;
    try {
        if (!nickname) {
            return res.status(400).json({ message: "El apodo del jugador es obligatorio." });
        }
        const playerId = await playerService.registerPlayer(nickname, IdTrack);
        res.status(201).json({ message: `Jugador registrado con ID: ${playerId}` });
    } catch (error) {
        console.error("Error al registrar el jugador:", error.message);
        res.status(500).json({ message: "Error interno al registrar el jugador." });
    }
};
module.exports = {
    registerGamePlayer
};