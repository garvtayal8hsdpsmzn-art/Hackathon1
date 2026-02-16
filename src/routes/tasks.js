const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { auth } = require('../middleware/auth');

router.get('/', tasksController.getActiveTasks);
router.post('/submit', auth, tasksController.submitTask);
router.get('/user/:userId', tasksController.getUserTasks);

module.exports = router;
