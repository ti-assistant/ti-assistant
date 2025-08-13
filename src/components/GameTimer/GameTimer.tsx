import { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGameId, useTimers, useViewOnly } from "../../context/dataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { useSharedTimer } from "../../data/SharedTimer";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { saveGameTimer, updateLocalGameTimer } from "../../util/api/timers";
import { useInterval } from "../../util/client";
import { rem } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";
import TurnTimer from "../TurnTimer/TurnTimer";
import styles from "./GameTimer.module.scss";

export default function GameTimer({ frozen = false }) {
  const gameId = useGameId();
  const state = useGameState();
  const timers = useTimers();
  const viewOnly = useViewOnly();

  const [gameTimer, setGameTimer] = useState(timers.game ?? 0);
  const { addSubscriber, removeSubscriber } = useSharedTimer();

  const timerRef = useRef(0);
  const lastUpdate = useRef(0);

  useInterval(() => {
    if (viewOnly) {
      return;
    }
    if (lastUpdate.current < timerRef.current) {
      lastUpdate.current = timerRef.current;
      saveGameTimer(gameId, timerRef.current);
    }
  }, 2000);

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
    if (localGameTimer && (localGameTimer > timerRef.current || viewOnly)) {
      timerRef.current = localGameTimer;
      lastUpdate.current = localGameTimer;
      setGameTimer(localGameTimer);
    }
  }, [localGameTimer, gameTimer, viewOnly]);

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
          gap: rem(4),
        }}
      >
        <TimerDisplay
          time={!timers ? 0 : gameTimer}
          style={{ fontSize: rem(28) }}
        />
      </div>
      {frozen ? null : (
        <div className="flexRow">
          {viewOnly ? null : (
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
          )}
        </div>
      )}
      {!frozen ? <TurnTimer gameTime={gameTimer} /> : null}
    </div>
  );
}
