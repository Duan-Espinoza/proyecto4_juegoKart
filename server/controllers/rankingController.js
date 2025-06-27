const db = require('../config/database');

const getRanking = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id, 
        p.nickName AS winnerName, 
        r.timePlaying, 
        t.nameTrack AS track, 
        r.laps, 
        r.idGame
      FROM Ranking r
      JOIN Player p ON r.gameWinner = p.id
      JOIN Track t ON r.trackId = t.id
      ORDER BY r.timePlaying ASC, r.laps DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener el ranking:', error);
    res.status(500).json({ error: 'Error al obtener el ranking' });
  }
};

module.exports = { getRanking };