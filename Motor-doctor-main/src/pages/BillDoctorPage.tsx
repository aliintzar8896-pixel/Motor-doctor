import React, { useState } from 'react';
import { BillAnalyzer } from '@/components/bill-doctor/BillAnalyzer';
import { ConsultationModal } from '@/components/bill-doctor/ConsultationModal';
import { 
  FileSearch, 
  ShieldCheck, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  PhoneCall, 
  Sparkles 
} from 'lucide-react';

export const BillDoctorPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  const handleBook = (plan: string) => {
    setSelectedPlan(plan);
    setIsConsultModalOpen(true);
  };

  const dealerScams = [
    {
      title: 'Engine Oil Flush Chemical Treatment',
      cost: '₹1,500 - ₹2,500',
      reality: 'Modern synthetic oils have strong built-in detergents. Chemical engine flushes can dislodge carbon chunks that clog the oil pump strainer, causing catastrophic oil starvation.',
      verdict: 'DECLINE (Safe to skip under 1,00,000 km)'
    },
    {
      title: 'AC Duct Ozone / Foam Sanitization',
      cost: '₹1,200 - ₹1,800',
      reality: 'Mechanics spray a generic 150-rupee aerosol through the front passenger blower. Does not clean clogged cabin air filters. Pure profit margin for the service center.',
      verdict: 'DECLINE (Replace cabin filter for ₹300 instead)'
    },
    {
      title: 'Throttle Body & Injector Ultrasonic Polish',
      cost: '₹1,800 - ₹3,000',
      reality: 'Dealerships recommend this routinely every 10k-20k km. Unless your car has rough idling or sudden stalling, throttle butterfly valves do not need frequent cleaning.',
      verdict: 'DECLINE (Only do if engine surges/misfires)'
    },
    {
      title: 'Brake Caliper Pin Lubrication / Dressing',
      cost: '₹800 - ₹1,200',
      reality: 'Basic slider pin inspection is legally part of periodic brake cleaning labor. Charging extra labor for silicone grease application is double-billing.',
      verdict: 'CHALLENGE / DECLINE'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Page Hero */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-glow-emerald mb-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>INDIA'S #1 CAR SERVICE OVERCHARGE AUDITOR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
          Get Expert Review of Your Car Service Bill & <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Save Big</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          Avoid unnecessary car repairs and inflated dealer margins. Share your service estimate, and our expert master mechanics will review and advise what truly needs fixing. Save up to <strong className="text-white">₹5,000 per periodic service</strong>.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="tech-tag tech-tag-emerald">⚡ 10-Second Instant Audit</span>
          <span className="tech-tag tech-tag-amber">🛡️ No Unnecessary Add-ons</span>
          <span className="tech-tag tech-tag-blue">👨‍🔧 Master Mechanic Second Opinion</span>
        </div>
      </div>

      {/* Interactive Bill Analyzer Component */}
      <BillAnalyzer onBookConsultation={handleBook} />

      {/* Exposed Dealer Add-ons Section */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Consumer Education & Transparency
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Top 4 Dealership Add-on Scams Exposed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            These 4 line items account for over 65% of unnecessary billing on modern Indian cars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dealerScams.map((scam, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-extrabold text-white text-sm sm:text-base">{scam.title}</h4>
                <span className="text-xs font-bold text-amber-400 shrink-0">{scam.cost}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scam.reality}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-black text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Verdict: {scam.verdict}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        planName={selectedPlan}
      />

    </div>
  );
};
