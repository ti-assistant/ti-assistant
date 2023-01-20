import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React, { useEffect, useRef, useState } from "react";
import { FactionCard, FactionSymbol, FullFactionSymbol } from '../FactionCard.js'
import { SmallStrategyCard, StrategyCard } from '../StrategyCard';
import { getOnDeckFaction, getStrategyCardsForFaction } from '../util/helpers';
import { hasTech, unlockTech } from '../util/api/techs';
import { useStrategyCard } from '../util/api/cards';
import { passFaction, readyAllFactions } from '../util/api/factions';
import { fetcher, poster } from '../util/api/util';
import { SpeakerModal } from '../SpeakerModal';
import { FactionTimer, StaticFactionTimer } from '../Timer';
import SummaryColumn from './SummaryColumn.js';
import { LawsInEffect } from '../LawsInEffect.js';
import { useSharedUpdateTimes } from '../Updater.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { PlanetRow } from '../PlanetRow.js';
import { ObjectiveRow } from '../ObjectiveRow.js';
import { claimPlanet } from '../util/api/planets.js';
import { removeObjective, scoreObjective } from '../util/api/objectives.js';
import { LabeledDiv, LabeledLine } from '../LabeledDiv.js';
import { HoverMenu } from '../HoverMenu.js';
import { setSpeaker } from '../util/api/state.js';
import { TechIcon, TechRow } from '../TechRow.js';
import { BasicFactionTile } from '../FactionTile.js';
import { getFactionColor, getFactionName } from '../util/factions.js';
import { getTechColor } from '../util/techs.js';
import { TechSelectHoverMenu } from './util/TechSelectHoverMenu.js';
import { SelectableRow } from '../SelectableRow.js';
import { addSubStatePlanet, addSubStateTech, clearSubState, finalizeSubState, removeSubStatePlanet, removeSubStateTech, scoreSubStateObjective, setSubStateSelectedAction, setSubStateSpeaker, undoSubStateSpeaker, unscoreSubStateObjective } from '../util/api/subState.js';
import { responsiveNegativePixels, responsivePixels } from '../util/util.js';
import { applyPlanetAttachments } from '../util/planets.js';
import { ComponentAction } from './util/ComponentAction.js';

export function FactionActionButtons({factionName, buttonStyle}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);

  if (!factions) {
    return null;
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
    if (subState.selectedAction === action) {
      clearSubState(mutate, gameid, subState);
    } else {
      setSubStateSelectedAction(mutate, gameid, subState, action);
    }
  }

  const activeFaction = factions[factionName];
  if (!activeFaction) {
    return null;
  }

  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);

  return (
  <div className="flexRow" style={{padding: "0px 8px", boxSizing: "border-box", width: "100%", flexWrap: "wrap"}}>
    {getStrategyCardsForFaction(orderedStrategyCards, activeFaction.name).map((card) => {
      if (card.used) {
        return null
      }
      return (
        <button key={card.name} className={subState.selectedAction === card.name ? "selected" : ""} style={buttonStyle} onClick={() => toggleAction(card.name)}>
          {card.name}
        </button>
      );
    })}
    <button className={subState.selectedAction === "Tactical" ? "selected" : ""} style={buttonStyle} onClick={() => toggleAction("Tactical")}>
      Tactical
    </button>
    <button className={subState.selectedAction === "Component" ? "selected" : ""} style={buttonStyle} onClick={() => toggleAction("Component")}>
      Component
    </button>
    {canFactionPass(activeFaction.name) ? <button className={subState.selectedAction === "Pass" ? "selected" : ""} style={buttonStyle} 
      disabled={!canFactionPass(activeFaction.name)} onClick={() => toggleAction("Pass")}>
      Pass
    </button> : null}
  </div>);
}

