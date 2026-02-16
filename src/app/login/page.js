'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('fan'); // 'fan' or 'player'
  const [playerId, setPlayerId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithGoogle, loginAsPlayer } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/fan-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!playerId || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await loginAsPlayer(playerId, password);
      router.push('/player-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid player credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CV</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">CricVibe</span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back! Please login to continue</p>
        </div>

        {/* Login Type Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginType('fan')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                loginType === 'fan'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Fan Login
            </button>
            <button
              onClick={() => setLoginType('player')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                loginType === 'player'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Player Login
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Fan Login (Google OAuth) */}
          {loginType === 'fan' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FcGoogle className="text-2xl" />
                  <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Benefits of fan login</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Climb the leaderboard and earn badges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Top 50 fans get exclusive player access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Make predictions and win rewards</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Participate in fantasy leagues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Player Login (Custom Form) */}
          {loginType === 'player' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handlePlayerLogin} className="space-y-6">
                <div>
                  <label htmlFor="playerId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Player ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="playerId"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      placeholder="Enter your Player ID"
                      className="input-field pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Example: PLR001, PLR002</p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In as Player'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Player benefits</span>
                  </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">✓</span>
                      <span>AI-powered performance analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">✓</span>
                      <span>Personalized practice drills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">✓</span>
                      <span>Opposition dossiers and insights</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">✓</span>
                      <span>Connect with your top fans</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <Link href="/player-register" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">
                    Don't have an account? Register as Player
                  </Link>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* Demo Credentials (for hackathon/testing) */}
        {loginType === 'player' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Demo Credentials (Testing)</h4>
            <div className="text-xs text-amber-800 space-y-1">
              <p><strong>Player ID:</strong> PLR001</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
