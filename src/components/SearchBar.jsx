import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Clock, X } from 'lucide-react';

const debounce = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const SearchBar = ({ onSearch, searchCities, favorites, recentCities, onSelectFavorite }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (q.length < 2) { setSuggestions([]); return; }
      const results = await searchCities(q);
      setSuggestions(results);
    }, 350),
    [searchCities]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (city) => {
    const name = `${city.name}, ${city.country}`;
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setFocused(false);
    onSearch(city.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setQuery('');
    setShowDropdown(false);
    setFocused(false);
  };

  const showPanel = focused && (suggestions.length > 0 || favorites.length > 0 || recentCities.length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => { setFocused(true); setShowDropdown(true); }}
          placeholder="Search city..."
          className="search-input pl-11 pr-10"
          id="city-search-input"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showPanel && showDropdown && (
        <div className="absolute top-full mt-2 w-full z-50 glass rounded-2xl overflow-hidden py-2 animate-slide-down">

          {/* City suggestions */}
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((city, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left group"
                >
                  <MapPin className="w-4 h-4 text-white/40 group-hover:text-white/70 shrink-0 transition-colors" />
                  <div>
                    <div className="text-white text-sm font-medium">{city.name}</div>
                    <div className="text-white/50 text-xs">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          {suggestions.length > 0 && (recentCities.length > 0 || favorites.length > 0) && (
            <div className="h-px bg-white/10 mx-3 my-1" />
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <div className="px-4 pt-1 pb-1.5 text-[10px] font-semibold text-white/35 uppercase tracking-widest">
                Favorites
              </div>
              {favorites.map((city, i) => (
                <button
                  key={i}
                  onClick={() => { onSearch(city.name); setShowDropdown(false); setFocused(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                >
                  <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="text-white/80 text-sm">{city.name}, {city.country}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent */}
          {recentCities.length > 0 && (
            <div>
              <div className="px-4 pt-1 pb-1.5 text-[10px] font-semibold text-white/35 uppercase tracking-widest">
                Recent
              </div>
              {recentCities.map((city, i) => (
                <button
                  key={i}
                  onClick={() => { onSearch(city.name); setShowDropdown(false); setFocused(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  <span className="text-white/70 text-sm">{city.name}, {city.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
