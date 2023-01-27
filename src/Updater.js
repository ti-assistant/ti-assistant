import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useBetween } from "use-between";
import { Modal } from "./Modal";
import { useSharedPause } from "./Timer";
import { fetcher } from "./util/api/util";
import { responsivePixels } from "./util/util";

let updateObject = {};

const setUpdateTime = (endpoint, time) => {
  updateObject = {
    ...updateObject,
    [endpoint]: time,
  };
  (updateObject.callbacks ?? []).forEach((callback) => {
    callback(updateObject);
  });
};

function registerUpdateCallback(fn) {
  if (!updateObject.callbacks) {
    updateObject.callbacks = [];
  }
  updateObject.callbacks.push(fn);
}

export const useSharedUpdateTimes = () => {
  return { updateObject, setUpdateTime };
}

// const useUpdater = () => {
//   const [updateObject, setUpdateObject] = useState({});

//   const setUpdateTime = useCallback((endpoint, time) => {
//     setUpdateObject({
//       ...updateObject,
//       [endpoint]: time,
//     });
//   }, []);
//   return {
//     updateObject,
//     setUpdateTime,
//   };
// };

export function getLatestUpdate(updates = {}) {
  let latestTime = 0;
  Object.entries(updates).forEach(([type, item]) => {
    // Ignore timers to get the actual latest update.
    if (type === "timers") {
      return;
    }
    const time = item.timestamp ?? 0;
    latestTime = Math.max(time, latestTime);
  });
  return latestTime;
}

// export const useSharedUpdateTimes = () => useBetween(useUpdater);

const INITIAL_FREQUENCY = 5000;

