import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Globe, 
  Bell, 
  Download, 
  Printer, 
  Sparkles, 
  Shield, 
  Check, 
  Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

export const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { activeTrip, activities, expenses, savedPlaces } = useTrip();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, currency, theme });
    if (res.success) {
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2500);
    }
  };

  const handleExportJSON = () => {
    const tripData = {
      user: { name: user?.name, email: user?.email },
      trip: activeTrip,
      activities,
      expenses,
      savedPlaces,
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tripData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeTrip?.destination || 'TripPlan'}_complete_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <h2 className="text-2xl font-bold text-white tracking-tight">Account & Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your travel profile, currency preferences, and plan details
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Profile Details</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg"
            />
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'Not signed in'}
                  className="w-full bg-[#141B2D] border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Travel Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Appearance Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="dark">Space Cadet Dark (Default)</option>
                <option value="midnight">Midnight Tokyo Glow</option>
                <option value="obsidian">Obsidian Dim</option>
              </select>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] mt-1">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Flight & Itinerary Notifications</span>
                <span className="text-[11px] text-slate-400">Receive schedule reminders 24h prior</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Data & Backup */}
        <div className="p-6 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Download className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Export & Backup</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Trip Data (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / Save PDF Summary</span>
            </button>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedStatus && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved!</span>
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
