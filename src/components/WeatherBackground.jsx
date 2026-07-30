import { useMemo } from 'react';

// ─── Memoised particle arrays (stable across renders) ─────────────────────────

const useParticles = (count, factory) =>
  useMemo(() => Array.from({ length: count }, factory), [count]);

// ─── Rain ─────────────────────────────────────────────────────────────────────
const RainDrops = ({ count = 90, speedBase = 0.55, opacity = 0.55 }) => {
  const drops = useParticles(count, () => ({
    left: Math.random() * 110 - 5,
    delay: Math.random() * 2,
    dur: speedBase + Math.random() * 0.5,
    h: 55 + Math.random() * 60,
    op: 0.2 + Math.random() * opacity,
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ transform: 'skewX(-8deg) scale(1.1)' }}
    >
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: '-60px',
            width: '1.5px',
            height: `${d.h}px`,
            opacity: d.op,
            background:
              'linear-gradient(to bottom, transparent, rgba(174,214,241,0.9) 60%, rgba(255,255,255,0.5))',
            borderRadius: '0 0 2px 2px',
            animationName: 'rain',
            animationDuration: `${d.dur}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Snow ─────────────────────────────────────────────────────────────────────
const SnowFlakes = ({ count = 65 }) => {
  const flakes = useParticles(count, () => ({
    left: Math.random() * 100,
    size: 10 + Math.random() * 16,
    delay: Math.random() * 10,
    dur: 6 + Math.random() * 10,
    op: 0.4 + Math.random() * 0.55,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.left}%`,
            top: '-30px',
            fontSize: `${f.size}px`,
            opacity: f.op,
            color: 'white',
            textShadow: '0 0 8px rgba(200,230,255,0.8)',
            animationName: 'snow',
            animationDuration: `${f.dur}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${f.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

// ─── Stars ────────────────────────────────────────────────────────────────────
const Stars = () => {
  const stars = useParticles(110, () => ({
    x: Math.random() * 100,
    y: Math.random() * 75,
    size: 0.8 + Math.random() * 2.2,
    delay: Math.random() * 5,
    dur: 2 + Math.random() * 4,
    op: 0.35 + Math.random() * 0.65,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: 'white',
            opacity: s.op,
            animationName: 'pulse',
            animationDuration: `${s.dur}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {/* Shooting star */}
      <div
        className="absolute"
        style={{
          top: '12%',
          left: '-80px',
          width: '80px',
          height: '1.5px',
          background: 'linear-gradient(to right, transparent, white 60%, transparent)',
          transform: 'rotate(20deg)',
          animationName: 'shooting-star',
          animationDuration: '7s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDelay: '4s',
        }}
      />
    </div>
  );
};

