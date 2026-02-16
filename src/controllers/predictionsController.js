const pool = require('../config/database');
const { updateUserPoints } = require('./leaderboardController');

// Create Prediction
exports.createPrediction = async (req, res) => {
  try {
    const { user_id, match_id, prediction_type, prediction_value } = req.body;

    // Check if user already predicted for this match
    const existing = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 AND match_id = $2 AND prediction_type = $3',
      [user_id, match_id, prediction_type]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You have already made this prediction for this match' });
    }

    // Create prediction
    const result = await pool.query(
      `INSERT INTO predictions (user_id, match_id, prediction_type, prediction_value, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [user_id, match_id, prediction_type, prediction_value]
    );

    // Award points for making prediction
    await updateUserPoints(user_id, 50);

    res.status(201).json({
      success: true,
      prediction: result.rows[0],
    });
  } catch (error) {
    console.error('Create prediction error:', error);
    res.status(500).json({ error: 'Failed to create prediction' });
  }
};

// Get User Predictions
exports.getUserPredictions = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        p.*,
        m.team1 || ' vs ' || m.team2 as match_name
       FROM predictions p
       JOIN matches m ON p.match_id = m.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    // Calculate accuracy
    const total = result.rows.filter(p => p.is_correct !== null).length;
    const correct = result.rows.filter(p => p.is_correct === true).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({
      success: true,
      predictions: result.rows,
      accuracy,
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

// Get Predictions by Match
exports.getPredictionsByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await pool.query(
      `SELECT 
        p.*,
        u.name as user_name
       FROM predictions p
       JOIN users u ON p.user_id = u.id
       WHERE p.match_id = $1
       ORDER BY p.created_at DESC`,
      [matchId]
    );

    res.json({
      success: true,
      predictions: result.rows,
    });
  } catch (error) {
    console.error('Get match predictions error:', error);
    res.status(500).json({ error: 'Failed to fetch match predictions' });
  }
};
