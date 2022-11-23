import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from "react";
import { FactionCard } from '../FactionCard.js'
import { StrategyCard } from '../StrategyCard';
import { getOnDeckFaction, getStrategyCardsForFaction } from '../util/helpers';
import { hasTech, unlockTech } from '../util/api/techs';
import { useStrategyCard } from '../util/api/cards';
import { passFaction, readyAllFactions } from '../util/api/factions';
import { fetcher, poster } from '../util/api/util';
import { SpeakerModal } from '../SpeakerModal';
import { BasicFactionTile } from '../FactionTile';
import { FactionTimer } from '../Timer';
import SummaryColumn from './SummaryColumn.js';

export default function ActionPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ showSpeakerModal, setShowSpeakerModal ] = useState(false);
  const [ selectedActions, setSelectedActions ] = useState([]);

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

  async function nextPlayer() {
    const data = {
      action: "ADVANCE_PLAYER",
    };
    
    const updatedState = {...state};
    const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
    state.activeplayer = onDeckFaction ? onDeckFaction.name : "None";

    const options = {
      optimisticData: updatedState,
    };
    return mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  const activeFaction = factions[state.activeplayer] ?? null;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);

  function canFactionPass(factionName) {
    for (const card of getStrategyCardsForFaction(orderedStrategyCards, factionName)) {
      if (!card.used && !selectedActions.includes(card.name)) {
        return false;
      }
    }
    return true;
  }

  function toggleAction(action) {
    let updatedActions = [...selectedActions];
    const index = updatedActions.indexOf(action);
    if (index === -1) {
      updatedActions.push(action);
    } else {
      updatedActions.splice(index, 1);
    }
    setSelectedActions(updatedActions);
  }

  async function completeActions(fleetLogistics = false) {
    if (selectedActions.length === 0) {
      return;
    }
    if (fleetLogistics && !hasTech(activeFaction, "Fleet Logistics")) {
      unlockTech(mutate, gameid, factions, activeFaction.name, "Fleet Logistics");
    }
    for (const action of selectedActions) {
      if (strategyCards[action]) {
        useStrategyCard(mutate, gameid, strategyCards, action);
      }
      if (action === "Pass") {
        await passFaction(mutate, gameid, factions, activeFaction.name);
      }
    }
    nextPlayer();
    setSelectedActions([]);
  }

  function nextPlayerButtons() {
    const completeFunction = selectedActions.includes("Politics") ? () => setShowSpeakerModal(true) : completeActions;
    switch (selectedActions.length) {
      case 0:
        return <button disabled>Next Player</button>
      case 1:
        return <button onClick={() => completeFunction()}>Next Player</button>
      case 2:
        if (!hasTech(activeFaction, "Fleet Logistics")) {
          return <div className="flexColumn" style={{gap: "8px"}}>
            <button onClick={() => completeFunction(true)}>Next Player (using Fleet Logistics)</button>
            <button onClick={() => completeFunction()}>Next Player (using Master Plan)</button>
          </div>
        }
        return <button onClick={() => completeFunction(true)}>Next Player (using Fleet Logistics)</button>
      case 3:
        return <button onClick={() => completeFunction(true)}>Next Player (using Fleet Logistics and Master Plan)</button>
      case 4:
        return <button onClick={() => completeFunction(true)}>Next Player (using Fleet Logistics, Master Plan, and The Codex?)</button>
    }
    throw new Error("Too many actions selected");
  }

  function speakerSelectionComplete(selected) {
    if (selected && selectedActions.includes("Politics")) {
      completeActions()
    }
    setShowSpeakerModal(false);
  }

  function FactionActions({}) {
    if  (!activeFaction) {
      return null;
    }
    return <div className="flexColumn" style={{gap: "8px"}}>
      <div style={{fontSize: "28px"}}>Select Actions</div>
      <div className="flexColumn" style={{padding: "0px 8px", gap: "12px", fontSize: "24px", alignItems: "flex-start"}}>
      {getStrategyCardsForFaction(orderedStrategyCards, activeFaction.name).map((card) => {
        if (card.used) {
          return null
        }
        return (
          <button key={card.name} className={selectedActions.includes(card.name) ? "selected" : ""} style={{fontSize: "24px"}} onClick={() => toggleAction(card.name)}>
            {card.name}
          </button>
        );
      })}
      <button className={selectedActions.includes("Tactical") ? "selected" : ""} style={{fontSize: "24px"}} onClick={() => toggleAction("Tactical")}>
        Tactical/Component
      </button>
      <button className={selectedActions.includes("Pass") ? "selected" : ""} style={{fontSize: "24px"}} 
        disabled={!canFactionPass(activeFaction.name)} onClick={() => toggleAction("Pass")}>
        Pass
      </button>
    </div>
  </div>
  }

  return (
    <div className="flexRow" style={{height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <SpeakerModal forceSelection={selectedActions.includes("Politics")} visible={showSpeakerModal} onComplete={speakerSelectionComplete} />
      <div className="flexColumn" style={{flexBasis: "30%", gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "500px"}}>
        <div className="flexRow">Initiative Order</div>
        {orderedStrategyCards.map((card) => {
          return <StrategyCard key={card.name} card={card} active={!card.used} opts={{noColor: true}} />
        })}
      </div>
      <div className="flexColumn" style={{flexBasis: "45%", gap: "16px"}}>
        <div className="flexRow" style={{gap: "8px"}}>
          {activeFaction ?
          <div className="flexColumn" style={{alignItems: "center", gap: "12px"}}>
            Active Player
            <FactionCard faction={activeFaction} content={
              <div className="flexColumn" style={{gap: "8px", paddingBottom: "12px", minWidth: "360px"}}>
              <FactionTimer key={activeFaction.name} factionName={activeFaction.name} />
              <FactionActions />
              </div>
            } opts={{iconSize: 60, fontSize: "32px"}} />
            {nextPlayerButtons()}
          </div>
          : <div style={{fontSize: "42px"}}>Action Phase Complete</div>}
          {onDeckFaction ? 
            <div className="flexColumn" style={{alignItems: "center", gap: "8px", minWidth: "120px", alignItems: "stretch"}}>
              <div className="flexRow">On Deck</div>
              <BasicFactionTile faction={onDeckFaction} opts={{fontSize: "20px"}}/>
            </div>
          : null}
        </div>
        {!activeFaction ? 
          <button onClick={() => nextPhase()}>Advance to Status Phase</button>
        : null}
      </div>
      <div className="flexColumn" style={{flexBasis: "25%", maxWidth: "400px"}}>
        <SummaryColumn />
      </div>
    </div>
  );
}