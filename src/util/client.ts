"use client";

import Cookies from "js-cookie";
import { DEFAULT_SETTINGS, Settings } from "./settings";

export function getSettings() {
  const settings = Cookies.get("settings");

  if (!settings) {
    return DEFAULT_SETTINGS;
  }
  return {
    ...DEFAULT_SETTINGS,
    ...(JSON.parse(settings) as Settings),
  };
}
