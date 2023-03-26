import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DailyWeather, FiveDayWeatherResponse, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { Defs, G, LinearGradient, Path, Stop, Text } from "react-native-svg";
import { useColorSchemePalette } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { getDayOfWeek } from '../utils/common';

interface FiveDayForecastGraphProps {
  data: FiveDayWeatherResponse;
  showPop: boolean;
  showFeelsLike: boolean;
  showTemp: boolean;
  showLabels: boolean;
}

interface ForecastData {
  date: Date;
  feels_like: number;
  temp: number;
  pop: number;
  rain: number;
}

const FiveDayForecastGraph: React.FC<FiveDayForecastGraphProps> = ({
  data,
  showPop,
  showFeelsLike,
  showTemp,
  showLabels
}) => {
  const { colors } = useColorSchemePalette();

  const width = Dimensions.get("window").width - 16;
  const height = 180;

  const forecastData: ForecastData[] = data.list.map(datum => ({
    date: new Date(datum.dt * 1000),
    feels_like: datum.main.feels_like,
    temp: datum.main.temp,
    pop: datum.pop,
    rain: datum.rain?.['3h'] ?? 0
  }));

  const scaleDate = d3scale.scaleTime()
    .domain([forecastData[0].date, forecastData[forecastData.length - 1].date])
    .range([12, width - 8]);

  const feelsLikeDesc = [...forecastData].sort((a, b) => b.feels_like - a.feels_like);
  const minFeelsLike = feelsLikeDesc[feelsLikeDesc.length - 1];
  const maxFeelsLike = feelsLikeDesc[0];

  const tempDesc = [...forecastData].sort((a, b) => b.temp - a.temp);
  const minTemp = tempDesc[tempDesc.length - 1];
  const maxTemp = tempDesc[0];

  const low = {
    date: minFeelsLike.feels_like < minTemp.temp ? minFeelsLike.date : minTemp.date,
    degrees: minFeelsLike.feels_like < minTemp.temp ? minFeelsLike.feels_like : minTemp.temp
  };
  const high = {
    date: maxFeelsLike.feels_like > maxTemp.temp ? maxFeelsLike.date : maxTemp.date,
    degrees: maxFeelsLike.feels_like > maxTemp.temp ? maxFeelsLike.feels_like : maxTemp.temp
  }

  const forecastSortedPrecip = [...forecastData].sort((a, b) => b.pop - a.pop);
  const lowPrecip = forecastSortedPrecip[forecastSortedPrecip.length - 1];
  const highPrecip = forecastSortedPrecip[0];

  const hasChanceOfPrecip = highPrecip.pop > 0;

  const scaleTemps = d3scale.scaleLinear()
    .domain([low.degrees, high.degrees])
    .range([height - 24, hasChanceOfPrecip ? 36 : 12]);

  const scalePercentage = d3scale.scaleLinear()
    .domain([0, 1])
    .range([height, 12]);

  const temperaturePath = d3shape.line(
      (d: ForecastData) => scaleDate(d.date),
      (d: ForecastData) => scaleTemps(d.temp))
    .curve(d3shape.curveBumpX)
    (forecastData);

  const feelsLikePath = d3shape.line(
      (d: ForecastData) => scaleDate(d.date),
      (d: ForecastData) => scaleTemps(d.feels_like))
    .curve(d3shape.curveBumpX)
    (forecastData);

  const popFillPath = d3shape.line(
    (d: ForecastData) => scaleDate(d.date),
    (d: ForecastData) => scalePercentage(d.pop))
    .curve(d3shape.curveBumpX)
  ([
    { date: forecastData[0].date, pop: 0, temp: 0, feels_like: 0, rain: 0 }, // start at 0 to fill area below percentage
    ...forecastData,
    { date: forecastData[forecastData.length - 1].date, pop: 0, temp: 0, feels_like: 0, rain: 0 } // end at 0 to fill area below percentage
  ]);

  const popLinePath = d3shape.line(
    (d: ForecastData) => scaleDate(d.date),
    (d: ForecastData) => scalePercentage(d.pop))
    .curve(d3shape.curveBumpX)
  (forecastData);

  const days = data.list.filter(datum => {
    const date = new Date(datum.dt * 1000);
    const hour = date.getHours();
    return hour > 10 && hour < 14;
  }).map(datum => {
    const date = new Date(datum.dt * 1000);
    return {
      x: scaleDate(date),
      date: date,
      label: getDayOfWeek(date)[0],
      weather: datum.weather[0]
    }
  });

  const tempLabels = days.flatMap(day => {
    const sortedTempsForDay = data.list.filter(datum => new Date(datum.dt * 1000).getDate() === day.date.getDate()).sort((a, b) => a.main.temp - b.main.temp);
    const high = sortedTempsForDay[0];
    const low = sortedTempsForDay[sortedTempsForDay.length - 1];
    return [
      {
        x: scaleDate(new Date(high.dt * 1000)),
        y: scaleTemps(high.main.temp),
        text: `${Math.round(high.main.temp)}`
      },
      {
        x: scaleDate(new Date(low.dt * 1000)),
        y: scaleTemps(low.main.temp),
        text: `${Math.round(low.main.temp)}`
      },
    ]
  });

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700', marginBottom: 8 }}>
        This Week
      </StyledText>
      <Svg width={width} height={height} style={{ marginLeft: -8 }}>
        <Defs>
          <LinearGradient
            id="precipitationGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={colors.rain}
              stopOpacity="0.9"
            />
            <Stop
              offset="90%"
              stopColor={colors.rain}
              stopOpacity="0.2"
            />
            <Stop
              offset="100%"
              stopColor={colors.rain}
              stopOpacity="0"
            />
          </LinearGradient>
        </Defs>
        <G x={0} y={0}>
          { showTemp && temperaturePath ? (
            <Path
              d={temperaturePath}
              stroke={colors.onBackground}
              fill="none"
            />
          ) : undefined }
          { (showTemp && showLabels) && tempLabels.map((label, index) => (
            <Text
              key={index}
              x={label.x}
              y={label.y}
              fontSize={10}
              textAnchor="middle"
              fill={colors.onBackground}
            >
              {label.text}
            </Text>
          ))}
          { showFeelsLike && feelsLikePath ? (
            <Path
              d={feelsLikePath}
              stroke={colors.onBackground}
              opacity={0.4}
              fill="none"
            />
            ) : undefined }
          { (showPop && popFillPath && popLinePath && hasChanceOfPrecip) ? (
            <>
              <Path
                d={popFillPath}
                fill="url(#precipitationGradient)"
                fillOpacity={0.3}
              />
              <Path
                d={popLinePath}
                stroke="url(#precipitationGradient)"
                fill="none"
              />
            </>
          ) : undefined }
        </G>
      </Svg>
      <View style={{ width: width, position: "relative", height: 40, marginLeft: -8 }}>
        {days.map((day, index) => (
          <View key={index} style={{ position: "absolute", left: day.x - 12, width: 24 }}>
            <StyledText style={{ fontSize: 12, textAlign: "center" }}>
              {day.label}
            </StyledText>
            <WeatherIcon conditionId={day.weather.id} style={{ width: 24, height: 24 }} />
          </View>
        ))}
      </View> 
    </View>
  );
}

export default FiveDayForecastGraph;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});