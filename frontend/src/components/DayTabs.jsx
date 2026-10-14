import React from 'react';
import { useTrip } from '../context/TripContext';

export const DayTabs = () => {
  const { selectedDay, setSelectedDay, activeTrip } = useTrip();

  const days = activeTrip?.dayTabs || [];

  if (days.length === 0) {
    return (
      <div className="w-full py-3.5 px-6 rounded-2xl bg-[#121927]/60 border border-white/[0.05] text-center">
        <p className="text-xs text-slate-400">
          No itinerary days scheduled. Create a trip to start scheduling daily activities.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="grid grid-cols-5 gap-2.5 min-w-[500px]">
        {days.map((item) => {
          const isSelected = Number(selectedDay) === Number(item.day);
          return (
            <button
              key={item.day}
              onClick={() => setSelectedDay(item.day)}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl text-center transition-all ${
                isSelected
                  ? 'bg-[#18233C] text-white border border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-[#121927]/80 hover:bg-[#162033] text-slate-400 hover:text-slate-200 border border-white/[0.05]'
              }`}
            >
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {item.label}
              </span>
              <span className={`text-[11px] font-medium mt-0.5 leading-tight ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