// ─── Sun ──────────────────────────────────────────────────────────────────────
const Sun = ({ peekOnly = false }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      top: peekOnly ? '-6%' : '4%',
      right: '8%',
    }}
  >
    {/* Outer warm glow */}
    <div
      className="absolute rounded-full"
      style={{
        width: '260px',
        height: '260px',
        top: '-130px',
        left: '-130px',
        background:
          'radial-gradient(circle, rgba(253,224,71,0.14) 0%, rgba(251,146,60,0.06) 50%, transparent 75%)',
        animation: 'pulse 4s ease-in-out infinite',
      }}
    />
    {/* Rotating rays */}
    <div
      className="absolute rounded-full"
      style={{
        width: '180px',
        height: '180px',
        top: '-90px',
        left: '-90px',
        animation: 'spin 22s linear infinite',
        background: `conic-gradient(
          from 0deg,
          transparent 0deg, rgba(253,224,71,0.38) 5deg, transparent 11deg,
          transparent 29deg, rgba(253,224,71,0.32) 35deg, transparent 41deg,
          transparent 59deg, rgba(253,224,71,0.38) 65deg, transparent 71deg,
          transparent 89deg, rgba(253,224,71,0.32) 95deg, transparent 101deg,
          transparent 119deg, rgba(253,224,71,0.38) 125deg, transparent 131deg,
          transparent 149deg, rgba(253,224,71,0.32) 155deg, transparent 161deg,
          transparent 179deg, rgba(253,224,71,0.38) 185deg, transparent 191deg,
          transparent 209deg, rgba(253,224,71,0.32) 215deg, transparent 221deg,
          transparent 239deg, rgba(253,224,71,0.38) 245deg, transparent 251deg,
          transparent 269deg, rgba(253,224,71,0.32) 275deg, transparent 281deg,
          transparent 299deg, rgba(253,224,71,0.38) 305deg, transparent 311deg,
          transparent 329deg, rgba(253,224,71,0.32) 335deg, transparent 341deg,
          transparent 360deg
        )`,
      }}
    />
    {/* Sun disc */}
    <div
      className="absolute rounded-full"
      style={{
        width: peekOnly ? '70px' : '88px',
        height: peekOnly ? '70px' : '88px',
        top: peekOnly ? '-35px' : '-44px',
        left: peekOnly ? '-35px' : '-44px',
        background:
          'radial-gradient(circle at 38% 38%, #fffde7, #fde047 35%, #fbbf24 65%, #f59e0b 100%)',
        boxShadow:
          '0 0 50px 18px rgba(253,224,71,0.55), 0 0 100px 35px rgba(251,191,36,0.25)',
      }}
    />
  </div>
);

// ─── Moon ─────────────────────────────────────────────────────────────────────
const Moon = () => (
  <div className="absolute pointer-events-none" style={{ top: '7%', right: '10%' }}>
    {/* Glow halo */}
    <div
      className="absolute rounded-full"
      style={{
        width: '200px',
        height: '200px',
        top: '-100px',
        left: '-100px',
        background:
          'radial-gradient(circle, rgba(186,210,240,0.18) 0%, rgba(186,210,240,0.06) 55%, transparent 75%)',
        animation: 'pulse 5s ease-in-out infinite',
      }}
    />
    {/* Moon disc */}
    <div
      className="absolute rounded-full"
      style={{
        width: '72px',
        height: '72px',
        top: '-36px',
        left: '-36px',
        background:
          'radial-gradient(circle at 38% 38%, #f8fafc, #e2e8f0 55%, #cbd5e1 100%)',
        boxShadow: '0 0 35px 12px rgba(226,232,240,0.45)',
      }}
    >
      <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'rgba(100,116,139,0.28)', top: 18, left: 14 }} />
      <div style={{ position: 'absolute', width: 9, height: 9, borderRadius: '50%', background: 'rgba(100,116,139,0.22)', top: 38, left: 36 }} />
      <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'rgba(100,116,139,0.18)', top: 10, left: 42 }} />
    </div>
  </div>
);

