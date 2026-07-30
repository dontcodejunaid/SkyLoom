import { motion } from 'framer-motion';
import { formatDay, formatTemp } from '../utils/formatters';
import { getIconUrl } from '../utils/weatherUtils';

const ForecastRow = ({ forecast, unit }) => {
  if (!forecast?.list) return null;

  // Pick one entry per day at midday
  const days = forecast.list
    .filter((i) => i.dt_txt.includes('12:00:00'))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-3xl p-5 md:p-6"
    >
      <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">
        5-Day Forecast
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {days.map((day, i) => {
          const hi = formatTemp(day.main.temp_max, unit);
          const lo = formatTemp(day.main.temp_min, unit);
          const icon = day.weather[0].icon;
          const desc = day.weather[0].main;
          const dayName = i === 0 ? 'Today' : formatDay(day.dt);

          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
              className="flex-1 min-w-[90px] glass-hover flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 cursor-default"
            >
              <div className="text-white/50 text-xs font-semibold">{dayName}</div>
              <img
                src={getIconUrl(icon)}
                alt={desc}
                className="w-12 h-12 drop-shadow-md"
              />
              <div className="text-[10px] text-white/40 capitalize">{desc}</div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-white font-bold text-sm">{hi}</div>
                <div className="text-white/40 text-xs">{lo}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ForecastRow;
