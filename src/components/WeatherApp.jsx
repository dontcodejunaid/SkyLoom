import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer, Droplets, Wind, Gauge, Eye,
  Sun, Cloud, AlertCircle, RefreshCw
} from 'lucide-react';

import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import { getWeatherTheme, getUVInfo, getWindDirection, isNightTime } from '../utils/weatherUtils';
import { formatTemp, formatVisibility } from '../utils/formatters';
import { useWeatherSound } from '../hooks/useWeatherSound';

import WeatherBackground from './WeatherBackground';
import SearchBar from './SearchBar';
import HeroCard from './HeroCard';
import StatCard from './StatCard';
import SunriseSunset from './SunriseSunset';
import AQIBadge from './AQIBadge';
import HourlyChart from './HourlyChart';
import ForecastRow from './ForecastRow';
import SkyToggle from './ui/sky-toggle';
import SoundToggle from './SoundToggle';
import { SkyLoomLogo } from './SkyLoomLogo';

// Skeleton placeholder
const Skeleton = ({ className }) => (
  <div className={`skeleton ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-fade-up">
    <Skeleton className="h-52 w-full rounded-3xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
    <Skeleton className="h-36 w-full rounded-3xl" />
    <Skeleton className="h-56 w-full rounded-3xl" />
    <Skeleton className="h-40 w-full rounded-3xl" />
  </div>
);

const WeatherApp = () => {
  const { weather, forecast, airQuality, loading, error, fetchByCity, fetchByCoords, searchCities } = useWeather();
  const { favorites, recentCities, addFavorite, removeFavorite, isFavorite, addRecent } = useFavorites();
  const [unit, setUnit] = useState('C');

  // Night mode — persisted in localStorage
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('skyloom_nightmode') === 'true'; }
    catch { return false; }
  });

  // Sync night mode: toggle Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('skyloom_nightmode', String(isDark)); }
    catch {}
  }, [isDark]);

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchByCity('London')
      );
    } else {
      fetchByCity('London');
    }
  }, []);

  // Track recent searches
  const handleSearch = (city) => {
    fetchByCity(city);
  };

  useEffect(() => {
    if (weather) {
      addRecent({ name: weather.name, country: weather.sys.country });
    }
  }, [weather?.name]);

  const handleToggleFavorite = (city) => {
    if (isFavorite(city.name)) removeFavorite(city.name);
    else addFavorite(city);
  };

  // Compute theme + condition identifiers
  const conditionCode = weather?.weather[0].id ?? null;
  const isNightBool   = weather
    ? isNightTime(weather.dt, weather.sys.sunrise, weather.sys.sunset)
    : false;

  const theme = weather
    ? getWeatherTheme(conditionCode, isNightBool)
    : { name: 'default', gradient: 'linear-gradient(160deg,#0f2027,#203a43)', accent: '#38bdf8', particle: 'none' };

  // Weather sounds & voice announcements (English, Hindi, Kannada)
  const { soundEnabled, toggleSound, soundLang, changeLanguage } = useWeatherSound(conditionCode, isNightBool, weather, unit);

  // Stats
  const stats = weather ? [
    {
      icon: Thermometer, label: 'Feels Like',
      value: formatTemp(weather.main.feels_like, unit),
      sub: 'Human perception', accent: '#f87171', index: 0,
    },
    {
      icon: Droplets, label: 'Humidity',
      value: `${weather.main.humidity}%`,
      sub: weather.main.humidity > 70 ? 'High' : weather.main.humidity < 30 ? 'Low' : 'Comfortable',
      accent: '#60a5fa', index: 1,
    },
    {
      icon: Wind, label: 'Wind',
      value: `${Math.round(weather.wind.speed * 3.6)} km/h`,
      sub: getWindDirection(weather.wind.deg || 0),
      accent: '#34d399', index: 2,
    },
    {
      icon: Gauge, label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      sub: weather.main.pressure > 1013 ? 'High' : 'Low',
      accent: '#a78bfa', index: 3,
    },
    {
      icon: Eye, label: 'Visibility',
      value: formatVisibility(weather.visibility || 10000),
      sub: (weather.visibility || 10000) >= 10000 ? 'Clear' : 'Reduced',
      accent: '#fbbf24', index: 4,
    },
    {
      icon: Cloud, label: 'Cloud Cover',
      value: `${weather.clouds?.all ?? 0}%`,
      sub: weather.clouds?.all > 80 ? 'Overcast' : weather.clouds?.all > 40 ? 'Partly cloudy' : 'Mostly clear',
      accent: '#94a3b8', index: 5,
    },
    {
      icon: Sun, label: 'UV Index',
      value: forecast?.list?.[0]?.uvi ?? '—',
      sub: forecast?.list?.[0]?.uvi != null ? getUVInfo(forecast.list[0].uvi).label : 'N/A',
      accent: '#fb923c', index: 6,
    },
    {
      icon: Thermometer, label: 'Dew Point',
      value: weather.main.humidity
        ? `${Math.round(weather.main.temp - ((100 - weather.main.humidity) / 5))}°${unit}`
        : '—',
      sub: 'Moisture comfort',
      accent: '#2dd4bf', index: 7,
    },
  ] : [];

  return (
    <>
      {/* Weather-reactive background — driven by real condition code */}
      <WeatherBackground
        conditionCode={conditionCode}
        isNight={isNightBool}
        accent={theme.accent}
      />

      {/* Night-mode overlay — deepens background when night toggle is on */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-700"
        style={{ background: isDark ? 'rgba(5, 8, 25, 0.25)' : 'transparent' }}
      />

      {/* App shell */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 px-4 pt-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
              {/* Official Woven SkyLoom Logo */}
              <div className="shrink-0">
                <SkyLoomLogo size="md" />
              </div>
              <div className="flex-1">
                <SearchBar
                  onSearch={handleSearch}
                  searchCities={searchCities}
                  favorites={favorites}
                  recentCities={recentCities}
                />
              </div>
              {/* Day / Night toggle */}
              <div className="shrink-0" title={isDark ? 'Night mode on' : 'Day mode on'}>
                <SkyToggle
                  checked={isDark}
                  onChange={setIsDark}
                />
              </div>

              {/* Sound toggle & Multi-language Voice Selector */}
              <SoundToggle
                enabled={soundEnabled}
                onToggle={toggleSound}
                currentLang={soundLang}
                onChangeLang={changeLanguage}
              />

              {/* Refresh */}
              <button
                id="refresh-btn"
                onClick={() => weather && fetchByCity(weather.name)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200 shrink-0"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-3xl mx-auto space-y-4">

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 glass rounded-2xl px-5 py-3.5 border border-red-500/20 bg-red-500/10"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading && !weather && <LoadingSkeleton />}

            {/* Weather content */}
            {weather && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={weather.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Hero */}
                  <HeroCard
                    weather={weather}
                    unit={unit}
                    onToggleUnit={setUnit}
                    isFavorite={isFavorite(weather.name)}
                    onToggleFavorite={handleToggleFavorite}
                    theme={theme}
                  />

                  {/* AQI row */}
                  {airQuality && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <AQIBadge airQuality={airQuality} />
                      <span className="text-white/30 text-xs">
                        {weather.name}, {weather.sys.country}
                      </span>
                    </div>
                  )}

                  {/* Stat cards grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map((s) => (
                      <StatCard key={s.label} {...s} />
                    ))}
                  </div>

                  {/* Sunrise / Sunset */}
                  <SunriseSunset
                    sunrise={weather.sys.sunrise}
                    sunset={weather.sys.sunset}
                  />

                  {/* Hourly chart */}
                  <HourlyChart forecast={forecast} unit={unit} accent={theme.accent} />

                  {/* 5-day forecast */}
                  <ForecastRow forecast={forecast} unit={unit} />

                  {/* Footer */}
                  <div className="text-center text-white/20 text-xs pb-4">
                    Data from OpenWeatherMap · Updated {new Date().toLocaleTimeString()}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default WeatherApp;
