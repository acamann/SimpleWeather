import { useEffect, useMemo, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Return<T> = [T, React.Dispatch<React.SetStateAction<T>>];

function usePersistedState<T>(uniqueKey: string, defaultValue: T): Return<T> {
  const STORAGE_KEY = `@${uniqueKey}`;

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const asyncWrap = async () => {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
      return storedValue;
    }
    asyncWrap().then((storedValue) => {
      console.log("asyncWrap ran:", storedValue)
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue) as T);
      };
    })
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value)).then(() => {
        console.log(" > ASYNC STORAGE UPDATED ->", value)
      });
    }
  }, [value]);

  return [value, setValue];
}

export default usePersistedState;