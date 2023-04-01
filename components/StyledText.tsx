import React, { useContext } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useColorSchemePalette } from './Colors';
import { SettingsContext } from './SettingsContext';

const StyledText: React.FC<TextProps> = (props: TextProps) => {
  const { darkMode } = useContext(SettingsContext);
  const { colors } = useColorSchemePalette(darkMode);
  return (
    <Text {...props} style={[props.style, { color: colors.onBackground }]}>
      {props.children}
    </Text>
  );
}

export default StyledText;