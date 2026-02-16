const express = require('express');
const router = express.Router();
const playingXIController = require('../controllers/playingXIController');

router.post('/suggest', playingXIController.suggestPlayingXI);

module.exports = router;
