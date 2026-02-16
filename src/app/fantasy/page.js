'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiUsers, FiTrendingUp, FiAward, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function FantasyPage() {
  const { user, userType } = useAuth();
  const [matches, setMatches] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const matchesRes = await api.matches.getAll();
      setMatches(matchesRes.data.upcomingMatches);

      if (user && userType === 'fan') {
        const teamsRes = await api.fantasy.getUserTeams(user.id);
        setMyTeams(teamsRes.data.teams);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    // Mock available players - in real app, fetch from API
    setAvailablePlayers([
      { id: 1, name: 'Player 1', role: 'Batsman', team: match.team1, points: 85 },
      { id: 2, name: 'Player 2', role: 'Bowler', team: match.team1, points: 78 },
      { id: 3, name: 'Player 3', role: 'All-Rounder', team: match.team1, points: 92 },
      { id: 4, name: 'Player 4', role: 'Wicket-Keeper', team: match.team1, points: 88 },
      { id: 5, name: 'Player 5', role: 'Batsman', team: match.team2, points: 90 },
      { id: 6, name: 'Player 6', role: 'Bowler', team: match.team2, points: 82 },
      { id: 7, name: 'Player 7', role: 'All-Rounder', team: match.team2, points: 87 },
      { id: 8, name: 'Player 8', role: 'Wicket-Keeper', team: match.team2, points: 75 },
    ]);
  };

  const togglePlayerSelection = (player) => {
    if (selectedPlayers.find((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      if (selectedPlayers.length < 11) {
        setSelectedPlayers([...selectedPlayers, player]);
      } else {
        alert('Maximum 11 players allowed');
      }
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!user || userType !== 'fan') {
      alert('Please login as a fan to create fantasy teams');
      return;
    }

    if (selectedPlayers.length !== 11) {
      alert('Please select exactly 11 players');
      return;
    }

    setSubmitting(true);
    try {
      await api.fantasy.createTeam({
        user_id: user.id,
        match_id: selectedMatch.id,
        team_name: teamName,
        player_ids: selectedPlayers.map((p) => p.id),
      });

      alert('Fantasy team created successfully! +30 points');
      
      // Refresh teams
      await fetchData();
      
      // Reset form
      setShowCreateForm(false);
      setTeamName('');
      setSelectedPlayers([]);
      setSelectedMatch(null);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fantasy leagues...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <FiUsers className="text-green-600" />
                  Fantasy Cricket
                </h1>
                <p className="text-gray-600">
                  Create your dream team and compete with other fans
                </p>
              </div>
              {user && userType === 'fan' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiPlus />
                  Create Team
                </button>
              )}
            </div>
          </motion.div>

          {/* Create Team Modal */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Fantasy Team</h2>

                <form onSubmit={handleCreateTeam} className="space-y-6">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter your team name"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Select Match */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Match
                    </label>
                    <div className="grid gap-3">
                      {matches.slice(0, 3).map((match) => (
                        <div
                          key={match.id}
                          onClick={() => handleMatchSelect(match)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedMatch?.id === match.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{match.team1}</span>
                            <span className="text-gray-500">vs</span>
                            <span className="font-bold">{match.team2}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{match.venue}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Players */}
                  {selectedMatch && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select 11 Players ({selectedPlayers.length}/11)
                      </label>
                      <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                        {availablePlayers.map((player) => {
                          const isSelected = selectedPlayers.find((p) => p.id === player.id);
                          return (
                            <div
                              key={player.id}
                              onClick={() => togglePlayerSelection(player)}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                                isSelected
                                  ? 'border-green-600 bg-green-50'
                                  : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{player.name}</h4>
                                  <p className="text-xs text-gray-600">{player.role} • {player.team}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-green-600">{player.points}</p>
                                  <p className="text-xs text-gray-500">pts</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !selectedMatch || selectedPlayers.length !== 11 || !teamName}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Creating...' : 'Create Team (+30 points)'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* My Teams */}
          {user && userType === 'fan' && myTeams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Fantasy Teams</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeams.map((team) => (
                  <div key={team.id} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{team.team_name}</h3>
                        <p className="text-sm text-gray-600">{team.match_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{team.total_points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                    <button className="text-sm text-green-600 hover:text-green-700 font-semibold">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Global Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiAward className="text-purple-600" />
              Fantasy Leaderboard
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-xl text-gray-900">#{rank}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Team Name {rank}</h4>
                      <p className="text-sm text-gray-600">Owner {rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-purple-600">{1500 - rank * 100}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
            >
              <h3 className="font-bold text-gray-900 mb-3">How to Play</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span>Select an upcoming match</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span>Pick 11 players (balanced team)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span>Earn points based on player performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">4.</span>
                  <span>Compete with other fans globally</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
            >
              <h3 className="font-bold text-gray-900 mb-3">Points System</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Run scored</span>
                  <span className="font-bold text-green-600">+1 pt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Boundary (4s)</span>
                  <span className="font-bold text-green-600">+1 pt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Boundary (6s)</span>
                  <span className="font-bold text-green-600">+2 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Wicket</span>
                  <span className="font-bold text-green-600">+25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Catch</span>
                  <span className="font-bold text-green-600">+8 pts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
