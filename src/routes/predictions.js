const express = require('express');
const router = express.Router();
const predictionsController = require('../controllers/predictionsController');
const { auth } = require('../middleware/auth');

router.post('/', auth, predictionsController.createPrediction);
router.get('/user/:userId', predictionsController.getUserPredictions);
router.get('/:matchId', predictionsController.getPredictionsByMatch);

module.exports = router;
