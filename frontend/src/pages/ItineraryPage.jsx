import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3,
  Plane
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const ItineraryPage = () => {
  const { activeTrip, activities, selectedDay, setSelectedDay, deleteActivity, editActivity, openModal } = useTrip();

  const days = activeTrip?.dayTabs || [];

  const currentActivities = activities.filter((a) => Number(a.day) === Number(selectedDay));

  const toggleComplete = (act) => {
    editActivity(act._id, { completed: !act.completed });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Itinerary</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTrip?.destination ? `${activeTrip.destination} Timeline & Scheduled Activities` : 'Timeline & Scheduled Activities'}
          </p>
        </div>

        {days.length > 0 && (
          <button
            onClick={() => openModal('addActivity', { day: selectedDay })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity to Day {selectedDay}</span>
          </button>
        )}
      </div>

      {days.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#121927] border border-white/[0.08] flex flex-col items-center gap-3">
          <CalendarDays className="w-10 h-10 text-slate-400" />
          <h3 className="text-base font-bold text-white">No active trip itinerary</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Create or activate a trip to organize and schedule day-by-day activities.
          </p>
          <button
            onClick={() => openModal('addTrip')}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Trip</span>
          </button>
        </div>
      ) : (
        <>
          {/* Days Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {days.map((item) => {
              const isSelected = Number(selectedDay) === Number(item.day);
              const dayActsCount = activities.filter((a) => Number(a.day) === Number(item.day)).length;
              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-[#18233C] text-white border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'bg-[#121927] text-slate-400 border-white/[0.06] hover:bg-[#162033] hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-300 font-semibold' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    {dayActsCount} activities
                  </span>
                </button>
              );
            })}
          </div>

      {/* Activities Timeline */}
      <div className="rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Schedule for Day {selectedDay} — {days.find((d) => Number(d.day) === Number(selectedDay))?.sublabel || ''}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {currentActivities.length} items planned
          </span>
        </div>

        {currentActivities.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <Plane className="w-8 h-8 text-slate-400" />
            <p className="text-xs text-slate-400">No activities scheduled for this day.</p>
            <button
              onClick={() => openModal('addActivity', { day: selectedDay })}
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              + Add an activity now
            </button>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
            {currentActivities.map((act) => (
              <div
                key={act._id}
                className="relative flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#18233C]/60 border border-white/[0.06] hover:border-blue-500/30 transition-all group"
              >
                {/* Timeline Node Dot */}
                <div
                  className="absolute -left-[27px] top-5 w-3.5 h-3.5 rounded-full ring-4 ring-[#121927]"
                  style={{ backgroundColor: act.color || '#3B82F6' }}
                />

                {/* Content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleComplete(act)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {act.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {act.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium capitalize">
                        {act.category || 'Sightseeing'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({act.duration || '60m'})
                      </span>
                    </div>

                    <h4 className={`text-sm font-semibold mt-1 leading-snug ${
                      act.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}>
                      {act.title}
                    </h4>

                    {act.location && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{act.location}</span>
                      </p>
                    )}

                    {act.notes && (
                      <p className="text-xs text-slate-400/90 mt-1 italic">
                        "{act.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openModal('addActivity', { ...act, isEdit: true })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
                    title="Edit Activity"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteActivity(act._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
        </>
      )}
    </div>
  );
};

export default ItineraryPage;
