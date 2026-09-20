import api from './api';
import { BillItem } from '../types';

export const billService = {
  async analyzeBill(items: BillItem[]): Promise<any> {
    const res = await api.post<any>('/api/bill/analyze', { items });
    return res?.data || res;
  },

  async requestConsultation(consultationData: {
    planId: string;
    userName: string;
    userPhone: string;
    vehicleModel?: string;
    billImage?: string;
  }): Promise<any> {
    const res = await api.post<any>('/api/bill/consultation', consultationData);
    return res?.data || res;
  },
};

