module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('joinGame', (gameId) => {
      socket.join(gameId);
      // Lógica para actualizar jugadores en sala
        
        
    });

    socket.on('playerMove', (data) => {
      io.to(data.gameId).emit('updatePosition', data);
    });
  });
};