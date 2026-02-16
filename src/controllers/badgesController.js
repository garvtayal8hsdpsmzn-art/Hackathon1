const pool = require('../config/database');

// Get All Badges
exports.getAllBadges = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY id');

    res.json({
      success: true,
      badges: result.rows,
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
};

// Get User Badges
exports.getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        b.*,
        ub.earned_at
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = $1
       ORDER BY ub.earned_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      badges: result.rows,
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({ error: 'Failed to fetch user badges' });
  }
};

// Award Badge to User
exports.awardBadge = async (userId, badgeId) => {
  try {
    // Check if already has badge
    const existing = await pool.query(
      'SELECT * FROM user_badges WHERE user_id = $1 AND badge_id = $2',
      [userId, badgeId]
    );

    if (existing.rows.length > 0) {
      return false;
    }

    await pool.query(
      'INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES ($1, $2, NOW())',
      [userId, badgeId]
    );

    return true;
  } catch (error) {
    console.error('Award badge error:', error);
    return false;
  }
};

// Check and Award Badges (called after user actions)
exports.checkAndAwardBadges = async (userId) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const badgesResult = await pool.query('SELECT * FROM badges');
    const badges = badgesResult.rows;

    for (const badge of badges) {
      const criteria = badge.criteria;

      let shouldAward = false;

      // Check criteria
      if (criteria.type === 'streak') {
        shouldAward = user.current_streak >= criteria.value;
      } else if (criteria.type === 'points') {
        shouldAward = user.leaderboard_points >= criteria.value;
      } else if (criteria.type === 'predictions') {
        const predResult = await pool.query(
          'SELECT COUNT(*) FROM predictions WHERE user_id = $1 AND is_correct = true',
          [userId]
        );
        shouldAward = parseInt(predResult.rows[0].count) >= criteria.value;
      }

      if (shouldAward) {
        await exports.awardBadge(userId, badge.id);
      }
    }
  } catch (error) {
    console.error('Check badges error:', error);
  }
};
