const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = require('./models/db');
db.connect();

module.exports = app;