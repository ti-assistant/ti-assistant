import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React, { useEffect, useRef, useState } from "react";
import { FactionCard } from '../FactionCard.js'
import { StrategyCard } from '../StrategyCard';
import { getOnDeckFaction, getStrategyCardsForFaction } from '../util/helpers';
import { hasTech, unlockTech } from '../util/api/techs';
import { useStrategyCard } from '../util/api/cards';
import { passFaction, readyAllFactions } from '../util/api/factions';
import { fetcher, poster } from '../util/api/util';
import { SpeakerModal } from '../SpeakerModal';
import { FactionTimer } from '../Timer';
import SummaryColumn from './SummaryColumn.js';
import { LawsInEffect } from '../LawsInEffect.js';
import { useSharedUpdateTimes } from '../Updater.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { PlanetRow } from '../PlanetRow.js';
import { ObjectiveRow } from '../ObjectiveRow.js';
import { claimPlanet } from '../util/api/planets.js';
import { scoreObjective } from '../util/api/objectives.js';
import { LabeledDiv } from '../LabeledDiv.js';
import { HoverMenu } from '../HoverMenu.js';
import { setSpeaker } from '../util/api/state.js';
import { TechRow } from '../TechRow.js';

function ActivePlayerColumn({activeFaction}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const [ showSpeakerModal, setShowSpeakerModal ] = useState(false);
  const [ selectedAction, setSelectedAction ] = useState(null);
  const { setUpdateTime } = useSharedUpdateTimes();

  const [ subState, setSubState ] = useState({});

  
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);
  async function completeActions(fleetLogistics = false) {
    if (selectedAction === null) {
      return;
    }
    if (fleetLogistics && !hasTech(activeFaction, "Fleet Logistics")) {
      unlockTech(mutate, setUpdateTime, gameid, factions, activeFaction.name, "Fleet Logistics");
    }
    finalizeAction();
    await nextPlayer();
  }

  async function finalizeAction() {
    if (selectedAction === null) {
      return;
    }
    (subState.planets ?? []).forEach((planet) => {
      claimPlanet(mutate, setUpdateTime, gameid, planets, planet.name, activeFaction.name);
    });
    (subState.objectives ?? []).forEach((objective) => {
      scoreObjective(mutate, setUpdateTime, gameid, objectives, activeFaction.name, objective.name);
    });
    (subState.techs ?? []).forEach((tech) => {
      unlockTech(mutate, setUpdateTime, gameid, factions, activeFaction.name, tech.name);
    });
    if (!!subState.speaker) {
      setSpeaker(mutate, setUpdateTime, gameid, state, subState.speaker, factions);
    }

    if (strategyCards[selectedAction]) {
      useStrategyCard(mutate, setUpdateTime, gameid, strategyCards, selectedAction);
    }
    if (selectedAction === "Pass") {
      await passFaction(mutate, setUpdateTime, gameid, factions, activeFaction.name);
    }

    // TODO: SubState needs to be saved to the backend.
    setSubState({});
    setSelectedAction(null);
  }

  function isTurnComplete() {
    switch (selectedAction) {
      case "Politics":
        return !!subState.speaker;
      case "Technology":
        return (subState.techs ?? []).length > 0;
    }
    return selectedAction !== null;
  }

  function nextPlayerButtons() {
    // const completeFunction = selectedAction === "Politics" ? () => setShowSpeakerModal(true) : completeActions;
    if (!isTurnComplete()) {
        return (
          <div className="flexRow" style={{gap: "8px"}}>
            <button disabled>Take Another Action</button>
            <button disabled>Next Player</button>
          </div>
        );
    } else {
      return (
        <div className="flexRow" style={{gap: "8px"}}>
          <button onClick={finalizeAction}>Take Another Action</button>
          <button onClick={completeActions}>Next Player</button>
        </div>
      );
    }
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
    return mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), options);
  }

  function speakerSelectionComplete(selected) {
    if (selected) {
      completeActions();
    }
    setShowSpeakerModal(false);
  }
  function canFactionPass(factionName) {
    for (const card of getStrategyCardsForFaction(orderedStrategyCards, factionName)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  function toggleAction(action) {
    if (selectedAction === action) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
    setSubState({});
  }

  function FactionActions({}) {
    if  (!activeFaction) {
      return null;
    }
    return <div className="flexColumn" style={{gap: "8px"}}>
      <div style={{fontSize: "28px"}}>Select Action</div>
      <div className="flexRow" style={{padding: "0px 8px", gap: "12px", fontSize: "24px", alignItems: "flex-start"}}>
      {getStrategyCardsForFaction(orderedStrategyCards, activeFaction.name).map((card) => {
        if (card.used) {
          return null
        }
        return (
          <button key={card.name} className={selectedAction === card.name ? "selected" : ""} style={{fontSize: "24px"}} onClick={() => toggleAction(card.name)}>
            {card.name}
          </button>
        );
      })}
      <button className={selectedAction === "Tactical" ? "selected" : ""} style={{fontSize: "24px"}} onClick={() => toggleAction("Tactical")}>
        Tactical
      </button>
      <button className={selectedAction === "Component" ? "selected" : ""} style={{fontSize: "24px"}} onClick={() => toggleAction("Component")}>
        Component
      </button>
      <button className={selectedAction === "Pass" ? "selected" : ""} style={{fontSize: "24px"}} 
        disabled={!canFactionPass(activeFaction.name)} onClick={() => toggleAction("Pass")}>
        Pass
      </button>
    </div>
  </div>
  }

  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if ((planet.owners ?? []).includes(activeFaction.name)) {
      return false;
    }
    const claimedPlanetNames = (subState.planets ?? []).map((planet) => planet.name);
    if (claimedPlanetNames.includes(planet.name)) {
      return false;
    }
    if ((subState.planets ?? []).length > 0) {
      if (subState.planets[0].system) {
        return planet.system === subState.planets[0].system;
      }
      if (subState.planets[0].faction) {
        return planet.faction === subState.planets[0].faction;
      }
      return false;
    }
    return true;
  });

  const scorableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    if ((objective.scorers ?? []).includes(activeFaction.name)) {
      return false;
    }
    const scoredObjectiveNames = (subState.objectives ?? []).map((objective) => objective.name);
    if (scoredObjectiveNames.includes(objective.name)) {
      return false;
    }
    if (objective.name === "Become a Martyr" || objective.name === "Prove Endurance") {
      return false;
    }
    return objective.type === "secret" && objective.phase === "action";
  });

  const researchableTechs = Object.values(techs ?? {}).filter((tech) => {
    if (hasTech(activeFaction, tech.name)) {
      return false;
    }
    if (tech.faction && activeFaction.name !== tech.faction) {
      return false;
    }
    const researchedTechNames = (subState.techs ?? []).map((tech) => tech.name);
    if (researchedTechNames.includes(tech.name)) {
      return false;
    }
    return true;
  });

  const numColumns = Math.ceil(claimablePlanets.length / 13);
  const width = numColumns * 102 + (numColumns - 1) * 4 + 16;

  const targetButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: "8px",
    flexWrap: "wrap",
    maxHeight: "400px",
    alignItems: "stretch",
    gap: "4px",
  };

  function removePlanet(toRemove) {
    setSubState({
      ...subState,
      planets: (subState.planets ?? []).filter((planet) => planet.name !== toRemove),
    });
  }

  function addPlanet(toAdd) {
    setSubState({
      ...subState,
      planets: [...(subState.planets ?? []), toAdd],
    });
  }

  function addObjective(toScore) {
    setSubState({
      ...subState,
      objectives: [...(subState.objectives ?? []), toScore],
    });
  }
  
  function undoObjective(toRemove) {
    setSubState({
      ...subState,
      objectives: (subState.objectives ?? []).filter((objective) => objective.name !== toRemove),
    });
  }

  function removeTech(toRemove) {
    setSubState({
      ...subState,
      techs: (subState.techs ?? []).filter((tech) => tech.name !== toRemove),
    });
  }

  function addTech(toAdd) {
    setSubState({
      ...subState,
      techs: [...(subState.techs ?? []), toAdd],
    });
  }

  function AdditionalActions({visible}) {
    switch (selectedAction) {
      case "Technology":
        return (
          <React.Fragment>
            <LabeledDiv label="PRIMARY" content={
              <React.Fragment>
                <div className='flexColumn' style={{alignItems: "stretch"}}>
                {(subState.techs ?? []).map((tech) => {
                  return <TechRow key={tech.name} tech={tech} removeTech={removeTech} />
                })}
                </div>
                {researchableTechs.length > 0 && (subState.techs ?? []).length < 2 ?
                <HoverMenu label="Research Tech" style={{width: "1100px", minHeight: "400px"}} content={
                  <div className="flexRow" style={{padding: "8px", alignItems: "flex-start", gap: "8px"}}>
                    <HoverMenu label="Warfare" style={{width: "210px"}} content={
                      <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
                      {researchableTechs.filter((tech) => tech.type === "red")
                        .map((tech) => {
                          return <button key={tech.name} style={{width: "180px"}} onClick={() => addTech(tech)}>{tech.name}</button>
                        })}
                    </div>
                    } />
                    <HoverMenu label="Propulsion" style={{width: "210px"}} content={
                      <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
                      {researchableTechs.filter((tech) => tech.type === "blue")
                        .map((tech) => {
                          return <button key={tech.name} style={{width: "180px"}} onClick={() => addTech(tech)}>{tech.name}</button>
                        })}
                    </div>
                    } />
                    <HoverMenu label="Cybernetic" style={{width: "210px"}} content={
                      <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
                      {researchableTechs.filter((tech) => tech.type === "yellow")
                        .map((tech) => {
                          return <button key={tech.name} style={{width: "180px"}} onClick={() => addTech(tech)}>{tech.name}</button>
                        })}
                    </div>
                    } />
                    <HoverMenu label="Biotic" style={{width: "210px"}} content={
                      <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
                      {researchableTechs.filter((tech) => tech.type === "green")
                        .map((tech) => {
                          return <button key={tech.name} style={{width: "180px"}} onClick={() => addTech(tech)}>{tech.name}</button>
                        })}
                    </div>
                    } />
                    <HoverMenu label="Unit Upgrades" style={{width: "210px"}} content={
                      <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
                      {researchableTechs.filter((tech) => tech.type === "upgrade")
                        .map((tech) => {
                          return <button key={tech.name} style={{width: "180px"}} onClick={() => addTech(tech)}>{tech.name}</button>
                        })}
                    </div>
                    } />
                  </div>
                } /> : null}
              </React.Fragment>} />
              <LabeledDiv label="SECONDARY" content={
                Object.values((factions ?? {})).map((faction) => {
                  return <div>
                    {faction.name}
                    <HoverMenu label="Research Tech" content={<div>Testing</div>} />
                  </div>
                })
                // <HoverMenu label="Research Tech" style={{width: "1100px", minHeight: "400px"}} content={
                //   <div>Testing</div>
                // } />
              } />
            </React.Fragment>
        );
      case "Diplomacy":
        if (activeFaction.name === "Xxcha Kingdom") {
          return (
            <React.Fragment>
              <LabeledDiv label="PEACE ACCORDS" content={           
                <React.Fragment>
                  <div className='flexColumn' style={{alignItems: "stretch"}}>
                  {(subState.planets ?? []).map((planet) => {
                    return <PlanetRow key={planet.name} planet={planet} removePlanet={removePlanet} />
                  })}
                  </div>
                  {claimablePlanets.length > 0 && (subState.planets ?? []).length === 0  ?
                  <HoverMenu label="Conquer Planet" style={{width: width, minWidth: "160px"}} content={
                    <div className="flexColumn" style={targetButtonStyle}>
                      {claimablePlanets.map((planet) => {
                        return (
                          <button key={planet.name} style={{width: "90px"}} onClick={() => addPlanet(planet)}>{planet.name}</button>);
                      })}
                    </div>} /> : null}
                </React.Fragment>}
              />
            </React.Fragment>
          );
        }
      case "Leadership":
      case "Diplomacy":
        // TODO: Display additional button for Xxcha.
      case "Politics":
        // TODO: Display select speaker button.
      case "Construction":
      case "Trade":
      case "Warfare":
        // TODO: Display tech select buttons.
      case "Imperial":
        // TODO: Display buttons for various actions.
      case "Component":
      case "Pass":
        // TODO: If last player to pass, display secret obj.
        return (
          <div>
            <button>Take Another Action</button>
          </div>
        );
      case "Tactical":
        return (
          <React.Fragment>
            <LabeledDiv label="CONQUERED PLANETS" content={           
              <React.Fragment>
                <div className='flexColumn' style={{alignItems: "stretch"}}>
                {(subState.planets ?? []).map((planet) => {
                  return <PlanetRow key={planet.name} planet={planet} removePlanet={removePlanet} />
                })}
                </div>
                {claimablePlanets.length > 0 ?
                <HoverMenu label="Conquer Planet" style={{width: width, minWidth: "160px"}} content={
                  <div className="flexColumn" style={targetButtonStyle}>
                    {claimablePlanets.map((planet) => {
                      return (
                        <button key={planet.name} style={{width: "90px"}} onClick={() => addPlanet(planet)}>{planet.name}</button>);
                    })}
                  </div>} /> : null}
              </React.Fragment>} />
            <LabeledDiv label="SCORED SECRETS" content={           
              <React.Fragment>
          <div className='flexColumn' style={{alignItems: "stretch"}}>
          {(subState.objectives ?? []).map((objective) => {
            return <ObjectiveRow key={objective.name} objective={objective} removeObjective={undoObjective} />
          })}
          </div>
          {scorableObjectives.length > 0 && (subState.objectives ?? []).length < 4 ?
          <HoverMenu label="Score Secret Objective" style={{width: "260px"}} content={
            <div className="flexColumn" style={{...targetButtonStyle, maxHeight: "600px"}}>
                {scorableObjectives.map((objective) => {
                  return (
                    <button key={objective.name} style={{width: "230px"}} onClick={() => addObjective(objective)}>{objective.name}</button>);
                })}
            </div>} /> : null}
          </React.Fragment>} />
        </React.Fragment>);
        // TODO: Display tech section for Nekro
    }
    return (
      <div style={{display: visible ? "flex" : "none"}}>
        Testing
      </div>
    )
  }


  return (<div className="flexColumn" style={{width: "100%", alignItems: "center", gap: "12px"}}>
    <SpeakerModal forceSelection={selectedAction === "Politics"} visible={showSpeakerModal} onComplete={speakerSelectionComplete} />
  Active Player
  <SwitchTransition>
    <CSSTransition
      key={activeFaction.name}
      timeout={500}
      classNames="fade">
      <FactionCard faction={activeFaction} content={
        <div className="flexColumn" style={{gap: "8px", paddingBottom: "12px", minWidth: "480px"}}>
          <FactionTimer factionName={activeFaction.name} />
          <FactionActions />
          <AdditionalActions visible={selectedAction !== null} />
        </div>
      } opts={{iconSize: 60, fontSize: "32px"}} />
      </CSSTransition>
    </SwitchTransition>
    {nextPlayerButtons()}
  </div>);
}

