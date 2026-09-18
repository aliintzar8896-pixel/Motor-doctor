import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wrench, 
  Car, 
  Shield, 
  ArrowRight, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceSpecialty, UserRole } from '@/types';

export const SignupPage: React.FC = () => {
  const { registerUser, registerMechanic } = useApp();
  const navigate = useNavigate();

  // Role Tab
  const [role, setRole] = useState<'driver' | 'mechanic'>('driver');

  // Driver Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [city, setCity] = useState('Moradabad');

  // Mechanic Partner Fields
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [baseCharge, setBaseCharge] = useState(299);
  const [towingAvailable, setTowingAvailable] = useState(false);
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedServices, setSelectedServices] = useState<ServiceSpecialty[]>([
    'puncture',
    'battery',
    'engine'
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const toggleService = (s: ServiceSpecialty) => {
    if (selectedServices.includes(s)) {
      if (selectedServices.length === 1) {
        toast.warning('Select at least one specialty');
        return;
      }
      setSelectedServices(selectedServices.filter(item => item !== s));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !password) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (role === 'driver') {
        registerUser({
          name,
          phone,
          email: email || `${phone}@motordoctor.in`,
          role: 'driver',
          vehicleModel: vehicleModel || 'Hyundai Creta',
          vehicleNumber: vehicleNumber || 'UP 21 BK 4092'
        });
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        // Register Mechanic Partner
        registerMechanic({
          name,
          shopName: shopName || `${name} Auto Care`,
          phone,
          address: `${address || 'NH-24 Delhi Road, Moradabad'}, Landmark: ${landmark || 'Opposite TMU Campus'}`,
          city: city || 'Moradabad',
          services: selectedServices,
          baseCharge: Number(baseCharge) || 299,
          experienceYears: Number(experienceYears) || 5,
          towingAvailable,
          isAvailable: true,
          lat: 28.8386,
          lng: 78.7733
        });
        registerUser({
          name,
          phone,
          email: email || `${phone}@motordoctor.in`,
          role: 'mechanic'
        });
        setIsLoading(false);
        navigate('/mechanic-portal');
      }
    }, 700);
  };

  const serviceOptions: { id: ServiceSpecialty; label: string }[] = [
    { id: 'puncture', label: 'Flat Tyre / Puncture' },
    { id: 'battery', label: 'Battery Jumpstart' },
    { id: 'engine', label: 'Engine & Overheat' },
    { id: 'brake', label: 'Brake & Clutch' },
    { id: 'fuel', label: 'Fuel Emergency' },
    { id: 'electrical', label: 'Electrical & AC' },
    { id: 'towing', label: 'Crane / Towing' },
    { id: 'general', label: 'General Service' },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Main Glass Card */}
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle glow background */}
          <div className="absolute -right-16 -top-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center space-y-2 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 text-white shadow-xl shadow-amber-500/30 mx-auto transform hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                Create an Account on <span className="bg-gradient-to-r from-amber-400 via-red-400 to-rose-500 bg-clip-text text-transparent">Motor Doctor</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Join India's trusted 24x7 highway roadside assistance and bill auditing network
              </p>
            </div>
          </div>

          {/* Account Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'driver'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>🚗 Vehicle Owner / Driver</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('mechanic')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'mechanic'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>🔧 Mechanic Partner</span>
            </button>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Common: Full Name & Mobile Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'driver' ? 'e.g. Intzar Ali' : 'e.g. Tariq Ahmad'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9368121012"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. intzar@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* DRIVER SPECIFIC FIELDS */}
            {role === 'driver' && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Car className="w-3.5 h-3.5" />
                  <span>Your Primary Vehicle Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Vehicle Model / Make
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      placeholder="e.g. Hyundai Creta / Swift"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={e => setVehicleNumber(e.target.value)}
                      placeholder="e.g. UP 21 BK 4092"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Primary City / Highway Corridor
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Moradabad (NH-24 / NH-9 Corridor)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* MECHANIC PARTNER SPECIFIC FIELDS */}
            {role === 'mechanic' && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Workshop & Garage Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Garage / Workshop Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required={role === 'mechanic'}
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="e.g. Tariq Auto Care & Repair"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Base Visit / Diagnostic Charge (₹)
                    </label>
                    <input
                      type="number"
                      value={baseCharge}
                      onChange={e => setBaseCharge(Number(e.target.value))}
                      placeholder="299"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Workshop Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required={role === 'mechanic'}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. NH-24 Delhi Road, Near TMU"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Nearby Highway Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Indian Oil Petrol Pump"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                    Repair Specialties Offered:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleService(opt.id)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border text-center transition-all flex items-center justify-between ${
                          selectedServices.includes(opt.id)
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {selectedServices.includes(opt.id) && <Check className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Towing checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={towingAvailable}
                    onChange={e => setTowingAvailable(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Equipped with Hydraulic Crane / Towing Vehicle</span>
                </label>
              </div>
            )}

            {/* Terms */}
            <div className="text-[11px] text-slate-400">
              By creating an account, you agree to Motor Doctor's Roadside Service Terms and Moradabad Corridor Emergency Standards.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : `Register as ${role === 'driver' ? 'Vehicle Owner' : 'Mechanic Partner'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Switch to Sign In */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            Already have an existing account?{' '}
            <Link
              to="/login"
              className="text-amber-400 font-extrabold hover:text-amber-300 hover:underline transition-colors"
            >
              Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
