'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { FiTrendingUp, FiUsers, FiTarget, FiAward, FiBarChart2, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'AI-Powered Predictions',
      description: 'Get intelligent match predictions and player performance forecasts',
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Fan Engagement',
      description: 'Connect with players through leaderboards and exclusive chats',
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Playing XI Selector',
      description: 'AI-suggested team selections based on form, pitch, and opposition',
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Fantasy Leagues',
      description: 'Create optimized fantasy teams with AI recommendations',
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: 'Performance Analytics',
      description: 'Detailed player statistics and improvement suggestions',
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Real-Time Updates',
      description: 'Live match updates, scores, and instant notifications',
    },
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to CricVibe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              AI-Powered Cricket Platform for Fans & Players
            </p>
            <p className="text-lg mb-10 text-green-100 max-w-3xl mx-auto">
              Enhance athlete performance, improve fan engagement, and optimize sports operations through cutting-edge AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition text-lg">
                Get Started
              </Link>
              <Link href="/playing-xi" className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-4 px-8 rounded-lg transition text-lg">
                Try AI Playing XI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to elevate your cricket experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Fans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Cricket Fans</h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Climb the leaderboard and earn badges through engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Top 20-50 fans get exclusive access to player group chats</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Make predictions and compete in fantasy leagues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Complete trivia and tasks to boost your rank</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Get AI-powered match analysis and insights</span>
                </li>
              </ul>
              <Link href="/leaderboard" className="btn-primary mt-8 inline-block">
                View Leaderboard
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-100 to-cyan-100 p-8 rounded-2xl"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sample Leaderboard</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <div key={rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-green-600">#{rank}</span>
                        <span className="text-gray-700">Fan {rank}</span>
                      </div>
                      <span className="text-gray-600">{1000 - rank * 50} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Players Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 bg-gradient-to-br from-cyan-100 to-green-100 p-8 rounded-2xl"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Powerplay Strike Rate</span>
                      <span className="text-sm font-semibold text-gray-900">145</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Death Overs Average</span>
                      <span className="text-sm font-semibold text-gray-900">32</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">vs Spin Success</span>
                      <span className="text-sm font-semibold text-gray-900">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Cricket Players</h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-3">✓</span>
                  <span>AI-powered performance analytics and insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-3">✓</span>
                  <span>Personalized practice drills based on weaknesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-3">✓</span>
                  <span>Detailed opposition dossiers and strategic insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-3">✓</span>
                  <span>Phase-wise performance breakdown (powerplay, middle, death)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-3">✓</span>
                  <span>Connect with top fans and build your following</span>
                </li>
              </ul>
              <Link href="/player-dashboard" className="btn-secondary mt-8 inline-block">
                Player Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-cyan-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Cricket Experience?</h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of fans and players already using CricVibe
          </p>
          <Link href="/login" className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition text-lg inline-block">
            Join Now - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CricVibe</h3>
              <p className="text-gray-400">AI-powered cricket platform for the modern era</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Fans</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
                <li><Link href="/predictions" className="hover:text-white">Predictions</Link></li>
                <li><Link href="/fantasy" className="hover:text-white">Fantasy League</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Players</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/player-dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/playing-xi" className="hover:text-white">Playing XI AI</Link></li>
                <li><Link href="/head-to-head" className="hover:text-white">Head-to-Head</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CricVibe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
