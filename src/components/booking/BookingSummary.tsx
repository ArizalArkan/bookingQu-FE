import React from 'react';
import type { Studio } from '../../lib/types';

interface BookingSummaryProps {
  studio: Studio;
  selectedSeats: string[];
  onConfirm: () => void;
  isLoading: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  studio,
  selectedSeats,
  onConfirm,
  isLoading,
}) => {
  const pricePerSeat = 50000;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-cinema-gray rounded-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold text-white mb-4">Ringkasan Booking</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Studio:</span>
          <span className="text-white font-semibold">{studio.name}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Jumlah Kursi:</span>
          <span className="text-white font-semibold">{selectedSeats.length}</span>
        </div>

        {selectedSeats.length > 0 && (
          <div className="text-sm">
            <span className="text-gray-400 block mb-2">Kursi Dipilih:</span>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-cinema-gray-light pt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Harga per kursi:</span>
            <span className="text-white">{formatCurrency(pricePerSeat)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">Total:</span>
            <span className="text-cinema-gold font-bold text-xl">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={selectedSeats.length === 0 || isLoading}
          className="w-full bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>

        {selectedSeats.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-2">
            Pilih minimal 1 kursi untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  );
};

