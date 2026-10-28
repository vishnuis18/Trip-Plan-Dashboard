import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  CheckCircle2,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency, 
  CURRENCY_SYMBOLS 
} from '../services/currencyService';

const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  INR: 'Indian Rupee',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar',
  CHF: 'Swiss Franc',
  THB: 'Thai Baht'
};

const CustomCurrencyDropdown = ({ 
  value, 
  onChange, 
  options, 
  variant = 'default',
  isOpen,
  onToggle,
  onClose
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const isEmerald = variant === 'emerald';

  return (
    <div className={`relative shrink-0 ${isOpen ? 'z-50' : 'z-10'}`} ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`${
          isEmerald 
            ? 'fx-to-pill px-3 py-1.5 rounded-xl font-bold shadow-sm' 
            : 'fx-from-btn px-3 py-2 rounded-xl font-semibold'
        } flex items-center gap-1.5 text-xs transition-all focus:outline-none cursor-pointer ${
          isOpen ? 'active-open ring-2 ring-emerald-500/30' : ''
        }`}
        aria-expanded={isOpen}
      >
        <span className="font-bold">{value}</span>
        <span className="font-mono text-[11px] opacity-80">({CURRENCY_SYMBOLS[value] || value})</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-75 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fx-dropdown-menu absolute right-0 top-full mt-1.5 w-56 rounded-2xl p-1.5 z-50 max-h-56 overflow-y-auto shadow-2xl">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 opacity-80 border-b border-white/[0.06] mb-1">
            Select Currency
          </div>
          {options.map((c) => {
            const isSelected = value === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left rounded-xl text-xs transition-colors fx-dropdown-item cursor-pointer mb-0.5 ${
                  isSelected ? 'is-selected' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold fx-curr-code">{c}</span>
                  <span className="font-mono text-[11px] opacity-85 fx-curr-symbol font-semibold">
                    {CURRENCY_SYMBOLS[c] || c}
                  </span>
                  <span className="text-[10px] opacity-60 hidden sm:inline">
                    {CURRENCY_NAMES[c]}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const CurrencyConverterWidget = () => {
  const { activeTrip } = useTrip();
  
  // Trip destination currency e.g. JPY or EUR
  const tripCurrency = activeTrip?.currency || 'JPY';
  
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState(tripCurrency);
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'from' | 'to' | null

  // Update target currency if activeTrip currency changes
  useEffect(() => {
    if (activeTrip?.currency) {
      setToCurrency(activeTrip.currency);
    }
  }, [activeTrip?.currency]);

  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await fetchExchangeRates(fromCurrency);
      setRates(data);
    } catch (err) {
      console.warn('Failed to load rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, [fromCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const convertedValue = rates ? convertCurrency(amount, fromCurrency, toCurrency, rates) : 0;
  const singleRate = rates ? convertCurrency(1, fromCurrency, toCurrency, rates) : 1;

  const supportedCurrencies = Object.keys(CURRENCY_SYMBOLS);

  return (
    <div className={`rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-5 shadow-xl backdrop-blur-md fx-widget-card relative ${activeDropdown ? 'z-50 has-open-dropdown' : 'z-30'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Live FX Converter</h3>
            <p className="text-[10px] text-slate-400">Real-time travel exchange rate</p>
          </div>
        </div>

        <button
          onClick={loadRates}
          disabled={loading}
          className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${
            loading ? 'animate-spin text-emerald-400' : ''
          }`}
          title="Refresh rates"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exchange Rate Badge */}
      <div className="fx-rate-badge flex items-center justify-between px-3 py-2 rounded-xl mb-3">
        <span className="text-[11px] text-slate-400 font-medium">Current Rate:</span>
        <span className="text-xs font-bold text-white font-mono">
          1 {fromCurrency} = {singleRate.toLocaleString()} {toCurrency}
        </span>
      </div>

      {/* Inputs Section */}
      <div className="space-y-3">
        {/* From Amount & Currency */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="fx-amount-input w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <CustomCurrencyDropdown
            value={fromCurrency}
            onChange={setFromCurrency}
            options={supportedCurrencies}
            variant="default"
            isOpen={activeDropdown === 'from'}
            onToggle={() => setActiveDropdown(activeDropdown === 'from' ? null : 'from')}
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            className="fx-swap-btn p-1.5 rounded-full shadow-sm cursor-pointer"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 transform rotate-90" />
          </button>
        </div>

        {/* Converted Result Display */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400/90 block">
              Estimated In {toCurrency}
            </span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">
              {formatCurrency(convertedValue, toCurrency)}
            </span>
          </div>

          <CustomCurrencyDropdown
            value={toCurrency}
            onChange={setToCurrency}
            options={supportedCurrencies}
            variant="emerald"
            isOpen={activeDropdown === 'to'}
            onToggle={() => setActiveDropdown(activeDropdown === 'to' ? null : 'to')}
            onClose={() => setActiveDropdown(null)}
          />
        </div>
      </div>

      {/* Footer Attribution */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.05] text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-slate-500" />
          <span>Frankfurter (ECB data)</span>
        </span>
        <span className="text-emerald-400 flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Live FX
        </span>
      </div>
    </div>
  );
};
