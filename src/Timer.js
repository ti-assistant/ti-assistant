import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { BasicFactionTile } from './FactionTile';
import { saveFactionTimer } from './util/api/factions';
import { saveGameTimer } from './util/api/state';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { useBetween } from 'use-between';

const useCurrentAgenda = () => {
  const [currentAgenda, setCurrentAgenda] = useState(1);

  const advanceAgendaPhase = useCallback(() => setCurrentAgenda(2));
  const resetAgendaPhase = useCallback(() => setCurrentAgenda(1));
  return {
    currentAgenda,
    advanceAgendaPhase,
    resetAgendaPhase,
  };
};

export const useSharedCurrentAgenda = () => useBetween(useCurrentAgenda);

const usePaused = () => {
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => setPaused(true));
  const unpause = useCallback(() => setPaused(false));
  return {
    paused,
    pause,
    unpause,
  };
};

const useSharedPause = () => useBetween(usePaused);

export function TimerDisplay({ time }) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time % 3600 / 60);
  const seconds = time % 60;

  return <div className="flexRow" style={{width: "132px", fontSize: "24px"}}>
    {hours} : {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}
  </div>
}

export function AgendaTimer({}) {
  const [ firstAgendaTimer, setFirstAgendaTimer ] = useState(0);
  const [ secondAgendaTimer, setSecondAgendaTimer ] = useState(0);
  const { currentAgenda, advanceAgendaPhase } = useSharedCurrentAgenda();
  const { paused } = useSharedPause();


  function updateTime() {
    if (paused) {
      return;
    }
    if (currentAgenda === 1) {
      setFirstAgendaTimer(firstAgendaTimer + 1);
    } else {
      setSecondAgendaTimer(secondAgendaTimer + 1);
    }
  }

  useEffect(() => {
    if (paused) {
      return;
    }
    const timeout = setTimeout(() => {
      updateTime();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [firstAgendaTimer, secondAgendaTimer, paused]);

  // const totalTimer = firstAgendaTimer + secondAgendaTimer;

  return (
    <div className="flexColumn" style={{width: "100%", gap: "4px"}}>
      {/* <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}>
        <div style={{fontSize: "18px"}}>Total Time</div>
        <TimerDisplay time={totalTimer} />
      </div> */}
      <div className="flexRow" style={{width: "100%", justifyContent: "space-evenly"}}>
        <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}>
          <div style={{fontSize: "18px"}}>First Agenda</div>
          <TimerDisplay time={firstAgendaTimer} />
        </div>
        <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}>
          <div style={{fontSize: "18px"}}>Second Agenda</div>
          <TimerDisplay time={secondAgendaTimer} />
        </div>
      </div>
      <div className="flexRow" style={{gap: "12px"}}>
      {/* <button onClick={togglePause}>{paused ? "Unpause" : "Pause"}</button> */}
      {currentAgenda === 1 ?
        <button onClick={advanceAgendaPhase}>Second Agenda</button>
      : null}
      </div>  
    </div>
  );
}

export function GameTimer({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const [ gameTimer, setGameTimer ] = useState(0);
  // const [ paused, setPaused ] = useState(false);
  const { paused, pause, unpause } = useSharedPause();

  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  useEffect(() => {
    if (paused) {
      return;
    }

    if (state && gameTimer % 15 === 0) {
      saveGameTimer(mutate, gameid, state, gameTimer);
    }

    const timeout = setTimeout(() => {
      setGameTimer(gameTimer + 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [gameTimer, paused]);

  function setStartingTime() {
    if (!state) {
      const timeout = setTimeout(setStartingTime, 1000);
    }
    if (state.timer && state.timer > gameTimer) {
      setGameTimer(state.timer);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(setStartingTime, 1000);
    return () => clearTimeout(timeout);
  }, [state]);

  function togglePause() {
    if (paused) {
      unpause();
    } else {
      pause();
    }
  }

  return (
    <div className="flexColumn" style={{width: "100%", gap: "4px", whiteSpace: "nowrap"}}>
      <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}>
        <div style={{fontSize: "18px"}}>Game Time</div>
        <TimerDisplay time={!state ? 0 : gameTimer} />
      </div>
      <div className="flexRow" style={{gap: "12px"}}>
        <button onClick={togglePause}>{paused ? "Unpause" : "Pause"}</button>
      </div>
    </div>
  );
}

export function FactionTimer({ factionName }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const [ factionTimer, setFactionTimer ] = useState(0);
  const { paused } = useSharedPause();
  // const [ paused, setPaused ] = useState(false);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  useEffect(() => {
    if (paused) {
      return;
    }

    if (factions && factionTimer % 5 === 0) {
      saveFactionTimer(mutate, gameid, factions, factionName, factionTimer);
    }

    const timeout = setTimeout(() => {
      setFactionTimer(factionTimer + 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [factionTimer, paused]);

  function setStartingTime() {
    if (!factions) {
      const timeout = setTimeout(setStartingTime, 1000);
    }
    if (factions[factionName].timer && factions[factionName].timer > factionTimer) {
      setFactionTimer(factions[factionName].timer);
    }
  }

  useEffect(() => {
    setStartingTime();
  }, [factions, factionName]);

  return (
    <div className="flexColumn" style={{width: "100%", gap: "4px"}}>
      <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}> 
        <TimerDisplay time={!factions ? 0 : factionTimer} />
      </div>
    </div>
  );

}