import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Calendar, 
  ExternalLink, 
  Plus, 
  Clock, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../../context/TripContext';

// Landmark geocoding registry for popular destinations
const LANDMARK_COORDS = {
  // Tokyo
  'shibuya': { lat: 35.6595, lng: 139.7004 },
  'shinjuku': { lat: 35.6938, lng: 139.7034 },
  'asakusa': { lat: 35.7118, lng: 139.7967 },
  'senso-ji': { lat: 35.7148, lng: 139.7967 },
  'akihabara': { lat: 35.6983, lng: 139.7731 },
  'tokyo tower': { lat: 35.6586, lng: 139.7454 },
  'meiji': { lat: 35.6764, lng: 139.6993 },
  'roppongi': { lat: 35.6628, lng: 139.7314 },
  'ginza': { lat: 35.6719, lng: 139.7648 },
  'tsukiji': { lat: 35.6655, lng: 139.7707 },
  'teamlab': { lat: 35.6558, lng: 139.7431 },
  'ueno': { lat: 35.7141, lng: 139.7741 },

  // Kyoto
  'gion': { lat: 35.0037, lng: 135.7772 },
  'arashiyama': { lat: 35.0116, lng: 135.6777 },
  'fushimi inari': { lat: 34.9671, lng: 135.7727 },
  'kinkaku-ji': { lat: 35.0394, lng: 135.7292 },
  'kiyomizu-dera': { lat: 34.9949, lng: 135.7850 },
  'nijo castle': { lat: 35.0142, lng: 135.7482 },

  // India
  'india': { lat: 20.5937, lng: 78.9629 },
  'goa': { lat: 15.2993, lng: 74.1240 },
  'panaji': { lat: 15.4909, lng: 73.8278 },
  'baga': { lat: 15.5553, lng: 73.7516 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'taj mahal': { lat: 27.1751, lng: 78.0421 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },

  // Global capitals
  'paris': { lat: 48.8566, lng: 2.3522 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'bali': { lat: -8.4095, lng: 115.1889 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'bangkok': { lat: 13.7563, lng: 100.5018 },
  'dubai': { lat: 25.2048, lng: 55.2708 }
};

// Destination coordinates lookup
const getDestinationCenter = (destName) => {
  const clean = (destName || '').toLowerCase().trim();
  for (const [key, coords] of Object.entries(LANDMARK_COORDS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return { lat: coords.lat, lng: coords.lng, zoom: 12 };
    }
  }
  // Default to Tokyo
  return { lat: 35.6762, lng: 139.6503, zoom: 12 };
};

// Simple string hash for deterministic coordinate dispersal when coordinates aren't provided
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const TripMapTab = () => {
  const { activeTrip, activities, openModal } = useTrip();
  const [filterDay, setFilterDay] = useState('all');
  const [selectedPinId, setSelectedPinId] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);

  const destination = activeTrip?.destination || activeTrip?.title || 'Tokyo, Japan';
  const destCoords = useMemo(() => getDestinationCenter(destination), [destination]);

  // Curated fallback itinerary spots if a trip currently has no activities
  const fallbackStops = useMemo(() => {
    const destLower = destination.toLowerCase();
    if (destLower.includes('india') || destLower.includes('goa')) {
      return [
        { _id: 'stop_1', day: 1, title: 'Baga Beach & Sunset Shacks', location: 'Baga, North Goa', time: '10:00 AM', category: 'sightseeing', color: '#FF5B45', lat: 15.5553, lng: 73.7516 },
        { _id: 'stop_2', day: 1, title: 'Fort Aguada Lighthouse', location: 'Sinquerim, Goa', time: '02:30 PM', category: 'culture', color: '#10B981', lat: 15.4925, lng: 73.7736 },
        { _id: 'stop_3', day: 2, title: 'Basilica of Bom Jesus', location: 'Old Goa', time: '11:00 AM', category: 'culture', color: '#3B82F6', lat: 15.5009, lng: 73.9116 },
        { _id: 'stop_4', day: 2, title: 'Fontainhas Latin Quarter', location: 'Panaji, Goa', time: '04:00 PM', category: 'sightseeing', color: '#8B5CF6', lat: 15.4965, lng: 73.8322 }
      ];
    }
    if (destLower.includes('kyoto')) {
      return [
        { _id: 'stop_1', day: 1, title: 'Fushimi Inari Taisha Shrine', location: 'Fushimi Ward, Kyoto', time: '09:00 AM', category: 'culture', color: '#FF5B45', lat: 34.9671, lng: 135.7727 },
        { _id: 'stop_2', day: 1, title: 'Kiyomizu-dera Wooden Temple', location: 'Higashiyama, Kyoto', time: '01:30 PM', category: 'sightseeing', color: '#10B981', lat: 34.9949, lng: 135.7850 },
        { _id: 'stop_3', day: 2, title: 'Arashiyama Bamboo Grove', location: 'Ukyo Ward, Kyoto', time: '10:00 AM', category: 'nature', color: '#3B82F6', lat: 35.0116, lng: 135.6777 },
        { _id: 'stop_4', day: 2, title: 'Kinkaku-ji (Golden Pavilion)', location: 'Kita Ward, Kyoto', time: '03:00 PM', category: 'culture', color: '#F59E0B', lat: 35.0394, lng: 135.7292 }
      ];
    }
    // Default Tokyo
    return [
      { _id: 'stop_1', day: 1, title: 'Shibuya Crossing & Sky Observatory', location: 'Shibuya Scramble Square', time: '10:00 AM', category: 'sightseeing', color: '#FF5B45', lat: 35.6595, lng: 139.7004 },
      { _id: 'stop_2', day: 1, title: 'Meiji Jingu Shrine & Yoyogi Park', location: 'Harajuku, Shibuya', time: '01:30 PM', category: 'culture', color: '#10B981', lat: 35.6764, lng: 139.6993 },
      { _id: 'stop_3', day: 2, title: 'Senso-ji Ancient Temple & Asakusa', location: 'Asakusa, Taito City', time: '10:30 AM', category: 'culture', color: '#3B82F6', lat: 35.7148, lng: 139.7967 },
      { _id: 'stop_4', day: 2, title: 'teamLab Borderless Digital Art', location: 'Azabudai Hills, Minato', time: '04:00 PM', category: 'sightseeing', color: '#8B5CF6', lat: 35.6558, lng: 139.7431 }
    ];
  }, [destination]);

  // Geocode activities with reliable coordinates
  const resolvedActivities = useMemo(() => {
    const sourceList = activities && activities.length > 0 ? activities : fallbackStops;

    return sourceList.map((act, index) => {
      // Check if activity already has coordinates
      if (act.lat && act.lng) {
        return { ...act, index: index + 1 };
      }

      // Check landmark geocode lookup
      const searchTarget = `${act.location || ''} ${act.title || ''}`.toLowerCase();
      let matchedCoord = null;
      for (const [key, coords] of Object.entries(LANDMARK_COORDS)) {
        if (searchTarget.includes(key)) {
          matchedCoord = coords;
          break;
        }
      }

      // If matched, use exact landmark coordinates
      if (matchedCoord) {
        return {
          ...act,
          lat: matchedCoord.lat,
          lng: matchedCoord.lng,
          index: index + 1
        };
      }

      // Otherwise, generate a natural nearby coordinate offset from the destination center
      const seed = hashString(act.title || String(index));
      const latOffset = ((seed % 100) - 50) * 0.0006;
      const lngOffset = (((seed >> 3) % 100) - 50) * 0.0006;

      return {
        ...act,
        lat: destCoords.lat + latOffset,
        lng: destCoords.lng + lngOffset,
        index: index + 1
      };
    });
  }, [activities, fallbackStops, destCoords]);

  // Filter activities based on selected day
  const displayedActivities = useMemo(() => {
    if (filterDay === 'all') return resolvedActivities;
    return resolvedActivities.filter(a => Number(a.day) === Number(filterDay));
  }, [resolvedActivities, filterDay]);

  const days = activeTrip?.dayTabs || [
    { day: 1, label: 'Day 1' },
    { day: 2, label: 'Day 2' },
    { day: 3, label: 'Day 3' },
    { day: 4, label: 'Day 4' },
    { day: 5, label: 'Day 5' }
  ];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check light or dark theme
    const isLight = document.documentElement.classList.contains('light-theme') || 
                    localStorage.getItem('tripplan_theme') === 'light';

    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    // Create map instance if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [destCoords.lat, destCoords.lng],
        zoom: destCoords.zoom || 12,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      polylineLayerRef.current = L.polyline([], {
        color: '#FF5B45',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([destCoords.lat, destCoords.lng], destCoords.zoom || 12);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destCoords]);

  // Update Markers and Polyline whenever displayedActivities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const polyline = polylineLayerRef.current;

    if (!map || !markersGroup || !polyline) return;

    markersGroup.clearLayers();
    const latLngs = [];

    displayedActivities.forEach((act, idx) => {
      if (!act.lat || !act.lng) return;
      const point = [act.lat, act.lng];
      latLngs.push(point);

      const isSelected = selectedPinId === act._id;
      const pinColor = isSelected ? '#FF4538' : (act.color || '#FF5B45');

      // Custom HTML Marker matching website theme
      const customIcon = L.divIcon({
        className: 'custom-trip-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, ${pinColor} 0%, #FF4538 100%);
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(255, 91, 69, 0.45);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              color: #FFFFFF;
              font-weight: 900;
              font-size: 11px;
              font-family: ui-sans-serif, system-ui, sans-serif;
            ">${idx + 1}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(point, { icon: customIcon });

      const popupContent = `
        <div style="padding: 6px; font-family: ui-sans-serif, system-ui, sans-serif; min-width: 170px;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #FF5B45; letter-spacing: 0.05em; margin-bottom: 2px;">
            Stop ${idx + 1} • Day ${act.day || 1}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.25; margin-bottom: 4px;">
            ${act.title}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
            📍 ${act.location || destination}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 700; color: #334155; border-top: 1px solid #F1F5F9; padding-top: 5px;">
            <span>⏱️ ${act.time || '10:00 AM'}</span>
            <span style="color: #0284C7; text-transform: capitalize;">${act.category || 'Sightseeing'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedPinId(act._id);
      });

      markersGroup.addLayer(marker);
    });

    polyline.setLatLngs(latLngs);

    // Auto-fit bounds if we have points
    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), {
        padding: [50, 50],
        maxZoom: 14
      });
    }
  }, [displayedActivities, selectedPinId, destination]);

  // Handle clicking stop from sidebar
  const handleSelectStop = (act) => {
    setSelectedPinId(act._id);
    if (mapInstanceRef.current && act.lat && act.lng) {
      mapInstanceRef.current.flyTo([act.lat, act.lng], 14, {
        duration: 0.8
      });
    }
  };

  // Recenter map to all points
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const pts = displayedActivities.filter(a => a.lat && a.lng).map(a => [a.lat, a.lng]);
    if (pts.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(pts), { padding: [50, 50] });
    } else {
      mapInstanceRef.current.setView([destCoords.lat, destCoords.lng], 12);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5B45]/10 border border-[#FF5B45]/20 flex items-center justify-center text-[#FF5B45]">
              <Compass className="w-4 h-4" />
            </div>
            <span>Interactive Trip Map — {destination}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Geographic view of all scheduled stops, routes, and day-by-day itineraries
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterDay === 'all'
                ? 'bg-gradient-to-r from-[#FF644E] to-[#FF4538] text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Days ({resolvedActivities.length})
          </button>
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setFilterDay(d.day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                Number(filterDay) === Number(d.day)
                  ? 'bg-gradient-to-r from-[#FF644E] to-[#FF4538] text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Leaflet Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#121927] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-shadow h-[520px] trip-map-container">
            {/* The Actual Leaflet Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Overlay Info Card (Top-Left) */}
            <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#121927]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">{destination}</span>
              <span className="text-[11px] font-bold text-[#FF5B45] font-mono">
                {displayedActivities.length} locations mapped
              </span>
            </div>

            {/* Recenter Map Button (Top-Right) */}
            <button
              onClick={handleRecenter}
              className="absolute top-4 right-14 z-10 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#121927]/90 hover:bg-white dark:hover:bg-[#1A2338] backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF5B45]" />
              <span className="hidden sm:inline">Recenter</span>
            </button>

            {/* Quick External Map Link (Bottom-Right) */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#121927]/90 hover:bg-white dark:hover:bg-[#1A2338] backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-md transition-all"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-[#FF5B45]" />
            </a>
          </div>
        </div>

        {/* Right Column: Stops List & Route Order (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/[0.08] p-5 shadow-sm flex flex-col h-[520px]">
            {/* Stops Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF5B45]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Route Stops</h3>
              </div>
              <span className="text-xs font-bold text-[#FF5B45] font-mono">
                {displayedActivities.length} stops
              </span>
            </div>

            {/* Stops Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {displayedActivities.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <MapPin className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  <p>No stops found for Day {filterDay}.</p>
                  <button
                    onClick={() => setFilterDay('all')}
                    className="text-xs font-bold text-[#FF5B45] hover:underline"
                  >
                    View All Days
                  </button>
                </div>
              ) : (
                displayedActivities.map((act, index) => {
                  const isSelected = selectedPinId === act._id;
                  return (
                    <div
                      key={act._id || index}
                      onClick={() => handleSelectStop(act)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-[#FFF5F3] dark:bg-[#FF5B45]/10 border-[#FF5B45] shadow-sm'
                          : 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Number Badge */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                            isSelected
                              ? 'bg-[#FF5B45] text-white'
                              : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Title & Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {act.title}
                            </span>
                            <span className="text-[10px] font-bold text-[#FF5B45] font-mono shrink-0">
                              {act.time || '10:00 AM'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {act.location || `${destination}`}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 ml-1 shrink-0">
                              Day {act.day || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Add Stop CTA */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] mt-2">
              <button
                onClick={() => openModal('addActivity', { day: filterDay === 'all' ? 1 : Number(filterDay) })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Stop to Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
