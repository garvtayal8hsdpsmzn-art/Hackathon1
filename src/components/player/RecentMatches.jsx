'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RecentMatches({ playerId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [playerId]);

  const fetchMatches = async () => {
    try {
      const response = await api.player.getStats(playerId);
      setMatches(response.data.recentMatches.slice(0, 5));
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
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
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Matches</h2>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No match data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Opponent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Runs</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Balls</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">SR</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Wickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matches.map((match, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(match.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{match.opponent}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{match.runs}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{match.balls_faced}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{match.strike_rate.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-purple-600">{match.wickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
