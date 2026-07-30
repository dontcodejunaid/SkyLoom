import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind as WindIcon } from 'lucide-react';
import { getAQIInfo } from '../utils/weatherUtils';

const AQIBadge = ({ airQuality }) => {
  const [open, setOpen] = useState(false);
  if (!airQuality?.list?.[0]) return null;

  const { main: { aqi }, components } = airQuality.list[0];
  const info = getAQIInfo(aqi);

  const pollutants = [
    { label: 'CO',   value: components.co?.toFixed(1),   unit: 'μg/m³' },
    { label: 'NO₂',  value: components.no2?.toFixed(1),  unit: 'μg/m³' },
    { label: 'O₃',   value: components.o3?.toFixed(1),   unit: 'μg/m³' },
    { label: 'PM2.5',value: components.pm2_5?.toFixed(1),unit: 'μg/m³' },
    { label: 'PM10', value: components.pm10?.toFixed(1), unit: 'μg/m³' },
    { label: 'SO₂',  value: components.so2?.toFixed(1),  unit: 'μg/m³' },
  ];

  return (
    <div className="relative">
      <button
        id="aqi-badge-btn"
        onClick={() => setOpen((p) => !p)}
        className={`btn-pill ${info.class} gap-2`}
        title="View air quality details"
      >
        <WindIcon className="w-3 h-3" />
        AQI {aqi} · {info.label}
        <span className="text-xs">{info.emoji}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 z-50 glass rounded-2xl p-4 w-64 shadow-xl"
            >
              <div className="text-white font-semibold text-sm mb-1">Air Quality Index</div>
              <div className={`inline-flex items-center gap-1.5 btn-pill text-xs mb-3 ${info.class}`}>
                {info.emoji} {info.label} — AQI {aqi}
              </div>
              <p className="text-white/50 text-xs mb-3">{info.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {pollutants.map((p) => (
                  <div key={p.label} className="bg-white/5 rounded-xl px-3 py-2">
                    <div className="text-white/40 text-[10px] font-semibold">{p.label}</div>
                    <div className="text-white text-sm font-bold">{p.value}</div>
                    <div className="text-white/30 text-[9px]">{p.unit}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AQIBadge;
