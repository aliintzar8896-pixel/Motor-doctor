import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wrench, 
  Car, 
  Shield, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Phone, 
  Mail, 
  Sparkles, 
  PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { loginUser, switchRole } = useApp();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('aliintzar8896@gmail.com');
  const [password, setPassword] = useState('motordoctor2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<'driver' | 'mechanic' | 'admin'>('driver');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error('Please enter your mobile number or email');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginUser(identifier, selectedPersona);
      setIsLoading(false);
      if (selectedPersona === 'driver') navigate('/dashboard');
      else if (selectedPersona === 'mechanic') navigate('/mechanic-portal');
      else navigate('/admin');
    }, 600);
  };

  const handleQuickSelect = (role: 'driver' | 'mechanic' | 'admin') => {
    setSelectedPersona(role);
    switchRole(role);
    if (role === 'driver') {
      setIdentifier('aliintzar8896@gmail.com');
      setPassword('driver123');
    } else if (role === 'mechanic') {
      setIdentifier('+91 93681 21012');
      setPassword('mechanic123');
    } else {
      setIdentifier('admin@motordoctor.in');
      setPassword('admin123');
    }
    toast.info(`Switched to demo: ${role.toUpperCase()}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Main Card */}
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-7 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle glow background */}
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Heading */}
          <div className="text-center space-y-2 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 text-white shadow-xl shadow-amber-500/30 mx-auto transform hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>

            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                Sign In to <span className="bg-gradient-to-r from-amber-400 via-red-400 to-rose-500 bg-clip-text text-transparent">Motor Doctor</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Access 24/7 Highway Emergency Assistance & Bill Reviews
              </p>
            </div>
          </div>

          {/* 1-Click Fast Persona Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Demo Login</span>
              </span>
              <span className="text-[10px] text-slate-400">Select Role:</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {[
                { id: 'driver', label: '🚗 Driver', name: 'Intzar Ali' },
                { id: 'mechanic', label: '🔧 Mechanic', name: 'Tariq Auto' },
                { id: 'admin', label: '🛡️ Admin', name: 'TMU Ops' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickSelect(p.id as any)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    selectedPersona === p.id
                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{p.label}</div>
                  <div className="text-[9px] text-slate-400 truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email / Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Mobile Number / Email</span>
                <span className="text-[10px] text-amber-400">Required</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. 9368121012 or yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => toast.info('For this TMU demo, use any password or choose 1-Click Demo login above!')}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Switch to Sign Up */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="text-amber-400 font-extrabold hover:text-amber-300 hover:underline transition-colors"
            >
              Create Free Account / Register
            </Link>
          </div>

        </div>

        {/* Breakdown SOS Strip */}
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between text-xs text-slate-300 shadow-md">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>Emergency Breakdown Right Now?</span>
          </div>
          <Link
            to="/emergency"
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] shadow-sm transition-colors"
          >
            Instant SOS
          </Link>
        </div>

      </div>
    </div>
  );
};
