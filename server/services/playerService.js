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
            'INSERT INTO Player (nickname, idGame, isHost) VALUES (?, ?, ?)',
            [player.nickName, player.idSession, player.isHost ]
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

async function getHostPlayer(sessionId) {
    try {
        console.log("Obteniendo jugador host para la sesión ID:", sessionId, "(backend/services)");
        // Verificar si el sessionId es válido
        if (!sessionId || typeof sessionId !== 'number') { 
            throw new Error("El ID de la sesión es obligatorio y debe ser un número");
        }
        // Consultar el jugador host de la base de datos
        const [rows] = await pool.execute(
            'SELECT * FROM Player WHERE idGame = ? AND isHost = 1',
            [sessionId]
        );
        if (rows.length === 0) {
            throw new Error("No se encontró un jugador host para la sesión especificada.");
        }
        console.log("Jugador host encontrado(backend/services):", rows[0].nickname, "ID:", rows[0].id);
        return rows[0]; // Retornar el jugador host encontrado
    } catch (error) {
        console.error("Error al obtener el jugador host (backend/services):", error.message);
        throw new Error("Error al obtener el jugador host (backend/services).");
    }
}

//Funcion que retorna los jugadores de una partida
async function getPlayersBySessionId(sessionId) {
    try {
        console.log("Obteniendo jugadores para la sesión ID:", sessionId, "(backend/services)");
        // Verificar si el sessionId es válido
        if (!sessionId || typeof sessionId !== 'number') {
            throw new Error("El ID de la sesión es obligatorio y debe ser un número");
        }
        // Consultar los jugadores de la base de datos
        const [rows] = await pool.execute(
            'SELECT * FROM Player WHERE idGame = ?',
            [sessionId]
        );
        if (rows.length === 0) {
            throw new Error("No se encontraron jugadores para la sesión especificada.");
        }
        console.log("Jugadores encontrados (backend/services):", rows);
        return rows; // Retornar los jugadores encontrados
    } catch (error) {
        console.error("Error al obtener jugadores (backend/services):", error.message);
        throw new Error("Error al obtener jugadores (backend/services).");
    }
}

module.exports = {
    registerPlayer,
    getHostPlayer,
    getPlayersBySessionId
};