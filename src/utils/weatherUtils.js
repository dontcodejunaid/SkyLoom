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

// Calculate 0–500 US EPA / CPCB standard AQI from PM2.5 pollutant concentration
export const calculateUSAQI = (components) => {
  if (!components) return 35;
  const pm25 = components.pm2_5 || 0;
  const pm10 = components.pm10 || 0;

  // Linear interpolation for PM2.5 AQI breakpoint ranges
  let pm25Aqi = 0;
  if (pm25 <= 12.0) {
    pm25Aqi = Math.round((50 / 12.0) * pm25);
  } else if (pm25 <= 35.4) {
    pm25Aqi = Math.round(51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
  } else if (pm25 <= 55.4) {
    pm25Aqi = Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
  } else if (pm25 <= 150.4) {
    pm25Aqi = Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5));
  } else if (pm25 <= 250.4) {
    pm25Aqi = Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5));
  } else {
    pm25Aqi = Math.round(301 + ((500 - 301) / (500.0 - 250.5)) * (pm25 - 250.5));
  }

  // Linear interpolation for PM10
  let pm10Aqi = 0;
  if (pm10 <= 54) {
    pm10Aqi = Math.round((50 / 54) * pm10);
  } else if (pm10 <= 154) {
    pm10Aqi = Math.round(51 + ((100 - 51) / (154 - 55)) * (pm10 - 55));
  } else if (pm10 <= 254) {
    pm10Aqi = Math.round(101 + ((150 - 101) / (254 - 155)) * (pm10 - 155));
  } else {
    pm10Aqi = Math.round(151 + ((200 - 151) / (354 - 255)) * (pm10 - 255));
  }

  return Math.min(Math.max(pm25Aqi, pm10Aqi), 500);
};

// Map AQI score (0–500) to human readable label & severity info
export const getAQIInfo = (aqiValue) => {
  const score = Number(aqiValue) || 30;

  if (score <= 50) {
    return {
      label: 'Good',
      class: 'aqi-good',
      emoji: '😊',
      desc: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    };
  }
  if (score <= 100) {
    return {
      label: 'Moderate',
      class: 'aqi-fair',
      emoji: '🙂',
      desc: 'Air quality is acceptable. However, sensitive individuals may experience minor symptoms.',
    };
  }
  if (score <= 150) {
    return {
      label: 'Unhealthy (Sensitive)',
      class: 'aqi-moderate',
      emoji: '😐',
      desc: 'Members of sensitive groups may experience health effects.',
    };
  }
  if (score <= 200) {
    return {
      label: 'Unhealthy',
      class: 'aqi-poor',
      emoji: '😷',
      desc: 'Everyone may begin to experience health effects.',
    };
  }
  if (score <= 300) {
    return {
      label: 'Very Unhealthy',
      class: 'aqi-very-poor',
      emoji: '⚠️',
      desc: 'Health alert: everyone may experience more serious health effects.',
    };
  }
  return {
    label: 'Hazardous',
    class: 'aqi-very-poor',
    emoji: '🚨',
    desc: 'Health warning of emergency conditions. The entire population is affected.',
  };
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
