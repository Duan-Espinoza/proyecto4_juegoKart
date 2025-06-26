/**
 * Nombre: game.js
 * Descripción: Configuración de eventos de Socket.io para el juego.
 * @param {*} io 
 */

const gameService = require('../services/gameService'); // Servicio que maneja DB

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    // Cliente pide partidas actuales
    socket.on("requestAvailableGames", async () => {
      try {
        const games = await gameService.getAvailableGames();
        socket.emit("availableGames", games); // Solo al cliente que lo pidió
      } catch (err) {
        console.error("Error enviando partidas disponibles:", err);
      }
    });

    // Unirse a una sala
    socket.on('joinRoom', ({ roomId, nickname, vehicle }) => {
      socket.join(roomId);
      socket.to(roomId).emit('playerJoined', { nickname, vehicle });
    });

    // Cerrar sala (usado por el host)
    socket.on("closeRoom", async ({ roomId }) => {
      try {
        console.log(`🔴 Cerrando sala: ${roomId}`);
        await gameService.closeGameSession(roomId); // 1. Actualiza BD
        io.to(roomId).emit("sessionClosed", { roomId }); // 2. Notifica jugadores
        io.socketsLeave(roomId); // 3. Fuerza salida de todos los sockets

        // 🔄 4. Emitir lista actualizada a todos
        const updatedGames = await gameService.getAvailableGames();
        io.emit("availableGames", updatedGames);

        console.log(`✅ Partida ${roomId} cerrada y jugadores notificados.`);
      } catch (error) {
        console.error("❌ Error cerrando la partida:", error);
      }
    });

    // Inicio de la partida
    socket.on('startGame', ({ roomId }) => {
      io.to(roomId).emit('gameStarted');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado:', socket.id);
      // Aquí podrías manejar lógica futura para salir de la sala o marcar jugadores desconectados
    });
  });

  console.log('🟣 WebSocket configurado y escuchando conexiones.');
};
