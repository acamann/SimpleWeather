import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { HourlyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path, Text } from "react-native-svg";
import { useColorSchemePalette } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { formatPercent, formatTemp, formatTime } from '../utils/common';

interface HourlyForecastGraphProps {
  hourly: HourlyWeather[];
}

interface ForecastData {
  date: Date;
  feels_like: number;
  temp: number;
  pop: number;
  rain: number;
}

interface Label {
  x: number;
  y: number;
  text: string;
}

const HourlyForecastGraph: React.FC<HourlyForecastGraphProps> = (props: HourlyForecastGraphProps) => {
  const hourly = props.hourly.slice(0, 24);

  const { colors } = useColorSchemePalette();

  const width = Dimensions.get("window").width - 24;
  const height = 140;

  const forecastData: ForecastData[] = hourly.map(hour => ({
    date: new Date(hour.dt * 1000),
    feels_like: hour.feels_like,
    temp: hour.temp,
    pop: hour.pop,
    rain: hour.rain?.['1h'] ?? 0
  }));

  const scaleDate = d3scale.scaleTime()
    .domain([forecastData[0].date, forecastData[forecastData.length - 1].date])
    .range([12, width - 24]);

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

  const scaleTemps = d3scale.scaleLinear()
    .domain([low.degrees, high.degrees])
    .range([height - 24, 12]);

  const scalePercentage = d3scale.scaleLinear().domain([0, 1]).range([height - 24, 12]);

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

  const popPath = d3shape.line(
    (d: ForecastData) => scaleDate(d.date),
    (d: ForecastData) => scalePercentage(d.pop))
    .curve(d3shape.curveBumpX)
  ([
    { date: forecastData[0].date, pop: 0, temp: 0, feels_like: 0, rain: 0 }, // start at 0 to fill area below percentage
    ...forecastData,
    { date: forecastData[forecastData.length - 1].date, pop: 0, temp: 0, feels_like: 0, rain: 0 } // end at 0 to fill area below percentage
  ]);

  const hours = hourly.map((hour, index, allHours) => {
    //const previous = index > 0 ? allHours[index - 1] : undefined;
    const hourDate = new Date(hour.dt * 1000);
    return {
      x: scaleDate(hourDate),
      label: index % 3 === 1 ? formatTime(hourDate) : undefined,
      weather: index % 3 === 1 ? hour.weather[0] : undefined // or hour.weather[0].id !== previous?.weather[0].id
    }
  });

  // Temperature Labels
  const tempLabels = [
    {
      x: scaleDate(high.date),
      y: scaleTemps(high.degrees) - 5,
      text: formatTemp(high.degrees)
    },
    {
      x: scaleDate(low.date),
      y: scaleTemps(low.degrees) + 10,
      text: formatTemp(low.degrees)
    }
  ];

  // Precipitation labels
  const forecastSortedPrecip = [...forecastData].sort((a, b) => b.pop - a.pop);
  const popLabels: Label[] = [];

  const highPrecip = forecastSortedPrecip[0];
  if (highPrecip.pop > 0) {
    popLabels.push({
      x: scaleDate(highPrecip.date),
      y: scalePercentage(highPrecip.pop) - 5,
      text: formatPercent(highPrecip.pop)
    })
  }

  const lowPrecip = forecastSortedPrecip[forecastSortedPrecip.length - 1];
  if (lowPrecip.pop > 0) {
    popLabels.push({
      x: scaleDate(lowPrecip.date),
      y: scalePercentage(lowPrecip.pop) - 10,
      text: formatPercent(lowPrecip.pop)
    })
  }

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700', marginBottom: 16 }}>
        Today
      </StyledText>
      <Svg width={width} height={height}>
        <G x={0} y={0}>
          { temperaturePath ? (
            <Path
              d={temperaturePath}
              stroke={colors.onBackground}
              fill="none"
            />
          ) : undefined }
          { tempLabels.map((label, index) => (
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
          { feelsLikePath ? (
            <Path
              d={feelsLikePath}
              stroke={colors.onBackground}
              opacity={0.4}
              fill="none"
            />
            ) : undefined }
          { (popPath && popLabels.length > 0) ? (
            <Path
              d={popPath}
              stroke="#2f6690"
              fill="#3a7ca5"
              fillOpacity={0.1}
              strokeOpacity={0.5}
            />
            ) : undefined }
            { popLabels.map((label, index) => (
            <Text
              key={index}
              x={label.x}
              y={label.y}
              fontSize={10}
              textAnchor="middle"
              fill="#2f6690"
            >
              {label.text}
            </Text>
            ))}
        </G>
      </Svg>
      <View style={{ position: "relative", height: 40 }}>
        {hours.map((hour, index) => (
          <View key={index} style={{ position: "absolute", left: hour.x - 18, width: 36, display: "flex", alignItems: "center" }}>
            <StyledText style={{ fontSize: 10 }}>
              {hour.label}
            </StyledText>
            <WeatherIcon conditionId={hour.weather?.id} style={{ width: 24, height: 24 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default HourlyForecastGraph;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});