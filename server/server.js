//server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cors = require('cors');
const { Server } = require('socket.io');
const playerRoutes = require('./routes/playerRoutes');


app.use(cors());
app.use(express.json());  
app.get('/', (req, res) => {
  res.send('Respuesta del servidor');
});
app.use('/api/register', playerRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

