import db from '../config/db.js';

export class ServiceRequest {
  static findAll() {
    return [...db.serviceRequests];
  }

  static findById(id) {
    return db.serviceRequests.find(r => r.id === id) || null;
  }

  static findByUserId(userId) {
    return db.serviceRequests.filter(r => r.userId === userId);
  }

  static create(data) {
    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId || 'guest-user',
      userName: data.userName || 'Vehicle Owner',
      userPhone: data.userPhone || '',
      vehicleType: data.vehicleType || 'hatchback',
      vehicleModel: data.vehicleModel || 'Car',
      vehicleNumber: data.vehicleNumber || 'Unregistered',
      issueType: data.issueType || 'general',
      urgency: data.urgency || 'normal',
      description: data.description || '',
      locationName: data.locationName || 'Moradabad Highway',
      lat: data.lat || 28.8386,
      lng: data.lng || 78.7733,
      landmark: data.landmark || '',
      status: 'pending',
      mechanicId: data.mechanicId || null,
      estimatedCost: data.estimatedCost || 499,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: data.etaMinutes || 20,
      paymentMethod: data.paymentMethod || 'cash',
      paymentStatus: data.paymentStatus || 'pay_on_delivery',
      paymentRefId: data.paymentRefId || null,
      upiId: data.upiId || null,
    };
    db.serviceRequests.unshift(newRequest);
    return newRequest;
  }

  static updateStatus(id, status) {
    const request = this.findById(id);
    if (!request) return null;
    request.status = status;
    request.updatedAt = new Date().toISOString();
    return request;
  }

  static updatePayment(id, { method, status, refId }) {
    const request = this.findById(id);
    if (!request) return null;
    if (method) request.paymentMethod = method;
    if (status) request.paymentStatus = status;
    if (refId) request.paymentRefId = refId;
    request.updatedAt = new Date().toISOString();
    return request;
  }

  static cancel(id) {
    return this.updateStatus(id, 'cancelled');
  }
}

export default ServiceRequest;