// ─── Clouds ───────────────────────────────────────────────────────────────────
const CloudPuff = ({ top, left, right, width = 220, opacity = 0.18, dur = 25, delay = 0, color = 'white' }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      top,
      left,
      right,
      animation: `float-slow ${dur}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <div style={{ position: 'relative', width, height: Math.round(width * 0.3) }}>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%', background: color, borderRadius: 999, opacity }} />
      <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '40%', height: '160%', background: color, borderRadius: 999, opacity }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '45%', width: '30%', height: '130%', background: color, borderRadius: 999, opacity }} />
    </div>
  </div>
);

// ─── Lightning ────────────────────────────────────────────────────────────────
const Lightning = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)', animationName: 'lightning', animationDuration: '5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
    <svg className="absolute" style={{ top: '6%', left: '58%', width: 38, filter: 'drop-shadow(0 0 10px rgba(180,140,255,0.9))', animationName: 'lightning', animationDuration: '5s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} viewBox="0 0 24 52" fill="none">
      <path d="M14 2L3 30h9l-4 20L22 20h-10L14 2z" fill="rgba(215,195,255,0.95)" />
    </svg>
    <svg className="absolute" style={{ top: '10%', left: '25%', width: 26, filter: 'drop-shadow(0 0 8px rgba(180,140,255,0.8))', animationName: 'lightning', animationDuration: '7s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: '2.3s' }} viewBox="0 0 24 52" fill="none">
      <path d="M14 2L3 30h9l-4 20L22 20h-10L14 2z" fill="rgba(215,195,255,0.9)" />
    </svg>
  </div>
);

// ─── Fog layers ───────────────────────────────────────────────────────────────
const FogLayers = ({ color = 'rgba(255,255,255,0.55)' }) =>
  [{ top: '28%', op: 0.35, dur: 16 }, { top: '45%', op: 0.45, dur: 22 }, { top: '60%', op: 0.55, dur: 14 }, { top: '75%', op: 0.65, dur: 20 }].map((l, i) => (
    <div key={i} className="absolute pointer-events-none" style={{ top: l.top, left: '-15%', width: '130%', height: 70, background: color, filter: 'blur(22px)', borderRadius: '50%', opacity: l.op, animation: `float ${l.dur}s ease-in-out infinite`, animationDelay: `${i * 3.5}s` }} />
  ));

// ─── Haze shimmer ─────────────────────────────────────────────────────────────
const Haze = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 58px, rgba(220,180,80,0.04) 60px)', animation: 'float 10s ease-in-out infinite' }} />
);

// ─── Condition config ─────────────────────────────────────────────────────────
const getConditionKey = (code, isNight) => {
  if (isNight) return 'night';
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return [711,721,731,741,751,761,762].includes(code) ? 'haze' : 'fog';
  if (code === 800) return 'clear';
  if (code <= 802) return 'partly-cloudy';
  return 'cloudy';
};

const BACKGROUNDS = {
  clear:          'linear-gradient(170deg, #0b3e70 0%, #1565a8 32%, #1e90d8 65%, #4db8f0 100%)',
  'partly-cloudy':'linear-gradient(170deg, #0c4a72 0%, #0f6aaa 38%, #1a88cc 70%, #3aa8d8 100%)',
  cloudy:         'linear-gradient(170deg, #1c2637 0%, #2c3c50 45%, #3a5060 100%)',
  drizzle:        'linear-gradient(170deg, #152230 0%, #1e3548 45%, #254868 100%)',
  rain:           'linear-gradient(170deg, #0c1820 0%, #12283a 45%, #18364e 100%)',
  thunderstorm:   'linear-gradient(170deg, #070810 0%, #0d0e1e 45%, #160e2e 100%)',
  snow:           'linear-gradient(170deg, #9db8cc 0%, #bdd4e4 45%, #d8eaf6 100%)',
  fog:            'linear-gradient(170deg, #62727f 0%, #8a9daa 45%, #adbcc8 100%)',
  haze:           'linear-gradient(170deg, #7a6840 0%, #a0885a 45%, #c4a870 100%)',
  night:          'linear-gradient(170deg, #020510 0%, #080f2a 42%, #0f1642 100%)',
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const WeatherBackground = ({ conditionCode, isNight, accent }) => {
  const key = getConditionKey(conditionCode || 800, isNight || false);
  const bg  = BACKGROUNDS[key] || BACKGROUNDS.clear;

  return (
    <div className="fixed inset-0 z-0 transition-all duration-1000" style={{ background: bg }}>

      {/* Top ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 100%)' }} />

      {/* ── CLEAR DAY ── */}
      {key === 'clear' && (
        <>
          <Sun />
          <CloudPuff top="14%" left="4%" width={180} opacity={0.07} dur={30} />
          <CloudPuff top="22%" right="6%" width={140} opacity={0.06} dur={38} delay={12} />
        </>
      )}

      {/* ── PARTLY CLOUDY ── */}
      {key === 'partly-cloudy' && (
        <>
          <Sun peekOnly />
          <CloudPuff top="4%"  left="-2%" width={240} opacity={0.22} dur={20} />
          <CloudPuff top="16%" left="30%" width={200} opacity={0.18} dur={28} delay={8} />
          <CloudPuff top="8%"  right="-2%" width={180} opacity={0.2}  dur={24} delay={15} />
        </>
      )}

      {/* ── CLOUDY ── */}
      {key === 'cloudy' && (
        <>
          {[
            { top: '0%',  left: '-5%',  w: 280, op: 0.38, dur: 18 },
            { top: '10%', left: '22%',  w: 250, op: 0.32, dur: 26, delay: 6 },
            { top: '4%',  right: '-5%', w: 260, op: 0.40, dur: 22, delay: 12 },
            { top: '20%', left: '8%',   w: 220, op: 0.28, dur: 32, delay: 4 },
          ].map((c, i) => <CloudPuff key={i} {...c} />)}
        </>
      )}

      {/* ── DRIZZLE ── */}
      {key === 'drizzle' && (
        <>
          {[{ top: '0%', left: '-5%', w: 260, op: 0.35, dur: 20 }, { top: '8%', right: '-5%', w: 240, op: 0.38, dur: 26, delay: 8 }].map((c, i) => <CloudPuff key={i} {...c} />)}
          <RainDrops count={45} speedBase={0.9} opacity={0.35} />
        </>
      )}

      {/* ── RAIN ── */}
      {key === 'rain' && (
        <>
          {[{ top: '0%', left: '-8%', w: 300, op: 0.45, dur: 16 }, { top: '6%', right: '-6%', w: 280, op: 0.5, dur: 22, delay: 7 }, { top: '14%', left: '18%', w: 250, op: 0.4, dur: 28, delay: 14 }].map((c, i) => <CloudPuff key={i} {...c} color="rgba(80,100,120,1)" />)}
          <RainDrops count={100} speedBase={0.55} opacity={0.6} />
          {/* Ground mist */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(20,40,60,0.3), transparent)', backdropFilter: 'blur(1px)' }} />
        </>
      )}

      {/* ── THUNDERSTORM ── */}
      {key === 'thunderstorm' && (
        <>
          {[{ top: '0%', left: '-8%', w: 320, op: 0.6, dur: 14 }, { top: '5%', right: '-8%', w: 300, op: 0.65, dur: 18, delay: 5 }, { top: '12%', left: '15%', w: 280, op: 0.55, dur: 22, delay: 10 }].map((c, i) => <CloudPuff key={i} {...c} color="rgba(30,25,50,1)" />)}
          <RainDrops count={130} speedBase={0.45} opacity={0.7} />
          <Lightning />
        </>
      )}

      {/* ── SNOW ── */}
      {key === 'snow' && (
        <>
          <CloudPuff top="2%"  left="-4%" width={260} opacity={0.5} dur={24} color="rgba(200,220,240,1)" />
          <CloudPuff top="10%" right="-4%" width={240} opacity={0.45} dur={30} delay={10} color="rgba(200,220,240,1)" />
          <SnowFlakes />
        </>
      )}

      {/* ── FOG ── */}
      {key === 'fog' && (
        <div className="absolute inset-0 pointer-events-none">
          <FogLayers />
        </div>
      )}

      {/* ── HAZE ── */}
      {key === 'haze' && (
        <div className="absolute inset-0 pointer-events-none">
          <FogLayers color="rgba(200,170,100,0.5)" />
          <Haze />
        </div>
      )}

      {/* ── NIGHT ── */}
      {key === 'night' && (
        <>
          <Stars />
          <Moon />
          {/* Nebula streak */}
          <div className="absolute pointer-events-none" style={{ top: '5%', left: '10%', width: '50%', height: '35%', background: 'radial-gradient(ellipse, rgba(100,80,180,0.08) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'rotate(-15deg)' }} />
          {/* Overlay rain/snow if it's currently raining or snowing at night */}
          {conditionCode >= 200 && conditionCode < 600 && <RainDrops count={90} speedBase={0.55} opacity={0.6} />}
          {conditionCode >= 600 && conditionCode < 700 && <SnowFlakes count={65} />}
        </>
      )}

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
    </div>
  );
};

export default WeatherBackground;
