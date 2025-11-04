import { authApi } from './api';
import type { User } from './types';

export const getUser = (): User | null => {
  return authApi.getCurrentUser();
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};

export const requireAuth = (): User => {
  const user = getUser();
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }
  return user;
};

export const redirectIfAuthenticated = (redirectTo: string = '/'): void => {
  if (isAuthenticated() && typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
};

