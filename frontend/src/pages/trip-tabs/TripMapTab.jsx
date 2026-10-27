import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Calendar, ExternalLink, Info } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const TripMapTab = () => {
  const { activeTrip, activities, selectedDay, setSelectedDay } = useTrip();
  const [filterDay, setFilterDay] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);

  const destination = activeTrip?.destination || 'Tokyo, Japan';

  // Filter activities based on day selection
  const displayedActivities = filterDay === 'all' 
    ? activities 
    : activities.filter(a => Number(a.day) === Number(filterDay));

  const days = activeTrip?.dayTabs || [
    { day: 1, label: 'Day 1' },
    { day: 2, label: 'Day 2' },
    { day: 3, label: 'Day 3' },
    { day: 4, label: 'Day 4' },
    { day: 5, label: 'Day 5' }
  ];

  // Map center coordinates depending on destination
  const getCoordinates = (dest) => {
    const d = (dest || '').toLowerCase();
    if (d.includes('tokyo')) return { lat: 35.6762, lng: 139.6503, zoom: 12 };
    if (d.includes('kyoto')) return { lat: 34.9858, lng: 135.7588, zoom: 12 };
    if (d.includes('paris')) return { lat: 48.8566, lng: 2.3522, zoom: 12 };
    return { lat: 35.6762, lng: 139.6503, zoom: 12 };
  };

  const coords = getCoordinates(destination);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span>Interactive Trip Map — {destination}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic view of all scheduled stops, routes, and day-by-day itineraries
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterDay === 'all'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Days ({activities.length})
          </button>
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setFilterDay(d.day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterDay === d.day
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Display (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#121927] border border-white/[0.08] shadow-2xl h-[520px] flex items-center justify-center">
            {/* Embedded interactive map iframe with dark/satellite view */}
            <iframe
              title="Destination Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.15}%2C${coords.lat - 0.1}%2C${coords.lng + 0.15}%2C${coords.lat + 0.1}&layer=mapnik`}
            />

            {/* Overlay Info Card */}
            <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-[#121927]/90 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">{destination}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {displayedActivities.length} locations mapped
              </span>
            </div>

            {/* Quick External Map Link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121927]/90 hover:bg-[#18233C] backdrop-blur-md border border-white/10 text-xs font-semibold text-white shadow-lg transition-all"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </a>
          </div>
        </div>

        {/* Right Column: Stops List & Route Order (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-3xl bg-[#121927] border border-white/[0.08] p-5 shadow-xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Route Stops</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {displayedActivities.length} stops
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {displayedActivities.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No stops found for this selection.
                </div>
              ) : (
                displayedActivities.map((act, index) => (
                  <div
                    key={act._id || index}
                    onClick={() => setSelectedPin(act)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedPin?._id === act._id
                        ? 'bg-blue-500/20 border-blue-500/40'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: act.color || '#3B82F6' }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-white truncate">
                            {act.title}
                          </span>
                          <span className="text-[10px] text-blue-300 font-mono shrink-0">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {act.location || `${destination} Central`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
