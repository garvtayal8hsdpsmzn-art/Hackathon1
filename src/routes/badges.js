const express = require('express');
const router = express.Router();
const badgesController = require('../controllers/badgesController');

router.get('/', badgesController.getAllBadges);
router.get('/:userId', badgesController.getUserBadges);

module.exports = router;
