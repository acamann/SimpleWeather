import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert, Pressable, ScrollView, RefreshControl, Switch, View, Modal, Button, useColorScheme } from 'react-native';
import { FiveDayWeatherResponse, OneCallWeatherResponse } from './api/models';
import { getCurrentWeather, getDailyWeather } from './api/OpenWeatherMap';
import { getNearestCity } from './api/ReverseGeocoding';
import { useColorSchemePalette } from './components/Colors';
import CurrentWeatherView from './components/CurrentWeatherView';
import DailyForecast from './components/DailyForecast';
import DailyForecastGraph from './components/DailyForecastGraph';
import HourlyForecast from './components/HourlyForecast';
import * as Location from 'expo-location';
import HourlyForecastGraph from './components/HourlyForecastGraph';
import FiveDayForecastGraph from './components/FiveDayForecastGraph';
import StyledText from './components/StyledText';
import WeatherIcon from './components/WeatherIcon';
import usePersistedState from './components/usePersistedState';
import { Picker } from '@react-native-picker/picker';
import { DefaultSettings, SettingsContext, SettingsProvider } from './components/SettingsContext';
import SettingsModal from './components/SettingsModal';

type Focus = "none" | "current" | "hourly" | "daily";

const SimpleWeather = () => {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();
  const [fiveDayWeather, setFiveDayWeather] = useState<FiveDayWeatherResponse>();
  const [nearestCity, setNearestCity] = useState<string>();
  const [refreshing, setRefreshing] = React.useState(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [focus, setFocus] = useState<Focus>("none");

  const { darkMode } = useContext(SettingsContext);
  const { colors } = useColorSchemePalette(darkMode);

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: colors.back,
      color: colors.onBackground,
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  });

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
    getDailyWeather({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      onSuccess: (weather): void => {
        setRefreshing(false);
        setFiveDayWeather(weather);
      },
      onFailure: (error): void => {
        setRefreshing(false);
        Alert.alert("Failed to retrieve weather", JSON.stringify(error));
      },
    })
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
              minutely={weather.minutely ?? []}
              nearestCity={nearestCity}
              onPress={(): void => setFocus("current")}
            />
            <Pressable onPress={(): void => setFocus("hourly")} style={{ width: "100%" }}>
              <HourlyForecastGraph hourly={weather.hourly} />
            </Pressable>
            <Pressable onPress={(): void => setFocus("daily")} style={{ width: "100%" }}>
              { fiveDayWeather ? (
                <FiveDayForecastGraph
                  data={fiveDayWeather}
                />
              ) : (
                <ActivityIndicator size="large" style={{ flex: 1 }} />
              )}
            </Pressable>
            <Button
              onPress={(): void => setShowSettings(!showSettings)}
              title="Settings"
            />
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
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
        <StatusBar style="auto" />
      </ScrollView>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <SimpleWeather />
    </SettingsProvider>
  )
}