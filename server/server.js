//server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cors = require('cors');
const { Server } = require('socket.io');
const playerRoutes = require('./routes/playerRoutes');
const db = require('./config/database');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Respuesta del servidor');
});

app.use('/api/register', playerRoutes);

app.listen(port, () => {
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