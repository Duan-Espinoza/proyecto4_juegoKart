// File: server/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Ruta para registrar un jugador
router.post('/register', playerController.registerGamePlayer);
// Ruta para unirse a una sesión de juego
router.post('/join', playerController.joinGame);
// Ruta para obtener el jugador host de una sesión
router.get('/host/:sessionId', playerController.getHostPlayer);


module.exports = router;