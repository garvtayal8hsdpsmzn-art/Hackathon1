const express = require('express');
const router = express.Router();
const fantasyController = require('../controllers/fantasyController');
const { auth } = require('../middleware/auth');

router.post('/create-team', auth, fantasyController.createTeam);
router.get('/:userId', fantasyController.getUserTeams);
router.get('/leaderboard/:matchId', fantasyController.getLeaderboard);

module.exports = router;
