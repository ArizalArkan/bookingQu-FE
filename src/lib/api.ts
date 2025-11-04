import type {
  User,
  LoginCredentials,
  RegisterData,
  Studio,
  Booking,
  CreateBookingData,
  ApiResponse,
} from './types';
import { config } from './config';

const STORAGE_KEYS = {
  TOKEN: 'cinema_jwt_token',
  USER: 'cinema_current_user',
};


const seatMappingCache = new Map<string, Map<string, number>>();

const studioNameCache = new Map<string, string>();

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const convertBackendUser = (backendUser: any): User => {
  return {
    id: String(backendUser.id),
    email: backendUser.email,
    name: backendUser.name,
    authType: backendUser.role === 'google' ? 'google' : 'email',
    createdAt: new Date(backendUser.created_at || backendUser.createdAt),
  };
};

const convertBackendStudio = (backendStudio: any, seats?: any[]): Studio => {
  const bookedSeats: string[] = seats
    ? seats.filter((seat) => !seat.is_available).map((seat) => seat.seat_number)
    : [];

  return {
    id: String(backendStudio.id),
    name: backendStudio.name,
    totalSeats: backendStudio.total_seats || 20,
    bookedSeats,
  };
};

const convertBackendBooking = (backendBooking: any, seatMapping?: Map<string, number>): Booking => {
  const seatIds = Array.isArray(backendBooking.seat_ids) 
    ? backendBooking.seat_ids.map((id: number) => Number(id))
    : [];
  
  let seats: string[] = [];
  if (seatMapping) {
    seats = seatIds
      .map((id: number) => {
        for (const [seatNumber, seatId] of seatMapping.entries()) {
          if (seatId === id) return seatNumber;
        }
        return null;
      })
      .filter((seat): seat is string => seat !== null);
  } else {
    seats = seatIds.map((id: number) => `Seat-${id}`);
  }

  const studioId = String(backendBooking.studio_id);
  const studioName = studioNameCache.get(studioId) || backendBooking.studio_name || '';

  return {
    id: backendBooking.booking_code || String(backendBooking.id),
    userId: backendBooking.user_id ? String(backendBooking.user_id) : '',
    userName: backendBooking.user_name,
    userEmail: backendBooking.user_email,
    studioId,
    studioName,
    seats,
    qrCode: backendBooking.qr_code || '',
    bookingType: backendBooking.booking_type || 'online',
    timestamp: new Date(backendBooking.created_at || backendBooking.timestamp),
    status: backendBooking.status || 'active',
  };
};

export const authApi = {
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<{ user: any; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      });

      const user = convertBackendUser(response.user);
      saveToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<{ user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const user = convertBackendUser(response.user);
      saveToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  loginWithGoogle: async (googleData: { email: string; name: string }): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<{ user: any; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: googleData.email,
          name: googleData.name,
          password: 'google-oauth-placeholder',
        }),
      });

      const user = convertBackendUser(response.user);
      user.authType = 'google';
      saveToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      try {
        const loginResponse = await apiCall<{ user: any; token: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: googleData.email,
            password: 'google-oauth-placeholder',
          }),
        });

        const user = convertBackendUser(loginResponse.user);
        user.authType = 'google';
        saveToken(loginResponse.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }

        return {
          success: true,
          data: user,
        };
      } catch (loginError: any) {
        return {
          success: false,
          error: loginError.message || 'Google login failed',
        };
      }
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    removeToken();
    return {
      success: true,
    };
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }

    const token = getToken();
    if (token) {
      return null;
    }

    return null;
  },

  verifyToken: async (token: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall<{ user: any; valid: boolean }>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      if (response.valid && response.user) {
        const user = convertBackendUser(response.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
        return {
          success: true,
          data: user,
        };
      }

      return {
        success: false,
        error: 'Invalid token',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token verification failed',
      };
    }
  },
};

