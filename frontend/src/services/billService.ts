import api from './api';
import { BillItem } from '../types';

export const billService = {
  async analyzeBill(items: BillItem[]): Promise<any> {
    return api.post('/api/bill/analyze', { items });
  },

  async requestConsultation(consultationData: {
    planId: string;
    userName: string;
    userPhone: string;
    vehicleModel?: string;
    billImage?: string;
  }): Promise<any> {
    return api.post('/api/bill/consultation', consultationData);
  },
};
