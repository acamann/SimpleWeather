import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DailyWeather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path } from "react-native-svg";
import { colors } from './Colors';
import StyledText from './StyledText';

interface DailyForecastProps {
  daily: DailyWeather[];
}

const DailyForecastGraph: React.FC<DailyForecastProps> = (props: DailyForecastProps) => {
  const daily = props.daily;

  const [line, setLine] = React.useState<string | null>(null);
  const [width, setWidth] = React.useState<number>(0);
  const height = 80;

  const forecastData = daily.flatMap(day => {
    const dayDate = new Date(day.dt * 1000);
    return [
      {
        date: new Date(dayDate.setHours(5)),
        value: day.temp.morn,
      },
      {
        date: new Date(dayDate.setHours(11)),
        value: day.temp.day,
      },
      {
        date: new Date(dayDate.setHours(17)),
        value: day.temp.eve,
      },
      {
        date: new Date(dayDate.setHours(23)),
        value: day.temp.night,
      }
    ];
  });

  React.useEffect(() => {
    const scaleX = d3scale.scaleTime()
      .domain([forecastData[0].date, forecastData[forecastData.length - 1].date])
      .range([0, width]);

    const temperatures = forecastData.map(t => t.value);
    const scaleY = d3scale.scaleLinear()
      .domain([Math.min(...temperatures), Math.max(...temperatures)])
      .range([height, 0]);

    setLine(d3shape.line(
        (d: { date: Date, value: number }) => scaleX(d.date),
        (d: { date: Date, value: number }) => scaleY(d.value))
      .curve(d3shape.curveBumpX)
      (forecastData));
  }, [forecastData]);

  return (
    <View style={styles.wrapper} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <StyledText style={{ fontWeight: '700' }}>
        This Week
      </StyledText>
      { (width > 0) ? (
        <Svg width={width} height={height}>
          <G x={0} y={0}>
            { line ? <Path d={line} stroke={colors.light} fill="none" /> : undefined }
          </G>
        </Svg>
      ) : undefined}
    </View>
  );
}

export default DailyForecastGraph;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});