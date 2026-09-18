import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, PhoneCall, Share2, MapPin, Radio } from 'lucide-react';
import { soundFx } from '../../lib/audioAlert';
import { toast } from 'sonner';

interface SOSBannerProps {
  onTriggerSOS?: () => void;
}

export const SOSBanner: React.FC<SOSBannerProps> = ({ onTriggerSOS }) => {
  const { userCoords } = useApp();

  const handleShareLocation = () => {
    const mapUrl = `https://maps.google.com/?q=${userCoords.lat},${userCoords.lng}`;
    const message = `EMERGENCY ALERT: My vehicle has broken down on the highway! Need urgent roadside assistance.\nLocation: ${userCoords.address}\nMap: ${mapUrl}\nPlease help or dispatch assistance!`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    toast.success('WhatsApp location sharing opened!');
  };

  const handleSOSButton = () => {
    soundFx.playSOSSiren();
    if (onTriggerSOS) {
      onTriggerSOS();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-2 border-red-500/50 p-4 sm:p-6 shadow-2xl animate-sos-glow">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-red-600/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Emergency Status & Description */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/50 animate-bounce">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-display font-black text-white tracking-tight flex items-center gap-2">
                STRANDED ON HIGHWAY? EMERGENCY DISPATCH
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white uppercase shadow-glow-red animate-pulse">
                <Radio className="w-3 h-3" /> Live GPS Active
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                15-Min Corridor Response
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-200 mt-1.5 max-w-xl">
              Mechanics within 5 km dispatched directly to your GPS coordinates. Flat tyre, dead battery, engine failure or emergency towing.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/90 mt-2.5 font-medium flex-wrap">
              <span className="inline-flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-red-500/30">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Highway: <strong>{userCoords.address}</strong></span>
              </span>
              <a href="tel:9368121012" className="inline-flex items-center gap-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 px-2.5 py-1 rounded-lg border border-red-400/40 transition-colors font-bold">
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span>Call Intzar Ali: 9368121012</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Share Live Location via WhatsApp */}
          <button
            onClick={handleShareLocation}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 font-semibold text-xs border border-emerald-500/40 shadow-md transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share GPS on WhatsApp</span>
          </button>

          {/* Quick Call 1033 NHAI */}
          <a
            href="tel:1033"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-slate-700/80 transition-all"
            title="Dial National Highway Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>NHAI 1033</span>
          </a>

          {/* 1-Click SOS Dispatch Trigger */}
          <button
            onClick={handleSOSButton}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-95 text-white font-display font-black text-xs sm:text-sm shadow-glow-red border border-red-400/50 transition-all"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>DISPATCH MECHANIC NOW</span>
          </button>

        </div>

      </div>
    </div>
  );
};
