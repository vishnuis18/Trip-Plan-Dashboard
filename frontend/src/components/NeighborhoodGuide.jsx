import React from 'react';
import { MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const NeighborhoodGuide = ({ onViewAllClick, onSelectNeighborhood }) => {
  const { neighborhoods } = useTrip();

  const items = neighborhoods || [];

  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Neighborhood Guide</h3>
        </div>

        <button
          onClick={onViewAllClick}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400">No neighborhood guides available for this trip yet.</p>
          <button
            onClick={onViewAllClick}
            className="text-xs font-semibold text-blue-400 hover:underline"
          >
            Explore popular destinations & neighborhoods →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNeighborhood && onSelectNeighborhood(item)}
            className="group/card relative rounded-2xl overflow-hidden bg-[#18233C]/60 border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
          >
            {/* Card Thumbnail Image */}
            <div className="h-32 w-full overflow-hidden relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141B2D] via-transparent to-black/20" />
            </div>

            {/* Card Body */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight mb-1.5">{item.name}</h4>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300 border border-white/10">
                  {item.tag}
                </span>
              </div>

              {/* Arrow circle */}
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover/card:bg-blue-500 group-hover/card:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
