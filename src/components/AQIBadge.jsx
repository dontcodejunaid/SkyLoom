import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind as WindIcon, X } from 'lucide-react';
import { getAQIInfo, calculateUSAQI } from '../utils/weatherUtils';

const AQIBadge = ({ airQuality }) => {
  const [open, setOpen] = useState(false);
  if (!airQuality?.list?.[0]) return null;

  const { components } = airQuality.list[0];
  const realAQI = calculateUSAQI(components);
  const info = getAQIInfo(realAQI);

  const pollutants = [
    { label: 'CO',   value: components.co?.toFixed(1),   unit: 'μg/m³' },
    { label: 'NO₂',  value: components.no2?.toFixed(1),  unit: 'μg/m³' },
    { label: 'O₃',   value: components.o3?.toFixed(1),   unit: 'μg/m³' },
    { label: 'PM2.5',value: components.pm2_5?.toFixed(1),unit: 'μg/m³' },
    { label: 'PM10', value: components.pm10?.toFixed(1), unit: 'μg/m³' },
    { label: 'SO₂',  value: components.so2?.toFixed(1),  unit: 'μg/m³' },
  ];

  return (
    <div className="relative z-30">
      <button
        id="aqi-badge-btn"
        onClick={() => setOpen((p) => !p)}
        className={`btn-pill ${info.class} gap-2 cursor-pointer shadow-md hover:scale-105 transition-all`}
        title="Click for detailed Air Quality Index breakdown"
      >
        <WindIcon className="w-3.5 h-3.5" />
        AQI {realAQI} · {info.label}
        <span className="text-xs">{info.emoji}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs" onClick={() => setOpen(false)} />

            {/* Solid Opaque Popover Card floating crisp & clear in front */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 z-[100] bg-slate-900 rounded-2xl p-5 w-80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-slate-700/80"
            >
              <div className="text-white font-bold text-sm mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <WindIcon className="w-4 h-4 text-sky-400" /> Air Quality Details
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`inline-flex items-center gap-1.5 btn-pill text-xs mb-3 ${info.class}`}>
                {info.emoji} {info.label} — AQI {realAQI}
              </div>

              <p className="text-white/80 text-xs mb-3.5 leading-relaxed">{info.desc}</p>

              <div className="grid grid-cols-2 gap-2">
                {pollutants.map((p) => (
                  <div key={p.label} className="bg-slate-800/90 rounded-xl px-3 py-2 border border-slate-700/60">
                    <div className="text-sky-300/70 text-[10px] font-semibold">{p.label}</div>
                    <div className="text-white text-base font-bold">{p.value}</div>
                    <div className="text-white/40 text-[9px]">{p.unit}</div>
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
