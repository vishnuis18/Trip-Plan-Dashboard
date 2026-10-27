import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Star, 
  Sparkles, 
  Plus, 
  Trash2, 
  Share2, 
  Calendar, 
  MapPin, 
  Camera, 
  Heart, 
  Smile, 
  Copy, 
  Check, 
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import confetti from 'canvas-confetti';

export const TripJournalTab = () => {
  const { activeTrip, activities, budgetSummary } = useTrip();
  const tripId = activeTrip?._id || 'default_trip';
  const destination = activeTrip?.destination || 'Tokyo, Japan';

  const defaultEntries = [
    {
      id: 'entry_1',
      day: 1,
      title: 'Touchdown in Haneda & Late Night Shinjuku Neon',
      date: 'May 14, 2025',
      rating: 5,
      mood: '🤩 Mind-blown',
      location: 'Shinjuku Golden Gai',
      image: '/images/shibuya.jpg',
      reflection: 'The transition from the 14-hour flight into the dazzling neon rain of Shinjuku was surreal. Grabbed piping hot tonkotsu ramen at a 6-seat alley stall. The city never sleeps.'
    },
    {
      id: 'entry_2',
      day: 2,
      title: 'Immersion in teamLab Planets & Senso-ji Twilight',
      date: 'May 15, 2025',
      rating: 5,
      mood: '✨ Ethereal',
      location: 'teamLab Toyosu & Asakusa',
      image: '/images/teamlab.jpg',
      reflection: 'Walking barefoot through water surrounded by floating infinite koi projections was unforgettable. Later at sunset, Senso-ji Temple glowed with massive crimson lanterns.'
    },
    {
      id: 'entry_3',
      day: 3,
      title: 'Day Trip to Mount Fuji & Chureito Pagoda Views',
      date: 'May 16, 2025',
      rating: 5,
      mood: '🏔️ Awe-inspired',
      location: 'Lake Kawaguchiko',
      image: '/images/mount_fuji.jpg',
      reflection: 'We got lucky with crystal clear skies. The symmetrical snow-capped peak framed by pink cherry blossoms was like stepping inside a postcard.'
    }
  ];

  const storageKey = `tripplan_journal_${tripId}`;

  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultEntries;
    } catch {
      return defaultEntries;
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [copiedRecap, setCopiedRecap] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    day: 1,
    date: 'May 17, 2025',
    rating: 5,
    mood: '🤩 Mind-blown',
    location: '',
    image: '/images/tokyo_tower.jpg',
    reflection: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch (e) {
      console.warn('Could not save journal:', e);
    }
  }, [entries, storageKey]);

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newEntry = {
      id: 'entry_' + Date.now(),
      day: Number(formData.day),
      title: formData.title.trim(),
      date: formData.date.trim() || 'Day ' + formData.day,
      rating: Number(formData.rating),
      mood: formData.mood,
      location: formData.location.trim() || destination,
      image: formData.image || '/images/tokyo_tower.jpg',
      reflection: formData.reflection.trim() || 'A day full of wonder and discovery.'
    };

    setEntries((prev) => [newEntry, ...prev]);
    setShowAddModal(false);
    setFormData({
      title: '',
      day: 1,
      date: 'May 17, 2025',
      rating: 5,
      mood: '🤩 Mind-blown',
      location: '',
      image: '/images/tokyo_tower.jpg',
      reflection: ''
    });

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopyRecapText = () => {
    const recapText = `🗺️ TRIP RECAP: ${destination}
📅 Duration: ${activeTrip?.days || entries.length} Days
⭐ Highlights:
${entries.map(e => `• Day ${e.day}: ${e.title} (${'★'.repeat(e.rating)}) - "${e.reflection.slice(0, 80)}..."`).join('\n')}

💰 Total Expenses: $${budgetSummary?.totalSpent || 1850}
🎯 Activities Completed: ${activities?.length || 8}
✨ Planned with TripPlan`;

    navigator.clipboard.writeText(recapText);
    setCopiedRecap(true);
    setTimeout(() => setCopiedRecap(false), 2500);

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const presetImages = [
    { label: 'Tokyo Tower', url: '/images/tokyo_tower.jpg' },
    { label: 'Shibuya', url: '/images/shibuya.jpg' },
    { label: 'teamLab', url: '/images/teamlab.jpg' },
    { label: 'Mount Fuji', url: '/images/mount_fuji.jpg' },
    { label: 'Arashiyama', url: '/images/arashiyama.jpg' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Trip Journal & Memories</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Trip Recap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture daily reflections, photos, star ratings, and export a memorable trip story for {destination}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowRecapModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition-all"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Export Trip Story</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Write Entry</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Total Entries</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">{entries.length}</span>
            <span className="text-[11px] text-slate-400">stories</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">5-Star Highlights</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">
              {entries.filter(e => e.rating === 5).length}
            </span>
            <span className="text-[11px] text-slate-400">moments</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Photos Captured</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">{entries.length * 4 + 18}</span>
            <span className="text-[11px] text-slate-400">saved</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Trip Rating</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-400">
              {entries.length ? (entries.reduce((a, b) => a + b.rating, 0) / entries.length).toFixed(1) : '5.0'}
            </span>
            <span className="text-[11px] text-slate-400">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Entries Gallery */}
      {entries.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#141B2D]/40 border border-white/[0.05] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">Your journal is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Record your best moments, funny travel anecdotes, and favorite meals in {destination}.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold border border-blue-500/30 transition-all"
          >
            + Write First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group rounded-3xl bg-[#141B2D]/80 border border-white/[0.07] hover:border-indigo-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/images/tokyo_tower.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141B2D] via-transparent to-black/30" />

                {/* Day Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                    Day {entry.day}
                  </span>
                  <span className="px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[11px] font-medium text-slate-300 border border-white/10">
                    {entry.mood}
                  </span>
                </div>

                {/* Rating Stars & Delete */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < entry.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl bg-black/60 backdrop-blur-md text-slate-400 hover:text-red-400 transition-all border border-white/10"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Location */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{entry.location}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{entry.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300/90 leading-relaxed italic bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                    "{entry.reflection}"
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Camera className="w-3 h-3" />
                    <span>Captured in {destination}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                    View Gallery →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-white mb-1">Write Journal Entry</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a memorable highlight, rated review, and thoughts for {destination}.
            </p>

            <form onSubmit={handleAddEntry} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Entry Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning matcha in Yanaka & Shibuya Crossing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Star Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mood / Vibe
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="🤩 Mind-blown">🤩 Mind-blown</option>
                    <option value="✨ Ethereal">✨ Ethereal</option>
                    <option value="🍜 Foodie Heaven">🍜 Foodie</option>
                    <option value="🏔️ Awe-inspired">🏔️ Awe</option>
                    <option value="☕ Cozy & Chill">☕ Relaxed</option>
                    <option value="🏃 Packed & Fast">🏃 Fast-paced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Location / Place
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asakusa, Shibuya Sky"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May 16, 2025"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Choose Photo Banner
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {presetImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        formData.image === img.url
                          ? 'border-blue-500 shadow-md scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Your Reflection & Thoughts
                </label>
                <textarea
                  rows={3}
                  placeholder="What was the highlight? What surprised you most? Any tips for the future?"
                  value={formData.reflection}
                  onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Story / Recap Modal */}
      {showRecapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Trip Story & Recap Card</h3>
                <p className="text-xs text-slate-400">Share your journey recap with friends or export to social</p>
              </div>
            </div>

            {/* Preview Recap Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#18233C] to-[#121927] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{destination}</h4>
                  <p className="text-xs text-blue-400">{activeTrip?.days || entries.length} Days Adventure</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>5.0 Highlight Trip</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.06] text-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Activities</p>
                  <p className="text-base font-bold text-white">{activities?.length || 8}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Spent</p>
                  <p className="text-base font-bold text-emerald-400">${budgetSummary?.totalSpent || 1850}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Moments</p>
                  <p className="text-base font-bold text-purple-400">{entries.length}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2">Featured Highlights:</p>
                <div className="space-y-1.5">
                  {entries.slice(0, 3).map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-xs text-slate-300">
                      <span className="truncate pr-2">• Day {e.day}: {e.title}</span>
                      <span className="text-amber-400 shrink-0 font-mono">{'★'.repeat(e.rating)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRecapModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyRecapText}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
              >
                {copiedRecap ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text Recap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
