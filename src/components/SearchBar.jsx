import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Clock, X, Mic } from 'lucide-react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';

const debounce = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
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
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Web Speech Recognition setup
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      // Toggle off if already listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptText('Listening...');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setQuery(text);
        setTranscriptText(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscriptText('');
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically search if query was set
        setQuery(prev => {
          if (prev && prev !== 'Listening...') {
            onSearch(prev.replace(/[.#$%]/g, '').trim());
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
          placeholder={isListening ? (transcriptText || "Listening to your voice...") : "Search city or click Orb..."}
          className={`search-input pl-11 pr-20 ${isListening ? 'border-purple-400/60 bg-purple-900/20 text-purple-200 placeholder-purple-300/60' : ''}`}
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

          {/* Interactive Voice Orb Button */}
          <div
            className="w-7 h-7 flex items-center justify-center"
            title={isListening ? "Listening... Speak city name (Click to stop)" : "Click Orb for Voice Search"}
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
        <div className="absolute top-full mt-1 left-4 flex items-center gap-2 text-xs text-purple-300 bg-purple-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/30 z-50 animate-fade-up">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>{voiceDetected ? "Voice detected! Listening..." : "Listening... Speak a city name"}</span>
        </div>
      )}

      {/* Dropdown */}
      {showPanel && showDropdown && !isListening && (
        <div className="absolute top-full mt-2 w-full z-50 glass rounded-2xl overflow-hidden py-2 animate-slide-down">

          {/* City suggestions */}
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((city, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/10 transition-colors text-white/90 text-sm"
                >
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{city.name}, <span className="text-white/50">{city.country}</span></span>
                </button>
              ))}
            </div>
          )}

          {/* Favorites */}
          {suggestions.length === 0 && favorites.length > 0 && (
            <div className="px-2 py-1">
              <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Favorites</div>
              {favorites.map((city, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-3 py-2 flex items-center gap-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/90 text-sm text-left"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span>{city.name}, <span className="text-white/50">{city.country}</span></span>
                </button>
              ))}
            </div>
          )}

          {/* Recents */}
          {suggestions.length === 0 && recentCities.length > 0 && (
            <div className="px-2 py-1 border-t border-white/10">
              <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Recent Searches</div>
              {recentCities.map((city, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-3 py-2 flex items-center gap-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/90 text-sm text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span>{city.name}, <span className="text-white/50">{city.country}</span></span>
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
