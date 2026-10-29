import React, { useState, useEffect } from 'react';
import { 
  Sun,
  CloudSun, 
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind, 
  Droplets, 
  RefreshCw, 
  MapPin, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { fetchDestinationWeather } from '../services/weatherService';

const WeatherIcon = ({ condition, code, size = "w-5 h-5", className = "" }) => {
  const cond = (condition || '').toLowerCase();
  
  if (cond.includes('thunder') || [95, 96, 99].includes(code)) {
    return <CloudLightning className={`${size} text-amber-500 fill-amber-500/20 ${className}`} />;
  }
  if (cond.includes('snow') || [71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow className={`${size} text-cyan-500 fill-cyan-500/20 ${className}`} />;
  }
  if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle') || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return <CloudRain className={`${size} text-sky-500 fill-sky-500/20 ${className}`} />;
  }
  if (cond.includes('fog') || [45, 48].includes(code)) {
    return <CloudFog className={`${size} text-slate-400 ${className}`} />;
  }
  if (cond.includes('clear') || cond.includes('sun') || code === 0) {
    return <Sun className={`${size} text-amber-500 fill-amber-400/30 ${className}`} />;
  }
  if (cond.includes('partly') || cond.includes('mainly') || cond.includes('fair') || code === 1 || code === 2) {
    return <CloudSun className={`${size} text-amber-500 ${className}`} />;
  }
  return <Cloud className={`${size} text-slate-400 fill-slate-300/30 dark:fill-slate-700/30 ${className}`} />;
};

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
      <div className="weather-widget-card rounded-2xl p-4 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-white/5" />
          <div className="space-y-1.5">
            <div className="w-36 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="w-24 h-3 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
        </div>
        <div className="w-20 h-8 bg-slate-200 dark:bg-white/10 rounded-xl" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-widget-card rounded-2xl shadow-sm hover:shadow-md backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Weather Icon Box */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/10 to-[#FF5B45]/10 border border-[#FF5B45]/20 flex items-center justify-center shrink-0 shadow-sm">
            <WeatherIcon condition={weather.condition} code={weather.weatherCode} size="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                Destination Weather
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF5B45]" />
                {weather.destination}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-0.5 text-[11px]">
              <span className="font-semibold text-sky-700 dark:text-sky-400">
                {weather.condition}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <Wind className="w-3 h-3 text-slate-400" />
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Temp Display */}
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {weather.currentTemp}
              </span>
              <span className="text-sm font-bold text-[#FF5B45]">°C</span>
            </div>
            <span className="block text-[10px] text-slate-400 font-medium">Live Temp</span>
          </div>

          {/* Toggle 5-Day Forecast */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-sm"
            title={isExpanded ? 'Collapse forecast' : 'Show 5-day forecast'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadWeather}
            disabled={loading}
            className={`p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-sm ${
              loading ? 'animate-spin text-[#FF5B45]' : ''
            }`}
            title="Refresh weather"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable 5-Day Forecast Row */}
      {isExpanded && weather.forecast && weather.forecast.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
            {weather.forecast.map((day, idx) => {
              const isToday = idx === 0 || day.dayName?.toLowerCase() === 'today';
              return (
                <div
                  key={idx}
                  className={`weather-day-card flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 text-center relative group hover:-translate-y-0.5 ${
                    isToday ? 'is-today' : ''
                  }`}
                >
                  {/* Day Name */}
                  {isToday ? (
                    <span className="text-[10px] font-extrabold text-[#FF5B45] dark:text-[#FF7A66] uppercase tracking-wider">
                      Today
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {day.dayName}
                    </span>
                  )}

                  {/* Weather Icon in soft bubble */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center my-1.5 transition-transform duration-300 group-hover:scale-110 ${
                    isToday
                      ? 'bg-[#FF5B45]/10 dark:bg-[#FF5B45]/15'
                      : 'bg-slate-100/80 dark:bg-white/[0.04]'
                  }`}>
                    <WeatherIcon condition={day.condition} code={day.weathercode} size="w-5 h-5" />
                  </div>

                  {/* Max & Min Temperature */}
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono my-0.5">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {day.maxTemp}°
                    </span>
                    <span className="font-medium text-slate-400 dark:text-slate-500">
                      {day.minTemp}°
                    </span>
                  </div>

                  {/* Precipitation Droplet Percentage */}
                  <div className="h-4 flex items-center justify-center mt-0.5">
                    {day.precipProb > 0 ? (
                      <span className="text-[10px] font-bold text-[#FF5B45] dark:text-[#FF7A66] flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5 fill-current" />
                        {day.precipProb}%
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-300 dark:text-slate-600">
                        0%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
