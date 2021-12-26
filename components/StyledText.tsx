import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { colors } from './Colors';

const StyledText: React.FC<TextProps> = (props: TextProps) => {
  return (
    <Text {...props} style={[props.style, styles.text]}>
      {props.children}
    </Text>
  );
}

export default StyledText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    color: colors.dark,
  }
});