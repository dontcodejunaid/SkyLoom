// Temperature conversion
export const toF = (c) => Math.round(c * 9 / 5 + 32);
export const toC = (f) => Math.round((f - 32) * 5 / 9);
export const formatTemp = (val, unit) => `${unit === 'C' ? Math.round(val) : toF(val)}°${unit}`;

// Date & time formatters
export const formatDay = (dt) =>
  new Date(dt * 1000).toLocaleDateString('en', { weekday: 'short' });

export const formatFullDate = (dt) =>
  new Date(dt * 1000).toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

export const formatTime = (dt) =>
  new Date(dt * 1000).toLocaleTimeString('en', {
    hour: '2-digit', minute: '2-digit',
  });

export const formatHour = (dt) =>
  new Date(dt * 1000).toLocaleTimeString('en', { hour: 'numeric', hour12: true });

// Sunrise/Sunset progress (0–1)
export const getSunProgress = (now, sunrise, sunset) => {
  if (now <= sunrise) return 0;
  if (now >= sunset)  return 1;
  return (now - sunrise) / (sunset - sunrise);
};

// Format duration
export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

// Capitalize description
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Visibility: meters → km
export const formatVisibility = (m) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
