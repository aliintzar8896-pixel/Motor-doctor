import React from 'react';
import { ServiceRequest, RequestStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Navigation, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  UserCheck, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';

interface LiveTrackingCardProps {
  request: ServiceRequest;
  onViewInvoice?: () => void;
}

export const LiveTrackingCard: React.FC<LiveTrackingCardProps> = ({ request, onViewInvoice }) => {
  const { updateRequestStatus, cancelRequest, currentRole } = useApp();

  const steps: { key: RequestStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Requested', desc: 'Alerting nearby highway mechanics' },
    { key: 'accepted', label: 'Accepted', desc: 'Mechanic assigned & preparing tools' },
    { key: 'en_route', label: 'En Route', desc: 'Mechanic driving towards your GPS location' },
    { key: 'arrived', label: 'Arrived', desc: 'Mechanic arrived at vehicle spot' },
    { key: 'in_progress', label: 'In Progress', desc: 'Repairing vehicle / diagnosing issue' },
    { key: 'completed', label: 'Completed', desc: 'Service completed & vehicle road-ready' },
  ];

  const currentStepIdx = steps.findIndex(s => s.key === request.status);
  const isCancelled = request.status === 'cancelled';
  const isCompleted = request.status === 'completed';

  const nextStepMap: { [key in RequestStatus]?: RequestStatus } = {
    pending: 'accepted',
    accepted: 'en_route',
    en_route: 'arrived',
    arrived: 'in_progress',
    in_progress: 'completed',
  };

  const handleAdvanceStep = () => {
    const next = nextStepMap[request.status];
    if (next) {
      updateRequestStatus(request.id, next);
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi ${request.mechanic?.name || 'Mechanic'}, this is ${request.userName}. Regarding my Motor Doctor breakdown request #${request.id} for ${request.vehicleModel} (${request.vehicleNumber}) at ${request.locationName}. My OTP is ${request.otp}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="rounded-3xl glass-panel border border-amber-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden relative">
      
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Request #{request.id}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 capitalize">
            {request.issueType} Assistance for {request.vehicleModel}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{request.locationName}</p>
        </div>

        {/* Security OTP Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Safety Verification OTP
            </div>
            <div className="text-2xl font-black tracking-widest text-emerald-400">
              {request.otp}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="py-8">
        <div className="relative">
          
          {/* Timeline Bar Background */}
          <div className="hidden sm:block absolute top-5 left-0 right-0 h-1 bg-slate-800" />
          
          {/* Timeline Bar Active Fill */}
          <div 
            className="hidden sm:block absolute top-5 left-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%` }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-col items-start sm:items-center text-left sm:text-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      isCurrent
                        ? 'bg-amber-500 border-white text-slate-950 shadow-lg shadow-amber-500/50 scale-110 animate-pulse'
                        : isPast
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className={`mt-2 font-bold text-xs ${isCurrent ? 'text-amber-400' : isPast ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5 leading-tight">
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assigned Mechanic Profile & Details */}
      {request.mechanic && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-white">{request.mechanic.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Assigned Expert
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{request.mechanic.shopName}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="text-amber-400 font-bold">★ {request.mechanic.rating}</span>
                <span>•</span>
                <span>{request.mechanic.experienceYears} Years Exp</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">ETA: ~{request.etaMinutes || 12} mins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${request.mechanic.phone}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Mechanic</span>
            </a>

            <button
              onClick={handleWhatsApp}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulated Next Step Button (Interactive Demo Feature) */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          Estimated Service Cost: <strong className="text-white text-sm">{formatINR(request.estimatedCost)}</strong>
          {request.finalCost && (
            <span className="ml-2 text-emerald-400 font-semibold">| Final: {formatINR(request.finalCost)}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && !isCancelled && (
            <button
              onClick={handleAdvanceStep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors"
              title="Simulate status advance for live demonstration"
            >
              <span>Simulate Next: {steps[currentStepIdx + 1]?.label || 'Complete'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isCompleted && onViewInvoice && (
            <button
              onClick={onViewInvoice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>View & Print Invoice</span>
            </button>
          )}

          {!isCompleted && !isCancelled && (
            <button
              onClick={() => cancelRequest(request.id)}
              className="px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
