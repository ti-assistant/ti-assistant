import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React, { useRef, useState } from "react";
import { SmallStrategyCard, StrategyCard } from '../StrategyCard';
import { hasTech, lockTech, unlockTech } from '../util/api/techs';
import { resetStrategyCards } from '../util/api/cards';
import { readyAllFactions } from '../util/api/factions';
import { pluralize, responsivePixels } from '../util/util';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { scoreObjective, unscoreObjective } from '../util/api/objectives';
import { Modal } from "/src/Modal.js";
import SummaryColumn from './SummaryColumn';
import { LawsInEffect } from '../LawsInEffect';
import { useSharedUpdateTimes } from '../Updater';
import { HoverMenu } from '../HoverMenu';
import { LabeledDiv } from '../LabeledDiv';
import { getFactionColor, getFactionName } from '../util/factions';
import { SelectableRow } from '../SelectableRow';
import { finalizeSubState, hideSubStateObjective, revealSubStateObjective, scoreSubStateObjective, setSubStateOther, unscoreSubStateObjective } from '../util/api/subState';
import { NumberedItem } from '../NumberedItem';
import { startNextRound } from './AgendaPhase';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{width: "100%", minWidth: responsivePixels(320), padding: responsivePixels(4), whiteSpace: "pre-line", textAlign: "center", fontSize: responsivePixels(32)}}>
      {content}
    </div>
  );
}

