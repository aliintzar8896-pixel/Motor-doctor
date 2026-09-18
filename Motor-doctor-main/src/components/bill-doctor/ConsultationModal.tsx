import React, { useState } from 'react';
import { X, CheckCircle, PhoneCall, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { soundFx } from '../../lib/audioAlert';
import { PaymentMethodSelector } from '../payment/PaymentMethodSelector';
import { PaymentMethod, PaymentStatus } from '../../types';

import { useApp } from '../../context/AppContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  planName
}) => {
  const { addBookingNotification } = useApp();
  const [name, setName] = useState('Intzar Ali');
  const [phone, setPhone] = useState('+91 9368121012');
  const [carDetails, setCarDetails] = useState('Hyundai Creta (30,000 km Service)');
  const [garageName, setGarageName] = useState('Authorized Service Center');
  const [billImageUploaded, setBillImageUploaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi_phonepe');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [paymentRefId, setPaymentRefId] = useState<string | undefined>();
  const [upiId, setUpiId] = useState<string | undefined>();

  if (!isOpen) return null;

  const planAmount = planName.includes('499') ? 499 : planName.includes('999') ? 999 : 1499;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    soundFx.playSuccessTone();

    // Dispatch real-time booking notification to platform owner & notification center
    addBookingNotification({
      type: 'bill_consultation',
      title: `Bill Doctor Audit: ${planName}`,
      customerName: name || 'Vehicle Owner',
      customerPhone: phone || '+91 9368121012',
      vehicleOrPlan: `${planName} • ${carDetails}`,
      locationOrGarage: garageName || 'Service Center',
      estimatedCost: planAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pay_on_delivery' : (paymentStatus === 'paid' ? 'paid' : 'pending')
    });

    toast.success(`Booking confirmed for ${planName}! Notification dispatched to Intzar Ali.`);
    setTimeout(() => {
      setPaymentSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentSuccess ? (
          <div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Motor Doctor Consultation
                </span>
                <h3 className="text-lg font-black text-white">{planName}</h3>
              </div>
            </div>

            <form onSubmit={handlePay} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Mobile Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Car Model & Odometer km</label>
                <input
                  type="text"
                  required
                  value={carDetails}
                  onChange={e => setCarDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dealership / Workshop Name</label>
                <input
                  type="text"
                  required
                  value={garageName}
                  onChange={e => setGarageName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upload Estimate / Job Card Photo
                </label>
                <div 
                  onClick={() => setBillImageUploaded(true)}
                  className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                    billImageUploaded
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 hover:border-amber-500/50 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  {billImageUploaded ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Estimate_Scan_Page1.jpg attached!</span>
                    </div>
                  ) : (
                    <div className="text-xs">
                      <span className="text-amber-400 font-semibold">Click to upload bill photo</span> or drop files here
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Mode (Cash / All UPI) */}
              <div className="pt-2 border-t border-slate-800">
                <PaymentMethodSelector
                  amount={planAmount}
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

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {paymentStatus === 'paid'
                      ? `Paid ${planName} • Connect with Mechanic`
                      : paymentMethod === 'cash'
                      ? `Book with Cash on Delivery • Connect Now`
                      : `Confirm & Connect with Mechanic`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  100% Money-back guarantee if no savings identified
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Consultation Booked!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Our master mechanic is reviewing your service sheet and calling you at <strong className="text-amber-400">{phone}</strong> in 5 minutes.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
