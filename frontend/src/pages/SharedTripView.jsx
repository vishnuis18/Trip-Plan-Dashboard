import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Calendar, 
  MapPin, 
  Users, 
  Moon, 
  CreditCard, 
  Clock, 
  Check, 
  Copy, 
  ArrowLeft, 
  Sparkles, 
  ExternalLink,
  Compass
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useTrip } from '../context/TripContext';
import confetti from 'canvas-confetti';

export const SharedTripView = ({ slugOrId, onBackToApp }) => {
  const { loadData } = useTrip();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCloning, setIsCloning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        setLoading(true);
        const res = await api.getSharedTrip(slugOrId || 'active');
        if (res?.trip) {
          setTrip(res.trip);
          setActivities(res.activities || []);
        }
      } catch (err) {
        console.error('Error fetching shared trip:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [slugOrId]);

  const handleCloneTrip = async () => {
    if (!trip) return;
    try {
      setIsCloning(true);
      await api.createTrip({
        title: `${trip.destination} (Shared Copy)`,
        destination: trip.destination,
        startDate: trip.startDate || new Date().toISOString().split('T')[0],
        endDate: trip.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        travelers: trip.travelers || 2,
        nights: trip.nights || 4,
        totalBudget: trip.totalBudget || 3000,
        currency: trip.currency || 'USD',
        airport: trip.airport || 'Nearest Airport',
        coverImage: trip.coverImage,
        isActive: true
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      if (loadData) await loadData();
      if (onBackToApp) onBackToApp();
    } catch (err) {
      console.error('Error cloning trip:', err);
      alert('Failed to clone trip: ' + err.message);
    } finally {
      setIsCloning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E17] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center animate-spin text-blue-400">
          <Compass className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-400">Loading shared trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#0B0E17] text-white flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h3 className="text-lg font-bold">Trip Not Found or Link Expired</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          The trip you are trying to view might have been removed or the link is invalid.
        </p>
        <button
          onClick={onBackToApp}
          className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const days = trip.dayTabs || [
    { day: 1, label: 'Day 1', sublabel: 'Arrival' },
    { day: 2, label: 'Day 2', sublabel: 'Explore' },
    { day: 3, label: 'Day 3', sublabel: 'Highlights' },
    { day: 4, label: 'Day 4', sublabel: 'Adventure' },
    { day: 5, label: 'Day 5', sublabel: 'Departure' }
  ];

  const currentActivities = activities.filter((a) => Number(a.day) === Number(selectedDay));

  return (
    <div className="min-h-screen bg-[#0B0E17] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="w-full bg-[#121927]/90 border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Plane className="w-4 h-4 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">TripPlan</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                Read-Only Shared View
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Created by Shihab</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleCloneTrip}
            disabled={isCloning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isCloning ? 'Copying...' : 'Clone to My Trips'}</span>
          </button>

          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to App</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto p-6 w-full flex flex-col gap-6">
        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden min-h-[260px] p-8 flex flex-col justify-between border border-white/10 shadow-2xl">
          <img
            src={trip.coverImage || '/images/mount_fuji.jpg'}
            alt={trip.destination}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-black/20" />

          <div className="relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-500/40 text-blue-300">
              Shared Travel Itinerary
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
              {trip.title || trip.destination}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {trip.datesFormatted || 'Upcoming Adventure'} • {trip.destination}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs text-slate-200 border border-white/10">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{trip.travelersText || `${trip.travelers || 2} People`}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs text-slate-200 border border-white/10">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{trip.nights || 4} Nights</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs text-slate-200 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{trip.airport || 'Nearest Airport'}</span>
            </div>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((item) => {
            const isSelected = Number(selectedDay) === Number(item.day);
            const actsCount = activities.filter((a) => Number(a.day) === Number(item.day)).length;
            return (
              <button
                key={item.day}
                onClick={() => setSelectedDay(item.day)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center border transition-all min-w-[120px] shrink-0 ${
                  isSelected
                    ? 'bg-[#18233C] text-white border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-[#121927] text-slate-400 border-white/[0.06] hover:bg-[#162033] hover:text-white'
                }`}
              >
                <span className="text-sm font-bold">{item.label}</span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-300 font-semibold' : 'text-slate-400'}`}>
                  {item.sublabel}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">{actsCount} activities</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Activities */}
        <div className="rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">
              Day {selectedDay} Schedule
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {currentActivities.length} items
            </span>
          </div>

          {currentActivities.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No scheduled activities recorded for Day {selectedDay}.
            </div>
          ) : (
            <div className="space-y-3">
              {currentActivities.map((act) => (
                <div
                  key={act._id || act.id}
                  className="p-4 rounded-2xl bg-[#18233C]/60 border border-white/[0.06] flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                      {act.time}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {act.category || 'Sightseeing'}
                        </span>
                        {act.location && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-[11px] text-slate-300">{act.location}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{act.title}</h4>
                      {act.notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">"{act.notes}"</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono shrink-0">
                    {act.duration || '60m'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
