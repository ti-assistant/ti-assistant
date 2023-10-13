import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { mutate } from "swr";
import { StateContext } from "../../context/Context";
import { useIsGameDataValidating } from "../../data/GameData";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { useInterval } from "../../util/util";
import Modal from "../Modal/Modal";
import styles from "./Updater.module.scss";

const UPDATE_FREQUENCY = 5000;

// Only times out if the game is paused.
const TIMEOUT_MINUTES = 5;

export default function Updater({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const state = useContext(StateContext);
  const isValidating = useIsGameDataValidating(gameid);

  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [latestLocalActivityMillis, setLatestLocalActivityMillis] = useState(0);

  function pauseUpdates() {
    if (gameid) {
      setGlobalPauseAsync(gameid, true);
    }
    setShouldUpdate(false);
  }

  useEffect(() => {
    if (latestLocalActivityMillis > TIMEOUT_MINUTES * 60 * 1000) {
      pauseUpdates();
    }
  }, [latestLocalActivityMillis, pauseUpdates]);

  function restartUpdates() {
    if (gameid) {
      setGlobalPauseAsync(gameid, false);
    }
    setShouldUpdate(true);
    setLatestLocalActivityMillis(0);
  }

  function refreshData() {
    if (!gameid) {
      return;
    }

    if (!isValidating) {
      mutate(`/api/${gameid}/data`);
    }

    // If not paused, the timers will automatically update.
    if (state.paused) {
      setLatestLocalActivityMillis(
        (localActivity) => localActivity + UPDATE_FREQUENCY
      );
      mutate(`/api/${gameid}/timers`);
    } else {
      setLatestLocalActivityMillis(0);
    }
  }

  useInterval(refreshData, shouldUpdate ? UPDATE_FREQUENCY : null);

  return (
    <Modal
      closeMenu={restartUpdates}
      level={2}
      visible={!shouldUpdate}
      title={<div className={styles.pausedTitle}>Updates Paused</div>}
    >
      <div className={`flexRow ${styles.pausedBody}`}>Close to continue</div>
    </Modal>
  );
}
