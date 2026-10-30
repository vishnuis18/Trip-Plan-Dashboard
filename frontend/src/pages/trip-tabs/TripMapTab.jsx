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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../../context/TripContext';

// Landmark geocoding registry for global destinations
const LANDMARK_COORDS = {
  // Russia (Moscow, St Petersburg & landmarks)
  'russia': { lat: 55.7558, lng: 37.6173, zoom: 11 },
  'moscow': { lat: 55.7558, lng: 37.6173, zoom: 11 },
  'red square': { lat: 55.7539, lng: 37.6208 },
  'kremlin': { lat: 55.7520, lng: 37.6175 },
  'st basil': { lat: 55.7525, lng: 37.6231 },
  'bolshoi': { lat: 55.7602, lng: 37.6186 },
  'gorky park': { lat: 55.7297, lng: 37.6015 },
  'arbat': { lat: 55.7494, lng: 37.5919 },
  'sky diving': { lat: 55.7890, lng: 37.6450 },
  'skydiving': { lat: 55.7890, lng: 37.6450 },
  'saint petersburg': { lat: 59.9343, lng: 30.3351, zoom: 12 },
  'st petersburg': { lat: 59.9343, lng: 30.3351, zoom: 12 },
  'hermitage': { lat: 59.9398, lng: 30.3146 },
  'kazan': { lat: 55.7961, lng: 49.1064, zoom: 12 },
  'sochi': { lat: 43.5855, lng: 39.7231, zoom: 12 },

  // Tokyo
  'tokyo': { lat: 35.6762, lng: 139.6503, zoom: 12 },
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
  'kyoto': { lat: 35.0116, lng: 135.7681, zoom: 12 },
  'gion': { lat: 35.0037, lng: 135.7772 },
  'arashiyama': { lat: 35.0116, lng: 135.6777 },
  'fushimi inari': { lat: 34.9671, lng: 135.7727 },
  'kinkaku-ji': { lat: 35.0394, lng: 135.7292 },
  'kiyomizu-dera': { lat: 34.9949, lng: 135.7850 },
  'nijo castle': { lat: 35.0142, lng: 135.7482 },

  // India
  'india': { lat: 20.5937, lng: 78.9629, zoom: 5 },
  'goa': { lat: 15.2993, lng: 74.1240, zoom: 11 },
  'panaji': { lat: 15.4909, lng: 73.8278 },
  'baga': { lat: 15.5553, lng: 73.7516 },
  'delhi': { lat: 28.6139, lng: 77.2090, zoom: 11 },
  'mumbai': { lat: 19.0760, lng: 72.8777, zoom: 11 },
  'jaipur': { lat: 26.9124, lng: 75.7873, zoom: 11 },
  'taj mahal': { lat: 27.1751, lng: 78.0421 },
  'bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 11 },

  // Global capitals
  'paris': { lat: 48.8566, lng: 2.3522, zoom: 12 },
  'london': { lat: 51.5074, lng: -0.1278, zoom: 12 },
  'new york': { lat: 40.7128, lng: -74.0060, zoom: 12 },
  'rome': { lat: 41.9028, lng: 12.4964, zoom: 12 },
  'bali': { lat: -8.4095, lng: 115.1889, zoom: 11 },
  'singapore': { lat: 1.3521, lng: 103.8198, zoom: 12 },
  'bangkok': { lat: 13.7563, lng: 100.5018, zoom: 12 },
  'dubai': { lat: 25.2048, lng: 55.2708, zoom: 12 }
};

// Destination coordinates lookup
const getDestinationCenter = (destName) => {
  const clean = (destName || '').toLowerCase().trim();
  for (const [key, coords] of Object.entries(LANDMARK_COORDS)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return { lat: coords.lat, lng: coords.lng, zoom: coords.zoom || 12 };
    }
  }
  // Default fallback
  return { lat: 55.7558, lng: 37.6173, zoom: 11 };
};

