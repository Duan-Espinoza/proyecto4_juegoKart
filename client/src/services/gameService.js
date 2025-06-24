
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export async function createGameSession(gameData) {
    try {
        const response = await fetch(`${API_URL}/api/gameSession`, {
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
        console.log('Response:', response);

        return data;
    
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchGameSessions() {
    try {
        const response = await fetch(`${API_URL}/api/gameSession/available`);
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