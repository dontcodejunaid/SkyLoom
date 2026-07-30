import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { formatTemp, formatFullDate, formatTime, capitalize } from '../utils/formatters';
import { getIconUrl } from '../utils/weatherUtils';

const HeroCard = ({ weather, unit, onToggleUnit, isFavorite, onToggleFavorite, theme }) => {
  if (!weather) return null;

  const { main, weather: conditions, name, sys, wind, visibility, dt } = weather;
  const condition = conditions[0];
  const temp = formatTemp(main.temp, unit);
  const feelsLike = formatTemp(main.feels_like, unit);
  const date = formatFullDate(dt);
  const localTime = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{name}, {sys.country}</span>
          </div>
          <div className="text-white/40 text-xs mt-0.5">{date} • {localTime}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Favorite toggle */}
          <button
            id="favorite-toggle-btn"
            onClick={() => onToggleFavorite({ name, country: sys.country })}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-200"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'
              }`}
            />
          </button>
          {/* Unit toggle */}
          <div className="flex items-center gap-1 glass rounded-full px-1 py-1">
            <button
              id="unit-celsius-btn"
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => onToggleUnit('C')}
            >°C</button>
            <button
              id="unit-fahrenheit-btn"
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => onToggleUnit('F')}
            >°F</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${temp}-${unit}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="text-[5.5rem] md:text-[7rem] font-bold leading-none text-white text-shadow tracking-tighter"
            >
              {temp}
            </motion.div>
          </AnimatePresence>
          <div className="mt-1 text-white/80 text-lg font-medium capitalize text-shadow-sm">
            {capitalize(condition.description)}
          </div>
          <div className="mt-0.5 text-white/50 text-sm">
            Feels like {feelsLike}
          </div>
        </div>

        {/* Weather icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-50 scale-75"
            style={{ background: theme.accent }}
          />
          <img
            src={getIconUrl(condition.icon)}
            alt={condition.description}
            className="w-28 h-28 md:w-36 md:h-36 relative z-10 drop-shadow-xl"
            style={{ filter: `drop-shadow(0 0 20px ${theme.accent}80)` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroCard;