export function Updater({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: updates } = useSWR(gameid ? `/api/${gameid}/updates` : null, fetcher);
  const { setUpdateTime } = useSharedUpdateTimes();
  const { paused, pause, unpause } = useSharedPause();

  const [ initialLoad, setInitialLoad ] = useState(true);

  const [ localUpdateObject, setLocalUpdateObject ] = useState({});

  const [ localAgendas, setLocalAgendas ] = useState(0);
  const [ localAttachments, setLocalAttachments ] = useState(0);
  const [ localOptions, setLocalOptions ] = useState(0);
  const [ localPlanets, setLocalPlanets ] = useState(0);
  const [ localFactions, setLocalFactions ] = useState(0);
  const [ localObjectives, setLocalObjectives ] = useState(0);
  const [ localState, setLocalState ] = useState(0);
  const [ localSubState, setLocalSubState ] = useState(0);
  const [ localStrategyCards, setLocalStrategyCards ] = useState(0);
  const [ localTimers, setLocalTimers ] = useState(0);

  const [ shouldUpdate, setShouldUpdate ] = useState(true);
  const [ updateFrequency, setUpdateFrequency ] = useState(INITIAL_FREQUENCY);
  const [ latestLocalActivity, setLatestLocalActivity ] = useState(0);

  const localUpdates = updates ?? {};
  const agendasUpdate = (localUpdates.agendas ?? {}).timestamp ?? 0;
  const attachmentsUpdate = (localUpdates.attachments ?? {}).timestamp ?? 0;
  const factionsUpdate = (localUpdates.factions ?? {}).timestamp ?? 0;
  const objectivesUpdate = (localUpdates.objectives ?? {}).timestamp ?? 0;
  const optionsUpdate = (localUpdates.options ?? {}).timestamp ?? 0;
  const planetsUpdate = (localUpdates.planets ?? {}).timestamp ?? 0;
  const strategycardsUpdate = (localUpdates.strategycards ?? {}).timestamp ?? 0;
  const stateUpdate = (localUpdates.state ?? {}).timestamp ?? 0;
  const subStateUpdate = (localUpdates.substate ?? {}).timestamp ?? 0;
  const timersUpdate = (localUpdates.timers ?? {}).timestamp ?? 0;

  function pauseUpdates() {
    pause();
    setShouldUpdate(false);
  }

  function restartUpdates() {
    unpause();
    setShouldUpdate(true);
    setUpdateFrequency(INITIAL_FREQUENCY);
    setLatestLocalActivity(Date.now());
  }

  function checkForUpdates() {
    if (!gameid || !updates) {
      return;
    }

    const latestUpdateMillis = getLatestUpdate(updates);
    if (shouldUpdate && latestUpdateMillis !== 0 && latestLocalActivity !== 0) {
      const elapsedMillis = Date.now() - latestUpdateMillis;
      const minutes = Math.floor(elapsedMillis / 60000);
      const localMillis = Date.now() - latestLocalActivity;
      const localMinutes = Math.floor(localMillis / 60000);
      if (minutes >= 15 && localMinutes >= 15) {
        pauseUpdates();
        return;
      }
    }

    mutate(`/api/${gameid}/updates`, fetcher(`/api/${gameid}/updates`));
    setTimeout(checkForUpdates, updateFrequency);
  }

  useEffect(() => {
    registerUpdateCallback(setLocalUpdateObject);
  }, []);

  useEffect(() => {
    if (!shouldUpdate) {
      return;
    }
    setTimeout(checkForUpdates, updateFrequency);
  }, [initialLoad, shouldUpdate]);

  useEffect(() => {
    if (localUpdateObject.agendas > localAgendas) {
      setLocalAgendas(localUpdateObject.agendas);
    }
    if (localUpdateObject.attachments > localAttachments) {
      setLocalAttachments(localUpdateObject.attachments);
    }
    if (localUpdateObject.objectives > localObjectives) {
      setLocalObjectives(localUpdateObject.objectives);
    }
    if (localUpdateObject.options > localOptions) {
      setLocalOptions(localUpdateObject.options);
    }
    if (localUpdateObject.planets > localPlanets) {
      setLocalPlanets(localUpdateObject.planets);
    }
    if (localUpdateObject.factions > localFactions) {
      setLocalFactions(localUpdateObject.factions);
    }
    if (localUpdateObject.state > localState) {
      setLocalState(localUpdateObject.state);
    }
    if (localUpdateObject.subState > localSubState) {
      setLocalSubState(localUpdateObject.subState);
    }
    if (localUpdateObject.strategycards > localStrategyCards) {
      setLocalStrategyCards(localUpdateObject.strategycards);
    }
    if (localUpdateObject.timers > localTimers) {
      setLocalTimers(localUpdateObject.timers);
    }
  }, [localUpdateObject]);

  useEffect(() => {
    if (agendasUpdate > localAgendas) {
      setLocalAgendas(agendasUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/agendas`, fetcher(`/api/${gameid}/agendas`));
      }
    }
  }, [agendasUpdate]);

  useEffect(() => {
    if (attachmentsUpdate > localAttachments) {
      setLocalAttachments(attachmentsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/attachments`, fetcher(`/api/${gameid}/attachments`));
      }
      setUpdateTime("attachments", attachmentsUpdate);
    }
  }, [attachmentsUpdate]);

  useEffect(() => {
    if (planetsUpdate > localPlanets) {
      setLocalPlanets(planetsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/planets`, fetcher(`/api/${gameid}/planets`));
      }
      setUpdateTime("planets", planetsUpdate);
    }
  }, [planetsUpdate]);

  useEffect(() => {
    if (factionsUpdate > localFactions) {
      setLocalFactions(factionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/factions`, fetcher(`/api/${gameid}/factions`));
      }
      setUpdateTime("factions", factionsUpdate);
    }
  }, [factionsUpdate]);

  useEffect(() => {
    if (objectivesUpdate > localOptions) {
      setLocalObjectives(objectivesUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/objectives`, fetcher(`/api/${gameid}/objectives`));
      }
      setUpdateTime("objectives", objectivesUpdate);
    }
  }, [objectivesUpdate]);

  useEffect(() => {
    if (optionsUpdate > localOptions) {
      setLocalOptions(optionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/options`, fetcher(`/api/${gameid}/options`));
      }
      setUpdateTime("options", optionsUpdate);
    }
  }, [optionsUpdate]);

  useEffect(() => {
    if (strategycardsUpdate > localStrategyCards) {
      setLocalStrategyCards(strategycardsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/strategycards`, fetcher(`/api/${gameid}/strategycards`));
      }
      setUpdateTime("strategycards", strategycardsUpdate);
    }
  }, [strategycardsUpdate]);

  useEffect(() => {
    if (stateUpdate > localState) {
      setLocalState(stateUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/state`, fetcher(`/api/${gameid}/state`));
      }
      setUpdateTime("state", stateUpdate);
    }
  }, [stateUpdate]);

  useEffect(() => {
    if (subStateUpdate > localSubState) {
      setLocalSubState(subStateUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/subState`, fetcher(`/api/${gameid}/subState`));
      }
      setUpdateTime("subState", subStateUpdate);
    }
  }, [subStateUpdate]);

  useEffect(() => {
    if (timersUpdate > localTimers) {
      setLocalTimers(timersUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/timers`, fetcher(`/api/${gameid}/timers`));
      }
      setUpdateTime("timers", timersUpdate);
    }
  }, [timersUpdate]);

  if (!updates) {
    return null;
  }

  if (initialLoad) {
    setLocalAgendas(agendasUpdate);
    setLocalAttachments(attachmentsUpdate);
    setLocalPlanets(planetsUpdate);
    setLocalFactions(factionsUpdate);
    setLocalObjectives(objectivesUpdate);
    setLocalOptions(optionsUpdate);
    setLocalStrategyCards(strategycardsUpdate);
    setLocalState(stateUpdate);
    setLocalSubState(subStateUpdate);
    setLocalTimers(timersUpdate);
    setInitialLoad(false);
    setLatestLocalActivity(Date.now());
  }

  return <Modal closeMenu={restartUpdates} level={2} visible={!shouldUpdate} title={<div style={{fontSize: responsivePixels(40)}}>Updates Paused</div>} content={
    <div className="flexRow" style={{width: "100%", fontSize: responsivePixels(24)}}>Close to continue</div>
  } top="30%" />;
}
