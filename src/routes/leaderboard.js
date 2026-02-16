const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.get('/', leaderboardController.getTopUsers);
router.get('/:userId', leaderboardController.getUserRank);

module.exports = router;
