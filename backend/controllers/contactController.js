import db from '../config/db.js';

export const contactController = {
  submitMessage: async (req, res, next) => {
    try {
      const { name, phone, email, subject, message } = req.body;
      if (!name || !phone || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, phone number, and message are required',
        });
      }

      const newContact = {
        id: `MSG-${Date.now()}`,
        name,
        phone,
        email: email || '',
        subject: subject || 'General Inquiry',
        message,
        createdAt: new Date().toISOString(),
      };

      db.contactMessages.push(newContact);
      return res.status(201).json({
        success: true,
        data: newContact,
        message: 'Message received! Our highway coordinator will contact you shortly.',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default contactController;
