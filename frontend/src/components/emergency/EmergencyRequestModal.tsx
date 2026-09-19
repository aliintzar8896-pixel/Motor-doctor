import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  VehicleType, 
  ServiceSpecialty, 
  UrgencyLevel, 
  Mechanic,
  PaymentMethod,
  PaymentStatus
} from '../../types';
import { PaymentMethodSelector } from '../payment/PaymentMethodSelector';
import { 
  X, 
  AlertTriangle, 
  Car, 
  Bike, 
  Truck, 
  Wrench, 
  BatteryCharging, 
  Flame, 
  Disc, 
  Fuel, 
  Zap, 
  MapPin, 
  Check, 
  ShieldAlert, 
  Radio
} from 'lucide-react';
import { formatINR } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMechanic?: Mechanic | null;
}

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedMechanic
}) => {
  const { currentUser, userCoords, createRequest, mechanics } = useApp();
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [vehicleModel, setVehicleModel] = useState(currentUser.vehicleModel || 'Hyundai Creta');
  const [vehicleNumber, setVehicleNumber] = useState(currentUser.vehicleNumber || 'UP 21 BK 4092');
  const [issueType, setIssueType] = useState<ServiceSpecialty>('battery');
  const [urgency, setUrgency] = useState<UrgencyLevel>('urgent');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locationName, setLocationName] = useState(userCoords.address);
  const [selectedMechId, setSelectedMechId] = useState<string>(preselectedMechanic?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pay_on_delivery');
  const [paymentRefId, setPaymentRefId] = useState<string | undefined>();
  const [upiId, setUpiId] = useState<string | undefined>();

  if (!isOpen) return null;

  const vehicleOptions: { type: VehicleType; label: string; icon: any }[] = [
    { type: 'bike', label: 'Bike / Scooter', icon: Bike },
    { type: 'hatchback', label: 'Hatchback', icon: Car },
    { type: 'sedan', label: 'Sedan', icon: Car },
    { type: 'suv', label: 'SUV / MUV', icon: Car },
    { type: 'commercial', label: 'Commercial / Truck', icon: Truck },
  ];

  const issueOptions: { type: ServiceSpecialty; label: string; icon: any; baseCost: number }[] = [
    { type: 'battery', label: 'Dead Battery / Jumpstart', icon: BatteryCharging, baseCost: 399 },
    { type: 'puncture', label: 'Flat Tyre / Puncture', icon: Disc, baseCost: 299 },
    { type: 'engine', label: 'Engine Overheating / Smoke', icon: Flame, baseCost: 599 },
    { type: 'towing', label: 'Crane / Towing Recovery', icon: Truck, baseCost: 899 },
    { type: 'brake', label: 'Brake / Clutch Failure', icon: Wrench, baseCost: 499 },
    { type: 'fuel', label: 'Empty Fuel / Wrong Fuel', icon: Fuel, baseCost: 350 },
    { type: 'electrical', label: 'Electrical / Key Lockout', icon: Zap, baseCost: 450 },
  ];

  const currentIssueObj = issueOptions.find(i => i.type === issueType) || issueOptions[0];
  const targetMechanic = mechanics.find(m => m.id === selectedMechId) || preselectedMechanic;
  const estimatedCost = (targetMechanic ? targetMechanic.baseCharge : currentIssueObj.baseCost) + 
    (urgency === 'sos' ? 200 : urgency === 'urgent' ? 100 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createRequest({
      vehicleType,
      vehicleModel,
      vehicleNumber,
      issueType,
      urgency,
      description: description || `Emergency ${currentIssueObj.label} on highway roadside.`,
      locationName,
      landmark,
      preferredMechanicId: selectedMechId || undefined,
      paymentMethod,
      paymentStatus,
      paymentRefId,
      upiId
    });

    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl glass-panel border border-red-500/40 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Instant Roadside Breakdown Dispatch
            </h3>
            <p className="text-xs text-slate-400">
              Direct connection to certified mechanics stationed within 5 km on highway
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Urgency Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'normal', label: 'Normal Breakdown', desc: 'Parked in safe bay', color: 'border-slate-700' },
                { id: 'urgent', label: 'Urgent Roadside', desc: 'Highway shoulder', color: 'border-amber-500/50 text-amber-400' },
                { id: 'sos', label: 'Critical SOS', desc: 'Dark / remote area', color: 'border-red-500 text-red-400 animate-pulse' },
              ].map(u => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => setUrgency(u.id as UrgencyLevel)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    urgency === u.id
                      ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{u.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{u.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {vehicleOptions.map(v => {
                const Icon = v.icon;
                const isSelected = vehicleType === v.type;
                return (
                  <button
                    type="button"
                    key={v.type}
                    onClick={() => setVehicleType(v.type)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Model & Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Vehicle Make & Model
              </label>
              <input
                type="text"
                required
                value={vehicleModel}
                onChange={e => setVehicleModel(e.target.value)}
                placeholder="e.g. Hyundai Creta / Swift / Royal Enfield"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Vehicle Plate Number
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="e.g. UP 21 BK 4092"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 uppercase tracking-wider"
              />
            </div>
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Issue / Service Needed
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {issueOptions.map(i => {
                const Icon = i.icon;
                const isSelected = issueType === i.type;
                return (
                  <button
                    type="button"
                    key={i.type}
                    onClick={() => setIssueType(i.type)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs">{i.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal">from {formatINR(i.baseCost)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Breakdown Location & Landmark */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Breakdown Location (GPS)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">● GPS Active</span>
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="Street address, highway milestone, or GPS coordinates"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="Nearby Landmark (e.g. Opposite HP Petrol Pump / Mile Marker 142)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Choose Address / Highway Landmark presets */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Quick Choose Address (Highway Hubs):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'TMU Campus Gate 2', address: 'Near TMU Campus Gate 2, Delhi Road, Moradabad', landmark: 'Opposite Main Gate 2' },
                  { label: 'Pakbara Toll Plaza', address: 'Pakbara Toll Plaza Point, NH-9 Highway, Moradabad', landmark: 'Toll Barrier NH-9' },
                  { label: 'NH-24 Bypass Point', address: 'NH-24 Bypass, Opposite Indian Oil Petrol Pump, Moradabad', landmark: 'Opposite Indian Oil Pump' },
                  { label: 'Harthala Flyover', address: 'Kanth Road, Near Harthala Flyover, Moradabad', landmark: 'Under Flyover Crossing' },
                  { label: 'Transport Nagar', address: 'Rampur Road, Transport Nagar, Moradabad', landmark: 'Near Commercial Truck Terminal' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setLocationName(item.address);
                      setLandmark(item.landmark);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 transition-colors"
                  >
                    📍 {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specific Symptoms (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Clicking noise when starting, smoke from bonnet, right rear tyre completely flat..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Payment Mode Selection (Cash on Delivery / All UPI) */}
          <div className="pt-2 border-t border-slate-800">
            <PaymentMethodSelector
              amount={estimatedCost}
              selectedMethod={paymentMethod}
              paymentStatus={paymentStatus}
              onChange={(method, status, refId, customUpi) => {
                setPaymentMethod(method);
                setPaymentStatus(status);
                if (refId) setPaymentRefId(refId);
                if (customUpi) setUpiId(customUpi);
              }}
              showSimulatePay={true}
            />
          </div>

          {/* Price Estimate & Dispatch CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Estimated Upfront Cost</div>
              <div className="text-2xl font-black text-amber-400">
                {formatINR(estimatedCost)}
                <span className="text-xs font-normal text-slate-400 ml-2">(Includes visiting & diagnosis)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>DISPATCH MECHANIC NOW</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
