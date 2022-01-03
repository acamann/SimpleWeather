import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert, Pressable, ScrollView, RefreshControl } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';
import { getNearestCity } from './api/ReverseGeocoding';
import { colors } from './components/Colors';
import CurrentWeatherView from './components/CurrentWeatherView';
import DailyForecast from './components/DailyForecast';
import DailyForecastGraph from './components/DailyForecastGraph';
import HourlyForecast from './components/HourlyForecast';
import * as Location from 'expo-location';
import HourlyForecastGraph from './components/HourlyForecastGraph';

type Focus = "none" | "current" | "hourly" | "daily";

export default function App() {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();
  const [nearestCity, setNearestCity] = useState<string>();
  const [refreshing, setRefreshing] = React.useState(false);

  const [focus, setFocus] = useState<Focus>("none");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadWeather();
  }, []);

  const loadWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    getCurrentWeather({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      onSuccess: (weather): void => {
        setRefreshing(false);
        setWeather(weather);
      },
      onFailure: (error): void => {
        setRefreshing(false);
        Alert.alert("Failed to retrieve weather", JSON.stringify(error));
      },
    });
    getNearestCity({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      setCity: (city): void => setNearestCity(city)
    });
  }

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      { !weather ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : focus === "none" ? (
        <>
          <CurrentWeatherView
            current={weather.current}
            minutely={weather.minutely}
            nearestCity={nearestCity}
            onPress={(): void => setFocus("current")}
          />
          <Pressable onPress={(): void => setFocus("hourly")} style={{ width: "100%" }}>
            <HourlyForecastGraph hourly={weather.hourly} />
          </Pressable>
          <Pressable onPress={(): void => setFocus("daily")} style={{ width: "100%" }}>
            <DailyForecastGraph daily={weather.daily} />
          </Pressable>
        </>
      ) : focus === "current" ? (
        <>
          <CurrentWeatherView
            current={weather.current}
            minutely={weather.minutely}
            nearestCity={nearestCity}
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
    </ScrollView>
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