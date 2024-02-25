import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { GameIdContext, StateContext } from "../../context/Context";
import { useSharedTimer } from "../../data/SharedTimer";
import { useTimers } from "../../data/Timers";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { saveGameTimer, updateLocalGameTimer } from "../../util/api/timers";
import { useInterval } from "../../util/client";
import TimerDisplay from "../TimerDisplay/TimerDisplay";
import styles from "./GameTimer.module.scss";

export default function GameTimer({ frozen = false }) {
  const [gameTimer, setGameTimer] = useState(0);
  const { addSubscriber, removeSubscriber } = useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);
  const timers = useTimers(gameId);

  useInterval(() => {
    if (!gameId) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveGameTimer(gameId, timerRef.current);
    }
  }, 15000);

  const paused = state?.paused;

  const updateTime = useCallback(() => {
    if (!gameId || paused || frozen) {
      return;
    }
    timerRef.current += 1;
    updateLocalGameTimer(gameId, timerRef.current);
    setGameTimer(timerRef.current);
  }, [paused, frozen, gameId]);

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
    if (!gameId) {
      return;
    }
    if (paused) {
      setGlobalPauseAsync(gameId, false);
    } else {
      setGlobalPauseAsync(gameId, true);
    }
  }

  return (
    <div
      className={styles.GameTimer}
      style={{ width: "100%", whiteSpace: "nowrap" }}
    >
      <div
        className="flexColumn"
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <TimerDisplay
          time={!timers ? 0 : gameTimer}
          style={{ fontSize: "28px" }}
        />
      </div>
      {frozen ? null : (
        <div className="flexRow">
          <button className={styles.PauseButton} onClick={togglePause}>
            {paused ? (
              <FormattedMessage
                id="dNmJ1r"
                description="Text shown on a button that will unpause the game."
                defaultMessage="Unpause"
              />
            ) : (
              <FormattedMessage
                id="COzTbT"
                description="Text shown on a button that will pause the game."
                defaultMessage="Pause"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
