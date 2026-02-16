'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiBarChart2, FiTarget, FiTrendingUp, FiActivity, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PerformanceChart from '@/components/player/PerformanceChart';
import PracticeDrills from '@/components/player/PracticeDrills';
import RecentMatches from '@/components/player/RecentMatches';
import OppositionInsights from '@/components/player/OppositionInsights';
import StatsSummary from '@/components/player/StatsSummary';

export default function PlayerDashboard() {
  return (
    <ProtectedRoute requiredType="player">
      <PlayerDashboardContent />
    </ProtectedRoute>
  );
}

function PlayerDashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    matches_played: 0,
    total_runs: 0,
    total_wickets: 0,
    batting_average: 0,
    bowling_average: 0,
    strike_rate: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.player.getDashboard(user.player_id);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Matches Played',
      value: stats.matches_played,
      icon: <FiActivity className="text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Total Runs',
      value: stats.total_runs,
      icon: <FiTarget className="text-green-600" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      label: 'Batting Average',
      value: stats.batting_average.toFixed(2),
      icon: <FiTrendingUp className="text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      label: 'Strike Rate',
      value: stats.strike_rate.toFixed(2),
      icon: <FiBarChart2 className="text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
    },
    {
      label: 'Total Wickets',
      value: stats.total_wickets,
      icon: <FiAward className="text-red-600" />,
      color: 'bg-red-50 border-red-200',
    },
    {
      label: 'Bowling Average',
      value: stats.bowling_average > 0 ? stats.bowling_average.toFixed(2) : 'N/A',
      icon: <FiTarget className="text-cyan-600" />,
      color: 'bg-cyan-50 border-cyan-200',
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {user?.name}! 🏏
                </h1>
                <p className="text-gray-600">
                  {user?.role} • {user?.team}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Player ID</p>
                <p className="text-lg font-bold text-cyan-600">{user?.player_id}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card ${stat.color} border-2`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PerformanceChart playerId={user.player_id} />
              </motion.div>

              {/* Recent Matches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <RecentMatches playerId={user.player_id} />
              </motion.div>

              {/* Stats Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <StatsSummary playerId={user.player_id} />
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              {/* Practice Drills */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PracticeDrills playerId={user.player_id} />
              </motion.div>

              {/* Opposition Insights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <OppositionInsights playerId={user.player_id} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
