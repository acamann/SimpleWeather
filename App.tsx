import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';

const formatTemp = (temp: number): string => `${Math.round(temp)} F\u00B0`;

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
          {weather.current.weather.map(w => (
            <View key={w.id}>
              {/* <Text>{w.description}</Text> */}
              <Image
                style={styles.icon}
                source={{ uri: `http://openweathermap.org/img/wn/${w.icon}@2x.png` }}
              />
            </View>
          ))}
          {weather.daily.map(day => (
            <View key={day.dt.toString()}>
              <Text>{new Date(day.dt).toLocaleDateString()}</Text>
              <Text>{formatTemp(day.temp.min)} / {formatTemp(day.temp.max)}</Text>
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
  icon: {
    width: 80,
    height: 80
  },
  temp: {
    fontSize: 24,
    fontWeight: "bold"
  }
});
