import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Globe, 
  AlertCircle, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Sparkles,
  MapPin,
  Coins
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { CurrencyConverterWidget } from '../components/CurrencyConverterWidget';
import { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency, 
  CURRENCY_SYMBOLS 
} from '../services/currencyService';

const CURRENCY_DETAILS = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' }
};

const CHEAT_SHEET_AMOUNTS = [1, 5, 10, 20, 50, 100, 250, 500];

export const FXPage = ({ setActiveTab }) => {
  const { activeTrip } = useTrip();

  const tripCurrency = activeTrip?.currency || 'JPY';
  const destination = activeTrip?.destination || 'Global Travel';

  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState(tripCurrency);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update target when active trip changes
  useEffect(() => {
    if (activeTrip?.currency) {
      setTargetCurrency(activeTrip.currency);
    }
  }, [activeTrip?.currency]);

  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await fetchExchangeRates(baseCurrency);
      setRates(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Failed to load rates in FXPage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, [baseCurrency]);

  const singleRate = rates ? convertCurrency(1, baseCurrency, targetCurrency, rates) : 1;

  const supportedList = Object.keys(CURRENCY_DETAILS);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live European Central Bank FX
            </span>
            {activeTrip && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <MapPin className="w-3 h-3 text-rose-400" />
                {destination} ({targetCurrency})
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live FX & Currency Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time interbank foreign exchange rates, rapid travel shopping cheat sheets, and essential currency tips for zero-stress spending abroad.
          </p>
        </div>

        {/* Live Trip Rate Quick Pill */}
        <div className="flex items-center gap-3 self-start md:self-auto px-4 py-2.5 rounded-2xl bg-[#121927]/90 border border-white/[0.08] shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              1 {baseCurrency} Rate
            </div>
            <div className="text-sm font-extrabold text-white font-mono leading-tight">
              {singleRate.toLocaleString()} {targetCurrency}
            </div>
          </div>
          <button
            onClick={loadRates}
            disabled={loading}
            className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-1 ${
              loading ? 'animate-spin text-emerald-400' : ''
            }`}
            title="Refresh rates"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Converter & Quick Cheat Sheet (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Interactive Converter Box - High Z-Index for Dropdown Stacking */}
          <div className="relative z-30">
            <CurrencyConverterWidget />
          </div>

          {/* Travel Shopping Cheat Sheet */}
          <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md relative z-10">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Shopping & Dining Quick Cheat Sheet</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant reference for markets, street food, souvenirs, and daily transit.
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {baseCurrency} → {targetCurrency}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHEAT_SHEET_AMOUNTS.map((amt) => {
                const val = rates ? convertCurrency(amt, baseCurrency, targetCurrency, rates) : 0;
                return (
                  <div 
                    key={amt}
                    className="p-3 rounded-2xl bg-black/20 border border-white/[0.05] hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
                  >
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      {CURRENCY_SYMBOLS[baseCurrency] || baseCurrency}{amt}
                    </span>
                    <span className="text-base font-extrabold text-white font-mono mt-1 group-hover:text-emerald-400 transition-colors">
                      {formatCurrency(val, targetCurrency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Computed with mid-market interbank rate without bank commissions.</span>
              </span>
              <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Major World Rates & Pro Travel Money Advice (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Major Currency Pairs Table */}
          <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Popular Travel Currencies
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Base currency: 1 {baseCurrency}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                10 Currencies
              </span>
            </div>

            <div className="divide-y divide-white/[0.05] max-h-72 overflow-y-auto pr-1">
              {supportedList.map((code) => {
                const curr = CURRENCY_DETAILS[code];
                const r = rates ? convertCurrency(1, baseCurrency, code, rates) : 1;
                const isTarget = targetCurrency === code;

                return (
                  <div 
                    key={code}
                    onClick={() => setTargetCurrency(code)}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer group ${
                      isTarget 
                        ? 'bg-emerald-500/10 border border-emerald-500/25' 
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{curr.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                          <span>{code}</span>
                          <span className="font-mono text-[11px] opacity-70">({curr.symbol})</span>
                          {isTarget && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{curr.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-white font-mono block">
                        {r.toLocaleString()} {curr.symbol}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Live ECB
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pro Travel Money & Spending Advice */}
          <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white tracking-wide mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Travel Money Tips</span>
            </h3>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-black/20 border border-white/[0.04]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Decline "Pay in Your Home Currency"</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Card machines often offer "Dynamic Currency Conversion" (DCC). Always select local currency (e.g. JPY, EUR) to avoid 3%–7% hidden merchant bank fees.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/20 border border-white/[0.04]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Zero Foreign Transaction Fee Cards</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Use travel cards with 0% FX fees (like Revolut, Wise, or travel credit cards) linked to Apple Pay / Google Wallet for tap-to-pay overseas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/20 border border-white/[0.04]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Withdraw From Official Bank ATMs</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Avoid Euronet or standalone airport kiosks with huge markups. Use official post offices or recognized national bank ATMs for clean exchange rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

