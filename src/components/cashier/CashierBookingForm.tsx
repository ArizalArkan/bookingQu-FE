import React, { useState, useEffect } from 'react';
import { SeatMap } from '../booking/SeatMap';
import { QRCodeDisplay } from '../tickets/QRCodeDisplay';
import { studiosApi, bookingsApi } from '../../lib/api';
import type { Studio } from '../../lib/types';

export const CashierBookingForm: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudioId, setSelectedStudioId] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    loadStudios();
  }, []);

  useEffect(() => {
    if (selectedStudioId) {
      loadStudio(selectedStudioId);
    } else {
      setSelectedStudio(null);
      setSelectedSeats([]);
    }
  }, [selectedStudioId]);

  const loadStudios = async () => {
    const response = await studiosApi.getAll();
    if (response.success && response.data) {
      setStudios(response.data);
    }
  };

  const loadStudio = async (studioId: string) => {
    const response = await studiosApi.getById(studioId);
    if (response.success && response.data) {
      setSelectedStudio(response.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudio) {
      setError('Pilih studio terlebih dahulu');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Pilih minimal 1 kursi');
      return;
    }

    setIsLoading(true);
    setError('');

    const response = await bookingsApi.create({
      userId: `cashier-${Date.now()}`,
      userName: customerName,
      userEmail: customerEmail,
      studioId: selectedStudio.id,
      seats: selectedSeats,
      bookingType: 'offline',
    });

    if (response.success && response.data) {
      setSuccess(true);
      setBookingId(response.data);
      setSelectedStudioId('');
      setSelectedSeats([]);
      setCustomerName('');
      setCustomerEmail('');
    } else {
      setError(response.error || 'Gagal membuat booking');
      if (selectedStudioId) {
        loadStudio(selectedStudioId);
      }
    }
    
    setIsLoading(false);
  };

  const handleNewBooking = () => {
    setSuccess(false);
    setBookingId('');
  };

  if (success && bookingId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-cinema-gray rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Berhasil!</h2>
          <p className="text-gray-400 mb-6">
            Booking ID: <span className="text-cinema-gold font-mono">{bookingId.id}</span>
          </p>

          <div className="mb-6">
            <QRCodeDisplay value={bookingId.qrCode} size={200} />
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNewBooking}
              className="bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Booking Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Kasir - Offline Booking</h1>
        <p className="text-gray-400">
          Buat booking untuk pelanggan yang datang langsung ke kasir
        </p>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-cinema-gray rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Data Pelanggan</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-cinema-gray rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Pilih Studio</h3>
              
              <select
                value={selectedStudioId}
                onChange={(e) => setSelectedStudioId(e.target.value)}
                className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                required
              >
                <option value="">-- Pilih Studio --</option>
                {studios.map((studio) => {
                  const available = studio.totalSeats - studio.bookedSeats.length;
                  return (
                    <option key={studio.id} value={studio.id}>
                      {studio.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedStudio && (
              <div className="bg-cinema-gray rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Ringkasan</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Studio:</span>
                    <span className="text-white font-semibold">{selectedStudio.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kursi Dipilih:</span>
                    <span className="text-white font-semibold">{selectedSeats.length}</span>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div>
                      <span className="text-gray-400 block mb-2">Kursi:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || selectedSeats.length === 0}
                  className="w-full bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? 'Memproses...' : 'Konfirmasi Booking'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedStudio ? (
              <SeatMap
                studio={selectedStudio}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
              />
            ) : (
              <div className="bg-cinema-gray rounded-lg p-12 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-400">Pilih studio untuk melihat peta kursi</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

