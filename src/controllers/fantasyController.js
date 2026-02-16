const pool = require('../config/database');
const { updateUserPoints } = require('./leaderboardController');

// Create Fantasy Team
exports.createTeam = async (req, res) => {
  try {
    const { user_id, match_id, team_name, player_ids } = req.body;

    if (player_ids.length !== 11) {
      return res.status(400).json({ error: 'Fantasy team must have exactly 11 players' });
    }

    const result = await pool.query(
      `INSERT INTO fantasy_teams (user_id, match_id, team_name, player_ids, total_points, created_at)
       VALUES ($1, $2, $3, $4, 0, NOW())
       RETURNING *`,
      [user_id, match_id, team_name, player_ids]
    );

    // Award points for creating team
    await updateUserPoints(user_id, 30);

    res.status(201).json({
      success: true,
      team: result.rows[0],
    });
  } catch (error) {
    console.error('Create fantasy team error:', error);
    res.status(500).json({ error: 'Failed to create fantasy team' });
  }
};

// Get User Teams
exports.getUserTeams = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        ft.*,
        m.team1 || ' vs ' || m.team2 as match_name
       FROM fantasy_teams ft
       JOIN matches m ON ft.match_id = m.id
       WHERE ft.user_id = $1
       ORDER BY ft.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      teams: result.rows,
    });
  } catch (error) {
    console.error('Get fantasy teams error:', error);
    res.status(500).json({ error: 'Failed to fetch fantasy teams' });
  }
};

// Get Leaderboard for Match
exports.getLeaderboard = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await pool.query(
      `SELECT 
        ft.*,
        u.name as user_name
       FROM fantasy_teams ft
       JOIN users u ON ft.user_id = u.id
       WHERE ft.match_id = $1
       ORDER BY ft.total_points DESC
       LIMIT 50`,
      [matchId]
    );

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    console.error('Get fantasy leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch fantasy leaderboard' });
  }
};
