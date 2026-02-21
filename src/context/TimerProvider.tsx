"use client";

import { PropsWithChildren, use, useEffect } from "react";
import { DatabaseFnsContext, TimerContext } from "./contexts";

export default function TimerProvider({ children }: PropsWithChildren) {
  const databaseFns = use(DatabaseFnsContext);

  const activeTimers: Set<string> = new Set();
  let lastIncrease: number = Date.now();

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
    const timers = databaseFns.getValue<Timers>("timers");
    if (!timers || timers.paused) {
      return;
    }

    const timeDiffMillis = Date.now() - lastIncrease;
    if (timeDiffMillis / 1000 > 1 && activeTimers.size > 0) {
      lastIncrease = Date.now();
      databaseFns.update(updateTimers, "CLIENT");
    }
  }

  function activateTimer(timer: string) {
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
    databaseFns.saveTimers();
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
