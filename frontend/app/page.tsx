'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark
        ? 'bg-black'
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Background Effects */}
      {isDark ? (
        <>
          {/* Dark Theme - Cyber Grid + Neon Orbs */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Massive Neon Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0) 70%)',
                filter: 'blur(80px)',
                top: '-400px',
                left: '-300px',
              }}
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 80, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-[700px] h-[700px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.7) 0%, rgba(147, 51, 234, 0) 70%)',
                filter: 'blur(80px)',
                top: '30%',
                right: '-250px',
              }}
              animate={{
                scale: [1.3, 1, 1.3],
                x: [0, -60, 0],
                y: [0, 70, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <motion.div
              className="absolute w-[750px] h-[750px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)',
                filter: 'blur(80px)',
                bottom: '-300px',
                left: '25%',
              }}
              animate={{
                scale: [1, 1.4, 1],
                x: [0, 50, 0],
                y: [0, -60, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            />
          </div>
        </>
      ) : (
        <>
          {/* Light Theme - Soft Gradients */}
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>

          {/* Soft Floating Shapes */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl"
              style={{ top: '-100px', left: '-100px' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-3xl"
              style={{ bottom: '-100px', right: '-100px' }}
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            />
          </div>
        </>
      )}

      {/* Navbar */}
      <nav className={`relative z-50 border-b transition-colors ${
        isDark
          ? 'border-white/5 bg-black/40 backdrop-blur-2xl'
          : 'border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className={`absolute inset-0 rounded-lg blur-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 opacity-40'
                }`} />
                <div className={`relative px-5 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-black border-white/10'
                    : 'bg-white border-gray-200 shadow-md'
                }`}>
                  <h1 className="text-3xl font-black tracking-tight">
                    <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                      isDark
                        ? 'from-pink-400 via-purple-400 to-blue-400'
                        : 'from-purple-600 via-pink-600 to-blue-600'
                    }`}>
                      Todo
                    </span>
                    <span className={isDark ? 'text-white ml-2' : 'text-gray-900 ml-2'}>AI</span>
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Theme Toggle + Auth Buttons */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ThemeToggle />
              <Link
                href="/login"
                className={`group relative px-6 py-3 font-semibold rounded-xl overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
              >
                <div className={`absolute inset-0 transition-colors ${
                  isDark
                    ? 'bg-white/5 group-hover:bg-white/10'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`} />
                <div className={`absolute inset-0 border rounded-xl transition-colors ${
                  isDark
                    ? 'border-white/10 group-hover:border-purple-400/50'
                    : 'border-gray-200 group-hover:border-purple-400'
                }`} />
                <span className="relative">Sign In</span>
              </Link>
              <Link
                href="/register"
                className="group relative px-6 py-3 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 ${
                  isDark
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
                }`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity ${
                  isDark
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
                }`} />
                <span className="relative z-10">Get Started</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className={`px-6 py-2.5 rounded-full border backdrop-blur-sm ${
              isDark
                ? 'border-purple-500/30 bg-purple-500/10'
                : 'border-purple-300 bg-purple-100/80'
            }`}>
              <span className={`font-bold text-sm tracking-wide ${
                isDark ? 'text-purple-300' : 'text-purple-700'
              }`}>
                🤖 AI-POWERED PRODUCTIVITY
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                Manage Tasks
              </span>
              <br />
              <span className="relative inline-block mt-2">
                {isDark && (
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-3xl opacity-60" />
                )}
                <span className={`relative bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark
                    ? 'from-pink-400 via-purple-400 to-blue-400'
                    : 'from-purple-600 via-pink-600 to-blue-600'
                }`}>
                  Like Never Before
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the future with{' '}
            <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>FREE AI</span>,{' '}
            <span className={`font-semibold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>voice commands</span>, and{' '}
            <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>smart automation</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/register"
              className="group relative px-10 py-5 text-white text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <div className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
              }`} />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
              }`} />
              <div className="relative flex items-center justify-center space-x-2">
                <span>Start Free Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: '💬', title: 'AI Chat Assistant', desc: 'Natural language task management', colors: isDark ? 'from-pink-500/20 to-purple-500/20' : 'from-purple-100 to-pink-100' },
              { icon: '🎤', title: 'Voice Commands', desc: 'Hands-free productivity', colors: isDark ? 'from-blue-500/20 to-cyan-500/20' : 'from-blue-100 to-cyan-100' },
              { icon: '⚡', title: '100% FREE', desc: 'No limits, forever free', colors: isDark ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-100 to-pink-100' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + idx * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.colors} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-br from-white/5 to-white/0 border-white/10 group-hover:border-purple-400/50'
                    : 'bg-white/90 border-gray-200 group-hover:border-purple-400 shadow-lg group-hover:shadow-2xl'
                }`}>
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 border-t py-10 mt-20 transition-colors ${
        isDark
          ? 'border-white/5 bg-black/40 backdrop-blur-2xl'
          : 'border-gray-200 bg-white/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={isDark ? 'text-gray-400 text-lg' : 'text-gray-600 text-lg'}>
            Built with passion by{' '}
            <span className={`bg-gradient-to-r bg-clip-text text-transparent font-bold ${
              isDark
                ? 'from-pink-400 via-purple-400 to-blue-400'
                : 'from-purple-600 via-pink-600 to-blue-600'
            }`}>
              Syed Rashid Ali
            </span>
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            Phase III • AI-Powered Todo Application
          </p>
        </div>
      </footer>
    </div>
  );
}
