import api from './api';
import { User, UserRole } from '../types';

export const authService = {
  async login(emailOrPhone: string, role: UserRole = 'driver'): Promise<{ user: User; token: string }> {
    const res = await api.post<any>('/api/auth/login', { emailOrPhone, role });
    if (res?.token) {
      localStorage.setItem('md_auth_token', res.token);
    }
    return {
      user: res?.user || res?.data,
      token: res?.token,
    };
  },

  async register(userData: {
    name: string;
    phone: string;
    email?: string;
    role: UserRole;
    vehicleModel?: string;
    vehicleNumber?: string;
  }): Promise<{ user: User; token: string }> {
    const res = await api.post<any>('/api/auth/register', userData);
    if (res?.token) {
      localStorage.setItem('md_auth_token', res.token);
    }
    return {
      user: res?.user || res?.data,
      token: res?.token,
    };
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<any>('/api/auth/me');
    return res?.user || res?.data || res;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put<any>('/api/auth/profile', data);
    return res?.user || res?.data || res;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('md_auth_token');
  },
};

