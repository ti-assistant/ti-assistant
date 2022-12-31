import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import React, { useRef, useState } from "react";
import { StrategyCard } from '../StrategyCard';
import { hasTech, lockTech, unlockTech } from '../util/api/techs';
import { resetStrategyCards } from '../util/api/cards';
import { readyAllFactions } from '../util/api/factions';
import { pluralize } from '../util/util';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { removeObjective, revealObjective } from '../util/api/objectives';
import { Modal } from "/src/Modal.js";
import SummaryColumn from './SummaryColumn';
import { LawsInEffect } from '../LawsInEffect';
import { useSharedUpdateTimes } from '../Updater';
import { HoverMenu } from '../HoverMenu';
import { LabeledDiv } from '../LabeledDiv';
import { getFactionColor, getFactionName } from '../util/factions';
import { SelectableRow } from '../SelectableRow';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{maxWidth: "400px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {content}
    </div>
  );
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
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  const [ revealedObjectives, setRevealedObjectives ] = useState([]);
  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const [ subState, setSubState ] = useState({});
  


  if (!strategyCards || !state || !factions || !objectives || !options) {
    return <div>Loading...</div>;
  }

  function phaseComplete() {
    switch (state.phase) {
      case "STATUS":
        return (subState.objectives ?? []).length === 1;
    }
  }

  function nextPhase(skipAgenda = false) {
    (subState.objectives ?? []).forEach((objective) => {
      revealObjective(mutate, gameid, objectives, null, objective.name);
    });
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    resetStrategyCards(mutate, gameid, strategyCards);
    const phase = skipAgenda ? "STRATEGY" : "AGENDA";
    const activeFactionName = state.speaker;
    const round = skipAgenda ? state.round++ : state.round;
    const agendaUnlocked = !skipAgenda;

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;
    state.agendaUnlocked = agendaUnlocked;
    state.round = round;

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);

    readyAllFactions(mutate, gameid, factions);
  }

  function addObj(objective) {
    setSubState({
      ...subState,
      objectives: [...(subState.objectives ?? []), objective],
    })
  }

  function removeObj(objectiveName) {
    setSubState({
      ...subState,
      objectives: (subState.objectives ?? []).filter((objective) => objective.name !== objectiveName),
    });
  }

  function scoreObjective(factionName, objective) {
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
    updatedState.factions[factionName].objectives.push(objective);
    setSubState(updatedState);
  }
  function unscoreObjective(factionName, objectiveName) {
    const updatedState = {...subState};
    if (!updatedState.factions || !updatedState.factions[factionName] || !updatedState.factions[factionName].objectives) {
      return;
    }
    updatedState.factions[factionName].objectives = updatedState.factions[factionName].objectives.filter((objective) => objective.name !== objectiveName);
    setSubState(updatedState);
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

  const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    return objective.type === type && !objective.selected;
  });
  return (
    <div className="flexRow" style={{gap: "40px", height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={infoModal.title} content={
        <InfoContent content={infoModal.content} />
      } top="30%" />
      <ObjectiveModal visible={showObjectiveModal} type={type} onComplete={(objectiveName) => {
        if (objectiveName) {
          setRevealedObjectives([...revealedObjectives, objectives[objectiveName]])
        }
        setShowObjectiveModal(false)
      }} />
      <div className="flexColumn" style={{flexBasis: "25%", gap: "4px", alignItems: "stretch"}}>
        <div style={{textAlign: "center"}}>
          Initiative Order
        </div>
        {filteredStrategyCards.map((card) => {
          return <StrategyCard key={card.name} card={card} active={!card.used} opts={{hideName: true}} />
        })}
        <LawsInEffect />
      </div>
      <div className='flexColumn' style={{flexBasis: "50%", gap: "8px"}}>
        <ol className='flexColumn' style={{alignItems: "flex-start", gap: "16px", margin: "0px", padding: "0px", fontSize: "24px"}}>
        {Object.entries(getStartOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
          return (
            <li key={abilityName}>
              <div className="flexRow" style={{gap: "8px"}}>
              {ability.factions.map((factionName) => {
                return <BasicFactionTile key={factionName} faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>;
              })}
                {abilityName}
                <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                  &#x24D8;
                </div>
              </div>
            </li>);
        })}
        <li>
          <div className="flexColumn" style={{gap: "4px", alignItems: "flex-start"}}>
          In Initiative Order: Score up to one public and one secret objective
          <div className="flexRow" style={{gap: "4px"}}>
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
              return <HoverMenu label={factionName} borderColor={factionColor}>
                <div className='flexColumn' style={{gap: "4px", padding: "8px", flexWrap: "wrap"}}>
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
              </HoverMenu>})}
          </div>
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
          </div>
        </li>
        <li>
          {(subState.objectives ?? []).length > 0 ? 
            <LabeledDiv label="REVEALED OBJECTIVE"><ObjectiveRow objective={subState.objectives[0]} removeObjective={() => removeObj(subState.objectives[0].name)} viewing={true} /></LabeledDiv>
          : <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])} style={{width: "100%"}}>
          <div className='flexRow' style={{whiteSpace: "nowrap"}}>
            {(subState.objectives ?? []).map((objective) => {
              return <ObjectiveRow objective={objective} removeObjective={() => removeObj(objective.name)} viewing={true} />;
            })}
            {(subState.objectives ?? []).length < 1 ? 
              <HoverMenu label={`Reveal one Stage ${round > 3 ? "II" : "I"} objective`}>
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
            </div>
          </LabeledDiv>}
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
        </li>
        <li>
          <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: "2px"}}>
            In Initiative Order: 
            {Object.entries(numberOfActionCards).map(([number, localFactions]) => {
              const num = parseInt(number);
              if (localFactions.length === 0) {
                return null;
              }
              return (
                <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px", paddingLeft: "8px"}}>
                  <LabeledDiv label={`Draw ${num} ${pluralize("Action Card", num)}${num === 3 ? " and discard any one" : ""}`}>
                  <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "8px", padding: "0px 8px"}}>
                  {localFactions.map((faction) => {
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
        </li>
        <li>Return Command Tokens from the Board to Reinforcements</li>
        <li>
          <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: "2px"}}>
          {Object.entries(numberOfCommandTokens).map(([number, localFactions]) => {
            const num = parseInt(number);
            if (localFactions.length === 0) {
              return null;
            }
            return (
              <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px"}}>
                <LabeledDiv label={`Gain ${num} ${pluralize("Command Token", num)} and Redistribute`}>
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
        </li>
        <li>Ready Cards</li>
        <li>Repair Units</li>
        <li>Return Strategy Cards</li>
        {Object.entries(getEndOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
          return (
            <li key={abilityName}>
              <div className="flexRow" style={{gap: "8px"}}>
              {ability.factions.map((factionName) => {
                return <BasicFactionTile key={factionName} faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>;
              })}
                {abilityName}
                <div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>
                  &#x24D8;
                </div>
              </div>
            </li>);
        })}
      </ol>
      {!phaseComplete() ? 
        <div style={{color: "darkred"}}>Reveal one Stage {round > 3 ? "II" : "I"} objective</div>
      : null}
      <div className="flexRow" style={{gap: "8px"}}>
      {!state.agendaUnlocked ? 
        <button disabled={!phaseComplete()} onClick={() => nextPhase(true)}>Start Next Round</button>
      : null}
        <button disabled={!phaseComplete()} onClick={() => nextPhase()}>Advance to Agenda Phase</button>  
      </div>
    </div>
    <div className="flexColumn" style={{flexBasis: "33%", maxWidth: "400px"}}>
      <SummaryColumn />
    </div>
  </div>);
}