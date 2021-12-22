import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Pressable } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';
import { colors } from './components/Colors';
import CurrentWeatherView from './components/CurrentWeatherView';
import DailyForecast from './components/DailyForecast';
import DailyForecastGraph from './components/DailyForecastGraph';
import HourlyForecast from './components/HourlyForecast';


type Focus = "none" | "current" | "hourly" | "daily";

export default function App() {
  const [location, setLocation] = useState<Geolocation.GeoPosition>();
  const [weather, setWeather] = useState<OneCallWeatherResponse>();

  const [focus, setFocus] = useState<Focus>("none");

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
      },
      (error) => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(undefined);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  }, [])

  useEffect(() => {
    if (location?.coords.latitude && location?.coords.longitude) {
      getCurrentWeather({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        onSuccess: (weather): void => setWeather(weather),
        onFailure: (error): void => Alert.alert("Failed to retrieve weather", JSON.stringify(error)),
      });
    }
  }, [location]);

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
          <Pressable onPress={(): void => setFocus("daily")} style={{ width: "100%" }}>
            <DailyForecastGraph daily={weather.daily} />
          </Pressable>
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
      ) : focus === "daily" ? (
        <Pressable onPress={(): void => setFocus("none")} style={{ width: "100%" }}>
          <DailyForecast daily={weather.daily} />
        </Pressable>
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
