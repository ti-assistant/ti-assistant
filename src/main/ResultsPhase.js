import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React from "react";
import { SmallStrategyCard } from '../StrategyCard';
import { getOnDeckFaction } from '../util/helpers';
import { readyAllFactions } from '../util/api/factions';
import { fetcher, poster } from '../util/api/util';
import SummaryColumn from './SummaryColumn.js';
import { LawsInEffect } from '../LawsInEffect.js';
import { responsivePixels } from '../util/util.js';


export default function ResultsPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);  


  if (!factions || !state || !strategyCards) {
    return <div>Loading...</div>;
  }

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    const phase = "STATUS";
    let minCard = {
      order: Number.MAX_SAFE_INTEGER,
    };
    for (const strategyCard of Object.values(strategyCards)) {
      if (strategyCard.faction && strategyCard.order < minCard.order) {
        minCard = strategyCard;
      }
    }
    if (!minCard.faction) {
      throw Error("Transition to STATUS phase w/o selecting cards?");
    }
    const activeFactionName = minCard.faction;

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);

    readyAllFactions(mutate, gameid, factions);
  }

  const activeFaction = factions[state.activeplayer] ?? null;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);

  const numCards = orderedStrategyCards.length;

  return (
    <div className="flexRow" style={{gap: responsivePixels(20), height: "100vh", width: "100%", alignItems: "flex-start", justifyContent: "center"}}>
      <div className="flexColumn" style={{height: "100vh", flexShrink: 0,  width: responsivePixels(280)}}>
        <SummaryColumn order="VICTORY_POINTS" subOrder={state.finalPhase === "ACTION" || state.finalPhase === "STATUS" ? "INITIATIVE" : "SPEAKER"} />
      </div>
    </div>
  );
}