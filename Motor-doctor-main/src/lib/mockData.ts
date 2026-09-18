import { Mechanic, BillItem, SOSContact, User, ServiceRequest } from '../types';

export const INITIAL_USER_DRIVER: User = {
  id: 'usr-101',
  name: 'Intzar Ali',
  phone: '+91 9368121012',
  email: 'aliintzar8896@gmail.com',
  role: 'driver',
  vehicleModel: 'Hyundai Creta 1.5 SX',
  vehicleNumber: 'UP 21 BK 4092'
};

export const INITIAL_USER_MECHANIC: User = {
  id: 'mech-101',
  name: 'Mohammad Tariq',
  phone: '+91 98371 45820',
  email: 'tariq.motors@gmail.com',
  role: 'mechanic'
};

export const INITIAL_USER_ADMIN: User = {
  id: 'admin-001',
  name: 'TMU Fleet Admin',
  phone: '+91 94120 00112',
  email: 'admin@motordoctor.in',
  role: 'admin'
};

export const SOS_CONTACTS: SOSContact[] = [
  {
    name: 'National Highway Help',
    number: '1033',
    desc: 'NHAI 24x7 Highway Patrol & Crane Recovery',
    iconType: 'truck'
  },
  {
    name: 'Police Emergency',
    number: '112',
    desc: 'Immediate Roadside Safety & Police Response',
    iconType: 'shield'
  },
  {
    name: 'Ambulance Support',
    number: '108',
    desc: 'Medical Emergency & Trauma Response Unit',
    iconType: 'heart-pulse'
  },
  {
    name: 'Motor Doctor Hotline',
    number: '+91-9368121012',
    desc: 'Direct dispatch coordinator for stranded motorists',
    iconType: 'phone-call'
  }
];

export const INITIAL_MECHANICS: Mechanic[] = [
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
    towingAvailable: true
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
    towingAvailable: false
  },
  {
    id: 'mech-103',
    name: 'Guru Kripa Cranes & Heavy Towing',
    shopName: 'Guru Kripa Roadside Towing Service',
    phone: '+91 94112 88401',
    rating: 4.9,
    reviewsCount: 215,
    distanceKm: 4.2,
    etaMinutes: 25,
    lat: 28.8225,
    lng: 78.7891,
    address: 'Rampur Road, Transport Nagar, Moradabad',
    city: 'Moradabad',
    services: ['towing', 'engine', 'brake'],
    isAvailable: true,
    baseCharge: 799,
    experienceYears: 18,
    isVerified: true,
    towingAvailable: true
  },
  {
    id: 'mech-104',
    name: 'Vikram Singh',
    shopName: 'FastTrack Express Mechanics',
    phone: '+91 98970 33140',
    rating: 4.7,
    reviewsCount: 76,
    distanceKm: 5.6,
    etaMinutes: 30,
    lat: 28.8590,
    lng: 78.7410,
    address: 'Pakbara Toll Plaza Point, NH-9 Highway, Moradabad',
    city: 'Moradabad',
    services: ['puncture', 'battery', 'engine', 'electrical'],
    isAvailable: false,
    baseCharge: 450,
    experienceYears: 7,
    isVerified: true,
    towingAvailable: false
  },
  {
    id: 'mech-105',
    name: 'Al-Madina EFI & Auto Electrician',
    shopName: 'Al-Madina Computerized Vehicle Diagnostics',
    phone: '+91 98377 19452',
    rating: 4.8,
    reviewsCount: 110,
    distanceKm: 3.1,
    etaMinutes: 20,
    lat: 28.8310,
    lng: 78.7620,
    address: 'Kanth Road, Near Harthala Flyover, Moradabad',
    city: 'Moradabad',
    services: ['electrical', 'battery', 'engine'],
    isAvailable: true,
    baseCharge: 499,
    experienceYears: 12,
    isVerified: true,
    towingAvailable: false
  }
];

