import React from 'react';
import { Heart, Star, MapPin, Trash2, Plus, ArrowRight, ExternalLink } from 'lucide-react';
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
          {savedPlaces.map((place) => (
            <div
              key={place._id}
              className="rounded-3xl overflow-hidden bg-[#121927] border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              {/* Photo & Actions */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={
                    place.placeName?.toLowerCase().includes('teamlab') || place.name?.toLowerCase().includes('teamlab')
                      ? '/images/teamlab.jpg'
                      : place.placeName?.toLowerCase().includes('arashiyama') || place.name?.toLowerCase().includes('arashiyama')
                      ? '/images/arashiyama.jpg'
                      : place.image || '/images/shibuya.jpg'
                  }
                  alt={place.placeName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/shibuya.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-black/30" />

                {/* Remove Bookmark Button */}
                <button
                  onClick={() => toggleSavePlace(place)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center hover:bg-rose-600 transition-colors"
                  title="Remove from bookmarks"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {place.category || 'Sightseeing'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {place.location}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating || 4.8}</span>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {place.placeName}
                  </h4>
                  {place.description && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>
                  )}
                  {place.notes && (
                    <p className="text-[11px] text-amber-300/80 mt-2 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                      💡 {place.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-1">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {place.estimatedCost || '$25'}
                  </span>

                  <button
                    onClick={() =>
                      openModal('addActivity', {
                        title: `Visit ${place.placeName}`,
                        location: place.location,
                        category: (place.category || 'sightseeing').toLowerCase(),
                        day: selectedDay || 1
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Itinerary</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
