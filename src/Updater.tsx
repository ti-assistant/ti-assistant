import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { Modal } from "./Modal";
import { useSharedTimer } from "./Timer";
import { responsivePixels, useInterval } from "./util/util";
import { useGameData, useIsGameDataValidating } from "./data/GameData";

const INITIAL_FREQUENCY = 5000;
const TIMEOUT_MINUTES = 15;

export function Updater({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["state"]);
  const isValidating = useIsGameDataValidating(gameid);
  const { setPaused } = useSharedTimer();

  const [initialLoad, setInitialLoad] = useState(true);

  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState(INITIAL_FREQUENCY);
  const [latestLocalActivity, setLatestLocalActivity] = useState(0);

  function pauseUpdates() {
    setPaused(true);
    setShouldUpdate(false);
  }

  function restartUpdates() {
    setPaused(false);
    setShouldUpdate(true);
    setUpdateFrequency(INITIAL_FREQUENCY);
    setLatestLocalActivity(Date.now());
  }

  function refreshData() {
    if (!gameid) {
      return;
    }

    if (!isValidating) {
      mutate(`/api/${gameid}/data`);
    }

    // If not paused, the timers will automatically update.
    if (gameData.state.paused) {
      mutate(`/api/${gameid}/timers`);
    }
  }

  // function checkForUpdates() {
  //   if (!gameid || !updates) {
  //     return;
  //   }

  //   if (shouldUpdate && latestLocalActivity !== 0) {
  //     const localMillis = Date.now() - latestLocalActivity;
  //     const localMinutes = Math.floor(localMillis / 60000);
  //     if (localMinutes >= TIMEOUT_MINUTES) {
  //       pauseUpdates();
  //       return;
  //     }
  //   }
  // }

  useInterval(refreshData, shouldUpdate ? updateFrequency : null);

  if (initialLoad) {
    setInitialLoad(false);
    setLatestLocalActivity(Date.now());
  }

  return (
    <Modal
      closeMenu={restartUpdates}
      level={2}
      visible={!shouldUpdate}
      title={
        <div style={{ fontSize: responsivePixels(40) }}>Updates Paused</div>
      }
    >
      <div
        className="flexRow"
        style={{ width: "100%", fontSize: responsivePixels(24) }}
      >
        Close to continue
      </div>
    </Modal>
  );
}
