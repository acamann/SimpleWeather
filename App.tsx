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
          {weather.daily.map(day => (
            <View style={styles.forecast} key={day.dt.toString()}>
              <View style={styles.forecast.day}>
                {formatDateFromUnix(day.dt)}
              </View>
              <View style={styles.forecast.temp}>
                {formatTemp(day.temp.min)} / {formatTemp(day.temp.max)}
              </View>
              {day.weather.length > 0 ? (
                <>
                  <Text>
                    {day.weather[0].main}
                  </Text>
                  <Image
                    style={styles.smallIcon}
                    source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png` }}
                  />
                </>
              ) : undefined}
            </View>
          ))}
        </>
      ) : undefined }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 72,
  },
  condition: {
    fontSize: 24,
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
    day: {
      flex: 1
    },
    temp: {
      flex: 1
    },
    condition: {
      flex: 1
    }
  },
  smallIcon: {
    width: 24,
    height: 24
  }
});
