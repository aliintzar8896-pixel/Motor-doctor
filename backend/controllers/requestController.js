import ServiceRequest from '../models/ServiceRequest.js';
import Mechanic from '../models/Mechanic.js';

export const requestController = {
  getAll: async (req, res, next) => {
    try {
      const requests = ServiceRequest.findAll();
      return res.json({ success: true, count: requests.length, data: requests });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const request = ServiceRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const data = req.body;
      // Resolve mechanic if requested
      if (!data.mechanicId && data.issueType) {
        const available = Mechanic.findAll().find(m => m.isAvailable && m.services.includes(data.issueType));
        if (available) {
          data.mechanicId = available.id;
          data.estimatedCost = available.baseCharge + 150;
        }
      }

      const newRequest = ServiceRequest.create(data);
      return res.status(201).json({
        success: true,
        data: newRequest,
        message: 'Emergency service request created successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const updated = ServiceRequest.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: `Request status updated to ${status}`,
      });
    } catch (err) {
      next(err);
    }
  },

  updatePayment: async (req, res, next) => {
    try {
      const { method, status, refId } = req.body;
      const updated = ServiceRequest.updatePayment(req.params.id, { method, status, refId });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: 'Payment details updated successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  cancel: async (req, res, next) => {
    try {
      const updated = ServiceRequest.cancel(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: 'Service request cancelled',
      });
    } catch (err) {
      next(err);
    }
  },
};

export default requestController;
