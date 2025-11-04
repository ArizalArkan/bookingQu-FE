import React, { useState, useEffect } from 'react';
import { studiosApi } from '../../lib/api';
import type { Studio } from '../../lib/types';

interface SeatMapProps {
  studio: Studio;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
}

interface SeatInfo {
  seatNumber: string;
  row: string;
  col: number;
  isBooked: boolean;
  isAvailable: boolean;
}

export const SeatMap: React.FC<SeatMapProps> = ({ studio, selectedSeats, onSeatSelect }) => {
  const [allSeats, setAllSeats] = useState<SeatInfo[]>([]);
  const [rows, setRows] = useState<string[]>([]);
  const [cols, setCols] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, [studio.id]);

  const loadSeats = async () => {
    setIsLoading(true);
    try {
      const seatsResponse = await studiosApi.getAllSeats(studio.id);
      
      if (seatsResponse.success && seatsResponse.data) {
        const seats: SeatInfo[] = seatsResponse.data.map((seat: any) => {
          const match = seat.seat_number.match(/^([A-Z]+)(\d+)$/);
          if (match) {
            return {
              seatNumber: seat.seat_number,
              row: match[1],
              col: parseInt(match[2], 10),
              isBooked: !seat.is_available,
              isAvailable: seat.is_available,
            };
          }
          return null;
        }).filter((seat: SeatInfo | null): seat is SeatInfo => seat !== null);

        setAllSeats(seats);

        const uniqueRows = [...new Set(seats.map(s => s.row))].sort();
        const uniqueCols = [...new Set(seats.map(s => s.col))].sort((a, b) => a - b);

        setRows(uniqueRows);
        setCols(uniqueCols);
      }
    } catch (error) {
      console.error('Error loading seats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeatInfo = (row: string, col: number): SeatInfo | null => {
    return allSeats.find(s => s.row === row && s.col === col) || null;
  };

  const isSeatBooked = (seatId: string): boolean => {
    const seatInfo = allSeats.find(s => s.seatNumber === seatId);
    return seatInfo ? seatInfo.isBooked : studio.bookedSeats.includes(seatId);
  };

  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.includes(seatId);
  };

  const handleSeatClick = (row: string, col: number) => {
    const seatInfo = getSeatInfo(row, col);
    if (!seatInfo || seatInfo.isBooked) return;

    const seatId = seatInfo.seatNumber;
    if (isSeatSelected(seatId)) {
      onSeatSelect(selectedSeats.filter((s) => s !== seatId));
    } else {
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  const getSeatClassName = (seatInfo: SeatInfo | null): string => {
    const baseClass = 'w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center';
    
    if (!seatInfo) {
      return `${baseClass} bg-gray-800 cursor-not-allowed opacity-20 invisible`;
    }
    
    if (seatInfo.isBooked) {
      return `${baseClass} bg-red-900 text-red-300 cursor-not-allowed opacity-60`;
    }
    
    const seatId = seatInfo.seatNumber;
    if (isSeatSelected(seatId)) {
      return `${baseClass} bg-blue-600 text-white ring-4 ring-blue-400 cursor-pointer shadow-lg`;
    }
    
    return `${baseClass} bg-green-700 text-white hover:bg-green-600 cursor-pointer hover:shadow-md`;
  };

  if (isLoading) {
    return (
      <div className="bg-cinema-gray rounded-lg p-4 sm:p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinema-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cinema-gray rounded-lg p-3 sm:p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <div className="bg-gradient-to-b from-cinema-gold to-cinema-gold-dark h-2 rounded-t-3xl mb-2 max-w-3xl mx-auto"></div>
        <p className="text-center text-gray-400 text-xs sm:text-sm font-medium">LAYAR</p>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-max mx-auto flex flex-col items-center px-2 py-2">
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                <div className="w-6 sm:w-7 md:w-8 text-center text-cinema-gold font-bold text-sm sm:text-base flex-shrink-0">
                  {row}
                </div>
                
                {cols.map((col) => {
                  const seatInfo = getSeatInfo(row, col);
                  const seatId = seatInfo?.seatNumber || `${row}${col}`;
                  return (
                    <button
                      type="button"
                      key={seatId}
                      onClick={() => handleSeatClick(row, col)}
                      disabled={!seatInfo || seatInfo.isBooked}
                      className={getSeatClassName(seatInfo)}
                      title={seatInfo ? `Kursi ${seatInfo.seatNumber}` : 'Kursi tidak tersedia'}
                      aria-label={seatInfo ? `Kursi ${seatInfo.seatNumber}` : 'Tidak tersedia'}
                    >
                      {seatInfo ? col : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-700 rounded-md"></div>
          <span className="text-gray-300">Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 rounded-md"></div>
          <span className="text-gray-300">Dipilih</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-900 rounded-md opacity-60"></div>
          <span className="text-gray-300">Terisi</span>
        </div>
      </div>
    </div>
  );
};
