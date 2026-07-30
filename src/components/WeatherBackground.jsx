import { useEffect, useRef, useMemo } from 'react';

const RainParticles = () => {
  const count = 60;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 100}px`,
            height: `${60 + Math.random() * 60}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(147,197,253,0.8))',
            animationName: 'rain',
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

const SnowParticles = () => {
  const count = 50;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${20 + Math.random() * 50}px`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            background: 'rgba(255,255,255,0.8)',
            animationName: 'snow',
            animationDuration: `${4 + Math.random() * 6}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${Math.random() * 8}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};

const StarField = () => {
  const count = 80;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
            width: `${1 + Math.random() * 2.5}px`,
            height: `${1 + Math.random() * 2.5}px`,
            background: 'white',
            animationName: 'pulse',
            animationDuration: `${2 + Math.random() * 4}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0.4 + Math.random() * 0.6,
          }}
        />
      ))}
    </div>
  );
};

const LightningFlash = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse at 50% 0%, rgba(200,162,255,0.15) 0%, transparent 60%)',
      animationName: 'lightning',
      animationDuration: '4s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    }}
  />
);

const CloudOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[
      { w: '60%', top: '8%', opacity: 0.07, delay: 0, duration: 25 },
      { w: '45%', top: '20%', opacity: 0.06, delay: 8, duration: 30 },
      { w: '70%', top: '5%',  opacity: 0.05, delay: 15, duration: 35 },
    ].map((c, i) => (
      <div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: c.w,
          top: c.top,
          height: '30%',
          left: '-10%',
          background: 'white',
          opacity: c.opacity,
          animation: `float ${c.duration}s ease-in-out infinite`,
          animationDelay: `${c.delay}s`,
        }}
      />
    ))}
  </div>
);

const WeatherBackground = ({ theme }) => {
  return (
    <div
      className="fixed inset-0 transition-all duration-1000 z-0"
      style={{ background: theme.gradient }}
    >
      {/* Ambient glow orb */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] rounded-full blur-3xl pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${theme.accent}25 0%, transparent 70%)`,
          maxWidth: '800px',
        }}
      />
      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${theme.accent}08, transparent)`,
        }}
      />

      {/* Condition particles */}
      {(theme.particle === 'rain' || theme.particle === 'drizzle') && <RainParticles />}
      {theme.particle === 'snow' && <SnowParticles />}
      {theme.particle === 'stars' && <StarField />}
      {theme.name === 'thunderstorm' && <LightningFlash />}
      {(theme.name === 'cloudy' || theme.name === 'partly-cloudy' || theme.name === 'fog') && <CloudOverlay />}
    </div>
  );
};

export default WeatherBackground;
