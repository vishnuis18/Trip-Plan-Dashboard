import React, { useState } from 'react';
import { X, Plane, Calendar, Users, DollarSign, MapPin } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const AddTripModal = () => {
  const { closeModal, createTrip } = useTrip();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    totalBudget: 3000,
    airport: '',
    airportCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in Destination, Start Date, and End Date');
      return;
    }

    setSubmitting(true);
    setError('');

    // Compute nights
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Format dates string like "Apr 2 – 6, 2025"
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' });
    const datesFormatted = `${startFormatted} – ${endFormatted}`;

    const res = await createTrip({
      ...formData,
      nights,
      datesFormatted,
      title: `${formData.destination} Trip`,
      isActive: true
    });

    if (res.success) {
      closeModal();
    } else {
      setError(res.error || 'Failed to create trip');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create New Trip</h3>
            <p className="text-xs text-slate-400">Plan your next adventure in minutes</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Destination City & Country *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Kyoto, Japan or Paris, France"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Travelers</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Budget ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="50"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Arrival Airport (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. KIX (Kansai International Airport)"
              value={formData.airport}
              onChange={(e) => setFormData({ ...formData, airport: e.target.value })}
              className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
