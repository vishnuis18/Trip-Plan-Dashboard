import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const InspirationCard = ({ onExploreClick }) => {
  return (
    <div 
      onClick={onExploreClick}
      className="relative rounded-3xl overflow-hidden min-h-[170px] p-5 flex flex-col justify-end border border-white/[0.08] shadow-xl group cursor-pointer"
    >
      {/* Tokyo Tower Sunset Background */}
      <img
        src="/images/tokyo_tower.jpg"
        alt="Tokyo Tower Sunset"
        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-[0.75] contrast-[1.1]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-[#0B0E17]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white leading-snug">
            Good trips create <br />
            great stories.
          </h4>
          <p className="text-[11px] text-slate-300/80 mt-1">
            Make yours unforgettable.
          </p>
        </div>

        {/* Circular Arrow Button */}
        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-blue-500 group-hover:border-blue-400 transition-colors shadow-lg shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
