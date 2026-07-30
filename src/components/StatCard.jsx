import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, sub, accent, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    className="stat-card"
  >
    <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
      {Icon && (
        <Icon
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: accent || 'rgba(255,255,255,0.4)' }}
        />
      )}
      {label}
    </div>
    <div className="text-white font-bold text-xl leading-none mt-1">{value}</div>
    {sub && <div className="text-white/40 text-xs mt-0.5">{sub}</div>}
  </motion.div>
);

export default StatCard;
