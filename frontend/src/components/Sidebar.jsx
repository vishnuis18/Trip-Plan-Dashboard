import React from 'react';
import { 
  Home, 
  Compass, 
  Wallet, 
  CalendarDays, 
  Heart, 
  Settings, 
  Search, 
  Plane,
  ArrowRight,
  ChevronRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { trips, openModal } = useTrip();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'ai', label: 'Plan with AI', icon: Sparkles, isAi: true },
    { id: 'trips', label: 'Trips', icon: Plane, badge: trips?.length || 0 },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
    { id: 'saved', label: 'Saved', icon: Heart },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#0B0E17]/95 border-r border-white/[0.07] p-5 select-none z-30">
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plane className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">TripPlan</h1>
            <p className="text-xs text-slate-400 font-medium">Better trips. Less stress.</p>
          </div>
        </div>

        {/* Quick Search Button / Input */}
        <div 
          onClick={() => openModal('search')}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141B2D]/80 border border-white/[0.08] hover:border-blue-500/40 text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-inner group"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Search anything...</span>
          </div>
          <kbd className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-white/10 font-mono">
            ⌘ K
          </kbd>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#18233C] text-white shadow-sm border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141B2D]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isAi && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-indigo-300 border border-purple-500/30">
                    AI
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'bg-[#1C253C] text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings Item */}
        <div className="pt-2 border-t border-white/[0.06]">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-[#18233C] text-white border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141B2D]/50'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Next Trip Ready Promo Card */}
        <div className="relative rounded-2xl overflow-hidden p-4 border border-white/[0.08] shadow-lg group sidebar-promo">
          <img
            src="/images/mount_fuji.jpg"
            alt="Fuji scenery"
            className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 opacity-35 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          
          <div className="relative z-10">
            <h4 className="text-sm font-semibold text-white mb-1">Next trip ready?</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed mb-3">
              Explore new destinations and create your next adventure.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white backdrop-blur-md transition-all border border-white/10 shadow-sm"
            >
              <span>Discover</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#141B2D]/40 hover:bg-[#141B2D] border border-white/[0.06] hover:border-white/15 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={user?.name || "User"}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/30"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Guest'}</p>
              <p className="text-[11px] text-slate-400 font-medium">{user ? (user.plan || 'Free Plan') : 'Not signed in'}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
