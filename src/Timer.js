import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { BasicFactionTile } from './FactionTile';
import { saveGameTimer } from './util/api/state';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { applyPlanetAttachments } from './util/helpers';

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
  const [ currentAgenda, setCurrentAgenda ] = useState(1);
  const [ paused, setPaused ] = useState(false);


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

  function togglePause() {
    setPaused(!paused);
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
      <button onClick={togglePause}>{paused ? "Unpause" : "Pause"}</button>
      {currentAgenda === 1 ?
        <button onClick={() => setCurrentAgenda(2)}>Second Agenda</button>
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
  const [ paused, setPaused ] = useState(false);

  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  useEffect(() => {
    if (paused) {
      return;
    }

    if (gameTimer % 15 === 0) {
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
    setPaused(!paused);
  }

  return (
    <div className="flexColumn" style={{width: "100%", gap: "4px"}}>
      <div className="flexColumn" style={{gap: "4px", alignItems: "center", justifyContent: "center"}}>
        <div style={{fontSize: "18px"}}>Game Time</div>
        <TimerDisplay time={gameTimer} />
      </div>
      <div className="flexRow" style={{gap: "12px"}}>
        <button onClick={togglePause}>{paused ? "Unpause" : "Pause"}</button>
      </div>
    </div>
  );
}