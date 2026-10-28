import React from 'react';
import { Heart, Star, MapPin, Trash2, Plus, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const SavedPlaces = ({ setActiveTab }) => {
  const { savedPlaces, toggleSavePlace, openModal, selectedDay } = useTrip();

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Saved Places</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your bookmarked spots, restaurants, and hidden attractions
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-all"
        >
          <span>Explore More Places</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#121927] border border-white/[0.08] flex flex-col items-center gap-3">
          <Heart className="w-10 h-10 text-slate-400" />
          <h3 className="text-sm font-bold text-white">No saved places yet</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Browse the Explore tab and click the heart icon on any place to bookmark it here for later.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md transition-all"
          >
            Go to Explore
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlaces.map((place) => {
            const starCount = Math.round(parseFloat(place.rating) || 5);
            const displayName = place.placeName || place.name;
            const displayCost = place.estimatedCost || place.price || '$25';

            return (
              <div
                key={place._id || place.id}
                className="explore-sample-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                {/* Photo & Actions */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={
                      displayName?.toLowerCase().includes('teamlab')
                        ? '/images/teamlab.jpg'
                        : displayName?.toLowerCase().includes('arashiyama')
                        ? '/images/arashiyama.jpg'
                        : place.image || '/images/shibuya.jpg'
                    }
                    alt={displayName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/shibuya.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Ribbon */}
                  {place.category && (
                    <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                      <div className="absolute transform -rotate-45 bg-gradient-to-r from-[#FF644E] to-[#FF4538] text-white text-[9px] font-black tracking-wider py-1 left-[-32px] top-[18px] w-[120px] text-center shadow-md uppercase">
                        {place.category}
                      </div>
                    </div>
                  )}

                  {/* Remove Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavePlace(place);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:bg-rose-600 transition-colors z-10"
                    title="Remove from bookmarks"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                  <div>
                    {/* Row 1: Title & Category */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="explore-card-title text-sm font-bold uppercase tracking-tight text-sky-700 dark:text-sky-400 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                        {displayName}
                      </h4>
                      <span className="text-[11px] font-bold text-[#FF5B45] dark:text-[#FF8A65] whitespace-nowrap shrink-0">
                        {place.category || 'Spot'}
                      </span>
                    </div>

                    {/* Row 2: 5 Stars & Location */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= starCount
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {place.location}
                      </span>
                    </div>

                    {/* Row 3: Description */}
                    {place.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {place.description}
                        <span className="text-sky-600 dark:text-sky-400 font-medium ml-1 cursor-pointer hover:underline">
                          ... More
                        </span>
                      </p>
                    )}

                    {/* Notes if present */}
                    {place.notes && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-300 mt-2 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-xl border border-amber-200 dark:border-amber-500/20 font-medium">
                        💡 {place.notes}
                      </p>
                    )}

                    {/* Timing Row */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                      <Clock className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                      <span className="truncate">
                        Recommended: <strong className="font-semibold text-slate-700 dark:text-slate-300">2–3 Hours</strong> • Bookmarked
                      </span>
                    </div>

                    {/* Location Row */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        View on Map • {place.location}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 dark:border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
                        Estimated
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                        {displayCost}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        openModal('addActivity', {
                          title: `Visit ${displayName}`,
                          location: place.location,
                          category: (place.category || 'sightseeing').toLowerCase(),
                          day: selectedDay || 1
                        })
                      }
                      className="explore-cta-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add to Itinerary</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
