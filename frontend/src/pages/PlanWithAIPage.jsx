import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Wallet, 
  Compass, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  Plane, 
  Layers, 
  Heart,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useTrip } from '../context/TripContext';
import confetti from 'canvas-confetti';

export const PlanWithAIPage = ({ setActiveTab }) => {
  const { switchTrip, loadData } = useTrip();

  // Wizard state
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [days, setDays] = useState(5);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [pace, setPace] = useState('moderate'); // relaxed, moderate, fast
  const [budgetLevel, setBudgetLevel] = useState('comfortable'); // budget, comfortable, luxury
  const [selectedInterests, setSelectedInterests] = useState(['Food & Dining', 'Culture', 'Sightseeing']);
  const [prompt, setPrompt] = useState('');

  // Flow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDay, setPreviewDay] = useState(1);

  const presets = [
    { name: 'Tokyo, Japan', desc: 'Neon, Michelin Ramen & Temples', days: 5, pace: 'moderate', img: '/images/mount_fuji.jpg' },
    { name: 'Kyoto, Japan', desc: 'Bamboo Groves & 10,000 Torii Gates', days: 4, pace: 'relaxed', img: '/images/arashiyama.jpg' },
    { name: 'Paris, France', desc: 'Art, Seine Cafés & Eiffel Tower', days: 5, pace: 'moderate', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80' },
    { name: 'Bali, Indonesia', desc: 'Jungle Swings, Rice Terraces & Spas', days: 6, pace: 'relaxed', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80' }
  ];

  const interestOptions = [
    'Food & Dining',
    'Culture & Temples',
    'Sightseeing',
    'Art & Museums',
    'Nature & Parks',
    'Nightlife & Bars',
    'Shopping & Vintage',
    'Photography Hotspots',
    'Relaxation & Spa'
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleApplyPreset = (p) => {
    setDestination(p.name);
    setDays(p.days);
    setPace(p.pace);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGeneratedPlan(null);
    setCurrentStepIndex(0);

    // Multi-phase generation animation steps
    const stepDelays = [400, 800, 1200, 1600];
    stepDelays.forEach((delay, idx) => {
      setTimeout(() => {
        setCurrentStepIndex(idx + 1);
      }, delay);
    });

    try {
      const res = await api.generateItineraryAI({
        destination,
        days,
        startDate,
        pace,
        budgetLevel,
        interests: selectedInterests,
        prompt
      });

      setTimeout(() => {
        setIsGenerating(false);
        if (res?.result) {
          setGeneratedPlan(res.result);
          setPreviewDay(1);
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 2000);
    } catch (err) {
      console.error('AI itinerary error:', err);
      setIsGenerating(false);
      alert('Could not synthesize AI plan: ' + err.message);
    }
  };

  const handleSaveAndActivate = async () => {
    try {
      setIsSaving(true);
      const res = await api.generateItineraryAI({
        destination,
        days,
        startDate,
        pace,
        budgetLevel,
        interests: selectedInterests,
        prompt,
        saveImmediately: true
      });

      if (res?.savedTrip) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.4 }
        });
        if (loadData) await loadData();
        if (setActiveTab) setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Error saving trip:', err);
      alert('Failed to save trip: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const progressSteps = [
    'Analyzing destination geography & seasonal weather...',
    'Selecting top-rated venues & hidden local gems...',
    'Optimizing day-by-day transit routes...',
    'Allocating category budget & live FX rates...',
    'Itinerary synthesized!'
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 overflow-hidden shadow-2xl border border-indigo-500/20 ai-hero-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>AI Co-Planner Engine v2.5</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Design your ideal trip in seconds with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 font-black">
              TripPlan AI
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed font-normal">
            Tell us where you want to go and your travel style. Our neural engine synthesizes route-optimized daily timelines, category budgets, and smart packing checklists.
          </p>
        </div>
      </div>

      {/* Preset Inspirations Bar */}
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Instant Destination Inspiration
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {presets.map((p) => {
            const isSelected = destination.toLowerCase().includes(p.name.toLowerCase().split(',')[0]);
            return (
              <div
                key={p.name}
                onClick={() => handleApplyPreset(p)}
                className={`group relative rounded-2xl overflow-hidden min-h-[125px] p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 select-none preset-dest-card ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-400 shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'border border-white/10 hover:border-blue-400/40 hover:shadow-lg hover:scale-[1.01]'
                }`}
              >
                {/* Full-bleed rich travel image */}
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 brightness-[0.72] contrast-[1.08]"
                />
                {/* Dark gradient overlay scrim for 100% legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 group-hover:from-slate-950 transition-colors" />

                {/* Top status bar with pill & check */}
                <div className="relative z-10 flex items-center justify-between mb-auto pb-1">
                  <span className="text-[10px] font-bold text-sky-200 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-sky-400/30 backdrop-blur-md">
                    {p.days} Days • {p.pace.charAt(0).toUpperCase() + p.pace.slice(1)}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-500/40">
                      ✓
                    </span>
                  )}
                </div>

                {/* Bottom title and description */}
                <div className="relative z-10 pt-2">
                  <h4 className="text-sm font-bold text-white tracking-tight drop-shadow-sm group-hover:text-sky-200 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1 font-normal drop-shadow-sm">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generation Wizard Form */}
      <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <span>Trip Preferences & Parameters</span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Row 1: Destination & Dates & Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Destination *</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan or Rome, Italy"
                className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Departure Date *</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duration</span>
                </span>
                <span className="text-blue-400 font-bold">{days} Days</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 7, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      days === d
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500'
                        : 'ai-param-btn-inactive bg-[#18233C] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Pace & Budget Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Travel Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: '2-3 stops/day' },
                  { id: 'moderate', label: 'Balanced', desc: '3-4 stops/day' },
                  { id: 'fast', label: 'Action-Packed', desc: '5+ stops/day' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPace(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      pace === item.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'ai-param-btn-inactive bg-[#18233C]/60 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <p className={`text-xs font-bold ${pace === item.id ? 'text-white' : 'text-slate-200'}`}>{item.label}</p>
                    <p className={`text-[10px] mt-0.5 ${pace === item.id ? 'text-blue-100' : 'text-slate-400'}`}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Backpacker', symbol: '$' },
                  { id: 'comfortable', label: 'Comfortable', symbol: '$$' },
                  { id: 'luxury', label: 'Luxury & Premium', symbol: '$$$' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBudgetLevel(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      budgetLevel === item.id
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'ai-param-btn-inactive bg-[#18233C]/60 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <span className={`text-[11px] font-mono font-bold ${budgetLevel === item.id ? 'text-emerald-100' : 'text-emerald-400'}`}>{item.symbol}</span>
                    <p className={`text-xs font-bold mt-0.5 ${budgetLevel === item.id ? 'text-white' : 'text-slate-200'}`}>{item.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Interests Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Trip Vibe & Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-500'
                        : 'ai-param-btn-inactive bg-[#18233C] text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Custom Co-Planner Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Specific Requests or Must-See Spots (Optional)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Include a morning coffee tour, Gion teahouse, and avoid crowded peak hours"
              className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Custom Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Itinerary with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Progress Simulation Card */}
      {isGenerating && (
        <div className="p-6 rounded-3xl bg-[#141B2D]/90 border border-blue-500/30 shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AI Co-Planner Synthesis in Progress</h4>
              <p className="text-xs text-slate-400">Assembling optimal stops for {destination}...</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {progressSteps.map((step, idx) => {
              const isDone = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : isCurrent
                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-200 font-semibold'
                      : 'bg-white/[0.02] border-white/[0.04] text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Result Preview */}
      {generatedPlan && !isGenerating && (
        <div className="rounded-3xl bg-[#121927]/95 border border-white/10 p-6 shadow-2xl space-y-6">
          {/* Header Preview Banner */}
          <div className="relative rounded-2xl overflow-hidden min-h-[180px] p-6 flex flex-col justify-between border border-white/10">
            <img
              src={generatedPlan.coverImage}
              alt={generatedPlan.destination}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            <div className="relative z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 border border-blue-500/40 text-blue-300">
                AI Generated • {generatedPlan.daysCount} Days • {generatedPlan.pace} Pace
              </span>
              <h2 className="text-2xl font-black text-white mt-2">{generatedPlan.title}</h2>
              <p className="text-xs text-slate-300 mt-1">
                Estimated budget: ${generatedPlan.totalBudget.toLocaleString()} • Airport: {generatedPlan.airport}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-4">
              <span className="text-xs text-emerald-400 font-semibold">
                ✓ Ready for immediate activation
              </span>
              <button
                onClick={handleSaveAndActivate}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Trips...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save to My Trips & Set Active</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Day Selector Pills for Generated Plan */}
          <div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {generatedPlan.generatedDays.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setPreviewDay(d.day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    previewDay === d.day
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Day {d.day}: {d.theme.slice(0, 18)}...
                </button>
              ))}
            </div>

            {/* Activities for the selected day */}
            {(() => {
              const currentDayObj = generatedPlan.generatedDays.find((d) => d.day === previewDay);
              if (!currentDayObj) return null;

              return (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white">
                      Day {currentDayObj.day} — {currentDayObj.theme}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {currentDayObj.activities.length} Scheduled Stops
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentDayObj.activities.map((act, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#141B2D]/80 border border-white/[0.06] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono font-bold shrink-0 mt-0.5">
                            {act.time}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-slate-400">
                                {act.category}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-[10px] text-slate-300 font-medium">
                                {act.location}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white mt-0.5">{act.title}</h5>
                            <p className="text-xs text-slate-400 mt-1">{act.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs font-bold text-emerald-400">
                            {act.costEstimate > 0 ? `$${act.costEstimate}` : 'Free'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {act.durationMin} mins
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Budget Allocation & Packing Checklist Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            {/* Category Budget Allocation */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/[0.05]">
              <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>AI Budget Allocation (${generatedPlan.totalBudget.toLocaleString()})</span>
              </h5>
              <div className="space-y-2">
                {generatedPlan.budgetBreakdown.map((b) => (
                  <div key={b.category} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{b.category}</span>
                    <span className="font-mono font-bold text-white">${b.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Pre-trip Checklist */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/[0.05]">
              <h5 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Pre-Trip Packing Checklist</span>
              </h5>
              <div className="space-y-1.5 text-xs text-slate-300">
                {generatedPlan.smartChecklist.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
