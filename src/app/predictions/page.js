'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { FiTarget, FiTrendingUp, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function PredictionsPage() {
  const { user, userType } = useAuth();
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictionType, setPredictionType] = useState('winner');
  const [predictionValue, setPredictionValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, predictionsRes] = await Promise.all([
        api.matches.getAll(),
        user && userType === 'fan' ? api.predictions.getUserPredictions(user.id) : Promise.resolve({ data: { predictions: [] } }),
      ]);
      setMatches(matchesRes.data.upcomingMatches);
      setPredictions(predictionsRes.data.predictions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPrediction = async (e) => {
    e.preventDefault();
    
    if (!user || userType !== 'fan') {
      alert('Please login as a fan to make predictions');
      return;
    }

    if (!selectedMatch || !predictionValue) {
      alert('Please select a match and make a prediction');
      return;
    }

    setSubmitting(true);
    try {
      await api.predictions.create({
        user_id: user.id,
        match_id: selectedMatch.id,
        prediction_type: predictionType,
        prediction_value: predictionValue,
      });

      alert('Prediction submitted successfully! +50 points');
      
      // Refresh predictions
      await fetchData();
      
      // Reset form
      setSelectedMatch(null);
      setPredictionValue('');
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Failed to submit prediction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading predictions...</p>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FiTarget className="text-green-600" />
              Match Predictions
            </h1>
            <p className="text-gray-600">
              Make predictions to earn points and climb the leaderboard
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Make Prediction */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Make a Prediction</h2>

                {!user || userType !== 'fan' ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">Please login as a fan to make predictions</p>
                    <a href="/login" className="btn-primary inline-block">
                      Login Now
                    </a>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No upcoming matches available for predictions</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPrediction} className="space-y-6">
                    {/* Select Match */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Match
                      </label>
                      <div className="space-y-3">
                        {matches.slice(0, 5).map((match) => (
                          <div
                            key={match.id}
                            onClick={() => setSelectedMatch(match)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                              selectedMatch?.id === match.id
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">{match.team1}</span>
                                <span className="text-gray-500">vs</span>
                                <span className="font-bold text-gray-900">{match.team2}</span>
                              </div>
                              {selectedMatch?.id === match.id && (
                                <FiCheckCircle className="text-green-600 text-xl" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{match.venue}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(match.match_date).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prediction Type */}
                    {selectedMatch && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Prediction Type
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setPredictionType('winner');
                                setPredictionValue('');
                              }}
                              className={`p-3 rounded-lg border-2 font-semibold transition ${
                                predictionType === 'winner'
                                  ? 'border-green-600 bg-green-50 text-green-700'
                                  : 'border-gray-200 text-gray-700 hover:border-green-300'
                              }`}
                            >
                              Winner
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPredictionType('top_scorer');
                                setPredictionValue('');
                              }}
                              className={`p-3 rounded-lg border-2 font-semibold transition ${
                                predictionType === 'top_scorer'
                                  ? 'border-green-600 bg-green-50 text-green-700'
                                  : 'border-gray-200 text-gray-700 hover:border-green-300'
                              }`}
                            >
                              Top Scorer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPredictionType('mom');
                                setPredictionValue('');
                              }}
                              className={`p-3 rounded-lg border-2 font-semibold transition ${
                                predictionType === 'mom'
                                  ? 'border-green-600 bg-green-50 text-green-700'
                                  : 'border-gray-200 text-gray-700 hover:border-green-300'
                              }`}
                            >
                              Man of Match
                            </button>
                          </div>
                        </div>

                        {/* Prediction Value */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Prediction
                          </label>
                          {predictionType === 'winner' ? (
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setPredictionValue(selectedMatch.team1)}
                                className={`p-4 rounded-lg border-2 font-bold transition ${
                                  predictionValue === selectedMatch.team1
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-700 hover:border-green-300'
                                }`}
                              >
                                {selectedMatch.team1}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPredictionValue(selectedMatch.team2)}
                                className={`p-4 rounded-lg border-2 font-bold transition ${
                                  predictionValue === selectedMatch.team2
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-700 hover:border-green-300'
                                }`}
                              >
                                {selectedMatch.team2}
                              </button>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={predictionValue}
                              onChange={(e) => setPredictionValue(e.target.value)}
                              placeholder={`Enter player name for ${predictionType === 'top_scorer' ? 'top scorer' : 'man of the match'}`}
                              className="input-field"
                              required
                            />
                          )}
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={submitting || !predictionValue}
                          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Submitting...' : 'Submit Prediction (+50 points)'}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </motion.div>

              {/* Your Predictions */}
              {user && userType === 'fan' && predictions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card mt-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Your Predictions</h2>
                  <div className="space-y-3">
                    {predictions.slice(0, 10).map((prediction) => (
                      <div
                        key={prediction.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {prediction.match_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">{prediction.prediction_type}:</span>{' '}
                              {prediction.prediction_value}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(prediction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4">
                            {prediction.is_correct === null ? (
                              <div className="flex items-center gap-1 text-amber-600">
                                <FiClock />
                                <span className="text-sm font-semibold">Pending</span>
                              </div>
                            ) : prediction.is_correct ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <FiCheckCircle />
                                <span className="text-sm font-semibold">+{prediction.points_earned}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600">
                                <FiXCircle />
                                <span className="text-sm font-semibold">Incorrect</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Stats & Info */}
            <div className="space-y-6">
              {/* User Stats */}
              {user && userType === 'fan' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                >
                  <h3 className="font-bold text-gray-900 mb-4">Your Prediction Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Predictions</span>
                      <span className="font-bold text-gray-900">{predictions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Correct</span>
                      <span className="font-bold text-green-600">
                        {predictions.filter((p) => p.is_correct === true).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="font-bold text-blue-600">
                        {predictions.length > 0
                          ? Math.round((predictions.filter((p) => p.is_correct === true).length / predictions.filter((p) => p.is_correct !== null).length) * 100) || 0
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Points Earned</span>
                      <span className="font-bold text-purple-600">
                        {predictions.reduce((sum, p) => sum + (p.points_earned || 0), 0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Points Guide */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
              >
                <h3 className="font-bold text-gray-900 mb-4">Points Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Match Winner</span>
                    <span className="font-bold text-green-600">+50 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Top Scorer</span>
                    <span className="font-bold text-green-600">+100 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Man of the Match</span>
                    <span className="font-bold text-green-600">+150 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Score Range</span>
                    <span className="font-bold text-green-600">+200 pts</span>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
              >
                <h3 className="font-bold text-gray-900 mb-4">Prediction Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">💡</span>
                    <span>Check recent team form and player stats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">💡</span>
                    <span>Consider pitch conditions and weather</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">💡</span>
                    <span>Use AI Playing XI suggestions for insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">💡</span>
                    <span>Review head-to-head records</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
