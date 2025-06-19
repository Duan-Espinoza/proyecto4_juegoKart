const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/active', gameController.getActiveGames);

module.exports = router;