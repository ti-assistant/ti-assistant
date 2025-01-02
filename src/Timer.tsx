"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import TimerDisplay from "./components/TimerDisplay/TimerDisplay";
import { useGameId, useGameState, useTimers } from "./context/dataHooks";
import { useSharedTimer } from "./data/SharedTimer";
import { saveFactionTimer, updateLocalFactionTimer } from "./util/api/timers";
import { useInterval } from "./util/client";

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
  const gameId = useGameId();
  const timers = useTimers();
  const [factionTimer, setFactionTimer] = useState(timers[factionId] ?? 0);
  const prevFaction = useRef<string>();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  useEffect(() => {
    return () => {
      if (!gameId || factionId === "Unknown") {
        return;
      }
      if (
        prevFaction.current == factionId &&
        lastUpdate.current < timerRef.current
      ) {
        lastUpdate.current = timerRef.current;
        saveFactionTimer(gameId, factionId, timerRef.current);
      }
    };
  }, [factionId, gameId]);

  const localFactionTimer = timers[factionId] ?? 0;

  useEffect(() => {
    if (
      (localFactionTimer && localFactionTimer > timerRef.current) ||
      factionId !== prevFaction.current
    ) {
      prevFaction.current = factionId;
      timerRef.current = localFactionTimer ?? 0;
      lastUpdate.current = localFactionTimer ?? 0;
      setFactionTimer(localFactionTimer ?? 0);
    }
  }, [localFactionTimer, factionId, factionTimer]);

  return <TimerDisplay time={factionTimer} style={style} width={width} />;
}

export function FactionTimer({ factionId, style }: FactionTimerProps) {
  const gameId = useGameId();
  const state = useGameState();
  const timers = useTimers();

  const [factionTimer, setFactionTimer] = useState(timers[factionId] ?? 0);
  const prevFaction = useRef<string>();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const { addSubscriber, removeSubscriber } = useSharedTimer();

  useEffect(() => {
    return () => {
      if (!gameId || factionId === "Unknown") {
        return;
      }
      if (
        prevFaction.current == factionId &&
        lastUpdate.current < timerRef.current
      ) {
        lastUpdate.current = timerRef.current;
        saveFactionTimer(gameId, factionId, timerRef.current);
      }
    };
  }, [factionId, gameId]);

  useInterval(() => {
    if (!gameId || factionId === "Unknown") {
      return;
    }
    if (prevFaction.current == factionId && lastUpdate.current < factionTimer) {
      lastUpdate.current = factionTimer;
      saveFactionTimer(gameId, factionId, factionTimer);
    }
  }, 5000);

  const paused = state?.paused;

  const updateTime = useCallback(() => {
    if (paused || !gameId || factionId === "Unknown") {
      return;
    }

    timerRef.current += 1;
    updateLocalFactionTimer(gameId, factionId, timerRef.current);
    setFactionTimer(timerRef.current);
  }, [paused, gameId, factionId]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  const localFactionTimer = (timers ?? {})[factionId];

  useEffect(() => {
    if (
      (localFactionTimer && localFactionTimer > timerRef.current) ||
      factionId !== prevFaction.current
    ) {
      prevFaction.current = factionId;
      timerRef.current = localFactionTimer ?? 0;
      lastUpdate.current = localFactionTimer ?? 0;
      setFactionTimer(localFactionTimer ?? 0);
    }
  }, [localFactionTimer, factionId, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}
