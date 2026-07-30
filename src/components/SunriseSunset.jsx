import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime, getSunProgress, formatDuration } from '../utils/formatters';

const SunriseSunset = ({ sunrise, sunset }) => {
  const now = Math.floor(Date.now() / 1000);
  const progress = getSunProgress(now, sunrise, sunset);
  const isDay = now >= sunrise && now <= sunset;
  const nextEvent = isDay
    ? { label: 'Sunset', time: formatTime(sunset), remaining: formatDuration(sunset - now) }
    : { label: 'Sunrise', time: formatTime(sunrise), remaining: '' };

  // Arc SVG params
  const W = 280, H = 130;
  const cx = W / 2, cy = H + 10;
  const r = H;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sunAngle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(sunAngle);
  const sunY = cy + r * Math.sin(sunAngle);

  // Arc path
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const progressPath = (() => {
    const endX = cx + r * Math.cos(sunAngle);
    const endY = cy + r * Math.sin(sunAngle);
    const largeArc = progress > 0.5 ? 1 : 0;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-3xl p-5 md:p-6"
    >
      <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Sun</div>

      {/* SVG Arc */}
      <div className="flex justify-center mb-2">
        <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`}>
          {/* Track */}
          <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
          {/* Progress */}
          <path d={progressPath} fill="none" stroke="rgba(251,191,36,0.6)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Dashed horizon */}
          <line x1={cx - r - 6} y1={cy} x2={cx + r + 6} y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,4" />
          {/* Sun dot */}
          {isDay && (
            <g>
              <circle cx={sunX} cy={sunY} r="12" fill="rgba(251,191,36,0.15)" />
              <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
              <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" className="animate-pulse-slow" opacity="0.5" r="10" />
            </g>
          )}
          {/* Sunrise label */}
          <text x={cx - r} y={cy + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">
            {formatTime(sunrise)}
          </text>
          {/* Sunset label */}
          <text x={cx + r} y={cy + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">
            {formatTime(sunset)}
          </text>
        </svg>
      </div>

      {/* Info row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Sunrise className="w-4 h-4 text-yellow-400" />
          <span>{formatTime(sunrise)}</span>
        </div>
        <div className="text-center">
          {isDay ? (
            <div className="text-white/50 text-xs">
              {nextEvent.label} in <span className="text-white font-semibold">{nextEvent.remaining}</span>
            </div>
          ) : (
            <div className="text-white/40 text-xs">Night</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <span>{formatTime(sunset)}</span>
          <Sunset className="w-4 h-4 text-orange-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default SunriseSunset;
