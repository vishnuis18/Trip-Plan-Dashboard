import React from 'react';
import { Sun, Users, Moon, CreditCard, MapPin, Plane, ChevronRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const TripBanner = ({ onTripCardClick }) => {
  const { activeTrip } = useTrip();
  const { user } = useAuth();

  const hasTrip = !!activeTrip;
  const destination = activeTrip?.destination || 'No active trip';
  const dates = activeTrip?.datesFormatted || 'Create a trip to get started';
  const travelers = activeTrip?.travelersText || (activeTrip?.travelers ? `${activeTrip.travelers} People` : '—');
  const nights = activeTrip?.nights ? `${activeTrip.nights} Nights` : '—';
  const budget = activeTrip?.totalBudget ? `$${activeTrip.totalBudget.toLocaleString()}` : '$0';
  const airport = activeTrip?.airport || '—';
  const userName = user?.name || 'Traveler';

  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[290px] p-8 flex flex-col justify-between border border-white/10 shadow-2xl group">
      {/* Background Fuji Image */}
      <img
        src="/images/mount_fuji.jpg"
        alt="Mount Fuji Sunset"
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 brightness-[0.78] contrast-[1.08]"
      />
      {/* Gradient Overlays for readability and exact aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E17]/90 via-[#0B0E17]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17]/95 via-transparent to-[#0B0E17]/20" />

      {/* Floating 'Your next trip' Glass Card (Top Right) */}
      <div 
        onClick={onTripCardClick}
        className="absolute top-6 right-6 z-10 flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#141B2D]/70 hover:bg-[#141B2D]/90 backdrop-blur-xl border border-white/15 hover:border-blue-400/50 shadow-2xl transition-all cursor-pointer group/card"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover/card:bg-blue-500/20 transition-colors">
          <Plane className="w-5 h-5 text-blue-400 transform -rotate-45" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-300 block leading-tight">
            {hasTrip ? 'Your next trip' : 'Plan a trip'}
          </span>
          <h4 className="text-sm font-bold text-white leading-snug">{destination}</h4>
          <span className="text-[11px] text-slate-400">{dates}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover/card:text-white group-hover/card:translate-x-0.5 transition-all ml-1" />
      </div>

      {/* Main Banner Headline Content */}
      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            Good morning, {userName}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Plan your next{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            adventure
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300/90 font-normal mt-2 leading-relaxed max-w-lg">
          Discover new places, manage your budget, and create unforgettable memories.
        </p>
      </div>

      {/* Pill Stats Row */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 mt-6 pt-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>{travelers}</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm">
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{nights}</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm">
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>{budget} Budget</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{airport}</span>
        </div>
      </div>
    </div>
  );
};
