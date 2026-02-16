'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiAward } from 'react-icons/fi';

export default function BadgeCollection({ userId }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await api.badges.getUserBadges(userId);
      setBadges(response.data.badges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiAward className="text-purple-600" />
        Your Badges
      </h2>

      {badges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No badges yet</p>
          <p className="text-sm text-gray-400">Complete tasks to earn your first badge!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:scale-105 transition-transform cursor-pointer"
              title={badge.description}
            >
              <div className="text-4xl mb-2">
                {badge.icon_url || '🏆'}
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {badges.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
          </p>
        </div>
      )}
    </div>
  );
}
