'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -top-48 -left-48"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-1/2 right-0"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 left-1/3"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative bg-black/30 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left - Logo */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Todo
                </span>
                <span className="text-white ml-2">AI</span>
              </h1>
            </motion.div>

            {/* Right - Auth Buttons */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/login"
                className="px-6 py-2.5 text-white border-2 border-purple-500/50 rounded-xl hover:bg-purple-500/20 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/50"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-white">Manage Tasks with </span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mt-2">
                AI-Powered Intelligence
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The ultimate task management platform with FREE AI chatbot, voice commands, and smart automation. No API keys needed!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/register"
              className="px-12 py-5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all"
            >
              Start Free Now
            </Link>
            <Link
              href="/login"
              className="px-12 py-5 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-xl border-2 border-purple-500/50 hover:bg-white/20 transform hover:scale-105 transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {/* Feature 1 */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 p-8 rounded-2xl border-2 border-purple-500/30 hover:border-pink-500/50 transition-all backdrop-blur-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-pink-500 mb-4">
                <svg className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Chat Assistant</h3>
              <p className="text-gray-300">Natural language commands - just chat to manage your tasks!</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 p-8 rounded-2xl border-2 border-purple-500/30 hover:border-blue-500/50 transition-all backdrop-blur-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-blue-500 mb-4">
                <svg className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Voice Commands</h3>
              <p className="text-gray-300">Hands-free task management with voice recognition</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 p-8 rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all backdrop-blur-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-purple-500 mb-4">
                <svg className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">100% FREE</h3>
              <p className="text-gray-300">No API keys, no subscriptions - completely free forever!</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/30 backdrop-blur-xl border-t border-purple-500/30 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300 text-lg">
            Built with passion by{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold">
              Syed Rashid Ali
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
