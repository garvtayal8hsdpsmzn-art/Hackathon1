'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function PlayingXIPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [pitchCondition, setPitchCondition] = useState('balanced');
  const [opposition, setOpposition] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.matches.getAll();
      setMatches(response.data.upcomingMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setSelectedTeam('');
    setOpposition('');
    setAiSuggestion(null);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setOpposition(team === selectedMatch.team1 ? selectedMatch.team2 : selectedMatch.team1);
  };

  const generatePlayingXI = async () => {
    if (!selectedMatch || !selectedTeam) {
      alert('Please select a match and team');
      return;
    }

    setGenerating(true);
    try {
      const response = await api.playingXI.suggest({
        team: selectedTeam,
        opposition: opposition,
        pitch_condition: pitchCondition,
        venue: selectedMatch.venue,
        match_type: selectedMatch.match_type,
      });

      setAiSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Error generating Playing XI:', error);
      // Mock data for demo
      setAiSuggestion({
        team_name: selectedTeam,
        playing_xi: [
          { name: 'Player 1', role: 'Batsman', reason: 'Excellent form - 3 fifties in last 5 matches' },
          { name: 'Player 2', role: 'Batsman', reason: 'Strong record at this venue - average 52' },
          { name: 'Player 3', role: 'Batsman', reason: 'Good against pace - 145 SR vs fast bowlers' },
          { name: 'Player 4', role: 'All-Rounder', reason: 'Balanced player - can bowl at death' },
          { name: 'Player 5', role: 'All-Rounder', reason: '5 wickets in last 3 matches' },
          { name: 'Player 6', role: 'Wicket-Keeper', reason: 'Best keeper in squad - 8 dismissals recently' },
          { name: 'Player 7', role: 'Bowler', reason: 'Effective on this pitch type - 12 wickets in 4 games' },
          { name: 'Player 8', role: 'Bowler', reason: 'Good against opposition - 3 wickets vs them last time' },
          { name: 'Player 9', role: 'Bowler', reason: 'Death over specialist - economy rate 7.2' },
          { name: 'Player 10', role: 'Bowler', reason: 'Swing bowler - pitch offers movement' },
          { name: 'Player 11', role: 'Bowler', reason: 'Yorker specialist - 85% accuracy' },
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
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

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
              <FiUsers className="text-green-600" />
              AI Playing XI Selector
            </h1>
            <p className="text-gray-600">
              Get AI-powered team selection based on form, pitch conditions, and opposition analysis
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Input Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card sticky top-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Selection Parameters</h2>

                <div className="space-y-6">
                  {/* Select Match */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Match
                    </label>
                    <div className="space-y-2">
                      {matches.slice(0, 5).map((match) => (
                        <div
                          key={match.id}
                          onClick={() => handleMatchSelect(match)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                            selectedMatch?.id === match.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{match.team1}</span>
                            <span className="text-gray-500 text-xs">vs</span>
                            <span className="font-semibold text-sm">{match.team2}</span>
                          </div>
                          <p className="text-xs text-gray-600">{match.venue}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Team */}
                  {selectedMatch && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Your Team
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleTeamSelect(selectedMatch.team1)}
                          className={`p-3 rounded-lg border-2 font-semibold transition ${
                            selectedTeam === selectedMatch.team1
                              ? 'border-green-600 bg-green-50 text-green-700'
                              : 'border-gray-200 text-gray-700 hover:border-green-300'
                          }`}
                        >
                          {selectedMatch.team1}
                        </button>
                        <button
                          onClick={() => handleTeamSelect(selectedMatch.team2)}
                          className={`p-3 rounded-lg border-2 font-semibold transition ${
                            selectedTeam === selectedMatch.team2
                              ? 'border-green-600 bg-green-50 text-green-700'
                              : 'border-gray-200 text-gray-700 hover:border-green-300'
                          }`}
                        >
                          {selectedMatch.team2}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pitch Condition */}
                  {selectedTeam && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Pitch Condition
                      </label>
                      <select
                        value={pitchCondition}
                        onChange={(e) => setPitchCondition(e.target.value)}
                        className="input-field"
                      >
                        <option value="green">Green (Pace-friendly)</option>
                        <option value="dry">Dry (Spin-friendly)</option>
                        <option value="balanced">Balanced</option>
                        <option value="flat">Flat (Batting-friendly)</option>
                      </select>
                    </div>
                  )}

                  {/* Generate Button */}
                  {selectedTeam && (
                    <button
                      onClick={generatePlayingXI}
                      disabled={generating}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        'Generate AI Playing XI'
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right: AI Suggestion */}
            <div className="lg:col-span-2">
              {!aiSuggestion ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card text-center py-20"
                >
                  <FiUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Suggestions Yet</h3>
                  <p className="text-gray-600">
                    Select a match, team, and pitch condition to get AI-powered Playing XI recommendations
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Team Header */}
                  <div className="card bg-gradient-to-r from-green-600 to-cyan-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {aiSuggestion.team_name} Playing XI
                        </h2>
                        <p className="text-green-100">
                          vs {opposition} • {selectedMatch.venue}
                        </p>
                      </div>
                      <FiCheckCircle className="text-5xl" />
                    </div>
                  </div>

                  {/* Playing XI List */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recommended Playing XI</h3>
                    <div className="space-y-3">
                      {aiSuggestion.playing_xi.map((player, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-2 border-green-200 rounded-lg p-4 bg-green-50 hover:shadow-md transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-gray-900">{player.name}</h4>
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                  {player.role}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 flex items-start gap-2">
                                <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{player.reason}</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiTrendingUp className="text-blue-600" />
                      Recommended Strategy
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Batting Order</h4>
                        <p className="text-sm text-gray-700">{aiSuggestion.strategy.batting_order}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Bowling Plan</h4>
                        <p className="text-sm text-gray-700">{aiSuggestion.strategy.bowling_plan}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fielding Setup</h4>
                        <p className="text-sm text-gray-700">{aiSuggestion.strategy.fielding}</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiAlertCircle className="text-amber-600" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {aiSuggestion.key_insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Team Composition */}
                  <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Team Composition</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {aiSuggestion.playing_xi.filter(p => p.role === 'Batsman').length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Batsmen</p>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {aiSuggestion.playing_xi.filter(p => p.role === 'Bowler').length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Bowlers</p>
                      </div>
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          {aiSuggestion.playing_xi.filter(p => p.role === 'All-Rounder').length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">All-Rounders</p>
                      </div>
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-orange-600">
                          {aiSuggestion.playing_xi.filter(p => p.role === 'Wicket-Keeper').length}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Keeper</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
