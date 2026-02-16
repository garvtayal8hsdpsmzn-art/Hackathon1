'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiBarChart2, FiTrendingUp, FiTarget, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HeadToHeadPage() {
  const [comparisonType, setComparisonType] = useState('player'); // 'player' or 'team'
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlayerComparison = async () => {
    if (!player1 || !player2) {
      alert('Please enter both player names');
      return;
    }

    setLoading(true);
    try {
      const response = await api.headToHead.player(player1, player2);
      setComparison(response.data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
      // Mock data for demo
      setComparison({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTeamComparison = async () => {
    if (!team1 || !team2) {
      alert('Please enter both team names');
      return;
    }

    setLoading(true);
    try {
      const response = await api.headToHead.team(team1, team2);
      setComparison(response.data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
      // Mock data for demo
      setComparison({
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
          last_5_results: ['W', 'L', 'W', 'W', 'L'], // team1 perspective
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!comparison) return [];

    if (comparison.type === 'player') {
      return [
        {
          metric: 'Matches',
          [comparison.player1.name]: comparison.player1.stats.matches,
          [comparison.player2.name]: comparison.player2.stats.matches,
        },
        {
          metric: 'Runs',
          [comparison.player1.name]: comparison.player1.stats.runs,
          [comparison.player2.name]: comparison.player2.stats.runs,
        },
        {
          metric: 'Average',
          [comparison.player1.name]: comparison.player1.stats.average,
          [comparison.player2.name]: comparison.player2.stats.average,
        },
        {
          metric: 'Strike Rate',
          [comparison.player1.name]: comparison.player1.stats.strike_rate,
          [comparison.player2.name]: comparison.player2.stats.strike_rate,
        },
        {
          metric: 'Hundreds',
          [comparison.player1.name]: comparison.player1.stats.hundreds,
          [comparison.player2.name]: comparison.player2.stats.hundreds,
        },
      ];
    } else {
      return [
        {
          metric: 'Matches',
          [comparison.team1.name]: comparison.team1.stats.matches_played,
          [comparison.team2.name]: comparison.team2.stats.matches_played,
        },
        {
          metric: 'Wins',
          [comparison.team1.name]: comparison.team1.stats.wins,
          [comparison.team2.name]: comparison.team2.stats.wins,
        },
        {
          metric: 'Win %',
          [comparison.team1.name]: comparison.team1.stats.win_percentage,
          [comparison.team2.name]: comparison.team2.stats.win_percentage,
        },
        {
          metric: 'Avg Score',
          [comparison.team1.name]: comparison.team1.stats.average_score,
          [comparison.team2.name]: comparison.team2.stats.average_score,
        },
      ];
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FiBarChart2 className="text-green-600" />
              Head-to-Head Comparison
            </h1>
            <p className="text-gray-600">
              Compare players and teams with detailed statistics and historical data
            </p>
          </motion.div>

          {/* Comparison Type Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setComparisonType('player');
                  setComparison(null);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  comparisonType === 'player'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Player vs Player
              </button>
              <button
                onClick={() => {
                  setComparisonType('team');
                  setComparison(null);
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  comparisonType === 'team'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Team vs Team
              </button>
            </div>

            {/* Player Comparison Form */}
            {comparisonType === 'player' && (
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Player 1
                  </label>
                  <input
                    type="text"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    placeholder="Enter player name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Player 2
                  </label>
                  <input
                    type="text"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    placeholder="Enter player name"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handlePlayerComparison}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Comparing...' : 'Compare Players'}
                </button>
              </div>
            )}

            {/* Team Comparison Form */}
            {comparisonType === 'team' && (
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team 1
                  </label>
                  <input
                    type="text"
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                    placeholder="Enter team name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team 2
                  </label>
                  <input
                    type="text"
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                    placeholder="Enter team name"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handleTeamComparison}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Comparing...' : 'Compare Teams'}
                </button>
              </div>
            )}
          </motion.div>

          {/* Comparison Results */}
          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Comparison Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Entity 1 */}
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {comparison.type === 'player' ? comparison.player1.name : comparison.team1.name}
                  </h2>
                  <div className="space-y-3">
                    {comparison.type === 'player' ? (
                      <>
                        <StatRow label="Matches" value={comparison.player1.stats.matches} />
                        <StatRow label="Runs" value={comparison.player1.stats.runs.toLocaleString()} />
                        <StatRow label="Average" value={comparison.player1.stats.average.toFixed(2)} />
                        <StatRow label="Strike Rate" value={comparison.player1.stats.strike_rate.toFixed(1)} />
                        <StatRow label="Fifties" value={comparison.player1.stats.fifties} />
                        <StatRow label="Hundreds" value={comparison.player1.stats.hundreds} />
                        <StatRow label="Wickets" value={comparison.player1.stats.wickets} />
                      </>
                    ) : (
                      <>
                        <StatRow label="Matches Played" value={comparison.team1.stats.matches_played} />
                        <StatRow label="Wins" value={comparison.team1.stats.wins} />
                        <StatRow label="Losses" value={comparison.team1.stats.losses} />
                        <StatRow label="Win Percentage" value={`${comparison.team1.stats.win_percentage}%`} />
                        <StatRow label="Average Score" value={comparison.team1.stats.average_score} />
                        <StatRow label="Highest Score" value={comparison.team1.stats.highest_score} />
                      </>
                    )}
                  </div>
                </div>

                {/* Entity 2 */}
                <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {comparison.type === 'player' ? comparison.player2.name : comparison.team2.name}
                  </h2>
                  <div className="space-y-3">
                    {comparison.type === 'player' ? (
                      <>
                        <StatRow label="Matches" value={comparison.player2.stats.matches} />
                        <StatRow label="Runs" value={comparison.player2.stats.runs.toLocaleString()} />
                        <StatRow label="Average" value={comparison.player2.stats.average.toFixed(2)} />
                        <StatRow label="Strike Rate" value={comparison.player2.stats.strike_rate.toFixed(1)} />
                        <StatRow label="Fifties" value={comparison.player2.stats.fifties} />
                        <StatRow label="Hundreds" value={comparison.player2.stats.hundreds} />
                        <StatRow label="Wickets" value={comparison.player2.stats.wickets} />
                      </>
                    ) : (
                      <>
                        <StatRow label="Matches Played" value={comparison.team2.stats.matches_played} />
                        <StatRow label="Wins" value={comparison.team2.stats.wins} />
                        <StatRow label="Losses" value={comparison.team2.stats.losses} />
                        <StatRow label="Win Percentage" value={`${comparison.team2.stats.win_percentage}%`} />
                        <StatRow label="Average Score" value={comparison.team2.stats.average_score} />
                        <StatRow label="Highest Score" value={comparison.team2.stats.highest_score} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Head-to-Head Record */}
              <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiTarget className="text-purple-600" />
                  Direct Head-to-Head
                </h2>

                {comparison.type === 'player' ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Face-off Stats</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Matches Faced</span>
                          <span className="font-bold">{comparison.head_to_head.matches_faced}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">{comparison.player1.name} Dismissals</span>
                          <span className="font-bold text-green-600">
                            {comparison.head_to_head.player1_dismissals}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">{comparison.player2.name} Dismissals</span>
                          <span className="font-bold text-cyan-600">
                            {comparison.head_to_head.player2_dismissals}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Highest Scores</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">{comparison.player1.name}</span>
                          <span className="font-bold text-green-600">
                            {comparison.head_to_head.highest_score_by_player1}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">{comparison.player2.name}</span>
                          <span className="font-bold text-cyan-600">
                            {comparison.head_to_head.highest_score_by_player2}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Total Matches</p>
                      <p className="text-4xl font-bold text-purple-600">
                        {comparison.head_to_head.total_matches}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-green-100 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-1">{comparison.team1.name}</p>
                        <p className="text-3xl font-bold text-green-600">
                          {comparison.head_to_head.team1_wins}
                        </p>
                        <p className="text-xs text-gray-600">wins</p>
                      </div>
                      <div className="text-center bg-cyan-100 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-1">{comparison.team2.name}</p>
                        <p className="text-3xl font-bold text-cyan-600">
                          {comparison.head_to_head.team2_wins}
                        </p>
                        <p className="text-xs text-gray-600">wins</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Chart */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiActivity className="text-blue-600" />
                  Visual Comparison
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey={comparison.type === 'player' ? comparison.player1.name : comparison.team1.name}
                      fill="#16a34a"
                    />
                    <Bar
                      dataKey={comparison.type === 'player' ? comparison.player2.name : comparison.team2.name}
                      fill="#0891b2"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Last 5 Results (Teams only) */}
              {comparison.type === 'team' && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Last 5 Matches</h2>
                  <div className="flex gap-3 justify-center">
                    {comparison.head_to_head.last_5_results.map((result, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                          result === 'W' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    From {comparison.team1.name}'s perspective
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* No Results Placeholder */}
          {!comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center py-20"
            >
              <FiBarChart2 className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Comparison Yet</h3>
              <p className="text-gray-600">
                Enter {comparisonType === 'player' ? 'player' : 'team'} names above to see detailed head-to-head statistics
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper Component
function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
      <span className="text-gray-700">{label}</span>
      <span className="font-bold text-gray-900 text-lg">{value}</span>
    </div>
  );
}
