'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    router.push('/');
  };

  return (
    <nav className="bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Icons for future chatbot */}
          <div className="flex items-center space-x-4">
            {/* Icon 1 - Home */}
            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Icon 2 - Tasks */}
            {isAuth && (
              <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>
            )}

            {/* Icon 3 - Chatbot (placeholder for Phase 3) */}
            <button className="text-white hover:text-gray-200 transition-colors opacity-50 cursor-not-allowed" disabled title="Chatbot - Coming in Phase 3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>

          {/* Center - Logo/Title */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
              Todo App
            </Link>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuth ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 font-medium transition-colors border border-gray-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white border border-gray-700 rounded-md hover:bg-gray-800 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 font-medium transition-colors border border-gray-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
