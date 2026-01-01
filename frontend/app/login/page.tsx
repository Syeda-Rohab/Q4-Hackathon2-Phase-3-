'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });

      saveToken(response.data.access_token);
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 ${theme === 'dark' ? 'bg-[#001429]' : 'bg-white'}`}>
      {/* Background */}
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#001a3d] via-[#001429] to-[#000a1a] opacity-95'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`} />
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-[linear-gradient(to_right,#1a3557_1px,transparent_1px),linear-gradient(to_bottom,#1a3557_1px,transparent_1px)] bg-[size:40px_40px]'
          : 'bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:40px_40px]'
      }`} />

      {/* Theme Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(26, 53, 87, 0.2) 0%, rgba(26, 53, 87, 0) 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
            filter: 'blur(80px)',
            top: '-200px',
            left: '-150px',
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(30, 64, 105, 0.15) 0%, rgba(30, 64, 105, 0) 70%)'
              : 'radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, rgba(147, 197, 253, 0) 70%)',
            filter: 'blur(80px)',
            bottom: '-200px',
            right: '-150px',
          }}
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 3 }}
        />
      </div>

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <Link
          href="/"
          className={`group mb-8 inline-flex items-center transition-colors ${
            theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <div className={`border-2 rounded-xl px-5 py-3 transition-all ${
            theme === 'dark'
              ? 'bg-[#001a3d]/60 group-hover:bg-[#002451]/80 border-blue-900/40 group-hover:border-blue-800/60'
              : 'bg-white/60 group-hover:bg-blue-50/80 border-blue-300/40 group-hover:border-blue-500/60'
          }`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-bold">Back</span>
            </div>
          </div>
        </Link>

        {/* Login Card */}
        <div className="relative group">
          <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30'
              : 'bg-gradient-to-r from-blue-400/20 to-blue-300/20'
          }`} />

          <div className={`relative p-10 rounded-3xl border-2 backdrop-blur-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#001a3d]/90 to-[#001429]/90 border-blue-900/40'
              : 'bg-gradient-to-br from-white/90 to-blue-50/90 border-blue-400/40'
          }`}>
            {/* Logo & Title */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-5">
                <div className={`absolute -inset-2 rounded-2xl blur-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/40'
                    : 'bg-gradient-to-r from-blue-400/20 to-blue-300/20'
                }`} />
                <div className={`relative px-8 py-4 rounded-2xl border-2 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#001a3d] to-[#001429] border-blue-900/40'
                    : 'bg-gradient-to-br from-white to-blue-50 border-blue-400/40'
                }`}>
                  <h1 className="text-4xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
                      TODO
                    </span>
                    <span className={`ml-3 text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI</span>
                  </h1>
                </div>
              </div>

              <h2 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
              <p className={theme === 'dark' ? 'text-blue-200/80' : 'text-gray-600'}>Sign in to unlock AI-powered productivity</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-red-900/20 rounded-2xl blur-lg" />
                  <div className="relative bg-red-900/20 border-2 border-red-700/40 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-red-300 font-semibold">{error}</p>
                  </div>
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className={`block text-sm font-black mb-3 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-900/20 to-blue-800/20'
                      : 'bg-gradient-to-r from-blue-400/10 to-blue-300/10'
                  }`} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`relative w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all backdrop-blur-sm font-medium ${
                      theme === 'dark'
                        ? 'bg-[#001a3d]/80 border-blue-900/40 text-white placeholder-blue-300/30 focus:border-blue-700/60 focus:bg-[#002451]/90'
                        : 'bg-white/80 border-blue-300/40 text-gray-900 placeholder-gray-400 focus:border-blue-500/60 focus:bg-white'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-black mb-3 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-900/20 to-blue-800/20'
                      : 'bg-gradient-to-r from-blue-400/10 to-blue-300/10'
                  }`} />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`relative w-full px-6 py-4 border-2 rounded-xl focus:outline-none transition-all backdrop-blur-sm font-medium ${
                      theme === 'dark'
                        ? 'bg-[#001a3d]/80 border-blue-900/40 text-white placeholder-blue-300/30 focus:border-blue-700/60 focus:bg-[#002451]/90'
                        : 'bg-white/80 border-blue-300/40 text-gray-900 placeholder-gray-400 focus:border-blue-500/60 focus:bg-white'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`group relative w-full py-5 text-white font-black text-lg rounded-2xl overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
                  theme === 'dark' ? 'shadow-blue-900/50' : 'shadow-blue-500/50'
                }`}
              >
                <div className={`absolute inset-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
                }`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
                }`} />
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      SIGNING IN...
                    </>
                  ) : (
                    'SIGN IN'
                  )}
                </span>
              </motion.button>
            </form>

            <p className={`mt-8 text-center ${theme === 'dark' ? 'text-blue-200/70' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link href="/register" className={`font-black transition-colors ${
                theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
              }`}>
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
