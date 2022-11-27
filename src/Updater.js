import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "./util/api/util";

export function Updater({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: updates } = useSWR(gameid ? `/api/${gameid}/updates` : null, fetcher, {
    refreshInterval: 5000,
  });

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
    }
  }, [attachmentsUpdate]);

  useEffect(() => {
    if (planetsUpdate > localPlanets) {
      setLocalPlanets(planetsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/planets`, fetcher(`/api/${gameid}/planets`));
      }
    }
  }, [planetsUpdate]);

  useEffect(() => {
    if (factionsUpdate > localFactions) {
      setLocalFactions(factionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/factions`, fetcher(`/api/${gameid}/factions`));
      }
    }
  }, [factionsUpdate]);

  useEffect(() => {
    if (optionsUpdate > localOptions) {
      setLocalOptions(optionsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/options`, fetcher(`/api/${gameid}/options`));
      }
    }
  }, [optionsUpdate]);

  useEffect(() => {
    if (strategycardsUpdate > localStrategyCards) {
      setLocalStrategyCards(strategycardsUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/strategycards`, fetcher(`/api/${gameid}/strategycards`));
      }
    }
  }, [strategycardsUpdate]);

  useEffect(() => {
    if (stateUpdate > localState) {
      setLocalState(stateUpdate);
      if (!initialLoad) {
        mutate(`/api/${gameid}/state`, fetcher(`/api/${gameid}/state`));
      }
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
