import React, { useState, useEffect } from 'react';
import { StudioCard } from './StudioCard';
import { studiosApi } from '../../lib/api';
import type{ Studio } from '../../lib/types';

export const StudioList: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudios();
  }, []);

  const loadStudios = async () => {
    setIsLoading(true);
    const response = await studiosApi.getAll();
    if (response.success && response.data) {
      const studiosWithSeats = await Promise.all(
        response.data.map(async (studio) => {
          const detailResponse = await studiosApi.getById(studio.id);
          if (detailResponse.success && detailResponse.data) {
            return detailResponse.data;
          }
          return studio;
        })
      );

      setStudios(studiosWithSeats);
    } else {
      setError(response.error || 'Gagal memuat data studio');
    }
    setIsLoading(false);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  );
};

