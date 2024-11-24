"use client";

import { useState } from "react";
import { useBetween } from "use-between";
import { getSettings, Settings, updateSetting } from "./api/util";

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
