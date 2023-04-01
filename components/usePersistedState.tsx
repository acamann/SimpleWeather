import { useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Return<T> = [T, React.Dispatch<React.SetStateAction<T>>];

function usePersistedState<T>(uniqueKey: string, defaultValue: T): Return<T> {
  const STORAGE_KEY = `@${uniqueKey}`;

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const getItemAsync = async () => await AsyncStorage.getItem(STORAGE_KEY);
    getItemAsync().then((storedValue) => {
      //console.log("asyncWrap ran:", storedValue)
      if (storedValue !== null) {
        if (storedValue === "__undefined__") {
          setValue(undefined as T);
        } else {
          setValue(JSON.parse(storedValue) as T);
        }
      };
    })
  }, []);

  useEffect(() => {
    const setItemAsync = async () => await AsyncStorage.setItem(STORAGE_KEY, value === undefined ? "__undefined__" : JSON.stringify(value));
    setItemAsync().then(() => {
      //console.log(" > ASYNC STORAGE UPDATED ->", value)
    });
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;