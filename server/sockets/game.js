/**
 * Nombre: game.js
 * Descripción: Configuración de eventos de Socket.io para el juego.
 * @param {*} io 
 */


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id); 

    socket.on('joinRoom', ({ roomId, nickname, vehicle }) => {
      socket.join(roomId);  
      socket.to(roomId).emit('playerJoined', { nickname, vehicle });
    });

    

    socket.on('startGame', ({ roomId }) => {
      io.to(roomId).emit('gameStarted');
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  console.log('WebSocket configurado y escuchando conexiones.');
};