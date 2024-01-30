import { useRouter } from "next/router";
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import TimerDisplay from "./components/TimerDisplay/TimerDisplay";
import { StateContext } from "./context/Context";
import { useSharedTimer } from "./data/SharedTimer";
import { useTimers } from "./data/Timers";
import {
  saveAgendaTimer,
  saveFactionTimer,
  updateLocalAgendaTimer,
  updateLocalFactionTimer,
} from "./util/api/timers";
import { responsivePixels, useInterval } from "./util/util";
import { FormattedMessage } from "react-intl";

export function AgendaTimer({ agendaNum }: { agendaNum: number }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const state = useContext(StateContext);
  const timers = useTimers(gameid);

  const [agendaTimer, setAgendaTimer] = useState(0);
  const { addSubscriber, removeSubscriber } = useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  useInterval(() => {
    if (!gameid) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveAgendaTimer(gameid, timerRef.current, agendaNum);
    }
  }, 15000);

  const isActive = state?.agendaNum === agendaNum;
  const paused = state?.paused;

  const updateTime = useCallback(() => {
    if (!gameid || paused || !isActive) {
      return;
    }
    timerRef.current += 1;
    updateLocalAgendaTimer(gameid, timerRef.current, agendaNum);
    setAgendaTimer(timerRef.current);
  }, [paused, isActive, gameid, agendaNum]);

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
      style={{ alignItems: "center", gap: 0, justifyContent: "center" }}
    >
      <div style={{ fontSize: responsivePixels(18) }}>
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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const timers = useTimers(gameid);
  const [factionTimer, setFactionTimer] = useState(0);
  const prevFaction = useRef<string>();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  useEffect(() => {
    return () => {
      if (!gameid || factionId === "Unknown") {
        return;
      }
      if (
        prevFaction.current == factionId &&
        lastUpdate.current < timerRef.current
      ) {
        lastUpdate.current = timerRef.current;
        saveFactionTimer(gameid, factionId, timerRef.current);
      }
    };
  }, [factionId, gameid]);

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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const prevFaction = useRef<string>();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const state = useContext(StateContext);
  const timers = useTimers(gameid);

  const { addSubscriber, removeSubscriber } = useSharedTimer();

  useEffect(() => {
    return () => {
      if (!gameid || factionId === "Unknown") {
        return;
      }
      if (
        prevFaction.current == factionId &&
        lastUpdate.current < timerRef.current
      ) {
        lastUpdate.current = timerRef.current;
        saveFactionTimer(gameid, factionId, timerRef.current);
      }
    };
  }, [factionId, gameid]);

  useInterval(() => {
    if (!gameid || factionId === "Unknown") {
      return;
    }
    if (prevFaction.current == factionId && lastUpdate.current < factionTimer) {
      lastUpdate.current = factionTimer;
      saveFactionTimer(gameid, factionId, factionTimer);
    }
  }, 5000);

  const paused = state?.paused;

  const updateTime = useCallback(() => {
    if (paused || !gameid || factionId === "Unknown") {
      return;
    }

    timerRef.current += 1;
    updateLocalFactionTimer(gameid, factionId, timerRef.current);
    setFactionTimer(timerRef.current);
  }, [paused, gameid, factionId]);

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
