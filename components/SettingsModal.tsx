import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { Button, Modal, Switch, useColorScheme, View } from "react-native";
import { useColorSchemePalette } from "./Colors";
import { SettingsContext } from "./SettingsContext";
import StyledText from "./StyledText";

type Props = {
  show: boolean;
  onClose: () => void;
}

const SettingsModal = ({
  show,
  onClose
}: Props) => {

  const {
    showTemp, setShowTemp,
    showFeelsLike, setShowFeelsLike,
    showPop, setShowPop,
    showLabels, setShowLabels,
    darkMode, setDarkMode
  } = useContext(SettingsContext);

  const { colors } = useColorSchemePalette(darkMode);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={show}
      onRequestClose={onClose}
    >
      <View style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
        <View style={{ width: 200, backgroundColor: colors.back, borderColor: colors.onBackground, borderStyle: "solid", borderWidth: 1, borderRadius: 8, padding: 16, opacity: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <WeatherIcon conditionId={302} width={30} /> */}
              <StyledText>Precipitation</StyledText>
            </View>
            <Switch
              onValueChange={(value) => setShowPop(value)}
              value={showPop}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StyledText>Temperature</StyledText>
            </View>
            <Switch
              onValueChange={(value) => setShowTemp(value)}
              value={showTemp}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StyledText>Feels Like</StyledText>
            </View>
            <Switch
              onValueChange={(value) => setShowFeelsLike(value)}
              value={showFeelsLike}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <StyledText>Labels</StyledText>
            </View>
            <Switch
              onValueChange={(value) => setShowLabels(value)}
              value={showLabels}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8 }}>
            <Picker
              selectedValue={darkMode === "inherit" ? "inherit" : darkMode ? "dark" : "light"}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue === "inherit") {
                  setDarkMode("inherit");
                } else {
                  setDarkMode(itemValue === "dark");
                }
              }}>
              <Picker.Item label="Use Device Theme" value="inherit" />
              <Picker.Item label="Light Mode" value="light" />
              <Picker.Item label="Dark Mode" value="dark" />
            </Picker>
          </View>
          <View style={{ marginTop: 8, alignItems: "center" }}>
            <Button
              onPress={onClose}
              title="Done"
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default SettingsModal;