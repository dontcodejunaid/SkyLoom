// Weather condition code → theme mapping
export const getWeatherTheme = (conditionCode, isNight = false) => {
  const code = conditionCode;

  if (isNight) {
    return {
      name: 'night',
      gradient: 'linear-gradient(160deg, #020510 0%, #0a0e2e 40%, #111842 100%)',
      accent: '#818cf8',
      particle: 'stars',
    };
  }

  // Thunderstorm
  if (code >= 200 && code < 300) {
    return {
      name: 'thunderstorm',
      gradient: 'linear-gradient(160deg, #0d1117 0%, #1a1f35 40%, #1e293b 100%)',
      accent: '#c084fc',
      particle: 'rain',
    };
  }
  // Drizzle
  if (code >= 300 && code < 400) {
    return {
      name: 'drizzle',
      gradient: 'linear-gradient(160deg, #0c1445 0%, #1e3a5f 50%, #1e4d6b 100%)',
      accent: '#93c5fd',
      particle: 'drizzle',
    };
  }
  // Rain
  if (code >= 500 && code < 600) {
    return {
      name: 'rain',
      gradient: 'linear-gradient(160deg, #0f172a 0%, #1e2d4a 40%, #1e3a5f 100%)',
      accent: '#60a5fa',
      particle: 'rain',
    };
  }
  // Snow
  if (code >= 600 && code < 700) {
    return {
      name: 'snow',
      gradient: 'linear-gradient(160deg, #e2e8f0 0%, #bfdbfe 50%, #dbeafe 100%)',
      accent: '#3b82f6',
      textDark: true,
      particle: 'snow',
    };
  }
  // Atmosphere (mist, fog, haze etc)
  if (code >= 700 && code < 800) {
    return {
      name: 'fog',
      gradient: 'linear-gradient(160deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
      accent: '#d1d5db',
      particle: 'none',
    };
  }
  // Clear
  if (code === 800) {
    return {
      name: 'clear',
      gradient: 'linear-gradient(160deg, #0369a1 0%, #0ea5e9 50%, #38bdf8 100%)',
      accent: '#fbbf24',
      particle: 'none',
    };
  }
  // Clouds
  if (code > 800 && code < 900) {
    const cloudiness = code - 800;
    if (cloudiness <= 2) {
      return {
        name: 'partly-cloudy',
        gradient: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)',
        accent: '#fbbf24',
        particle: 'none',
      };
    }
    return {
      name: 'cloudy',
      gradient: 'linear-gradient(160deg, #1e293b 0%, #334155 50%, #475569 100%)',
      accent: '#94a3b8',
      particle: 'none',
    };
  }
  // Default
  return {
    name: 'default',
    gradient: 'linear-gradient(160deg, #1e3a5f 0%, #0369a1 100%)',
    accent: '#38bdf8',
    particle: 'none',
  };
};

// AQI index to label/color
export const getAQIInfo = (aqi) => {
  const levels = [
    { label: 'Good',      class: 'aqi-good',      emoji: '😊', desc: 'Air quality is excellent.' },
    { label: 'Fair',      class: 'aqi-fair',      emoji: '🙂', desc: 'Air quality is acceptable.' },
    { label: 'Moderate',  class: 'aqi-moderate',  emoji: '😐', desc: 'Sensitive groups may be affected.' },
    { label: 'Poor',      class: 'aqi-poor',      emoji: '😷', desc: 'Everyone may be affected.' },
    { label: 'Very Poor', class: 'aqi-very-poor', emoji: '⚠️', desc: 'Health warnings for everyone.' },
  ];
  return levels[Math.min(aqi - 1, 4)] || levels[0];
};

// UV index severity
export const getUVInfo = (uvi) => {
  if (uvi < 3)  return { label: 'Low',       color: 'text-green-400'  };
  if (uvi < 6)  return { label: 'Moderate',  color: 'text-yellow-400' };
  if (uvi < 8)  return { label: 'High',      color: 'text-orange-400' };
  if (uvi < 11) return { label: 'Very High', color: 'text-red-400'    };
  return              { label: 'Extreme',   color: 'text-purple-400' };
};

// Wind direction degrees → compass
export const getWindDirection = (deg) => {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
};

// Check if it's night based on timestamp, sunrise, sunset
export const isNightTime = (dt, sunrise, sunset) => {
  return dt < sunrise || dt > sunset;
};

// OWM icon URL (high res)
export const getIconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@4x.png`;
