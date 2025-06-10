//File: server/controllers/playerController.js
const Player = require('../models/Player');
const db = require('../config/database');

const players= [];



exports.registerPlayer = (req, res) => {
    const { nickname } = req.body;
    if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
        return res.status(400).json({ error: 'Nickname is required and must be a non-empty string.' });
    }

    console.log(`Registering player with nickname: ${nickname}`);

    res.status(200).json({success: true, message: `Player ${nickname} registered successfully!`});
}