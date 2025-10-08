import { createContext } from "react";
import { DEFAULT_SETTINGS, Settings } from "../util/settings";

interface SettingsContextObj {
  settings: Settings;
  updateSetting<T extends keyof Settings>(setting: T, value: Settings[T]): void;
}

type CallbackFn<DataType> = (data: DataType) => void;

type SubscribeFn = (callback: CallbackFn<any>, path: string) => () => void;

interface TimerFns {
  activateTimer: (timer: string) => () => void;
}

export const SettingsContext = createContext<SettingsContextObj>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

const DummySubscribeFn = (callback: CallbackFn<any>, path: string) => {
  return () => {};
};

export const DataContext = createContext<SubscribeFn>(DummySubscribeFn);

const DummyTimerFns = {
  activateTimer: (timer: string) => {
    return () => {};
  },
};

export const TimerContext = createContext<TimerFns>(DummyTimerFns);
