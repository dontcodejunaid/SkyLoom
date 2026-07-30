import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatHour, formatTemp } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const HourlyChart = ({ forecast, unit, accent }) => {
  if (!forecast?.list) return null;

  // Next 24h (8 x 3h intervals)
  const items = forecast.list.slice(0, 8);
  const labels = items.map((i) => formatHour(i.dt));
  const temps  = items.map((i) => unit === 'C' ? Math.round(i.main.temp) : Math.round(i.main.temp * 9/5 + 32));
  const feels  = items.map((i) => unit === 'C' ? Math.round(i.main.feels_like) : Math.round(i.main.feels_like * 9/5 + 32));

  const accentRgb = accent || '#38bdf8';

  const data = {
    labels,
    datasets: [
      {
        label: `Temp (°${unit})`,
        data: temps,
        borderColor: accentRgb,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `${accentRgb}60`);
          gradient.addColorStop(1, `${accentRgb}00`);
          return gradient;
        },
        borderWidth: 2.5,
        pointBackgroundColor: accentRgb,
        pointBorderColor: 'rgba(255,255,255,0.8)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
      {
        label: `Feels like (°${unit})`,
        data: feels,
        borderColor: 'rgba(255,255,255,0.25)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,20,40,0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.7)',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}°${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 11, weight: '500' } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
        ticks: {
          color: 'rgba(255,255,255,0.45)',
          font: { size: 11 },
          callback: (v) => `${v}°`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-3xl p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">
          Temperature — Next 24h
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded-full" style={{ background: accentRgb }} />
            Temp
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded-full bg-white/25" style={{ borderTop: '1px dashed rgba(255,255,255,0.25)' }} />
            Feels like
          </span>
        </div>
      </div>
      <div style={{ height: '180px' }}>
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default HourlyChart;
