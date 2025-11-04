import React, { useState } from 'react';
import { bookingsApi } from '../../lib/api';

export const ValidateTicketForm: React.FC = () => {
  const [bookingCode, setBookingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingCode.trim()) {
      setError('Masukkan kode booking');
      return;
    }

    setIsLoading(true);
    setError('');

    const response = await bookingsApi.validateBooking(bookingCode.trim());

    if (response.success && response.data) {
      window.location.href = '/my-tickets';
    } else {
      setError(response.error || 'Booking tidak ditemukan atau sudah digunakan');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-cinema-gray rounded-lg shadow-xl p-8 border border-cinema-gray-light">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-cinema-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cinema-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Validasi Tiket</h2>
          <p className="text-gray-400">
            Masukkan kode booking untuk memvalidasi tiket
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bookingCode" className="block text-sm font-medium text-gray-300 mb-2">
              Kode Booking
            </label>
            <input
              type="text"
              id="bookingCode"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold font-mono text-lg"
              placeholder="XXXXX-XXXXX"
              required
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-400">
              Masukkan kode booking yang tertera di tiket
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memvalidasi...
              </span>
            ) : (
              'Validasi Tiket'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-cinema-gray-light">
          <div className="bg-cinema-dark rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cinema-gold mb-2">Informasi</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Kode booking dapat ditemukan di tiket Anda</li>
              <li>• Setelah divalidasi, status tiket akan berubah menjadi "Digunakan"</li>
              <li>• Tiket yang sudah digunakan tidak dapat divalidasi lagi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

