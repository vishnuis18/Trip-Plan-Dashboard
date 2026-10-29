import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Plus, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ setActiveTab, onSearchChange }) => {
  const { notifications, openModal, activeTrip } = useTrip();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            className="w-full h-10 bg-slate-100 dark:bg-[#131A2B] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15 focus:border-[#FF5B45] dark:focus:border-[#FF5B45] rounded-xl pl-10 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B45]/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="navbar-btn cursor-pointer shadow-sm active:scale-95"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Create Trip Quick CTA */}
        <button
          onClick={() => openModal('addTrip')}
          className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#FF644E] to-[#FF4538] hover:from-[#FF553E] hover:to-[#FF3628] text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Trip</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="navbar-btn cursor-pointer shadow-sm active:scale-95 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B45] absolute top-2 right-2 ring-2 ring-white dark:ring-[#131A2B] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#131A2B] border border-slate-200 dark:border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/[0.07]">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications
                </h4>
                <span className="text-[11px] font-bold text-[#FF5B45]">
                  {unreadCount} unread
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#1A2338]/60 dark:hover:bg-[#1A2338] border border-slate-200/60 dark:border-white/[0.05] transition-all text-left"
                    >
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="navbar-profile-pill cursor-pointer shadow-sm active:scale-95 group"
          >
            {/* High-Contrast Gradient Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF644E] to-[#FF4538] text-white text-xs font-black flex items-center justify-center shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'G'}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
              {user?.name || 'Guest'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#131A2B] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-white/[0.07] mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Guest User'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'Not signed in'}</p>
              </div>

              {!user ? (
                <button
                  onClick={() => {
                    if (setActiveTab) {
                      window.history.pushState({}, '', '/login');
                      setActiveTab('login');
                    } else {
                      openModal('auth');
                    }
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#FF5B45] hover:bg-[#FFF5F3] dark:hover:bg-[#FF5B45]/10 transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#FF5B45]" />
                  <span>Sign In / Register</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (setActiveTab) setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C253C] transition-colors text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    <span>My Account & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
