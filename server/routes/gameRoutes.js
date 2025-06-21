const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/active', gameController.getActiveGames);

router.post('/', gameController.createGameSession);

module.exports = router;