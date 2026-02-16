'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function RecentPredictions({ userId }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, [userId]);

  const fetchPredictions = async () => {
    try {
      const response = await api.predictions.getUserPredictions(userId);
      setPredictions(response.data.predictions.slice(0, 5)); // Last 5 predictions
    } catch (error) {
      console.error('Error fetching predictions:', error);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Predictions</h2>
        <Link href="/predictions" className="text-sm text-green-600 hover:text-green-700 font-semibold">
          View All
        </Link>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No predictions yet</p>
          <Link href="/predictions" className="btn-primary inline-block">
            Make Your First Prediction
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {prediction.match_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Your prediction:</span> {prediction.prediction_value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(prediction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4">
                  {prediction.is_correct === null ? (
                    <div className="flex items-center gap-1 text-amber-600">
                      <FiClock />
                      <span className="text-sm">Pending</span>
                    </div>
                  ) : prediction.is_correct ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <FiCheckCircle />
                      <span className="text-sm font-semibold">+{prediction.points_earned}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <FiXCircle />
                      <span className="text-sm">Incorrect</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
