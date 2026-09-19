import BillItem from '../models/BillItem.js';
import db from '../config/db.js';

export const billController = {
  analyze: async (req, res, next) => {
    try {
      const { items } = req.body;
      const analysis = BillItem.analyze(items || []);
      return res.json({
        success: true,
        data: analysis,
        message: 'Bill analyzed successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  createConsultation: async (req, res, next) => {
    try {
      const consultation = {
        id: `CONS-${Date.now()}`,
        ...req.body,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      db.consultations.push(consultation);
      return res.status(201).json({
        success: true,
        data: consultation,
        message: 'Consultation booked successfully with expert mechanic',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default billController;
