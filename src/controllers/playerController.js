const pool = require('../config/database');

// Get Player Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const { playerId } = req.params;

    const playerResult = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);
    
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerResult.rows[0];

    // Get stats
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as matches_played,
        COALESCE(SUM(runs), 0) as total_runs,
        COALESCE(SUM(wickets), 0) as total_wickets,
        COALESCE(AVG(NULLIF(runs, 0)::decimal), 0) as batting_average,
        COALESCE(AVG(NULLIF(runs, 0)::decimal / NULLIF(overs_bowled, 0)), 0) as bowling_average,
        COALESCE(AVG(CASE WHEN balls_faced > 0 THEN (runs::decimal / balls_faced * 100) ELSE 0 END), 0) as strike_rate
       FROM player_stats
       WHERE player_id = $1`,
      [player.id]
    );

    res.json({
      success: true,
      player,
      stats: statsResult.rows[0],
    });
  } catch (error) {
    console.error('Get player dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch player dashboard' });
  }
};

// Get Player Stats
exports.getStats = async (req, res) => {
  try {
    const { playerId } = req.params;

    const playerResult = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);
    
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerResult.rows[0];

    // Get recent matches
    const matchesResult = await pool.query(
      `SELECT 
        ps.*,
        m.team1 || ' vs ' || m.team2 as opponent,
        m.match_date as date,
        CASE WHEN ps.balls_faced > 0 THEN (ps.runs::decimal / ps.balls_faced * 100) ELSE 0 END as strike_rate
       FROM player_stats ps
       JOIN matches m ON ps.match_id = m.id
       WHERE ps.player_id = $1
       ORDER BY m.match_date DESC
       LIMIT 10`,
      [player.id]
    );

    res.json({
      success: true,
      recentMatches: matchesResult.rows,
    });
  } catch (error) {
    console.error('Get player stats error:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
};

// Get Performance Analysis
exports.getPerformanceAnalysis = async (req, res) => {
  try {
    const { playerId } = req.params;

    // This would call AI service in production
    // For now, return mock analysis
    const analysis = {
      strengths: [
        'Excellent strike rate in powerplay overs (avg 145)',
        'Strong performer against spin bowling',
        'Consistent boundary hitter - 8 boundaries per match',
      ],
      weaknesses: [
        'Dot ball percentage increases after 15th over',
        'Struggles against short-pitched deliveries',
        'Lower average in death overs (32 vs 45 overall)',
      ],
      recommendations: [
        'Practice rotating strike in middle overs',
        'Work on pull and hook shots against short balls',
        'Focus on finding gaps in field during death overs',
      ],
    };

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Get performance analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch performance analysis' });
  }
};

// Get Practice Drills
exports.getDrills = async (req, res) => {
  try {
    const { playerId } = req.params;

    const playerResult = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);
    
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerResult.rows[0];

    const drillsResult = await pool.query(
      `SELECT * FROM practice_drills 
       WHERE player_id = $1 
       ORDER BY assigned_at DESC
       LIMIT 10`,
      [player.id]
    );

    res.json({
      success: true,
      drills: drillsResult.rows,
    });
  } catch (error) {
    console.error('Get drills error:', error);
    res.status(500).json({ error: 'Failed to fetch practice drills' });
  }
};

// Get Opposition Dossier
exports.getOppositionDossier = async (req, res) => {
  try {
    const { teamName } = req.params;

    // Mock dossier data
    const dossier = {
      team: teamName,
      strengths: ['Strong batting lineup', 'Good pace attack'],
      weaknesses: ['Vulnerable to spin in middle overs', 'Weak fielding'],
      key_players: [
        { name: 'Player A', role: 'Batsman', threat_level: 'High' },
        { name: 'Player B', role: 'Bowler', threat_level: 'Medium' },
      ],
    };

    res.json({
      success: true,
      dossier,
    });
  } catch (error) {
    console.error('Get opposition dossier error:', error);
    res.status(500).json({ error: 'Failed to fetch opposition dossier' });
  }
};
