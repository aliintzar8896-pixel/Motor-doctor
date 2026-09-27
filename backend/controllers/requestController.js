import ServiceRequest from '../models/ServiceRequest.js';
import Mechanic from '../models/Mechanic.js';
import { sendAdminBookingAlert } from '../services/emailService.js';

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

      // Send Admin Email Notification to Intzar Ali (aliintzar8896@gmail.com)
      const emailResult = await sendAdminBookingAlert(newRequest);

      return res.status(201).json({
        success: true,
        data: newRequest,
        emailNotification: emailResult,
        message: 'Emergency service request created successfully and admin notification sent',
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

  testEmail: async (req, res, next) => {
    try {
      const sampleReq = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        userName: req.body.userName || 'Intzar Ali (Test)',
        userPhone: req.body.userPhone || '+91 9368121012',
        vehicleNumber: req.body.vehicleNumber || 'UP 21 BK 4092',
        vehicleModel: req.body.vehicleModel || 'Hyundai Creta 1.5 SX',
        issueType: req.body.issueType || 'puncture',
        description: req.body.description || 'Test breakdown alert verification',
        locationName: req.body.locationName || 'Near TMU Campus Gate 2, Delhi Road, Moradabad',
        urgency: 'urgent',
        estimatedCost: 399,
      };
      const emailResult = await sendAdminBookingAlert(sampleReq);
      return res.json({
        success: true,
        message: 'Admin booking alert email test triggered',
        data: sampleReq,
        emailResult,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default requestController;
