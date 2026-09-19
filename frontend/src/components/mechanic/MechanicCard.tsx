import React from 'react';
import { Mechanic, ServiceSpecialty } from '../../types';
import { 
  Star, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  BatteryCharging, 
  Disc, 
  Fuel, 
  Zap, 
  MessageSquare 
} from 'lucide-react';
import { formatINR } from '../../utils/utils';

interface MechanicCardProps {
  mechanic: Mechanic;
  onRequestHelp?: (mechanic: Mechanic) => void;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({ mechanic, onRequestHelp }) => {
  const serviceIcons: { [key in ServiceSpecialty]?: { label: string; icon: any } } = {
    puncture: { label: 'Tyre & Puncture', icon: Disc },
    battery: { label: 'Battery Jumpstart', icon: BatteryCharging },
    engine: { label: 'Engine Repair', icon: Wrench },
    towing: { label: 'Towing & Recovery', icon: Truck },
    brake: { label: 'Brake Service', icon: Disc },
    fuel: { label: 'Fuel Assist', icon: Fuel },
    electrical: { label: 'Electrical / EFI', icon: Zap },
  };

  const handleWhatsApp = () => {
    const text = `Hello ${mechanic.name} (${mechanic.shopName}), I need emergency roadside assistance via Motor Doctor. Are you available?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 border border-slate-700/80 flex flex-col justify-between relative group">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-slate-800 flex items-center justify-center text-white text-base font-bold shadow-md">
              <Wrench className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                  {mechanic.shopName}
                </h4>
                {mechanic.isVerified && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <ShieldCheck className="w-3 h-3 text-blue-400" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Lead: <strong className="text-white">{mechanic.name}</strong> • {mechanic.experienceYears} Yrs Experience
              </p>
            </div>
          </div>

          {/* Online Availability Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border shrink-0 bg-slate-950/80">
            <span className={`w-2 h-2 rounded-full ${mechanic.isAvailable ? 'bg-emerald-400 shadow-glow-emerald animate-pulse' : 'bg-slate-500'}`} />
            <span className={mechanic.isAvailable ? 'text-emerald-400' : 'text-slate-400'}>
              {mechanic.isAvailable ? 'DISPATCH READY' : 'ON JOB'}
            </span>
          </div>
        </div>

        {/* Distance, ETA, Ratings bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 py-2.5 px-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{mechanic.rating}</span>
            <span className="text-slate-400 font-normal">({mechanic.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span><strong>{mechanic.distanceKm} km</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>~{mechanic.etaMinutes} mins</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-400 mt-2.5 flex items-start gap-1.5">
          <span className="truncate">{mechanic.address}</span>
        </p>

        {/* Services Badges */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {mechanic.services.map(svc => {
            const info = serviceIcons[svc];
            if (!info) return null;
            return (
              <span
                key={svc}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-200 border border-slate-700/80 flex items-center gap-1 hover:border-amber-500/40 transition-colors"
              >
                <info.icon className="w-3 h-3 text-amber-400" />
                <span>{info.label}</span>
              </span>
            );
          })}
          {mechanic.towingAvailable && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1 shadow-sm shadow-red-500/20">
              <Truck className="w-3 h-3 text-red-400" />
              <span>Hydraulic Towing</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Pricing & Action CTAs */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Inspection Visit</span>
          <div className="text-lg font-black text-amber-400">
            {formatINR(mechanic.baseCharge)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${mechanic.phone}`}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-500 transition-colors"
            title="Direct Phone Call"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </a>

          <button
            onClick={handleWhatsApp}
            className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
            title="Direct WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            disabled={!mechanic.isAvailable}
            onClick={() => onRequestHelp && onRequestHelp(mechanic)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${
              mechanic.isAvailable
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Request Help</span>
          </button>
        </div>
      </div>

    </div>
  );
};
