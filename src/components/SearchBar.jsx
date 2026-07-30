import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Mic, MicOff } from 'lucide-react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const SearchBar = ({ onSearch, searchCities, favorites, recentCities }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);

  // Voice search state
  const [isListening, setIsListening] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const recognitionRef = useRef(null);

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
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // Web Speech Recognition setup optimized for Mobile (iOS & Android) + Desktop
  const startVoiceSearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome or Safari on mobile.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      
      // Mobile Safari / iOS optimization
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      recognition.continuous = false;
      recognition.interimResults = !isIOS;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptText('Listening...');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (text && text.trim()) {
          setQuery(text);
          setTranscriptText(text);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscriptText('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setQuery(prev => {
          if (prev && prev !== 'Listening...') {
            const cleanQuery = prev.replace(/[.#$%!?]/g, '').trim();
            if (cleanQuery) {
              onSearch(cleanQuery);
            }
          }
          return prev === 'Listening...' ? '' : prev;
        });
        setTranscriptText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  const handleSelect = (city) => {
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
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none z-10" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => { setFocused(true); setShowDropdown(true); }}
          placeholder={isListening ? (transcriptText || "Listening to your voice...") : "Search city or tap mic..."}
          className={`search-input pl-11 pr-24 ${isListening ? 'border-purple-400/60 bg-purple-900/20 text-purple-200 placeholder-purple-300/60' : ''}`}
          id="city-search-input"
          autoComplete="off"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="p-1 text-white/40 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Dedicated Mobile-friendly Voice Button */}
          <button
            type="button"
            onClick={startVoiceSearch}
            onTouchEnd={startVoiceSearch}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isListening
                ? 'bg-purple-500 text-white animate-pulse shadow-lg shadow-purple-500/50'
                : 'text-white/50 hover:text-purple-300 hover:bg-white/10 active:scale-95'
            }`}
            title={isListening ? "Listening... Speak city name (Tap to stop)" : "Tap for Voice Search"}
          >
            {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Interactive Voice Orb */}
          <div
            className="w-7 h-7 flex items-center justify-center cursor-pointer"
            onClick={startVoiceSearch}
            onTouchEnd={startVoiceSearch}
            title={isListening ? "Listening... Speak city name" : "Voice Search Orb"}
          >
            <div className={`w-7 h-7 rounded-full overflow-hidden transition-all duration-300 ${isListening ? 'ring-2 ring-purple-400 scale-110 shadow-lg shadow-purple-500/40' : 'hover:scale-110 opacity-90 hover:opacity-100'}`}>
              <VoicePoweredOrb
                hue={isListening ? 260 : 200}
                enableVoiceControl={isListening}
                onVoiceDetected={setVoiceDetected}
                onClick={startVoiceSearch}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Voice status pill when listening */}
      {isListening && (
        <div className="absolute top-full mt-1.5 left-2 right-2 sm:left-4 sm:right-auto flex items-center gap-2 text-xs text-purple-300 bg-purple-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-500/40 z-50 shadow-xl animate-fade-up">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="truncate">{voiceDetected ? "Voice detected! Listening..." : "Listening... Speak a city name"}</span>
        </div>
      )}

      {/* Dropdown — solid opaque background to prevent cards bleeding through */}
      {showPanel && showDropdown && !isListening && (
        <div className="absolute top-full mt-2 w-full z-[100] bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden py-2 shadow-2xl border border-slate-700/80 animate-slide-down">

          {/* City suggestions */}
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((city, i) => (
                <button
                  key={`${city.lat}-${city.lon}-${i}`}
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-white/10 text-white/90 text-sm transition-colors"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-white/40 text-xs">{city.state ? `${city.state}, ` : ''}{city.country}</span>
                </button>
              ))}
            </div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="px-4 py-1 text-xs font-semibold text-white/40 uppercase tracking-wider">Favorites</div>
              {favorites.map((fav) => (
                <button
                  key={fav.name}
                  onClick={() => handleSelect(fav)}
                  className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-white/10 text-white/80 text-sm transition-colors"
                >
                  <span>⭐ {fav.name}</span>
                  <span className="text-white/40 text-xs">{fav.country}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent */}
          {recentCities.length > 0 && (
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="px-4 py-1 text-xs font-semibold text-white/40 uppercase tracking-wider">Recent</div>
              {recentCities.map((rec) => (
                <button
                  key={rec.name}
                  onClick={() => handleSelect(rec)}
                  className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-white/10 text-white/70 text-sm transition-colors"
                >
                  <span>🕒 {rec.name}</span>
                  <span className="text-white/40 text-xs">{rec.country}</span>
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
