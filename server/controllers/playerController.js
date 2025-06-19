//File: server/controllers/playerController.js
const Player = require('../models/Player');
const db = require('../config/database');

const players= [];



exports.registerPlayer = (req, res) => {
    const { nickname } = req.body;
    if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
        return res.status(400).json({ error: 'Nickname is required and must be a non-empty string.' });
    }

    console.log(`Registering player with nickname: ${nickname}`);

    res.status(200).json({success: true, message: `Player ${nickname} registered successfully!`});
}


exports.joinGame = async (req, res) => {
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