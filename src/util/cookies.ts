"use client";

import { useState } from "react";
import { getSettings, Settings, updateSetting } from "./api/util";
import { useBetween } from "use-between";

function useSettings() {
  const [settings, setSettings] = useState<Settings>(getSettings());

  return {
    settings,
    updateSetting: (key: keyof Settings, val: Settings[keyof Settings]) => {
      updateSetting(key, val);
      setSettings((prev) => {
        return {
          ...prev,
          [key]: val,
        };
      });
    },
  };
}

export const useSharedSettings = () => useBetween(useSettings);
