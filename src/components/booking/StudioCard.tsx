import React from 'react';
import type { Studio } from '../../lib/types';

interface StudioCardProps {
  studio: Studio;
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio }) => {
  const availableSeats = studio.totalSeats - studio.bookedSeats.length;
  const occupancyPercentage = (studio.bookedSeats.length / studio.totalSeats) * 100;
  const isFull = availableSeats === 0;

  const getOccupancyColor = () => {
    if (occupancyPercentage >= 80) return 'text-red-500';
    if (occupancyPercentage >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getOccupancyBgColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFull) {
      window.location.href = `/booking/${studio.id}`;
    }
  };

  return (
    <div
      onClick={handleNavigation}
      aria-disabled={isFull}
      className={`block bg-cinema-gray rounded-lg shadow-lg overflow-hidden border border-cinema-gray-light transition-all duration-300 ${
        isFull
          ? 'opacity-75 cursor-not-allowed'
          : 'hover:border-cinema-gold transform hover:scale-105 cursor-pointer'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">{studio.name}</h3>
          <div className="p-3 bg-cinema-dark rounded-lg">
            <svg className="w-8 h-8 text-cinema-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Kursi:</span>
            <span className="text-white font-semibold">{studio.totalSeats}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tersedia:</span>
            <span className={`font-bold ${getOccupancyColor()}`}>
              {availableSeats} kursi
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Terisi:</span>
            <span className="text-white font-semibold">{studio.bookedSeats.length} kursi</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>{Math.round(occupancyPercentage)}%</span>
            </div>
            <div className="w-full bg-cinema-dark rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${getOccupancyBgColor()} transition-all duration-500`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6">
            {availableSeats > 0 ? (
              <div className="bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-bold py-3 px-4 rounded-lg text-center transition-colors">
                Pilih Kursi
              </div>
            ) : (
              <div className="bg-gray-600 text-gray-400 font-bold py-3 px-4 rounded-lg text-center cursor-not-allowed">
                Studio Penuh
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};