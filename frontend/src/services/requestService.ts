import api from './api';
import { ServiceRequest, RequestStatus, PaymentMethod, PaymentStatus } from '../types';

export const requestService = {
  async getRequests(): Promise<ServiceRequest[]> {
    return api.get('/api/requests');
  },

  async getRequestById(id: string): Promise<ServiceRequest> {
    return api.get(`/api/requests/${id}`);
  },

  async createRequest(requestData: any): Promise<ServiceRequest> {
    return api.post('/api/requests', requestData);
  },

  async updateStatus(id: string, status: RequestStatus): Promise<ServiceRequest> {
    return api.patch(`/api/requests/${id}/status`, { status });
  },

  async updatePayment(
    id: string,
    method: PaymentMethod,
    status: PaymentStatus,
    refId?: string
  ): Promise<ServiceRequest> {
    return api.patch(`/api/requests/${id}/payment`, { method, status, refId });
  },

  async cancelRequest(id: string): Promise<ServiceRequest> {
    return api.delete(`/api/requests/${id}`);
  },
};
