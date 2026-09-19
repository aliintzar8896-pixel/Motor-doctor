import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, Car, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const AuthPage: React.FC = () => {
  const { switchRole } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomAuth = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${isLogin ? 'Logged in' : 'Registered'} successfully!`);
    switchRole('driver');
    navigate('/dashboard');
  };

  const handleQuickPersona = (role: 'driver' | 'mechanic' | 'admin') => {
    switchRole(role);
    if (role === 'driver') navigate('/dashboard');
    else if (role === 'mechanic') navigate('/mechanic-portal');
    else navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white mt-3">
            {isLogin ? 'Sign In to Motor Doctor' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access 24x7 Emergency Highway Assistance & Bill Audits
          </p>
        </div>

        {/* 1-Click Demo Personas for instant presentation */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            ⚡ Quick 1-Click Demo Login
          </span>
          <button
            onClick={() => handleQuickPersona('driver')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>🚗 Driver: Intzar Ali (Hyundai Creta)</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => handleQuickPersona('mechanic')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>🔧 Mechanic Partner: Tariq Auto Care</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => handleQuickPersona('admin')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>🛡️ Platform Admin: TMU Operations</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex-1 h-px bg-slate-800" />
          <span>or continue with email</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleCustomAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email / Phone</label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. driver@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-400 font-bold hover:underline"
          >
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};
