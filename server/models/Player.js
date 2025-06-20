//File: server/models/Player.js
class Player {
    
    constructor(idSession, nickName, isHost = false) {
        this.idSession = idSession; // ID de la sesión a la que pertenece el jugador
        this.nickName = nickName; // Nombre del jugador
        this.id = null; // ID del jugador, se asignará al registrarlo en la base de datos
        this.isHost = isHost; // Indica si el jugador es el anfitrión de la sesión
        this.isReady = false; // Indica si el jugador está listo para comenzar el juego
        this.position = { x: 0, y: 0 }; // Posición del jugador en el juego
        this.lapsCompleted = 0; // Número de vueltas completadas por el jugador
        this.posicionFinal = 0; // Posición final del jugador en la carrera
        this.time = 0; // Tiempo total del jugador en la carrera
    }

    // Método para actualizar la posición del jugador
    updatePosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    // Método para marcar al jugador como listo
    setReady() {
        this.isReady = true;
    }

    // Método para marcar al jugador como anfitrión
    setHost() {
        this.isHost = true;
    }

    // Método para registrar el tiempo del jugador
    recordTime(time) {
        this.time = time;
    }
}

module.exports = Player;