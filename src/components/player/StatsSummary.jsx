'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function StatsSummary({ playerId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [playerId]);

  const fetchAnalysis = async () => {
    try {
      const response = await api.player.getPerformanceAnalysis(playerId);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">AI Performance Analysis</h2>

      {analysis ? (
        <div className="space-y-4">
          {/* Strengths */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2">✓ Strengths</h3>
            <ul className="text-sm text-green-800 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>• {strength}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-2">⚠ Areas to Improve</h3>
            <ul className="text-sm text-red-800 space-y-1">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index}>• {weakness}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">💡 Recommendations</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          Play more matches to get AI-powered insights
        </p>
      )}
    </div>
  );
}
