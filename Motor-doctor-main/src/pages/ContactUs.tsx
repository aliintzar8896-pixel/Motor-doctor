import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  Check, 
  Copy, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  User, 
  Building2,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { soundFx } from '../lib/audioAlert';
import { Link } from 'react-router-dom';

export const ContactUs: React.FC = () => {
  const emailAddress = 'aliintzar8896@gmail.com';
  const phoneNumber = '9368121012';
  const formattedPhone = '+91 9368121012';

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'breakdown',
    urgency: 'normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    toast.success('Phone number copied to clipboard!');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      soundFx.playSuccessTone();
      toast.success('Message sent successfully! Intzar Ali will get back to you shortly.');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'breakdown',
        urgency: 'normal',
        message: ''
      });
    }, 800);
  };

  const handleSendViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Intzar! My name is ${formData.name || 'a Motor Doctor user'}.\n` +
      `Subject: ${formData.subject.toUpperCase()}\n` +
      `Phone: ${formData.phone || 'N/A'}\n` +
      `Message: ${formData.message || 'I would like to get in touch regarding Motor Doctor roadside services.'}`
    );
    window.open(`https://wa.me/919368121012?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-glow-amber">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>24/7 ROADSIDE SUPPORT & OFFICIAL CONTACT</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
          Contact <span className="bg-gradient-to-r from-amber-400 via-red-500 to-rose-500 bg-clip-text text-transparent">Motor Doctor</span>
        </h1>

        <p className="text-base text-slate-300 leading-relaxed">
          Need immediate roadside breakdown assistance, an expert audit on your car service estimate, 
          or have questions for our founder? Connect with us directly via Phone, WhatsApp, or Email.
        </p>
      </div>

      {/* Main Contact Grid (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Phone Card */}
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 hover:border-amber-500/60 hover:shadow-glow-amber transition-all shadow-xl group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-md">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              24/7 Active
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <h2 className="text-lg font-bold text-white">Direct Phone Call</h2>
            <p className="text-xs text-slate-400">
              Speak directly with Intzar Ali for emergency roadside coordination and queries.
            </p>
            <p className="text-xl font-extrabold text-amber-400 pt-1">
              {formattedPhone}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`tel:+91${phoneNumber}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
            <button
              onClick={handleCopyPhone}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
              title="Copy phone number"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 hover:border-emerald-500/60 hover:shadow-glow-emerald transition-all shadow-xl group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Instant Chat
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <h2 className="text-lg font-bold text-white">WhatsApp Support</h2>
            <p className="text-xs text-slate-400">
              Share live GPS breakdown locations or upload photos of car service bills for review.
            </p>
            <p className="text-xl font-extrabold text-emerald-400 pt-1">
              +91 {phoneNumber}
            </p>
          </div>

          <div className="mt-6">
            <a
              href={`https://wa.me/91${phoneNumber}?text=Hello%20Intzar%2C%20I%20am%20contacting%20you%20from%20Motor%20Doctor%20platform.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Email Card */}
        <div className="rounded-3xl glass-panel border border-slate-700/80 p-6 hover:border-rose-500/60 hover:shadow-glow-red transition-all shadow-xl group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
              Official Email
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <h2 className="text-lg font-bold text-white">Email Address</h2>
            <p className="text-xs text-slate-400">
              For partnership proposals, garage registration, and detailed technical queries.
            </p>
            <p className="text-base font-extrabold text-rose-300 pt-1 break-all">
              {emailAddress}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`mailto:${emailAddress}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
              title="Copy email address"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Interactive Contact Form & Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Send className="w-3.5 h-3.5" />
              <span>Leave a Message</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Send Us a Direct Message</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Fill out the form below, and our support team will respond quickly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject / Category
                </label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="breakdown">🚨 Highway Breakdown Support</option>
                  <option value="bill_audit">🧾 Car Service Bill Doctor Audit</option>
                  <option value="mechanic_partner">🔧 Join as Partner Mechanic</option>
                  <option value="academic">🎓 Academic Project Inquiry</option>
                  <option value="feedback">💬 General Feedback / Query</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'urgent', label: '🚨 Urgent (Breakdown)', color: 'border-red-500/40 text-red-300 bg-red-500/10' },
                  { key: 'high', label: '⚡ High Priority', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
                  { key: 'normal', label: '📝 Normal Query', color: 'border-slate-700 text-slate-300 bg-slate-800/60' }
                ].map((u) => (
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: u.key })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      formData.urgency === u.key
                        ? `${u.color} ring-1 ring-amber-400 font-bold`
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Message / Details <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your requirement, breakdown location, or question..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

        {/* Project & Creator Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Creator Profile Box */}
          <div className="rounded-3xl glass-panel border border-amber-500/30 p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-500/30">
                IA
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Founder & Lead Developer</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Intzar Ali</h3>
                <p className="text-xs text-slate-400">BCA 5th Semester • Section E</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Teerthanker Mahaveer University (TMU)</strong>
                  <span className="text-slate-400 text-[11px]">Faculty of Engineering & Computing Sciences (FOECS), Moradabad</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Contact: <a href="tel:9368121012" className="text-amber-400 font-bold hover:underline">+91 9368121012</a></span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Email: <a href="mailto:aliintzar8896@gmail.com" className="text-rose-300 font-bold hover:underline break-all">aliintzar8896@gmail.com</a></span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Location: Moradabad & Delhi-Lucknow Highway Corridor (NH-24/NH-9)</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              Motor Doctor was created to solve sudden highway breakdowns and unfair car service bill overcharging. 
              We are constantly onboarding verified mechanics across western Uttar Pradesh and Delhi-NCR.
            </div>
          </div>

          {/* Quick Highway Emergency Speed Card */}
          <div className="rounded-3xl bg-gradient-to-br from-red-950/60 to-slate-900 border border-red-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-black">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Immediate Highway SOS?</h4>
                <p className="text-[11px] text-slate-300">Fastest roadside dispatch channels:</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href="tel:9368121012"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 9368121012</span>
              </a>

              <Link
                to="/emergency"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Dispatch Radar</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Emergency Help Numbers Strip */}
      <div className="rounded-2xl glass-panel border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Government Highway Patrol Helplines:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <a href="tel:1033" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white">
            NHAI Highway: <strong className="text-amber-400">1033</strong>
          </a>
          <a href="tel:112" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white">
            Police Emergency: <strong className="text-amber-400">112</strong>
          </a>
          <a href="tel:108" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white">
            Ambulance: <strong className="text-amber-400">108</strong>
          </a>
        </div>
      </div>

    </div>
  );
};
