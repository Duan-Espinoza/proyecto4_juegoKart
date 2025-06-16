
class Game {
    constructor(id, idTrack, gameMode, totalLaps, gameState = 'WAITING', gameTime = null, startDate = null, finishDate = null) {
        this.id = id;
        this.idTrack = idTrack;
        this.gameMode = gameMode; // 'VS' or 'TIEMPO'
        this.totalLaps = totalLaps;
        this.gameState = gameState; // 'WAITING', 'ACTIVE', 'FINISHED'
        this.gameTime = gameTime;
        this.startDate = startDate;
        this.finishDate = finishDate;
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
