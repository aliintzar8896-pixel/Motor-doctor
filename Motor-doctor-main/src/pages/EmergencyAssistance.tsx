import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { MechanicCard } from '@/components/mechanic/MechanicCard';
import { EmergencyRequestModal } from '@/components/emergency/EmergencyRequestModal';
import { SOSBanner } from '@/components/emergency/SOSBanner';
import { Mechanic, ServiceSpecialty } from '@/types';
import { 
  Wrench, 
  Disc, 
  BatteryCharging, 
  Flame, 
  Truck, 
  Filter, 
  Search, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export const EmergencyAssistance: React.FC = () => {
  const { mechanics, userCoords } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<ServiceSpecialty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  const filterOptions: { key: ServiceSpecialty | 'all'; label: string; icon: any }[] = [
    { key: 'all', label: 'All Mechanics', icon: Wrench },
    { key: 'puncture', label: 'Tyre & Puncture', icon: Disc },
    { key: 'battery', label: 'Battery Jumpstart', icon: BatteryCharging },
    { key: 'engine', label: 'Engine & Heating', icon: Flame },
    { key: 'towing', label: 'Towing & Cranes', icon: Truck },
  ];

  const filteredMechanics = mechanics.filter(m => {
    const matchesFilter = selectedFilter === 'all' || m.services.includes(selectedFilter);
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRequestHelp = (mech: Mechanic) => {
    setSelectedMechanic(mech);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top SOS Emergency Action Banner */}
      <SOSBanner onTriggerSOS={() => { setSelectedMechanic(null); setIsModalOpen(true); }} />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider text-amber-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Emergency Dispatch Corridor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            Highway Breakdown & Mechanic Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>Tracking active mechanics within 10 km corridor of: <strong className="text-slate-200">{userCoords.address}</strong></span>
          </p>
        </div>

        <button
          onClick={() => { setSelectedMechanic(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-display font-black text-xs sm:text-sm shadow-glow-red hover:scale-105 active:scale-95 transition-all border border-red-400/40"
        >
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>REQUEST EMERGENCY DISPATCH</span>
        </button>
      </div>

      {/* Interactive Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Click on any mechanic pin to view details or dispatch</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Real-Time GPS Active
          </span>
        </div>
        <EmergencyMap
          mechanics={filteredMechanics}
          onRequestHelp={handleRequestHelp}
          height="480px"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {filterOptions.map(f => {
            const Icon = f.icon;
            const isSelected = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-glow-amber font-black scale-105'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search garage, mechanic or road..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Mechanics Results List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            Available Highway Technicians ({filteredMechanics.length})
          </h2>
          <span className="text-xs text-slate-400">Sorted by proximity</span>
        </div>

        {filteredMechanics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMechanics.map(mech => (
              <MechanicCard
                key={mech.id}
                mechanic={mech}
                onRequestHelp={handleRequestHelp}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center">
            <Wrench className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-white font-bold text-base">No mechanics found matching criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter or searching a different landmark.</p>
            <button
              onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <EmergencyRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedMechanic={selectedMechanic}
      />

    </div>
  );
};
