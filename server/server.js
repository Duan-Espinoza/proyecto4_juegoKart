/**
 * Nombre del archivo: server/server.js
 * Descripción: Configuración del servidor Express con Socket.io para manejar eventos de juego y comunicación en tiempo real.
 * 
 */

// Importaciones de librerías principales
const express = require('express');
const cors = require('cors');
const http = require('http');
const mysql = require('mysql2');
const { Server } = require('socket.io');

// Importaciones de módulos locales
const db = require('./config/database');
const trackServices = require('./services/trackService');
const playerRoutes = require('./routes/playerRoutes');
const trackRoutes = require('./routes/trackRoutes');
const gameRoutes = require('./routes/gameRoutes');
const setupSocketHandlers = require('./sockets/game'); // función exportada que recibe `io`
const rankingRoutes = require('./routes/rankingRoutes');

// Configuración del servidor Express + Socket.io
const app = express();
const server = http.createServer(app); // Necesario para socket.io
const io = new Server(server, { cors: { origin: '*' } });

// Asignar el objeto io a la aplicación Express para que esté disponible en las rutas
app.set("io", io);

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/api/ranking', rankingRoutes);

// Rutas REST
app.use('/api/player', playerRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/gameSession', gameRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ Servidor Express con WebSocket funcionando.');
});

// WebSocket handlers (sockets/game.js)
setupSocketHandlers(io); // Esto configura eventos como 'joinRoom', 'playerJoined', etc.

// Inicio del servidor HTTP y registro de pistas
const PORT = 3001;
server.listen(PORT, async () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);

  try {
    await trackServices.registerTracks();
    console.log('✅ Pistas registradas correctamente.');
  } catch (error) {
    console.error('❌ Error registrando pistas:', error.message);
  }

  await testDBConnection();
});

// Verificación de conexión MySQL
async function testDBConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente.');
    connection.release();
  } catch (err) {
    console.error('❌ Fallo en conexión a MySQL:', err.message);
  }
}
// Exportar el servidor para pruebas unitarias
module.exports = server;