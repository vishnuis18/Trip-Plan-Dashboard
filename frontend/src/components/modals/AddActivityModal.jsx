import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const AddActivityModal = () => {
  const { closeModal, modalPayload, addActivity, editActivity, selectedDay, activeTrip } = useTrip();

  const isEdit = modalPayload?.isEdit;
  const initialDay = Number(modalPayload?.day || selectedDay || 1);

  // Compute available trip days dynamically from activeTrip
  const tripDays = useMemo(() => {
    if (activeTrip?.dayTabs && activeTrip.dayTabs.length > 0) {
      return activeTrip.dayTabs.map((tab, idx) => ({
        day: Number(tab.day || idx + 1),
        label: tab.label || `Day ${tab.day || idx + 1}`,
        sublabel: tab.sublabel || (idx === 0 ? 'Arrival' : idx === activeTrip.dayTabs.length - 1 ? 'Departure' : 'Explore')
      }));
    }
    const count = activeTrip?.nights ? activeTrip.nights + 1 : 5;
    return Array.from({ length: count }, (_, i) => ({
      day: i + 1,
      label: `Day ${i + 1}`,
      sublabel: i === 0 ? 'Arrival' : i === count - 1 ? 'Departure' : 'Explore'
    }));
  }, [activeTrip]);

  const [formData, setFormData] = useState({
    day: initialDay,
    time: modalPayload?.time || '02:00 PM',
    title: modalPayload?.title || '',
    duration: modalPayload?.duration || '60m',
    location: modalPayload?.location || '',
    category: modalPayload?.category || 'sightseeing',
    color: modalPayload?.color || '#FF5B45',
    notes: modalPayload?.notes || ''
  });

  // Typeable input state synced with dropdown selection
  const [dayInputValue, setDayInputValue] = useState(() => {
    const matched = tripDays.find(d => Number(d.day) === Number(initialDay));
    return matched ? `Day ${matched.day} (${matched.sublabel})` : `Day ${initialDay}`;
  });

  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dayDropdownRef = useRef(null);
  const catDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(e.target)) {
        setShowDayDropdown(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setShowCatDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDay = (d) => {
    setFormData(prev => ({ ...prev, day: d.day }));
    setDayInputValue(`Day ${d.day} (${d.sublabel})`);
    setShowDayDropdown(false);
  };

  const handleDayInputChange = (e) => {
    const val = e.target.value;
    setDayInputValue(val);
    const match = val.match(/\d+/);
    if (match) {
      const parsedDay = Math.max(1, parseInt(match[0], 10));
      setFormData(prev => ({ ...prev, day: parsedDay }));
    }
  };

  const categories = [
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'transit', label: 'Transit / Arrival' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'culture', label: 'Culture & Temples' },
    { value: 'shopping', label: 'Shopping' }
  ];

  const colors = [
    { label: 'Coral', value: '#FF5B45' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Sky', value: '#0284C7' },
    { label: 'Amber', value: '#F59E0B' },
    { label: 'Green', value: '#10B981' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Rose', value: '#F43F5E' }
  ];

  const currentCatInfo = categories.find(c => c.value === formData.category) || categories[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;

    setSubmitting(true);
    const activityData = {
      ...formData,
      day: Math.max(1, Number(formData.day) || 1)
    };

    if (isEdit && modalPayload?._id) {
      await editActivity(modalPayload._id, activityData);
    } else {
      await addActivity(activityData);
    }
    setSubmitting(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/10 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">
          {isEdit ? 'Edit Activity' : 'Add Itinerary Activity'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Organize daily places, times, and activities for {activeTrip?.destination || 'your trip'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Day & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Typeable Day Field with Integrated Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Day
              </label>
              <div className="relative" ref={dayDropdownRef}>
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF5B45]">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Type or select Day..."
                    value={dayInputValue}
                    onChange={handleDayInputChange}
                    onFocus={() => setShowDayDropdown(true)}
                    className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-[#FF5B45] rounded-xl pl-9 pr-8 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDayDropdown(!showDayDropdown)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                    tabIndex={-1}
                    title="Toggle days list"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDayDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {showDayDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-white/10 shadow-xl max-h-52 overflow-y-auto z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-white/[0.06] mb-1">
                      Trip Schedule Days
                    </div>
                    {tripDays.map((d) => {
                      const isSelected = Number(formData.day) === Number(d.day);
                      return (
                        <button
                          type="button"
                          key={d.day}
                          onClick={() => handleSelectDay(d)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-[#FFF5F3] dark:bg-[#FF5B45]/15 text-[#FF5B45] font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          <span>Day {d.day} <span className="text-[11px] font-normal text-slate-400">({d.sublabel})</span></span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5B45]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Time *
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. 02:00 PM"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 focus:border-[#FF5B45] rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Activity Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Visit Baga Beach & Sunset View"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 focus:border-[#FF5B45] rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
            />
          </div>

          {/* Duration & Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 60m or 90m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 focus:border-[#FF5B45] rounded-xl px-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
              />
            </div>

            {/* Custom Category Dropdown */}
            <div className="relative" ref={catDropdownRef}>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <button
                type="button"
                onClick={() => setShowCatDropdown(!showCatDropdown)}
                className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:border-[#FF5B45] rounded-xl px-3 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white transition-all shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Tag className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="truncate">{currentCatInfo.label}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCatDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-white/10 shadow-xl max-h-48 overflow-y-auto z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                  {categories.map((c) => {
                    const isSelected = formData.category === c.value;
                    return (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => {
                          setFormData({ ...formData, category: c.value });
                          setShowCatDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Location / Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Location / Address
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Baga Beach, North Goa"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-10 bg-slate-50 dark:bg-[#18233C] border border-slate-200 dark:border-white/10 focus:border-[#FF5B45] rounded-xl pl-9 pr-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Pin & Dot Color
            </label>
            <div className="flex items-center gap-2.5">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                    formData.color === c.value
                      ? 'ring-2 ring-offset-2 ring-[#FF5B45] dark:ring-offset-[#121927] scale-110 shadow-sm'
                      : 'opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
