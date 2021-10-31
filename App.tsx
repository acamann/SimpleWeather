import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';

const formatTemp = (temp: number): string => `${Math.round(temp)} F\u00B0`;
const formatDateFromUnix = (dt: number): string => new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })

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
          <View style={styles.daily}>
            {weather.daily.map(day => (
              <View style={styles.forecast} key={day.dt.toString()}>
                <View style={styles.forecastDay}>
                  {formatDateFromUnix(day.dt)}
                </View>
                <View style={styles.forecastTemp}>
                  {formatTemp(day.temp.min)} / {formatTemp(day.temp.max)}
                </View>
                {day.weather.length > 0 ? (
                  <View style={styles.forecastCondition}>
                    <Text style={styles.forecastConditionName}>
                      {day.weather[0].main}
                    </Text>
                    <Image
                      style={styles.forecastIcon}
                      source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png` }}
                    />
                  </View>
                ) : undefined}
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
  daily: {
    width: '100%',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: 16,
  },
  forecastDay: {
    flex: 1
  },
  forecastTemp: {
    flex: 1
  },
  forecastCondition: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  forecastConditionName: {
    color: colors.light,
  },
  forecastIcon: {
    width: 24,
    height: 24
  }
});
