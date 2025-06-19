const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Ruta para crear una sesión de juego
router.post('/', gameController.createGameSession);

module.exports = router;