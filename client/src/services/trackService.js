const API_URL = process.env.REACT_APP_API_URL;

export async function fetchTracks() {
    try {
        const response = await fetch(`${API_URL}/api/tracks`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', 
            }
        });

        if (!response.ok) throw new Error('Error al obtener pistas');
        return await response.json();
    } catch (error) {
        console.error("Error en fetchTracks:", error.message);
        return [];
    }
}

export async function getIDTrackByName(trackName) {
    try {
        const response = await fetch(`${API_URL}/api/tracks/${trackName}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', 
            }
        });
        if (!response.ok) throw new Error('Error al obtener ID de pista');
        const track = await response.json();
        console.log(`ID de la pista ${trackName}:`, track.id);
        return track.id;
    } catch (error) {
        console.error("Error en getIDTrackByName:", error.message);
        return null;
    }
}

export async function getTrackById(trackId) {
    try {
        const response = await fetch(`${API_URL}/api/tracks/id/${trackId}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', 
            }
        });

        if (!response.ok) throw new Error('Error al obtener pista por ID');
        return await response.json();
    } catch (error) {
        console.error("Error en getTrackById:", error.message);
        return null;
    }
}
