const pool = require('../config/database');
const { updateUserPoints } = require('./leaderboardController');

// Get Active Tasks
exports.getActiveTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE active = true 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      tasks: result.rows,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Submit Task Answer
exports.submitTask = async (req, res) => {
  try {
    const { user_id, task_id, answer } = req.body;

    // Get task
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [task_id]);
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskResult.rows[0];

    // Check if already completed
    const existingResult = await pool.query(
      'SELECT * FROM user_tasks WHERE user_id = $1 AND task_id = $2',
      [user_id, task_id]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // Check answer
    let isCorrect = false;
    let pointsEarned = 0;

    if (task.task_type === 'trivia') {
      isCorrect = answer.toLowerCase().trim() === task.correct_answer.toLowerCase().trim();
      pointsEarned = isCorrect ? task.points : 0;
    } else {
      // For other task types, award points for completion
      isCorrect = true;
      pointsEarned = task.points;
    }

    // Save user task
    await pool.query(
      `INSERT INTO user_tasks (user_id, task_id, answer, is_correct, points_earned, completed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user_id, task_id, answer, isCorrect, pointsEarned]
    );

    // Update user points
    if (pointsEarned > 0) {
      await updateUserPoints(user_id, pointsEarned);
    }

    res.json({
      success: true,
      isCorrect,
      pointsEarned,
    });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({ error: 'Failed to submit task' });
  }
};

// Get User Tasks
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        ut.*,
        t.title,
        t.description
       FROM user_tasks ut
       JOIN tasks t ON ut.task_id = t.id
       WHERE ut.user_id = $1
       ORDER BY ut.completed_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      tasks: result.rows,
    });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
};
