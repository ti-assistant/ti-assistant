import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React, { useEffect, useRef, useState } from "react";
import { FactionCard, FactionSymbol } from '../FactionCard.js'
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
import { removeObjective, scoreObjective } from '../util/api/objectives.js';
import { LabeledDiv } from '../LabeledDiv.js';
import { HoverMenu } from '../HoverMenu.js';
import { setSpeaker } from '../util/api/state.js';
import { TechIcon, TechRow } from '../TechRow.js';
import { BasicFactionTile } from '../FactionTile.js';
import { getFactionColor, getFactionName } from '../util/factions.js';
import { getTechColor } from '../util/techs.js';
import { TechSelectHoverMenu } from './util/TechSelectHoverMenu.js';
import { SelectableRow } from '../SelectableRow.js';

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
    await finalizeAction();
    nextPlayer();
  }

  async function finalizeAction() {
    if (selectedAction === null) {
      return;
    }
    Object.entries(subState.factions ?? {}).forEach(([factionName, updates]) => {
      (updates.planets ?? []).forEach((planet) => {
        claimPlanet(mutate, setUpdateTime, gameid, planets, planet.name, factionName);
      });
      (updates.techs ?? []).forEach((tech) => {
        unlockTech(mutate, setUpdateTime, gameid, factions, factionName, tech.name);
      });
      (updates.objectives ?? []).forEach((objective) => {
        scoreObjective(mutate, setUpdateTime, gameid, objectives, factionName, objective.name);
      });
    });
    if (!!subState.speaker) {
      setSpeaker(mutate, setUpdateTime, gameid, state, subState.speaker.name, factions);
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
        return activeFaction.name === "Nekro Virus" ||
          (((subState.factions ?? {})[activeFaction.name] ?? {}).techs ?? []).length > 0;
    }
    return selectedAction !== null;
  }

  function nextPlayerButtons() {
    // const completeFunction = selectedAction === "Politics" ? () => setShowSpeakerModal(true) : completeActions;
    if (!isTurnComplete()) {
        return (
          <div className="flexRow" style={{gap: "8px"}}>
            <button disabled style={{fontSize: "24px"}} >Take Another Action</button>
            <button disabled style={{fontSize: "24px"}} >End Turn</button>
          </div>
        );
    } else {
      return (
        <div className="flexRow" style={{gap: "8px"}}>
          <button disabled={selectedAction === "Pass" ? true : false} onClick={finalizeAction} style={{fontSize: "24px"}} >Take Another Action</button>
          <button onClick={completeActions} style={{fontSize: "24px"}} >End Turn</button>
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
    updatedState.activeplayer = onDeckFaction ? onDeckFaction.name : "None";

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
  const claimedPlanets = (((subState.factions ?? {})[activeFaction.name] ?? {}).planets ?? []);
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if ((planet.owners ?? []).includes(activeFaction.name)) {
      return false;
    }
    const claimedPlanetNames = claimedPlanets.map((planet) => planet.name);
    if (claimedPlanetNames.includes(planet.name)) {
      return false;
    }
    if (claimedPlanets.length > 0) {
      if (claimedPlanets[0].system) {
        return planet.system === claimedPlanets[0].system;
      }
      if (claimedPlanets[0].faction) {
        return planet.faction === claimedPlanets[0].faction;
      }
      return false;
    }
    return true;
  });

  const scoredObjectives = ((subState.factions ?? {})[activeFaction.name] ?? {}).objectives ?? [];
  const scorableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    if ((objective.scorers ?? []).includes(activeFaction.name)) {
      return false;
    }
    const scoredObjectiveNames = scoredObjectives.map((objective) => objective.name);
    if (scoredObjectiveNames.includes(objective.name)) {
      return false;
    }
    if (objective.name === "Become a Martyr" || objective.name === "Prove Endurance") {
      return false;
    }
    return objective.type === "secret" && objective.phase === "action";
  });

  function getResearchableTechs(faction) {
    const replaces = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.name)) {
        return false;
      }
      if (faction.name !== "Nekro Virus" && tech.faction && faction.name !== tech.faction) {
        return false;
      }
      const researchedTechs = ((subState.factions ?? {})[faction.name] ?? {}).techs ?? [];
      const researchedTechNames = researchedTechs.map((tech) => tech.name);
      if (researchedTechNames.includes(tech.name)) {
        return false;
      }
      if (tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.name !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.name));
    }
    return availableTechs;  
  }

  const researchableTechs = getResearchableTechs(activeFaction);

  const numColumns = Math.ceil(claimablePlanets.length / 13);
  const width = numColumns * 102 + (numColumns - 1) * 4 + 16;

  const targetButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: "8px",
    flexWrap: "wrap",
    maxHeight: "400px",
    maxWidth: "800px",
    alignItems: "stretch",
    gap: "4px",
    writingMode: "vertical-lr",
    justifyContent: "flex-start",
  };

  const secretButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: "8px",
    alignItems: "stretch",
    gap: "4px",
  };

  function removePlanet(factionName, toRemove) {
    const updatedState = {...subState};
    if (!updatedState.factions || !updatedState.factions[factionName]) {
      return;
    }
    if (!updatedState.factions[factionName].planets) {
      return;
    }
    updatedState.factions[factionName].planets = updatedState.factions[factionName].planets.filter((planet) => planet.name !== toRemove);
    setSubState(updatedState);
  }

  function addPlanet(factionName, toAdd) {
    const updatedState = {...subState};
    if (!updatedState.factions) {
      updatedState.factions = {};
    }
    if (!updatedState.factions[factionName]) {
      updatedState.factions[factionName] = {};
    }
    if (!updatedState.factions[factionName].planets) {
      updatedState.factions[factionName].planets = [];
    }
    updatedState.factions[factionName].planets.push(toAdd);
    setSubState(updatedState);
  }

  function addObjective(factionName, toScore) {
    const updatedState = {...subState};
    if (!updatedState.factions) {
      updatedState.factions = {};
    }
    if (!updatedState.factions[factionName]) {
      updatedState.factions[factionName] = {};
    }
    if (!updatedState.factions[factionName].objectives) {
      updatedState.factions[factionName].objectives = [];
    }
    updatedState.factions[factionName].objectives.push(toScore);
    setSubState(updatedState);
  }
  
  function undoObjective(factionName, toRemove) {
    const updatedState = {...subState};
    if (!updatedState.factions || !updatedState.factions[factionName]) {
      return;
    }
    if (!updatedState.factions[factionName].objectives) {
      return;
    }
    updatedState.factions[factionName].objectives = updatedState.factions[factionName].objectives.filter((objective) => objective.name !== toRemove);
    setSubState(updatedState);
  }

  function removeTech(factionName, toRemove) {
    const updatedState = {...subState};
    if (!updatedState.factions || !updatedState.factions[factionName]) {
      return;
    }
    if (!updatedState.factions[factionName].techs) {
      return;
    }
    updatedState.factions[factionName].techs = updatedState.factions[factionName].techs.filter((tech) => tech.name !== toRemove);
    setSubState(updatedState);
  }

  function addTech(factionName, tech) {
    const updatedState = {...subState};
    if (!updatedState.factions) {
      updatedState.factions = {};
    }
    if (!updatedState.factions[factionName]) {
      updatedState.factions[factionName] = {};
    }
    if (!updatedState.factions[factionName].techs) {
      updatedState.factions[factionName].techs = [];
    }
    updatedState.factions[factionName].techs.push(tech);
    setSubState(updatedState);
  }

  function selectSpeaker(faction) {
    setSubState({
      ...subState,
      speaker: faction,
    });
  }
  function resetSpeaker() {
    setSubState({
      ...subState,
      speaker: null,
    });
  }

  function lastFaction() {
    const numFactions = Object.keys(factions ?? {}).length;
    const numPassed = Object.values(factions ?? {}).filter((faction) => faction.passed).length;
    return numFactions - 1 === numPassed;
  }

  function AdditionalActions({visible}) {
    const orderedFactions = Object.values(factions).sort((a, b) => {
      if (a.order === activeFaction.order) {
        return -1;
      }
      if (b.order === activeFaction.order) {
        return 1;
      }
      if (a.order < activeFaction.order) {
        if (b.order < activeFaction.order) {
          return a.order - b.order;
        }
        return 1;
      }
      if (b.order > activeFaction.order) {
        return a.order - b.order;
      }
      return -1;
    });
    switch (selectedAction) {
      case "Technology":
        const researchedTech = ((subState.factions ?? {})[activeFaction.name] ?? {}).techs ?? [];
        return (
          <React.Fragment>
            {activeFaction.name !== "Nekro Virus" ? <LabeledDiv label="PRIMARY" style={{width: "90%"}} content={
              <React.Fragment>
                {researchedTech.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
                {researchedTech.map((tech) => {
                  return <TechRow key={tech.name} tech={tech} removeTech={(techName) => removeTech(activeFaction.name, techName)} />
                })}
                </div> : null}
                {researchedTech.length < 2 ?
                  <TechSelectHoverMenu techs={researchableTechs} selectTech={(tech) => addTech(activeFaction.name, tech)} />
                : null}
              </React.Fragment>} /> : null}
              <LabeledDiv label="SECONDARY" style={{width: "90%"}} content={
                <div className="flexColumn" style={{width: "100%"}}>
                {orderedFactions.map((faction) => {
                  if (faction.name === activeFaction.name || faction.name === "Nekro Virus") {
                    return null;
                  }
                  let maxTechs = 1;
                  if (faction.name === "Universities of Jol-Nar") {
                    maxTechs = 2;
                    // TODO: Add ability for people to copy them.
                  }
                  const researchedTechs = (((subState.factions ?? {})[faction.name] ?? {}).techs ?? []);
                  const availableTechs = getResearchableTechs(faction);
                  return (
                    <LabeledDiv key={faction.name} label={
                      <div className="flexRow" style={{gap: "4px"}}>{getFactionName(faction)}<FactionSymbol faction={faction.name} size={16} /></div>
                    } color={getFactionColor(faction)} style={{width: "100%"}}>
                      <React.Fragment>
                      {researchedTechs.map((tech) => {
                        return <TechRow key={tech.name} tech={tech} removeTech={(techName) => removeTech(faction.name, techName)} />
                      })}
                      {researchedTechs.length < maxTechs ?
                        <TechSelectHoverMenu techs={availableTechs} selectTech={(tech) => addTech(faction.name, tech)} />
                      : null}
                      </React.Fragment>
                      </LabeledDiv>
                  );
                })}
                </div>
              } />
            </React.Fragment>
        );
      case "Politics":
        return (
          <React.Fragment>
            <LabeledDiv label="NEW SPEAKER" style={{width: "90%"}} content={           
              <React.Fragment>
                <div className='flexColumn' style={{alignItems: "stretch"}}>
                {subState.speaker ? 
                  <SelectableRow itemName={subState.speaker.name} removeItem={resetSpeaker} content={
                    <BasicFactionTile faction={subState.speaker} />
                  } />
                : null}
                {/* {(subState.speaker ?? []).map((planet) => {
                  return <PlanetRow key={planet.name} planet={planet} removePlanet={removePlanet} />
                })} */}
                </div>
                {!subState.speaker  ?
                <HoverMenu label="Select Speaker" style={{minWidth: "160px"}} content={
                  <div className="flexRow" style={targetButtonStyle}>
                    {orderedFactions.map((faction) => {
                      if (state.speaker === faction.name) {
                        return null;
                      }
                      return (
                        <button key={faction.name} style={{width: "160px"}} onClick={() => selectSpeaker(faction)}>{faction.name}</button>);
                    })}
                  </div>} /> : null}
              </React.Fragment>}
            />
          </React.Fragment>
        );
      case "Diplomacy":
        if (activeFaction.name === "Xxcha Kingdom") {
          return (
            <React.Fragment>
              <LabeledDiv label="PEACE ACCORDS" style={{width: "90%"}} content={           
                <React.Fragment>
                  <div className='flexColumn' style={{alignItems: "stretch"}}>
                  {claimedPlanets.map((planet) => {
                    return <PlanetRow key={planet.name} planet={planet} removePlanet={() => removePlanet(activeFaction.name, planet.name)} />
                  })}
                  </div>
                  {claimablePlanets.length > 0 && claimedPlanets.length === 0  ?
                  <HoverMenu label="Conquer Planet" style={{minWidth: "160px"}} content={
                    <div className="flexRow" style={targetButtonStyle}>
                      {claimablePlanets.map((planet) => {
                        return (
                          <button key={planet.name} style={{width: "90px"}} onClick={() => addPlanet(activeFaction.name, planet)}>{planet.name}</button>);
                      })}
                    </div>} /> : null}
                </React.Fragment>}
              />
            </React.Fragment>
          );
        }
      case "Leadership":
      case "Construction":
      case "Trade":
      case "Warfare":
        return null;
      case "Imperial":
        let hasImperialPoint = false;
        scoredObjectives.forEach((objective) => {
          if (objective.name === "Imperial Point") {
            hasImperialPoint = true;
          }
        });
        const availablePublicObjectives = Object.values(objectives ?? {}).filter((objective) => {
          if ((objective.scorers ?? []).includes(activeFaction.name)) {
            return false;
          }
          if (!objective.selected) {
            return false;
          }
          return (objective.type === "stage-one" || objective.type === "stage-two");
        });
        const scoredPublics = scoredObjectives.filter((objective) => {
          return objective.type === "stage-one" || objective.type === "stage-two";
        });
        return (
          <React.Fragment>
            <LabeledDiv label="IMPERIAL POINT?" style={{width: "90%"}}>
              <div className="flexRow" style={{paddingTop: "8px", width: "100%", justifyContent: "space-evenly"}}>
                <button className={hasImperialPoint ? "selected" : ""} style={{fontSize: "20px"}} onClick={() => addObjective(activeFaction.name, objectives["Imperial Point"])}>Yes</button>
                <button className={!hasImperialPoint ? "selected" : ""} style={{fontSize: "20px"}} onClick={() => undoObjective(activeFaction.name, "Imperial Point")}>No</button>
              </div>
            </LabeledDiv>   
            <LabeledDiv label="SCORED PUBLIC" style={{width: "90%"}}>
                <React.Fragment>
            <div className='flexColumn' style={{alignItems: "stretch"}}>
            {scoredPublics.map((objective) => {
              return <ObjectiveRow key={objective.name} objective={objective} removeObjective={() => undoObjective(activeFaction.name, objective.name)} />
            })}
            </div>
            {availablePublicObjectives.length > 0 && scoredPublics.length < 1 ?
            <HoverMenu label="Score Public Objective" style={{width: "260px"}} content={
              <div className="flexColumn" style={{...secretButtonStyle}}>
                  {availablePublicObjectives.map((objective) => {
                    return (
                      <button key={objective.name} style={{width: "230px"}} onClick={() => addObjective(activeFaction.name, objective)}>{objective.name}</button>);
                  })}
              </div>} /> : null}
            </React.Fragment>
            </LabeledDiv>
          </React.Fragment>
        );
        // TODO: Display buttons for various actions.
      case "Component":
        return null;
      case "Pass":
        if (!lastFaction()) {
          return null;
        }
        let hasProveEndurance = false;
        scoredObjectives.forEach((objective) => {
          if (objective.name === "Prove Endurance") {
            hasProveEndurance = true;
          }
        });
        return (
        <LabeledDiv label="PROVE ENDURANCE?" style={{width: "90%"}}>      
          <div className="flexRow" style={{paddingTop: "8px", width: "100%", justifyContent: "space-evenly"}}>
            <button className={hasProveEndurance ? "selected" : ""} style={{fontSize: "20px"}} onClick={() => addObjective(activeFaction.name, objectives["Prove Endurance"])}>Yes</button>
            <button className={!hasProveEndurance ? "selected" : ""} style={{fontSize: "20px"}} onClick={() => undoObjective(activeFaction.name, "Prove Endurance")}>No</button>
          </div>
        </LabeledDiv>   
        );
        // TODO: Display option for Prove Endurance.
        return null;
      case "Tactical":
        const conqueredPlanets = ((subState.factions ?? {})[activeFaction.name] ?? {}).planets ?? [];
        return (
          <React.Fragment>
            <LabeledDiv label="CONQUERED PLANETS" style={{width: "90%"}}>
              <React.Fragment>
                {conqueredPlanets.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
                {conqueredPlanets.map((planet) => {
                  return <PlanetRow key={planet.name} planet={planet} removePlanet={() => removePlanet(activeFaction.name, planet.name)} />
                })}
                </div> : null}
                {claimablePlanets.length > 0 ?
                <HoverMenu label="Conquer Planet" style={{minWidth: "160px"}} content={
                  <div className="flexRow" style={targetButtonStyle}>
                    {claimablePlanets.map((planet) => {
                      return (
                        <button key={planet.name} style={{width: "90px"}} onClick={() => addPlanet(activeFaction.name, planet)}>{planet.name}</button>);
                    })}
                  </div>} /> : null}
              </React.Fragment>
            </LabeledDiv>
            <LabeledDiv label="SCORED SECRETS" style={{width: "90%"}}>
              <React.Fragment>
                {scoredObjectives.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
                {scoredObjectives.map((objective) => {
                  return <ObjectiveRow key={objective.name} objective={objective} removeObjective={() => undoObjective(activeFaction.name, objective.name)} />
                })}
                </div> : null}
                {scorableObjectives.length > 0 && scoredObjectives.length < 4 ?
                <HoverMenu label="Score Secret Objective" style={{width: "260px"}}>
                  <div className="flexColumn" style={{...secretButtonStyle}}>
                  {scorableObjectives.map((objective) => {
                    return (
                      <button key={objective.name} style={{width: "230px"}} onClick={() => addObjective(activeFaction.name, objective)}>{objective.name}</button>);
                  })}
                  </div>
                </HoverMenu> : null}
              </React.Fragment>
            </LabeledDiv>
          </React.Fragment>
        );
        // TODO: Display tech section for Nekro
    }
    return (
      <div style={{display: visible ? "flex" : "none"}}>
        Testing
      </div>
    )
  }


  return (<div className="flexColumn" style={{width: "100%", height: "80vh", justifyContent: "flex-start", alignItems: "center", gap: "12px"}}>
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