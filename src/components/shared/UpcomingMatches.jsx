'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FiCalendar } from 'react-icons/fi';

export default function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.matches.getAll();
      setMatches(response.data.upcomingMatches.slice(0, 3));
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
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiCalendar className="text-green-600" />
        Upcoming Matches
      </h2>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No upcoming matches</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border-2 border-green-200 rounded-lg p-4 bg-green-50 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">{match.team1}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="font-bold text-gray-900">{match.team2}</span>
                  </div>
                  <p className="text-sm text-gray-600">{match.venue}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(match.match_date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/predictions?match=${match.id}`}
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
                >
                  Predict
                </Link>
                <Link
                  href={`/playing-xi?match=${match.id}`}
                  className="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
                >
                  Playing XI
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
