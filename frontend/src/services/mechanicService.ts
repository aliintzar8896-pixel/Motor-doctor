import api from './api';
import { Mechanic } from '../types';

export const mechanicService = {
  async getAllMechanics(): Promise<Mechanic[]> {
    return api.get('/api/mechanics');
  },

  async getMechanicById(id: string): Promise<Mechanic> {
    return api.get(`/api/mechanics/${id}`);
  },

  async toggleOnlineStatus(id: string): Promise<Mechanic> {
    return api.patch(`/api/mechanics/${id}/toggle-online`);
  },

  async verifyMechanic(id: string, isVerified: boolean): Promise<Mechanic> {
    return api.patch(`/api/mechanics/${id}/verify`, { isVerified });
  },

  async registerMechanic(
    data: Omit<Mechanic, 'id' | 'rating' | 'reviewsCount' | 'distanceKm' | 'etaMinutes' | 'isVerified'>
  ): Promise<Mechanic> {
    return api.post('/api/mechanics', data);
  },
};
