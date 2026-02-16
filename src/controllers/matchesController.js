const pool = require('../config/database');

// Get All Matches
exports.getAllMatches = async (req, res) => {
  try {
    const upcomingResult = await pool.query(
      `SELECT * FROM matches 
       WHERE match_date > NOW() 
       ORDER BY match_date ASC 
       LIMIT 10`
    );

    const recentResult = await pool.query(
      `SELECT * FROM matches 
       WHERE match_date <= NOW() 
       ORDER BY match_date DESC 
       LIMIT 10`
    );

    res.json({
      success: true,
      upcomingMatches: upcomingResult.rows,
      recentMatches: recentResult.rows,
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// Get Match by ID
exports.getMatchById = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await pool.query('SELECT * FROM matches WHERE id = $1', [matchId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({
      success: true,
      match: result.rows[0],
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
};
