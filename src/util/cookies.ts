"use client";

import { useState } from "react";
import { getSettings, Settings, updateSetting } from "./api/util";
import { useBetween } from "use-between";

type SettingsKey = keyof Settings;
type SettingsVal = Settings[SettingsKey];

type SettingUpdater = [SettingsVal, (value: SettingsVal) => void];

export function useSetting(key: keyof Settings): SettingUpdater {
  const [setting, setSetting] = useState<SettingsVal>(getSettings()[key]);

  return [
    setting,
    (value: SettingsVal) => {
      updateSetting(key, value);
      setSetting(value);
      console.log("Updated to ", value);
    },
  ];
}

export const useSharedSetting = (key: keyof Settings) =>
  useBetween(() => useSetting(key));
