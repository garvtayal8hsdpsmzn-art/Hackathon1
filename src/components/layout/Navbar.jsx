'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiLogOut, FiUser, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, userType, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CricVibe</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/leaderboard" className="text-gray-700 hover:text-green-600 transition">
              Leaderboard
            </Link>
            <Link href="/predictions" className="text-gray-700 hover:text-green-600 transition">
              Predictions
            </Link>
            <Link href="/fantasy" className="text-gray-700 hover:text-green-600 transition">
              Fantasy
            </Link>
            <Link href="/playing-xi" className="text-gray-700 hover:text-green-600 transition">
              Playing XI
            </Link>
            <Link href="/head-to-head" className="text-gray-700 hover:text-green-600 transition">
              Head-to-Head
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={userType === 'fan' ? '/fan-dashboard' : '/player-dashboard'}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
                >
                  <FiUser />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/leaderboard" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Leaderboard
            </Link>
            <Link href="/predictions" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Predictions
            </Link>
            <Link href="/fantasy" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Fantasy
            </Link>
            <Link href="/playing-xi" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Playing XI
            </Link>
            <Link href="/head-to-head" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Head-to-Head
            </Link>
            {user && (
              <>
                <Link
                  href={userType === 'fan' ? '/fan-dashboard' : '/player-dashboard'}
                  className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
