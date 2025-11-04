import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authApi, bookingsApi } from '../../lib/api';
import { TicketCard } from './TicketCard';
import type { Booking, User } from '../../lib/types';

export const MyTickets: React.FC = () => {
  const authContext = useAuth();
  const hasLoadedRef = useRef(false);
  
  const getStoredUser = () => authApi.getCurrentUser();
  
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [currentIsAuthenticated, setCurrentIsAuthenticated] = useState(() => !!getStoredUser());
  
  useEffect(() => {
    if (authContext.user) {
      setCurrentUser(authContext.user);
      setCurrentIsAuthenticated(true);
    } else {
      const storedUser = authApi.getCurrentUser();
      setCurrentUser(storedUser);
      setCurrentIsAuthenticated(!!storedUser);
    }
  }, [authContext.user, authContext.isAuthenticated]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'used'>('all');

  useEffect(() => {
    if (!currentIsAuthenticated) {
      window.location.href = '/login?redirect=/my-tickets';
      return;
    }
    
    if (currentUser && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadBookings();
    }
  }, [currentUser, currentIsAuthenticated]);

  const loadBookings = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await bookingsApi.getUserBookings(currentUser.id);
      if (response.success && response.data) {
        setBookings(response.data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } else {
        setError(response.error || 'Gagal memuat data booking');
      }
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Gagal memuat data booking');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getFilterCount = (status: 'all' | 'active' | 'cancelled' | 'used') => {
    if (status === 'all') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinema-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tiket Saya</h1>
        <p className="text-gray-400">
          Lihat semua booking Anda dan QR code untuk masuk studio
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-cinema-gold text-cinema-dark'
              : 'bg-cinema-gray text-gray-300 hover:bg-cinema-gray-light'
          }`}
        >
          Semua ({getFilterCount('all')})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'active'
              ? 'bg-cinema-gold text-cinema-dark'
              : 'bg-cinema-gray text-gray-300 hover:bg-cinema-gray-light'
          }`}
        >
          Aktif ({getFilterCount('active')})
        </button>
        <button
          onClick={() => setFilter('used')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'used'
              ? 'bg-cinema-gold text-cinema-dark'
              : 'bg-cinema-gray text-gray-300 hover:bg-cinema-gray-light'
          }`}
        >
          Sudah Digunakan ({getFilterCount('used')})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'cancelled'
              ? 'bg-cinema-gold text-cinema-dark'
              : 'bg-cinema-gray text-gray-300 hover:bg-cinema-gray-light'
          }`}
        >
          Dibatalkan ({getFilterCount('cancelled')})
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-cinema-gray rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">
            {filter === 'all' ? 'Belum Ada Booking' : `Tidak Ada Booking ${filter === 'active' ? 'Aktif' : filter === 'used' ? 'yang Sudah Digunakan' : 'yang Dibatalkan'}`}
          </h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all' 
              ? 'Mulai booking sekarang untuk menonton film favorit Anda'
              : 'Tidak ada booking dengan status ini'
            }
          </p>
          {filter === 'all' && (
            <a
              href="/"
              className="inline-block bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Booking Sekarang
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <TicketCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

