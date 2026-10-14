import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  Users, 
  CreditCard, 
  Plane, 
  MoreHorizontal, 
  ArrowRight,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const TripSummary = ({ onViewDetailsClick }) => {
  const { activeTrip, openModal } = useTrip();
  const [showOptions, setShowOptions] = useState(false);

  const dates = activeTrip?.datesFormatted || '—';
  const travelers = activeTrip?.travelersText || (activeTrip?.travelers ? `${activeTrip.travelers} People` : '—');
  const budget = activeTrip?.totalBudget ? `$${activeTrip.totalBudget.toLocaleString()}` : '$0';
  const airport = activeTrip?.airport || '—';

  return (
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-5 shadow-xl backdrop-blur-md relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">Trip Summary</h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#18233C] border border-white/10 shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  openModal('addTrip');
                  setShowOptions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 text-left"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Trip Details</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip link copied to clipboard!');
                  setShowOptions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 text-left"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Trip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info List */}
      <div className="flex flex-col gap-3 py-1">
        {/* Dates */}
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">Dates</span>
            <span className="text-xs font-semibold text-slate-200">{dates}</span>
          </div>
        </div>

        {/* Travelers */}
        <div className="flex items-start gap-3">
          <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">Travelers</span>
            <span className="text-xs font-semibold text-slate-200">{travelers}</span>
          </div>
        </div>

        {/* Total Budget */}
        <div className="flex items-start gap-3">
          <CreditCard className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">Total Budget</span>
            <span className="text-xs font-semibold text-slate-200">{budget}</span>
          </div>
        </div>

        {/* Airport */}
        <div className="flex items-start gap-3">
          <Plane className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">Airport</span>
            <span className="text-xs font-semibold text-slate-200 leading-snug">{airport}</span>
          </div>
        </div>
      </div>

      {/* View Full Details CTA Button */}
      <button
        onClick={onViewDetailsClick}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all transform active:scale-98"
      >
        <span>View Full Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
