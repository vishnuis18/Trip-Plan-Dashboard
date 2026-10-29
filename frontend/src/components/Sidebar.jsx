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
  Sparkles,
  ArrowRightLeft
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
    { id: 'fx', label: 'Live FX Converter', icon: ArrowRightLeft },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
    { id: 'saved', label: 'Saved', icon: Heart },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#0B0E17]/95 border-r border-white/[0.07] p-4 select-none z-30 overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-1 pt-1">
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
          className="sidebar-search-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141B2D]/80 border border-white/[0.08] hover:border-[#FF5B45]/40 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#FF5B45] transition-colors" />
            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Search anything...</span>
          </div>
          <kbd className="sidebar-search-kbd text-[10px] font-bold bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md border border-white/10 font-mono">
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
                className={`sidebar-nav-btn flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                  <span className="sidebar-ai-pill text-[10px] px-2 py-0.5 rounded-full font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-indigo-300 border border-purple-500/30">
                    AI
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className={`sidebar-badge text-[11px] px-2 py-0.5 rounded-full font-semibold ${
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
            className={`sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
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

      <div className="flex flex-col gap-3 pt-3 shrink-0">
        {/* Next Trip Ready Promo Card */}
        <div className="relative rounded-2xl overflow-hidden p-3.5 border border-white/[0.08] shadow-lg group sidebar-promo">
          <img
            src="/images/mount_fuji.jpg"
            alt="Fuji scenery"
            className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 opacity-50 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
          
          <div className="relative z-10">
            <h4 className="text-sm font-semibold text-white mb-1">Next trip ready?</h4>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-2.5">
              Explore new destinations and create your next adventure.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white backdrop-blur-md transition-all border border-white/20 shadow-sm cursor-pointer"
            >
              <span>Discover</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* User Profile / Guest Sign In Card (Prominent & Noticeable) */}
        <div 
          onClick={() => {
            if (user) {
              setActiveTab('settings');
            } else {
              window.history.pushState({}, '', '/login');
              setActiveTab('login');
            }
          }}
          className="sidebar-profile-card flex items-center justify-between p-3 rounded-2xl bg-[#141B2D]/60 hover:bg-[#141B2D] border border-white/[0.08] hover:border-blue-500/40 transition-all cursor-pointer group shadow-sm"
          title={user ? "Account Settings" : "Sign in to TripPlan"}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={user?.name || "User"}
                className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500/40 group-hover:scale-105 transition-transform"
              />
              {!user && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-2 ring-[#0B0E17]" />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-[11px] font-semibold mt-0.5 text-blue-400 group-hover:underline flex items-center gap-0.5">
                {user ? (user.plan || 'Free Plan') : 'Sign in to sync →'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>
    </aside>
  );
};
