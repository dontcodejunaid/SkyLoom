import { useState, useCallback } from 'react';

const FAVS_KEY = 'skyloom_favorites';
const RECENT_KEY = 'skyloom_recent';
const MAX_RECENT = 6;

const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => load(FAVS_KEY));
  const [recentCities, setRecentCities] = useState(() => load(RECENT_KEY));

  const addFavorite = useCallback((city) => {
    setFavorites(prev => {
      if (prev.find(c => c.name === city.name && c.country === city.country)) return prev;
      const next = [...prev, city];
      save(FAVS_KEY, next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((cityName) => {
    setFavorites(prev => {
      const next = prev.filter(c => c.name !== cityName);
      save(FAVS_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((cityName) =>
    favorites.some(c => c.name === cityName), [favorites]);

  const addRecent = useCallback((city) => {
    setRecentCities(prev => {
      const filtered = prev.filter(c => c.name !== city.name);
      const next = [city, ...filtered].slice(0, MAX_RECENT);
      save(RECENT_KEY, next);
      return next;
    });
  }, []);

  return { favorites, recentCities, addFavorite, removeFavorite, isFavorite, addRecent };
};
