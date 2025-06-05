import io from 'socket.io-client';  
const socket = io("https://your-server-url"); // Link temporal de NGROK para pruebas
export default socket;
// Asegúrate de reemplazar "https://your-server-url" con la URL real de tu servidor Socket.IO
// o la URL de tu servidor NGROK si estás usando uno para pruebas locales.
// Puedes usar este socket en tus componentes de React para emitir y escuchar eventos de Socket.IO
// como se muestra en el ejemplo de uso en el archivo `App.js` o cualquier otro componente.
    
