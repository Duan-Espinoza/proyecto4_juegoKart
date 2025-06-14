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