import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  RefreshCw, 
  MapPin, 
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { fetchDestinationWeather } from '../services/weatherService';

export const WeatherWidget = () => {
  const { activeTrip } = useTrip();
  const destination = activeTrip?.destination || 'Tokyo, Japan';

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const loadWeather = async () => {
    try {
      setLoading(true);
      const data = await fetchDestinationWeather(destination);
      setWeather(data);
    } catch (err) {
      console.warn('Failed to load weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [destination]);

  if (!weather && loading) {
    return (
      <div className="rounded-2xl bg-[#141B2D]/50 border border-white/[0.06] p-4 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5" />
          <div className="space-y-1.5">
            <div className="w-32 h-3.5 bg-white/10 rounded" />
            <div className="w-20 h-2.5 bg-white/5 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-white/10 rounded-xl" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-2xl bg-[#121927]/90 border border-white/[0.08] shadow-lg backdrop-blur-md overflow-hidden transition-all">
      {/* Top Banner Bar */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
            {weather.iconEmoji || '⛅'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Destination Weather
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium truncate max-w-[150px] sm:max-w-none">
                {weather.destination}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span className="text-blue-300 font-semibold">{weather.condition}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-slate-400" />
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Temp Display */}
          <div className="text-right">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {weather.currentTemp}°C
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">Live Temp</span>
          </div>

          {/* Toggle 5-Day Forecast */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse forecast' : 'Show 5-day forecast'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadWeather}
            disabled={loading}
            className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ${
              loading ? 'animate-spin text-blue-400' : ''
            }`}
            title="Refresh weather"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable 5-Day Forecast Row */}
      {isExpanded && weather.forecast && weather.forecast.length > 0 && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.05]">
          <div className="grid grid-cols-5 gap-2 pt-2">
            {weather.forecast.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-between p-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/[0.04] transition-all text-center"
              >
                <span className="text-[11px] font-semibold text-slate-300">
                  {day.dayName}
                </span>
                <span className="text-lg my-1">{day.iconEmoji}</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="font-bold text-white">{day.maxTemp}°</span>
                  <span className="text-slate-400">{day.minTemp}°</span>
                </div>
                {day.precipProb > 0 && (
                  <span className="text-[9px] font-semibold text-blue-400 mt-1 flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    {day.precipProb}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
