import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const AddActivityModal = () => {
  const { closeModal, modalPayload, addActivity, editActivity, selectedDay } = useTrip();

  const isEdit = modalPayload?.isEdit;
  const [formData, setFormData] = useState({
    day: modalPayload?.day || selectedDay || 1,
    time: modalPayload?.time || '02:00 PM',
    title: modalPayload?.title || '',
    duration: modalPayload?.duration || '60m',
    location: modalPayload?.location || '',
    category: modalPayload?.category || 'sightseeing',
    color: modalPayload?.color || '#3B82F6',
    notes: modalPayload?.notes || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const colors = [
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Sky', value: '#0284C7' },
    { label: 'Yellow', value: '#EAB308' },
    { label: 'Green', value: '#22C55E' },
    { label: 'Orange', value: '#F97316' },
    { label: 'Red', value: '#EF4444' },
    { label: 'Purple', value: '#A855F7' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;

    setSubmitting(true);
    if (isEdit && modalPayload?._id) {
      await editActivity(modalPayload._id, formData);
    } else {
      await addActivity(formData);
    }
    setSubmitting(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">
          {isEdit ? 'Edit Activity' : 'Add Itinerary Activity'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">Organize daily places, times, and activities</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: Number(e.target.value) })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value={1}>Day 1 (Shibuya)</option>
                <option value={2}>Day 2 (Tradition)</option>
                <option value={3}>Day 3 (Akihabara)</option>
                <option value={4}>Day 4 (Nightlife)</option>
                <option value={5}>Day 5 (Departure)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 02:00 PM"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activity Title *</label>
            <input
              type="text"
              placeholder="e.g. Shibuya Sky observatory (sunset)"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
              <input
                type="text"
                placeholder="e.g. 60m or 90m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="transit">Transit / Arrival</option>
                <option value="accommodation">Accommodation</option>
                <option value="food">Food & Dining</option>
                <option value="nightlife">Nightlife</option>
                <option value="culture">Culture & Temples</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / Address</label>
            <input
              type="text"
              placeholder="e.g. Shibuya Scramble Square 47F"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Color Indicator */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dot Color</label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setFormData({ ...formData, color: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.color === c.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
