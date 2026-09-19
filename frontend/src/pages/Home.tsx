import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { SOSBanner } from '@/components/emergency/SOSBanner';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { MechanicCard } from '@/components/mechanic/MechanicCard';
import { EmergencyRequestModal } from '@/components/emergency/EmergencyRequestModal';
import { Mechanic, ServiceSpecialty } from '@/types';
import { 
  Wrench, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Clock, 
  MapPin, 
  Star, 
  TrendingDown, 
  PhoneCall, 
  ChevronRight, 
  BatteryCharging, 
  Disc, 
  Flame, 
  Truck, 
  Fuel, 
  Zap,
  Sparkles,
  Award,
  Mail,
  MessageCircle
} from 'lucide-react';
import { formatINR } from '@/utils/utils';

export const Home: React.FC = () => {
  const { mechanics, userCoords } = useApp();
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  const handleRequestMechanic = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setIsSOSModalOpen(true);
  };

  const serviceCategories: { type: ServiceSpecialty; title: string; desc: string; icon: any; eta: string; price: number }[] = [
    { type: 'puncture', title: 'Flat Tyre & Puncture', desc: 'On-spot tubeless puncture repair and stepney wheel change', icon: Disc, eta: '12 mins', price: 299 },
    { type: 'battery', title: 'Dead Battery Jumpstart', desc: 'Heavy-duty jumper cables & alternator voltage testing', icon: BatteryCharging, eta: '15 mins', price: 399 },
    { type: 'engine', title: 'Engine Overheating & Smoke', desc: 'Coolant refill, hose leak fix, fan belt and radiator check', icon: Flame, eta: '20 mins', price: 599 },
    { type: 'towing', title: 'Hydraulic Flatbed Towing', desc: 'Safe breakdown recovery to nearest authorized workshop', icon: Truck, eta: '25 mins', price: 899 },
    { type: 'brake', title: 'Brake & Clutch Failure', desc: 'Hydraulic fluid bleeding, master cylinder check, cable fix', icon: Wrench, eta: '20 mins', price: 499 },
    { type: 'fuel', title: 'Emergency Fuel Delivery', desc: '5-liter petrol/diesel delivered directly to highway spot', icon: Fuel, eta: '15 mins', price: 350 },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Top SOS Emergency Alert Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <SOSBanner onTriggerSOS={() => setIsSOSModalOpen(true)} />
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-glow-amber mb-6 backdrop-blur-md">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span>HIGHWAY BREAKDOWN RADAR • 15-MIN MECHANIC DISPATCH</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase">
            LIVE 24/7
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Stranded On The Road? We Send Help in <span className="bg-gradient-to-r from-amber-400 via-red-500 to-rose-500 bg-clip-text text-transparent">15 Minutes</span>.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Immediate location-based dispatch of verified mechanics for punctures, dead batteries, overheating & towing. Plus, get expert audits of inflated car service bills to <strong className="text-white">save up to ₹5,000</strong>.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => { setSelectedMechanic(null); setIsSOSModalOpen(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-display font-black text-base shadow-glow-red transform hover:scale-105 active:scale-95 transition-all border border-red-400/40"
          >
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <span>EMERGENCY DISPATCH NOW</span>
          </button>

          <Link
            to="/bill-doctor"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass-card hover:bg-slate-800/80 text-white font-extrabold text-sm border border-slate-700 hover:border-amber-500/50 shadow-lg transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Audit Car Service Bill</span>
          </Link>
        </div>

        {/* Quick Issue Selector Tags Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">Quick Tags:</span>
          {[
            { label: '🛞 Flat Tyre / Puncture', price: '₹299', style: 'tech-tag-amber' },
            { label: '🔋 Dead Battery Jumpstart', price: '₹399', style: 'tech-tag-red' },
            { label: '🔥 Engine Overheating', price: '₹599', style: 'tech-tag-blue' },
            { label: '🚚 Hydraulic Towing', price: '₹899', style: 'tech-tag-emerald' },
            { label: '⛽ Fuel Delivery', price: '₹350', style: 'tech-tag-amber' },
            { label: '🧾 Audit Car Bill', path: '/bill-doctor', price: 'Save ₹5,000', style: 'tech-tag-emerald' },
          ].map((tag, idx) => (
            tag.path ? (
              <Link
                key={idx}
                to={tag.path}
                className={`tech-tag ${tag.style} cursor-pointer hover:shadow-lg`}
              >
                <span>{tag.label}</span>
                <span className="text-[10px] font-extrabold opacity-90 ml-0.5">({tag.price})</span>
              </Link>
            ) : (
              <button
                key={idx}
                type="button"
                onClick={() => { setSelectedMechanic(null); setIsSOSModalOpen(true); }}
                className={`tech-tag ${tag.style} cursor-pointer hover:shadow-lg`}
              >
                <span>{tag.label}</span>
                <span className="text-[10px] font-extrabold opacity-90 ml-0.5">({tag.price})</span>
              </button>
            )
          ))}
        </div>

        {/* Modern Interactive Stat Cards */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-white">
              15 <span className="text-sm font-normal text-slate-400">Mins</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span>●</span> Highway corridor dispatch
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mechanics</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-white">
              100% <span className="text-sm font-normal text-slate-400">Verified</span>
            </div>
            <p className="mt-1 text-[11px] text-blue-400 font-medium flex items-center gap-1">
              <span>✓</span> Tool & KYC authenticated
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bill Doctor</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-amber-400">
              ₹4,200+ <span className="text-sm font-normal text-slate-400">Saved</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1">
              <span>★</span> Unnecessary add-on filter
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Hotline</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-display font-black text-white">
              9368121012
            </div>
            <a href="tel:9368121012" className="mt-1 text-[11px] text-red-400 font-medium hover:underline flex items-center gap-1">
              <span>●</span> 24x7 Emergency Call
            </a>
          </div>
        </div>
      </section>

      {/* Live Map & Emergency Mechanics Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Real-Time Highway Radar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Verified Mechanics Near Your Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active GPS tracking around <strong className="text-slate-200">{userCoords.address}</strong>
            </p>
          </div>

          <Link
            to="/emergency"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Open Full Dispatch Center</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Map Component */}
        <EmergencyMap 
          mechanics={mechanics}
          onRequestHelp={handleRequestMechanic}
          height="460px"
        />

        {/* Nearby Mechanics List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mechanics.slice(0, 3).map((mech) => (
            <MechanicCard 
              key={mech.id} 
              mechanic={mech} 
              onRequestHelp={handleRequestMechanic} 
            />
          ))}
        </div>
      </section>

      {/* Emergency Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            24/7 Roadside Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            What Can We Help You With Right Now?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Select your vehicle issue for instant upfront pricing and automatic mechanic assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((svc) => {
            const Icon = svc.icon;
            const colorGradients: Record<string, string> = {
              puncture: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400',
              battery: 'from-red-500/20 to-rose-500/20 border-red-500/40 text-red-400',
              engine: 'from-orange-500/20 to-red-500/20 border-orange-500/40 text-orange-400',
              towing: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
              brake: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400',
              fuel: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400',
            };

            const grad = colorGradients[svc.type] || 'from-amber-500/20 to-red-500/20 border-amber-500/40 text-amber-400';

            return (
              <div 
                key={svc.type}
                onClick={() => { setSelectedMechanic(null); setIsSOSModalOpen(true); }}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-700/80 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-13 h-13 p-3 rounded-2xl bg-gradient-to-br ${grad} border shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      From {formatINR(svc.price)}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-white text-lg mt-4 group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>{svc.title}</span>
                    <span className="text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA: {svc.eta}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                    Dispatch Now →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Car Service Bill Doctor Section (Feature Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel border border-amber-500/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Overcharge Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
                Don't Pay for Dealer Add-ons You Never Needed!
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Dealers frequently tack on <strong>Engine Flushes, AC Sanitization Foam, Throttle Body Polish</strong>, and overpriced labor. Upload or type your car service estimate and get an instant second opinion before authorizing work.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Identifies unnecessary add-ons that void nothing when declined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Compares parts & fluid costs against actual OEM fair market MRP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Average savings of ₹3,000 to ₹5,500 per scheduled service</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/bill-doctor"
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all"
                >
                  Try Free Bill Analyzer →
                </Link>
                <a
                  href="tel:+919368121012"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-card text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call Master Mechanic (+91 9368121012)</span>
                </a>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400">Sample Dealership Audit</span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  ₹6,950 Saved
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300 font-medium">Engine Oil Flush Treatment</span>
                  <span className="text-red-400 font-bold line-through">₹1,850</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <span className="text-amber-300 font-medium">AC Duct Sanitizer Spray</span>
                  <span className="text-amber-400 font-bold">₹1,450 → ₹250</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300 font-medium">Throttle Body Polish</span>
                  <span className="text-red-400 font-bold line-through">₹2,200</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-300 font-medium">OEM Synthetic Oil & Filter</span>
                  <span className="text-emerald-400 font-bold">₹4,220 (Essential)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Original Quote: <strong className="text-white">₹13,770</strong></span>
                <span className="text-emerald-400 font-bold">Approved: <strong>₹6,820</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Contact Us & Developer Support Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Need Instant Help or Have Questions?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Contact Motor Doctor & Intzar Ali Directly
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Have a highway breakdown query, want an immediate service bill audit, or want to connect with the developer? We are reachable 24/7 via Call, WhatsApp, and Email.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:9368121012"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call: +91 9368121012</span>
              </a>

              <a
                href="https://wa.me/919368121012?text=Hello%20Intzar%2C%20I%20contacted%20you%20from%20Motor%20Doctor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <Link
                to="/contact"
                className="flex items-center gap-2 px-4 py-3 rounded-xl glass-card hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Contact Page →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Request Modal */}
      <EmergencyRequestModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        preselectedMechanic={selectedMechanic}
      />

    </div>
  );
};
