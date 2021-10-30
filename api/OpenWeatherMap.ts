import { OneCallWeatherResponse } from './models';
import { OPEN_WEATHER_MAP_API_KEY } from 'react-native-dotenv';

const apiKey = OPEN_WEATHER_MAP_API_KEY;
const homeCoordinates = [29.809449, -95.540523];

interface GetCurrentWeatherPayload {
  onSuccess: (weather: OneCallWeatherResponse) => void;
  onFailure: (error: any) => void;
}

export const getCurrentWeather = (payload: GetCurrentWeatherPayload): Promise<void> => {
  const exclude = 'alerts';
  const [lat, lon] = homeCoordinates;
  if (!apiKey) {
    payload.onFailure("API Key not set");
    return Promise.reject();
  }
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((json) => {
      payload.onSuccess(json);
    })
    .catch((error) => {
      payload.onFailure(error);
    });
};