export function FactionActions({factionName}) {


  return <div className="flexColumn" style={{gap: responsivePixels(4)}}>
    <div style={{fontSize: responsivePixels(20)}}>Select Action</div>
    <FactionActionButtons factionName={factionName} buttonStyle={{fontSize: responsivePixels(18)}} />
</div>
}

export function AdditionalActions({ factionName, visible, style, hoverMenuStyle = {}, factionOnly = false }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);

  if (!factions || !techs) {
    return null;
  }
  
  const activeFaction = factions[factionName];

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
      if (researchedTechs.includes(tech.name)) {
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

  function removePlanet(factionName, toRemove) {
    removeSubStatePlanet(mutate, gameid, subState, factionName, toRemove);
  }

  function addPlanet(factionName, toAdd) {
    addSubStatePlanet(mutate, gameid, subState, factionName, toAdd.name);
  }

  function addObjective(factionName, toScore) {
    scoreSubStateObjective(mutate, gameid, subState, factionName, toScore.name);
  }
  
  function undoObjective(factionName, toRemove) {
    unscoreSubStateObjective(mutate, gameid, subState, factionName, toRemove);
  }

  function removeTech(factionName, toRemove) {
    removeSubStateTech(mutate, gameid, subState, factionName, toRemove);
  }

  function addTech(factionName, tech) {
    addSubStateTech(mutate, gameid, subState, factionName, tech.name);
  }

  function selectSpeaker(factionName) {
    setSubStateSpeaker(mutate, gameid, subState, factionName);
  }
  function resetSpeaker() {
    undoSubStateSpeaker(mutate, gameid, subState);
  }

  function lastFaction() {
    const numFactions = Object.keys(factions ?? {}).length;
    const numPassed = Object.values(factions ?? {}).filter((faction) => faction.passed).length;
    return numFactions - 1 === numPassed;
  }
  const claimedPlanets = (((subState.factions ?? {})[activeFaction.name] ?? {}).planets ?? []);
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if ((planet.owners ?? []).includes(activeFaction.name)) {
      return false;
    }
    if (claimedPlanets.includes(planet.name)) {
      return false;
    }
    if (claimedPlanets.length > 0) {
      if (planets[claimedPlanets[0]].system) {
        return planet.system === planets[claimedPlanets[0]].system;
      }
      if (planets[claimedPlanets[0]].faction) {
        return planet.faction === planets[claimedPlanets[0]].faction;
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
    if (scoredObjectives.includes(objective.name)) {
      return false;
    }
    if (objective.name === "Become a Martyr" || objective.name === "Prove Endurance") {
      return false;
    }
    return objective.type === "secret" && objective.phase === "action";
  });

  const numColumns = Math.ceil(claimablePlanets.length / 13);
  const width = numColumns * 102 + (numColumns - 1) * 4 + 16;

  const targetButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: responsivePixels(4),
    maxHeight: responsivePixels(404),
    writingMode: "vertical-lr",
    justifyContent: "flex-start",
    ...hoverMenuStyle,
  };

  const secretButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    alignItems: "stretch",
    gap: responsivePixels(4),
  };


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
  switch (subState.selectedAction) {
    case "Technology":
      const researchedTech = ((subState.factions ?? {})[activeFaction.name] ?? {}).techs ?? [];
      if (!!factionOnly) {
        const isActive = state.activeplayer === factionName;
        const numTechs = isActive || factionName === "Universities of Jol-Nar" ? 2 : 1;
        return (
          activeFaction.name !== "Nekro Virus" ?
          <div className="flexColumn largeFont" style={{width: "100%", gap: responsivePixels(4)}}>
          <LabeledLine leftLabel={isActive ? "Technology Primary" : "Technology Secondary"} />
            <React.Fragment>
              {researchedTech.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
              {researchedTech.map((tech) => {
                return <TechRow key={tech} tech={techs[tech]} removeTech={() => removeTech(activeFaction.name, tech)} />
              })}
              </div> : null}
              {researchedTech.length < numTechs ?
                <TechSelectHoverMenu
                  techs={researchableTechs}
                  selectTech={(tech) => addTech(activeFaction.name, tech)}
                  direction="vertical" />
              : null}
            </React.Fragment>
            </div> : null
        )
      }
      return (
        <div className="flexColumn largeFont" style={{...style, gap: responsivePixels(4)}}>
          {activeFaction.name !== "Nekro Virus"  ?
            <div className='flexColumn' style={{gap: responsivePixels(4), width: "100%"}}>
            <LabeledLine leftLabel="PRIMARY" />
          {/* // <LabeledDiv label="PRIMARY" style={{width: "75%"}} content={ */}

              {researchedTech.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
              {researchedTech.map((tech) => {
                return <TechRow key={tech} tech={techs[tech]} removeTech={() => removeTech(activeFaction.name, tech)} />
              })}
              </div> : null}
              {researchedTech.length < 2 ?
                <TechSelectHoverMenu
                  techs={researchableTechs}
                  selectTech={(tech) => addTech(activeFaction.name, tech)}
                  direction="horizontal" />
              : null}
            </div> : null}
            <div className='flexColumn' style={{gap: responsivePixels(4), width: "100%"}}>
            <LabeledLine leftLabel="SECONDARY" />
              <div className="flexRow mediumFont" style={{paddingTop: responsivePixels(4), width: "100%", flexWrap: "wrap"}}>
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
                  <LabeledDiv key={faction.name} label={getFactionName(faction)} color={getFactionColor(faction)} style={{width: "49%"}}>
                    <React.Fragment>
                    {researchedTechs.map((tech) => {
                      return <TechRow key={tech} tech={techs[tech]} removeTech={() => removeTech(faction.name, tech)} opts={{hideSymbols: true}} />
                    })}
                    {researchedTechs.length < maxTechs ?
                      <TechSelectHoverMenu techs={availableTechs} selectTech={(tech) => addTech(faction.name, tech)} />
                    : null}
                    </React.Fragment>
                    </LabeledDiv>
                );
              })}
              </div>
            </div>
          </div>
      );
    case "Politics":
      return (
        <div className="flexColumn" style={{gap: "4px", ...style}}>
            <React.Fragment>
              {subState.speaker ?
                <LabeledDiv label="NEW SPEAKER" style={{width: "90%"}}>        
                <div className='flexColumn' style={{alignItems: "stretch"}}>
                <SelectableRow itemName={subState.speaker} removeItem={resetSpeaker} content={
                  <BasicFactionTile faction={factions[subState.speaker]} />
                } />
              {/* {(subState.speaker ?? []).map((planet) => {
                return <PlanetRow key={planet.name} planet={planet} removePlanet={removePlanet} />
              })} */}
              </div>
              </LabeledDiv>   
              : 
              <HoverMenu label="Select Speaker">
                <div className="flexRow" style={targetButtonStyle}>
                  {orderedFactions.map((faction) => {
                    if (state.speaker === faction.name) {
                      return null;
                    }
                    return (
                      <button key={faction.name} onClick={() => selectSpeaker(faction.name)}>{getFactionName(faction)}</button>);
                  })}
                </div>
              </HoverMenu>}
            </React.Fragment>
        </div>
      );
    case "Diplomacy":
      if (activeFaction.name === "Xxcha Kingdom") {
        return (
          <div className="flexColumn largeFont" style={{...style}}>
            <LabeledLine leftLabel="PRIMARY" />
            <LabeledDiv label="PEACE ACCORDS" content={           
              <React.Fragment>
                {claimedPlanets.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
                {claimedPlanets.map((planet) => {
                  const adjustedPlanet = applyPlanetAttachments(planets[planet], attachments)
                  return <PlanetRow key={planet} planet={adjustedPlanet} removePlanet={() => removePlanet(activeFaction.name, planet)} />
                })}
                </div> : null}
                {claimablePlanets.length > 0 && claimedPlanets.length === 0  ?
                <HoverMenu label="Claim Empty Planet" content={
                  <div className="flexRow" style={targetButtonStyle}>
                    {claimablePlanets.map((planet) => {
                      return (
                        <button key={planet.name} style={{width: responsivePixels(90)}} onClick={() => addPlanet(activeFaction.name, planet)}>{planet.name}</button>);
                    })}
                  </div>} /> : null}
              </React.Fragment>}
            />
          </div>
        );
      } else if (factions["Xxcha Kingdom"]) {
        const xxchaPlanets = (((subState.factions ?? {})["Xxcha Kingdom"] ?? {}).planets ?? []);
        const nonXxchaPlanets = Object.values(planets ?? {}).filter((planet) => {
          if ((planet.owners ?? []).includes("Xxcha Kingdom")) {
            return false;
          }
          if (claimedPlanets.includes(planet.name)) {
            return false;
          }
          if (claimedPlanets.length > 0) {
            if (planets[claimedPlanets[0]].system) {
              return planet.system === planets[claimedPlanets[0]].system;
            }
            if (planets[claimedPlanets[0]].faction) {
              return planet.faction === planets[claimedPlanets[0]].faction;
            }
            return false;
          }
          return true;
        });
        return (
          <div className="flexColumn largeFont" style={{...style}}>
            <LabeledLine leftLabel="SECONDARY" />
            <LabeledDiv label={`${getFactionName(factions["Xxcha Kingdom"])} - Peace Accords`} color={getFactionColor(factions["Xxcha Kingdom"])}>
              <React.Fragment>
                {xxchaPlanets.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
                {xxchaPlanets.map((planet) => {
                  const adjustedPlanet = applyPlanetAttachments(planets[planet], attachments)
                  return <PlanetRow key={planet} planet={adjustedPlanet} removePlanet={() => removePlanet("Xxcha Kingdom", planet)} />
                })}
                </div> : null}
                {nonXxchaPlanets.length > 0 && xxchaPlanets.length === 0  ?
                <HoverMenu label="Claim Empty Planet" content={
                  <div className="flexRow" style={targetButtonStyle}>
                    {nonXxchaPlanets.map((planet) => {
                      return (
                        <button key={planet.name} style={{width: responsivePixels(90)}} onClick={() => addPlanet("Xxcha Kingdom", planet)}>{planet.name}</button>);
                    })}
                  </div>} /> : null}
              </React.Fragment>
            </LabeledDiv>
          </div>
        );
      }
      return null;
    case "Leadership":
    case "Construction":
    case "Trade":
    case "Warfare":
      return null;
    case "Imperial":
      let hasImperialPoint = false;
      scoredObjectives.forEach((objective) => {
        if (objective === "Imperial Point") {
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
        return objectives[objective].type === "stage-one" || objectives[objective].type === "stage-two";
      });
      return (
        <div className="flexColumn largeFont" style={{...style}}>
          <LabeledDiv label="IMPERIAL POINT ?">
            <div className="flexRow" style={{width: "100%", justifyContent: "space-evenly"}}>
              <button className={hasImperialPoint ? "selected" : ""} style={{fontSize: responsivePixels(20)}} onClick={() => addObjective(activeFaction.name, objectives["Imperial Point"])}>Yes</button>
              <button className={!hasImperialPoint ? "selected" : ""} style={{fontSize: responsivePixels(20)}} onClick={() => undoObjective(activeFaction.name, "Imperial Point")}>No</button>
            </div>
          </LabeledDiv>   
          <LabeledDiv label="SCORED PUBLIC">
              <React.Fragment>
          {scoredPublics.length > 0 ? <div className='flexColumn' style={{alignItems: "stretch"}}>
          {scoredPublics.map((objective) => {
            return <ObjectiveRow key={objective} objective={objectives[objective]} removeObjective={() => undoObjective(activeFaction.name, objective)} hideScorers={true} />
          })}
          </div> : null}
          {availablePublicObjectives.length > 0 && scoredPublics.length < 1 ?
          <HoverMenu label="Score Public Objective" content={
            <div className="flexColumn" style={{...secretButtonStyle}}>
                {availablePublicObjectives.map((objective) => {
                  return (
                    <button key={objective.name} onClick={() => addObjective(activeFaction.name, objective)}>{objective.name}</button>);
                })}
            </div>} /> : null}
          </React.Fragment>
          </LabeledDiv>
        </div>
      );
      // TODO: Display buttons for various actions.
    case "Component":
      return <ComponentAction factionName={activeFaction.name} />
    case "Pass":
      if (!lastFaction()) {
        return null;
      }
      let hasProveEndurance = false;
      scoredObjectives.forEach((objective) => {
        if (objective  === "Prove Endurance") {
          hasProveEndurance = true;
        }
      });
      return (
      <LabeledDiv label="PROVE ENDURANCE?" style={{gap: "4px", ...style}}>
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
        <div className="flexColumn largeFont" style={{...style}}>
          {conqueredPlanets.length > 0 ? <LabeledDiv label="CONQUERED PLANETS">
            <React.Fragment>
              <div className='flexColumn' style={{alignItems: "stretch", width: "100%"}}>
              {conqueredPlanets.map((planet) => {
                const adjustedPlanet = applyPlanetAttachments(planets[planet], attachments)
                return <PlanetRow key={planet} planet={adjustedPlanet} removePlanet={() => removePlanet(activeFaction.name, planet)} />
              })}
              </div>
            </React.Fragment>
          </LabeledDiv> : null}
          {claimablePlanets.length > 0 ?
              <HoverMenu label="Conquer Planet" content={
                <div className="flexRow" style={targetButtonStyle}>
                  {claimablePlanets.map((planet) => {
                    return (
                      <button key={planet.name} style={{width: responsivePixels(90)}} onClick={() => addPlanet(activeFaction.name, planet)}>{planet.name}</button>);
                  })}
          </div>} /> : null}
          {scoredObjectives.length > 0 ? <LabeledDiv label="SCORED SECRETS">
            <React.Fragment>
              <div className='flexColumn' style={{alignItems: "stretch"}}>
              {scoredObjectives.map((objective) => {
                return <ObjectiveRow key={objective} objective={objectives[objective]} removeObjective={() => undoObjective(activeFaction.name, objective)} />
              })}
              </div>
            </React.Fragment>
          </LabeledDiv> : null}
          {scorableObjectives.length > 0 && scoredObjectives.length < 4 ?
              <HoverMenu label="Score Secret Objective">
                <div className="flexColumn" style={{...secretButtonStyle}}>
                {scorableObjectives.map((objective) => {
                  return (
                    <button key={objective.name} onClick={() => addObjective(activeFaction.name, objective)}>{objective.name}</button>);
                })}
                </div>
              </HoverMenu> : null}
        </div>
      );
      // TODO: Display tech section for Nekro
  }
  return null;
}

