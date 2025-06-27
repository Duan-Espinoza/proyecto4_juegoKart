/**
 * Nombre: game.js
 * Descripción: Configuración de eventos de Socket.io para el juego.
 * @param {*} io 
 */

// Mapa en memoria para el estado de cada sala de juego
const gameStates = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a la sala de juego
    socket.on('joinGame', ({ gameId, nickname, vehicle }) => {
      socket.join(gameId);

      // Inicializar estado de juego si no existe
      if (!gameStates[gameId]) gameStates[gameId] = { players: {} };

      // Posición inicial (ejemplo: x=0, y=0, dirección 'right')
      gameStates[gameId].players[nickname] = {
        nickname,
        vehicle,
        x: 0,
        y: 0,
        direction: 'right',
        lapsCompleted: 0,
        isReverse: false
      };

      // Notificar a todos los jugadores la lista actualizada
      io.to(gameId).emit('updatePosition', {
        players: Object.values(gameStates[gameId].players)
      });
    });

    // Movimiento de jugador
    socket.on('playerMove', ({ gameId, nickname, direction }) => {
      const player = gameStates[gameId]?.players[nickname];
      if (!player) return;

      // Actualizar dirección
      player.direction = direction;

      // Calcular nueva posición
      let { x, y } = player;
      if (direction === 'up') y -= 1;
      if (direction === 'down') y += 1;
      if (direction === 'left') x -= 1;
      if (direction === 'right') x += 1;

      // Validar movimiento (aquí puedes consultar la pista real)
      // Por simplicidad, solo validamos que no salga del tablero 20x15
      if (x >= 0 && x < 20 && y >= 0 && y < 15) {
        player.x = x;
        player.y = y;
        // Aquí puedes validar si completó una vuelta y actualizar lapsCompleted
      }

      // Ejemplo: detectar sentido contrario (ajusta según tu lógica de pista)
      player.isReverse = false; // Cambia a true si detectas sentido contrario

      // Notificar a todos los jugadores la lista actualizada
      io.to(gameId).emit('updatePosition', {
        players: Object.values(gameStates[gameId].players)
      });

      // Validar si hay ganador (ejemplo: 3 vueltas)
      const winner = Object.values(gameStates[gameId].players).find(p => p.lapsCompleted >= 3);
      if (winner) {
        io.to(gameId).emit('gameWinner', { winner: winner.nickname });
      }
    });

    // Iniciar juego
    socket.on('startGame', ({ gameId }) => {
      io.to(gameId).emit('gameStarted');
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
      // Aquí podrías limpiar el estado si lo deseas
    });

    // Evento para iniciar la cuenta regresiva
    socket.on('startCountdown', async ({ gameId }) => {
      // Emitir cuenta regresiva a todos los jugadores de la sala
      let count = 3;
      const countdownInterval = setInterval(() => {
        if (count > 0) {
          io.to(gameId).emit('countdown', { value: count });
          count--;
        } else if (count === 0) {
          io.to(gameId).emit('countdown', { value: 'GO' });
          io.to(gameId).emit('canMove', { canMove: true }); // Permitir movimiento
          clearInterval(countdownInterval);
        }
      }, 1000);
    });


  });

  console.log('WebSocket configurado y escuchando conexiones.');
};