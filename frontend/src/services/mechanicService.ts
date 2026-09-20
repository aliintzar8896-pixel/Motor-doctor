import api from './api';
import { Mechanic } from '../types';

export const mechanicService = {
  async getAllMechanics(): Promise<Mechanic[]> {
    const res = await api.get<any>('/api/mechanics');
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  },

  async getMechanicById(id: string): Promise<Mechanic> {
    const res = await api.get<any>(`/api/mechanics/${id}`);
    return res?.data || res;
  },

  async toggleOnlineStatus(id: string): Promise<Mechanic> {
    const res = await api.patch<any>(`/api/mechanics/${id}/toggle-online`);
    return res?.data || res;
  },

  async verifyMechanic(id: string, isVerified: boolean): Promise<Mechanic> {
    const res = await api.patch<any>(`/api/mechanics/${id}/verify`, { isVerified });
    return res?.data || res;
  },

  async registerMechanic(
    data: Omit<Mechanic, 'id' | 'rating' | 'reviewsCount' | 'distanceKm' | 'etaMinutes' | 'isVerified'>
  ): Promise<Mechanic> {
    const res = await api.post<any>('/api/mechanics', data);
    return res?.data || res;
  },
};

