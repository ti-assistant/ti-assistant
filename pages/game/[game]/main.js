import { useRouter } from 'next/router'
import useSWR, { mutate, useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard, FactionTile } from '/src/FactionCard.js'
import { TechChoice } from '/src/TechChoice.js'
import QRCode from "qrcode";
import { StrategyCard } from '../../../src/StrategyCard';
import { getOnDeckFaction, getStrategyCardsForFaction } from '../../../src/util/helpers';
import { hasTech, lockTech, unlockTech } from '../../../src/util/api/techs';
import { useStrategyCard, resetStrategyCards, strategyCardOrder, unassignStrategyCard, swapStrategyCards, setFirstStrategyCard } from '../../../src/util/api/cards';
import { passFaction, readyAllFactions } from '../../../src/util/api/factions';
import { getNextIndex, pluralize } from '../../../src/util/util';
import { fetcher, poster } from '../../../src/util/api/util';
import { SpeakerModal } from '../../../src/SpeakerModal';
import { ObjectiveModal } from '../../../src/ObjectiveModal';
import { BasicFactionTile } from '../../../src/FactionTile';
import { FactionSummary } from '../../../src/FactionSummary';
import { ObjectiveRow } from '../../../src/ObjectiveRow';
import { removeObjective } from '../../../src/util/api/objectives';
import { Modal } from "/src/Modal.js";
import { VoteCount } from '../../../src/VoteCount';
import { AgendaTimer, FactionTimer, GameTimer, useSharedCurrentAgenda } from '../../../src/Timer';
import { claimPlanet, readyPlanets } from '../../../src/util/api/planets';
import AgendaPhase from '../../../src/main/AgendaPhase';
import SummaryColumn from '../../../src/main/SummaryColumn';
import SetupPhase from '../../../src/main/SetupPhase';
import StrategyPhase from '../../../src/main/StrategyPhase';
import ActionPhase from '../../../src/main/ActionPhase';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{maxWidth: "400px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {content}
    </div>
  );
}

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: planets, planetsError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: strategyCards, strategyCardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options, optionsError } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);
  const [ showSpeakerModal, setShowSpeakerModal ] = useState(false);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);

  const [ revealedObjectives, setRevealedObjectives ] = useState([]);

  // TODO: Consider moving this to a sub-function.
  const [ selectedActions, setSelectedActions ] = useState([]);

  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const [ showTechs, setShowTechs ] = useState(true);
  const [ showPlanets, setShowPlanets ] = useState(true);
  const { resetAgendaPhase } = useSharedCurrentAgenda();

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
      width: 120,
      height: 120,
      margin: 4,
    }, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (techError) {
    return (<div>Failed to load techs</div>);
  }
  if (planetsError) {
    return (<div>Failed to load techs</div>);
  }
  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (strategyCardsError) {
    return (<div>Failed to load strategy cards</div>);
  }
  if (!state || !techs || !factions || !strategyCards) {
    return (<div>Loading...</div>);
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  function factionTechChoicesComplete() {
    let complete = true;
    orderedFactions.forEach(([name, faction]) => {
      if (faction.startswith.choice) {
        const numSelected = (faction.startswith.techs ?? []).length;
        const numRequired = faction.startswith.choice.select;
        const numAvailable = faction.startswith.choice.options.length;
        if (numSelected !== numRequired && numSelected !== numAvailable) {
          complete = false;
        }
      }
    });
    return complete;
  }

  function factionSubFactionChoicesComplete() {
    if (!factions['Council Keleres']) {
      return true;
    }
    return (factions['Council Keleres'].startswith.planets ?? []).length !== 0;
  }


  // function clearStrategyCards() {
  //   const data = {
  //     action: "CLEAR_STRATEGY_CARDS",
  //   };

  //   const updatedCards = {...strategyCards};
  //   for (const name of Object.keys(updatedCards)) {
  //     delete updatedCards[name].faction;
  //     updatedCards[name].order = defaultOrder[name];
  //   }

  //   const options = {
  //     optimisticData: updatedCards,
  //   };

  //   mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
  // }

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
    let phase;
    let activeFaction;
    let round = state.round;
    let agendaUnlocked = state.agendaUnlocked;
    switch (state.phase) {
      case "SETUP":
        phase = "STRATEGY";
        if (factions['Council Keleres']) {
          for (const planet of factions['Council Keleres'].startswith.planets) {
            claimPlanet(mutate, gameid, planets, planet, "Council Keleres", options);
          }
          readyPlanets(mutate, gameid, planets, factions['Council Keleres'].startswith.planets, "Council Keleres");
        }
        break;
      case "STRATEGY":
        phase = "ACTION";
        break;
      case "ACTION":
        phase = "STATUS";
        let minCard = {
          order: Number.MAX_SAFE_INTEGER,
        };
        for (const strategyCard of Object.values(strategyCards)) {
          if (strategyCard.faction && strategyCard.order < minCard.order) {
            minCard = strategyCard;
          }
        }
        if (!minCard.faction) {
          throw Error("Transition to ACTION phase w/o selecting cards?");
        }
        activeFaction = factions[minCard.faction];
        break;
      case "STATUS":
        resetStrategyCards(mutate, gameid, strategyCards);
        setRevealedObjectives([]);
        phase = skipAgenda ? "STRATEGY" : "AGENDA";
        agendaUnlocked = !skipAgenda;
        break;
      case "AGENDA":
        phase = "STRATEGY";
        resetAgendaPhase();
        activeFaction = null;
        for (const faction of Object.values(factions)) {
          if (faction.order === 1) {
            activeFaction = faction;
            break;
          }
        }
        ++round;
        break;
    }

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFaction ? activeFaction.name : "None";
    state.agendaUnlocked = agendaUnlocked;
    state.round = round;

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

  function removeObj(objectiveName) {
    setRevealedObjectives(revealedObjectives.filter((objective) => objective.name !== objectiveName));
    removeObjective(mutate, gameid, objectives, null, objectiveName);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  switch (state.phase) {
    case "SETUP":
      return (
        <div className="flexColumn" style={{alignItems: "center"}}>
          <Header />
          <SetupPhase />
        </div>
      );
    case "STRATEGY":
      return (
        <div className="flexColumn" style={{alignItems: "center"}}>
          <Header />
          <StrategyPhase />
        </div>
      );
    case "ACTION":
      return (
        <div className="flexColumn" style={{alignItems: "center"}}>
          <Header />
          <ActionPhase />
        </div>
      );
    case "STATUS":
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
          <div className="flexColumn" style={{alignItems: "center"}}>
            <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={infoModal.title} content={
              <InfoContent content={infoModal.content} />
            } top="30%" />
            <ObjectiveModal visible={showObjectiveModal} type={type} onComplete={(objectiveName) => {
              if (objectiveName) {
                setRevealedObjectives([...revealedObjectives, objectives[objectiveName]])
              }
              setShowObjectiveModal(false)
            }} />
            <SpeakerModal visible={showSpeakerModal} onComplete={() => setShowSpeakerModal(false)} />
            {/* <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button> */}
            <Header />
            <div className="flexRow" style={{gap: "40px", height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
              <div className="flexColumn" style={{gap: "4px", alignItems: "stretch"}}>
                <div style={{textAlign: "center"}}>Initiative Order</div>
                {filteredStrategyCards.map((card) => {
                  return <StrategyCard key={card.name} card={card} active={!card.used} opts={{hideName: true}} />
                })}
              </div>
            <div className='flexColumn' style={{flexBasis: "50%", gap: "8px"}}>
            <ol className='flexColumn' style={{alignItems: "flex-start", gap: "16px", margin: "0px", padding: "0px", fontSize: "24px"}}>
              {Object.entries(getStartOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
                return <li key={abilityName}>
                <div className="flexRow" style={{gap: "8px"}}>
                  {ability.factions.map((factionName) => {
                    return <BasicFactionTile key={factionName} faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>;
                  })}
                  {abilityName}<div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>&#x24D8;</div>
                </div>
              </li>
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
                      </div>
                    );
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
                          {localFactions.map((faction) => {                            let menuButtons = [];
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
                      </div>
                    );
                  })}
                </div>
              </li>
              <li>Ready Cards</li>
              <li>Repair Units</li>
              <li>Return Strategy Cards</li>
              {Object.entries(getEndOfStatusPhaseAbilities()).map(([abilityName, ability]) => {
                return <li key={abilityName}>
                <div className="flexRow" style={{gap: "8px"}}>
                  {ability.factions.map((factionName) => {
                    return <BasicFactionTile key={factionName} faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>;
                  })}
                  {abilityName}<div className="popupIcon" onClick={() => showInfoModal(abilityName, ability.description)}>&#x24D8;</div>
                </div>
              </li>
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
          </div>
        </div>
      );
    case "AGENDA":
      return (
        <div className="flexColumn" style={{alignItems: "center"}}>
          <Header />
          <AgendaPhase />
        </div>
      );
  }
  return (
    <div>Error...</div>
  );
}

function refreshData(gameid, mutate) {
  mutate(`/api/${gameid}/state`, fetcher(`/api/${gameid}/state`));
  mutate(`/api/${gameid}/techs`, fetcher(`/api/${gameid}/techs`));
  mutate(`/api/${gameid}/planets`, fetcher(`/api/${gameid}/planets`));
  mutate(`/api/${gameid}/strategyCards`, fetcher(`/api/${gameid}/strategyCards`));
  mutate(`/api/${gameid}/factions`, fetcher(`/api/${gameid}/factions`));
  mutate(`/api/${gameid}/objectives`, fetcher(`/api/${gameid}/objectives`));
  mutate(`/api/${gameid}/options`, fetcher(`/api/${gameid}/options`));
  mutate(`/api/${gameid}/agendas`, fetcher(`/api/${gameid}/agendas`));

}

function Sidebar({side, content}) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{letterSpacing: "3px"}}>
      {content}
    </div>
  );
}

function Header() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
      width: 120,
      height: 120,
      margin: 4,
    }, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  let phase = "";
  switch (state.phase) {
    case "SETUP":
      phase = "Setup";
      break;
    case "STRATEGY":
      phase = "Strategy";
      break;
    case "ACTION":
      phase = "Action";
      break;
    case "STATUS":
      phase = "Status";
      break;
    case "AGENDA":
      phase = "Agenda";
      break;
  }

  return <div className="flexColumn" style={{top: 0, position: "fixed", alignItems: "center", justifyContent: "center"}}>
    <Sidebar side="left" content={`${state.phase} PHASE`} />
    <Sidebar side="right" content={`ROUND ${state.round}`} />

    {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
      SETUP PHASE
    </div> */}
    <h2>Twilight Imperium Assistant</h2>
    <div className="flexRow" style={{gap: "8px", alignItems: "center", justifyContent: "center", position: "fixed", left: "144px", top: "8px"}}>
      {qrCode ? <img src={qrCode} /> : null}
      <div>Game ID: {gameid}</div>
      <button onClick={() => refreshData(gameid, mutate)}>Refresh</button>
    </div>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "288px", top: "16px"}}>
      <GameTimer />
    </div>
  </div>
}