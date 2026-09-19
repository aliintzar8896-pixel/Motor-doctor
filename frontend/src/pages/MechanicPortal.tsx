import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ServiceSpecialty, RequestStatus } from '@/types';
import { formatINR } from '@/utils/utils';
import { soundFx } from '@/utils/audioAlert';
import { 
  Wrench, 
  Power, 
  Bell, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Star, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  Radio, 
  Car 
} from 'lucide-react';
import { toast } from 'sonner';

export const MechanicPortal: React.FC = () => {
  const { 
    currentUser, 
    mechanics, 
    serviceRequests, 
    updateRequestStatus, 
    toggleMechanicOnline, 
    registerMechanic,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'register'>('dashboard');

  // Find mechanic record corresponding to current mechanic or first one
  const myMechanicRecord = mechanics.find(m => m.id === 'mech-101') || mechanics[0];
  const isOnline = myMechanicRecord?.isAvailable ?? true;

  // Requests assigned to this mechanic or pending highway requests
  const incomingRequests = serviceRequests.filter(r => 
    r.status === 'pending' || (r.mechanicId === myMechanicRecord.id && r.status !== 'cancelled')
  );

  const activeJob = serviceRequests.find(r => 
    r.mechanicId === myMechanicRecord.id && ['accepted', 'en_route', 'arrived', 'in_progress'].includes(r.status)
  );

  // Mechanic Registration Form State
  const [shopName, setShopName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Moradabad');
  const [baseCharge, setBaseCharge] = useState(350);
  const [experienceYears, setExperienceYears] = useState(5);
  const [towingAvailable, setTowingAvailable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceSpecialty[]>([
    'puncture', 'battery', 'engine'
  ]);

  const toggleService = (svc: ServiceSpecialty) => {
    setSelectedServices(prev => 
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !leadName || !phone) return;

    registerMechanic({
      name: leadName,
      shopName,
      phone,
      lat: 28.8400 + (Math.random() * 0.02 - 0.01),
      lng: 78.7700 + (Math.random() * 0.02 - 0.01),
      address,
      city,
      services: selectedServices,
      isAvailable: true,
      baseCharge: Number(baseCharge),
      experienceYears: Number(experienceYears),
      towingAvailable
    });

    setActiveTab('dashboard');
  };

  const allServices: { key: ServiceSpecialty; label: string }[] = [
    { key: 'puncture', label: 'Tyre & Puncture' },
    { key: 'battery', label: 'Battery Jumpstart' },
    { key: 'engine', label: 'Engine & Overheating' },
    { key: 'towing', label: 'Towing & Recovery' },
    { key: 'brake', label: 'Brake / Clutch' },
    { key: 'fuel', label: 'Fuel Delivery' },
    { key: 'electrical', label: 'Electrical / EFI' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Mechanic Partner Network
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Verified Partner
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">
            {myMechanicRecord.shopName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operator: <strong className="text-slate-200">{myMechanicRecord.name}</strong> • Moradabad Highway Sector
          </p>
        </div>

        {/* Online Toggle & Persona Helper */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleMechanicOnline(myMechanicRecord.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'ONLINE (Receiving Calls)' : 'OFFLINE (Paused)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Dispatch & Jobs ({incomingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Register New Mechanic / Workshop
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-8">
          
          {/* Daily Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Today's Jobs</span>
              <div className="text-2xl font-black text-white mt-1">4 Completed</div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">100% resolution</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Daily Payout</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹2,450</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Direct UPI & Cash</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Driver Rating</span>
              <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                <span>4.9</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Based on 142 reviews</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Network Status</span>
              <div className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                <span>{isOnline ? 'Active Dispatch' : 'Unavailable'}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">NH-24 & Delhi Road</span>
            </div>
          </div>

          {/* Active Job in Progress (if any) */}
          {activeJob && (
            <div className="rounded-3xl glass-panel border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="text-lg font-black text-white">
                    Active Emergency Job: {activeJob.id}
                  </h3>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    Status: {activeJob.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  Client: <strong className="text-white">{activeJob.userName}</strong> ({activeJob.userPhone})
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Vehicle Details</div>
                  <div className="text-base font-bold text-white mt-1">{activeJob.vehicleModel}</div>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">{activeJob.vehicleNumber}</div>
                  <div className="text-xs text-slate-300 mt-2">
                    Issue: <strong className="capitalize">{activeJob.issueType}</strong>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Breakdown GPS Spot</div>
                  <div className="text-xs text-slate-200 mt-1 leading-relaxed">{activeJob.locationName}</div>
                  {activeJob.landmark && (
                    <div className="text-xs text-amber-400 mt-1">Landmark: {activeJob.landmark}</div>
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Client OTP</div>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                      {activeJob.otp}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-2">
                    Payable: <strong className="text-white text-base">{formatINR(activeJob.estimatedCost)}</strong>
                  </div>
                </div>
              </div>

              {/* Mechanic Action Progression Controls */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${activeJob.userPhone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Stranded Driver</span>
                </a>

                <div className="flex items-center gap-2">
                  {activeJob.status === 'accepted' && (
                    <button
                      onClick={() => updateRequestStatus(activeJob.id, 'en_route')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Mark "En Route to Location"
                    </button>
                  )}

                  {activeJob.status === 'en_route' && (
                    <button
                      onClick={() => updateRequestStatus(activeJob.id, 'arrived')}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                    >
                      Mark "Arrived on Spot"
                    </button>
                  )}

                  {activeJob.status === 'arrived' && (
                    <button
                      onClick={() => updateRequestStatus(activeJob.id, 'in_progress')}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Start Repair Work
                    </button>
                  )}

                  {activeJob.status === 'in_progress' && (
                    <button
                      onClick={() => updateRequestStatus(activeJob.id, 'completed')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Complete Work & Bill Driver
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Incoming Dispatch Calls Table */}
          <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-white">Emergency Request Queue</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live roadside calls within your 10 km service radius
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full">
                {incomingRequests.length} Requests Active
              </span>
            </div>

            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div 
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">
                        {req.vehicleModel} ({req.vehicleNumber})
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        req.urgency === 'sos' 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {req.urgency.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Issue: <strong className="text-white capitalize">{req.issueType}</strong> • {req.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{req.locationName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <div className="text-right">
                      <div className="text-sm font-black text-amber-400">{formatINR(req.estimatedCost)}</div>
                      <div className="text-[10px] text-slate-400">Estimated Payout</div>
                    </div>

                    {req.status === 'pending' ? (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
                      >
                        Accept Call
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold capitalize">
                        {req.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Mechanic Registration Onboarding Form */
        <div className="max-w-2xl mx-auto rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h3 className="text-xl font-black text-white">Join Motor Doctor Partner Network</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start receiving highway breakdown calls directly on your phone with zero commission!
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Workshop / Mobile Unit Name</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="e.g. Star Highway Auto Care"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lead Mechanic Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="e.g. Salim Akhtar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +91 98370 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Workshop Address & Highway Landmark</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. NH-24 Bypass, Near TMU Campus Gate 2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Base Charge (₹)</label>
                <input
                  type="number"
                  value={baseCharge}
                  onChange={e => setBaseCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Services Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Services You Can Handle On Highway
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allServices.map(s => {
                  const isChecked = selectedServices.includes(s.key);
                  return (
                    <button
                      type="button"
                      key={s.key}
                      onClick={() => toggleService(s.key)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Towing Crane Toggle */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Do you have a Towing Crane / Flatbed?</div>
                <div className="text-[11px] text-slate-400">Receive high-ticket towing recovery calls</div>
              </div>
              <input
                type="checkbox"
                checked={towingAvailable}
                onChange={e => setTowingAvailable(e.target.checked)}
                className="w-5 h-5 accent-amber-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all"
              >
                Submit Partner Registration
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
