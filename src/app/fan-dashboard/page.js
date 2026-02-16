'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiTrendingUp, FiAward, FiTarget, FiUsers, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LeaderboardWidget from '@/components/fan/LeaderboardWidget';
import RecentPredictions from '@/components/fan/RecentPredictions';
import ActiveTasks from '@/components/fan/ActiveTasks';
import BadgeCollection from '@/components/fan/BadgeCollection';
import UpcomingMatches from '@/components/shared/UpcomingMatches';

export default function FanDashboard() {
  return (
    <ProtectedRoute requiredType="fan">
      <FanDashboardContent />
    </ProtectedRoute>
  );
}

function FanDashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    rank: 0,
    points: 0,
    streak: 0,
    badges: 0,
    predictions: 0,
    accuracy: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user rank and stats
      const [rankResponse, badgesResponse, predictionsResponse] = await Promise.all([
        api.leaderboard.getUserRank(user.id),
        api.badges.getUserBadges(user.id),
        api.predictions.getUserPredictions(user.id),
      ]);

      setStats({
        rank: rankResponse.data.rank,
        points: rankResponse.data.points,
        streak: user.current_streak || 0,
        badges: badgesResponse.data.badges.length,
        predictions: predictionsResponse.data.predictions.length,
        accuracy: predictionsResponse.data.accuracy || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Leaderboard Rank',
      value: stats.rank > 0 ? `#${stats.rank}` : 'Unranked',
      icon: <FiTrendingUp className="text-green-600" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Points',
      value: stats.points.toLocaleString(),
      icon: <FiTarget className="text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600',
    },
    {
      label: 'Current Streak',
      value: `${stats.streak} days`,
      icon: <FiActivity className="text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-600',
    },
    {
      label: 'Badges Earned',
      value: stats.badges,
      icon: <FiAward className="text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600',
    },
    {
      label: 'Predictions Made',
      value: stats.predictions,
      icon: <FiUsers className="text-cyan-600" />,
      color: 'bg-cyan-50 border-cyan-200',
      textColor: 'text-cyan-600',
    },
    {
      label: 'Accuracy Rate',
      value: `${stats.accuracy}%`,
      icon: <FiTarget className="text-pink-600" />,
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-600',
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              {stats.rank <= 50 
                ? `🎉 You're in the top 50! Keep engaging to maintain your exclusive access.`
                : `Keep engaging to climb the leaderboard and unlock exclusive player access!`
              }
            </p>
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
                    <p className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Matches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <UpcomingMatches />
              </motion.div>

              {/* Recent Predictions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <RecentPredictions userId={user.id} />
              </motion.div>

              {/* Active Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ActiveTasks userId={user.id} onTaskComplete={fetchDashboardData} />
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              {/* Leaderboard Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <LeaderboardWidget currentUserRank={stats.rank} />
              </motion.div>

              {/* Badge Collection */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <BadgeCollection userId={user.id} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
