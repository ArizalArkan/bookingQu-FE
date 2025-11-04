import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { authApi } from '../../lib/api';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useAuth();
  
  const handleRegister = async (email: string, password: string, name: string) => {
    const result = await authContext.register(email, password, name);
    if (!result.success) {
      const apiResult = await authApi.register({ email, password, name });
      if (apiResult.success && apiResult.data) {
        return { success: true };
      }
      return { success: false, error: apiResult.error };
    }
    return result;
  };

  const handleGoogleLogin = async (email: string, name: string) => {
    const result = await authContext.loginWithGoogle(email, name);
    if (!result.success) {
      const apiResult = await authApi.loginWithGoogle({ email, name });
      if (apiResult.success && apiResult.data) {
        return { success: true };
      }
      return { success: false, error: apiResult.error };
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleRegister(email, password, name);
      if (result.success) {
        window.location.href = '/';
      } else {
        setError(result.error || 'Registrasi gagal');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Terjadi kesalahan saat registrasi');
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = async () => {
    setError('');
    setIsLoading(true);

    const mockGoogleUser = {
      email: 'demo@gmail.com',
      name: 'Demo User (Google)',
    };

    try {
      const result = await handleGoogleLogin(mockGoogleUser.email, mockGoogleUser.name);
      if (result.success) {
        window.location.href = '/';
      } else {
        setError(result.error || 'Login dengan Google gagal');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Login dengan Google gagal');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-cinema-gray rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Daftar</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
              placeholder="Nama Lengkap Anda"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cinema-dark border border-cinema-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cinema-gold hover:bg-cinema-gold-dark text-cinema-dark font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cinema-gray-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cinema-gray text-gray-400">Atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLoginClick}
            disabled={isLoading}
            className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Daftar dengan Google (Demo)
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Sudah punya akun?{' '}
            <a href="/login" className="text-cinema-gold hover:text-cinema-gold-dark font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