export default function ActionPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  const { setUpdateTime } = useSharedUpdateTimes();

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

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), options);

    readyAllFactions(mutate, setUpdateTime, gameid, factions);
  }

  const activeFaction = factions[state.activeplayer] ?? null;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);

  return (
    <div className="flexRow" style={{height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <div className="flexColumn" style={{flexBasis: "30%", gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "500px"}}>
        <div className="flexRow">Initiative Order</div>
        {orderedStrategyCards.map((card) => {
          return <StrategyCard key={card.name} card={card} active={!card.used} opts={{noColor: true}} />
        })}
        <LawsInEffect />
      </div>
      <div className="flexColumn" style={{flexBasis: "45%", gap: "16px"}}>
        <div className="flexRow" style={{gap: "8px", width: "100%"}}>
          {activeFaction ?
            <ActivePlayerColumn activeFaction={activeFaction} />
          : <div style={{fontSize: "42px"}}>Action Phase Complete</div>}
          {/* {onDeckFaction ? 
            <div className="flexColumn" style={{alignItems: "center", gap: "8px", minWidth: "120px", alignItems: "stretch"}}>
              <div className="flexRow">On Deck</div>
              <BasicFactionTile faction={onDeckFaction} opts={{fontSize: "20px"}}/>
            </div>
          : null} */}
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