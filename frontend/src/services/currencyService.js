// Service for Frankfurter FX Rates API (Free, official ECB data, no key required)

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  CHF: 'CHF',
  THB: '฿'
};

const FALLBACK_RATES_USD = {
  USD: 1.0,
  EUR: 0.91,
  GBP: 0.78,
  JPY: 155.2,
  INR: 86.4,
  AUD: 1.52,
  CAD: 1.38,
  SGD: 1.34,
  CHF: 0.88,
  THB: 34.6
};

// Memory cache
let ratesCache = null;
let lastFetched = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  const now = Date.now();
  if (ratesCache && ratesCache.base === baseCurrency && now - lastFetched < CACHE_TTL_MS) {
    return ratesCache.rates;
  }

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
    if (!res.ok) throw new Error(`Currency API failed: ${res.statusText}`);
    const data = await res.json();

    const fullRates = {
      [baseCurrency]: 1.0,
      ...(data.rates || {})
    };

    ratesCache = { base: baseCurrency, rates: fullRates };
    lastFetched = now;
    return fullRates;
  } catch (err) {
    console.warn('Using fallback currency rates due to fetch error:', err);
    // If base is USD, return FALLBACK_RATES_USD
    if (baseCurrency === 'USD') {
      return FALLBACK_RATES_USD;
    }
    // Cross-convert fallback
    const usdRate = FALLBACK_RATES_USD[baseCurrency] || 1.0;
    const recalculated = {};
    for (const [curr, r] of Object.entries(FALLBACK_RATES_USD)) {
      recalculated[curr] = Number((r / usdRate).toFixed(4));
    }
    return recalculated;
  }
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!amount || isNaN(amount)) return 0;
  if (fromCurrency === toCurrency) return Number(amount);

  const numAmount = Number(amount);
  if (!rates) return numAmount;

  // If rates base matches fromCurrency
  if (rates[toCurrency] && rates[fromCurrency] === 1.0) {
    return Number((numAmount * rates[toCurrency]).toFixed(2));
  }

  // Cross conversion: (amount / rates[from]) * rates[to]
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  const inBase = numAmount / fromRate;
  return Number((inBase * toRate).toFixed(2));
};

export const formatCurrency = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formattedNum = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2,
    maximumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2
  });
  return `${symbol}${formattedNum}`;
};
