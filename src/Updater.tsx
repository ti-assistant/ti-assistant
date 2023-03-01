import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Modal } from "./Modal";
import { useSharedPause, useSharedTimer } from "./Timer";
import { fetcher } from "./util/api/util";
import { responsivePixels, useInterval } from "./util/util";

type UpdateObjectCallbackFn = (
  updateObject: UpdateObject,
  endpoint: string
) => void;

interface UpdateObject {
  callbacks?: UpdateObjectCallbackFn[];
  [key: string]: number | any;
}

let updateObject: UpdateObject = {
  callbacks: [],
};

const setUpdateTime = (endpoint: string, time: number) => {
  updateObject = {
    ...updateObject,
    [endpoint]: time,
  };
  (updateObject.callbacks ?? []).forEach((callback) => {
    callback(updateObject, endpoint);
  });
};

function registerUpdateCallback(fn: UpdateObjectCallbackFn) {
  if (!updateObject.callbacks) {
    updateObject.callbacks = [];
  }
  updateObject.callbacks.push(fn);
}

export const getSharedUpdateTimes = () => {
  return { updateObject, setUpdateTime };
};

const INITIAL_FREQUENCY = 5000;
const TIMEOUT_MINUTES = 15;

export function Updater({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: updates }: { data?: Record<string, { timestamp: number }> } =
    useSWR(gameid ? `/api/${gameid}/updates` : null, fetcher);
  const { setUpdateTime } = getSharedUpdateTimes();
  const { setPaused } = useSharedTimer();

  const [initialLoad, setInitialLoad] = useState(true);

  const [localUpdateObject, setLocalUpdateObject] = useState<UpdateObject>({});

  const [localAgendas, setLocalAgendas] = useState(0);
  const [localAttachments, setLocalAttachments] = useState(0);
  const [localComponents, setLocalComponents] = useState(0);
  const [localOptions, setLocalOptions] = useState(0);
  const [localPlanets, setLocalPlanets] = useState(0);
  const [localFactions, setLocalFactions] = useState(0);
  const [localObjectives, setLocalObjectives] = useState(0);
  const [localState, setLocalState] = useState(0);
  const [localSubState, setLocalSubState] = useState(0);
  const [localStrategyCards, setLocalStrategyCards] = useState(0);
  const [localTimers, setLocalTimers] = useState(0);

  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState(INITIAL_FREQUENCY);
  const [latestLocalActivity, setLatestLocalActivity] = useState(0);

  const localUpdates = updates ?? {};
  const agendasUpdate = (localUpdates.agendas ?? {}).timestamp ?? 0;
  const attachmentsUpdate = (localUpdates.attachments ?? {}).timestamp ?? 0;
  const componentsUpdate = (localUpdates.components ?? {}).timestamp ?? 0;
  const factionsUpdate = (localUpdates.factions ?? {}).timestamp ?? 0;
  const objectivesUpdate = (localUpdates.objectives ?? {}).timestamp ?? 0;
  const optionsUpdate = (localUpdates.options ?? {}).timestamp ?? 0;
  const planetsUpdate = (localUpdates.planets ?? {}).timestamp ?? 0;
  const strategycardsUpdate = (localUpdates.strategycards ?? {}).timestamp ?? 0;
  const stateUpdate = (localUpdates.state ?? {}).timestamp ?? 0;
  const subStateUpdate = (localUpdates.substate ?? {}).timestamp ?? 0;
  const timersUpdate = (localUpdates.timers ?? {}).timestamp ?? 0;

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

  function localUpdate(updatedObject: UpdateObject, endpoint: string) {
    if (endpoint !== "timers") {
      setLatestLocalActivity(Date.now());
    }
    setLocalUpdateObject(updatedObject);
  }

  function checkForUpdates() {
    if (!gameid || !updates) {
      return;
    }

    if (shouldUpdate && latestLocalActivity !== 0) {
      const localMillis = Date.now() - latestLocalActivity;
      const localMinutes = Math.floor(localMillis / 60000);
      if (localMinutes >= TIMEOUT_MINUTES) {
        pauseUpdates();
        return;
      }
    }

    mutate(`/api/${gameid}/updates`);
  }

  useEffect(() => {
    registerUpdateCallback(localUpdate);
  }, []);

  useInterval(checkForUpdates, shouldUpdate ? updateFrequency : null);

  // useEffect(() => {
  //   if (!shouldUpdate || initialLoad) {
  //     return;
  //   }
  //   setTimeout(checkForUpdates, updateFrequency);
  // }, [initialLoad, shouldUpdate]);

  useEffect(() => {
    if (localUpdateObject.agendas > localAgendas) {
      setLocalAgendas(localUpdateObject.agendas);
    }
    if (localUpdateObject.attachments > localAttachments) {
      setLocalAttachments(localUpdateObject.attachments);
    }
    if (localUpdateObject.components > localComponents) {
      setLocalComponents(localUpdateObject.components);
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
  }, [
    localUpdateObject,
    localAgendas,
    localAttachments,
    localComponents,
    localObjectives,
    localOptions,
    localPlanets,
    localFactions,
    localState,
    localSubState,
    localStrategyCards,
    localTimers,
  ]);

  useEffect(() => {
    if (agendasUpdate > localAgendas) {
      setLocalAgendas(agendasUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/agendas`);
      }
    }
  }, [agendasUpdate, localAgendas, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (attachmentsUpdate > localAttachments) {
      setLocalAttachments(attachmentsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/attachments`);
      }
      setUpdateTime("attachments", attachmentsUpdate);
    }
  }, [attachmentsUpdate, localAttachments, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (componentsUpdate > localComponents) {
      setLocalComponents(componentsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/components`);
      }
      setUpdateTime("components", componentsUpdate);
    }
  }, [componentsUpdate, localComponents, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (planetsUpdate > localPlanets) {
      setLocalPlanets(planetsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/planets`);
      }
      setUpdateTime("planets", planetsUpdate);
    }
  }, [planetsUpdate, localPlanets, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (factionsUpdate > localFactions) {
      setLocalFactions(factionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/factions`);
      }
      setUpdateTime("factions", factionsUpdate);
    }
  }, [factionsUpdate, localFactions, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (objectivesUpdate > localObjectives) {
      setLocalObjectives(objectivesUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/objectives`);
      }
      setUpdateTime("objectives", objectivesUpdate);
    }
  }, [objectivesUpdate, localObjectives, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (optionsUpdate > localOptions) {
      setLocalOptions(optionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/options`);
      }
      setUpdateTime("options", optionsUpdate);
    }
  }, [optionsUpdate, localOptions, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (strategycardsUpdate > localStrategyCards) {
      setLocalStrategyCards(strategycardsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/strategycards`);
      }
      setUpdateTime("strategycards", strategycardsUpdate);
    }
  }, [
    strategycardsUpdate,
    localStrategyCards,
    gameid,
    initialLoad,
    setUpdateTime,
  ]);

  useEffect(() => {
    if (stateUpdate > localState) {
      setLocalState(stateUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/state`);
      }
      setUpdateTime("state", stateUpdate);
    }
  }, [stateUpdate, localState, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (subStateUpdate > localSubState) {
      setLocalSubState(subStateUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/subState`);
      }
      setUpdateTime("subState", subStateUpdate);
    }
  }, [subStateUpdate, localSubState, gameid, initialLoad, setUpdateTime]);

  useEffect(() => {
    if (timersUpdate > localTimers) {
      setLocalTimers(timersUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/timers`);
      }
      setUpdateTime("timers", timersUpdate);
    }
  }, [timersUpdate, localTimers, gameid, initialLoad, setUpdateTime]);

  if (!updates) {
    return null;
  }

  if (initialLoad) {
    setLocalAgendas(agendasUpdate);
    setLocalAttachments(attachmentsUpdate);
    setLocalComponents(componentsUpdate);
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
