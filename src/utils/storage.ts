import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

export const mmkvStorage = createMMKV();

export const reduxStorage: Storage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    mmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string): Promise<string | undefined> => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string): Promise<void> => {
    mmkvStorage.remove(key);
    return Promise.resolve();
  },
};
