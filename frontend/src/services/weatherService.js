// Service for Open-Meteo Weather API (Free, no API key required)

const DESTINATION_COORDS = {
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  kyoto: { lat: 34.9858, lng: 135.7588, name: 'Kyoto, Japan' },
  osaka: { lat: 34.6937, lng: 135.5023, name: 'Osaka, Japan' },
  fuji: { lat: 35.3606, lng: 138.7274, name: 'Mount Fuji, Japan' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  'new york': { lat: 40.7128, lng: -74.006, name: 'New York, USA' },
  nyc: { lat: 40.7128, lng: -74.006, name: 'New York, USA' },
  bali: { lat: -8.4095, lng: 115.1889, name: 'Bali, Indonesia' },
  rome: { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy' },
  barcelona: { lat: 41.3879, lng: 2.1699, name: 'Barcelona, Spain' },
  bangkok: { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand' },
  singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
  amsterdam: { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' },
  seoul: { lat: 37.5665, lng: 126.978, name: 'Seoul, South Korea' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
  zurich: { lat: 47.3769, lng: 8.5417, name: 'Zurich, Switzerland' },
  venice: { lat: 45.4408, lng: 12.3155, name: 'Venice, Italy' },
  berlin: { lat: 52.52, lng: 13.405, name: 'Berlin, Germany' }
};

// Weather code interpreter based on WMO standards
export const interpretWeatherCode = (code) => {
  if (code === 0) return { label: 'Clear Sky', iconType: 'sun', iconEmoji: '☀️' };
  if (code === 1) return { label: 'Mainly Clear', iconType: 'sun-cloud', iconEmoji: '🌤️' };
  if (code === 2) return { label: 'Partly Cloudy', iconType: 'cloud', iconEmoji: '⛅' };
  if (code === 3) return { label: 'Overcast', iconType: 'cloud', iconEmoji: '☁️' };
  if (code === 45 || code === 48) return { label: 'Foggy', iconType: 'fog', iconEmoji: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Rain Showers', iconType: 'rain', iconEmoji: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow Showers', iconType: 'snow', iconEmoji: '❄️' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', iconType: 'thunder', iconEmoji: '⛈️' };
  return { label: 'Fair Weather', iconType: 'sun-cloud', iconEmoji: '🌤️' };
};

// Resolve destination coords from string or object
export const resolveCoordinates = (destination) => {
  if (!destination) return DESTINATION_COORDS.tokyo;
  if (typeof destination === 'object' && destination.lat && destination.lng) {
    return destination;
  }
  const clean = String(destination).toLowerCase().trim();
  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (clean.includes(key)) return coords;
  }
  // Default to Tokyo if unspecified
  return DESTINATION_COORDS.tokyo;
};

// In-memory cache to prevent unnecessary calls
const weatherCache = new Map();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

export const fetchDestinationWeather = async (destination) => {
  const coords = resolveCoordinates(destination);
  const cacheKey = `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
    const data = await res.json();

    const currentWeather = data.current_weather || {};
    const condition = interpretWeatherCode(currentWeather.weathercode ?? 1);

    // Format daily forecast (next 5 days)
    const daily = data.daily || {};
    const forecastDays = (daily.time || []).slice(0, 5).map((dateStr, idx) => {
      const code = daily.weathercode?.[idx] ?? 1;
      const cond = interpretWeatherCode(code);
      const d = new Date(dateStr);
      const dayName = idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dateStr,
        dayName,
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 20),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 14),
        precipProb: daily.precipitation_probability_max?.[idx] ?? 0,
        condition: cond.label,
        iconEmoji: cond.iconEmoji,
        weathercode: code
      };
    });

    const result = {
      destination: coords.name || destination,
      currentTemp: Math.round(currentWeather.temperature ?? 19),
      windSpeed: Math.round(currentWeather.windspeed ?? 10),
      condition: condition.label,
      iconEmoji: condition.iconEmoji,
      weatherCode: currentWeather.weathercode ?? 1,
      forecast: forecastDays,
      fetchedAt: new Date().toISOString()
    };

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn('Open-Meteo weather fetch error:', err);
    // Return graceful fallback data so UI never breaks
    return {
      destination: coords.name || 'Tokyo, Japan',
      currentTemp: 19,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      iconEmoji: '⛅',
      weatherCode: 2,
      forecast: [
        { dayName: 'Today', maxTemp: 22, minTemp: 15, precipProb: 10, condition: 'Partly Cloudy', iconEmoji: '⛅', weathercode: 2 },
        { dayName: 'Tomorrow', maxTemp: 21, minTemp: 14, precipProb: 20, condition: 'Mainly Clear', iconEmoji: '🌤️', weathercode: 1 },
        { dayName: 'Wed', maxTemp: 24, minTemp: 16, precipProb: 5, condition: 'Clear Sky', iconEmoji: '☀️', weathercode: 0 },
        { dayName: 'Thu', maxTemp: 20, minTemp: 15, precipProb: 40, condition: 'Rain Showers', iconEmoji: '🌧️', weathercode: 61 },
        { dayName: 'Fri', maxTemp: 22, minTemp: 14, precipProb: 15, condition: 'Mainly Clear', iconEmoji: '🌤️', weathercode: 1 }
      ],
      fetchedAt: new Date().toISOString()
    };
  }
};
