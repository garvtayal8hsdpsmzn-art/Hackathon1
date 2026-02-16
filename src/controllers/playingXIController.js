const axios = require('axios');

// Suggest Playing XI
exports.suggestPlayingXI = async (req, res) => {
  try {
    const { team, opposition, pitch_condition, venue, match_type } = req.body;

    // In production, call AI service
    // const response = await axios.post(`${process.env.AI_SERVICE_URL}/ai/suggest-playing-xi`, req.body);
    
    // Mock response for now
    const suggestion = {
      team_name: team,
      playing_xi: [
        { name: 'Opener 1', role: 'Batsman', reason: 'Excellent form - 3 fifties in last 5 matches' },
        { name: 'Opener 2', role: 'Batsman', reason: 'Strong record at this venue - average 52' },
        { name: 'No. 3', role: 'Batsman', reason: 'Good against pace - 145 SR vs fast bowlers' },
        { name: 'Middle Order 1', role: 'All-Rounder', reason: 'Balanced player - can bowl at death' },
        { name: 'Middle Order 2', role: 'All-Rounder', reason: '5 wickets in last 3 matches' },
        { name: 'Wicket Keeper', role: 'Wicket-Keeper', reason: 'Best keeper in squad - 8 dismissals recently' },
        { name: 'Finisher', role: 'Batsman', reason: 'Death over specialist - SR 165' },
        { name: 'Bowler 1', role: 'Bowler', reason: 'Effective on this pitch type - 12 wickets in 4 games' },
        { name: 'Bowler 2', role: 'Bowler', reason: 'Good against opposition - 3 wickets vs them last time' },
        { name: 'Bowler 3', role: 'Bowler', reason: 'Death over specialist - economy rate 7.2' },
        { name: 'Bowler 4', role: 'Bowler', reason: 'Swing bowler - pitch offers movement' },
      ],
      strategy: {
        batting_order: 'Aggressive top order, stabilize middle, power finish',
        bowling_plan: 'Use pacers in powerplay, spin in middle overs, pace at death',
        fielding: 'Attacking field in first 6 overs, then contain',
      },
      key_insights: [
        `${opposition} struggles against spin on this pitch`,
        `Weather forecast suggests overcast conditions - favor pacers`,
        `Pitch has assisted bowlers in last 3 matches here`,
        `Opposition weak against left-arm pace`,
      ],
    };

    res.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error('Playing XI suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate playing XI suggestion' });
  }
};
