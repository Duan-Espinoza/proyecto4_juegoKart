const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
/**
 * @file playerService.js
 * Servicio para manejar las operaciones relacionadas con los jugadores.
 * Incluye funciones para registrar un jugador y obtener la lista de jugadores.
 */
export async function registerPlayer(playerData) {
    try {

    const response = await fetch(`${API_URL}/api/player/register`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
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