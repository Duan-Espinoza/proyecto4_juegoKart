// server/routes/trackRoutes.js
const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Obtener todas las pistas desde la base de datos
router.get('/', trackController.getAllTracks);

// Registrar pistas leyendo los archivos JSON (utilizar solo una vez o en desarrollo)
router.post('/register', trackController.registerTracksFromFiles);

// Obtener una pista por su nombre
router.get('/:trackName', trackController.getTrackIdByName);

module.exports = router;