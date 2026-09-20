import api from './api';

export const contactService = {
  async submitMessage(contactData: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }): Promise<any> {
    const res = await api.post<any>('/api/contact', contactData);
    return res?.data || res;
  },
};

