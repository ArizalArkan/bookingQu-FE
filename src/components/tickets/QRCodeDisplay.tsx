import React, { useState } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 200 }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageSrc = (base64: string): string => {
    if (!base64) return '';
    
    if (base64.startsWith('data:image')) {
      return base64;
    }
    
    return `data:image/png;base64,${base64}`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!value) {
    return (
      <div className="bg-red-100 p-4 rounded-lg flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <p className="text-red-600 text-sm font-semibold">
            QR Code tidak tersedia
          </p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-100 p-4 rounded-lg flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <p className="text-red-600 text-sm font-semibold">
            QR Code tidak dapat ditampilkan
          </p>
          <p className="text-red-500 text-xs mt-2">
            Gagal memuat gambar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg inline-block shadow-md">
      {isLoading && (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cinema-gold"></div>
        </div>
      )}
      <img
        src={getImageSrc(value)}
        alt="QR Code"
        width={size}
        height={size}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${isLoading ? 'hidden' : 'block'} rounded-md`}
        style={{ maxWidth: size, maxHeight: size, objectFit: 'contain' }}
      />
    </div>
  );
};

