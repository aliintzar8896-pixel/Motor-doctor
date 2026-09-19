import db from '../config/db.js';

export class Mechanic {
  static findAll() {
    return [...db.mechanics];
  }

  static findById(id) {
    return db.mechanics.find(m => m.id === id) || null;
  }

  static create(data) {
    const newMechanic = {
      id: `mech-${Date.now()}`,
      name: data.name,
      shopName: data.shopName,
      phone: data.phone,
      rating: 5.0,
      reviewsCount: 1,
      distanceKm: data.distanceKm || 2.5,
      etaMinutes: data.etaMinutes || 15,
      lat: data.lat || 28.8386,
      lng: data.lng || 78.7733,
      address: data.address,
      city: data.city || 'Moradabad',
      services: data.services || ['general'],
      isAvailable: true,
      baseCharge: data.baseCharge || 399,
      experienceYears: data.experienceYears || 5,
      isVerified: false,
      towingAvailable: !!data.towingAvailable,
    };
    db.mechanics.push(newMechanic);
    return newMechanic;
  }

  static update(id, updates) {
    const index = db.mechanics.findIndex(m => m.id === id);
    if (index === -1) return null;
    db.mechanics[index] = { ...db.mechanics[index], ...updates };
    return db.mechanics[index];
  }

  static toggleOnline(id) {
    const mechanic = this.findById(id);
    if (!mechanic) return null;
    mechanic.isAvailable = !mechanic.isAvailable;
    return mechanic;
  }

  static verify(id, isVerified) {
    const mechanic = this.findById(id);
    if (!mechanic) return null;
    mechanic.isVerified = isVerified;
    return mechanic;
  }
}

export default Mechanic;
