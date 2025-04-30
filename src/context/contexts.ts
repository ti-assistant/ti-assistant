import { createContext } from "react";
import { DEFAULT_SETTINGS, Settings } from "../util/settings";

interface SettingsContextObj {
  settings: Settings;
  updateSetting<T extends keyof Settings>(setting: T, value: Settings[T]): void;
}

export const SettingsContext = createContext<SettingsContextObj>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});
