"use client";

import { useState } from "react";
import { getSettings, Settings, updateSetting } from "./api/util";
import { useBetween } from "use-between";

type SettingsKey = keyof Settings;
type SettingsVal = Settings[SettingsKey];

type SettingUpdater = [SettingsVal, (value: SettingsVal) => void];

function useSettings() {
  const [settings, setSettings] = useState<Settings>(getSettings());

  console.log("Re-rendering!");
  return {
    settings,
    updateSetting: (key: keyof Settings, val: Settings[keyof Settings]) => {
      updateSetting(key, val);
      setSettings((prev) => {
        console.log("Updating");
        return {
          ...prev,
          [key]: val,
        };
      });
    },
  };
}

export const useSharedSettings = () => useBetween(useSettings);
