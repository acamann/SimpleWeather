import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { HourlyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { Defs, G, LinearGradient, Path, Stop, Text } from "react-native-svg";
import { useColorSchemePalette } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { formatPercent, formatTemp, formatTime } from '../utils/common';
import { SettingsContext } from './SettingsContext';

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

  const {
    showTemp,
    showFeelsLike,
    showPop,
    showLabels,
    darkMode
  } = useContext(SettingsContext);

  const { colors } = useColorSchemePalette(darkMode);

  const width = Dimensions.get("window").width - 16;
  const height = 180;

  const forecastData: ForecastData[] = hourly.map(hour => ({
    date: new Date(hour.dt * 1000),
    feels_like: hour.feels_like,
    temp: hour.temp,
    pop: hour.pop,
    rain: hour.rain?.['1h'] ?? 0
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
  // const popLabels: Label[] = [];

  // if (highPrecip.pop > 0) {
  //   popLabels.push({
  //     x: scaleDate(highPrecip.date),
  //     y: scalePercentage(highPrecip.pop) - 5,
  //     text: formatPercent(highPrecip.pop)
  //   })
  // }

  // if (lowPrecip.pop > 0) {
  //   popLabels.push({
  //     x: scaleDate(lowPrecip.date),
  //     y: scalePercentage(lowPrecip.pop) - 10,
  //     text: formatPercent(lowPrecip.pop)
  //   })
  // }

  // // RAIN volume

  // const rainDesc = [...forecastData].sort((a, b) => b.rain - a.rain);
  // const minRain = rainDesc[rainDesc.length - 1];
  // const maxRain = rainDesc[0];

  // const scaleRain = d3scale.scaleLinear()
  // .domain([minRain.rain, maxRain.rain])
  // .range([height - 24, 12]);

  // const rainPath = d3shape.line(
  //   (d: ForecastData) => scaleDate(d.date),
  //   (d: ForecastData) => scaleRain(d.rain))
  //   .curve(d3shape.curveBumpX)
  // (forecastData);

  // const rainLabels: Label[] = [];
  // if (maxRain.rain > 0) {
  //   rainLabels.push({
  //     x: scaleDate(maxRain.date),
  //     y: scaleRain(maxRain.rain) - 5,
  //     text: `${maxRain.rain}`
  //   })
  // }

  // if (minRain.rain > 0) {
  //   rainLabels.push({
  //     x: scaleDate(minRain.date),
  //     y: scaleRain(minRain.rain) - 10,
  //     text: `${minRain.rain}`
  //   })
  // }

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700', marginBottom: 8 }}>
        Today
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
          { (showLabels) && tempLabels.map((label, index) => (
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
          {/* { popLabels.map((label, index) => (
            <Text
              key={index}
              x={label.x}
              y={label.y}
              fontSize={10}
              textAnchor="middle"
              fill={colors.rain}
            >
              {label.text}
            </Text>
          ))} */}
          {/* { (rainPath && rainLabels.length > 0) ? (
            <Path
              d={rainPath}
              stroke="#3a7ca5"
              fill="none"
              strokeOpacity={0.6}
            />
          ) : undefined }
          { rainLabels.map((label, index) => (
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
          ))} */}
        </G>
      </Svg>
      <View style={{ width: width, position: "relative", height: 40, marginLeft: -8 }}>
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