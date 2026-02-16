vconst express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/dashboard/:playerId', playerController.getDashboard);
router.get('/stats/:playerId', playerController.getStats);
router.get('/performance-analysis/:playerId', playerController.getPerformanceAnalysis);
router.get('/drills/:playerId', playerController.getDrills);
router.get('/opposition-dossier/:teamName', playerController.getOppositionDossier);

module.exports = router;
