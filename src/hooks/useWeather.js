import { useState, useCallback, useRef } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const cache = {};

const cachedFetch = async (url) => {
  const now = Date.now();
  if (cache[url] && now - cache[url].ts < CACHE_TTL) {
    return cache[url].data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  cache[url] = { data, ts: now };
  return data;
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const fetchAll = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const [w, f, a] = await Promise.all([
        cachedFetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        cachedFetch(`${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        cachedFetch(`${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      ]);
      setWeather(w);
      setForecast(f);
      setAirQuality(a);
    } catch (e) {
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const w = await cachedFetch(
        `${BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      if (w.cod && w.cod !== 200) throw new Error(w.message);
      setWeather(w);
      const [f, a] = await Promise.all([
        cachedFetch(`${BASE}/data/2.5/forecast?lat=${w.coord.lat}&lon=${w.coord.lon}&units=metric&appid=${API_KEY}`),
        cachedFetch(`${BASE}/data/2.5/air_pollution?lat=${w.coord.lat}&lon=${w.coord.lon}&appid=${API_KEY}`),
      ]);
      setForecast(f);
      setAirQuality(a);
    } catch (e) {
      setError('City not found. Please check the name and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback((lat, lon) => fetchAll(lat, lon), [fetchAll]);

  const searchCities = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const results = await cachedFetch(
        `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      return results || [];
    } catch {
      return [];
    }
  }, []);

  return { weather, forecast, airQuality, loading, error, fetchByCity, fetchByCoords, searchCities };
};
