const db = require('./db');

class Game {
    static async create(track, laps, maxPlayers){
        const [result]= await db.query(
            'INSERT INTO games (track, laps, maxPlayers) VALUES (?, ?, ?)',
            [track, laps, maxPlayers]
        );
        return result.insertId;
    }

    // Más métodos joinGame, startGame, etc. pueden ser añadidos aquí
}