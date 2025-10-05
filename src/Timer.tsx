"use client";

import { CSSProperties, useEffect } from "react";
import TimerDisplay from "./components/TimerDisplay/TimerDisplay";
import { useTimers, useViewOnly } from "./context/dataHooks";
import TimerManager from "./context/TimerManager";

interface FactionTimerProps {
  factionId: FactionId | "Unknown";
  style?: CSSProperties;
  width?: number;
}

export function StaticFactionTimer({
  factionId,
  style,
  width,
}: FactionTimerProps) {
  const timers = useTimers();
  const factionTimer = timers[factionId] ?? 0;
  return <TimerDisplay time={factionTimer} style={style} width={width} />;
}

export function FactionTimer({ factionId, style }: FactionTimerProps) {
  const timers = useTimers();
  const viewOnly = useViewOnly();

  const factionTimer = timers[factionId] ?? 0;

  useEffect(() => {
    if (viewOnly) {
      return;
    }
    TimerManager.activateTimer(factionId);
    return () => TimerManager.deactivateTimer(factionId);
  }, [factionId, viewOnly]);

  return <TimerDisplay time={factionTimer} style={style} />;
}
