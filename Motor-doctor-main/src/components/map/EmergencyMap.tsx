import React, { useEffect, useRef, useState } from 'react';
import { Mechanic } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Compass, PhoneCall, Star, Wrench, Shield, Check } from 'lucide-react';
import { formatINR } from '../../lib/utils';

interface EmergencyMapProps {
  mechanics: Mechanic[];
  selectedMechanicId?: string;
  onSelectMechanic?: (mechanic: Mechanic) => void;
  onRequestHelp?: (mechanic: Mechanic) => void;
  height?: string;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  mechanics,
  selectedMechanicId,
  onSelectMechanic,
  onRequestHelp,
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);
  
  const { userCoords, fetchLiveLocation, isLocating } = useApp();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) {
      setMapLoaded(false);
      return;
    }

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add CartoDB Dark Matter tiles or OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Map click listener to relocate user pin
      map.on('click', (e: any) => {
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(e.latlng);
        }
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user breakdown marker
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      // Custom user breakdown icon with pulsing radar ring
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-3 rounded-full bg-red-600/40 animate-radar pointer-events-none"></div>
          <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: userHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon, draggable: true })
        .addTo(map)
        .bindPopup(`
          <div class="text-xs p-1">
            <strong class="text-red-500 font-bold">Your Breakdown Spot</strong>
            <p class="text-slate-300 mt-1">${userCoords.address}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">(Drag pin to adjust location)</p>
          </div>
        `);

      userMarkerRef.current = marker;
    }

    map.panTo([userCoords.lat, userCoords.lng]);
  }, [userCoords, mapLoaded]);

  // Update mechanic markers
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    mechanics.forEach(m => {
      const isSelected = m.id === selectedMechanicId;
      const isOnline = m.isAvailable;

      const markerColor = isOnline ? (isSelected ? 'bg-amber-500' : 'bg-blue-600') : 'bg-slate-600';
      const pulseHtml = isOnline ? `<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping"></span>` : '';

      const mechHtml = `
        <div class="relative group cursor-pointer transition-transform hover:scale-110">
          <div class="w-9 h-9 rounded-xl ${markerColor} border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          ${pulseHtml}
        </div>
      `;

      const mechIcon = L.divIcon({
        className: 'custom-mech-marker',
        html: mechHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([m.lat, m.lng], { icon: mechIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedMechanic(m);
          if (onSelectMechanic) onSelectMechanic(m);
        });

      markersRef.current[m.id] = marker;
    });
  }, [mechanics, selectedMechanicId, mapLoaded]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
      
      {/* Map Header Status Controls */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2 text-xs font-semibold text-white">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>{mechanics.filter(m => m.isAvailable).length} Mechanics Active Nearby</span>
        </div>

        <button
          onClick={fetchLiveLocation}
          disabled={isLocating}
          className="glass-panel px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          title="Detect Current GPS Location"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>
      </div>

      {/* Actual Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }}
        className="w-full relative z-0"
      />

      {/* Fallback visual if Leaflet CDN is delayed */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-6">
          <Compass className="w-10 h-10 text-amber-500 animate-spin mb-3" />
          <p className="text-white font-semibold text-sm">Loading Live Roadside Assistance Map...</p>
          <p className="text-xs text-slate-400 mt-1">Acquiring OpenStreetMap Highway Grid & GPS Satellite Fix</p>
        </div>
      )}

      {/* Selected Mechanic Quick Drawer / Popup if clicked */}
      {selectedMechanic && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[400] glass-panel p-4 rounded-2xl border border-amber-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">{selectedMechanic.shopName}</h4>
                {selectedMechanic.isVerified && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Shield className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">{selectedMechanic.name}</p>
            </div>
            <button
              onClick={() => setSelectedMechanic(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3 py-2 border-y border-slate-700/60 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{selectedMechanic.rating}</span>
              <span className="text-slate-400 font-normal">({selectedMechanic.reviewsCount})</span>
            </div>
            <div className="text-slate-300">
              Distance: <strong className="text-white">{selectedMechanic.distanceKm} km</strong>
            </div>
            <div className="text-slate-300">
              ETA: <strong className="text-emerald-400">~{selectedMechanic.etaMinutes} mins</strong>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span className="truncate">{selectedMechanic.address}</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-2">
            <a
              href={`tel:${selectedMechanic.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Mechanic</span>
            </a>

            <button
              onClick={() => {
                if (onRequestHelp) onRequestHelp(selectedMechanic);
                setSelectedMechanic(null);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Request Help ({formatINR(selectedMechanic.baseCharge)})</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
