import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from "react";
import { StrategyCard } from '../StrategyCard';
import { hasTech, lockTech, unlockTech } from '../util/api/techs';
import { resetStrategyCards } from '../util/api/cards';
import { readyAllFactions } from '../util/api/factions';
import { pluralize } from '../util/util';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { removeObjective } from '../util/api/objectives';
import { Modal } from "/src/Modal.js";
import SummaryColumn from './SummaryColumn';
import { LawsInEffect } from '../LawsInEffect';
import { useSharedUpdateTimes } from '../Updater';

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
  const { setUpdateTime } = useSharedUpdateTimes();

  if (!strategyCards || !state || !factions || !objectives || !options) {
    return <div>Loading...</div>;
  }

  function phaseComplete() {
    switch (state.phase) {
      case "STATUS":
        return revealedObjectives.length === 1;
    }
  }

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    resetStrategyCards(mutate, setUpdateTime, gameid, strategyCards);
    setRevealedObjectives([]);
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

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), options);

    readyAllFactions(mutate, setUpdateTime, gameid, factions);
  }

  function removeObj(objectiveName) {
    setRevealedObjectives(revealedObjectives.filter((objective) => objective.name !== objectiveName));
    removeObjective(mutate, setUpdateTime, gameid, objectives, null, objectiveName);
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
        <li>In Initiative Order: Score up to one public and one secret objective</li>
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Reveal one Stage {round > 3 ? "II" : "I"} objective
          </div>
          <div className='flexRow'>
          {revealedObjectives.length > 0 ?
            <ObjectiveRow objective={revealedObjectives[0]} removeObjective={() => removeObj(revealedObjectives[0].name)} /> :
            <button onClick={() => setShowObjectiveModal(true)}>Reveal Objective</button>}
            </div>
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
                  Draw {num} {pluralize("Action Card", num)} {num === 3 ? "and discard any one" : null}
                  <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "4px", padding: "0px 8px"}}>
                  {localFactions.map((faction) => {
                    let menuButtons = [];
                    if (!hasTech(faction, "Neural Motivator")) {
                      menuButtons.push({
                        text: "Add Neural Motivator",
                        action: () => unlockTech(mutate, setUpdateTime, gameid, factions, faction.name, "Neural Motivator"),
                      });
                    } else {
                      menuButtons.push({
                        text: "Remove Neural Motivator",
                        action: () => lockTech(mutate, setUpdateTime, gameid, factions, faction.name, "Neural Motivator"),
                      });
                    }
                    return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: "16px", menuSide: "bottom"}}/>
                  })}
                  </div>
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
                Gain {num} {pluralize("Command Token", num)} and Redistribute 
                <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "4px", padding: "0px 8px"}}>
                {localFactions.map((faction) => {
                  let menuButtons = [];
                  if (!hasTech(faction, "Hyper Metabolism")) {
                    menuButtons.push({
                      text: "Add Hyper Metabolism",
                      action: () => unlockTech(mutate, setUpdateTime, gameid, factions, faction.name, "Hyper Metabolism"),
                    });
                  } else {
                    menuButtons.push({
                      text: "Remove Hyper Metabolism",
                      action: () => lockTech(mutate, setUpdateTime, gameid, factions, faction.name, "Hyper Metabolism"),
                    });
                  }
                  return <BasicFactionTile key={faction.name} faction={faction} speaker={faction.name === state.speaker} menuButtons={menuButtons} opts={{fontSize: "16px", menuSide: "bottom"}}/>
                })}
                </div>
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