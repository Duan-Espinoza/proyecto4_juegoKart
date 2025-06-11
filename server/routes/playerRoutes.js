// File: server/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/', playerController.registerPlayer); 

module.exports = router;