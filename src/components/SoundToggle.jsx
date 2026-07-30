import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SoundToggle = ({ enabled, onToggle, conditionName }) => {
  return (
    <button
      id="sound-toggle-btn"
      onClick={onToggle}
      className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-200 shrink-0 group"
      title={enabled ? 'Mute weather sounds' : 'Enable weather sounds'}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
      )}

      {/* Animated sound waves when enabled */}
      <AnimatePresence>
        {enabled && (
          <motion.span
            key="waves"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 -right-1"
          >
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 opacity-80" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default SoundToggle;
