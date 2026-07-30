import { Volume2, VolumeX, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../hooks/useWeatherSound';

const SoundToggle = ({ enabled, onToggle, currentLang, onChangeLang }) => {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15">
      {/* Sound Mute/Unmute Button */}
      <button
        id="sound-toggle-btn"
        onClick={onToggle}
        className="relative p-1.5 rounded-full hover:bg-white/15 transition-all duration-200 shrink-0 group"
        title={enabled ? 'Mute weather sounds & voice' : 'Enable weather sounds & voice announcements'}
      >
        {enabled ? (
          <Volume2 className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" />
        ) : (
          <VolumeX className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
        )}

        {/* Animated sound wave indicator when enabled */}
        <AnimatePresence>
          {enabled && (
            <motion.span
              key="waves"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-0.5 -right-0.5"
            >
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 opacity-90" />
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Language Selector (EN, HI, KN) */}
      <div className="flex items-center gap-0.5 pl-0.5 pr-1 border-l border-white/10">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChangeLang(lang.code)}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all duration-200 select-none ${
              currentLang === lang.code
                ? 'bg-sky-400/30 text-sky-200 border border-sky-400/40 shadow-sm'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title={`Voice Announcement: ${lang.name}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoundToggle;
