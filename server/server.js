const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cors = require('cors');
const { Server } = require('socket.io');

// Importar archivos de configuración, rutas y servicios
const db = require('./config/database');
const playerRoutes = require('./routes/playerRoutes');
const trackRoutes = require('./routes/trackRoutes');
const trackServices = require('./services/trackService');

app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Respuesta del servidor');
});

// Rutas
app.use('/api/register', playerRoutes);
app.use('/api/tracks', trackRoutes);

app.listen(port, async () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
  await trackServices.registerTracks(); // Registrar pistas al iniciar el servidor
  console.log('✅ Pistas registradas correctamente.');
});

// Test de conexión a MySQL
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
