const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/available', gameController.getAvailableGames);

router.post('/', gameController.createGameSession);

module.exports = router;