import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const authContext = useContext(AuthContext);
  
  const user = authContext?.user ?? null;
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const isLoading = authContext?.isLoading ?? true;
  const logout = authContext?.logout ?? (async () => {});

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-cinema-gray border-b border-cinema-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-cinema-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
              <span className="text-lg sm:text-xl font-bold text-white xs:block">BookingQu</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-4">
                <div className="w-20 h-8 bg-cinema-gray-light rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-cinema-gray-light rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <a href="/validate-ticket" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Validate Ticket
                </a>
                <a href="/my-tickets" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  My Tickets
                </a>
                <a href="/cashier" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Cashier
                </a>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-cinema-gold rounded-full flex items-center justify-center text-cinema-dark font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline">{user?.name}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-cinema-gray-light rounded-md shadow-lg py-1 z-50 border border-cinema-gray-light">
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-cinema-gray">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cinema-gray hover:text-white transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-semibold px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Daftar
                </a>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {isLoading ? (
              <div className="px-3 py-3 space-y-3">
                <div className="h-12 bg-cinema-gray-light rounded animate-pulse"></div>
                <div className="h-8 bg-cinema-gray-light rounded animate-pulse"></div>
                <div className="h-8 bg-cinema-gray-light rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 border-b border-cinema-gray-light">
                  <div className="w-10 h-10 bg-cinema-gold rounded-full flex items-center justify-center text-cinema-dark font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <a
                  href="/validate-ticket"
                  className="block text-gray-300 hover:text-white hover:bg-cinema-gray-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Validate Ticket
                </a>
                <a
                  href="/my-tickets"
                  className="block text-gray-300 hover:text-white hover:bg-cinema-gray-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Tickets
                </a>
                <a
                  href="/cashier"
                  className="block text-gray-300 hover:text-white hover:bg-cinema-gray-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cashier
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 hover:text-red-300 hover:bg-cinema-gray-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="block text-gray-300 hover:text-white hover:bg-cinema-gray-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="block bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-semibold px-3 py-2 rounded-md text-sm transition-colors mx-3 mt-2 text-center"
                >
                  Daftar
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

