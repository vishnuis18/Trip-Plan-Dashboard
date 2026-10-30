import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3,
  Plane,
  Sparkles,
  RefreshCw,
  X,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Compass,
  Utensils,
  ShoppingBag,
  Layers,
  Tag,
  Check,
  Wallet,
  Sparkle
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { api } from '../api/apiClient';
import confetti from 'canvas-confetti';

// Category metadata helper
const getCategoryInfo = (cat) => {
  const c = (cat || 'sightseeing').toLowerCase();
  switch (c) {
    case 'food':
    case 'dining':
      return { 
        label: 'Food & Dining', 
        icon: Utensils, 
        badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
      };
    case 'transit':
    case 'transport':
      return { 
        label: 'Transit', 
        icon: Plane, 
        badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
      };
    case 'nightlife':
      return { 
        label: 'Nightlife', 
        icon: Sparkles, 
        badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
      };
    case 'culture':
    case 'history':
      return { 
        label: 'Culture & Art', 
        icon: CalendarDays, 
        badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
      };
    case 'shopping':
      return { 
        label: 'Shopping', 
        icon: ShoppingBag, 
        badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
      };
    case 'accommodation':
    case 'hotel':
      return { 
        label: 'Stay', 
        icon: Layers, 
        badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' 
      };
    case 'sightseeing':
    default:
      return { 
        label: 'Sightseeing', 
        icon: Compass, 
        badgeBg: 'bg-[#FF5B45]/10 text-[#FF5B45] border-[#FF5B45]/20' 
      };
  }
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ItineraryPage = () => {
  const { 
    activeTrip, 
    activities, 
    selectedDay, 
    setSelectedDay, 
    deleteActivity, 
    editActivity, 
    openModal 
  } = useTrip();

  // View modes: 'month' (default from sample image), 'week', 'timeline'
  const [viewMode, setViewMode] = useState('month');
  const [showCompleted, setShowCompleted] = useState(true);

  // Compute Trip Start Date safely
  const tripStartDate = useMemo(() => {
    if (activeTrip?.startDate) {
      const parts = activeTrip.startDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new Date(y, m, d);
        }
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [activeTrip?.startDate]);

  // Total trip days
  const totalDays = useMemo(() => {
    if (activeTrip?.dayTabs && activeTrip.dayTabs.length > 0) {
      return activeTrip.dayTabs.length;
    }
    if (activeTrip?.nights) {
      return activeTrip.nights + 1;
    }
    return 7;
  }, [activeTrip]);

  // Map each trip day (1..N) to its Date and YYYY-MM-DD string
  const { tripDaysByDate, tripDatesByDay } = useMemo(() => {
    const byDate = {};
    const byDay = {};

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(tripStartDate);
      d.setDate(tripStartDate.getDate() + (i - 1));
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${dt}`;

      const tab = activeTrip?.dayTabs?.find((t) => Number(t.day) === i);
      const isFirstDay = i === 1;
      const isLastDay = i === totalDays;

      const dayData = {
        day: i,
        label: tab?.label || `Day ${i}`,
        sublabel: tab?.sublabel || (isFirstDay ? 'Arrival' : isLastDay ? 'Departure' : 'Explore'),
        isFirstDay,
        isLastDay,
        dateObj: d,
        dateKey
      };

      byDate[dateKey] = dayData;
      byDay[i] = dayData;
    }

    return { tripDaysByDate: byDate, tripDatesByDay: byDay };
  }, [tripStartDate, totalDays, activeTrip?.dayTabs]);

  // Current viewed month & year in calendar view
  const [viewDate, setViewDate] = useState(() => {
    const initialDayData = tripDatesByDay[selectedDay || 1];
    if (initialDayData?.dateObj) {
      return new Date(initialDayData.dateObj.getFullYear(), initialDayData.dateObj.getMonth(), 1);
    }
    return new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), 1);
  });

  // Keep viewDate in sync when activeTrip changes
  useEffect(() => {
    const dayData = tripDatesByDay[selectedDay || 1];
    if (dayData?.dateObj) {
      setViewDate(new Date(dayData.dateObj.getFullYear(), dayData.dateObj.getMonth(), 1));
    }
  }, [activeTrip?._id]);

  // Selected date key
  const selectedDateKey = useMemo(() => {
    const cur = tripDatesByDay[selectedDay];
    if (cur) return cur.dateKey;
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  }, [selectedDay, tripDatesByDay]);

  // Navigate months
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const dt = String(today.getDate()).padStart(2, '0');
    const todayKey = `${y}-${m}-${dt}`;
    if (tripDaysByDate[todayKey]) {
      setSelectedDay(tripDaysByDate[todayKey].day);
    }
  };

  // Generate Month Grid (Monday to Sunday)
  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0, Sun=6
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(year, month - 1, dayNum);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${dt}`;

      cells.push({
        dayNum,
        isCurrentMonth: false,
        dateObj: d,
        dateKey,
        tripDay: tripDaysByDate[dateKey] || null
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dt = String(dateObj.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${dt}`;

      cells.push({
        dayNum: d,
        isCurrentMonth: true,
        dateObj,
        dateKey,
        tripDay: tripDaysByDate[dateKey] || null
      });
    }

    // Next month padding to reach 35 or 42 cells
    const targetCount = cells.length > 35 ? 42 : 35;
    let nextDay = 1;
    while (cells.length < targetCount) {
      const d = new Date(year, month + 1, nextDay);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${dt}`;

      cells.push({
        dayNum: nextDay,
        isCurrentMonth: false,
        dateObj: d,
        dateKey,
        tripDay: tripDaysByDate[dateKey] || null
      });
      nextDay++;
    }

    return cells;
  }, [viewDate, tripDaysByDate]);

  // Today's Date String
  const todayDateStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const dt = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  }, []);

  // Map activities count & list per day
  const activitiesByDay = useMemo(() => {
    const map = {};
    activities.forEach((act) => {
      const dayNum = Number(act.day);
      if (!map[dayNum]) map[dayNum] = [];
      map[dayNum].push(act);
    });
    return map;
  }, [activities]);

  // Current selected day's activities
  const currentDayInfo = tripDatesByDay[selectedDay] || null;
  const currentDayActivities = activitiesByDay[selectedDay] || [];
  
  const displayedActivities = useMemo(() => {
    if (!showCompleted) {
      return currentDayActivities.filter((a) => !a.completed);
    }
    return currentDayActivities;
  }, [currentDayActivities, showCompleted]);

  const completedActivitiesCount = currentDayActivities.filter((a) => a.completed).length;
  const totalDayCost = currentDayActivities.reduce((acc, a) => acc + (Number(a.costEstimate) || 0), 0);

  // Total activities in viewed month
  const monthActivitiesCount = useMemo(() => {
    let count = 0;
    calendarCells.forEach((c) => {
      if (c.isCurrentMonth && c.tripDay) {
        count += (activitiesByDay[c.tripDay.day] || []).length;
      }
    });
    return count;
  }, [calendarCells, activitiesByDay]);

  // Toggle activity completion
  const toggleComplete = (act) => {
    editActivity(act._id, { completed: !act.completed });
  };

  // AI Alternative Swapper State
  const [swapTarget, setSwapTarget] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapAlternatives, setSwapAlternatives] = useState([]);

  const handleOpenSwap = async (act) => {
    setSwapTarget(act);
    setIsSwapping(true);
    setSwapAlternatives([]);

    try {
      const res = await api.swapActivityAI({
        activityTitle: act.title,
        category: act.category,
        destination: activeTrip?.destination || 'Tokyo, Japan'
      });
      if (res?.alternatives) {
        setSwapAlternatives(res.alternatives);
      }
    } catch (err) {
      console.warn('Swap activity fetch error:', err);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleApplySwap = (alt) => {
    if (!swapTarget) return;

    editActivity(swapTarget._id, {
      title: alt.title,
      category: alt.category,
      location: alt.location,
      duration: `${alt.durationMin}m`,
      notes: alt.description
    });

    setSwapTarget(null);
    setSwapAlternatives([]);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Formatted selected date header
  const formattedSelectedHeader = useMemo(() => {
    if (currentDayInfo?.dateObj) {
      const d = currentDayInfo.dateObj;
      const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      const day = d.getDate();
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
      const year = d.getFullYear();
      return `${weekday}, ${day} ${month} ${year}`;
    }
    return `Day ${selectedDay}`;
  }, [currentDayInfo, selectedDay]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Daily Itinerary
            </h2>
            {activeTrip?.destination && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF5B45]/10 text-[#FF5B45] border border-[#FF5B45]/20">
                {activeTrip.destination}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTrip?.destination 
              ? `${activeTrip.destination} • ${totalDays} Days Travel Timeline & Itinerary` 
              : 'Trip Timeline & Scheduled Activities'}
          </p>
        </div>

        {/* Primary Add Activity CTA Button */}
        <button
          onClick={() => openModal('addActivity', { day: selectedDay })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5B45] to-[#FF4530] hover:from-[#FF4530] hover:to-[#E03420] text-white text-xs font-bold shadow-md shadow-[#FF5B45]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity to Day {selectedDay}</span>
        </button>
      </div>

      {/* Navigation Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
        {/* Left: Month Navigation Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#18233C]/60 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-1.5 text-xs font-black text-slate-900 dark:text-white min-w-[140px] text-center select-none tracking-tight">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleGoToday}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all select-none"
          >
            Today
          </button>

          {tripStartDate && (
            <button
              onClick={() => {
                setViewDate(new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), 1));
                setSelectedDay(1);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5B45]/10 hover:bg-[#FF5B45]/20 border border-[#FF5B45]/20 text-xs font-bold text-[#FF5B45] transition-all select-none"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Trip Start (Day 1)</span>
            </button>
          )}
        </div>

        {/* Right: Filters & View Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* Show Completed Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5B45] focus:ring-[#FF5B45] border-slate-300 dark:border-white/20 accent-[#FF5B45] cursor-pointer"
            />
            <span>Show completed</span>
          </label>

          {/* Segmented View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 text-xs font-bold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-[#121927] text-[#FF5B45] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-[#121927] text-[#FF5B45] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-[#121927] text-[#FF5B45] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: MONTH VIEW (Clean Two-Column Grid)
          ========================================================================= */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Calendar Grid Card */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-white/[0.08] shadow-xs p-5 sm:p-6 flex flex-col gap-4">
            {/* Calendar Card Header & Heatmap Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Month Overview
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {monthActivitiesCount} {monthActivitiesCount === 1 ? 'activity scheduled' : 'activities scheduled'}
                </span>
              </div>

              {/* Heatmap & Status Legend with crisp square chips */}
              <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Fewer</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#FFF0ED] border border-[#FFDCD6]" title="1 activity" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD2C9] border border-[#FFB8AB]" title="2 activities" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#FF8E7E] border border-[#FF705E]" title="3 activities" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5B45]" title="4+ activities" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">More</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Completed</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5B45]" />
                    <span>Scheduled</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Weekday Row Header (Mon - Sun) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {WEEKDAY_NAMES.map((wd) => (
                <div
                  key={wd}
                  className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* 7-Column Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarCells.map((cell) => {
                const isSelected = selectedDateKey === cell.dateKey;
                const isToday = todayDateStr === cell.dateKey;
                const cellTripDay = cell.tripDay;
                const dayActs = cellTripDay ? activitiesByDay[cellTripDay.day] || [] : [];
                const actCount = dayActs.length;
                const completedCount = dayActs.filter((a) => a.completed).length;

                return (
                  <div
                    key={cell.dateKey}
                    onClick={() => {
                      if (cellTripDay) {
                        setSelectedDay(cellTripDay.day);
                      }
                    }}
                    className={`min-h-[92px] sm:min-h-[98px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer select-none relative group ${
                      isSelected
                        ? 'cal-cell-selected z-10'
                        : cellTripDay
                        ? actCount > 0
                          ? 'cal-cell-has-acts bg-[#FFF5F3] dark:bg-[#FF5B45]/10 border-[#FFD2C9] dark:border-[#FF5B45]/25 hover:border-[#FF5B45] hover:shadow-xs'
                          : 'cal-cell-in-trip bg-slate-50/40 hover:bg-white dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border-slate-200/70 dark:border-white/[0.05] hover:border-[#FF5B45]/50'
                        : 'bg-white/40 dark:bg-transparent border-slate-100 dark:border-white/[0.02] text-slate-300 dark:text-slate-600 hover:border-slate-200 dark:hover:border-white/5'
                    } ${!cell.isCurrentMonth && !isSelected ? 'opacity-30 hover:opacity-60' : ''}`}
                  >
                    {/* Top Row: Date Number & Badges */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs sm:text-sm font-black ${
                          isSelected
                            ? 'text-white'
                            : cell.isCurrentMonth
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {/* Pill Badges */}
                      <div className="flex items-center gap-1">
                        {isToday && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight ${
                              isSelected
                                ? 'bg-white text-[#FF5B45]'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            Today
                          </span>
                        )}

                        {cellTripDay && (
                          <span
                            className={`cal-badge text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white border border-white/30'
                                : cellTripDay.isFirstDay
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : cellTripDay.isLastDay
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {cellTripDay.isFirstDay ? 'Arrival' : cellTripDay.isLastDay ? 'Depart' : `Day ${cellTripDay.day}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Activity Preview / Empty Airy Space */}
                    <div className="my-auto py-1">
                      {cellTripDay ? (
                        actCount > 0 ? (
                          <div
                            className={`px-2 py-1 rounded-lg border text-left text-[11px] font-bold truncate transition-all ${
                              isSelected
                                ? 'cal-act-pill bg-white/20 border-white/30 text-white'
                                : 'bg-white dark:bg-[#18233C] text-slate-800 dark:text-slate-200 border-[#FF5B45]/20 shadow-xs'
                            }`}
                          >
                            <span className="truncate block">
                              {dayActs[0]?.title || `${actCount} activities`}
                            </span>
                            {actCount > 1 && (
                              <span
                                className={`text-[9px] block font-semibold ${
                                  isSelected ? 'text-white/80' : 'text-[#FF5B45]'
                                }`}
                              >
                                +{actCount - 1} more
                              </span>
                            )}
                          </div>
                        ) : (
                          // Calm empty state with smooth hover "+ Add" invite
                          <div className="h-4 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[#FF5B45] flex items-center gap-0.5 transition-opacity">
                              <Plus className="w-2.5 h-2.5" /> Plan
                            </span>
                          </div>
                        )
                      ) : null}
                    </div>

                    {/* Bottom Row: Status Indicator Dots */}
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      {actCount > 0 ? (
                        <div className="flex items-center gap-1 truncate">
                          {completedCount > 0 && (
                            <span
                              className={`flex items-center gap-0.5 font-bold ${
                                isSelected ? 'text-white' : 'text-emerald-500'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {completedCount} done
                            </span>
                          )}
                          {actCount > completedCount && (
                            <span
                              className={`flex items-center gap-0.5 font-semibold ${
                                isSelected ? 'text-white/95' : 'text-[#FF5B45]'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B45]" />
                              {actCount - completedCount} planned
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Day Schedule & Activities Panel */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200/80 dark:border-white/[0.08] shadow-xs p-5 sm:p-6 flex flex-col gap-4">
            {/* Header: Date title, Sublabel & Metrics Strip */}
            <div className="pb-4 border-b border-slate-100 dark:border-white/[0.06] flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FF5B45] text-white shadow-xs">
                    Day {selectedDay}
                  </span>
                  {currentDayInfo?.sublabel && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {currentDayInfo.sublabel}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openModal('addActivity', { day: selectedDay })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5B45] hover:bg-[#FF4530] text-white text-xs font-bold shadow-xs transition-all shrink-0 hover:scale-[1.02]"
                  title="Add Activity to this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Formatted Date Title */}
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formattedSelectedHeader}
              </h3>

              {/* Day Summary Metrics Strip */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#FF5B45]" />
                  <span>{currentDayActivities.length} {currentDayActivities.length === 1 ? 'Activity' : 'Activities'}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{totalDayCost > 0 ? `$${totalDayCost.toLocaleString()} est.` : 'Free'}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{completedActivitiesCount} done</span>
                </div>
              </div>
            </div>

            {/* Activities List for Selected Day */}
            {displayedActivities.length === 0 ? (
              <div className="py-14 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FF5B45]/10 border border-[#FF5B45]/20 flex items-center justify-center text-[#FF5B45]">
                  <Plane className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    No activities scheduled for Day {selectedDay}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Organize your sightseeing, culinary spots, transit, or nightlife.
                  </p>
                </div>
                <button
                  onClick={() => openModal('addActivity', { day: selectedDay })}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5B45]/10 hover:bg-[#FF5B45]/20 text-[#FF5B45] text-xs font-bold border border-[#FF5B45]/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add an activity now</span>
                </button>
              </div>
            ) : (
              <div className="cal-scrollbar max-h-[640px] overflow-y-auto space-y-3.5 pr-1">
                {displayedActivities.map((act, idx) => {
                  const catInfo = getCategoryInfo(act.category);
                  const CatIcon = catInfo.icon;

                  return (
                    <div
                      key={act._id || idx}
                      className="p-4 rounded-2xl bg-white dark:bg-[#18233C]/80 border border-slate-200/90 hover:border-[#FF5B45]/40 dark:border-white/[0.08] dark:hover:border-[#FF5B45]/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between gap-3"
                    >
                      {/* Top Row: Category Pill & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${catInfo.badgeBg}`}>
                          <CatIcon className="w-3.5 h-3.5" />
                          <span>{catInfo.label}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          {act.source === 'ai' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}

                          {act.completed ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wider">
                              Completed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                              Planned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Details */}
                      <div>
                        <h4
                          className={`text-base font-bold capitalize leading-snug group-hover:text-[#FF5B45] transition-colors ${
                            act.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {act.title}
                        </h4>

                        {/* Time & Location */}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-[#FF5B45]" />
                            {act.time} ({act.duration || '60m'})
                          </span>

                          {act.location && (
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate">{act.location}</span>
                            </span>
                          )}
                        </div>

                        {act.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400/90 mt-2 italic bg-slate-50 dark:bg-black/20 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                            "{act.notes}"
                          </p>
                        )}
                      </div>

                      {/* Footer Row: Cost & Action Toolbar */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/[0.05]">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          {Number(act.costEstimate || 0) > 0 ? `$${act.costEstimate} est.` : 'Free'}
                        </span>

                        {/* Unified 4-Button Action Toolbar */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleComplete(act)}
                            className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-emerald-500"
                            title={act.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {act.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenSwap(act)}
                            className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-purple-500"
                            title="Suggest AI alternatives"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openModal('addActivity', { ...act, isEdit: true, day: selectedDay })}
                            className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-[#FF5B45]"
                            title="Edit activity"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteActivity(act._id)}
                            className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-rose-500"
                            title="Delete activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: WEEK VIEW (7-Day Horizontal Cards)
          ========================================================================= */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
          {calendarCells.slice(0, 7).map((cell, idx) => {
            const cellTripDay = cell.tripDay;
            const acts = cellTripDay ? activitiesByDay[cellTripDay.day] || [] : [];
            const isSelected = selectedDay === cellTripDay?.day;

            return (
              <div
                key={idx}
                onClick={() => cellTripDay && setSelectedDay(cellTripDay.day)}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#FF5B45] ring-2 ring-[#FF5B45]/20 bg-white dark:bg-[#121927]'
                    : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                <div className="pb-2 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      {WEEKDAY_NAMES[idx]}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {cellTripDay ? `Day ${cellTripDay.day}` : `Day ${cell.dayNum}`}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF5B45]">
                    {acts.length} acts
                  </span>
                </div>

                <div className="space-y-2 min-h-[140px]">
                  {acts.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-4 text-center">No activities</p>
                  ) : (
                    acts.slice(0, 3).map((a) => (
                      <div
                        key={a._id}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-[#18233C]/60 text-xs border border-slate-200/60 dark:border-white/[0.04]"
                      >
                        <span className="text-[10px] font-mono text-[#FF5B45] block">{a.time}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                          {a.title}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {cellTripDay && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('addActivity', { day: cellTripDay.day });
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-[#FF5B45]/10 dark:bg-white/5 dark:hover:bg-[#FF5B45]/15 text-slate-600 hover:text-[#FF5B45] dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: TIMELINE VIEW (Original Horizontal Day Tabs & Linear Timeline)
          ========================================================================= */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-6">
          {/* Horizontal Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none day-tabs-container">
            {Object.values(tripDatesByDay).map((item) => {
              const isSelected = Number(selectedDay) === Number(item.day);
              const dayActsCount = (activitiesByDay[item.day] || []).length;

              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center justify-center border transition-all min-w-[120px] shrink-0 cursor-pointer select-none outline-none focus:outline-none ${
                    isSelected
                      ? 'day-tab-active bg-[#FF5B45] text-white border-[#FF5B45] shadow-md shadow-[#FF5B45]/20'
                      : 'day-tab-inactive bg-white dark:bg-[#121927] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.06] hover:border-[#FF5B45]/40'
                  }`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className={`text-xs mt-0.5 ${isSelected ? 'text-white/90 font-semibold' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </span>
                  <span className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {dayActsCount} activities
                  </span>
                </button>
              );
            })}
          </div>

          {/* Linear Timeline Container */}
          <div className="rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/[0.08] shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#FF5B45]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule for Day {selectedDay} — {currentDayInfo?.sublabel || ''}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {displayedActivities.length} items planned
              </span>
            </div>

            {displayedActivities.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <Plane className="w-8 h-8 text-slate-400" />
                <p className="text-xs text-slate-400">No activities scheduled for this day.</p>
                <button
                  onClick={() => openModal('addActivity', { day: selectedDay })}
                  className="text-xs font-semibold text-[#FF5B45] hover:underline"
                >
                  + Add an activity now
                </button>
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                {displayedActivities.map((act) => (
                  <div
                    key={act._id}
                    className="relative flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-[#18233C]/60 border border-slate-200/80 dark:border-white/[0.06] hover:border-[#FF5B45]/40 transition-all group"
                  >
                    {/* Timeline Node Dot */}
                    <div
                      className="absolute -left-[27px] top-5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-[#121927]"
                      style={{ backgroundColor: act.color || '#FF5B45' }}
                    />

                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleComplete(act)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {act.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#FF5B45]">
                            {act.time}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium capitalize">
                            {act.category || 'Sightseeing'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({act.duration || '60m'})
                          </span>
                          {act.source === 'ai' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 font-semibold">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-sm font-semibold mt-1 leading-snug ${
                            act.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {act.title}
                        </h4>

                        {act.location && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{act.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenSwap(act)}
                        className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-purple-400"
                        title="Ask AI to suggest alternatives"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openModal('addActivity', { ...act, isEdit: true, day: selectedDay })}
                        className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-blue-500"
                        title="Edit Activity"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteActivity(act._id)}
                        className="cal-action-btn w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:text-rose-500"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          AI Alternative Swap Modal
          ========================================================================= */}
      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/10 shadow-2xl p-6 relative">
            <button
              onClick={() => setSwapTarget(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Alternative Activity Swapper
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Swapping: <span className="text-[#FF5B45] font-semibold">{swapTarget.title}</span>
                </p>
              </div>
            </div>

            {isSwapping ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                <p className="text-xs">Finding 3 tailored alternatives matching destination & vibe...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select an AI alternative to replace <span className="text-slate-900 dark:text-white font-medium">{swapTarget.title}</span> on Day {swapTarget.day}:
                </p>

                {swapAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18233C]/80 border border-slate-200 dark:border-white/[0.07] hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          {alt.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-500">
                          {alt.costEstimate > 0 ? `$${alt.costEstimate}` : 'Free'} • {alt.durationMin}m
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-400 transition-colors">
                        {alt.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {alt.description}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1.5 flex items-center gap-1">
                        <span className="text-purple-500 font-semibold">Why:</span>
                        <span>{alt.whyRecommended}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-slate-200 dark:border-white/[0.04]">
                      <button
                        onClick={() => handleApplySwap(alt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-500 dark:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Swap to this Activity</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
