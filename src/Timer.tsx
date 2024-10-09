import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import TimerDisplay from "./components/TimerDisplay/TimerDisplay";
import { GameIdContext } from "./context/Context";
import { useSharedTimer } from "./data/SharedTimer";
import {
  saveAgendaTimer,
  saveFactionTimer,
  updateLocalAgendaTimer,
  updateLocalFactionTimer,
} from "./util/api/timers";
import { FormattedMessage } from "react-intl";
import { useInterval } from "./util/client";
import { useGameState, useTimers } from "./context/dataHooks";
import { rem } from "./util/util";

export function AgendaTimer({ agendaNum }: { agendaNum: number }) {
  const gameId = useContext(GameIdContext);
  const state = useGameState();
  const timers = useTimers();

  const [agendaTimer, setAgendaTimer] = useState(
    agendaNum === 1 ? timers.firstAgenda ?? 0 : timers.secondAgenda ?? 0
  );
  const { addSubscriber, removeSubscriber } = useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  useInterval(() => {
    if (!gameId) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveAgendaTimer(gameId, timerRef.current, agendaNum);
    }
  }, 15000);

  const isActive = state?.agendaNum === agendaNum;
  const paused = state?.paused;

  const updateTime = useCallback(() => {
    if (!gameId || paused || !isActive) {
      return;
    }
    timerRef.current += 1;
    updateLocalAgendaTimer(gameId, timerRef.current, agendaNum);
    setAgendaTimer(timerRef.current);
  }, [paused, isActive, gameId, agendaNum]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  const localAgendaTimer =
    agendaNum === 1 ? timers?.firstAgenda : timers?.secondAgenda;
  useEffect(() => {
    if (localAgendaTimer && localAgendaTimer > timerRef.current) {
      timerRef.current = localAgendaTimer;
      lastUpdate.current = localAgendaTimer;
      setAgendaTimer(localAgendaTimer);
    }
  }, [localAgendaTimer]);

  return (
    <div
      className="flexColumn"
      style={{
        alignItems: "center",
        gap: 0,
        justifyContent: "center",
        fontSize: rem(24),
      }}
    >
      <div style={{ fontSize: rem(18) }}>
        <FormattedMessage
          id="OpsE1E"
          defaultMessage="{num, select, 1 {First} 2 {Second} other {First}} Agenda"
          description="Label specifying which agenda this is."
          values={{ num: agendaNum }}
        />
      </div>
      <TimerDisplay time={agendaTimer} width={132} />
    </div>
  );
}

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
  const gameId = useContext(GameIdContext);
  // const state = useGameState);
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
  const gameId = useContext(GameIdContext);
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
