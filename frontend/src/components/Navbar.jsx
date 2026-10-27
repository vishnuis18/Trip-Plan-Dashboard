import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Plus, LogOut, User, Check, Sun, Moon } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onSearchChange }) => {
  const { notifications, openModal, activeTrip } = useTrip();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tripplan_theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('tripplan_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('tripplan_theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 px-6 border-b border-white/[0.07] bg-[#0B0E17]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Where do you want to go?"
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-[#131A2B] border border-white/[0.08] hover:border-white/15 focus:border-blue-500/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-[#131A2B] hover:bg-[#1A2338] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Create Trip Quick CTA */}
        <button
          onClick={() => openModal('addTrip')}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Trip</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-[#131A2B] hover:bg-[#1A2338] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2.5 right-2.5 ring-2 ring-[#0B0E17]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#131A2B] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.07]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                <span className="text-[11px] text-blue-400">{unreadCount} unread</span>
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-2.5 rounded-xl bg-[#1A2338]/60 hover:bg-[#1A2338] border border-white/[0.05] transition-all text-left"
                    >
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#131A2B] hover:bg-[#1A2338] border border-white/[0.08] transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center">
              {user?.name ? user.name[0].toUpperCase() : 'G'}
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
              {user?.name || 'Guest'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#131A2B] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/[0.07] mb-1">
                <p className="text-xs font-bold text-white">{user?.name || 'Guest User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Not signed in'}</p>
              </div>

              <button
                onClick={() => {
                  openModal('auth');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1C253C] transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch / Sign In</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
