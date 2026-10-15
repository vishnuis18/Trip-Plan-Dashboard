import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, MapPin, Tag, Plus, Check } from 'lucide-react';
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

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((place) => {
          const isSaved = savedPlaces.some(
            (p) => p.placeName.toLowerCase() === place.name.toLowerCase()
          );

          return (
            <div
              key={place.id}
              className="rounded-3xl overflow-hidden bg-[#121927] border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
            >
              {/* Photo & Badge */}
              <div className="h-48 relative overflow-hidden">
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-black/30" />

                {/* Bookmark Heart Button */}
                <button
                  onClick={() => toggleSavePlace(place)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isSaved
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-black/50 text-white/80 hover:text-rose-400 hover:bg-black/80'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save Place'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Category Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {place.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/80 backdrop-blur-md text-white">
                    {place.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {place.city}, {place.country}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {place.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                {/* Price & Add to Itinerary Action */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Estimated</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{place.price}</span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-all"
                  >
                    <Plus className="w-3 h-3" />
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
