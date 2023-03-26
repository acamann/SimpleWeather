import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert, Pressable, ScrollView, RefreshControl, Switch, View, Modal, Button } from 'react-native';
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

type Focus = "none" | "current" | "hourly" | "daily";

export default function App() {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();
  const [fiveDayWeather, setFiveDayWeather] = useState<FiveDayWeatherResponse>();
  const [nearestCity, setNearestCity] = useState<string>();
  const [refreshing, setRefreshing] = React.useState(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTemp, setShowTemp] = useState<boolean>(true);
  const [showFeelsLike, setShowFeelsLike] = useState<boolean>(true);
  const [showPop, setShowPop] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  const [focus, setFocus] = useState<Focus>("none");

  const { colors } = useColorSchemePalette();

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
            minutely={weather.minutely}
            nearestCity={nearestCity}
            onPress={(): void => setFocus("current")}
          />
          <Button
            onPress={(): void => setShowSettings(!showSettings)}
            title="Settings"
          />
          <Pressable onPress={(): void => setFocus("hourly")} style={{ width: "100%" }}>
            <HourlyForecastGraph hourly={weather.hourly} />
          </Pressable>
          <Pressable onPress={(): void => setFocus("daily")} style={{ width: "100%" }}>
            { fiveDayWeather ? (
              <FiveDayForecastGraph
                data={fiveDayWeather}
                showPop={showPop}
                showTemp={showTemp}
                showFeelsLike={showFeelsLike}
                showLabels={showLabels}
              />
            ) : (
              <ActivityIndicator size="large" style={{ flex: 1 }} />
            )}
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => {
          setShowSettings(!showSettings);
        }}
      >
        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <View style={{ width: "70%", backgroundColor: colors.back, borderColor: colors.onBackground, borderStyle: "solid", borderWidth: 1, borderRadius: 8, padding: 16, opacity: 0.9 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <WeatherIcon conditionId={302} width={30} /> */}
                <StyledText>Show Precipitation</StyledText>
              </View>
              <Switch
                onValueChange={() => setShowPop(prev => !prev)}
                value={showPop}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <StyledText>Show Temperature</StyledText>
              </View>
              <Switch
                onValueChange={() => setShowTemp(prev => !prev)}
                value={showTemp}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <StyledText>Show Feels Like</StyledText>
              </View>
              <Switch
                onValueChange={() => setShowFeelsLike(prev => !prev)}
                value={showFeelsLike}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <StyledText>Show Labels</StyledText>
              </View>
              <Switch
                onValueChange={() => setShowLabels(prev => !prev)}
                value={showLabels}
              />
            </View>
            <View style={{ marginTop: 8 }}>
              <Button
                onPress={() => setShowSettings(!showSettings)}
                title="Done"
              />
            </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </ScrollView>
  );
}