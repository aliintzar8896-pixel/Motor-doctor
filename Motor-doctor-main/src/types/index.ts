export type UserRole = 'driver' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
}

export type ServiceSpecialty = 
  | 'puncture' 
  | 'battery' 
  | 'engine' 
  | 'towing' 
  | 'brake' 
  | 'fuel' 
  | 'electrical' 
  | 'general';

export interface Mechanic {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  etaMinutes: number;
  lat: number;
  lng: number;
  address: string;
  city: string;
  services: ServiceSpecialty[];
  isAvailable: boolean;
  baseCharge: number;
  experienceYears: number;
  isVerified: boolean;
  towingAvailable: boolean;
  avatar?: string;
}

export type RequestStatus = 
  | 'pending' 
  | 'accepted' 
  | 'en_route' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type UrgencyLevel = 'normal' | 'urgent' | 'sos';

export type VehicleType = 'bike' | 'hatchback' | 'sedan' | 'suv' | 'commercial';

export type PaymentMethod = 
  | 'cash' 
  | 'upi_gpay' 
  | 'upi_phonepe' 
  | 'upi_paytm' 
  | 'upi_bhim' 
  | 'upi_qr' 
  | 'upi_id';

export type PaymentStatus = 'pending' | 'paid' | 'pay_on_delivery';

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleNumber: string;
  issueType: ServiceSpecialty;
  urgency: UrgencyLevel;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  landmark?: string;
  status: RequestStatus;
  mechanicId?: string;
  mechanic?: Mechanic;
  estimatedCost: number;
  finalCost?: number;
  otp: string;
  createdAt: string;
  updatedAt: string;
  etaMinutes?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentRefId?: string;
  upiId?: string;
}

export type Verdict = 'essential' | 'unnecessary' | 'overpriced' | 'fair';

export interface BillItem {
  id: string;
  name: string;
  category: 'Labor' | 'Part' | 'Fluid' | 'Add-on';
  quotedPrice: number;
  fairPrice: number;
  verdict: Verdict;
  reason: string;
  canDecline: boolean;
}

export interface BillAuditReport {
  id: string;
  carModel: string;
  serviceType: string;
  odometer: number;
  garageName: string;
  quotedTotal: number;
  recommendedTotal: number;
  potentialSavings: number;
  items: BillItem[];
  overallSummary: string;
  expertTips: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  mechanicId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SOSContact {
  name: string;
  number: string;
  desc: string;
  iconType: string;
}

export interface BookingNotification {
  id: string;
  type: 'emergency_breakdown' | 'bill_consultation';
  title: string;
  customerName: string;
  customerPhone: string;
  vehicleOrPlan: string;
  locationOrGarage: string;
  estimatedCost?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  timestamp: string;
  isRead: boolean;
}

