import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, MapPin, Tag, Plus, Check, Clock } from 'lucide-react';
import { api } from '../api/apiClient';
import { useTrip } from '../context/TripContext';

export const Explore = () => {
  const { savedPlaces, toggleSavePlace, openModal, selectedDay } = useTrip();
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState(['All', 'Sightseeing', 'Culture', 'Nightlife', 'Food', 'Art & Tech']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await api.getExploreCatalog({
          search,
          city: selectedCity === 'All Cities' ? '' : selectedCity,
          category: selectedCategory === 'All' ? '' : selectedCategory
        });
        if (res?.catalog) {
          const formattedCatalog = res.catalog.map((place) => {
            if (place.id === 'exp_tokyo_teamlab' || place.name?.toLowerCase().includes('teamlab')) {
              return { ...place, image: '/images/teamlab.jpg' };
            }
            if (place.id === 'exp_kyoto_arashiyama' || place.name?.toLowerCase().includes('arashiyama')) {
              return { ...place, image: '/images/arashiyama.jpg' };
            }
            return place;
          });
          setCatalog(formattedCatalog);
        }
        if (res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load explore catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [search, selectedCity, selectedCategory]);

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Explore Destinations</h2>
        <p className="text-xs text-slate-400">
          Discover top attractions, historic sights, culinary gems, and bookable activities
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121927] border border-white/[0.08]">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attractions, temples, ramen spots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All Cities', 'Tokyo', 'Kyoto', 'Paris'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                : 'bg-[#121927] text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Places Grid - Styled to match Sample Card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((place) => {
          const isSaved = savedPlaces.some(
            (p) => p.placeName.toLowerCase() === place.name.toLowerCase()
          );

          const starCount = Math.round(parseFloat(place.rating) || 5);

          return (
            <div
              key={place.id}
              className="explore-sample-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              {/* Top Photo & Badges */}
              <div className="h-48 w-full relative overflow-hidden bg-slate-800">
                <img
                  src={
                    place.id === 'exp_tokyo_teamlab' || place.name?.toLowerCase().includes('teamlab')
                      ? '/images/teamlab.jpg'
                      : place.id === 'exp_kyoto_arashiyama' || place.name?.toLowerCase().includes('arashiyama')
                      ? '/images/arashiyama.jpg'
                      : place.image
                  }
                  alt={place.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/shibuya.jpg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Diagonal Ribbon for Tag (Matching Sample Card 2 & 4) */}
                {place.tag && (
                  <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                    <div className="absolute transform -rotate-45 bg-gradient-to-r from-[#FF644E] to-[#FF4538] text-white text-[9px] font-black tracking-wider py-1 left-[-32px] top-[18px] w-[120px] text-center shadow-md uppercase">
                      {place.tag}
                    </div>
                  </div>
                )}

                {/* Bookmark Heart Button (Top-Right Floating Pill) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavePlace(place);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 ${
                    isSaved
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white/85 dark:bg-black/55 text-slate-700 dark:text-white/80 hover:text-rose-500 hover:bg-white shadow-sm'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save Place'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Card Body - Structured strictly matching the sample layout */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                <div>
                  {/* Row 1: Title in primary blue uppercase + Category in warm coral (Matching Sample) */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="explore-card-title text-sm font-bold uppercase tracking-tight text-sky-700 dark:text-sky-400 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                      {place.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#FF5B45] dark:text-[#FF8A65] whitespace-nowrap shrink-0">
                      {place.category}
                    </span>
                  </div>

                  {/* Row 2: 5-Star Rating & City / Country (Matching Sample ★★★★★ Address) */}
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
                      {place.city}, {place.country}
                    </span>
                  </div>

                  {/* Row 3: Description with ... More (Matching Sample) */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {place.description}
                    <span className="text-sky-600 dark:text-sky-400 font-medium ml-1 cursor-pointer hover:underline">
                      ... More
                    </span>
                  </p>

                  {/* Row 4: Timing / Experience line with Clock icon (Matching Sample Room / Flight timing line) */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                    <Clock className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                    <span className="truncate">
                      Recommended: <strong className="font-semibold text-slate-700 dark:text-slate-300">2–3 Hours</strong> • {place.tag || 'Instant Entry'}
                    </span>
                  </div>

                  {/* Row 5: View on Map line with MapPin icon (Matching Sample View on Map line) */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5B45] shrink-0" />
                    <span 
                      onClick={() => openModal('search')}
                      className="text-slate-600 dark:text-slate-300 hover:text-[#FF5B45] transition-colors cursor-pointer font-medium"
                    >
                      View on Map • {place.city}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Large Price & Action CTA (Matching Sample) */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 dark:border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
                      Estimated
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                      {place.price}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      openModal('addActivity', {
                        title: `Visit ${place.name}`,
                        location: `${place.name}, ${place.city}`,
                        category: place.category.toLowerCase(),
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
    </div>
  );
};
