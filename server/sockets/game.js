/**
 * Nombre: game.js
 * Descripción: Configuración de eventos de Socket.io para el juego.
 * @param {*} io 
 */

const fs = require('fs');
const path = require('path');
const gameStates = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a la sala de juego
    socket.on('joinRoom', async ({ roomId, nickname, vehicle, idTrack }) => {
      socket.join(roomId);

      // Si es el primer jugador, carga la pista y posiciones iniciales
      if (!gameStates[roomId]) {
        // Cargar la pista desde la base de datos o archivo JSON
        // Aquí ejemplo con archivo JSON:
        const pistaPath = path.join(__dirname, `../utils/pista${idTrack}.json`);
        const pistaData = JSON.parse(fs.readFileSync(pistaPath, 'utf-8'));

        // Guardar la pista y posiciones iniciales en el estado de la partida
        gameStates[roomId] = {
          board: pistaData.pista,
          inicioJugadores: pistaData.inicio_jugadores,
          players: {},
          interval: null 
        };


        // Iniciar intervalo para emitir posiciones cada 0.5s
        gameStates[roomId].interval = setInterval(() => {
          io.to(roomId).emit('updatePosition', {
            players: Object.values(gameStates[roomId].players)
          });
        }, 500);

      }

      // Asignar posición inicial según el orden de llegada
      const idx = Object.keys(gameStates[roomId].players).length;
      const posInicial = gameStates[roomId].inicioJugadores[idx];
      gameStates[roomId].players[nickname] = {
        nickname,
        vehicle,
        x: posInicial.posicion.x,
        y: posInicial.posicion.y,
        direction: 'right',
        lapsCompleted: 0,
        isReverse: false
      };

      // Notificar a todos la lista de jugadores y la pista
      io.to(roomId).emit('updatePosition', {
        players: Object.values(gameStates[roomId].players)
      });
    });

    // Cuando inicia la partida, envía la pista y posiciones iniciales
    socket.on('startCountdown', ({ gameId }) => {
      const partida = gameStates[gameId];
      if (partida) {
        io.to(gameId).emit('initBoard', {
          board: partida.board,
          players: Object.values(partida.players)
        });
      }
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

    // Movimiento de jugador
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

      // Validar movimiento según la pista
      const partida = gameStates[gameId];
      if (
        partida &&
        partida.board &&
        y >= 0 && y < partida.board.length &&
        x >= 0 && x < partida.board[0].length &&
        partida.board[y][x] !== 'X' // 'X' es pared
      ) {
        // Detectar sentido contrario (ejemplo simple)
        const direccionCorrecta = 'right'; // Puedes obtener esto de la pista real
        player.isReverse = (direction !== direccionCorrecta);

        player.x = x;
        player.y = y;
        // Aquí puedes validar si completó una vuelta y actualizar lapsCompleted
        // Por ejemplo, si pasa por la meta (celda 'L'):
        if (partida.board[y][x] === 'L') {
          player.lapsCompleted += 1;
        }
      }

      // Notificar a todos los jugadores la lista actualizada
      io.to(gameId).emit('updatePosition', {
        players: Object.values(gameStates[gameId].players)
      });

      // Validar si hay ganador (ejemplo: 3 vueltas)
      const totalLaps = 3; // O usa el valor real de la partida
      const winner = Object.values(gameStates[gameId].players).find(p => p.lapsCompleted >= totalLaps);

      if (winner) {
        // Calcular estadísticas
        const stats = Object.values(gameStates[gameId].players).map(p => ({
          nickname: p.nickname,
          vehicle: p.vehicle,
          lapsCompleted: p.lapsCompleted,
          // Puedes agregar tiempo si lo llevas
        }));

        // Guardar en la base de datos (ejemplo simple)
        // Aquí deberías usar tu modelo y lógica real para insertar en Ranking
        // await db.query('INSERT INTO Ranking ...', [...]);

        io.to(gameId).emit('gameOver', {
          winner: winner.nickname,
          stats,
          track: partida.board, // O el nombre/id de la pista
          gameId,
          totalLaps
        });

        // Limpiar el intervalo de la sala
        if (partida.interval) clearInterval(partida.interval);
        delete gameStates[gameId];
      }
    });


    // Iniciar juego (opcional, si lo usas)
    socket.on('startGame', ({ gameId }) => {
      io.to(gameId).emit('gameStarted');
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
      // Aquí podrías limpiar el estado si lo deseas
    });
  });

  console.log('WebSocket configurado y escuchando conexiones.');
};