import React from 'react';
import { Plane, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const ItineraryCard = ({ onExploreClick }) => {
  const { currentDayActivities, selectedDay, deleteActivity, openModal } = useTrip();

  // Dot color styling matching reference image colors
  const getColorClass = (index, explicitColor) => {
    if (explicitColor) {
      return explicitColor;
    }
    const colors = ['#3B82F6', '#0284C7', '#EAB308', '#22C55E', '#F97316', '#EF4444'];
    return colors[index % colors.length];
  };

  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <Plane className="w-4 h-4 text-blue-400 transform -rotate-45" />
          <h3 className="text-sm font-bold text-white tracking-wide">Arrivals & Itinerary</h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('addActivity', { day: selectedDay })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>

          <button
            onClick={onExploreClick}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Land → Explore</span>
            <span className="text-[11px]">›</span>
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="flex flex-col gap-1 pt-1">
        {currentDayActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400 mb-2">No activities planned yet for Day {selectedDay}.</p>
            <button
              onClick={() => openModal('addActivity', { day: selectedDay })}
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add your first activity
            </button>
          </div>
        ) : (
          currentDayActivities.map((act, idx) => {
            const dotColor = act.color || getColorClass(idx);
            return (
              <div
                key={act._id || idx}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                {/* Left: Time and Title with Colored Bullet */}
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                  {/* Colored Bullet Dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}80` }}
                  />

                  {/* Time Badge */}
                  <span className="text-xs font-mono font-semibold text-blue-300 w-20 shrink-0">
                    {act.time}
                  </span>

                  {/* Title / Description */}
                  <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {act.title}
                  </span>
                </div>

                {/* Right: Duration Badge & Quick Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {act.duration || '60m'}
                  </span>

                  {/* Quick Delete / Edit on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => openModal('addActivity', { ...act, isEdit: true })}
                      className="p-1 text-slate-400 hover:text-blue-400 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteActivity(act._id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
