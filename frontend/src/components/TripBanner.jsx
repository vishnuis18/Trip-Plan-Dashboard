import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Users, 
  Moon, 
  CreditCard, 
  MapPin, 
  Plane, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Compass 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { fetchDestinationWeather } from '../services/weatherService';

export const TripBanner = ({ onTripCardClick }) => {
  const { activeTrip } = useTrip();
  const { user } = useAuth();

  const hasTrip = !!activeTrip;
  const destination = activeTrip?.destination || 'No active trip';
  const dates = activeTrip?.datesFormatted || 'Create a trip to get started';
  const travelers = activeTrip?.travelersText || (activeTrip?.travelers ? `${activeTrip.travelers} People` : '—');
  const nights = activeTrip?.nights ? `${activeTrip.nights} Nights` : '—';
  const currencySymbol = activeTrip?.currency === 'EUR' ? '€' : activeTrip?.currency === 'GBP' ? '£' : activeTrip?.currency === 'JPY' ? '¥' : activeTrip?.currency === 'INR' ? '₹' : '$';
  const budget = activeTrip?.totalBudget ? `${currencySymbol}${activeTrip.totalBudget.toLocaleString()}` : `${currencySymbol}0`;
  const airport = activeTrip?.airport || '—';
  const userName = user?.name || 'Traveler';

  // Live countdown calculation
  const [countdownText, setCountdownText] = useState('');
  const [countdownStatus, setCountdownStatus] = useState('upcoming'); // upcoming, ongoing, past

  // Live weather for the banner pill
  const [bannerWeather, setBannerWeather] = useState(null);

  useEffect(() => {
    if (!activeTrip) {
      setCountdownText('');
      return;
    }

    const calculateCountdown = () => {
      const now = new Date();
      const start = activeTrip.startDate ? new Date(activeTrip.startDate) : new Date(Date.now() + 18 * 86400000);
      const end = activeTrip.endDate ? new Date(activeTrip.endDate) : new Date(start.getTime() + (activeTrip.nights || 5) * 86400000);

      const diffStart = start.getTime() - now.getTime();
      const diffEnd = end.getTime() - now.getTime();

      if (diffStart > 0) {
        const days = Math.floor(diffStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setCountdownStatus('upcoming');
        setCountdownText(days > 0 ? `Starts in ${days}d ${hours}h` : `Starts today in ${hours}h`);
      } else if (diffEnd > 0) {
        setCountdownStatus('ongoing');
        setCountdownText('Trip in Progress');
      } else {
        setCountdownStatus('past');
        setCountdownText('Trip Completed');
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [activeTrip]);

  // Load weather for destination banner pill
  useEffect(() => {
    let isMounted = true;
    if (activeTrip?.destination) {
      fetchDestinationWeather(activeTrip.destination).then((w) => {
        if (isMounted) setBannerWeather(w);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeTrip?.destination]);

  return (
    <div className="relative rounded-3xl overflow-hidden min-h-[290px] p-8 flex flex-col justify-between border border-white/10 shadow-2xl group trip-hero-banner">
      {/* Background Trip Banner Image */}
      <img
        src={activeTrip?.coverImage || '/images/mount_fuji.jpg'}
        alt={destination}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/images/mount_fuji.jpg';
        }}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 brightness-[0.78] contrast-[1.08]"
      />
      {/* Photographic Gradient Overlays for perfect legibility in all themes */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

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

      {/* Pill Stats Row with Countdown & Live Weather */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 mt-6 pt-2">
        {/* Departure Countdown Timer */}
        {countdownText && (
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold shadow-sm transition-all ${
            countdownStatus === 'upcoming'
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
              : countdownStatus === 'ongoing'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-white/10 border-white/10 text-slate-300'
          }`}>
            {countdownStatus === 'upcoming' && <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />}
            {countdownStatus === 'ongoing' && <Compass className="w-3.5 h-3.5 text-emerald-400" />}
            {countdownStatus === 'past' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{countdownText}</span>
          </div>
        )}

        {/* Live Weather Pill */}
        {bannerWeather && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 shadow-sm">
            <span>{bannerWeather.iconEmoji}</span>
            <span>{bannerWeather.currentTemp}°C {bannerWeather.condition}</span>
          </div>
        )}

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
