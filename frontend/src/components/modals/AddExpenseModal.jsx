import React, { useState } from 'react';
import { X, DollarSign, Tag, CreditCard } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const AddExpenseModal = () => {
  const { closeModal, addExpense } = useTrip();
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    description: '',
    paymentMethod: 'Credit Card',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Flights', 'Hotels', 'Food', 'Activities', 'Transport', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    setSubmitting(true);
    await addExpense({
      ...formData,
      amount: Number(formData.amount)
    });
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

        <h3 className="text-lg font-bold text-white mb-1">Add Trip Expense</h3>
        <p className="text-xs text-slate-400 mb-5">Keep track of your travel spending in real-time</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    formData.category === cat
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                      : 'bg-[#18233C] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount ($) *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description / Vendor</label>
            <input
              type="text"
              placeholder="e.g. Dinner at Gonpachi or Suica Card recharge"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Apple Pay">Apple Pay / Google Pay</option>
                <option value="Cash (JPY)">Cash</option>
                <option value="IC Card (Suica/Pasmo)">IC Transit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              />
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
