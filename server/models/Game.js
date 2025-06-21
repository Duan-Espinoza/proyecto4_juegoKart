const db = require('../config/database');
class Game {
    constructor(idTrack, gameMode, totalLaps, hostPlayerId= null, gameState = 'WAITING', gameTime = null, startDate = null, finishDate = null) {
        this.idTrack = idTrack;
        this.gameMode = gameMode; // 'VS' or 'TIEMPO'
        this.totalLaps = totalLaps;
        this.hostPlayerId = hostPlayerId;
        this.gameState = gameState; // 'WAITING', 'ACTIVE', 'FINISHED'
        this.gameTime = gameTime;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.players = []; // Array to hold player objects
    }

    start() {
        this.gameState = 'ACTIVE';
        this.startDate = new Date();
    }

    finish() {
        this.gameState = 'FINISHED';
        this.finishDate = new Date();
        if (this.startDate) {
            this.gameTime = Math.floor((this.finishDate - this.startDate) / 1000); // seconds
        }
    }

    addPlayer(player) {
        this.players.push(player);
    }

    setHostPlayer(playerId) {
        this.hostPlayerId = playerId;
    }


    toDBObject() {
        return {
            id: this.id,
            idTrack: this.idTrack,
            gameMode: this.gameMode,
            totalLaps: this.totalLaps,
            gameState: this.gameState,
            gameTime: this.gameTime,    
            startDate: this.startDate,
            finishDate: this.finishDate
        };
    }

    static fromDatabase(row) {
        return new Game(
            row.id,
            row.idTrack,
            row.gameMode,
            row.totalLaps,
            row.gameState,
            row.gameTime,
            row.startDate,
            row.finishDate
        );
    }
}


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

module.exports = Game;