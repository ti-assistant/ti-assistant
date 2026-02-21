import { createContext, ReactNode } from "react";
import { DEFAULT_SETTINGS, Settings } from "../util/settings";
import { Optional } from "../util/types/types";

interface SettingsContextObj {
  settings: Settings;
  updateSetting<T extends keyof Settings>(setting: T, value: Settings[T]): void;
}

type CallbackFn<DataType> = (data: DataType) => void;

interface TimerFns {
  activateTimer: (timer: string) => () => void;
}

interface ModalFns {
  openModal: (content: ReactNode) => void;
  popModal: () => void;
}

export const SettingsContext = createContext<SettingsContextObj>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

const DummyTimerFns = {
  activateTimer: (timer: string) => {
    return () => {};
  },
};

export const TimerContext = createContext<TimerFns>(DummyTimerFns);

const DummyModalFns = {
  openModal: (content: ReactNode) => {},
  popModal: () => {},
};

export const ModalContext = createContext<ModalFns>(DummyModalFns);

export type EmptyFn = () => void;
export type UpdateFn<T> = (data: T) => T;
export type UpdateSource = "CLIENT" | "SERVER";

export interface DatabaseFns {
  initialize: (gameId: string, gameData: StoredGameData) => void;
  listen: (callback: EmptyFn) => EmptyFn;
  reset: EmptyFn;
  getValue: <Type>(path: string) => Optional<Type>;
  setViewOnly: (value: boolean) => void;
  update: (updateFn: UpdateFn<StoredGameData>, source: UpdateSource) => void;
  subscribe: (callbackFn: CallbackFn<any>, path: string) => EmptyFn;

  // Maybe don't need.
  saveTimers: EmptyFn;
}

const DummyDatabaseFns: DatabaseFns = {
  initialize: (_: string, __: StoredGameData) => {},
  listen: () => {
    return () => {};
  },
  reset: () => {},
  getValue: (_: string) => undefined,
  setViewOnly: (_: boolean) => {},
  update: (_: (data: StoredGameData) => StoredGameData, __: UpdateSource) => {},
  saveTimers: () => {},
  subscribe: (callbackFn: CallbackFn<any>, path: string) => {
    return () => {};
  },
};

export const DatabaseFnsContext = createContext<DatabaseFns>(DummyDatabaseFns);
