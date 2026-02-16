const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

router.get('/', matchesController.getAllMatches);
router.get('/:matchId', matchesController.getMatchById);

module.exports = router;
