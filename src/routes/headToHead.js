const express = require('express');
const router = express.Router();
const headToHeadController = require('../controllers/headToHeadController');

router.get('/player/:player1/:player2', headToHeadController.comparePlayers);
router.get('/team/:team1/:team2', headToHeadController.compareTeams);

module.exports = router;
