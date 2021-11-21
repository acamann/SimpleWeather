import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';
import { colors } from './components/Colors';
import CurrentWeatherView from './components/CurrentWeatherView';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';

type Focus = "none" | "current" | "hourly";

export default function App() {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();

  const [focus, setFocus] = useState<Focus>("none");

  useEffect(() => {
    getCurrentWeather({
      onSuccess: (weather): void => setWeather(weather),
      onFailure: (error): void => console.log(["It didn't work!", error]),
    })
  }, []);

  return (
    <View style={styles.container}>
      { !weather ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : focus === "none" ? (
        <>
          <CurrentWeatherView
            current={weather.current}
            minutely={weather.minutely}
            onPress={(): void => setFocus("current")}
          />
          <HourlyForecast
            hourly={weather.hourly}
            hoursToShow={8}
            onPress={(): void => setFocus("hourly")}
          />
          <DailyForecast daily={weather.daily} />
        </>
      ) : focus === "current" ? (
        <>
          <CurrentWeatherView
            current={weather.current}
            minutely={weather.minutely}
            onPress={(): void => setFocus("none")}
            fullScreenDetails
          />
        </>
      ) : focus === "hourly" ? (
        <HourlyForecast
          hourly={weather.hourly}
          hoursToShow={24}
          onPress={(): void => setFocus("none")}
        />
      ) : undefined }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: colors.back,
    color: colors.dark,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
