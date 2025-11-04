
export interface User {
  id: string;
  email: string;
  name: string;
  authType: 'email' | 'google';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface Studio {
  id: number;
  name: string;
  total_seats: number;
  updated_at: string;
  created_at: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  studioId: string;
  studioName: string;
  seats: string[];
  qrCode: string;
  bookingType: 'online' | 'offline';
  timestamp: Date;
  status: 'active' | 'cancelled' | 'used';
}

export interface CreateBookingData {
  userId: string;
  userName: string;
  userEmail: string;
  studioId: string;
  seats: string[];
  bookingType: 'online' | 'offline';
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
  bookedBy?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

