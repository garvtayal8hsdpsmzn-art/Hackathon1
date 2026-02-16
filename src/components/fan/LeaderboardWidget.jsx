'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FiTrendingUp, FiCrown } from 'react-icons/fi';

export default function LeaderboardWidget({ currentUserRank }) {
  const [topFans, setTopFans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopFans();
  }, []);

  const fetchTopFans = async () => {
    try {
      const response = await api.leaderboard.getTop(10);
      setTopFans(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="text-green-600" />
          Top Fans
        </h2>
        <Link href="/leaderboard" className="text-sm text-green-600 hover:text-green-700 font-semibold">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {topFans.map((fan, index) => (
          <div
            key={fan.id}
            className={`flex items-center justify-between p-3 rounded-lg transition ${
              index < 3 ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`font-bold text-lg ${
                index === 0 ? 'text-yellow-600' :
                index === 1 ? 'text-gray-500' :
                index === 2 ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {index === 0 && <FiCrown className="inline mr-1" />}
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{fan.name}</p>
                <p className="text-xs text-gray-500">{fan.points.toLocaleString()} points</p>
              </div>
            </div>
            {index < 3 && (
              <div className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        ))}
      </div>

      {currentUserRank > 10 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-center text-blue-900">
            Your Rank: <span className="font-bold">#{currentUserRank}</span>
          </p>
        </div>
      )}
    </div>
  );
}
