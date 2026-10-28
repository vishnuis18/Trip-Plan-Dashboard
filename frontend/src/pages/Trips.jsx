import React from 'react';
import { Plane, Plus, Calendar, Users, MapPin, Check, Trash2, ArrowRight, Star } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Trips = ({ setActiveTab }) => {
  const { trips, activeTrip, switchTrip, deleteTrip, openModal } = useTrip();

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Trips</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your past, current, and upcoming travel itineraries
          </p>
        </div>

        <button
          onClick={() => openModal('addTrip')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="py-16 text-center rounded-3xl explore-sample-card flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#FF5B45]">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No trips created yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Start planning your next adventure by creating a new trip.
          </p>
          <button
            onClick={() => openModal('addTrip')}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const isActive = String(trip._id) === String(activeTrip?._id);
            const nightCount = trip.nights || 5;

            return (
              <div
                key={trip._id}
                className={`explore-sample-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${
                  isActive ? 'ring-2 ring-[#FF5B45] border-transparent' : ''
                }`}
              >
                {/* Top Photo & Diagonal Active Ribbon */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={trip.coverImage || '/images/mount_fuji.jpg'}
                    alt={trip.destination}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/mount_fuji.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Diagonal Ribbon for Active Trip (Matching Sample Card) */}
                  {isActive ? (
                    <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                      <div className="absolute transform -rotate-45 bg-gradient-to-r from-[#FF644E] to-[#FF4538] text-white text-[9px] font-black tracking-wider py-1 left-[-32px] top-[18px] w-[120px] text-center shadow-md uppercase">
                        ACTIVE TRIP
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                      <div className="absolute transform -rotate-45 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-[8px] font-bold tracking-wider py-1 left-[-32px] top-[18px] w-[120px] text-center shadow-md uppercase opacity-80">
                        ITINERARY
                      </div>
                    </div>
                  )}

                  {/* Flight Plane Icon Badge (Top-Right Floating Pill) */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 dark:bg-black/55 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-white/80 shadow-sm z-10">
                    <Plane className="w-4 h-4 transform -rotate-45 text-[#FF5B45]" />
                  </div>
                </div>

                {/* Card Body - Matching Sample Layout */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                  <div>
                    {/* Row 1: Destination Title uppercase in primary sky blue + Nights in warm coral */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="explore-card-title text-sm font-bold uppercase tracking-tight text-sky-700 dark:text-sky-400 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                        {trip.destination}
                      </h4>
                      <span className="text-[11px] font-bold text-[#FF5B45] dark:text-[#FF8A65] whitespace-nowrap shrink-0">
                        {nightCount} Nights
                      </span>
                    </div>

                    {/* Row 2: 5 Stars + Formatted Travel Dates */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        {trip.datesFormatted || 'Custom Itinerary'}
                      </span>
                    </div>

                    {/* Row 3: Description with ... More */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {trip.destination ? `Curated travel itinerary for ${trip.destination} with daily schedules, handpicked activities, and budget tracking.` : 'Comprehensive travel plan with scheduled itineraries, expenses, and curated spots.'}
                      <span
                        onClick={() => setActiveTab('dashboard')}
                        className="text-sky-600 dark:text-sky-400 font-medium ml-1 cursor-pointer hover:underline"
                      >
                        ... More
                      </span>
                    </p>

                    {/* Row 4: Travelers Line with Users Icon (Matching Sample Room / Flight line) */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                      <Users className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                      <span className="truncate">
                        Travelers: <strong className="font-semibold text-slate-700 dark:text-slate-300">{trip.travelersText || `${trip.travelers || 2} People`}</strong> • Confirmed
                      </span>
                    </div>

                    {/* Row 5: Airport / Arrival Line with MapPin Icon (Matching Sample View on Map line) */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                        {trip.airport || 'Nearest International Airport'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Total Budget & Action Button */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 dark:border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
                        Total Budget
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                        ${(trip.totalBudget || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className="explore-cta-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                          <span>Open in Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => switchTrip(trip._id)}
                          className="trip-switch-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Set as Active</span>
                        </button>
                      )}

                      {trips.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${trip.destination}?`)) {
                              deleteTrip(trip._id);
                            }
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
