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

const joinGame = async (req, res) => {
  const { gameId, nickname, vehiculo } = req.body;
  if (!gameId || !nickname) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Verifica si la partida existe y está esperando jugadores
    const [games] = await db.query(
      'SELECT * FROM GameSession WHERE id = ? AND gameState = "WAITING"', [gameId]
    );
    if (games.length === 0) {
      return res.status(404).json({ error: 'Partida no encontrada o ya iniciada' });
    }

    // Verifica si el jugador ya está unido
    const [players] = await db.query(
      'SELECT * FROM Player WHERE idGame = ? AND nickName = ?', [gameId, nickname]
    );
    if (players.length > 0) {
      return res.status(409).json({ error: 'Ya estás unido a esta partida' });
    }

    // Inserta al jugador en la partida
    await db.query(
      'INSERT INTO Player (idGame, nickName, vehicle) VALUES (?, ?, ?)',
      [gameId, nickname, vehiculo || 'Rojo']
    );

    res.json({ success: true, message: 'Unido a la partida' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al unirse a la partida' });
  }
};
module.exports = {
    registerGamePlayer,
    joinGame
};