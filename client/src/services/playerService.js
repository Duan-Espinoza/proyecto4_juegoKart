//file: client/src/services/playerService.js
export async function registerPlayer(playerData) {
    try {
        
    const response = await fetch('http://localhost:3001/api/player/register', {
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