/**
 * Motor Doctor Database Connection & In-Memory Store
 * Provides persistent-like in-memory data store with hooks for MongoDB/PostgreSQL
 */

import config from './env.js';

export const db = {
  users: [
    {
      id: 'usr-101',
      name: 'Intzar Ali',
      phone: '+91 9368121012',
      email: 'aliintzar8896@gmail.com',
      role: 'driver',
      vehicleModel: 'Hyundai Creta 1.5 SX',
      vehicleNumber: 'UP 21 BK 4092',
    },
    {
      id: 'mech-101',
      name: 'Mohammad Tariq',
      phone: '+91 98371 45820',
      email: 'tariq.motors@gmail.com',
      role: 'mechanic',
    },
    {
      id: 'admin-001',
      name: 'TMU Fleet Admin',
      phone: '+91 94120 00112',
      email: 'admin@motordoctor.in',
      role: 'admin',
    },
  ],

  mechanics: [
    {
      id: 'mech-101',
      name: 'Mohammad Tariq',
      shopName: 'Tariq Auto Care & 24x7 Recovery',
      phone: '+91 98371 45820',
      rating: 4.9,
      reviewsCount: 142,
      distanceKm: 1.4,
      etaMinutes: 12,
      lat: 28.8386,
      lng: 78.7733,
      address: 'Near TMU Campus Gate 2, Delhi Road, Moradabad',
      city: 'Moradabad',
      services: ['puncture', 'battery', 'engine', 'towing', 'brake', 'fuel'],
      isAvailable: true,
      baseCharge: 399,
      experienceYears: 14,
      isVerified: true,
      towingAvailable: true,
    },
    {
      id: 'mech-102',
      name: 'Rajesh Sharma',
      shopName: 'Sharma Highway Mobile Tyre & Battery',
      phone: '+91 97190 62118',
      rating: 4.8,
      reviewsCount: 98,
      distanceKm: 2.8,
      etaMinutes: 18,
      lat: 28.8452,
      lng: 78.7561,
      address: 'NH-24 Bypass, Opposite Indian Oil Petrol Pump, Moradabad',
      city: 'Moradabad',
      services: ['puncture', 'battery', 'electrical', 'fuel'],
      isAvailable: true,
      baseCharge: 349,
      experienceYears: 9,
      isVerified: true,
      towingAvailable: false,
    },
    {
      id: 'mech-103',
      name: 'Guru Kripa Cranes & Heavy Towing',
      shopName: 'Guru Kripa Roadside Towing Service',
      phone: '+91 94122 88410',
      rating: 4.95,
      reviewsCount: 210,
      distanceKm: 3.5,
      etaMinutes: 22,
      lat: 28.829,
      lng: 78.7901,
      address: 'Pakbara Toll Plaza Approach, Delhi-Lucknow Highway, Moradabad',
      city: 'Moradabad',
      services: ['towing', 'engine', 'brake'],
      isAvailable: true,
      baseCharge: 799,
      experienceYears: 18,
      isVerified: true,
      towingAvailable: true,
    },
    {
      id: 'mech-104',
      name: 'Amit Verma',
      shopName: 'Verma Speed Car & Bike Service',
      phone: '+91 98970 33119',
      rating: 4.7,
      reviewsCount: 76,
      distanceKm: 4.1,
      etaMinutes: 25,
      lat: 28.851,
      lng: 78.742,
      address: 'Near Moradabad Railway Overbridge, Rampur Road',
      city: 'Moradabad',
      services: ['puncture', 'battery', 'electrical', 'general', 'brake'],
      isAvailable: true,
      baseCharge: 299,
      experienceYears: 7,
      isVerified: true,
      towingAvailable: false,
    },
  ],

  serviceRequests: [
    {
      id: 'REQ-1082',
      userId: 'usr-101',
      userName: 'Intzar Ali',
      userPhone: '+91 9368121012',
      vehicleType: 'suv',
      vehicleModel: 'Hyundai Creta 1.5 SX',
      vehicleNumber: 'UP 21 BK 4092',
      issueType: 'puncture',
      urgency: 'urgent',
      description: 'Right rear tyre completely flat on highway shoulder near TMU Gate 1.',
      locationName: 'Near TMU Gate 1, Delhi Road, Moradabad',
      lat: 28.8392,
      lng: 78.7725,
      status: 'in_progress',
      mechanicId: 'mech-101',
      estimatedCost: 450,
      otp: '4821',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      etaMinutes: 7,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      paymentRefId: 'UPI-TXN-984210',
    },
  ],

  contactMessages: [],

  consultations: [],
};

export async function connectDB() {
  if (config.DATABASE_URL) {
    console.log(`📡 Database URL provided: Connecting to external database...`);
    // Connect to external DB if configured
  } else {
    console.log('📦 Using in-memory persistent store (seeded with Motor Doctor sample data)');
  }
}

export default db;
