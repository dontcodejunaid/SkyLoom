import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'skyloom_sound';
const LANG_STORAGE_KEY = 'skyloom_sound_lang';

export const LANGUAGES = [
  { code: 'en', name: 'English', voiceLang: 'en-US', label: 'EN' },
  { code: 'hi', name: 'हिंदी (Hindi)', voiceLang: 'hi-IN', label: 'HI' },
];

// Weather condition translations for English and Hindi
const CONDITION_TRANSLATIONS = {
  en: {
    clear: 'clear sky',
    few_clouds: 'few clouds',
    scattered_clouds: 'scattered clouds',
    broken_clouds: 'broken clouds',
    overcast: 'overcast clouds',
    rain: 'rainy weather',
    drizzle: 'light drizzle',
    thunderstorm: 'thunderstorm',
    snow: 'snowfall',
    mist: 'misty atmosphere',
    fog: 'foggy weather',
    haze: 'hazy weather',
  },
  hi: {
    clear: 'साफ़ आसमान',
    few_clouds: 'थोड़े बादल',
    scattered_clouds: 'छिटपुट बादल',
    broken_clouds: 'घने बादल',
    overcast: 'बादल छाए हुए हैं',
    rain: 'बारिश का मौसम',
    drizzle: 'हल्की बूंदाबांदी',
    thunderstorm: 'गरज के साथ तूफ़ान',
    snow: 'बर्फबारी',
    mist: 'धुंध का माहौल',
    fog: 'कोहरा',
    haze: 'धुंध',
  },
};

const getTranslatedDescription = (mainDesc, code, lang) => {
  const dict = CONDITION_TRANSLATIONS[lang] || CONDITION_TRANSLATIONS.en;

  if (code >= 200 && code < 300) return dict.thunderstorm;
  if (code >= 300 && code < 400) return dict.drizzle;
  if (code >= 500 && code < 600) return dict.rain;
  if (code >= 600 && code < 700) return dict.snow;
  if (code >= 700 && code < 800) return dict.fog;
  if (code === 800) return dict.clear;
  if (code <= 802) return dict.few_clouds;
  return dict.overcast;
};

// ─── Voice Weather Announcer (Speech Synthesis) ──────────────────────────────
export const speakWeatherAnnouncement = (weatherData, unit = 'C', lang = 'en') => {
  if (!('speechSynthesis' in window) || !weatherData) return;

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const city = weatherData.name;
    const temp = Math.round(weatherData.main.temp);
    const code = weatherData.weather[0]?.id || 800;
    const mainDesc = weatherData.weather[0]?.description || 'clear';
    const conditionText = getTranslatedDescription(mainDesc, code, lang);

    let text = '';
    let voiceTargetLang = 'en-US';

    if (lang === 'hi') {
      voiceTargetLang = 'hi-IN';
      const unitText = unit === 'C' ? 'सेलसियस' : 'फ़ारेनहाइट';
      text = `${city} में अभी तापमान ${temp} डिग्री ${unitText} है, और ${conditionText} है।`;
    } else {
      voiceTargetLang = 'en-US';
      const unitText = unit === 'C' ? 'Celsius' : 'Fahrenheit';
      text = `Currently in ${city}, it's ${temp} degrees ${unitText} with ${conditionText}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.95;

    // Match voice for the target language (Hindi, Kannada, or English)
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.toLowerCase().startsWith(voiceTargetLang.toLowerCase()));

    // Fallback to any voice starting with language code (e.g., 'hi' or 'kn')
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().startsWith(lang));
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = voiceTargetLang;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

// ─── Condition code → sound type ─────────────────────────────────────────────
const getSoundType = (code, isNight) => {
  if (!code) return 'breeze';
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'wind';
  if (code === 800) return 'breeze';
  return 'breeze';
};

// ─── White/Brown noise buffer generator ──────────────────────────────────────
const mkNoise = (ctx, seconds = 3, type = 'white') => {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (type === 'white') {
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  } else {
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

// ─── RAIN ENGINE ─────────────────────────────────────────────────────────────
const startRain = (ctx, dest, vol = 0.8, timers = []) => {
  const nodes = [];

  const src = mkNoiseSource(ctx, 'white', 4);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1200;

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

const startDrizzle = (ctx, dest, timers) => startRain(ctx, dest, 0.45, timers);

// ─── THUNDERSTORM ENGINE ──────────────────────────────────────────────────────
const startThunderstorm = (ctx, dest, timers) => {
  const nodes = [...startRain(ctx, dest, 0.9, timers)];

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

// ─── WIND & BREEZE ENGINE ───────────────────────────────────────────────────
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
const startBreeze = (ctx, dest) => startWind(ctx, dest, 0.12);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useWeatherSound = (conditionCode, isNight, weatherData, unit = 'C') => {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch { return false; }
  });

  const [soundLang, setSoundLang] = useState(() => {
    try { return localStorage.getItem(LANG_STORAGE_KEY) || 'en'; }
    catch { return 'en'; }
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
      masterRef.current.gain.value = 0.9;
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

    const soundType = type || 'breeze';

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
      case 'breeze':
        newNodes = startBreeze(ctx, dest);
        break;
      default:
        newNodes = startBreeze(ctx, dest);
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

  // Voice speech announcement on city load or language change if sound is enabled
  useEffect(() => {
    if (enabled && weatherData) {
      speakWeatherAnnouncement(weatherData, unit, soundLang);
    }
  }, [weatherData?.name, enabled, soundLang]);

  const changeLanguage = useCallback((newLang) => {
    setSoundLang(newLang);
    try { localStorage.setItem(LANG_STORAGE_KEY, newLang); } catch {}

    if (enabled && weatherData) {
      speakWeatherAnnouncement(weatherData, unit, newLang);
    }
  }, [enabled, weatherData, unit]);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}

      if (next) {
        ensureCtx();
        const type = getSoundType(conditionCode, isNight);
        startSound(type);
        if (weatherData) {
          speakWeatherAnnouncement(weatherData, unit, soundLang);
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
  }, [conditionCode, isNight, weatherData, unit, soundLang, ensureCtx, startSound, stopAll]);

  useEffect(() => {
    return () => {
      stopAll();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      try { ctxRef.current?.close(); } catch {}
    };
  }, [stopAll]);

  return {
    soundEnabled: enabled,
    toggleSound: toggle,
    soundLang,
    changeLanguage,
  };
};
