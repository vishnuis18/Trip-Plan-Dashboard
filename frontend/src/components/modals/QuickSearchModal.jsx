import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Calendar, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Layers, 
  CornerDownLeft 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const QuickSearchModal = ({ setActiveTab }) => {
  const { closeModal, activities, neighborhoods, expenses, openModal, activeTrip } = useTrip();
  const [query, setQuery] = useState('');

  // Handle Cmd+K / Esc key combos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const q = query.toLowerCase().trim();

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name?.toLowerCase().includes(q) ||
    n.tag?.toLowerCase().includes(q)
  );

  const filteredActivities = activities.filter((a) =>
    a.title?.toLowerCase().includes(q) ||
    (a.location && a.location.toLowerCase().includes(q)) ||
    (a.category && a.category.toLowerCase().includes(q))
  );

  const filteredExpenses = expenses.filter((e) =>
    e.category?.toLowerCase().includes(q) ||
    (e.description && e.description.toLowerCase().includes(q))
  );

  const totalResults = filteredActivities.length + filteredNeighborhoods.length + filteredExpenses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3.5 px-5 py-4 border-b border-slate-100 dark:border-white/[0.08] bg-white dark:bg-[#141B2D]">
          <Search className="w-5 h-5 text-[#FF5B45] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search activities, neighborhoods, expenses, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="cmd-search-input flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 font-mono">
            ESC
          </kbd>
          <button
            onClick={closeModal}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            title="Close Search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
          {/* Quick Actions Bar */}
          {!query && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block mb-2">
                Quick Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    closeModal();
                    openModal('addTrip');
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#FFF5F3] dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-[#FF5B45]/40 dark:border-white/[0.05] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF5B45]/10 border border-[#FF5B45]/20 flex items-center justify-center text-[#FF5B45] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#FF5B45] transition-colors">
                        Create New Trip
                      </span>
                      <span className="text-[11px] text-slate-400">
                        New destination & dates
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5B45] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => {
                    closeModal();
                    openModal('addActivity');
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-emerald-500/40 dark:border-white/[0.05] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Add Activity
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Schedule place & time
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          )}

          {/* Empty Search Result */}
          {query && totalResults === 0 && (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No results found for "{query}"
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Try searching for places, temples, beaches, categories, or expenses.
              </p>
            </div>
          )}

          {/* Activities Results */}
          {filteredActivities.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Itinerary Activities ({filteredActivities.length})
                </span>
                <span className="text-[10px] font-bold text-[#FF5B45]">
                  {activeTrip?.destination || 'Active Trip'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {filteredActivities.map((act) => (
                  <div
                    key={act._id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('itinerary');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-[#FFF5F3] dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-[#FF5B45]/40 dark:border-white/[0.05] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: act.color || '#FF5B45' }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#FF5B45] transition-colors truncate">
                            {act.title}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-mono shrink-0">
                            Day {act.day || 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{act.location || activeTrip?.destination || 'Scheduled Stop'}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{act.time}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {act.duration || '60m'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5B45] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Neighborhoods / Guide Results */}
          {filteredNeighborhoods.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block mb-2">
                Neighborhood Guides ({filteredNeighborhoods.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {filteredNeighborhoods.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('explore');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-slate-300 dark:border-white/[0.05] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#FF5B45] transition-colors">
                          {n.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {n.tag || 'Popular Destination Area'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5B45] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses Results */}
          {filteredExpenses.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block mb-2">
                Expenses ({filteredExpenses.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {filteredExpenses.slice(0, 5).map((e) => (
                  <div
                    key={e._id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('budget');
                      closeModal();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-slate-200/80 hover:border-slate-300 dark:border-white/[0.05] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {e.description || e.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {e.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                      ${Number(e.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-[9px] font-bold text-slate-600 dark:text-slate-300">ESC</kbd>
              <span>to close</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-[9px] font-bold text-slate-600 dark:text-slate-300">↵</kbd>
              <span>to open</span>
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            TripPlan Quick Search
          </span>
        </div>
      </div>
    </div>
  );
};
