'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-[#001429]' : 'bg-white'}`}>
      {/* Background Overlay */}
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#001a3d] via-[#001429] to-[#000a1a] opacity-95'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`} />

      {/* Animated Grid */}
      <div className={`fixed inset-0 ${
        theme === 'dark'
          ? 'bg-[linear-gradient(to_right,#1a3557_1px,transparent_1px),linear-gradient(to_bottom,#1a3557_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'
          : 'bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'
      }`} />

      {/* Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(26, 53, 87, 0.15) 0%, rgba(26, 53, 87, 0) 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
            filter: 'blur(100px)',
            top: '-500px',
            left: '-400px',
          }}
          animate={{ scale: [1, 1.3, 1], x: [0, 100, 0], y: [0, 80, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(30, 64, 105, 0.12) 0%, rgba(30, 64, 105, 0) 70%)'
              : 'radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, rgba(147, 197, 253, 0) 70%)',
            filter: 'blur(100px)',
            bottom: '-400px',
            right: '-350px',
          }}
          animate={{ scale: [1.3, 1, 1.3], x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(20, 45, 75, 0.1) 0%, rgba(20, 45, 75, 0) 70%)'
              : 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0) 70%)',
            filter: 'blur(90px)',
            top: '40%',
            left: '50%',
          }}
          animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b backdrop-blur-2xl border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className={`absolute -inset-2 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-700/40'
                  : 'bg-gradient-to-r from-blue-400/20 via-blue-300/20 to-blue-200/20'
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center space-x-5"
            >
              <ThemeToggle />
              <Link
                href="/login"
                className={`group relative px-8 py-4 font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                <div className={`absolute inset-0 transition-all border-2 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-[#001a3d]/60 group-hover:bg-[#002451]/80 border-blue-900/40 group-hover:border-blue-700/60'
                    : 'bg-white/60 group-hover:bg-blue-50/80 border-blue-300/40 group-hover:border-blue-500/60'
                }`} />
                <span className="relative">Sign In</span>
              </Link>
              <Link
                href="/register"
                className={`group relative px-8 py-4 font-black text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 shadow-2xl ${
                  theme === 'dark' ? 'text-white shadow-blue-900/50' : 'text-white shadow-blue-500/50'
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
                <span className="relative flex items-center space-x-2">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block mb-8"
          >
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30'
                  : 'bg-gradient-to-r from-blue-400/30 to-blue-300/30'
              }`} />
              <div className={`relative px-8 py-3 border-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#001a3d] to-[#001429] border-blue-900/50'
                  : 'bg-gradient-to-r from-white to-blue-50 border-blue-400/50'
              }`}>
                <span className={`font-black text-base tracking-widest uppercase ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  🤖 AI-POWERED PRODUCTIVITY
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-10 leading-tight">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage Tasks</span>
              <br />
              <div className="relative inline-block mt-3">
                <div className={`absolute inset-0 blur-3xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500/30 via-blue-400/30 to-blue-300/30'
                    : 'bg-gradient-to-r from-blue-400/20 via-blue-300/20 to-blue-200/20'
                }`} />
                <span className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </div>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className={`text-2xl md:text-3xl mb-16 max-w-4xl mx-auto font-light leading-relaxed ${
              theme === 'dark' ? 'text-blue-200/90' : 'text-gray-700'
            }`}
          >
            Experience <span className={`font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>intelligent task management</span> with{' '}
            <span className={`font-bold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>AI chat assistant</span>,{' '}
            <span className={`font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>voice commands</span>, and{' '}
            <span className={`font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>smart automation</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mb-32"
          >
            <Link
              href="/register"
              className={`group relative inline-flex px-14 py-6 text-white text-2xl font-black rounded-3xl overflow-hidden transition-all duration-500 hover:scale-110 shadow-2xl ${
                theme === 'dark' ? 'shadow-blue-900/60' : 'shadow-blue-500/60'
              }`}
            >
              <div className={`absolute inset-0 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
              }`} />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900'
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600'
              }`} />
              <div className="relative flex items-center space-x-3">
                <span>START FREE NOW</span>
                <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: 'AI CHAT ASSISTANT',
                desc: 'Natural language commands to manage your tasks effortlessly',
              },
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
                title: 'VOICE CONTROL',
                desc: 'Hands-free task management with powerful voice recognition',
              },
              {
                icon: (
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: '100% FREE',
                desc: 'No limits, no subscriptions - completely free forever!',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 + idx * 0.2 }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative"
              >
                <div className={`absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/40'
                    : 'bg-gradient-to-r from-blue-400/30 to-blue-300/30'
                }`} />
                <div className={`relative p-10 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#001a3d]/70 to-[#001429]/70 border-blue-900/30 group-hover:border-blue-800/60'
                    : 'bg-gradient-to-br from-white/70 to-blue-50/70 border-blue-300/30 group-hover:border-blue-500/60'
                }`}>
                  <div className={`mb-6 group-hover:scale-110 transition-all duration-500 ${
                    theme === 'dark'
                      ? 'text-blue-400 group-hover:text-blue-300'
                      : 'text-blue-600 group-hover:text-blue-500'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-3xl font-black mb-4 tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{feature.title}</h3>
                  <p className={`text-lg leading-relaxed ${
                    theme === 'dark' ? 'text-blue-200/80' : 'text-gray-700'
                  }`}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t backdrop-blur-2xl py-12 mt-32 border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-gray-300'}`}>
            Build with D/O :{' '}
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent font-black text-2xl">
              Syed Rashid Ali
            </span>
          </p>
          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-400/60' : 'text-gray-400/60'}`}>
            Phase III • AI-Powered Task Management
          </p>
        </div>
      </footer>
    </div>
  );
}
