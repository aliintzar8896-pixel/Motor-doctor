import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LiveTrackingCard } from '@/components/tracking/LiveTrackingCard';
import { ServiceRequest } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  User, 
  Car, 
  Phone, 
  Mail, 
  FileText, 
  Clock, 
  CheckCircle, 
  Printer, 
  Star, 
  Plus, 
  ShieldCheck, 
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const UserDashboard: React.FC = () => {
  const { currentUser, serviceRequests, activeRequest, updateUserProfile } = useApp();
  
  const [selectedInvoice, setSelectedInvoice] = useState<ServiceRequest | null>(null);
  const [ratingModalReq, setRatingModalReq] = useState<ServiceRequest | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Editable profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [vehicleModel, setVehicleModel] = useState(currentUser.vehicleModel || 'Hyundai Creta');
  const [vehicleNumber, setVehicleNumber] = useState(currentUser.vehicleNumber || 'UP 21 BK 4092');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, vehicleModel, vehicleNumber });
    setIsEditingProfile(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your mechanic rating has been recorded.');
    setRatingModalReq(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Driver Header Profile Card */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-red-500 to-rose-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-amber-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Vehicle Owner
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.vehicleModel} ({currentUser.vehicleNumber})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        >
          {isEditingProfile ? 'Cancel Edit' : 'Edit Vehicle Details'}
        </button>
      </div>

      {/* Edit Profile Form Drawer */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-amber-500/40 space-y-4">
          <h3 className="font-bold text-white text-sm">Update Driver & Vehicle Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Vehicle Model</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={e => setVehicleModel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Vehicle License Plate</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs uppercase"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Active Breakdown Tracking (if any) */}
      {activeRequest && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-lg font-black text-white">Live Active Breakdown</h2>
          </div>
          <LiveTrackingCard 
            request={activeRequest}
            onViewInvoice={() => setSelectedInvoice(activeRequest)}
          />
        </div>
      )}

      {/* Past Service History & Invoices */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white">Roadside Service Records & Invoices</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical digital breakdown receipts with verified mechanic sign-off
            </p>
          </div>
          <span className="text-xs font-bold text-slate-300">
            {serviceRequests.length} Total Records
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {serviceRequests.map((req) => (
            <div key={req.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{req.vehicleModel}</span>
                  <span className="text-xs font-mono text-amber-400">({req.vehicleNumber})</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    req.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : req.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Issue: <strong className="capitalize">{req.issueType}</strong> • {req.description}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Mechanic: {req.mechanic?.name || 'Assigned Partner'}</span>
                  <span>•</span>
                  <span className="text-slate-200">{req.locationName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-sm font-black text-white">
                    {formatINR(req.finalCost || req.estimatedCost)}
                  </div>
                  <div className="text-[10px] text-emerald-400">GST Paid</div>
                </div>

                <button
                  onClick={() => setSelectedInvoice(req)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Invoice</span>
                </button>

                {req.status === 'completed' && (
                  <button
                    onClick={() => setRatingModalReq(req)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Rate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Invoice / Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-black">
                  MD
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">MOTOR DOCTOR</h3>
                  <p className="text-[10px] text-slate-400">Roadside Emergency Receipt & Tax Invoice</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-amber-400 font-bold">INV-{selectedInvoice.id}</div>
                <div className="text-[10px] text-slate-400">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer & Vehicle Specs */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Billed To:</span>
                <strong className="text-white">{selectedInvoice.userName}</strong>
                <p className="text-slate-400">{selectedInvoice.userPhone}</p>
                <p className="text-slate-400">{selectedInvoice.vehicleModel} - {selectedInvoice.vehicleNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Service Provider:</span>
                <strong className="text-white">{selectedInvoice.mechanic?.shopName || 'Motor Doctor Partner'}</strong>
                <p className="text-slate-400">Lead: {selectedInvoice.mechanic?.name}</p>
                <p className="text-slate-400">{selectedInvoice.locationName}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-800/80 px-4 py-2 font-bold text-slate-300 flex justify-between">
                <span>Description of Work</span>
                <span>Amount</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Emergency Highway Roadside Dispatch & Diagnostic Inspection</span>
                  <span>{formatINR((selectedInvoice.finalCost || selectedInvoice.estimatedCost) - 100)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Emergency Toll & Convenience Surcharge</span>
                  <span>₹100</span>
                </div>
              </div>
              <div className="bg-slate-800/50 px-4 py-2.5 font-black text-white flex justify-between border-t border-slate-800">
                <span>Total Amount Paid (Cash / UPI)</span>
                <span className="text-amber-400 text-sm">{formatINR(selectedInvoice.finalCost || selectedInvoice.estimatedCost)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Service verified via Client OTP: {selectedInvoice.otp}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mechanic Rating Modal */}
      {ratingModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setRatingModalReq(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="font-extrabold text-white text-base">Rate Your Highway Mechanic</h3>
            <p className="text-xs text-slate-300">
              How was your experience with <strong>{ratingModalReq.mechanic?.name}</strong> ({ratingModalReq.mechanic?.shopName})?
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-8 h-8 ${star <= ratingValue ? 'fill-current' : 'opacity-30'}`} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Feedback / Comments</label>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={e => setRatingComment(e.target.value)}
                  placeholder="e.g. Arrived in 12 minutes, very polite, fixed the tyre quickly and did not overcharge!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
