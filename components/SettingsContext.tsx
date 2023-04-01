import React from 'react';
import { createContext, PropsWithChildren } from 'react';
import usePersistedState from './usePersistedState';

type Settings = {
  showTemp: boolean;
  setShowTemp: (value: boolean) => void;
  showFeelsLike: boolean;
  setShowFeelsLike: (value: boolean) => void;
  showPop: boolean;
  setShowPop: (value: boolean) => void;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  darkMode: boolean | "inherit";
  setDarkMode: (value: boolean | "inherit") => void;
}

export const DefaultSettings: Settings = {
  showTemp: true,
  setShowTemp: () => {},
  showFeelsLike: true,
  setShowFeelsLike: () => {},
  showPop: true,
  setShowPop: () => {},
  showLabels: true,
  setShowLabels: () => {},
  darkMode: "inherit",
  setDarkMode: () => {},
}

export const SettingsContext = createContext(DefaultSettings);

export const SettingsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [showTemp, setShowTemp] = usePersistedState<boolean>("settings.temp", DefaultSettings.showTemp);
  const [showFeelsLike, setShowFeelsLike] = usePersistedState<boolean>("settings.feelsLike", DefaultSettings.showFeelsLike);
  const [showPop, setShowPop] = usePersistedState<boolean>("settings.percip", DefaultSettings.showPop);
  const [showLabels, setShowLabels] = usePersistedState<boolean>("settings.labels", DefaultSettings.showLabels);
  const [darkMode, setDarkMode] = usePersistedState<boolean | "inherit">("settings.darkMode", DefaultSettings.darkMode);

  return (
    <SettingsContext.Provider
      value={{
        showTemp,
        setShowTemp,
        showFeelsLike,
        setShowFeelsLike,
        showPop,
        setShowPop,
        showLabels,
        setShowLabels,
        darkMode,
        setDarkMode
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}