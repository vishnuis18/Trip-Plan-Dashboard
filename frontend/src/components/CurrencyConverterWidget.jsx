import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency, 
  CURRENCY_SYMBOLS 
} from '../services/currencyService';

export const CurrencyConverterWidget = () => {
  const { activeTrip } = useTrip();
  
  // Trip destination currency e.g. JPY or EUR
  const tripCurrency = activeTrip?.currency || 'JPY';
  
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState(tripCurrency);
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="rounded-3xl bg-[#121927]/90 border border-white/[0.08] p-5 shadow-xl backdrop-blur-md">
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
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/20 border border-white/[0.04] mb-3">
        <span className="text-[11px] text-slate-400">Current Rate:</span>
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
              className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="bg-[#18233C] border border-white/10 rounded-xl px-2.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            {supportedCurrencies.map((c) => (
              <option key={c} value={c}>
                {c} ({CURRENCY_SYMBOLS[c]})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all shadow-sm"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-3 h-3 transform rotate-90" />
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

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="bg-[#18233C]/80 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-emerald-300 focus:outline-none"
          >
            {supportedCurrencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
