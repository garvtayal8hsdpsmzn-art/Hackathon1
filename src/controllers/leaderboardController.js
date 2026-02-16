const pool = require('../config/database');

// Get Top Users
exports.getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await pool.query(
      `SELECT id, name, email, avatar_url, leaderboard_points as points, current_streak
       FROM users
       ORDER BY leaderboard_points DESC, current_streak DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get User Rank
exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's rank
    const rankResult = await pool.query(
      `SELECT 
        id,
        name,
        leaderboard_points as points,
        current_streak,
        (SELECT COUNT(*) + 1 FROM users WHERE leaderboard_points > u.leaderboard_points) as rank
       FROM users u
       WHERE id = $1`,
      [userId]
    );

    if (rankResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      ...rankResult.rows[0],
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
};

// Update User Points
exports.updateUserPoints = async (userId, pointsToAdd) => {
  try {
    await pool.query(
      'UPDATE users SET leaderboard_points = leaderboard_points + $1, updated_at = NOW() WHERE id = $2',
      [pointsToAdd, userId]
    );
    return true;
  } catch (error) {
    console.error('Update points error:', error);
    return false;
  }
};
