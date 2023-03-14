import { useRouter } from "next/router";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { fetcher } from "./util/api/util";
import { useBetween } from "use-between";
import {
  saveAgendaTimer,
  saveFactionTimer,
  saveGameTimer,
  updateLocalAgendaTimer,
  updateLocalFactionTimer,
  updateLocalGameTimer,
} from "./util/api/timers";
import { responsivePixels, useInterval } from "./util/util";
import { GameState } from "./util/api/state";

const useCurrentAgenda = () => {
  const [currentAgenda, setCurrentAgenda] = useState(1);

  const advanceAgendaPhase = useCallback(() => {
    setCurrentAgenda(currentAgenda + 1);
  }, [currentAgenda]);
  const resetAgendaPhase = useCallback(() => {
    setCurrentAgenda(1);
  }, []);
  return {
    currentAgenda,
    advanceAgendaPhase,
    resetAgendaPhase,
  };
};

export const useSharedCurrentAgenda = () => useBetween(useCurrentAgenda);

const usePaused = () => {
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => setPaused(true), []);
  const unpause = useCallback(() => setPaused(false), []);
  return {
    paused,
    pause,
    unpause,
  };
};

export const useSharedPause = () => useBetween(usePaused);

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const useTimer = () => {
  const [paused, setPaused] = useState(false);

  const savedCallbacks = useRef<Record<string, () => void>>({});

  useInterval(updateSubscribers, paused ? null : 1000);

  function addSubscriber(subscriber: () => void) {
    let id = makeid(12);
    while (savedCallbacks.current[id]) {
      id = makeid(12);
    }
    savedCallbacks.current[id] = subscriber;
    return id;
  }

  function removeSubscriber(id: string) {
    delete savedCallbacks.current[id];
  }

  function updateSubscribers() {
    for (const subscriber of Object.values(savedCallbacks.current)) {
      subscriber();
    }
  }

  return {
    paused,
    setPaused,
    addSubscriber,
    removeSubscriber,
  };
};

export const useSharedTimer = () => useBetween(useTimer);

export interface TimerDisplayProps {
  time: number;
  width?: number;
  style?: CSSProperties;
}

export function TimerDisplay({
  time,
  width = 152,
  style = {},
}: TimerDisplayProps) {
  let hours = Math.min(Math.floor(time / 3600), 99);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  let template =
    "repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr))";

  const tenHours = Math.floor(hours / 10);

  if (tenHours === 0) {
    template =
      "minmax(0, 2fr) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr))";
    width = Math.floor((width * 9) / 10);
  }

  const timerStyle = {
    width: responsivePixels(width),
    fontSize: responsivePixels(24),
    gap: responsivePixels(0),
    fontFamily: "Slider",
    justifyContent: "center",
    display: "grid",
    gridTemplateColumns: template,
    ...style,
  };
  const oneHours = hours % 10;
  const tenMinutes = Math.floor(minutes / 10);
  const oneMinutes = minutes % 10;
  const tenSeconds = Math.floor(seconds / 10);
  const oneSeconds = seconds % 10;

  const numberStyle: CSSProperties = {
    textAlign: "center",
  };

  return (
    <div className="flexRow" style={timerStyle}>
      {tenHours > 0 ? <span style={numberStyle}>{tenHours}</span> : null}
      <span style={numberStyle}>{oneHours}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenMinutes}</span>
      <span style={numberStyle}>{oneMinutes}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenSeconds}</span>
      <span style={numberStyle}>{oneSeconds}</span>

      {tenHours === 0 ? null : null}
    </div>
  );
}

export function AgendaTimer({ agendaNum }: { agendaNum: number }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [agendaTimer, setAgendaTimer] = useState(0);
  const { paused, addSubscriber, removeSubscriber } = useSharedTimer();

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
        {agendaNum === 2 ? "Second" : "First"} Agenda
      </div>
      <TimerDisplay time={agendaTimer} width={132} />
    </div>
  );
}

export function GameTimer({ frozen = false }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [gameTimer, setGameTimer] = useState(0);
  const { paused, setPaused, addSubscriber, removeSubscriber } =
    useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  useInterval(() => {
    if (!gameid) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveGameTimer(gameid, timerRef.current);
    }
  }, 15000);

  const updateTime = useCallback(() => {
    if (!gameid || paused || frozen) {
      return;
    }
    timerRef.current += 1;
    updateLocalGameTimer(gameid, timerRef.current);
    setGameTimer(timerRef.current);
  }, [paused, frozen, gameid]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  const localGameTimer = timers?.game;
  useEffect(() => {
    if (localGameTimer && localGameTimer > timerRef.current) {
      timerRef.current = localGameTimer;
      lastUpdate.current = localGameTimer;
      setGameTimer(localGameTimer);
    }
  }, [localGameTimer, gameTimer]);

  function togglePause() {
    if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }

  return (
    <div className="flexColumn" style={{ width: "100%", whiteSpace: "nowrap" }}>
      <div
        className="flexColumn"
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: responsivePixels(4),
        }}
      >
        <TimerDisplay
          time={!timers ? 0 : gameTimer}
          style={{ fontSize: responsivePixels(28) }}
        />
      </div>
      {frozen ? null : (
        <div className="flexRow">
          <button onClick={togglePause}>{paused ? "Unpause" : "Pause"}</button>
        </div>
      )}
    </div>
  );
}

export interface FactionTimerProps {
  factionName: string;
  style?: CSSProperties;
  width?: number;
}

export function StaticFactionTimer({
  factionName,
  style,
  width,
}: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const localFactionTimer = (timers ?? {})[factionName];

  return (
    <TimerDisplay
      time={!timers ? 0 : localFactionTimer ?? 0}
      style={style}
      width={width}
    />
  );
}

export function FactionTimer({ factionName, style }: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const prevFaction = useRef<string>();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { paused, addSubscriber, removeSubscriber } = useSharedTimer();

  useEffect(() => {
    return () => {
      if (!gameid) {
        return;
      }
      if (
        prevFaction.current == factionName &&
        lastUpdate.current < timerRef.current
      ) {
        lastUpdate.current = timerRef.current;
        saveFactionTimer(gameid, factionName, timerRef.current);
      }
    };
  }, [factionName, gameid]);

  useInterval(() => {
    if (!gameid) {
      return;
    }
    if (
      prevFaction.current == factionName &&
      lastUpdate.current < factionTimer
    ) {
      lastUpdate.current = factionTimer;
      saveFactionTimer(gameid, factionName, factionTimer);
    }
  }, 5000);

  const updateTime = useCallback(() => {
    if (paused || !gameid) {
      return;
    }

    timerRef.current += 1;
    updateLocalFactionTimer(gameid, factionName, timerRef.current);
    setFactionTimer(timerRef.current);
  }, [paused, gameid, factionName]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  const localFactionTimer = (timers ?? {})[factionName];

  useEffect(() => {
    if (
      (localFactionTimer && localFactionTimer > timerRef.current) ||
      factionName !== prevFaction.current
    ) {
      prevFaction.current = factionName;
      timerRef.current = localFactionTimer ?? 0;
      lastUpdate.current = localFactionTimer ?? 0;
      setFactionTimer(localFactionTimer ?? 0);
    }
  }, [localFactionTimer, factionName, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}
