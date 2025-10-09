"use client";

import { PropsWithChildren, useEffect } from "react";
import { TimerContext } from "./contexts";
import { DataStore } from "./dataStore";

export default function TimerProvider({ children }: PropsWithChildren) {
  const activeTimers: Set<string> = new Set();
  let lastIncrease: number = Date.now();
  console.log("Rendering TimerProvider");

  function updateTimers(storedData: StoredGameData) {
    const updatedTimers = structuredClone(storedData.timers ?? {});

    for (const timer of activeTimers) {
      const prevTimer = updatedTimers[timer] ?? 0;
      updatedTimers[timer] = prevTimer + 1;
    }
    storedData.timers = updatedTimers;
    return storedData;
  }

  function tick() {
    const timers = DataStore.getValue<Timers>("timers");
    if (!timers || timers.paused) {
      return;
    }

    const timeDiffMillis = Date.now() - lastIncrease;
    if (timeDiffMillis / 1000 > 1 && activeTimers.size > 0) {
      lastIncrease = Date.now();
      DataStore.update(updateTimers, "CLIENT");
    }
  }

  function activateTimer(timer: string) {
    console.log("Timer Activeate", timer);
    activeTimers.add(timer);
    return () => {
      activeTimers.delete(timer);
    };
  }

  function saveTimers() {
    // Don't update if we haven't updated the timers in over 20 seconds.
    const timeDiffMillis = Date.now() - lastIncrease;
    if (timeDiffMillis / 1000 > 20) {
      return;
    }
    DataStore.saveTimers();
  }

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];
    timeoutIds.push(setInterval(tick, 100));

    timeoutIds.push(setInterval(saveTimers, 15000));
    return () => {
      for (const timeoutId of timeoutIds) {
        clearInterval(timeoutId);
      }
    };
  }, []);

  return (
    <TimerContext.Provider value={{ activateTimer }}>
      {children}
    </TimerContext.Provider>
  );
}
