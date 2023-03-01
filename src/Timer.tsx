import { useRouter } from "next/router";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { fetcher } from "./util/api/util";
import { useBetween } from "use-between";
import {
  saveAgendaTimer,
  saveFactionTimer,
  saveGameTimer,
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
  style?: CSSProperties;
}

export function TimerDisplay({ time, style = {} }: TimerDisplayProps) {
  let hours = Math.min(Math.floor(time / 3600), 99);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  let template =
    "repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr))";

  const tenHours = Math.floor(hours / 10);

  if (tenHours === 0) {
    template =
      "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr)";
  }

  const timerStyle = {
    width: responsivePixels(152),
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
      {tenHours > 0 ? (
        <span style={numberStyle}>{tenHours}</span>
      ) : (
        <span></span>
      )}
      <span style={numberStyle}>{oneHours}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenMinutes}</span>
      <span style={numberStyle}>{oneMinutes}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenSeconds}</span>
      <span style={numberStyle}>{oneSeconds}</span>

      {tenHours === 0 ? <span></span> : null}
    </div>
  );
}

export function AgendaTimer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );

  const [firstAgendaTimer, setFirstAgendaTimer] = useState(0);
  const [secondAgendaTimer, setSecondAgendaTimer] = useState(0);
  const { paused, addSubscriber, removeSubscriber } = useSharedTimer();

  const agendaNum = state?.agendaNum ?? 1;

  const updateTime = useCallback(() => {
    if (paused || !gameid) {
      return;
    }

    if (agendaNum === 1) {
      if (firstAgendaTimer > 0 && firstAgendaTimer % 15 === 0) {
        saveAgendaTimer(gameid, firstAgendaTimer, agendaNum);
      }
      setFirstAgendaTimer(firstAgendaTimer + 1);
    } else if (agendaNum === 2) {
      if (secondAgendaTimer > 0 && secondAgendaTimer % 15 === 0) {
        saveAgendaTimer(gameid, secondAgendaTimer, agendaNum);
      }
      setSecondAgendaTimer(secondAgendaTimer + 1);
    }
  }, [paused, gameid, agendaNum, firstAgendaTimer, secondAgendaTimer]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      if (timers.firstAgenda && timers.firstAgenda > firstAgendaTimer) {
        setFirstAgendaTimer(timers.firstAgenda);
      }
      if (timers.secondAgenda && timers.secondAgenda > secondAgendaTimer) {
        setSecondAgendaTimer(timers.secondAgenda);
      }
    }
    setStartingTime();
  }, [timers, firstAgendaTimer, secondAgendaTimer]);

  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "space-evenly" }}
      >
        <div
          className="flexColumn"
          style={{ alignItems: "center", gap: 0, justifyContent: "center" }}
        >
          <div style={{ fontSize: responsivePixels(18) }}>First Agenda</div>
          <TimerDisplay
            time={firstAgendaTimer}
            style={{ width: responsivePixels(132) }}
          />
        </div>
        <div
          className="flexColumn"
          style={{ alignItems: "center", gap: 0, justifyContent: "center" }}
        >
          <div style={{ fontSize: responsivePixels(18) }}>Second Agenda</div>
          <TimerDisplay
            time={secondAgendaTimer}
            style={{ width: responsivePixels(132) }}
          />
        </div>
      </div>
    </div>
  );
}

export function GameTimer({ frozen = false }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [gameTimer, setGameTimer] = useState(0);
  const { paused, setPaused, addSubscriber, removeSubscriber } =
    useSharedTimer();

  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );

  const updateTime = useCallback(() => {
    if (paused || frozen || !gameid) {
      return;
    }
    if (gameTimer > 0 && gameTimer % 15 === 0) {
      saveGameTimer(gameid, gameTimer);
    }
    setGameTimer(gameTimer + 1);
  }, [gameTimer, paused, frozen, gameid]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      if (timers.game && timers.game > gameTimer) {
        setGameTimer(timers.game);
      }
    }
    setStartingTime();
  }, [timers, gameTimer]);

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
  isActive?: boolean;
  style?: CSSProperties;
}

export function StaticFactionTimer({
  isActive,
  factionName,
  style,
}: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const prevFaction = useRef<string>();
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );

  const { paused, addSubscriber, removeSubscriber } = useSharedTimer();

  const updateTime = useCallback(() => {
    if (paused || !isActive) {
      return;
    }

    setFactionTimer(factionTimer + 1);
  }, [factionTimer, paused, isActive]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      const value = timers[factionName];
      if (
        (value && value > factionTimer) ||
        prevFaction.current !== factionName
      ) {
        prevFaction.current = factionName;
        setFactionTimer(value ?? 0);
      }
    }
    setStartingTime();
  }, [timers, factionName, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}

export function FactionTimer({ factionName, style }: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const prevFaction = useRef<string>();

  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );
  const { paused, addSubscriber, removeSubscriber } = useSharedTimer();

  const updateTime = useCallback(() => {
    if (paused || !gameid) {
      return;
    }

    if (factionTimer > 0 && factionTimer % 5 === 0) {
      saveFactionTimer(gameid, factionName, factionTimer);
    }

    setFactionTimer(factionTimer + 1);
  }, [factionTimer, paused, gameid, factionName]);

  useEffect(() => {
    const id = addSubscriber(updateTime);
    return () => {
      removeSubscriber(id);
    };
  }, [updateTime, addSubscriber, removeSubscriber]);

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      const value = timers[factionName];
      if (
        (value && value > factionTimer) ||
        factionName !== prevFaction.current
      ) {
        prevFaction.current = factionName;
        setFactionTimer(value ?? 0);
      }
    }
    setStartingTime();
  }, [timers, factionName, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}
