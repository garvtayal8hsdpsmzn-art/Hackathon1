const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/google', authController.googleLogin);
router.post('/player-login', authController.playerLogin);
router.post('/player-register', authController.playerRegister);
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);

module.exports = router;
