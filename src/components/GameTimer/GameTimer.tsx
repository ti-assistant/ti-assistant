import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StateContext } from "../../context/Context";
import { useSharedTimer } from "../../data/SharedTimer";
import { useTimers } from "../../data/Timers";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { saveGameTimer, updateLocalGameTimer } from "../../util/api/timers";
import { responsivePixels, useInterval } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";

export default function GameTimer({ frozen = false }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [gameTimer, setGameTimer] = useState(0);
  const { addSubscriber, removeSubscriber } = useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const state = useContext(StateContext);
  const timers = useTimers(gameid);

  useInterval(() => {
    if (!gameid) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveGameTimer(gameid, timerRef.current);
    }
  }, 15000);

  const paused = state?.paused;

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
    if (!gameid) {
      return;
    }
    if (paused) {
      setGlobalPauseAsync(gameid, false);
    } else {
      setGlobalPauseAsync(gameid, true);
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
