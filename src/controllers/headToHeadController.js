// Player vs Player Comparison
exports.comparePlayers = async (req, res) => {
  try {
    const { player1, player2 } = req.params;

    // In production, fetch real stats from database
    // Mock data for now
    const comparison = {
      type: 'player',
      player1: {
        name: player1,
        stats: {
          matches: 120,
          runs: 4580,
          average: 42.5,
          strike_rate: 138.2,
          fifties: 32,
          hundreds: 12,
          wickets: 45,
        },
      },
      player2: {
        name: player2,
        stats: {
          matches: 115,
          runs: 4220,
          average: 39.8,
          strike_rate: 142.7,
          fifties: 28,
          hundreds: 10,
          wickets: 38,
        },
      },
      head_to_head: {
        matches_faced: 15,
        player1_dismissals: 8,
        player2_dismissals: 7,
        highest_score_by_player1: 87,
        highest_score_by_player2: 92,
      },
    };

    res.json({
      success: true,
      ...comparison,
    });
  } catch (error) {
    console.error('Player comparison error:', error);
    res.status(500).json({ error: 'Failed to compare players' });
  }
};

// Team vs Team Comparison
exports.compareTeams = async (req, res) => {
  try {
    const { team1, team2 } = req.params;

    // Mock data
    const comparison = {
      type: 'team',
      team1: {
        name: team1,
        stats: {
          matches_played: 450,
          wins: 265,
          losses: 175,
          win_percentage: 58.9,
          average_score: 178,
          highest_score: 245,
        },
      },
      team2: {
        name: team2,
        stats: {
          matches_played: 430,
          wins: 248,
          losses: 172,
          win_percentage: 57.7,
          average_score: 172,
          highest_score: 238,
        },
      },
      head_to_head: {
        total_matches: 42,
        team1_wins: 24,
        team2_wins: 18,
        last_5_results: ['W', 'L', 'W', 'W', 'L'],
      },
    };

    res.json({
      success: true,
      ...comparison,
    });
  } catch (error) {
    console.error('Team comparison error:', error);
    res.status(500).json({ error: 'Failed to compare teams' });
  }
};
