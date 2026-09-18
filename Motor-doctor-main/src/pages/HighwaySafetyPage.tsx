import React from 'react';
import { SOS_CONTACTS } from '@/lib/mockData';
import { 
  ShieldAlert, 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  MapPin, 
  Info, 
  Eye, 
  Car,
  LifeBuoy
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HighwaySafetyPage: React.FC = () => {
  const safetyProtocols = [
    {
      step: '01',
      title: 'Steer Vehicle Fully to Shoulder Lane',
      desc: 'At the first sign of tyre blowout, engine shudder, or steam, safely steer your vehicle onto the extreme left emergency shoulder lane. Never stop on the active fast/overtaking lane.',
      icon: Car
    },
    {
      step: '02',
      title: 'Activate Hazard Warning Flashers',
      desc: 'Immediately turn on your hazard lights (double indicators). If at night or during fog, keep parking lights on to make your vehicle visible to speeding high-speed highway traffic.',
      icon: AlertTriangle
    },
    {
      step: '03',
      title: 'Exit from Left Door (Away from Traffic)',
      desc: 'Never open the driver door directly into passing traffic. All passengers must exit through the left passenger doors and immediately step behind the steel crash barrier / guardrail.',
      icon: Eye
    },
    {
      step: '04',
      title: 'Place Red Warning Triangle at Distance',
      desc: 'Retrieve the reflective hazard triangle from your boot. Place it 50 meters behind your vehicle on straight highway stretches, and at least 100 meters before a blind curve.',
      icon: ShieldAlert
    },
    {
      step: '05',
      title: 'Trigger Motor Doctor Highway SOS',
      desc: 'Open Motor Doctor, click SOS Dispatch. Your exact GPS coordinates and highway milestone will be relayed to the nearest patrol mechanic within 5 km.',
      icon: LifeBuoy
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card border border-red-500/30 text-xs font-bold text-red-400 mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Roadside Safety & Highway Survival Guide</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          What To Do If Your Car Breaks Down On A Highway
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          Highway breakdowns account for severe rear-end collisions if proper safety protocols are not executed immediately. Follow these 5 crucial survival steps.
        </p>
      </div>

      {/* 5-Step Survival Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyProtocols.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.step} className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-3 relative overflow-hidden group">
              <span className="text-4xl font-black text-slate-800/80 group-hover:text-amber-500/20 transition-colors absolute top-4 right-4 pointer-events-none">
                {p.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}

        {/* SOS Action Card */}
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-amber-600 p-6 text-white flex flex-col justify-between shadow-2xl">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Emergency Action
            </span>
            <h3 className="text-xl font-black mt-3">Stranded Right Now?</h3>
            <p className="text-xs text-white/90 mt-2 leading-relaxed">
              Do not attempt hazardous DIY repairs on high-speed expressways. Request an equipped mobile mechanic with amber beacon lights.
            </p>
          </div>
          <Link
            to="/emergency"
            className="mt-6 w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs text-center shadow-lg transition-all"
          >
            DISPATCH RESCUE MECHANIC NOW
          </Link>
        </div>
      </div>

      {/* Official Indian Emergency Helplines Directory */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Emergency Toll-Free Directory
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            24/7 Roadside Assistance Numbers (India)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Save these numbers in your mobile before embarking on interstate road trips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOS_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{contact.name}</span>
                  <PhoneCall className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{contact.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xl font-black text-amber-400 font-mono">
                {contact.number}
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
