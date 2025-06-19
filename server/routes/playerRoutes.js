// File: server/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Ruta para registrar un jugador
router.post('/register', playerController.registerGamePlayer);

module.exports = router;