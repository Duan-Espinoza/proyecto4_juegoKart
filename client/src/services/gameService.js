
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
/**
 * Crea una nueva sesión de juego enviando los datos del juego al servidor.
 * 
 * @async
 * @function
 * @param {Object} gameData - Los datos de la sesión de juego a crear.
 * @returns {Promise<Object>} Los datos de la sesión de juego creada.
 * @throws {Error} Lanza un error si ocurre un problema al crear la sesión de juego.
 */
export async function createGameSession(gameData) {
    try {
        const response = await fetch(`${API_URL}/api/gameSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', 
            },
            body: JSON.stringify(gameData),
        });
        if (!response.ok) {
            throw new Error('Error creating game session(client/gameService.js): ');
        }
        const data = await response.json(); 
        console.log('Game session created successfully:', data);
        console.log('Response:', response);

        return data;
    
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchGameSessions() {
    try {
        const response = await fetch(`${API_URL}/api/gameSession/available`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', 
            },
        });
        if (!response.ok) {
            throw new Error('Error fetching game sessions(client/gameService.js): ');
        }
        const data = await response.json();
        console.log('Game sessions fetched successfully:', data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}