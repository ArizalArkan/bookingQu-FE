import React, { type ReactNode } from 'react';
import { AuthProvider } from '../auth/AuthProvider';
import { Navigation } from './Navigation';

interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <Navigation />
      <main className="animate-fade-in">
        {children}
      </main>
    </AuthProvider>
  );
};