export const studiosApi = {
  getAll: async (): Promise<ApiResponse<Studio[]>> => {
    try {
      const response = await apiCall<any[]>('/api/cinema/studios');
      const studios = response.map((studio) => {
        studioNameCache.set(String(studio.id), studio.name);
        return convertBackendStudio(studio);
      });

      return {
        success: true,
        data: studios,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch studios',
      };
    }
  },

  getById: async (id: string): Promise<ApiResponse<Studio>> => {
    try {
      const studiosResponse = await apiCall<any[]>('/api/cinema/studios');
      const studioResponse = studiosResponse.find((s) => String(s.id) === id);

      if (!studioResponse) {
        return {
          success: false,
          error: 'Studio tidak ditemukan',
        };
      }

      let seatsResponse: any[] = [];
      try {
        seatsResponse = await apiCall<any[]>(`/api/cinema/studios/${id}/seats`);
      } catch {
      }

      studioNameCache.set(id, studioResponse.name);

      const seatMapping = new Map<string, number>();
      if (Array.isArray(seatsResponse)) {
        seatsResponse.forEach((seat) => {
          seatMapping.set(seat.seat_number, seat.id);
        });
        seatMappingCache.set(id, seatMapping);
      }

      const studio = convertBackendStudio(studioResponse, seatsResponse);

      return {
        success: true,
        data: studio,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Studio tidak ditemukan',
      };
    }
  },

  getAvailableSeats: async (studioId: string): Promise<ApiResponse<string[]>> => {
    try {
      const seatsResponse = await apiCall<any[]>(`/api/cinema/studios/${studioId}/seats`);
      
      const seatMapping = new Map<string, number>();
      const availableSeats: string[] = [];
      
      seatsResponse.forEach((seat) => {
        seatMapping.set(seat.seat_number, seat.id);
        if (seat.is_available) {
          availableSeats.push(seat.seat_number);
        }
      });
      
      seatMappingCache.set(studioId, seatMapping);

      return {
        success: true,
        data: availableSeats,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch available seats',
      };
    }
  },

  getAllSeats: async (studioId: string): Promise<ApiResponse<any[]>> => {
    try {
      const seatsResponse = await apiCall<any[]>(`/api/cinema/studios/${studioId}/seats`);
      
      const seatMapping = new Map<string, number>();
      seatsResponse.forEach((seat) => {
        seatMapping.set(seat.seat_number, seat.id);
      });
      seatMappingCache.set(studioId, seatMapping);

      return {
        success: true,
        data: seatsResponse,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch seats',
      };
    }
  },

  getSeatId: (studioId: string, seatNumber: string): number | null => {
    const mapping = seatMappingCache.get(studioId);
    if (!mapping) return null;
    return mapping.get(seatNumber) || null;
  },

  getSeatIds: (studioId: string, seatNumbers: string[]): number[] => {
    const mapping = seatMappingCache.get(studioId);
    if (!mapping) return [];
    
    const seatIds: number[] = [];
    for (const seatNumber of seatNumbers) {
      const seatId = mapping.get(seatNumber);
      if (seatId !== undefined) {
        seatIds.push(seatId);
      }
    }
    return seatIds;
  },
};

export const bookingsApi = {
  create: async (data: CreateBookingData): Promise<ApiResponse<Booking>> => {
    try {
      const token = getToken();
      if (!token && data.bookingType === 'online') {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const seatIds = studiosApi.getSeatIds(data.studioId, data.seats);
      if (seatIds.length !== data.seats.length) {
        return {
          success: false,
          error: 'Some seats are invalid',
        };
      }

      const endpoint = data.bookingType === 'online' ? '/api/booking/online' : '/api/booking/offline';
      
      const requestBody: any = {
        studioId: Number(data.studioId),
        seatIds: seatIds,
      };

      if (data.bookingType === 'offline') {
        requestBody.customerName = data.userName;
        requestBody.customerEmail = data.userEmail;
      }

      const response = await apiCall<{ booking: any; qrCode: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const seatMapping = seatMappingCache.get(data.studioId);
      const booking = convertBackendBooking(response.booking, seatMapping);
      booking.qrCode = response.qrCode || response.booking.qr_code;

      return {
        success: true,
        data: booking,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create booking',
      };
    }
  },

  getUserBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await apiCall<any[]>('/api/booking/my-bookings');
      
      try {
        const studiosResponse = await apiCall<any[]>('/api/cinema/studios');
        studiosResponse.forEach((studio) => {
          studioNameCache.set(String(studio.id), studio.name);
        });
      } catch {
      }

      const studioIds = [...new Set(response.map((b: any) => String(b.studio_id)))];
      
      const seatMappingPromises = studioIds
        .filter((studioId) => !seatMappingCache.has(studioId))
        .map(async (studioId) => {
          try {
            await studiosApi.getAvailableSeats(studioId);
          } catch {
          }
        });
      
      await Promise.all(seatMappingPromises);

      const bookings = await Promise.all(
        response.map(async (backendBooking) => {
          const studioId = String(backendBooking.studio_id);
          const seatMapping = seatMappingCache.get(studioId);
          return convertBackendBooking(backendBooking, seatMapping);
        })
      );

      return {
        success: true,
        data: bookings,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch bookings',
      };
    }
  },

  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    try {
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await bookingsApi.getUserBookings('');
      if (response.success && response.data) {
        const booking = response.data.find((b) => b.id === id);
        if (booking) {
          return {
            success: true,
            data: booking,
          };
        }
      }

      return {
        success: false,
        error: 'Booking tidak ditemukan',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Booking tidak ditemukan',
      };
    }
  },

  cancel: async (id: string): Promise<ApiResponse<void>> => {
    return {
      success: false,
      error: 'Cancel booking not yet implemented',
    };
  },

  validateBooking: async (bookingCode: string): Promise<ApiResponse<Booking>> => {
    try {
      const response = await apiCall<{ booking: any; message: string }>('/api/booking/validate', {
        method: 'POST',
        body: JSON.stringify({ bookingCode: bookingCode.toLowerCase() }),
      });

      const studioId = String(response.booking.studio_id);
      
      if (!studioNameCache.has(studioId)) {
        try {
          const studiosResponse = await apiCall<any[]>('/api/cinema/studios');
          studiosResponse.forEach((studio) => {
            studioNameCache.set(String(studio.id), studio.name);
          });
        } catch {
        }
      }

      if (!seatMappingCache.has(studioId)) {
        try {
          await studiosApi.getAvailableSeats(studioId);
        } catch {
        }
      }

      const seatMapping = seatMappingCache.get(studioId);
      const booking = convertBackendBooking(response.booking, seatMapping);

      return {
        success: true,
        data: booking,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Booking tidak ditemukan atau sudah digunakan',
      };
    }
  },
};

