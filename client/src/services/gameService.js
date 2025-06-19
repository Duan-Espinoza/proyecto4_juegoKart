// Recibe 
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
            throw new Error('Error creating game session(client/gameService.js): ');
        }
        const data = await response.json();
        console.log('Game session created successfully:', data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}