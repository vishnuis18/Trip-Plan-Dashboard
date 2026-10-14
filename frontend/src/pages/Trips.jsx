import React from 'react';
import { Plane, Plus, Calendar, Users, DollarSign, MapPin, Check, Trash2, ArrowRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Trips = ({ setActiveTab }) => {
  const { trips, activeTrip, switchTrip, deleteTrip, openModal } = useTrip();

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">My Trips</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your past, current, and upcoming travel itineraries
          </p>
        </div>

        <button
          onClick={() => openModal('addTrip')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#121927] border border-white/[0.08] flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <h3 className="text-base font-bold text-white">No trips created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Start planning your next adventure by creating a new trip.
          </p>
          <button
            onClick={() => openModal('addTrip')}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const isActive = String(trip._id) === String(activeTrip?._id);
            return (
              <div
                key={trip._id}
                className={`rounded-3xl overflow-hidden bg-[#121927] border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isActive
                    ? 'border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Cover Image & Active Pill */}
                <div className="h-44 relative overflow-hidden group">
                  <img
                    src={trip.coverImage || '/images/mount_fuji.jpg'}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-black/30" />

                  {isActive && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                      <Check className="w-3 h-3" />
                      <span>Active Trip</span>
                    </span>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {trip.destination}
                    </h3>
                    <span className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {trip.datesFormatted}
                    </span>
                  </div>
                </div>

                {/* Trip Stats Body */}
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-[10px] text-slate-400 block">Travelers</span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">
                        {trip.travelersText || `${trip.travelers} People`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-[10px] text-slate-400 block">Budget</span>
                      <span className="font-semibold text-emerald-400 mt-0.5 block font-mono">
                        ${trip.totalBudget?.toLocaleString() || '0'}
                      </span>
                    </div>

                    <div className="col-span-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-2">
                      <Plane className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-slate-300 text-[11px] truncate">{trip.airport || 'No airport set'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06] mt-2">
                    {!isActive ? (
                      <button
                        onClick={() => switchTrip(trip._id)}
                        className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-all text-center"
                      >
                        Set as Active Trip
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Open in Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {trips.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${trip.destination}?`)) {
                            deleteTrip(trip._id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
