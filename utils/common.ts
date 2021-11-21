export const formatTemp = (temp: number): string =>
  `${Math.round(temp)} \u00B0F`;

export const formatDateFromUnix = (dt: number): string =>
  new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'short' });

export const formatTimeFromUnix = (dt: number): string =>
  new Date(dt * 1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });

export const formatPercent = (float: number): string =>
  `${Math.floor(float*100)}%`;