export function NextPlayerButtons({factionName, buttonStyle}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: state = {} } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);

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
    return mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  async function completeActions(fleetLogistics = false) {
    if (subState.selectedAction === null) {
      return;
    }
    await finalizeAction();
    nextPlayer();
  }

  async function finalizeAction() {
    if (subState.selectedAction === null) {
      return;
    }
    finalizeSubState(mutate, gameid, subState);

    if (strategyCards[subState.selectedAction]) {
      useStrategyCard(mutate, gameid, strategyCards, subState.selectedAction);
    }
    if (subState.selectedAction === "Pass") {
      await passFaction(mutate, gameid, factions, factionName);
    }
  }

  function isTurnComplete() {
    switch (subState.selectedAction) {
      case "Politics":
        return !!subState.speaker;
      case "Technology":
        return factionName === "Nekro Virus" ||
          (((subState.factions ?? {})[factionName] ?? {}).techs ?? []).length > 0;
    }
    return !!subState.selectedAction;
  }

  if (!isTurnComplete()) {
    return null;
  } else {
    return (
      <div className="flexRow" style={{gap: "16px"}}>
      <button onClick={completeActions} style={buttonStyle} >End Turn</button>
      {subState.selectedAction !== "Pass" ? 
        <React.Fragment>
          <div style={{fontSize: "16px"}}>OR</div>
          <button onClick={finalizeAction} style={buttonStyle} >Take Another Action</button>
        </React.Fragment>
      : null}
      </div>
    );
  }
}

