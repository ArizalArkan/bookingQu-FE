import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import type { Booking } from '../../lib/types';

interface TicketCardProps {
  booking: Booking;
}

export const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 bg-opacity-10 text-green-500 border-green-500';
      case 'cancelled':
        return 'bg-red-500 bg-opacity-10 text-red-500 border-red-500';
      case 'used':
        return 'bg-gray-500 bg-opacity-10 text-gray-500 border-gray-500';
      default:
        return 'bg-gray-500 bg-opacity-10 text-gray-500 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'cancelled':
        return 'Dibatalkan';
      case 'used':
        return 'Sudah Digunakan';
      default:
        return status;
    }
  };

  return (
    <div className="bg-cinema-gray rounded-lg overflow-hidden border border-cinema-gray-light">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{booking.studioName}</h3>
            <p className="text-gray-400 text-sm">Booking ID: {booking.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-sm mb-1">Nama</p>
              <p className="text-white font-semibold">{booking.userName}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{booking.userEmail}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Kursi</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-cinema-gold text-cinema-dark px-3 py-1 rounded-lg font-semibold text-sm"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Waktu Booking</p>
              <p className="text-white">{formatDate(booking.timestamp)}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Tipe Booking</p>
              <p className="text-white capitalize">{booking.bookingType}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <QRCodeDisplay value={booking.qrCode} size={200} />
            <p className="text-gray-400 text-sm mt-3 text-center">
              Tunjukkan QR code ini saat masuk studio
            </p>
          </div>
        </div>
      </div>

      {booking.status === 'active' && (
        <div className="bg-cinema-gold bg-opacity-10 border-t border-cinema-gold px-6 py-4">
          <p className="text-cinema-gold text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Simpan atau screenshot QR code untuk masuk ke studio
          </p>
        </div>
      )}
    </div>
  );
};

