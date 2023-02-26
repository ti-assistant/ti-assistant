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

export interface TimerDisplayProps {
  time: number;
  style?: CSSProperties;
}

export function TimerDisplay({ time, style = {} }: TimerDisplayProps) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const timerStyle = {
    width: responsivePixels(160),
    fontSize: responsivePixels(24),
    ...style,
  };

  return (
    <div className="flexRow" style={timerStyle}>
      {hours} : {minutes < 10 ? `0${minutes}` : minutes} :{" "}
      {seconds < 10 ? `0${seconds}` : seconds}
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
  const { paused } = useSharedPause();

  const agendaNum = state?.agendaNum ?? 1;

  function updateTime() {
    if (paused || !gameid) {
      return;
    }

    if (agendaNum === 1) {
      if (timers && firstAgendaTimer % 15 === 0) {
        saveAgendaTimer(gameid, firstAgendaTimer, agendaNum);
      }
      setFirstAgendaTimer(firstAgendaTimer + 1);
    } else if (agendaNum === 2) {
      if (timers && secondAgendaTimer % 15 === 0) {
        saveAgendaTimer(gameid, secondAgendaTimer, agendaNum);
      }
      setSecondAgendaTimer(secondAgendaTimer + 1);
    }
  }

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

  useInterval(updateTime, paused ? undefined : 1000);

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
          <TimerDisplay time={firstAgendaTimer} />
        </div>
        <div
          className="flexColumn"
          style={{ alignItems: "center", gap: 0, justifyContent: "center" }}
        >
          <div style={{ fontSize: responsivePixels(18) }}>Second Agenda</div>
          <TimerDisplay time={secondAgendaTimer} />
        </div>
      </div>
    </div>
  );
}

export function GameTimer({ frozen = false }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [gameTimer, setGameTimer] = useState(0);
  // const [ paused, setPaused ] = useState(false);
  const { paused, pause, unpause } = useSharedPause();

  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );

  useInterval(
    () => {
      if (paused || frozen || !gameid) {
        return;
      }

      if (timers && gameTimer % 15 === 0) {
        saveGameTimer(gameid, gameTimer);
      }

      setGameTimer(gameTimer + 1);
    },
    paused || frozen ? undefined : 1000
  );

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
      unpause();
    } else {
      pause();
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
        {/* <div style={{fontSize: responsivePixels(18)}}>Game Time</div> */}
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
}

export function StaticFactionTimer({ factionName, style }: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const [prevFactionName, setPrevFactionName] = useState(factionName);
  // const [ paused, setPaused ] = useState(false);
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      const value = timers[factionName];
      if ((value && value > factionTimer) || prevFactionName !== factionName) {
        setPrevFactionName(factionName);
        setFactionTimer(value ?? 0);
      }
    }
    setStartingTime();
  }, [timers, factionName, prevFactionName, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}

export function FactionTimer({ factionName, style }: FactionTimerProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [factionTimer, setFactionTimer] = useState(0);
  const [prevFactionName, setPrevFactionName] = useState(factionName);

  const { paused } = useSharedPause();
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher
  );

  useInterval(() => {
    if (paused || !gameid) {
      return;
    }

    if (timers && factionTimer % 5 === 0) {
      saveFactionTimer(gameid, factionName, factionTimer);
    }

    setFactionTimer(factionTimer + 1);
  }, 1000);

  useEffect(() => {
    function setStartingTime() {
      if (!timers) {
        return;
      }
      const value = timers[factionName];
      if ((value && value > factionTimer) || factionName !== prevFactionName) {
        setPrevFactionName(factionName);
        setFactionTimer(value ?? 0);
      }
    }
    setStartingTime();
  }, [timers, factionName, prevFactionName, factionTimer]);

  return <TimerDisplay time={!timers ? 0 : factionTimer} style={style} />;
}