// Deterministic coordinate dispersal for unmapped stops
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
  const [mapStyle, setMapStyle] = useState('canvas'); // 'canvas' | 'streets' | 'satellite'

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);

  const destination = activeTrip?.destination || activeTrip?.title || 'Russia';
  const destCoords = useMemo(() => getDestinationCenter(destination), [destination]);

  // Curated fallback itinerary spots if trip currently has no activities
  const fallbackStops = useMemo(() => {
    const destLower = destination.toLowerCase();
    if (destLower.includes('russia') || destLower.includes('moscow')) {
      return [
        { _id: 'stop_1', day: 1, title: 'Red Square & St. Basil Cathedral', location: 'Red Square, Moscow', time: '10:00 AM', category: 'sightseeing', color: '#FF5B45', lat: 55.7539, lng: 37.6208 },
        { _id: 'stop_2', day: 1, title: 'Moscow Kremlin & Armoury Chamber', location: 'Kremlin, Moscow', time: '02:00 PM', category: 'culture', color: '#10B981', lat: 55.7520, lng: 37.6175 },
        { _id: 'stop_3', day: 2, title: 'Bolshoi Historic Theatre', location: 'Teatralnaya Sq, Moscow', time: '11:00 AM', category: 'culture', color: '#3B82F6', lat: 55.7602, lng: 37.6186 },
        { _id: 'stop_4', day: 2, title: 'Gorky Central Park & Moskva River', location: 'Krymsky Val, Moscow', time: '04:30 PM', category: 'sightseeing', color: '#8B5CF6', lat: 55.7297, lng: 37.6015 }
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
      // Activity with explicit coordinates
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

      if (matchedCoord) {
        return {
          ...act,
          lat: matchedCoord.lat,
          lng: matchedCoord.lng,
          index: index + 1
        };
      }

      // Natural deterministic coordinate dispersal around destination center
      const seed = hashString(act.title || String(index));
      const latOffset = ((seed % 100) - 50) * 0.0007;
      const lngOffset = (((seed >> 3) % 100) - 50) * 0.0007;

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
    return resolvedActivities.filter((a) => Number(a.day) === Number(filterDay));
  }, [resolvedActivities, filterDay]);

  // Trip Days list
  const days = useMemo(() => {
    if (activeTrip?.dayTabs && activeTrip.dayTabs.length > 0) {
      return activeTrip.dayTabs;
    }
    const count = activeTrip?.nights ? activeTrip.nights + 1 : 7;
    return Array.from({ length: count }, (_, i) => ({
      day: i + 1,
      label: `Day ${i + 1}`,
      sublabel: i === 0 ? 'Arrival' : i === count - 1 ? 'Departure' : 'Explore'
    }));
  }, [activeTrip]);

  // Days with active stops
  const daysWithStops = useMemo(() => {
    const set = new Set();
    resolvedActivities.forEach((a) => {
      if (a.day) set.add(Number(a.day));
    });
    return set;
  }, [resolvedActivities]);

  // Determine Tile Provider (NO API KEY REQUIRED, ZERO WATERMARKS)
  const getTileConfig = (style) => {
    const isLight = document.documentElement.classList.contains('light-theme') || 
                    localStorage.getItem('tripplan_theme') === 'light';

    if (style === 'streets') {
      return {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
      };
    }
    if (style === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 18, attribution: '&copy; Esri, Earthstar' }
      };
    }
    // Default 'canvas' (ESRI World Light/Dark Gray Base)
    return {
      url: isLight
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      options: { maxZoom: 16, attribution: '&copy; Esri Canvas' }
    };
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [destCoords.lat, destCoords.lng],
        zoom: destCoords.zoom || 11,
        zoomControl: false,
        attributionControl: false
      });

      const tileCfg = getTileConfig(mapStyle);
      tileLayerRef.current = L.tileLayer(tileCfg.url, tileCfg.options).addTo(map);

      // Custom Zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      polylineLayerRef.current = L.polyline([], {
        color: '#FF5B45',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([destCoords.lat, destCoords.lng], destCoords.zoom || 11);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destCoords]);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileCfg = getTileConfig(mapStyle);
    tileLayerRef.current = L.tileLayer(tileCfg.url, tileCfg.options).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Update Markers and Polyline when displayedActivities or selectedPinId changes
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
      const pinColor = isSelected ? '#FF3D2E' : (act.color || '#FF5B45');

      // Custom Leaflet DivIcon with website theme
      const customIcon = L.divIcon({
        className: 'custom-trip-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, ${pinColor} 0%, #FF3D2E 100%);
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(255, 91, 69, ${isSelected ? '0.7' : '0.45'});
            cursor: pointer;
            transform-origin: 50% 50%;
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
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      const marker = L.marker(point, { icon: customIcon });

      const popupContent = `
        <div style="padding: 6px; font-family: ui-sans-serif, system-ui, sans-serif; min-width: 180px;">
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
            <span style="color: #FF5B45; text-transform: capitalize;">${act.category || 'Sightseeing'}</span>
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

    // Auto-fit bounds when stops exist
    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), {
        padding: [60, 60],
        maxZoom: 14
      });
    } else {
      map.setView([destCoords.lat, destCoords.lng], destCoords.zoom || 11);
    }
  }, [displayedActivities, selectedPinId, destCoords, destination]);

  // Recenter Map
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (displayedActivities.length > 0) {
      const validPoints = displayedActivities.filter((a) => a.lat && a.lng).map((a) => [a.lat, a.lng]);
      if (validPoints.length > 0) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(validPoints), { padding: [60, 60], maxZoom: 14 });
        return;
      }
    }
    mapInstanceRef.current.setView([destCoords.lat, destCoords.lng], destCoords.zoom || 11);
  };

  // Select Stop from list
  const handleSelectStop = (act) => {
    setSelectedPinId(act._id);
    if (mapInstanceRef.current && act.lat && act.lng) {
      mapInstanceRef.current.flyTo([act.lat, act.lng], 14, { duration: 0.8 });
      markersLayerRef.current?.eachLayer((marker) => {
        const markerPos = marker.getLatLng();
        if (Math.abs(markerPos.lat - act.lat) < 0.0001 && Math.abs(markerPos.lng - act.lng) < 0.0001) {
          marker.openPopup();
        }
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-5">
      {/* Top Header & Day Navigator */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5B45]/10 text-[#FF5B45] flex items-center justify-center border border-[#FF5B45]/20">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Trip Map — {destination}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Geographic view of scheduled stops, routes, and day-by-day itineraries
          </p>
        </div>

        {/* Smart Day Filter Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* All Days button */}
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
              filterDay === 'all'
                ? 'bg-gradient-to-r from-[#FF5B45] to-[#FF4530] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
            }`}
          >
            All Stops ({resolvedActivities.length})
          </button>

          {/* For small trips (<= 6 days): Display segmented pills */}
          {days.length <= 6 ? (
            days.map((d) => (
              <button
                key={d.day}
                onClick={() => setFilterDay(d.day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  Number(filterDay) === Number(d.day)
                    ? 'bg-[#FF5B45] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                }`}
              >
                Day {d.day}
              </button>
            ))
          ) : (
            /* For large trips (> 6 days): Clean Day Combobox Selector & Quick Jump */
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#18233C]/60">
                <button
                  disabled={filterDay === 'all' || Number(filterDay) <= 1}
                  onClick={() => setFilterDay(prev => prev === 'all' ? 1 : Math.max(1, Number(prev) - 1))}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <select
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-white px-2.5 py-1.5 outline-none cursor-pointer border-none"
                >
                  <option value="all">All Days ({resolvedActivities.length} stops)</option>
                  {days.map((d) => {
                    const hasStops = daysWithStops.has(Number(d.day));
                    const actsCount = (activities || []).filter(a => Number(a.day) === Number(d.day)).length;
                    return (
                      <option key={d.day} value={d.day}>
                        Day {d.day} {hasStops ? `(${actsCount || 1} stop)` : '(0 stops)'}
                      </option>
                    );
                  })}
                </select>

                <button
                  disabled={filterDay === 'all' || Number(filterDay) >= days.length}
                  onClick={() => setFilterDay(prev => prev === 'all' ? 1 : Math.min(days.length, Number(prev) + 1))}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump to Day 22 / Days with stops */}
              {Array.from(daysWithStops).map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => setFilterDay(dayNum)}
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    Number(filterDay) === Number(dayNum)
                      ? 'bg-[#FF5B45] text-white border-[#FF5B45]'
                      : 'bg-[#FF5B45]/10 hover:bg-[#FF5B45]/20 text-[#FF5B45] border-[#FF5B45]/20'
                  }`}
                  title={`View Day ${dayNum} stops`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Day {dayNum}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Map & Stops Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#121927] border border-slate-200/90 dark:border-white/[0.08] shadow-xs h-[560px] trip-map-container">
            {/* The Actual Leaflet Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Overlay Info Card (Top-Left) */}
            <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#121927]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-md flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">{destination}</span>
              <span className="text-[11px] font-bold text-[#FF5B45] font-mono">
                {displayedActivities.length} {displayedActivities.length === 1 ? 'stop mapped' : 'stops mapped'}
              </span>
            </div>

            {/* Top-Right Control Toolbar: Layer Switcher & Recenter */}
            <div className="absolute top-4 right-14 z-10 flex items-center gap-2">
              {/* Map Layer Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-white/95 dark:bg-[#121927]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-md text-[11px] font-bold">
                <button
                  onClick={() => setMapStyle('canvas')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mapStyle === 'canvas'
                      ? 'bg-[#FF5B45] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Canvas
                </button>
                <button
                  onClick={() => setMapStyle('streets')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mapStyle === 'streets'
                      ? 'bg-[#FF5B45] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Streets
                </button>
                <button
                  onClick={() => setMapStyle('satellite')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    mapStyle === 'satellite'
                      ? 'bg-[#FF5B45] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* Recenter Button */}
              <button
                onClick={handleRecenter}
                className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#121927]/95 hover:bg-white dark:hover:bg-[#18233C] backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF5B45]" />
                <span className="hidden sm:inline">Recenter</span>
              </button>
            </div>

            {/* Quick External Map Link (Bottom-Right) */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#121927]/95 hover:bg-white dark:hover:bg-[#18233C] backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-md transition-all"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-[#FF5B45]" />
            </a>
          </div>
        </div>

        {/* Right Column: Route Stops List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-3xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-white/[0.08] p-5 shadow-xs flex flex-col h-[560px]">
            {/* Stops Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FF5B45]/10 flex items-center justify-center text-[#FF5B45]">
                  <Navigation className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Route Stops</h3>
              </div>
              <span className="text-xs font-bold text-[#FF5B45] font-mono">
                {displayedActivities.length} {displayedActivities.length === 1 ? 'stop' : 'stops'}
              </span>
            </div>

            {/* Stops Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 cal-scrollbar">
              {displayedActivities.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      No stops found for Day {filterDay}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                      There are no activities scheduled for this day yet.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2 w-full max-w-[180px]">
                    <button
                      onClick={() => setFilterDay('all')}
                      className="text-xs font-bold text-[#FF5B45] hover:underline"
                    >
                      View All Days ({resolvedActivities.length})
                    </button>
                    <button
                      onClick={() => openModal('addActivity', { day: filterDay === 'all' ? 1 : Number(filterDay) })}
                      className="px-3 py-1.5 rounded-xl bg-[#FF5B45]/10 hover:bg-[#FF5B45]/20 text-[#FF5B45] text-xs font-bold border border-[#FF5B45]/20 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Stop to Day {filterDay}</span>
                    </button>
                  </div>
                </div>
              ) : (
                displayedActivities.map((act, index) => {
                  const isSelected = selectedPinId === act._id;
                  return (
                    <div
                      key={act._id || index}
                      onClick={() => handleSelectStop(act)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-[#FFF5F3] dark:bg-[#FF5B45]/10 border-[#FF5B45] shadow-xs'
                          : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Number Badge */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
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
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate capitalize">
                              {act.title}
                            </span>
                            <span className="text-[10px] font-bold text-[#FF5B45] font-mono shrink-0">
                              {act.time || '10:00 AM'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate">{act.location || `${destination}`}</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300 ml-1 shrink-0">
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
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5B45] to-[#FF4530] hover:from-[#FF4530] hover:to-[#E03420] text-white text-xs font-bold shadow-md shadow-[#FF5B45]/20 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-95"
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
