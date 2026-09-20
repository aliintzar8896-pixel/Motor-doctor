import api from './api';
import { ServiceRequest, RequestStatus, PaymentMethod, PaymentStatus } from '../types';

export const requestService = {
  async getRequests(): Promise<ServiceRequest[]> {
    const res = await api.get<any>('/api/requests');
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  },

  async getRequestById(id: string): Promise<ServiceRequest> {
    const res = await api.get<any>(`/api/requests/${id}`);
    return res?.data || res;
  },

  async createRequest(requestData: any): Promise<ServiceRequest> {
    const res = await api.post<any>('/api/requests', requestData);
    return res?.data || res;
  },

  async updateStatus(id: string, status: RequestStatus): Promise<ServiceRequest> {
    const res = await api.patch<any>(`/api/requests/${id}/status`, { status });
    return res?.data || res;
  },

  async updatePayment(
    id: string,
    method: PaymentMethod,
    status: PaymentStatus,
    refId?: string
  ): Promise<ServiceRequest> {
    const res = await api.patch<any>(`/api/requests/${id}/payment`, { method, status, refId });
    return res?.data || res;
  },

  async cancelRequest(id: string): Promise<ServiceRequest> {
    const res = await api.delete<any>(`/api/requests/${id}`);
    return res?.data || res;
  },
};

