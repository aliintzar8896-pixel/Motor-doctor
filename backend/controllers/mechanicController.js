import Mechanic from '../models/Mechanic.js';

export const mechanicController = {
  getAll: async (req, res, next) => {
    try {
      const mechanics = Mechanic.findAll();
      return res.json({ success: true, count: mechanics.length, data: mechanics });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const mechanic = Mechanic.findById(req.params.id);
      if (!mechanic) {
        return res.status(404).json({ success: false, message: 'Mechanic not found' });
      }
      return res.json({ success: true, data: mechanic });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const newMechanic = Mechanic.create(req.body);
      return res.status(201).json({
        success: true,
        data: newMechanic,
        message: 'Mechanic registered successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  toggleOnline: async (req, res, next) => {
    try {
      const updated = Mechanic.toggleOnline(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Mechanic not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: `Mechanic is now ${updated.isAvailable ? 'Online' : 'Offline'}`,
      });
    } catch (err) {
      next(err);
    }
  },

  verify: async (req, res, next) => {
    try {
      const { isVerified } = req.body;
      const updated = Mechanic.verify(req.params.id, isVerified !== false);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Mechanic not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: `Mechanic verification status updated to ${updated.isVerified}`,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default mechanicController;
