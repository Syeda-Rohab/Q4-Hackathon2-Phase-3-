'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
            TODO AI
          </Link>

          {/* Desktop Menu - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {isAuth && (
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>
            )}

            {isAuth ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Icons and Menu - Right Side */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Home Icon */}
            <Link href="/" className="text-white hover:text-gray-300 transition-colors p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Dashboard Icon - Only show if authenticated */}
            {isAuth && (
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition-colors p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>
            )}

            {/* User/Auth Icon */}
            {isAuth ? (
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition-colors p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link href="/login" className="text-white hover:text-gray-300 transition-colors p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Home
            </Link>

            {isAuth && (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            )}

            <div className="pt-2 border-t border-gray-800 space-y-3">
              {isAuth ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-white border-2 border-gray-600 rounded-lg hover:bg-gray-800 font-bold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
