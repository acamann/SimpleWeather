import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useColorSchemePalette } from './Colors';

const StyledText: React.FC<TextProps> = (props: TextProps) => {
  const { colors } = useColorSchemePalette();
  return (
    <Text {...props} style={[props.style, { color: colors.onBackground }]}>
      {props.children}
    </Text>
  );
}

export default StyledText;