import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useGameId, useTimers, useViewOnly } from "../../context/dataHooks";
import TimerManager from "../../context/TimerManager";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { rem } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";
import TurnTimer from "../TurnTimer/TurnTimer";
import styles from "./GameTimer.module.scss";

export default function GameTimer({ frozen = false }) {
  const gameId = useGameId();
  const timers = useTimers();

  const viewOnly = useViewOnly();

  const gameTimer = timers.game ?? 0;

  useEffect(() => {
    if (viewOnly) {
      return;
    }
    TimerManager.activateTimer("game");
    return () => TimerManager.deactivateTimer("game");
  }, [viewOnly]);

  const paused = timers.paused;

  function togglePause() {
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