export function MiddleColumn() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas = {} } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });

  if (subState && !subState.currentStep) {
    setSubStateOther(mutate, gameid, "currentStep", 1);
    return null;
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  function stepComplete() {
    switch (subState.currentStep) {
      case 3:
        return (subState.objectives ?? []).length === 1;
    }
    return true;
  }

  function reverseCurrentStep() {
    setSubStateOther(mutate, gameid, "currentStep", subState.currentStep - 1);
  }
  function advanceCurrentStep() {
    setSubStateOther(mutate, gameid, "currentStep", subState.currentStep + 1);
  }
  function jumpToStep(step) {
    setSubStateOther(mutate, gameid, "currentStep", step);
  }

  function addObj(objective) {
    revealSubStateObjective(mutate, gameid, objective.name);
  }

  function removeObj(objectiveName) {
    hideSubStateObjective(mutate, gameid, objectiveName);
  }

  function scoreObj(factionName, objective) {
    scoreObjective(mutate, gameid, factionName, objective.name);
    scoreSubStateObjective(mutate, gameid, factionName, objective.name);
  }
  function unscoreObj(factionName, objectiveName) {
    unscoreObjective(mutate, gameid, factionName, objectiveName);
    unscoreSubStateObjective(mutate, gameid, factionName, objectiveName);
  }

  function getStartOfStatusPhaseAbilities() {
    let abilities = {};
    if (factions['Arborec']) {
      abilities['Mitosis'] = {
        factions: ["Arborec"],
        description: "Place 1 Infantry from your reinforcements on any planet you control",
      };
    }
    if (!options.expansions.includes("codex-one")) {
      let wormholeFactions = [];
      for (const [name, faction] of Object.entries(factions)) {
        if (hasTech(faction, "Wormhole Generator")) {
          wormholeFactions.push(name);
        }
      }
      if (wormholeFactions.length > 0) {
        abilities["Wormhole Generator"] = {
          factions: wormholeFactions,
          description: "Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
        };
      }
    }
    return abilities;
  }

  function getEndOfStatusPhaseAbilities() {
    let abilities = {};
    if (factions['Federation of Sol']) {
      abilities['Genesis'] = {
        factions: ["Federation of Sol"],
        description: "If your flagship is on the game board, place 1 Infantry from your reinforcements in its system's space area",
      };
    }
    let bioplasmosisFactions = [];
    for (const [name, faction] of Object.entries(factions)) {
      if (hasTech(faction, "Bioplasmosis")) {
        bioplasmosisFactions.push(name);
      }
    }
    if (bioplasmosisFactions.length > 0) {
      abilities["Bioplasmosis"] = {
        factions: bioplasmosisFactions,
        description: "You may remove any number of Infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems",
      };
    }
    const ministerOfPolicy = agendas['Minister of Policy'];
    if (ministerOfPolicy.resolved) {
      abilities["Minister of Policy"] = {
        factions: [ministerOfPolicy.target],
        description: ministerOfPolicy.passedText,
      };
    }
    return abilities;
  }

  const round = state.round;
  const type = (round < 4) ? "stage-one" : "stage-two";
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);
  const filteredStrategyCards = orderedStrategyCards.filter((card, index) => {
    return card.faction && orderedStrategyCards.findIndex((othercard) => card.faction === othercard.faction) === index;
  });
  const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    return objective.type === type && !objective.selected;
  });
  const numberOfActionCards = {1: [], 2: [], 3: []};
  Object.values(filteredStrategyCards).forEach((card) => {
    let number = 1;
    if (card.faction === "Yssaril Tribes") {
      ++number;
    }
    const faction = factions[card.faction];
    if (hasTech(faction, "Neural Motivator")) {
      ++number;
    }
    numberOfActionCards[number].push(faction);
  });
  const numberOfCommandTokens = {2: [], 3: [], 4: []};
  Object.values(filteredStrategyCards).forEach((card) => {
    let number = 2;
    if (card.faction === "Federation of Sol") {
      ++number;
    }
    const faction = factions[card.faction];
    if (hasTech(faction, "Hyper Metabolism")) {
      ++number;
    }
    numberOfCommandTokens[number].push(faction);
  });

  let startingStep = 2;
  let numSteps = 8;
  if (Object.entries(getStartOfStatusPhaseAbilities()).length > 0) {
    // numSteps++;
    startingStep = 1;
  }
  if (Object.entries(getEndOfStatusPhaseAbilities()).length > 0) {
    numSteps++;
  }

  let innerContent = null;
  switch (subState.currentStep) {
    case 1:
      if (Object.entries(getStartOfStatusPhaseAbilities()).length === 0) {
        advanceCurrentStep();
        return null;
      }
      innerContent = 
      <React.Fragment>
      <ol className='flexColumn' style={{width: "100%", alignItems: "flex-start"}}>
        {Object.entries(getStartOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
          return (
            <NumberedItem key={abilityName}>
              <LabeledDiv label={abilityName}>
                <div className='flexRow mediumFont' style={{width: "100%"}}>
                {ability.factions.map((factionName) => {
                  return <LabeledDiv key={factionName} color={getFactionColor(factions[factionName])} style={{width: "auto"}}>
                    {getFactionName(factions[factionName])}
                  </LabeledDiv>
                })}
                <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                  &#x24D8;
                </div>
                </div>
              </LabeledDiv>
            </NumberedItem>)
        })}
      </ol>
      </React.Fragment>
      break;
    case 2:
    innerContent =
    <div className="flexColumn" style={{width: "100%"}}>
      In Initiative Order:
    <LabeledDiv labelSize={20} label="Score up to one public and one secret objective">
    <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "stretch"}}>
      {filteredStrategyCards.map((card) => {
        const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
          return objective.selected && (objective.type === "stage-one" || objective.type === "stage-two") && !(objective.scorers ?? []).includes(card.faction);
        });
        const secrets = Object.values(objectives ?? {}).filter((objective) => {
          return objective.type === "secret" &&
            !(objective.scorers ?? []).includes(card.faction) &&
            objective.phase === "status";
        })
        const factionColor = getFactionColor(factions[card.faction]);
        const factionName = getFactionName(factions[card.faction]);
        const scoredPublics = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
          return objectives[objective].type === "stage-one" || objectives[objective].type === "stage-two";
        });
        const scoredSecrets = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
          return objectives[objective].type === "secret";
        });
        return <HoverMenu label={factionName} borderColor={factionColor}>
          <div className={scoredPublics.length === 0 && scoredSecrets.length === 0 ? 'flexRow' : 'flexColumn'} style={{padding: responsivePixels(8), alignItems: "flex-start"}}>
          {scoredPublics.length > 0 ?
            <LabeledDiv label="SCORED PUBLIC" style={{whiteSpace: "nowrap"}}>
              <SelectableRow itemName={scoredPublics[0]} removeItem={() => unscoreObj(card.faction, scoredPublics[0])}>
                {scoredPublics[0]}
              </SelectableRow>
            </LabeledDiv>
          : <HoverMenu label="Score Public">
            <div className="flexColumn" style={{whiteSpace: "nowrap", gap: responsivePixels(4), padding: responsivePixels(8), alignItems: "stretch"}}>
            {availableObjectives.length === 0 ? "No unscored public objectives" : null}
            {availableObjectives.map((objective) => {
              return <button style={{fontSize: responsivePixels(14)}} onClick={() => scoreObj(card.faction, objective)}>{objective.name}</button>
            })}
            </div> 
          </HoverMenu>}
          {scoredSecrets.length > 0 ? 
            <LabeledDiv label="SCORED SECRET" style={{whiteSpace: "nowrap"}}>
            <SelectableRow itemName={scoredSecrets[0]} removeItem={() => unscoreObj(card.faction, scoredSecrets[0])}>
              {scoredSecrets[0]}
            </SelectableRow>
            </LabeledDiv>
            : <HoverMenu label="Score Secret">
            <div className="flexRow" style={{writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: responsivePixels(230), flexWrap: "wrap", whiteSpace: "nowrap", padding: responsivePixels(8), gap: responsivePixels(4), alignItems: "stretch"}}>
            {secrets.map((objective) => {
              return <button style={{fontSize: responsivePixels(14)}} onClick={() => scoreObj(card.faction, objective)}>{objective.name}</button>
            })}
            </div>
          </HoverMenu>}
          </div>
        </HoverMenu>})}
    </div>
    </LabeledDiv>
    </div>;
    break;
    case 3:
      innerContent = <div className='extraLargeFont'>
        {(subState.objectives ?? []).length > 0 ? 
        <LabeledDiv label="REVEALED OBJECTIVE"><ObjectiveRow objective={objectives[subState.objectives[0]]} removeObjective={() => removeObj(subState.objectives[0])} viewing={true} /></LabeledDiv>
      : <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])} style={{width: "100%"}}>
      <div className='flexRow' style={{whiteSpace: "nowrap"}}>
        {(subState.objectives ?? []).map((objective) => {
          return <ObjectiveRow objective={objectives[objective]} removeObjective={() => removeObj(objective.name)} viewing={true} />;
        })}
        {(subState.objectives ?? []).length < 1 ? 
          <HoverMenu label={`Reveal one Stage ${round > 3 ? "II" : "I"} objective`}>
            <div className='flexRow largeFont' style={{gap: responsivePixels(4), whiteSpace: "nowrap", padding: responsivePixels(8), flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: responsivePixels(180)}}>
              {Object.values(availableObjectives).filter((objective) => {
                return objective.type === (round > 3 ? "stage-two" : "stage-one");
              })
                .map((objective) => {
                  return <button style={{fontSize: responsivePixels(16)}} onClick={() => addObj(objective)}>{objective.name}</button>
                })}
            </div>
          </HoverMenu>
        : null}
        </div>
        </LabeledDiv>
  } </div>
        break;
    case 4:
      innerContent = <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: responsivePixels(2)}}>
      {Object.entries(numberOfActionCards).map(([number, localFactions]) => {
        const num = parseInt(number);
        if (localFactions.length === 0) {
          return null;
        }
        return (
          <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: responsivePixels(4), paddingLeft: responsivePixels(8)}}>
            <LabeledDiv labelSize={20} label={`Draw ${num} ${pluralize("Action Card", num)}${num === 3 ? " and discard any one" : ""}`}>
            <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start"}}>
            {localFactions.map((faction) => {
              let menuButtons = [];
              if (!hasTech(faction, "Neural Motivator")) {
                menuButtons.push({
                  text: "Add Neural Motivator",
                  action: () => unlockTech(mutate, gameid, faction.name, "Neural Motivator"),
                });
              } else {
                menuButtons.push({
                  text: "Remove Neural Motivator",
                  action: () => lockTech(mutate, gameid, faction.name, "Neural Motivator"),
                });
              }
              return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: responsivePixels(16), menuSide: "bottom"}}/>
            })}
            </div>
            </LabeledDiv>
          </div>);
      })}
    </div>;
    break;
    case 5:
      innerContent = <div className='flexColumn extraLargeFont' style={{width: '100%', textAlign: "center"}}>
        Return Command Tokens from the Board to Reinforcements
      </div>
      break;
    case 6:
      innerContent = <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: responsivePixels(2)}}>
      {Object.entries(numberOfCommandTokens).map(([number, localFactions]) => {
        const num = parseInt(number);
        if (localFactions.length === 0) {
          return null;
        }
        return (
          <div key={num} className="flexColumn" style={{alignItems: "flex-start"}}>
            <LabeledDiv labelSize={20} label={`Gain ${num} ${pluralize("Command Token", num)} and Redistribute`}>
            <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", padding: `0 ${responsivePixels(8)}`}}>
            {localFactions.map((faction) => {
              let menuButtons = [];
              if (!hasTech(faction, "Hyper Metabolism")) {
                menuButtons.push({
                  text: "Add Hyper Metabolism",
                  action: () => unlockTech(mutate, gameid, faction.name, "Hyper Metabolism"),
                });
              } else {
                menuButtons.push({
                  text: "Remove Hyper Metabolism",
                  action: () => lockTech(mutate, gameid, faction.name, "Hyper Metabolism"),
                });
              }
              return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: responsivePixels(16), menuSide: "bottom"}}/>
            })}
            </div>
            </LabeledDiv>
          </div>);
      })}
      </div>;
      break;
    case 7:
      innerContent = <div className='flexColumn extraLargeFont' style={{width: '100%', textAlign: "center"}}>
      Ready Cards
    </div>
    break;
    case 8:
      innerContent = <div className='flexColumn extraLargeFont' style={{width: '100%', textAlign: "center"}}>
      Repair Units
    </div>
    break;
    case 9:
    innerContent = <div className='flexColumn extraLargeFont' style={{width: '100%', textAlign: "center"}}>
      Return Strategy Cards
    </div>
    break;
    case 10:
      innerContent = <ol className='flexColumn' style={{width: "100%", alignItems: "flex-start"}}>
      {Object.entries(getEndOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
        return (
          <NumberedItem key={abilityName}>
            <LabeledDiv label={abilityName}>
              <div className='flexRow mediumFont' style={{width: "100%"}}>
              {ability.factions.map((factionName) => {
                return <LabeledDiv key={factionName} color={getFactionColor(factions[factionName])} style={{width: "auto"}}>
                  {getFactionName(factions[factionName])}
                </LabeledDiv>
              })}
              <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                &#x24D8;
              </div>
              </div>
            </LabeledDiv>
          </NumberedItem>);
      })}
      </ol>;
      break;
  }

  const stepCounter = [];
  for (let i = startingStep; i <= numSteps + 1; i++) {
    stepCounter.push(i);
    // if (subState.currentStep >= i) {
    //   stepCounter.push(i);
    // } else {
    //   stepCounter.push(false);
    // }
  }

  return (
    <React.Fragment>
      <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={infoModal.title} content={
        <InfoContent content={infoModal.content} />
      } top="30%" />
      <div className='flexColumn' style={{height: "100%"}}>
      {innerContent}
      </div>
      <div className='flexColumn'>
      <div className='flexRow'>
        {subState.currentStep > startingStep ? <button onClick={reverseCurrentStep}>Back</button> : null}
        {subState.currentStep < numSteps + 1 ? <button disabled={!stepComplete()} onClick={advanceCurrentStep}>Next</button> : null}
      </div>
      <div className='flexRow'>
        {stepCounter.map((val) => {
          if (val <= subState.currentStep) {
            return <div className='extraLargeFont' style={{cursor: "pointer"}} onClick={() => jumpToStep(val)}>&#x25CF;</div>; 
          }
          return <div className='extraLargeFont' style={{cursor: "pointer"}}  onClick={() => jumpToStep(val)}>&#x25CB;</div>;
        })}
      </div>
      </div>
    </React.Fragment>);
}


