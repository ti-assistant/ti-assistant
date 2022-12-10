import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useBetween } from "use-between";
import { fetcher } from "./util/api/util";

const useUpdater = () => {
  const [updateObject, setUpdateObject] = useState({});

  const setUpdateTime = useCallback((endpoint, time) => {
    setUpdateObject({
      ...updateObject,
      [endpoint]: time,
    });
  });
  return {
    updateObject,
    setUpdateTime,
  };
};

export const useSharedUpdateTimes = () => useBetween(useUpdater);

export function Updater({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: updates } = useSWR(gameid ? `/api/${gameid}/updates` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { updateObject, setUpdateTime } = useSharedUpdateTimes();

  const [ initialLoad, setInitialLoad ] = useState(true);

  const [ localAgendas, setLocalAgendas ] = useState(0);
  const [ localAttachments, setLocalAttachments ] = useState(0);
  const [ localOptions, setLocalOptions ] = useState(0);
  const [ localPlanets, setLocalPlanets ] = useState(0);
  const [ localFactions, setLocalFactions ] = useState(0);
  const [ localState, setLocalState ] = useState(0);
  const [ localStrategyCards, setLocalStrategyCards ] = useState(0);

  const localUpdates = updates ?? {};
  const agendasUpdate = (localUpdates.agendas ?? {}).timestamp ?? 0;
  const attachmentsUpdate = (localUpdates.attachments ?? {}).timestamp ?? 0;
  const factionsUpdate = (localUpdates.factions ?? {}).timestamp ?? 0;
  const optionsUpdate = (localUpdates.options ?? {}).timestamp ?? 0;
  const planetsUpdate = (localUpdates.planets ?? {}).timestamp ?? 0;
  const strategycardsUpdate = (localUpdates.strategycards ?? {}).timestamp ?? 0;
  const stateUpdate = (localUpdates.state ?? {}).timestamp ?? 0;

  useEffect(() => {
    if (updateObject.agendas > localAgendas) {
      setLocalAgendas(updateObject.agendas);
    }
    if (updateObject.attachments > localAttachments) {
      setLocalAttachments(updateObject.attachments);
    }
    if (updateObject.options > localOptions) {
      setLocalOptions(updateObject.options);
    }
    if (updateObject.planets > localPlanets) {
      setLocalPlanets(updateObject.planets);
    }
    if (updateObject.factions > localFactions) {
      setLocalFactions(updateObject.factions);
    }
    if (updateObject.state > localState) {
      setLocalState(updateObject.state);
    }
    if (updateObject.strategycards > localStrategyCards) {
      setLocalStrategyCards(updateObject.strategycards);
    }
  }, [updateObject]);

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

  if (!updates) {
    return null;
  }

  if (initialLoad) {
    setLocalAgendas(agendasUpdate);
    setLocalAttachments(attachmentsUpdate);
    setLocalPlanets(planetsUpdate);
    setLocalFactions(factionsUpdate);
    setLocalOptions(optionsUpdate);
    setLocalStrategyCards(strategycardsUpdate);
    setLocalState(stateUpdate);
    setInitialLoad(false);
  }

  return null;
}