export const SAMPLE_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-9281',
    userId: 'usr-101',
    userName: 'Intzar Ali',
    userPhone: '+91 98199 12166',
    vehicleType: 'sedan',
    vehicleModel: 'Hyundai Creta 1.5 SX',
    vehicleNumber: 'UP 21 BK 4092',
    issueType: 'battery',
    urgency: 'urgent',
    description: 'Car not cranking at all after highway restaurant halt. Battery clicking sound, headlights very dim.',
    locationName: 'Delhi Road, 1.5 km before TMU Campus, Moradabad',
    lat: 28.8380,
    lng: 78.7725,
    landmark: 'Outside Sagar Ratna Restaurant',
    status: 'en_route',
    mechanicId: 'mech-101',
    mechanic: INITIAL_MECHANICS[0],
    estimatedCost: 550,
    otp: '4821',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    etaMinutes: 8
  },
  {
    id: 'REQ-8742',
    userId: 'usr-102',
    userName: 'Amit Chauhan',
    userPhone: '+91 98971 12345',
    vehicleType: 'suv',
    vehicleModel: 'Mahindra Scorpio-N',
    vehicleNumber: 'DL 8C AB 1024',
    issueType: 'puncture',
    urgency: 'normal',
    description: 'Rear right tyre blowout due to sharp iron scrap on shoulder lane. Need replacement using spare tyre.',
    locationName: 'NH-24 Pakbara Bypass, Mile Marker 138',
    lat: 28.8460,
    lng: 78.7520,
    status: 'completed',
    mechanicId: 'mech-102',
    mechanic: INITIAL_MECHANICS[1],
    estimatedCost: 350,
    finalCost: 350,
    otp: '9103',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

export const SAMPLE_BILL_ITEMS: BillItem[] = [
  {
    id: 'item-1',
    name: 'Engine Oil Replacement (Full Synthetic 5W-30)',
    category: 'Fluid',
    quotedPrice: 3800,
    fairPrice: 3400,
    verdict: 'fair',
    reason: 'Standard OEM mandatory maintenance item for petrol/diesel engines.',
    canDecline: false
  },
  {
    id: 'item-2',
    name: 'Engine Oil Flush Chemical Treatment',
    category: 'Add-on',
    quotedPrice: 1850,
    fairPrice: 0,
    verdict: 'unnecessary',
    reason: 'Frequent dealer gimmick! Modern synthetic oils already contain heavy detergent dispersants. Engine flushing can dislodge sludge and clog small oil pickup tubes in modern engines under 80,000 km.',
    canDecline: true
  },
  {
    id: 'item-3',
    name: 'AC Vent Bacteria Foam Disinfection Spray',
    category: 'Add-on',
    quotedPrice: 1450,
    fairPrice: 250,
    verdict: 'overpriced',
    reason: 'Mechanics spray a generic ₹150 aerosol can into the blower intake. You can do this at home or decline unless AC has a severe mildew smell.',
    canDecline: true
  },
  {
    id: 'item-4',
    name: 'Front Brake Caliper Greasing & Slider Pin Polish',
    category: 'Labor',
    quotedPrice: 950,
    fairPrice: 300,
    verdict: 'overpriced',
    reason: 'Standard caliper inspection is already included in wheel brake inspection labor. Charging ₹950 extra for silicone grease is heavily marked up.',
    canDecline: true
  },
  {
    id: 'item-5',
    name: 'Throttle Body Ultrasonic De-carbonizing',
    category: 'Labor',
    quotedPrice: 2200,
    fairPrice: 0,
    verdict: 'unnecessary',
    reason: 'Only required if your vehicle experiences erratic idling, RPM surging, or cold-start stalling. Not needed in routine 20k-40k km periodic service.',
    canDecline: true
  },
  {
    id: 'item-6',
    name: 'OEM Engine Oil Filter & Sump Washer',
    category: 'Part',
    quotedPrice: 420,
    fairPrice: 420,
    verdict: 'essential',
    reason: 'Critical replacement item along with oil change to prevent metal shavings from entering engine bearings.',
    canDecline: false
  },
  {
    id: 'item-7',
    name: 'Brake Rotor Disc Facing / Lathe Turning',
    category: 'Labor',
    quotedPrice: 1600,
    fairPrice: 0,
    verdict: 'unnecessary',
    reason: 'Unnecessary unless you feel noticeable steering pulsation/shuddering when applying brakes at 60+ km/h.',
    canDecline: true
  },
  {
    id: 'item-8',
    name: 'Battery Terminal Corrosion Spray & Gel',
    category: 'Add-on',
    quotedPrice: 650,
    fairPrice: 50,
    verdict: 'overpriced',
    reason: 'Vaseline or 5-rupee petroleum jelly accomplishes the exact same anti-corrosion barrier. ₹650 is pure profit margin for the dealer.',
    canDecline: true
  }
];