export function advanceToAgendaPhase(mutate, gameid, subState, state, strategyCards, factions) {
  finalizeSubState(mutate, gameid, subState, factions);
  const data = {
    action: "ADVANCE_PHASE",
  };

  mutate(`/api/${gameid}/state`, async () =>
    await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);

      updatedState.phase = "AGENDA";
      updatedState.activeplayer = state.speaker;
      updatedState.agendaUnlocked = true;

      return updatedState;
    },
    revalidate: false,
  });

  resetStrategyCards(mutate, gameid);
  readyAllFactions(mutate, gameid);
}

export function statusPhaseComplete(subState) {
  return (subState.objectives ?? []).length === 1;
}

export default function StatusPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  const [ revealedObjectives, setRevealedObjectives ] = useState([]);
  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });


  if (!strategyCards || !state || !factions || !objectives || !options) {
    return <div>Loading...</div>;
  }

  function nextPhase(skipAgenda = false) {
    if (!skipAgenda) {
      advanceToAgendaPhase(mutate, gameid, subState, state, strategyCards, factions);
      return;
    }
    startNextRound(mutate, gameid, state, subState, factions);
  }


  function addObj(objective) {
    revealSubStateObjective(mutate, gameid, objective.name);
  }

  function removeObj(objectiveName) {
    hideSubStateObjective(mutate, gameid, objectiveName);
  }

  function scoreObj(factionName, objective) {
    scoreObjective(mutate, gameid, factionName, objective.name);
    scoreSubStateObjective(mutate, gameid, factionName, objective.name);
  }
  function unscoreObj(factionName, objectiveName) {
    unscoreObjective(mutate, gameid, factionName, objectiveName);
    unscoreSubStateObjective(mutate, gameid, factionName, objectiveName);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }
  const round = state.round;
  const orderedStrategyCards = Object.values(strategyCards).filter((card) => card.faction).sort((a, b) => a.order - b.order);
  const filteredStrategyCards = orderedStrategyCards.filter((card, index) => {
    return card.faction && orderedStrategyCards.findIndex((othercard) => card.faction === othercard.faction) === index;
  });
  const numberOfActionCards = {1: [], 2: [], 3: []};
  Object.values(filteredStrategyCards).forEach((card) => {
    let number = 1;
    if (card.faction === "Yssaril Tribes") {
      ++number;
    }
    const faction = factions[card.faction];
    if (hasTech(faction, "Neural Motivator")) {
      ++number;
    }
    numberOfActionCards[number].push(faction);
  });
  const numberOfCommandTokens = {2: [], 3: [], 4: []};
  Object.values(filteredStrategyCards).forEach((card) => {
    let number = 2;
    if (card.faction === "Federation of Sol") {
      ++number;
    }
    const faction = factions[card.faction];
    if (hasTech(faction, "Hyper Metabolism")) {
      ++number;
    }
    numberOfCommandTokens[number].push(faction);
  });

  const type = (round < 4) ? "stage-one" : "stage-two";

  function getStartOfStatusPhaseAbilities() {
    let abilities = {};
    if (factions['Arborec']) {
      abilities['Mitosis'] = {
        factions: ["Arborec"],
        description: "Place 1 Infantry from your reinforcements on any planet you control",
      };
    }
    if (!options.expansions.includes("codex-one")) {
      let wormholeFactions = [];
      for (const [name, faction] of Object.entries(factions)) {
        if (hasTech(faction, "Wormhole Generator")) {
          wormholeFactions.push(name);
        }
      }
      if (wormholeFactions.length > 0) {
        abilities["Wormhole Generator"] = {
          factions: wormholeFactions,
          description: "Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
        };
      }
    }
    return abilities;
  }

  function getEndOfStatusPhaseAbilities() {
    let abilities = {};
    if (factions['Federation of Sol']) {
      abilities['Genesis'] = {
        factions: ["Federation of Sol"],
        description: "If your flagship is on the game board, place 1 Infantry from your reinforcements in its system's space area",
      };
    }
    let bioplasmosisFactions = [];
    for (const [name, faction] of Object.entries(factions)) {
      if (hasTech(faction, "Bioplasmosis")) {
        bioplasmosisFactions.push(name);
      }
    }
    if (bioplasmosisFactions.length > 0) {
      abilities["Bioplasmosis"] = {
        factions: bioplasmosisFactions,
        description: "You may remove any number of Infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems",
      };
    }
    return abilities;
  }

  const numCards = orderedStrategyCards.length;

  const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    return objective.type === type && !objective.selected;
  });
  return (
    <div className="flexRow" style={{gap: responsivePixels(20), height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={infoModal.title} content={
        <InfoContent content={infoModal.content} />
      } top="30%" />
      <ObjectiveModal visible={showObjectiveModal} type={type} onComplete={(objectiveName) => {
        if (objectiveName) {
          setRevealedObjectives([...revealedObjectives, objectives[objectiveName]])
        }
        setShowObjectiveModal(false)
      }} />
      <div className="flexColumn" style={{alignItems: "stretch", justifyContent: "flex-start", paddingTop: responsivePixels(140), boxSizing: "border-box", height: "100%", gap: numCards > 7 ? 0 : responsivePixels(8)}}>
        {/* <div className="flexRow">Initiative Order</div> */}
        {orderedStrategyCards.map((card) => {
          return <SmallStrategyCard key={card.name} card={card} active={!card.used} opts={{noColor: true, hideName: true}} />
        })}
        <LawsInEffect />
      </div>
      {/* <div className="flexColumn" style={{flexBasis: "25%", gap: "4px", alignItems: "stretch"}}>
        <div style={{textAlign: "center"}}>
          Initiative Order
        </div>
        {filteredStrategyCards.map((card) => {
          return <StrategyCard key={card.name} card={card} active={!card.used} opts={{hideName: true}} />
        })}
        <LawsInEffect />
      </div> */}
      <div className='flexColumn' style={{height: "100vh", boxSizing: "border-box", paddingTop: responsivePixels(80), justifyContent: "flex-start", alignItems: "center"}}>
        {/* <div className='extraLargeFont'>Status Phase</div> */}
        <div className='flexColumn' style={{width: '100%', height: "70vh", justifyContent: "space-between"}}>
          <MiddleColumn />
        </div>
        {/* <ol className='flexColumn' style={{alignItems: "flex-start", gap: "16px", margin: "0px", padding: "0px", fontSize: responsivePixels(18)}}>
        {Object.entries(getStartOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
          return (
            <NumberedItem key={abilityName}>
              <LabeledDiv label={abilityName}>
                <div className='flexRow mediumFont' style={{width: "100%"}}>
                {ability.factions.map((factionName) => {
                  return <LabeledDiv key={factionName} color={getFactionColor(factions[factionName])} style={{width: "auto"}}>
                    {getFactionName(factions[factionName])}
                  </LabeledDiv>
                })}
                <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                  &#x24D8;
                </div>
                </div>
              </LabeledDiv>
            </NumberedItem>);
        })}
        <NumberedItem>
          <div className="flexColumn" style={{alignItems: "flex-start"}}>
          In Initiative Order: 
          <LabeledDiv labelSize={20} label="Score up to one public and one secret objective">
          <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "stretch"}}>
            {filteredStrategyCards.map((card) => {
              const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
                return objective.selected && (objective.type === "stage-one" || objective.type === "stage-two") && !(objective.scorers ?? []).includes(card.faction);
              });
              const secrets = Object.values(objectives ?? {}).filter((objective) => {
                return objective.type === "secret" &&
                  !(objective.scorers ?? []).includes(card.faction) &&
                  objective.phase === "status";
              })
              const factionColor = getFactionColor(factions[card.faction]);
              const factionName = getFactionName(factions[card.faction]);
              const scoredPublics = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
                return objectives[objective].type === "stage-one" || objectives[objective].type === "stage-two";
              });
              const scoredSecrets = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
                return objectives[objective].type === "secret";
              });
              return <HoverMenu label={factionName} borderColor={factionColor}>
                <div className={scoredPublics.length === 0 && scoredSecrets.length === 0 ? 'flexRow' : 'flexColumn'} style={{gap: "4px", padding: "8px", alignItems: "flex-start"}}>
                {scoredPublics.length > 0 ?
                  <LabeledDiv label="SCORED PUBLIC" style={{whiteSpace: "nowrap"}}>
                    <SelectableRow itemName={scoredPublics[0]} removeItem={() => unscoreObj(card.faction, scoredPublics[0])}>
                      {scoredPublics[0]}
                    </SelectableRow>
                  </LabeledDiv>
                : <HoverMenu label="Score Public">
                  <div className="flexColumn" style={{whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch"}}>
                  {availableObjectives.length === 0 ? "No unscored public objectives" : null}
                  {availableObjectives.map((objective) => {
                    return <button style={{fontSize: responsivePixels(14)}} onClick={() => scoreObj(card.faction, objective)}>{objective.name}</button>
                  })}
                  </div> 
                </HoverMenu>}
                {scoredSecrets.length > 0 ? 
                  <LabeledDiv label="SCORED SECRET" style={{whiteSpace: "nowrap"}}>
                  <SelectableRow itemName={scoredSecrets[0]} removeItem={() => unscoreObj(card.faction, scoredSecrets[0])}>
                    {scoredSecrets[0]}
                  </SelectableRow>
                  </LabeledDiv>
                  : <HoverMenu label="Score Secret">
                  <div className="flexRow" style={{writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: responsivePixels(600), flexWrap: "wrap", whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch"}}>
                  {secrets.map((objective) => {
                    return <button onClick={() => scoreObj(card.faction, objective)}>{objective.name}</button>
                  })}
                  </div>
                </HoverMenu>}
                </div>
              </HoverMenu>})}
          </div>
          </LabeledDiv> */}
          {/* <HoverMenu label="Score Objectives">
          <div className="flexColumn" style={{flexWrap: "wrap", padding: "8px"}}>
            {filteredStrategyCards.map((card) => {
              const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
                return objective.selected && (objective.type === "stage-one" || objective.type === "stage-two") && !(objective.scorers ?? []).includes(card.faction);
              });
              const secrets = Object.values(objectives ?? {}).filter((objective) => {
                return objective.type === "secret" &&
                  !(objective.scorers ?? []).includes(card.faction) &&
                  objective.phase === "status";
              })
              const factionColor = getFactionColor(factions[card.faction]);
              const factionName = getFactionName(factions[card.faction]);
              const scoredPublics = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
                return objective.type === "stage-one" || objective.type === "stage-two";
              });
              const scoredSecrets = (((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []).filter((objective) => {
                return objective.type === "secret";
              });
              return <LabeledDiv key={card.faction} label={factionName} color={factionColor}>
                <div className="flexRow" style={{gap: "8px"}}>
                {scoredPublics.length > 0 ?
                  <LabeledDiv label="SCORED PUBLIC" style={{whiteSpace: "nowrap"}}>
                    <SelectableRow itemName={scoredPublics[0].name} removeItem={() => unscoreObjective(card.faction, scoredPublics[0].name)}>
                      {scoredPublics[0].name}
                    </SelectableRow>
                  </LabeledDiv>
                : <HoverMenu label="Public">
                  <div className="flexColumn" style={{whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch"}}>
                  {availableObjectives.length === 0 ? "No unscored public objectives" : null}
                  {availableObjectives.map((objective) => {
                    return <button onClick={() => scoreObjective(card.faction, objective)}>{objective.name}</button>
                  })}
                  </div> 
                </HoverMenu>}
                {scoredSecrets.length > 0 ? 
                  <LabeledDiv label="SCORED SECRET" style={{whiteSpace: "nowrap"}}>
                  <SelectableRow itemName={scoredSecrets[0].name} removeItem={() => unscoreObjective(card.faction, scoredSecrets[0].name)}>
                    {scoredSecrets[0].name}
                  </SelectableRow>
                  </LabeledDiv>
                  : <HoverMenu label="Secret">
                  <div className="flexRow" style={{writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: "400px", flexWrap: "wrap", whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch"}}>
                  {secrets.map((objective) => {
                    return <button onClick={() => scoreObjective(card.faction, objective)}>{objective.name}</button>
                  })}
                  </div>
                </HoverMenu>}
                </div>
              </LabeledDiv>
            })}
          </div>
          </HoverMenu> */}
          {/* </div>
        </NumberedItem> */}
        {/* <NumberedItem>
          {(subState.objectives ?? []).length > 0 ? 
            <LabeledDiv label="REVEALED OBJECTIVE"><ObjectiveRow objective={objectives[subState.objectives[0]]} removeObjective={() => removeObj(subState.objectives[0])} viewing={true} /></LabeledDiv>
          : <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])} style={{width: "100%"}}>
          <div className='flexRow' style={{whiteSpace: "nowrap"}}>
            {(subState.objectives ?? []).map((objective) => {
              return <ObjectiveRow objective={objectives[objective]} removeObjective={() => removeObj(objective.name)} viewing={true} />;
            })}
            {(subState.objectives ?? []).length < 1 ? 
              <HoverMenu label={`Reveal one Stage ${round > 3 ? "II" : "I"} objective`} buttonStyle={{fontSize: "14px"}}>
                <div className='flexRow' style={{gap: responsivePixels(4), whiteSpace: "nowrap", padding: responsivePixels(8), flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: responsivePixels(180)}}>
                  {Object.values(availableObjectives).filter((objective) => {
                    return objective.type === (round > 3 ? "stage-two" : "stage-one");
                  })
                    .map((objective) => {
                      return <button style={{fontSize: "14px"}} onClick={() => addObj(objective)}>{objective.name}</button>
                    })}
                </div>
              </HoverMenu>
            : null}
            </div>
          </LabeledDiv>} */}
          {/* <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Reveal one Stage {round > 3 ? "II" : "I"} objective
          </div>
          <div className='flexRow'>
          {(subState.objectives ?? []).map((objective) => {
          return <ObjectiveRow objective={objective} removeObjective={() => removeObj(objective.name)} viewing={true} />;
        })}
        {(subState.objectives ?? []).length < 1 ? 
          <HoverMenu label="Reveal Objective">
            <div className='flexColumn' style={{gap: "4px", alignItems: "stretch", whiteSpace: "nowrap", padding: "8px"}}>
              {Object.values(availableObjectives).filter((objective) => {
                return objective.type === "stage-one"
              })
                .map((objective) => {
                  return <button onClick={() => addObj(objective)}>{objective.name}</button>
                })}
            </div>
          </HoverMenu>
        : null}
            </div> */}
        {/* </NumberedItem>
        <NumberedItem>
          <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: "2px"}}>
            {Object.entries(numberOfActionCards).map(([number, localFactions]) => {
              const num = parseInt(number);
              if (localFactions.length === 0) {
                return null;
              }
              return (
                <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px", paddingLeft: "8px"}}>
                  <LabeledDiv labelSize={20} label={`Draw ${num} ${pluralize("Action Card", num)}${num === 3 ? " and discard any one" : ""}`}>
                  <div className="flexRow" style={{gap: 2, flexWrap: "wrap", justifyContent: "flex-start"}}>
                  {localFactions.map((faction) => {
                    return <LabeledDiv style={{width: "auto", fontSize: responsivePixels(12)}} color={getFactionColor(faction)}>
                      {getFactionName(faction)}
                    </LabeledDiv>
                    let menuButtons = [];
                    if (!hasTech(faction, "Neural Motivator")) {
                      menuButtons.push({
                        text: "Add Neural Motivator",
                        action: () => unlockTech(mutate, gameid, factions, faction.name, "Neural Motivator"),
                      });
                    } else {
                      menuButtons.push({
                        text: "Remove Neural Motivator",
                        action: () => lockTech(mutate, gameid, factions, faction.name, "Neural Motivator"),
                      });
                    }
                    return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: "16px", menuSide: "bottom"}}/>
                  })}
                  </div>
                  </LabeledDiv>
                </div>);
            })}
          </div>
        </NumberedItem>
        <NumberedItem>Return Command Tokens from the Board to Reinforcements</NumberedItem>
        <NumberedItem>
          <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: "2px"}}>
          {Object.entries(numberOfCommandTokens).map(([number, localFactions]) => {
            const num = parseInt(number);
            if (localFactions.length === 0) {
              return null;
            }
            return (
              <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px"}}>
                <LabeledDiv labelSize={20} label={`Gain ${num} ${pluralize("Command Token", num)} and Redistribute`}>
                <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "4px", padding: "0px 8px"}}>
                {localFactions.map((faction) => {
                  let menuButtons = [];
                  if (!hasTech(faction, "Hyper Metabolism")) {
                    menuButtons.push({
                      text: "Add Hyper Metabolism",
                      action: () => unlockTech(mutate, gameid, factions, faction.name, "Hyper Metabolism"),
                    });
                  } else {
                    menuButtons.push({
                      text: "Remove Hyper Metabolism",
                      action: () => lockTech(mutate, gameid, factions, faction.name, "Hyper Metabolism"),
                    });
                  }
                  return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: "16px", menuSide: "bottom"}}/>
                })}
                </div>
                </LabeledDiv>
              </div>);
          })}
          </div>
        </NumberedItem>
        <NumberedItem>Ready Cards</NumberedItem>
        <NumberedItem>Repair Units</NumberedItem>
        <NumberedItem>Return Strategy Cards</NumberedItem>
        {Object.entries(getEndOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
          return (
            <NumberedItem key={abilityName}>
              <div className="flexRow" style={{gap: "8px"}}>
              {ability.factions.map((factionName) => {
                return <BasicFactionTile key={factionName} faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>;
              })}
                {abilityName}
                <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                  &#x24D8;
                </div>
              </div>
            </NumberedItem>); */}
        {/* })} */}
      {/* </ol> */}
      {!statusPhaseComplete(subState) ? 
        <div style={{color: "firebrick"}}>Reveal one Stage {round > 3 ? "II" : "I"} objective</div>
      : null}
      <div className="flexRow">
      {!state.agendaUnlocked ? 
        <button disabled={!statusPhaseComplete(subState)} onClick={() => nextPhase(true)}>Start Next Round</button>
      : null}
        <button disabled={!statusPhaseComplete(subState)} onClick={() => nextPhase()}>Advance to Agenda Phase</button>  
      </div>
    </div>
    <div className="flexColumn" style={{height: "100vh", flexShrink: 0,  width: responsivePixels(280)}}>
      <SummaryColumn />
    </div>
  </div>);
}