import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, PhoneCall, Shield, Heart, MapPin, ExternalLink, Award } from 'lucide-react';
import { SOS_CONTACTS } from '../../utils/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-20">
      
      {/* Emergency Speed Dial Strip */}
      <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border-b border-red-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span>24x7 Roadside Emergency Helplines (India):</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {SOS_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-red-600/30 text-white font-medium text-xs border border-slate-700/80 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>{c.name}:</span>
                <span className="text-amber-300 font-bold">{c.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">MOTOR DOCTOR</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's first unified Emergency Roadside Breakdown Network and Car Service Bill Doctor platform. Connecting stranded motorists with verified highway mechanics in minutes.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Academic Project Submission</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Submitted by: <strong className="text-white">Intzar Ali</strong> (BCA 5th Sem, Sec E)
              </p>
              <p className="text-[11px] text-slate-400">
                Teerthanker Mahaveer University (TMU), Moradabad
              </p>
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-1 text-[11px]">
                <a href="tel:9368121012" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors">
                  <PhoneCall className="w-3 h-3" />
                  <span>Call: +91 9368121012</span>
                </a>
                <a href="mailto:aliintzar8896@gmail.com" className="text-rose-300 hover:text-rose-200 font-medium flex items-center gap-1.5 transition-colors break-all">
                  <span>✉</span>
                  <span>aliintzar8896@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Emergency Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/emergency" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Emergency Breakdown Dispatch
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Flat Tyre & Puncture Repair
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Battery Jumpstart on Highway
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Emergency Hydraulic Towing
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Fuel Delivery & Key Lockout
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>→</span> Contact Us & 24/7 Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Bill Doctor & Second Opinion */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Bill Doctor & Protection</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/bill-doctor" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Car Service Estimate Audit
                </Link>
              </li>
              <li>
                <Link to="/bill-doctor" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Unnecessary Add-on Detector
                </Link>
              </li>
              <li>
                <Link to="/bill-doctor" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Quick Review (WhatsApp - ₹499)
                </Link>
              </li>
              <li>
                <Link to="/bill-doctor" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Expert Call Consultation (₹999)
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→</span> Roadside Safety & Survival Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner with Us */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide">Mechanic & Workshop Partners</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you an independent mechanic or garage owner? Join the Motor Doctor Partner Network to receive live highway breakdown requests and earn direct customer payments.
            </p>
            <Link
              to="/mechanic-portal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <span>Join as Partner Mechanic</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="pt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500/80" />
                <span>Coverage: NH-24, NH-9, Moradabad, Rampur & Delhi-NCR</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Motor Doctor (motordoctor.in). All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Faculty of Engineering & Computing Sciences, TMU</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-400 font-semibold text-slate-300">Contact Us</Link>
            <span>•</span>
            <Link to="/safety" className="hover:text-white">Safety Terms</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
