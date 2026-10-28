import React, { useState } from 'react';
import { 
  Plane, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sun, 
  Moon,
  Compass,
  Wallet,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import confetti from 'canvas-confetti';

export const LoginPage = ({ onSuccess, onBack }) => {
  const { login, register, loading } = useAuth();
  const { refreshData } = useTrip();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  // Theme toggle sync
  const [theme, setTheme] = useState(() => localStorage.getItem('tripplan_theme') || 'dark');
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

  const handleSuccessfulAuth = async (message = 'Welcome back!') => {
    setSuccessMsg(message);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (refreshData) {
      await refreshData();
    }
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      const res = await register(formData.name.trim(), emailTrimmed, formData.password);
      if (res.success) {
        await handleSuccessfulAuth('Account created successfully! Welcome to TripPlan.');
      } else {
        setError(res.error || 'Failed to create account. Please try again.');
      }
    } else {
      const res = await login(emailTrimmed, formData.password);
      if (res.success) {
        await handleSuccessfulAuth('Signed in successfully! Redirecting...');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] text-slate-100 flex flex-col font-sans relative selection:bg-blue-500/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="h-16 px-6 sm:px-10 border-b border-white/[0.07] bg-[#0B0E17]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div 
          onClick={onBack}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Plane className="w-4 h-4 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">TripPlan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Better trips. Less stress.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-[#131A2B] hover:bg-[#1A2338] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Return to Dashboard CTA */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue as Guest</span>
          </button>
        </div>
      </header>

      {/* Main Split Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Visual Brand & Live Trip Experience Preview (Protected High Contrast) */}
          <div className="login-hero-banner hidden lg:flex lg:col-span-6 flex-col justify-between p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden min-h-[580px] bg-slate-900">
            {/* Background image overlay - Vivid, rich, and clear in both light and dark mode */}
            <img 
              src="/images/mount_fuji.jpg" 
              alt="Fuji Travel Destination" 
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.80] contrast-[1.08] pointer-events-none transition-transform duration-1000"
            />
            {/* Photographic Gradient Overlays for perfect legibility matching TripBanner */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

            {/* Top Tagline */}
            <div className="relative z-10 flex flex-col gap-3">
              <div className="login-hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-semibold w-fit shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span style={{ color: '#BAE6FD' }}>Intelligent Travel Platform</span>
              </div>

              <h2 
                className="text-3xl xl:text-4xl font-bold tracking-tight leading-[1.25]"
                style={{ color: '#FFFFFF' }}
              >
                Where every journey begins with{' '}
                <span style={{ color: '#38BDF8' }}>
                  clarity.
                </span>
              </h2>

              <p 
                className="text-xs xl:text-sm leading-relaxed max-w-md font-normal"
                style={{ color: '#CBD5E1' }}
              >
                Streamline flight times, daily itineraries, shared expenses, and smart AI recommendations into one harmonious dashboard.
              </p>
            </div>

            {/* Middle Feature Highlights Cards */}
            <div className="relative z-10 my-6 flex flex-col gap-3">
              {/* Interactive Trip Preview Card */}
              <div className="login-preview-card p-4 rounded-2xl bg-[#141B2D]/90 backdrop-blur-xl border border-white/15 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-md shrink-0 border border-white/10">
                    <img 
                      src="/images/shibuya.jpg" 
                      alt="Tokyo" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/images/mount_fuji.jpg'; }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>Tokyo Cherry Blossom Adventure</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>Apr 2 – Apr 6 • 5 Days • 2 Travelers</p>
                  </div>
                </div>

                <div className="text-right pl-3 border-l border-white/10 hidden sm:block">
                  <span className="text-[10px] block font-medium" style={{ color: '#94A3B8' }}>Budget Tracking</span>
                  <span className="text-xs font-bold text-emerald-400">$2,840 / $3,680</span>
                </div>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="login-value-pill p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-sm">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-[11px] font-semibold" style={{ color: '#F1F5F9' }}>Live Itinerary</span>
                </div>
                <div className="login-value-pill p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-sm">
                  <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold" style={{ color: '#F1F5F9' }}>Split & Budget</span>
                </div>
                <div className="login-value-pill p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-sm">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-semibold" style={{ color: '#F1F5F9' }}>AI Co-Planner</span>
                </div>
              </div>
            </div>

            {/* Bottom Social Proof */}
            <div className="login-social-proof relative z-10 pt-4 border-t border-white/[0.12] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <img className="w-7 h-7 rounded-full border-2 border-[#121927] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Traveler" />
                  <img className="w-7 h-7 rounded-full border-2 border-[#121927] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Traveler" />
                  <img className="w-7 h-7 rounded-full border-2 border-[#121927] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Traveler" />
                </div>
                <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>Joined by 25,000+ wanderers</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                <span>★ 4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean, Beautiful, Focused Auth Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121927]/95 border border-white/10 shadow-2xl backdrop-blur-xl relative">
              
              {/* Header Title & Subtitle */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login' 
                    ? 'Sign in to access your trips, bookings, and custom itineraries' 
                    : 'Start organizing your trips in seconds with our intelligent workspace'}
                </p>
              </div>

              {/* Segmented Control Mode Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#18233C]/90 border border-white/[0.08] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error & Success Alerts */}
              {error && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Full Name (Sign Up only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#18233C] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#18233C] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setForgotModal(true)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#18233C] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === 'register' && (
                    <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters</p>
                  )}
                </div>

                {/* Remember Me Toggle */}
                {mode === 'login' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-3.5 h-3.5 accent-blue-500 rounded cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer select-none">
                      Keep me signed in on this device
                    </label>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to TripPlan' : 'Create Free Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Mode Switcher */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] text-center">
                <p className="text-xs text-slate-400">
                  {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors ml-1 cursor-pointer"
                  >
                    {mode === 'login' ? 'Sign up for free' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit encrypted • Private & Secure</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal Helper */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-[#121927] border border-white/10 shadow-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-1">Reset Password</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              To reset your password, please check your registered email or create a new account to continue planning your journeys.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
