const db = require('../config/database');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('joinGame', async (gameId) => {
      socket.join(gameId);

      // Obtén la lista actualizada de jugadores en la partida
      const [players] = await db.query(
        'SELECT nickName, vehicle FROM Player WHERE idGame = ?', [gameId]
      );
      // Notifica a todos en la sala la lista actualizada
      io.to(gameId).emit('waitingRoomUpdate', players);
    });

    socket.on('playerMove', (data) => {
      io.to(data.gameId).emit('updatePosition', data);
    });
  });
};