const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cors = require('cors');
const { Server } = require('socket.io');


app.use(cors());

app.get('/', (req, res) => {
  res.send('Respuesta del servidor');
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

