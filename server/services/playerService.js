const Player = require("../models/Player");
const pool = require("../config/database");

async function registerPlayer(name, idGame) {
    try {
        const [rows] = await pool.execute(
            'SELECT id FROM Player WHERE nickname = ?',
            [name]
        );
        if (rows.length > 0) {
            console.log(`Jugador ${name} ya está registrado con ID: ${rows[0].id}`);
            return rows[0].id;
        }

        const newPlayer = new Player(name);
        const nicknameToInsert = newPlayer.nickname || name;
        const result = await pool.execute(
            'INSERT INTO Player (nickname, idGame) VALUES (?, ?)',
            [nicknameToInsert, idGame]
        );
        
        //obtener el ID del nuevo jugador insertado desde la base de datos
        newPlayer.id = result[0].insertId;
        console.log(`Registro de nuevo jugador: ${newPlayer.nickname} con ID: ${newPlayer.id}`);
        return newPlayer.id;
    } catch (error) {
        console.error("Error registrando jugador:", error);
        throw error;
    }
}

module.exports = {
    registerPlayer
};