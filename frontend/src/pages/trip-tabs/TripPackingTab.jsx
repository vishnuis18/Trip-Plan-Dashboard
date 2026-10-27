import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Sparkles, RefreshCw, Luggage, ShieldCheck, Sun } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import confetti from 'canvas-confetti';

export const TripPackingTab = () => {
  const { activeTrip } = useTrip();
  const tripId = activeTrip?._id || 'default_trip';

  const defaultPackingList = [
    // Essentials
    { id: 'pack_1', text: 'Passport & Photocopies (Valid 6+ months)', category: 'Essentials', checked: true },
    { id: 'pack_2', text: 'Credit/Debit cards + JPY/Local cash', category: 'Essentials', checked: true },
    { id: 'pack_3', text: 'Travel health & medical insurance policy', category: 'Essentials', checked: false },
    { id: 'pack_4', text: 'International Driving Permit (if renting car)', category: 'Essentials', checked: false },

    // Clothing
    { id: 'pack_5', text: 'Comfortable walking shoes / sneakers (15k+ steps/day)', category: 'Clothing', checked: true },
    { id: 'pack_6', text: 'Breathable daytime outfits (5 sets)', category: 'Clothing', checked: false },
    { id: 'pack_7', text: 'Light evening jacket / windbreaker', category: 'Clothing', checked: false },
    { id: 'pack_8', text: 'Compact travel umbrella', category: 'Clothing', checked: false },

    // Electronics & Tech
    { id: 'pack_9', text: 'Universal power plug adapter (Type A for Japan)', category: 'Electronics', checked: true },
    { id: 'pack_10', text: 'High-capacity power bank (10,000mAh+)', category: 'Electronics', checked: false },
    { id: 'pack_11', text: 'eSIM / Pocket Wi-Fi confirmation QR', category: 'Electronics', checked: true },
    { id: 'pack_12', text: 'Charging cables & USB multiport hub', category: 'Electronics', checked: false },

    // Toiletries & Health
    { id: 'pack_13', text: 'Prescription medicines in original bottles', category: 'Toiletries', checked: false },
    { id: 'pack_14', text: 'Travel-size sunscreen & lip balm', category: 'Toiletries', checked: false },
    { id: 'pack_15', text: 'Hydration electrolyte tablets & pain relievers', category: 'Toiletries', checked: false }
  ];

  const storageKey = `tripplan_packing_${tripId}`;

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultPackingList;
    } catch {
      return defaultPackingList;
    }
  });

  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Essentials');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save packing list:', e);
    }
  }, [items, storageKey]);

  const toggleCheck = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.checked;
          if (next) {
            confetti({
              particleCount: 20,
              spread: 40,
              origin: { y: 0.8 }
            });
          }
          return { ...item, checked: next };
        }
        return item;
      })
    );
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: 'pack_custom_' + Date.now(),
      text: newItemText.trim(),
      category: selectedCategory,
      checked: false
    };
    setItems((prev) => [newItem, ...prev]);
    setNewItemText('');
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetList = () => {
    if (confirm('Reset to standard AI recommended checklist?')) {
      setItems(defaultPackingList);
    }
  };

  const totalCount = items.length;
  const packedCount = items.filter((i) => i.checked).length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const categories = ['All', 'Essentials', 'Clothing', 'Electronics', 'Toiletries'];
  const displayedItems = activeFilter === 'All' 
    ? items 
    : items.filter((i) => i.category === activeFilter);

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Luggage className="w-5 h-5 text-purple-400" />
            <span>AI Packing Checklist — {activeTrip?.destination || 'Tokyo, Japan'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalized items based on your trip duration, seasonal forecast, and planned activities
          </p>
        </div>

        <button
          onClick={resetList}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Regenerate Checklist</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Packing Progress</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {packedCount} / {totalCount} Packed
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{progressPct}%</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500"
          />
        </div>
      </div>

      {/* Add New Item Input */}
      <form onSubmit={addItem} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-2xl bg-[#121927] border border-white/[0.08]">
        <input
          type="text"
          placeholder="Add an item to pack (e.g. Extra camera battery, Kimono socks)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#18233C] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="Essentials">Essentials</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Toiletries">Toiletries</option>
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === cat
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'bg-[#121927] text-slate-400 border-white/[0.06] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl overflow-hidden divide-y divide-white/[0.04]">
        {displayedItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No items in this category. Add your first item above!
          </div>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors group"
            >
              <div
                onClick={() => toggleCheck(item.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-3"
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`text-xs font-medium truncate ${
                  item.checked ? 'line-through text-slate-400' : 'text-slate-200 group-hover:text-white'
                }`}>
                  {item.text}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono shrink-0 hidden sm:inline-block">
                  {item.category}
                </span>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
