import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';
import WeatherCondition from './components/WeatherCondition';

const formatTemp = (temp: number): string => `${Math.round(temp)} \u00B0F`;
const formatDateFromUnix = (dt: number): string => new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })
const formatTimeFromUnix = (dt: number): string => new Date(dt * 1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });

export default function App() {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();

  useEffect(() => {
    getCurrentWeather({
      onSuccess: (weather): void => setWeather(weather),
      onFailure: (error): void => console.log(["It didn't work!", error]),
    })
  }, [])

  return (
    <View style={styles.container}>
      { weather ? (
        <>
          <View style={styles.current}>
            <Text style={styles.temp}>{formatTemp(weather.current.temp)}</Text>
            { weather.current.weather.length > 0 ? (
              <>
                <Text style={styles.condition}>
                  {weather.current.weather[0].description}
                </Text>
                <Image
                  style={styles.icon}
                  source={{ uri: `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png` }}
                />
              </>
            ) : undefined}
          </View>
          <View style={styles.forecastWrapper}>
            {weather.hourly.slice(0, 10).map(hour => (
              <View style={styles.forecast} key={hour.dt.toString()}>
                <Text style={styles.forecastDateTime}>
                  {formatTimeFromUnix(hour.dt)}
                </Text>
                <Text style={styles.forecastTemp}>
                  {formatTemp(hour.temp)}
                </Text>
                <Text style={styles.forecastTemp}>
                  {hour.pop > 0 ? `${hour.pop*100}%` : undefined}
                </Text>
                <WeatherCondition weather={hour.weather} />
              </View>
            ))}
          </View>
          <View style={styles.forecastWrapper}>
            {weather.daily.slice(0, 5).map(day => (
              <View style={styles.forecast} key={day.dt.toString()}>
                <Text style={styles.forecastDateTime}>
                  {formatDateFromUnix(day.dt)}
                </Text>
                <Text style={styles.forecastTemp}>
                  &#8593; {formatTemp(day.temp.max)}
                </Text>
                <Text style={styles.forecastTemp}>
                  &#8595; {formatTemp(day.temp.min)}
                </Text>
                <WeatherCondition weather={day.weather} />
              </View>
            ))}
          </View>
        </>
      ) : undefined }
      <StatusBar style="auto" />
    </View>
  );
}

// colors from https://color.adobe.com/explore;
const colors = {
  accent: '#FAD41B',
  back: '#FAF8EB',
  dark: '#54565B',
  light: '#76777B',
  lighter: '#939598',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.back,
    color: colors.dark,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  current: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastWrapper: {
    width: '100%',
    padding: 8
  },
  temp: {
    fontSize: 72,
    color: colors.dark,
  },
  condition: {
    fontSize: 20,
    color: colors.light,
  },
  icon: {
    width: 100,
    height: 100,
  },
  forecast: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  forecastDateTime: {
    flex: 1
  },
  forecastTemp: {
    //flex: 1
  },
});
