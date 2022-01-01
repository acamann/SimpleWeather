export const formatTemp = (temp: number): string =>
  `${Math.round(temp)} \u00B0F`;

export const formatDateFromUnix = (dt: number): string => 
  getDayOfWeek(new Date(dt * 1000));

export const getDayOfWeek = (date: Date): string => 
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];

export const formatTimeFromUnix = (dt: number): string =>
  formatTime(new Date(dt * 1000));

export const formatTime = (date: Date): string => {
  let hr = date.getHours();
  if( hr > 12 ) {
    hr -= 12;
  }
  return `${hr} ${hr > 12 ? "PM" : "AM"}`;
}

export const formatPercent = (float: number): string =>
  `${Math.floor(float*100)}%`;