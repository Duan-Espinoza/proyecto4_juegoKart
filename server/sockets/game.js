
const fs = require('fs');
const path = require('path');
const gameService = require('../services/gameService'); // Servicio para acceder a la BD
const roomStartTimes = {}; // Almacena startTime por sala
const gameStates = {};     // Estado del juego por sala

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    // Cliente pide partidas actuales
    socket.on("requestAvailableGames", async () => {
      try {
        const games = await gameService.getAvailableGames();
        socket.emit("availableGames", games);
      } catch (err) {
        console.error("Error enviando partidas disponibles:", err);
      }
    });

    // Crear sala y asignar startTime
    socket.on("createRoom", ({ roomId }) => {
      const GAME_TIMEOUT_MS = 180 * 1000;
      const startTime = Date.now() + GAME_TIMEOUT_MS;
      roomStartTimes[roomId] = startTime;

      console.log(`🟢 Creando sala: ${roomId} con tiempo de inicio: ${new Date(startTime).toLocaleTimeString()}`);
      socket.join(roomId);
      socket.emit("sessionInfo", { startTime });
    });

    // Jugador se une a la sala
    socket.on("joinRoom", async ({ roomId, nickname, vehicle }) => {
      try {
        socket.join(roomId);

        const startTime = roomStartTimes[roomId];
        if (!startTime) {
          console.warn(`⚠️ No hay startTime definido para la sala ${roomId}`);
        }

        socket.emit("sessionInfo", { startTime });
        socket.to(roomId).emit("playerJoined", { nickname, vehicle });
      } catch (err) {
        console.error("Error en joinRoom:", err);
      }
    });

    // Iniciar partida manualmente
    socket.on("startGame", ({ roomId }) => {
      io.to(roomId).emit("gameStarted");
    });

    // Cerrar sala
    socket.on("closeRoom", async ({ roomId }) => {
      try {
        console.log(`🔴 Cerrando sala: ${roomId}`);
        await gameService.closeGameSession(roomId);
        io.to(roomId).emit("sessionClosed", { roomId });
        io.socketsLeave(roomId);

        const updatedGames = await gameService.getAvailableGames();
        io.emit("availableGames", updatedGames);
      } catch (error) {
        console.error("❌ Error cerrando la partida:", error);
      }
    });

    // Evento para unirse al juego real (cargar pista, asignar posiciones)
    socket.on('joinGame', async ({ roomId, nickname, vehicle, idTrack }) => {
      socket.join(roomId);

      if (!gameStates[roomId]) {
        const pistaPath = path.join(__dirname, `../utils/pista${idTrack}.json`);
        const pistaData = JSON.parse(fs.readFileSync(pistaPath, 'utf-8'));

        gameStates[roomId] = {
          board: pistaData.pista,
          inicioJugadores: pistaData.inicio_jugadores,
          players: {},
          interval: null
        };

        gameStates[roomId].interval = setInterval(() => {
          io.to(roomId).emit('updatePosition', {
            players: Object.values(gameStates[roomId].players)
          });
        }, 500);
      }

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

      io.to(roomId).emit('updatePosition', {
        players: Object.values(gameStates[roomId].players)
      });
    });

    // Evento para iniciar cuenta regresiva y enviar pista
    socket.on('startCountdown', ({ gameId }) => {
      const partida = gameStates[gameId];
      if (partida) {
        io.to(gameId).emit('initBoard', {
          board: partida.board,
          players: Object.values(partida.players)
        });

        let count = 3;
        const countdownInterval = setInterval(() => {
          if (count > 0) {
            io.to(gameId).emit('countdown', { value: count });
            count--;
          } else {
            io.to(gameId).emit('countdown', { value: 'GO' });
            io.to(gameId).emit('canMove', { canMove: true });
            clearInterval(countdownInterval);
          }
        }, 1000);
      }
    });

    // Movimiento del jugador
    socket.on('playerMove', ({ gameId, nickname, direction }) => {
      const player = gameStates[gameId]?.players[nickname];
      if (!player) return;

      player.direction = direction;
      let { x, y } = player;
      if (direction === 'up') y--;
      if (direction === 'down') y++;
      if (direction === 'left') x--;
      if (direction === 'right') x++;

      const partida = gameStates[gameId];
      if (
        partida &&
        partida.board &&
        y >= 0 && y < partida.board.length &&
        x >= 0 && x < partida.board[0].length &&
        partida.board[y][x] !== 'X'
      ) {
        player.isReverse = (direction !== 'right');
        player.x = x;
        player.y = y;

        if (partida.board[y][x] === 'L') {
          player.lapsCompleted += 1;
        }
      }

      io.to(gameId).emit('updatePosition', {
        players: Object.values(gameStates[gameId].players)
      });

      const totalLaps = 3;
      const winner = Object.values(gameStates[gameId].players).find(p => p.lapsCompleted >= totalLaps);

      if (winner) {
        const stats = Object.values(gameStates[gameId].players).map(p => ({
          nickname: p.nickname,
          vehicle: p.vehicle,
          lapsCompleted: p.lapsCompleted
        }));

        io.to(gameId).emit('gameOver', {
          winner: winner.nickname,
          stats,
          track: partida.board,
          gameId,
          totalLaps
        });

        if (partida.interval) clearInterval(partida.interval);
        delete gameStates[gameId];
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado:', socket.id);
    });
  });

  console.log('🟣 WebSocket configurado y escuchando conexiones.');
};