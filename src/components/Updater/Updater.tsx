import { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { mutate } from "swr";
import { GameIdContext, StateContext } from "../../context/Context";
import { setGlobalPauseAsync } from "../../dynamic/api";
import { useInterval, useIsGameDataValidating } from "../../util/client";
import Modal from "../Modal/Modal";
import styles from "./Updater.module.scss";

const UPDATE_FREQUENCY = 2500;

// Only times out if the game is paused.
const TIMEOUT_MINUTES = 5;

export default function Updater() {
  // const router = useRouter();
  // const { game: gameid }: { game?: string } = router.query;
  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);
  const isValidating = useIsGameDataValidating(gameId);

  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [latestLocalActivityMillis, setLatestLocalActivityMillis] = useState(0);

  function pauseUpdates() {
    if (gameId) {
      setGlobalPauseAsync(gameId, true);
    }
    setShouldUpdate(false);
  }

  useEffect(() => {
    if (latestLocalActivityMillis > TIMEOUT_MINUTES * 60 * 1000) {
      pauseUpdates();
    }
  }, [latestLocalActivityMillis, pauseUpdates]);

  function restartUpdates() {
    if (gameId) {
      setGlobalPauseAsync(gameId, false);
    }
    setShouldUpdate(true);
    setLatestLocalActivityMillis(0);
  }

  function refreshData() {
    if (!gameId) {
      return;
    }

    if (!isValidating) {
      mutate(`/api/${gameId}/data`);
    }

    // If not paused, the timers will automatically update.
    if (state.paused) {
      setLatestLocalActivityMillis(
        (localActivity) => localActivity + UPDATE_FREQUENCY
      );
      mutate(`/api/${gameId}/timers`);
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
      title={
        <div className={styles.pausedTitle}>
          <FormattedMessage
            id="g92Jbl"
            description="Text telling the user that updates are paused."
            defaultMessage="Updates Paused"
          />
        </div>
      }
    >
      <div className={`flexRow ${styles.pausedBody}`}>
        <FormattedMessage
          id="uEqy1T"
          description="Text telling the user to close the dialog to resume."
          defaultMessage="Close to continue"
        />
      </div>
    </Modal>
  );
}
