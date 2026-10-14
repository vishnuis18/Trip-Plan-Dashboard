import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Calendar, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const QuickSearchModal = ({ setActiveTab }) => {
  const { closeModal, activities, neighborhoods, expenses, openModal } = useTrip();
  const [query, setQuery] = useState('');

  // Handle Cmd+K key combo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal
      }
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(query.toLowerCase()) ||
    n.tag.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActivities = activities.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    (a.location && a.location.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredExpenses = expenses.filter((e) =>
    e.category.toLowerCase().includes(query.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-[#121927] border border-white/10 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#141B2D]">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search activities, neighborhoods, expenses, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Quick Commands */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  closeModal();
                  openModal('addTrip');
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-xs text-slate-300 hover:text-white transition-colors text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>+ Create New Trip</span>
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openModal('addActivity');
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-xs text-slate-300 hover:text-white transition-colors text-left"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Add Itinerary Item</span>
              </button>
            </div>
          </div>

          {/* Neighborhoods */}
          {filteredNeighborhoods.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Neighborhood Guides
              </span>
              <div className="flex flex-col gap-1">
                {filteredNeighborhoods.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('explore');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-semibold text-white">{n.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {n.tag}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {filteredActivities.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Itinerary Activities
              </span>
              <div className="flex flex-col gap-1">
                {filteredActivities.slice(0, 5).map((a) => (
                  <div
                    key={a._id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('itinerary');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: a.color || '#3B82F6' }}
                      />
                      <span className="text-xs font-mono text-blue-300">{a.time}</span>
                      <span className="text-xs text-slate-200 truncate">{a.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{a.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses */}
          {filteredExpenses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Expenses
              </span>
              <div className="flex flex-col gap-1">
                {filteredExpenses.slice(0, 4).map((e) => (
                  <div
                    key={e._id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('budget');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200">{e.category}</span>
                      <span className="text-xs text-slate-400 truncate">{e.description}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">${e.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
