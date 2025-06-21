const Player = require("../models/Player");
const pool = require("../config/database");

async function registerPlayer(idSession, nickname, isHost = false) {
    try {
        console.log("Registrando jugador:", nickname, "en la sesión ID:", idSession, "Host:", isHost, "(backend/services)");

        // Verificar si el nickname es válido
        if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
            throw new Error("El nombre del jugador es obligatorio y debe ser una cadena no vacía.");
        }
        // Verificar si el idSession es válido
        if (!idSession || typeof idSession !== 'number') {
            throw new Error("El ID de la sesión es obligatorio y debe ser un número.");
        }
        // Verificar si el nickname ya está registrado
        const [rows] = await pool.execute(
            'SELECT id FROM Player WHERE nickname = ?',
            [nickname]
        );
        if (rows.length > 0) {
            throw new Error("El nickname ya está en uso. Por favor, elige otro.");
        }


        // Crear una nueva instancia de Player
        const player = new Player(idSession, nickname, isHost);
        console.log("Jugador creado:", player.nickName, "ID de sesión:", player.idSession);

        // Insertar el jugador en la base de datos
        const [result] = await pool.execute(
            'INSERT INTO Player (nickname, idGame) VALUES (?, ?)',
            [player.nickName, player.idSession]
        );
        if (result.affectedRows === 0) {
            throw new Error("Error al registrar el jugador en la base de datos.");
        }


        // Asignar el ID del jugador registrado
        player.id = result.insertId;
        console.log(`Jugador registrado: ${player.nickName} con ID: ${player.id}, Host: ${player.isHost}`);
        return player; // Retornar el jugador registrado


    } catch (error) {
        console.error("Error al verificar el nickname (backend/services):", error.message);
        throw new Error("Error al verificar el nickname del jugador (backend/services).");
    }
}

module.exports = {
    registerPlayer
};