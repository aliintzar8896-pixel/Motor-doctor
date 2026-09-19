import api from './api';

export const contactService = {
  async submitMessage(contactData: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }): Promise<any> {
    return api.post('/api/contact', contactData);
  },
};
