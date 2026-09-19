import api from './api';
import { User, UserRole } from '../types';

export const authService = {
  async login(emailOrPhone: string, role: UserRole = 'driver'): Promise<{ user: User; token: string }> {
    return api.post('/api/auth/login', { emailOrPhone, role });
  },

  async register(userData: {
    name: string;
    phone: string;
    email?: string;
    role: UserRole;
    vehicleModel?: string;
    vehicleNumber?: string;
  }): Promise<{ user: User; token: string }> {
    return api.post('/api/auth/register', userData);
  },

  async getCurrentUser(): Promise<User> {
    return api.get('/api/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return api.put('/api/auth/profile', data);
  },

  async logout(): Promise<void> {
    localStorage.removeItem('md_auth_token');
  },
};
