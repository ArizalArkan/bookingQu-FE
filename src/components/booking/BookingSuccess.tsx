import React, { useState, useEffect } from 'react';
import { TicketCard } from '../tickets/TicketCard';
import { bookingsApi } from '../../lib/api';
import type { Booking } from '../../lib/types';

interface BookingSuccessProps {
  bookingId: string;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ bookingId }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await bookingsApi.getById(bookingId);
      if (response.success && response.data) {
        setBooking(response.data);
      } else {
        setError(response.error || 'Booking tidak ditemukan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinema-gold"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {error || 'Booking tidak ditemukan'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Booking Berhasil!</h1>
        <p className="text-gray-400">
          Booking Anda telah dikonfirmasi. Simpan QR code di bawah untuk masuk ke studio.
        </p>
      </div>

      <TicketCard booking={booking} />

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/my-tickets"
          className="bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-semibold py-3 px-6 rounded-lg transition-colors text-center"
        >
          Lihat Semua Tiket
        </a>
        <a
          href="/"
          className="bg-cinema-gray-light hover:bg-cinema-gray text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center border border-cinema-gray-light"
        >
          Booking Lagi
        </a>
      </div>
    </div>
  );
};