export function ActivePlayerColumn({activeFaction, onDeckFaction}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);

  return (
  <div className="flexColumn" style={{height: "100vh", boxSizing: "border-box", paddingTop: responsivePixels(74), justifyContent: "flex-start", alignItems: "center", marginLeft: responsivePixels(64)}}>
    Active Player
    <SwitchTransition>
      <CSSTransition
        key={activeFaction.name}
        timeout={500}
        classNames="fade">
        <FactionCard faction={activeFaction} rightLabel={<FactionTimer factionName={activeFaction.name} style={{fontSize: responsivePixels(16), width: "auto"}} />} style={{minWidth: responsivePixels(400), minHeight: responsivePixels(240)}} opts={{iconSize: responsivePixels(200), fontSize: responsivePixels(32), justifyContent: "flex-start"}}>
          <div className="flexColumn" style={{width:"100%", justifyContent: "flex-start"}}>
            <FactionActions factionName={activeFaction.name} />
            <AdditionalActions visible={!!subState.selectedAction} factionName={activeFaction.name} style={{minWidth: responsivePixels(350)}} />
          </div>
        </FactionCard>
      </CSSTransition>
    </SwitchTransition>
    <NextPlayerButtons factionName={activeFaction.name} buttonStyle={{fontSize: responsivePixels(24)}} />
    On Deck
    <SwitchTransition>
    <CSSTransition
        key={onDeckFaction.name}
        timeout={500}
        classNames="fade">
    <FactionCard faction={onDeckFaction} content={
                <div className="flexColumn" style={{height: "100%", paddingBottom: responsivePixels(4), fontSize: responsivePixels(12)}}>
                  <StaticFactionTimer factionName={onDeckFaction.name} style={{fontSize: responsivePixels(24), width: responsivePixels(180)}} />
                </div>
              } style={{width: "auto", height: responsivePixels(100)}} opts={{iconSize: responsivePixels(80), fontSize: responsivePixels(24)}} />
              </CSSTransition>
            </SwitchTransition>
  </div>);
}

export default function ActionPhase() {
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
    <div className="flexRow" style={{gap: responsivePixels(20), height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <div className="flexColumn" style={{alignItems: "stretch", justifyContent: "flex-start", paddingTop: responsivePixels(140), boxSizing: "border-box", height: "100%", gap: numCards > 7 ? 0 : responsivePixels(8)}}>
        {/* <div className="flexRow">Initiative Order</div> */}
        {orderedStrategyCards.map((card) => {
          return <SmallStrategyCard key={card.name} card={card} active={!card.used} opts={{noColor: true}} />
        })}
        <LawsInEffect />
      </div>
      <div className="flexColumn" style={{gap: responsivePixels(16)}}>
        <div className="flexRow" style={{width: "100%"}}>
          {activeFaction && onDeckFaction ?
            <ActivePlayerColumn activeFaction={activeFaction} onDeckFaction={onDeckFaction} />
          : <div style={{fontSize: responsivePixels(42)}}>Action Phase Complete</div>}
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
      <div className="flexColumn" style={{height: "100vh", flexShrink: 0,  width: responsivePixels(280)}}>
        <SummaryColumn />
      </div>
    </div>
  );
}