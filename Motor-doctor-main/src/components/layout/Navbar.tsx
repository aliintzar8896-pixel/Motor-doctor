import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  AlertTriangle, 
  FileText, 
  Shield, 
  User as UserIcon, 
  PhoneCall, 
  Menu, 
  X, 
  CheckCircle,
  Compass,
  Radio,
  Bell,
  LogIn,
  UserPlus
} from 'lucide-react';
import { soundFx } from '../../lib/audioAlert';

interface NavbarProps {
  onOpenSOSModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSOSModal }) => {
  const { 
    currentRole, 
    switchRole, 
    activeRequest, 
    currentUser,
    notifications,
    unreadNotificationCount,
    markAllNotificationsAsRead,
    clearNotifications
  } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Emergency Dispatch', path: '/emergency', icon: Radio, badge: 'Live Radar', badgeColor: 'red' },
    { name: 'Bill Doctor', path: '/bill-doctor', icon: FileText, badge: 'Save ₹5000', badgeColor: 'emerald' },
    { name: 'Mechanic Portal', path: '/mechanic-portal', icon: Wrench },
    { name: 'Highway Safety', path: '/safety', icon: Shield },
    { name: 'Contact Us', path: '/contact', icon: PhoneCall, badge: '24/7 Support', badgeColor: 'amber' },
    { 
      name: currentRole === 'admin' ? 'Admin Panel' : currentRole === 'mechanic' ? 'Jobs & Status' : 'My Requests', 
      path: currentRole === 'admin' ? '/admin' : currentRole === 'mechanic' ? '/mechanic-portal' : '/dashboard', 
      icon: UserIcon 
    },
  ];

  const handleSOSClick = () => {
    soundFx.playSOSSiren();
    if (onOpenSOSModal) {
      onOpenSOSModal();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-red-500 to-rose-600 text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6 transform -rotate-12 group-hover:rotate-0 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-black tracking-wider bg-gradient-to-r from-amber-400 via-white to-amber-200 bg-clip-text text-transparent">
                  MOTOR DOCTOR
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm shadow-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  24/7 SOS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Highway Breakdown & Service Bill Doctor</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              const badgeClass = 
                link.badgeColor === 'red' 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20 animate-pulse'
                  : link.badgeColor === 'amber'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20';

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shadow-sm ${badgeClass}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* Active Request Indicator if any */}
            {activeRequest && (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Breakdown Tracking</span>
              </Link>
            )}

            {/* Notification Center Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/60 transition-colors"
                title="Live Booking Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-[9px] font-black text-white">
                      {unreadNotificationCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl z-50 border border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Booking Alerts ({notifications.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] text-amber-400 hover:underline font-bold"
                        >
                          Mark Read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] text-slate-500 hover:text-red-400"
                          title="Clear all notifications"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List of Notifications */}
                  <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No new booking alerts at the moment.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                            notif.isRead
                              ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                              : 'bg-slate-900 border-amber-500/50 shadow-md text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-[11px] flex items-center gap-1 truncate">
                              {notif.type === 'emergency_breakdown' ? '🚨' : '🧾'} {notif.title}
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0 ml-1">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-[11px] space-y-0.5 text-slate-300">
                            <div>👤 Customer: <strong className="text-white">{notif.customerName}</strong> (<a href={`tel:${notif.customerPhone}`} className="text-amber-400 hover:underline">{notif.customerPhone}</a>)</div>
                            <div className="truncate">📍 Location: <span className="text-slate-400">{notif.locationOrGarage}</span></div>
                            <div className="truncate">🔧 Details: <span className="text-amber-300">{notif.vehicleOrPlan}</span></div>
                            {notif.estimatedCost && <div>💰 Est Cost: ₹{notif.estimatedCost}</div>}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-1 flex items-center gap-2">
                            <a
                              href={`https://wa.me/919368121012?text=${encodeURIComponent(
                                `🚨 MOTOR DOCTOR BOOKING ALERT:\n` +
                                `Customer: ${notif.customerName}\n` +
                                `Phone: ${notif.customerPhone}\n` +
                                `Service: ${notif.title}\n` +
                                `Location: ${notif.locationOrGarage}\n` +
                                `Time: ${new Date(notif.timestamp).toLocaleString()}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 font-bold text-[10px] transition-colors"
                            >
                              <span>WhatsApp to Intzar</span>
                            </a>

                            <a
                              href={`tel:${notif.customerPhone}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[10px] font-bold transition-colors"
                              title="Call Customer"
                            >
                              Call
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
                    Alerts dispatched to founder <strong className="text-slate-200">Intzar Ali (+91 9368121012)</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons: Sign In / Register */}
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
              >
                Register
              </Link>
            </div>

            {/* Interactive Role Switcher Modal / Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200 hover:border-slate-500 transition-colors"
                title="Switch demo persona (Driver, Mechanic, Admin)"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="capitalize">{currentRole}</span>
                <span className="text-[10px] text-slate-400 font-normal">▼</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel p-2 shadow-2xl z-50 border border-slate-700">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => { switchRole('driver'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentRole === 'driver' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🚗 Driver (Vehicle Owner)</span>
                    {currentRole === 'driver' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => { switchRole('mechanic'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentRole === 'mechanic' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🔧 Mechanic Partner</span>
                    {currentRole === 'mechanic' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentRole === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🛡️ Platform Admin</span>
                    {currentRole === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <div className="mt-1 pt-1 border-t border-slate-700/60 px-3 py-1 text-[10px] text-slate-400">
                    Logged in as: <span className="font-semibold text-slate-200">{currentUser.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick 1-Click SOS Dispatch Button */}
            <Link
              to="/emergency"
              onClick={handleSOSClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-extrabold tracking-wider shadow-lg shadow-red-600/40 transition-all transform hover:scale-105 active:scale-95 border border-red-400/50"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>SOS DISPATCH</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/emergency"
              onClick={handleSOSClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Demo Persona:</span>
            <div className="flex gap-1.5">
              {(['driver', 'mechanic', 'admin'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`px-2.5 py-1 rounded text-xs capitalize ${
                    currentRole === role ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Links */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs font-bold text-slate-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center text-xs font-bold text-amber-300"
            >
              Register
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact: <a href="tel:9368121012" className="text-amber-400 font-bold hover:underline">+91 9368121012</a></span>
            </div>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xs text-amber-400 font-medium hover:underline">
              Contact Page →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
