'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiTrendingUp, FiCrown, FiAward, FiUsers, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { user, userType } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all-time'); // 'weekly', 'monthly', 'all-time'
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.leaderboard.getTop(100);
      setLeaderboard(response.data.leaderboard);

      // Get current user rank if logged in as fan
      if (user && userType === 'fan') {
        const rankResponse = await api.leaderboard.getUserRank(user.id);
        setUserRank(rankResponse.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300';
    if (rank <= 10) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    if (rank <= 50) return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <FiTrendingUp className="text-green-600" />
                  Fan Leaderboard
                </h1>
                <p className="text-gray-600">
                  Top 50 fans get exclusive access to player group chats!
                </p>
              </div>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('weekly')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  period === 'weekly'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  period === 'monthly'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setPeriod('all-time')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  period === 'all-time'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Time
              </button>
            </div>
          </motion.div>

          {/* User's Rank Card (if logged in as fan) */}
          {userRank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card mb-8 border-2 ${
                userRank.rank <= 50
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Current Rank</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-gray-900">
                      #{userRank.rank}
                    </span>
                    {userRank.rank <= 50 && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Elite Access ✓
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Points</p>
                  <p className="text-3xl font-bold text-green-600">
                    {userRank.points.toLocaleString()}
                  </p>
                </div>
              </div>
              {userRank.rank > 50 && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>{(userRank.rank - 50)} ranks</strong> away from elite access! Keep engaging to climb higher.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Top 3 Podium */}
          {!loading && leaderboard.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {/* 2nd Place */}
              <div className="order-1">
                <div className="card bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-400 text-center pt-8">
                  <div className="text-5xl mb-2">🥈</div>
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{leaderboard[1].name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {leaderboard[1].points.toLocaleString()} points
                  </p>
                  <div className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                    Elite Access
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-2 -mt-4">
                <div className="card bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 text-center pt-8 relative">
                  <FiCrown className="absolute top-2 right-2 text-yellow-600 text-2xl" />
                  <div className="text-6xl mb-2">🥇</div>
                  <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl font-bold text-yellow-800">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{leaderboard[0].name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {leaderboard[0].points.toLocaleString()} points
                  </p>
                  <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                    🏆 Champion
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3">
                <div className="card bg-gradient-to-br from-orange-100 to-red-200 border-2 border-orange-500 text-center pt-8">
                  <div className="text-5xl mb-2">🥉</div>
                  <div className="w-16 h-16 bg-orange-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-800">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{leaderboard[2].name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {leaderboard[2].points.toLocaleString()} points
                  </p>
                  <div className="bg-orange-400 text-orange-900 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                    Elite Access
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Rankings</h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((fan, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user && userType === 'fan' && fan.id === user.id;

                  return (
                    <motion.div
                      key={fan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                        isCurrentUser
                          ? 'bg-blue-100 border-blue-400'
                          : getRankColor(rank)
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank */}
                        <div className="w-12 text-center">
                          <div className="font-bold text-xl text-gray-900">
                            {getRankBadge(rank) || `#${rank}`}
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {fan.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {fan.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {fan.current_streak > 0 && `🔥 ${fan.current_streak} day streak`}
                          </p>
                        </div>

                        {/* Points */}
                        <div className="text-right mr-4">
                          <p className="font-bold text-2xl text-gray-900">
                            {fan.points.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>

                        {/* Elite Badge */}
                        {rank <= 50 && (
                          <div className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                            <FiUsers className="inline mr-1" />
                            Elite
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiAward className="text-green-600" />
                How to Earn Points
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Make accurate predictions (+50-200 points)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Complete trivia and tasks (+20-100 points)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Daily login streak (+10 points per day)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Create fantasy teams (+30 points)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Engage with content (+5-20 points)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiCrown className="text-purple-600" />
                Elite Access Benefits (Top 50)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">★</span>
                  <span>Exclusive group chats with players</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">★</span>
                  <span>Direct replies from players on questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">★</span>
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">★</span>
                  <span>Special badges and recognition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">★</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
