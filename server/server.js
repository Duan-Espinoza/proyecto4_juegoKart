//server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cors = require('cors');
//const { Server } = require('socket.io');
const playerRoutes = require('./routes/playerRoutes');
const db = require('./config/database');
const gameRoutes = require('./routes/gameRoutes');
// Configuración del servidor Express
// ...existing code...
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// Configuración de la conexión a la base de datos MySQL
require('./sockets/game')(io);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Respuesta del servidor');
});

app.use('/api/register', playerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);

// Se cambia app.listen por server.listen
server.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});

// Test de conexión a la base de datos MySQL
async function testDB() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente.');
    connection.release();
  } catch (err) {
    console.error('❌ Fallo en conexión a MySQL:', err.message);
  }
}

testDB();