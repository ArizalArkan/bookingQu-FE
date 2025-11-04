import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authApi, studiosApi, bookingsApi } from '../../lib/api';
import { SeatMap } from './SeatMap';
import { BookingSummary } from './BookingSummary';
import type { Studio, User } from '../../lib/types';

interface BookingFlowProps {
  studioId: string;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ studioId }) => {
  const authContext = useAuth();
  
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
  
  const [studio, setStudio] = useState<Studio | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudio();
  }, [studioId]);

  useEffect(() => {
    if (!currentIsAuthenticated) {
      window.location.href = `/login?redirect=/booking/${studioId}`;
    }
  }, [currentIsAuthenticated, studioId]);

  const loadStudio = async () => {
    setIsLoading(true);
    setError('');
    const response = await studiosApi.getById(studioId);
    if (response.success && response.data) {
      setStudio(response.data);
    } else {
      setError(response.error || 'Studio tidak ditemukan');
    }
    setIsLoading(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!currentUser || !studio) return;

    setIsBooking(true);
    setError('');

    const response = await bookingsApi.create({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      studioId: studio.id,
      seats: selectedSeats,
      bookingType: 'online',
    });

    if (response.success && response.data) {
      window.location.href = `/booking-success?id=${response.data.id}`;
    } else {
      setError(response.error || 'Gagal membuat booking');
      setIsBooking(false);
      loadStudio();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinema-gold"></div>
      </div>
    );
  }

  if (error && !studio) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <a
            href="/"
            className="text-cinema-gold hover:text-cinema-gold-dark font-semibold"
          >
            ← Kembali ke daftar studio
          </a>
        </div>
      </div>
    );
  }

  if (!studio) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <a
          href="/"
          className="text-cinema-gold hover:text-cinema-gold-dark font-semibold inline-flex items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </a>
        <h1 className="text-3xl font-bold text-white">{studio.name}</h1>
        <p className="text-gray-400 mt-2">
          Pilih kursi yang Anda inginkan (maksimal dapat memilih lebih dari 1 kursi)
        </p>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SeatMap
            studio={studio}
            selectedSeats={selectedSeats}
            onSeatSelect={setSelectedSeats}
          />
        </div>
        <div className="lg:col-span-1">
          <BookingSummary
            studio={studio}
            selectedSeats={selectedSeats}
            onConfirm={handleConfirmBooking}
            isLoading={isBooking}
          />
        </div>
      </div>
    </div>
  );
};

