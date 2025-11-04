import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../../lib/api';
import type { User, AuthState } from '../../lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const user = authApi.getCurrentUser();
      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('cinema_jwt_token') : null;
        if (token) {
          const verifyResponse = await authApi.verifyToken(token);
          if (verifyResponse.success && verifyResponse.data) {
            setState({
              user: verifyResponse.data,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });
    if (response.success && response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const loginWithGoogle = async (email: string, name: string) => {
    const response = await authApi.loginWithGoogle({ email, name });
    if (response.success && response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const logout = async () => {
    await authApi.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    const defaultValue: AuthContextType = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false, error: 'AuthProvider not available' }),
      register: async () => ({ success: false, error: 'AuthProvider not available' }),
      loginWithGoogle: async () => ({ success: false, error: 'AuthProvider not available' }),
      logout: async () => {},
    };
    return defaultValue;
  }
  return context;
};

