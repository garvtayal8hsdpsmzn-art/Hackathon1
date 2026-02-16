'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ playerId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('runs'); // 'runs', 'strike_rate', 'wickets'

  useEffect(() => {
    fetchPerformanceData();
  }, [playerId]);

  const fetchPerformanceData = async () => {
    try {
      const response = await api.player.getStats(playerId);
      // Transform data for chart
      const chartData = response.data.recentMatches.map((match, index) => ({
        match: `M${index + 1}`,
        runs: match.runs,
        strike_rate: match.strike_rate,
        wickets: match.wickets,
        date: new Date(match.date).toLocaleDateString(),
      }));
      setData(chartData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Performance Trend (Last 10 Matches)</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('runs')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              chartType === 'runs' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Runs
          </button>
          <button
            onClick={() => setChartType('strike_rate')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              chartType === 'strike_rate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Strike Rate
          </button>
          <button
            onClick={() => setChartType('wickets')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
              chartType === 'wickets' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Wickets
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="match" />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartType === 'runs' && (
            <Line type="monotone" dataKey="runs" stroke="#16a34a" strokeWidth={2} />
          )}
          {chartType === 'strike_rate' && (
            <Line type="monotone" dataKey="strike_rate" stroke="#2563eb" strokeWidth={2} />
          )}
          {chartType === 'wickets' && (
            <Line type="monotone" dataKey="wickets" stroke="#9333ea" strokeWidth={2} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
