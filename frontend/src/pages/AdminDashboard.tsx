import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/utils/utils';
import { 
  ShieldCheck, 
  Users, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  DollarSign, 
  Activity,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { mechanics, serviceRequests, verifyMechanic, toggleMechanicOnline } = useApp();

  const chartData = [
    { month: 'Apr', dispatches: 38, audits: 24, savings: 48000 },
    { month: 'May', dispatches: 52, audits: 41, savings: 85000 },
    { month: 'Jun', dispatches: 69, audits: 58, savings: 124000 },
    { month: 'Jul', dispatches: 94, audits: 76, savings: 168000 },
    { month: 'Aug', dispatches: 128, audits: 104, savings: 240000 },
    { month: 'Sep', dispatches: 165, audits: 142, savings: 320000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Administrative Control Center
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              TMU Fleet Admin
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Platform Operations & Metrics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Network health across Moradabad, NH-24, NH-9 & Delhi-NCR Highway Corridors
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System All Green • GPS Relay Connected</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Breakdowns</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {serviceRequests.length + 546}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            ↑ 24% from last month
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Verified Mechanics</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {mechanics.filter(m => m.isVerified).length} / {mechanics.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Active on NH Corridors
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Driver Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ₹9.85 Lakhs
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Via Bill Doctor Audits
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Average Response</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            13.4 mins
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            From call to arrival
          </span>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Monthly Growth Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Emergency Roadside Dispatches vs Car Service Bill Audits
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="dispatches" fill="#f59e0b" name="Roadside Calls" radius={[4, 4, 0, 0]} />
              <Bar dataKey="audits" fill="#3b82f6" name="Bill Doctor Audits" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mechanics Management Directory Table */}
      <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white">Mechanics Partner Directory & Verification</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review credential verifications, base pricing, and force online/offline states
            </p>
          </div>
          <span className="text-xs font-bold text-slate-300">
            {mechanics.length} Registered Mechanics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Shop & Lead Mechanic</th>
                <th className="p-3">Location / Corridor</th>
                <th className="p-3">Services</th>
                <th className="p-3">Base Charge</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Verification</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mechanics.map((mech) => (
                <tr key={mech.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    <div>{mech.shopName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{mech.name} • {mech.phone}</div>
                  </td>
                  <td className="p-3 text-slate-300">
                    <div className="truncate max-w-xs">{mech.address}</div>
                  </td>
                  <td className="p-3 text-slate-400 capitalize">
                    {mech.services.slice(0, 3).join(', ')}
                  </td>
                  <td className="p-3 font-bold text-amber-400">
                    {formatINR(mech.baseCharge)}
                  </td>
                  <td className="p-3 font-bold text-slate-200">
                    ★ {mech.rating} ({mech.reviewsCount})
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => verifyMechanic(mech.id, !mech.isVerified)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-colors ${
                        mech.isVerified
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500/40'
                      }`}
                    >
                      {mech.isVerified ? '✓ Verified' : '+ Verify'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleMechanicOnline(mech.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        mech.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {mech.isAvailable ? 'Online' : 'Offline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
