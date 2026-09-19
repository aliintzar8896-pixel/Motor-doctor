import React, { useState, useEffect } from 'react';
import { 
  PaymentMethod, 
  PaymentStatus 
} from '../../types';
import { 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Smartphone, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { formatINR } from '../../utils/utils';
import { soundFx } from '../../utils/audioAlert';
import { toast } from 'sonner';

interface PaymentMethodSelectorProps {
  amount: number;
  selectedMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  onChange: (method: PaymentMethod, status: PaymentStatus, refId?: string, upiId?: string) => void;
  showSimulatePay?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  selectedMethod,
  paymentStatus,
  onChange,
  showSimulatePay = true,
}) => {
  // Mode: 'cash' vs 'upi'
  const isCash = selectedMethod === 'cash';
  const [upiSubTab, setUpiSubTab] = useState<'apps' | 'qr' | 'id'>(
    selectedMethod === 'upi_qr' ? 'qr' : selectedMethod === 'upi_id' ? 'id' : 'apps'
  );

  const [enteredUpiId, setEnteredUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [copiedVPA, setCopiedVPA] = useState(false);
  const [qrTimer, setQrTimer] = useState(600); // 10 minutes
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const merchantVpa = 'motordoctor@icici';
  const merchantName = 'Motor Doctor Roadside Services';

  // Format timer
  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimer(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVPA(true);
    toast.success('Motor Doctor UPI ID copied to clipboard!');
    setTimeout(() => setCopiedVPA(false), 2000);
  };

  const handleSelectCash = () => {
    onChange('cash', 'pay_on_delivery');
  };

  const handleSelectUpiApp = (method: 'upi_phonepe' | 'upi_gpay' | 'upi_paytm' | 'upi_bhim') => {
    onChange(method, 'pending');
    setUpiSubTab('apps');
  };

  const handleSelectQR = () => {
    onChange('upi_qr', 'pending');
    setUpiSubTab('qr');
  };

  const handleSelectUpiId = () => {
    onChange('upi_id', 'pending');
    setUpiSubTab('id');
  };

  const handleVerifyUpiId = () => {
    if (!enteredUpiId || !enteredUpiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. yourname@oksbi or 9876543210@paytm)');
      return;
    }
    setIsUpiVerified(true);
    toast.success(`Verified: ${enteredUpiId} (Secure Virtual Payment Address)`);
    onChange('upi_id', 'pending', undefined, enteredUpiId);
  };

  const handleSimulateInstantPayment = (appName?: string) => {
    setIsProcessingPayment(true);
    toast.loading(`Processing UPI request through ${appName || 'UPI Gateway'}...`, { id: 'upi-pay' });

    setTimeout(() => {
      const generatedRefId = `UPI-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsProcessingPayment(false);
      soundFx.playSuccessTone();
      toast.success(`₹${amount} received! Payment Ref: ${generatedRefId}`, { id: 'upi-pay' });
      onChange(selectedMethod === 'cash' ? 'upi_qr' : selectedMethod, 'paid', generatedRefId, enteredUpiId || merchantVpa);
    }, 1200);
  };

  const upiApps = [
    {
      id: 'upi_phonepe' as const,
      name: 'PhonePe',
      desc: 'Pay via PhonePe UPI',
      color: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      tag: 'Most Popular'
    },
    {
      id: 'upi_gpay' as const,
      name: 'Google Pay',
      desc: 'Pay via GPay UPI',
      color: 'from-blue-600 to-emerald-600',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      tag: 'Instant'
    },
    {
      id: 'upi_paytm' as const,
      name: 'Paytm',
      desc: 'Pay via Paytm Wallet / UPI',
      color: 'from-sky-500 to-cyan-600',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      tag: 'Fast Checkout'
    },
    {
      id: 'upi_bhim' as const,
      name: 'BHIM UPI',
      desc: 'Govt. NPCI Supported UPI',
      color: 'from-amber-600 to-emerald-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      tag: 'Direct Bank'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Choose Payment Mode
        </label>
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Safe & Verified
        </span>
      </div>

      {/* Primary Mode Tabs: Cash on Delivery vs UPI */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cash on Delivery Button */}
        <button
          type="button"
          onClick={handleSelectCash}
          className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            isCash
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 text-white shadow-lg'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl ${isCash ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Banknote className="w-5 h-5" />
            </div>
            {isCash && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Cash on Delivery</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">COD</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Pay cash to mechanic on-site after vehicle repair
            </p>
          </div>
        </button>

        {/* UPI Button */}
        <button
          type="button"
          onClick={() => {
            if (isCash) {
              onChange('upi_phonepe', 'pending');
              setUpiSubTab('apps');
            }
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            !isCash
              ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 text-white shadow-lg'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl ${!isCash ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            {!isCash && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Instant UPI & QR</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">0% Fee</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              GPay, PhonePe, Paytm, BHIM & Dynamic QR
            </p>
          </div>
        </button>
      </div>

      {/* Cash on Delivery Details Card */}
      {isCash && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-300 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pay on completion with 100% Peace of Mind</span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li>Zero advance payment required now.</li>
            <li>Inspect and test drive your vehicle before handing over cash to the mechanic.</li>
            <li>Mechanic verifies your 4-digit security OTP before collecting <strong className="text-white">{formatINR(amount)}</strong>.</li>
            <li>Digital tax receipt will be issued directly to your phone.</li>
          </ul>
        </div>
      )}

      {/* UPI Options Expansion */}
      {!isCash && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          
          {/* Sub tabs: UPI Apps vs Dynamic QR vs UPI ID */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setUpiSubTab('apps');
                if (selectedMethod === 'upi_qr' || selectedMethod === 'upi_id') {
                  onChange('upi_phonepe', 'pending');
                }
              }}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                upiSubTab === 'apps'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI Apps</span>
            </button>

            <button
              type="button"
              onClick={handleSelectQR}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                upiSubTab === 'qr'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Code</span>
            </button>

            <button
              type="button"
              onClick={handleSelectUpiId}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                upiSubTab === 'id'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter UPI ID</span>
            </button>
          </div>

          {/* View 1: UPI Apps */}
          {upiSubTab === 'apps' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {upiApps.map((app) => {
                  const isSelected = selectedMethod === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleSelectUpiApp(app.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-white text-xs font-black shadow`}>
                            {app.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-white">{app.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">{app.desc}</span>
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] ${app.badgeBg}`}>
                          {app.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant App Payment Simulation Button */}
              {showSimulatePay && (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessingPayment || paymentStatus === 'paid'}
                    onClick={() => {
                      const app = upiApps.find(a => a.id === selectedMethod) || upiApps[0];
                      handleSimulateInstantPayment(app.name);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      paymentStatus === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30'
                    }`}
                  >
                    {paymentStatus === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Pre-paid ₹{amount} via {upiApps.find(a => a.id === selectedMethod)?.name || 'UPI'} ✓</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Pay {formatINR(amount)} via {upiApps.find(a => a.id === selectedMethod)?.name || 'UPI App'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View 2: Dynamic QR Code */}
          {upiSubTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative p-3 rounded-2xl bg-white shadow-xl">
                {/* Visual SVG QR Code Representation with Indian UPI standard */}
                <svg
                  viewBox="0 0 160 160"
                  className="w-36 h-36 mx-auto"
                  shapeRendering="crispEdges"
                >
                  <rect width="160" height="160" fill="#FFFFFF" />
                  {/* Outer corner boxes */}
                  <rect x="10" y="10" width="40" height="40" fill="#0f172a" />
                  <rect x="16" y="16" width="28" height="28" fill="#FFFFFF" />
                  <rect x="22" y="22" width="16" height="16" fill="#0f172a" />

                  <rect x="110" y="10" width="40" height="40" fill="#0f172a" />
                  <rect x="116" y="16" width="28" height="28" fill="#FFFFFF" />
                  <rect x="122" y="22" width="16" height="16" fill="#0f172a" />

                  <rect x="10" y="110" width="40" height="40" fill="#0f172a" />
                  <rect x="16" y="116" width="28" height="28" fill="#FFFFFF" />
                  <rect x="22" y="122" width="16" height="16" fill="#0f172a" />

                  {/* High density QR pattern blocks */}
                  <rect x="60" y="15" width="8" height="25" fill="#0f172a" />
                  <rect x="75" y="10" width="12" height="12" fill="#0f172a" />
                  <rect x="92" y="20" width="8" height="20" fill="#0f172a" />
                  <rect x="70" y="35" width="20" height="8" fill="#0f172a" />

                  <rect x="15" y="60" width="20" height="8" fill="#0f172a" />
                  <rect x="25" y="75" width="15" height="15" fill="#0f172a" />
                  <rect x="12" y="95" width="18" height="8" fill="#0f172a" />

                  <rect x="115" y="60" width="15" height="15" fill="#0f172a" />
                  <rect x="135" y="70" width="15" height="10" fill="#0f172a" />
                  <rect x="120" y="90" width="25" height="10" fill="#0f172a" />

                  <rect x="55" y="55" width="50" height="50" fill="#0f172a" />
                  <rect x="62" y="62" width="36" height="36" fill="#FFFFFF" />
                  
                  {/* Center Rupee / Motor Doctor logo */}
                  <circle cx="80" cy="80" r="14" fill="#0284c7" />
                  <text x="80" y="86" fontSize="16" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">₹</text>

                  {/* Bottom pattern */}
                  <rect x="60" y="115" width="15" height="15" fill="#0f172a" />
                  <rect x="80" y="120" width="20" height="10" fill="#0f172a" />
                  <rect x="110" y="115" width="15" height="20" fill="#0f172a" />
                  <rect x="130" y="130" width="18" height="18" fill="#0f172a" />
                  <rect x="65" y="140" width="35" height="10" fill="#0f172a" />
                </svg>

                {paymentStatus === 'paid' && (
                  <div className="absolute inset-0 bg-emerald-950/90 rounded-2xl flex flex-col items-center justify-center text-emerald-400 p-2 animate-in fade-in">
                    <CheckCircle2 className="w-10 h-10 mb-1" />
                    <span className="text-xs font-black">PAYMENT SUCCESSFUL</span>
                    <span className="text-[10px] text-white font-mono">Paid {formatINR(amount)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  Scan & Pay {formatINR(amount)} with any UPI App
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>QR expires in <strong className="text-amber-400 font-mono">{formatTime(qrTimer)}</strong></span>
                </div>
              </div>

              {/* UPI ID Copy Bar */}
              <div className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="text-left overflow-hidden">
                  <div className="text-[9px] text-slate-400 uppercase">Motor Doctor Official UPI ID</div>
                  <div className="font-mono text-xs text-amber-400 truncate">{merchantVpa}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
                >
                  {copiedVPA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVPA ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Simulate QR scan payment */}
              {showSimulatePay && paymentStatus !== 'paid' && (
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleSimulateInstantPayment('Dynamic QR')}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>I have scanned & paid in my UPI App</span>
                </button>
              )}
            </div>
          )}

          {/* View 3: Enter UPI ID */}
          {upiSubTab === 'id' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-medium mb-1">
                  Your Virtual Payment Address (VPA / UPI ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={enteredUpiId}
                    onChange={(e) => {
                      setEnteredUpiId(e.target.value);
                      setIsUpiVerified(false);
                    }}
                    placeholder="e.g. mobile@paytm or name@okhdfcbank"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyUpiId}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Popular UPI Handles:</span>
                <div className="flex flex-wrap gap-1">
                  {['@ybl', '@okhdfcbank', '@okaxis', '@paytm', '@ibl', '@upi'].map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        const base = enteredUpiId.split('@')[0] || '9876543210';
                        setEnteredUpiId(`${base}${handle}`);
                        setIsUpiVerified(false);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              {isUpiVerified && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>UPI ID Verified & Ready for collect request</span>
                  </span>
                </div>
              )}

              {showSimulatePay && (
                <button
                  type="button"
                  disabled={isProcessingPayment || paymentStatus === 'paid'}
                  onClick={() => handleSimulateInstantPayment(`UPI (${enteredUpiId || 'VPA'})`)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    paymentStatus === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{paymentStatus === 'paid' ? 'Payment Completed ✓' : `Request ${formatINR(amount)} on UPI`}</span>
                </button>
              )}
            </div>
          )}

          {/* Payment Guarantee Notice */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Powered by UPI 2.0 / NPCI</span>
            <span className="text-slate-300">Instant Refund Guarantee</span>
          </div>
        </div>
      )}
    </div>
  );
};
