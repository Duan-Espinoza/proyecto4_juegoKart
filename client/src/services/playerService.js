const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
/**
 * @file playerService.js
 * Servicio para manejar las operaciones relacionadas con los jugadores.
 * Incluye funciones para registrar un jugador y obtener la lista de jugadores.
 */
export async function registerPlayer({idSession, nickname, isHost}) {
    try {
        console.log('Registrando jugador con los siguientes datos:', {idSession, nickname, isHost});

    
    const response = await fetch(`${API_URL}/api/player/register`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', 
        },
        body: JSON.stringify({
            idSession,
            nickname,
            isHost
        }),
    });

    if (!response.ok) {
        throw new Error('Error al registrar el jugador');
    }
    const data = await response.json();
    console.log('Jugador registrado exitosamente:', data);

    return data;   // Devuelve los datos del jugador registrado
    } catch (error) {
        console.error('Error en registerPlayer:', error);
        throw error;    // Propaga el error para manejarlo en el componente
    }
}

export async function getHostPlayer(sessionId) {
    try {
        const response = await fetch(`${API_URL}/api/player/host/${sessionId}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', 
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener el jugador host');
        }
        const data = await response.json();
        console.log('Jugador host obtenido exitosamente:', data);
        return data;   // Devuelve los datos del jugador host
    } catch (error) {
        console.error('Error en getHostPlayer:', error);
        throw error;    // Propaga el error para manejarlo en el componente
    }
}