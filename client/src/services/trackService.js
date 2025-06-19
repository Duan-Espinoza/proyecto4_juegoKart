export async function fetchTracks() {
    try {
        const response = await fetch(`http://localhost:3001/api/tracks`);
        if (!response.ok) throw new Error('Error al obtener pistas');
        return await response.json();
    } catch (error) {
        console.error("Error en fetchTracks:", error.message);
        return [];
    }
}

export async function getIDTrackByName(trackName) {
    try {
        const response = await fetch(`http://localhost:3001/api/tracks/${trackName}`);
        if (!response.ok) throw new Error('Error al obtener ID de pista');
        const track = await response.json();
        console.log(`ID de la pista ${trackName}:`, track.id);
        return track.id;
    } catch (error) {
        console.error("Error en getIDTrackByName:", error.message);
        return null;
    }
}