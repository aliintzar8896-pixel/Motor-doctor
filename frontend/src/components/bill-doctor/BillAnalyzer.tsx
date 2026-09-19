import React, { useState } from 'react';
import { BillItem, Verdict } from '../../types';
import { SAMPLE_BILL_ITEMS } from '../../utils/mockData';
import { formatINR } from '../../utils/utils';
import { 
  FileSearch, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  TrendingDown, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles,
  Car
} from 'lucide-react';
import { toast } from 'sonner';

interface BillAnalyzerProps {
  onBookConsultation?: (plan: string) => void;
}

export const BillAnalyzer: React.FC<BillAnalyzerProps> = ({ onBookConsultation }) => {
  const [carModel, setCarModel] = useState('Hyundai Creta 1.5 Petrol');
  const [odometer, setOdometer] = useState('30,000 km');
  const [garageName, setGarageName] = useState('Authorized Dealership Service Center');
  const [items, setItems] = useState<BillItem[]>(SAMPLE_BILL_ITEMS);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Labor' | 'Part' | 'Fluid' | 'Add-on'>('Add-on');

  // Calculations
  const totalQuoted = items.reduce((sum, item) => sum + item.quotedPrice, 0);
  
  // Fair total excludes declined or unnecessary items, and uses fair prices for overpriced ones
  const totalRecommended = items.reduce((sum, item) => {
    if (item.verdict === 'unnecessary') return sum;
    return sum + (item.fairPrice > 0 ? item.fairPrice : item.quotedPrice);
  }, 0);

  const potentialSavings = totalQuoted - totalRecommended;
  const savingsPercent = totalQuoted > 0 ? Math.round((potentialSavings / totalQuoted) * 100) : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const price = parseFloat(newItemPrice);
    
    // Simple heuristic verdict for demonstration
    const lower = newItemName.toLowerCase();
    let verdict: Verdict = 'fair';
    let fairPrice = price;
    let reason = 'Reasonable market price for standard vehicle maintenance.';
    let canDecline = false;

    if (lower.includes('flush') || lower.includes('decarbon') || lower.includes('polish') || lower.includes('nitrogen') || lower.includes('coating')) {
      verdict = 'unnecessary';
      fairPrice = 0;
      reason = 'Common dealer upsell addon with high dealer margin. Not recommended in standard OEM service manual.';
      canDecline = true;
    } else if (lower.includes('sanitization') || lower.includes('disinfection') || lower.includes('caliper') || lower.includes('grease')) {
      verdict = 'overpriced';
      fairPrice = Math.round(price * 0.35);
      reason = 'Significant retail markup. High profit item charged well above material cost.';
      canDecline = true;
    } else if (lower.includes('filter') || lower.includes('brake pad') || lower.includes('oil')) {
      verdict = 'essential';
      fairPrice = price;
      reason = 'Critical component for safety and engine longevity.';
      canDecline = false;
    }

    const newItem: BillItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      quotedPrice: price,
      fairPrice,
      verdict,
      reason,
      canDecline
    };

    setItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    toast.success('Service line item added & analyzed!');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handlePrintAudit = () => {
    window.print();
  };

  const verdictBadge = (verdict: Verdict) => {
    switch (verdict) {
      case 'unnecessary':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-3 h-3" /> Unnecessary Upsell
          </span>
        );
      case 'overpriced':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" /> Inflated Price
          </span>
        );
      case 'essential':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <CheckCircle className="w-3 h-3" /> Essential Safety Item
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" /> Fair OEM Rate
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Vehicle Estimate Profile Header */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{carModel}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {odometer}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Estimate from: <strong className="text-slate-200">{garageName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handlePrintAudit}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Audit PDF</span>
            </button>
          </div>
        </div>

        {/* Savings Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Dealer Quoted Bill
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {formatINR(totalQuoted)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Original estimate presented to you</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
              Recommended Fair Total
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {formatINR(totalRecommended)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">After filtering unneeded add-ons</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-500/10 to-transparent border border-amber-500/40 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                Total You Can Save
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                {savingsPercent}% OFF
              </span>
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {formatINR(potentialSavings)}
            </div>
            <p className="text-[11px] text-amber-200/80 mt-1 flex items-center gap-1 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Safely decline {items.filter(i => i.verdict === 'unnecessary').length} unnecessary items!
            </p>
          </div>
        </div>
      </div>

      {/* Bill Line Items Audit Table */}
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Detailed Line-Item Breakdown & Verdicts
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Every single line item analyzed against manufacturer service guidelines
            </p>
          </div>

          {/* Quick Filter Counters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold">
              {items.filter(i => i.verdict === 'unnecessary').length} Unnecessary
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
              {items.filter(i => i.verdict === 'overpriced').length} Inflated
            </span>
          </div>
        </div>

        {/* Table List */}
        <div className="divide-y divide-slate-800 mt-4">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-xl transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-extrabold text-white text-sm">{item.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                  {verdictBadge(item.verdict)}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                  {item.reason}
                </p>
              </div>

              {/* Price & Action */}
              <div className="flex items-center gap-6 self-end md:self-auto">
                <div className="text-right">
                  <div className="text-sm font-black text-white">
                    {formatINR(item.quotedPrice)}
                  </div>
                  {item.fairPrice !== item.quotedPrice && (
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      Fair: {formatINR(item.fairPrice)}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Remove Item from Bill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Bill Item Form */}
        <form onSubmit={handleAddItem} className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Add Another Line Item from Your Estimate
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="Item name (e.g., Engine Flushing / AC Duct Cleaning)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <input
                type="number"
                required
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                placeholder="Quoted Price (₹)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Audit Item</span>
            </button>
          </div>
        </form>
      </div>

      {/* Consultation Tiers (Matching index.html OfferCatalog) */}
      <div className="rounded-3xl glass-panel border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Professional Mechanic Consultation
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            Need an Expert Mechanic to Speak to the Garage?
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Have our veteran master technicians review your live estimate, give written negotiation points, or speak directly with the workshop manager.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Review (₹499) */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp-Only</div>
              <h4 className="text-lg font-extrabold text-white mt-1">Quick Review</h4>
              <div className="text-3xl font-black text-amber-400 mt-3">₹499</div>
              <p className="text-xs text-slate-400 mt-2">
                Send photo of bill on WhatsApp. Get written report of what to approve and what to decline.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Within 15-minute response</li>
                <li className="flex items-center gap-2">✓ Item-by-item verdict report</li>
                <li className="flex items-center gap-2">✓ What scripts to say to service advisor</li>
              </ul>
            </div>
            <button
              onClick={() => onBookConsultation && onBookConsultation('Quick Review - ₹499')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Book Quick Review
            </button>
          </div>

          {/* Expert Call (₹999) */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900/90 to-slate-900 border-2 border-amber-500 p-6 flex flex-col justify-between shadow-xl relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950 tracking-wider">
              Most Popular
            </span>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Audio / Video Call</div>
              <h4 className="text-lg font-extrabold text-white mt-1">Expert Call Consultation</h4>
              <div className="text-3xl font-black text-amber-400 mt-3">₹999</div>
              <p className="text-xs text-slate-300 mt-2">
                Live 20-minute 1-on-1 audio/video call with an ASE certified veteran mechanic while you are at the workshop.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">✓ Live call while at dealership</li>
                <li className="flex items-center gap-2">✓ Video inspection of worn parts</li>
                <li className="flex items-center gap-2">✓ Verification of brake pad / clutch wear</li>
                <li className="flex items-center gap-2">✓ Guaranteed savings advice</li>
              </ul>
            </div>
            <button
              onClick={() => onBookConsultation && onBookConsultation('Expert Call - ₹999')}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-colors"
            >
              Book Expert Call
            </button>
          </div>

          {/* Full Advisory (₹1499) */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Garage Handling</div>
              <h4 className="text-lg font-extrabold text-white mt-1">Full Advisory & Conference</h4>
              <div className="text-3xl font-black text-amber-400 mt-3">₹1,499</div>
              <p className="text-xs text-slate-400 mt-2">
                Our mechanic joins a 3-way conference call directly with the dealership service manager to negotiate on your behalf.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Direct 3-way conference call with garage</li>
                <li className="flex items-center gap-2">✓ Challenges inflated labor codes</li>
                <li className="flex items-center gap-2">✓ Pre-delivery inspection checklist</li>
                <li className="flex items-center gap-2">✓ Post-service bill verification</li>
              </ul>
            </div>
            <button
              onClick={() => onBookConsultation && onBookConsultation('Full Advisory - ₹1499')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Book Full Advisory
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
