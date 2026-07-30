import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'skyloom_sound';

// ─── Voice Weather Announcer (Speech Synthesis) ──────────────────────────────
export const speakWeatherAnnouncement = (weatherData, unit = 'C') => {
  if (!('speechSynthesis' in window) || !weatherData) return;

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const city = weatherData.name;
    const temp = Math.round(weatherData.main.temp);
    const description = weatherData.weather[0]?.description || 'clear';

    const text = `Currently in ${city}, it's ${temp} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'} with ${description}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

// ─── Condition code → sound type ─────────────────────────────────────────────
const getSoundType = (code, isNight) => {
  if (!code) return 'crickets-day';
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'wind';
  if (code === 800) return isNight ? 'crickets-night' : 'crickets-day';
  return 'crickets-day';
};

// ─── White/Brown noise buffer generator ──────────────────────────────────────
const mkNoise = (ctx, seconds = 3, type = 'white') => {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (type === 'white') {
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  } else {
    // Brown noise
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.5;
    }
  }
  return buf;
};

const mkNoiseSource = (ctx, type = 'white', seconds = 3) => {
  const src = ctx.createBufferSource();
  src.buffer = mkNoise(ctx, seconds, type);
  src.loop = true;
  return src;
};

// ─── REALISTIC RAIN ENGINE (Noise + Random Droplet Pitter-Patter) ────────────
const startRain = (ctx, dest, vol = 0.8, timers = []) => {
  const nodes = [];

  // 1. Continuous rain rush (filtered noise)
  const src = mkNoiseSource(ctx, 'white', 4);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1200; // Crisp rain rumble

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 350;

  const mainGain = ctx.createGain();
  mainGain.gain.value = vol * 0.7;

  src.connect(lp);
  lp.connect(hp);
  hp.connect(mainGain);
  mainGain.connect(dest);
  src.start();
  nodes.push(src, lp, hp, mainGain);

  // 2. Individual droplet click taps (pitter-patter effect)
  const scheduleDropClick = () => {
    try {
      const osc = ctx.createOscillator();
      const dropGain = ctx.createGain();

      const freq = 1400 + Math.random() * 2200;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);

      dropGain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.connect(dropGain);
      dropGain.connect(dest);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
      nodes.push(osc, dropGain);
    } catch (e) {}

    const nextTime = 30 + Math.random() * 80;
    const t = setTimeout(scheduleDropClick, nextTime);
    timers.push(t);
  };

  scheduleDropClick();
  return nodes;
};

// ─── DRIZZLE ENGINE ──────────────────────────────────────────────────────────
const startDrizzle = (ctx, dest, timers) => startRain(ctx, dest, 0.45, timers);

// ─── THUNDERSTORM ENGINE ──────────────────────────────────────────────────────
const startThunderstorm = (ctx, dest, timers) => {
  const nodes = [...startRain(ctx, dest, 0.9, timers)];

  // Low thunder rumbles
  const rumble = () => {
    try {
      const src = mkNoiseSource(ctx, 'brown', 5);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 140;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.95, ctx.currentTime + 0.15);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4.0);

      src.connect(lp);
      lp.connect(g);
      g.connect(dest);

      src.start();
      src.stop(ctx.currentTime + 4.5);
      nodes.push(src, lp, g);
    } catch (e) {}

    const t = setTimeout(rumble, 8000 + Math.random() * 12000);
    timers.push(t);
  };

  timers.push(setTimeout(rumble, 1000));
  return nodes;
};

// ─── CRICKETS & INSECTS ENGINE (Sunny / Clear Day & Night) ───────────────────
const startCricketsAndInsects = (ctx, dest, isNight = false, timers = []) => {
  const nodes = [];

  // 1. Continuous cricket chirping (pulsed high-pitch oscillator)
  const cricketOsc = ctx.createOscillator();
  cricketOsc.type = 'sine';
  cricketOsc.frequency.value = isNight ? 4500 : 5200;

  const lfo = ctx.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = isNight ? 22 : 14;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;

  const mainGain = ctx.createGain();
  mainGain.gain.value = 0.15;

  lfo.connect(lfoGain);
  lfoGain.connect(mainGain.gain);

  cricketOsc.connect(mainGain);
  mainGain.connect(dest);

  cricketOsc.start();
  lfo.start();
  nodes.push(cricketOsc, lfo, lfoGain, mainGain);

  // 2. Daytime bird chirps / night insect bursts
  const scheduleChirp = () => {
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const now = ctx.currentTime;
      const baseFreq = isNight ? (3800 + Math.random() * 1000) : (2400 + Math.random() * 1600);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.12);

      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(g);
      g.connect(dest);

      osc.start(now);
      osc.stop(now + 0.16);
      nodes.push(osc, g);
    } catch (e) {}

    const interval = isNight ? (1200 + Math.random() * 2500) : (1800 + Math.random() * 3500);
    const t = setTimeout(scheduleChirp, interval);
    timers.push(t);
  };

  scheduleChirp();
  return nodes;
};

// ─── WIND ENGINE ─────────────────────────────────────────────────────────────
const startWind = (ctx, dest, vol = 0.35) => {
  const nodes = [];
  const src = mkNoiseSource(ctx, 'brown', 4);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 320;
  bp.Q.value = 0.7;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 140;

  lfo.connect(lfoGain);
  lfoGain.connect(bp.frequency);
  lfo.start();

  const gain = ctx.createGain();
  gain.gain.value = vol;

  src.connect(bp);
  bp.connect(gain);
  gain.connect(dest);

  src.start();
  nodes.push(src, lfo, lfoGain, bp, gain);
  return nodes;
};

const startSnow = (ctx, dest) => startWind(ctx, dest, 0.2);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useWeatherSound = (conditionCode, isNight, weatherData, unit = 'C') => {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch { return false; }
  });

  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const nodesRef = useRef([]);
  const timersRef = useRef([]);

  const stopAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    nodesRef.current.forEach(n => {
      try { n.stop?.(); } catch {}
      try { n.disconnect?.(); } catch {}
    });
    nodesRef.current = [];
  }, []);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      ctxRef.current = new AudioCtx();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0.9; // Master volume boost
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return true;
  }, []);

  const startSound = useCallback((type) => {
    stopAll();
    if (!enabled || !ctxRef.current) return;

    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }

    const ctx = ctxRef.current;
    const dest = masterRef.current;
    const t = timersRef.current;
    let newNodes = [];

    const soundType = type || 'crickets-day';

    switch (soundType) {
      case 'rain':
        newNodes = startRain(ctx, dest, 0.85, t);
        break;
      case 'drizzle':
        newNodes = startDrizzle(ctx, dest, t);
        break;
      case 'thunderstorm':
        newNodes = startThunderstorm(ctx, dest, t);
        break;
      case 'snow':
        newNodes = startSnow(ctx, dest);
        break;
      case 'wind':
        newNodes = startWind(ctx, dest, 0.45);
        break;
      case 'crickets-day':
        newNodes = startCricketsAndInsects(ctx, dest, false, t);
        break;
      case 'crickets-night':
        newNodes = startCricketsAndInsects(ctx, dest, true, t);
        break;
      default:
        newNodes = startCricketsAndInsects(ctx, dest, false, t);
        break;
    }
    nodesRef.current = newNodes;
  }, [enabled, stopAll]);

  // Handle weather sound state and condition updates
  useEffect(() => {
    if (!enabled) return;
    ensureCtx();
    const type = getSoundType(conditionCode, isNight);
    startSound(type);
    return stopAll;
  }, [conditionCode, isNight, enabled, ensureCtx, startSound, stopAll]);

  // Voice speech announcement on city load if sound is enabled
  useEffect(() => {
    if (enabled && weatherData) {
      speakWeatherAnnouncement(weatherData, unit);
    }
  }, [weatherData?.name, enabled]);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}

      if (next) {
        ensureCtx();
        const type = getSoundType(conditionCode, isNight);
        startSound(type);
        if (weatherData) {
          speakWeatherAnnouncement(weatherData, unit);
        }
      } else {
        stopAll();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (ctxRef.current && ctxRef.current.state === 'running') {
          ctxRef.current.suspend();
        }
      }
      return next;
    });
  }, [conditionCode, isNight, weatherData, unit, ensureCtx, startSound, stopAll]);

  useEffect(() => {
    return () => {
      stopAll();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      try { ctxRef.current?.close(); } catch {}
    };
  }, [stopAll]);

  return { soundEnabled: enabled, toggleSound: toggle };
};
