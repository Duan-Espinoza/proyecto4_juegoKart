
export async function createGameSession(gameData) {
    try {
        const response = await fetch(`http://localhost:3001/api/gameSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
        });
        if (!response.ok) {
            throw new Error('Error creating game session');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}