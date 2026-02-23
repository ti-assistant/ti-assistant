"use client";

import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { DEFAULT_SETTINGS, Settings } from "./settings";
import { Optional } from "./types/types";

export function useInterval(callback: () => void, delay: Optional<number>) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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
