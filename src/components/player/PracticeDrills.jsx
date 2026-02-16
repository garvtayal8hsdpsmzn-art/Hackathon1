'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiTarget, FiCheckCircle } from 'react-icons/fi';

export default function PracticeDrills({ playerId }) {
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrills();
  }, [playerId]);

  const fetchDrills = async () => {
    try {
      const response = await api.player.getDrills(playerId);
      setDrills(response.data.drills);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
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
        <FiTarget className="text-cyan-600" />
        Practice Drills
      </h2>

      {drills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No drills assigned</p>
          <p className="text-sm text-gray-400">AI will suggest drills based on your performance</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drills.map((drill) => (
            <div key={drill.id} className="border-2 border-cyan-200 rounded-lg p-4 bg-cyan-50">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{drill.drill_type}</h3>
                <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded">
                  {drill.weakness_identified}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{drill.description}</p>
              {drill.video_url && (
                
                  href={drill.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  Watch Tutorial →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
