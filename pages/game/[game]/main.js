import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard, FactionTile } from '/src/FactionCard.js'
import { TechChoice } from '/src/TechChoice.js'
import QRCode from "qrcode";
import { StrategyCard } from '../../../src/StrategyCard';
import { getOnDeckFaction, getStrategyCardsForFaction } from '../../../src/util/helpers';
import { hasTech, unlockTech } from '../../../src/util/api/techs';
import { useStrategyCard, resetStrategyCards, strategyCardOrder } from '../../../src/util/api/cards';
import { passFaction, readyAllFactions } from '../../../src/util/api/factions';
import { pluralize } from '../../../src/util/util';
import { fetcher, poster } from '../../../src/util/api/util';
import { SpeakerModal } from '../../../src/SpeakerModal';
import { BasicFactionTile } from '../../../src/FactionTile';

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: strategyCards, strategyCardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);
  const [ showSpeakerModal, setShowSpeakerModal ] = useState(false);

  // TODO: Consider moving this to a sub-function.
  const [ selectedActions, setSelectedActions ] = useState([]);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
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

  function factionChoicesComplete() {
    let complete = true;
    orderedFactions.forEach(([name, faction]) => {
      if (faction.startswith.choice) {
        if ((faction.startswith.techs ?? []).length !== faction.startswith.choice.select) {
          complete = false;
        }
      }
    });
    return complete;
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

  function nextPhase() {
    const data = {
      action: "ADVANCE_PHASE",
    };
    let phase;
    let activeFaction;
    let round = state.round;
    switch (state.phase) {
      case "SETUP":
        phase = "STRATEGY";
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
        // TODO(jboman): Update to consider not agenda
        resetStrategyCards(mutate, gameid, strategyCards);
        phase = "AGENDA";
        break;
      case "AGENDA":
        phase = "STRATEGY";
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

  switch (state.phase) {
    case "SETUP":
      return (
        <div>
          <SpeakerModal visible={showSpeakerModal} onComplete={() => setShowSpeakerModal(false)} />
          <div className="flexColumn" style={{alignItems: "center"}}>
            <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Setup Game</h3>
            <ol className='flexColumn' style={{alignItems: "center", margin: "0px", padding: "0px", fontSize: "24px", gap: "8px"}}>
              <li>Build the galaxy</li>
              <li>Shuffle decks</li>
              <li>Gather starting components</li>
              <div className="flexRow" style={{alignItems:"stretch", justifyContent: "space-between", gap: "8px"}}>
                {orderedFactions.map(([name, faction]) => {
                  return <FactionCard key={name} faction={faction} opts={{
                    displayStartingComponents: true,
                    fontSize: "16px",
                  }} />
                })}
              </div>
              <li>Draw 2 secret objectives and keep one</li>
              <li>Re-shuffle secret objectives</li>
              <li><div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
                <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
                {/* <FactionTile faction={factions[state.speaker]} opts={{fontSize: "18px"}} /> */}
                Draw 5 stage one objectives and reveal 2</div></li>
              <li><div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
              <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
                {/* <FactionTile faction={factions[state.speaker]} opts={{fontSize: "18px"}} /> */}
                Draw 5 stage two objectives</div></li>
            </ol>
            <button disabled={!factionChoicesComplete()} onClick={nextPhase}>Next</button>
            {!factionChoicesComplete() ? <div style={{color: "darkred"}}>Select all tech choices</div> : null}
          </div>
        </div>
      );
    case "STRATEGY": {
      async function assignStrategyCard(card, faction) {
        const data = {
          action: "ASSIGN_STRATEGY_CARD",
          card: card.name,
          faction: faction.name,
        };
    
        const updatedCards = {...strategyCards};
        updatedCards[card.name].faction = faction.name;
        for (const [name, card] of Object.entries(updatedCards)) {
          if (card.invalid) {
            delete updatedCards[name].invalid;
          }
        }
        if (faction.name === "Naalu Collective") {
          updatedCards[card.name].order = 0;
        }
    
        const options = {
          optimisticData: updatedCards,
        };
        await nextPlayer();
        mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
      }
      
      const activefaction = factions[state.activeplayer] ?? null;
      const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
      // let ondeckfaction;
      // if (activefaction) {
      //   const nextorder = activefaction.order + 1;
      //   for (const faction of Object.values(factions)) {
      //     if (faction.order === nextorder) {
      //       ondeckfaction = faction;
      //       break;
      //     }
      //   }
      // }
      const orderedStrategyCards = Object.entries(strategyCards).sort((a, b) => strategyCardOrder[a[0]] - strategyCardOrder[b[0]]);
      return (
        <div>
          {/* <SpeakerModal visible={showSpeakerModal} onComplete={() => setShowSpeakerModal(false)} /> */}
          <div className="flexColumn" style={{alignItems: "center", gap: "8px"}}>
            {/* <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button> */}
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {state.round}: Strategy Phase</h3>
            <div className="flexRow" style={{gap: "8px"}}>
              {activefaction ?
              <div className="flexColumn" style={{alignItems: "center"}}>
                Active Player
                <FactionCard faction={activefaction} />
              </div>
              : "Strategy Phase Complete"}
              {onDeckFaction ? 
                <div className="flexColumn" style={{alignItems: "center"}}>
                  On Deck
                  <FactionTile faction={onDeckFaction} opts={{fontSize: "20px"}}/>
                </div>
              : null}
            </div>
            <div className="flexColumn" style={{gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "500px"}}>
              {orderedStrategyCards.map(([name, card]) => {
                return <StrategyCard key={name} card={card} active={card.faction || !activefaction || card.invalid ? false : true} onClick={card.faction || !activefaction || card.invalid ? null : () => assignStrategyCard(card, activefaction)}/>
              })}
            </div>
            {activefaction ? null :
              <button onClick={nextPhase}>Next</button>
            }
          </div>
        </div>
      );
    }
    case "ACTION": {
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

      async function completeActions(fleetLogistics) {
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
            return <button onClick={completeFunction}>Next Player</button>
          case 2:
            if (!hasTech(activeFaction, "Fleet Logistics")) {
              return <div>
                <button onClick={completeFunction}>Next Player (using Fleet Logistics)</button>
                <button onClick={completeFunction}>Next Player (using Master Plan)</button>
              </div>
            }
            return <button onClick={completeFunction}>Next Player (using Fleet Logistics)</button>
          case 3:
            return <button onClick={completeFunction}>Next Player (using Fleet Logistics and Master Plan)</button>
          case 4:
            return <button onClick={completeFunction}>Next Player (using Fleet Logistics, Master Plan, and The Codex?)</button>
        }
        throw new Error("Too many actions selected");
      }

      function speakerSelectionComplete(selected) {
        if (selected && selectedActions.includes("Politics")) {
          completeActions()
        }
        setShowSpeakerModal(false);
      }

      return (
        <div>
          <SpeakerModal forceSelection={selectedActions.includes("Politics")} visible={showSpeakerModal} onComplete={speakerSelectionComplete} />
          <div className="flexColumn" style={{alignItems: "center"}}>
            <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {state.round}: Action Phase</h3>
            <div className="flexRow" style={{width: "100%", alignItems: "flex-start", justifyContent: "space-between"}}>
              <div className="flexColumn" style={{flexBasis: "33%", gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "400px"}}>
                {orderedStrategyCards.map((card) => {
                  return <StrategyCard key={card.name} card={card} active={!card.used} />
                })}
              </div>
              <div className="flexColumn" style={{flexBasis: "33%"}}>
                <div className="flexRow" style={{flexBasis: "33%", gap: "8px"}}>
                  {activeFaction ?
                  <div className="flexColumn" style={{alignItems: "center"}}>
                    Active Player
                    <FactionCard faction={activeFaction} />
                  </div>
                  : "Strategy Phase Complete"}
                  {onDeckFaction ? 
                    <div className="flexColumn" style={{alignItems: "center"}}>
                      On Deck
                      <FactionTile faction={onDeckFaction} opts={{fontSize: "20px"}}/>
                    </div>
                  : null}
                </div>
                {activeFaction ? 
                  <div className="flexColumn">
                    Actions
                    <div className="flexRow">
                      {getStrategyCardsForFaction(orderedStrategyCards, activeFaction.name).map((card) => {
                        return (
                        <div key={card.name}>
                          <label style={{color: card.used ? "grey" : "#eee"}}>
                            <input type="checkbox" id={card.name} disabled={card.used} onChange={() => toggleAction(card.name)} checked={selectedActions.includes(card.name)} />
                            {card.name}
                          </label>
                        </div>
                        );
                      })}
                      <label>
                        <input type="checkbox" id="Tactical" onChange={() => toggleAction("Tactical")} checked={selectedActions.includes("Tactical")} />
                        Tactical/Component
                      </label>
                      <label style={{color: !canFactionPass(activeFaction.name) ? "grey" : "#eee"}}>
                        <input type="checkbox" id="Pass" disabled={!canFactionPass(activeFaction.name)} onChange={() => toggleAction("Pass")} checked={selectedActions.includes("Pass")} />
                        Pass
                      </label>
                    </div>
                  {nextPlayerButtons()}
                </div>
                : null}
              </div>
              <div className="flexColumn" style={{flexBasis: "33%"}}>
                Third column
              </div>
            </div>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );
    }
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
      return (
          <div className="flexColumn" style={{alignItems: "center"}}>
            <SpeakerModal visible={showSpeakerModal} onComplete={() => setShowSpeakerModal(false)} />
            <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Status Phase: Round {round}</h3>
            <div className="flexRow" style={{gap: "40px", width: "100%", alignItems: "flex-start", justifyContent: "space-between"}}>
              <div className="flexColumn" style={{gap: "4px", alignItems: "stretch"}}>
                <div style={{textAlign: "center"}}>Initiative Order</div>
                {filteredStrategyCards.map((card) => {
                  return <StrategyCard key={card.name} card={card} active={!card.used} opts={{hideName: true}} />
                })}
              </div>
            <div className='flexColumn' style={{flexBasis: "50%"}}>
            <ol className='flexColumn' style={{alignItems: "flex-start", gap: "20px", margin: "0px", padding: "0px", fontSize: "24px"}}>
              <li>In Initiative Order: Score up to one public and one secret objective</li>
              <li>
                <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
                  <FactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
                  Reveal one Stage {round > 3 ? "II" : "I"} objective
                </div>
              </li>
              <li>
                <div className="flexColumn" style={{justifyContent: "flex-start", alignItems: "stretch", gap: "2px"}}>
                In Initiative Order: 
                  {Object.entries(numberOfActionCards).map(([number, factions]) => {
                    const num = parseInt(number);
                    if (factions.length === 0) {
                      return null;
                    }
                    return (
                      <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px", paddingLeft: "8px"}}>
                        Draw {num} {pluralize("Action Card", num)} {num === 3 ? "and discard any one" : null}
                        <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "4px", padding: "0px 8px"}}>
                          {factions.map((faction) => {
                            return <FactionTile key={faction.name} faction={faction} opts={{fontSize: "16px"}}/>
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
                  {Object.entries(numberOfCommandTokens).map(([number, factions]) => {
                    const num = parseInt(number);
                    if (factions.length === 0) {
                      return null;
                    }
                    return (
                      <div key={num} className="flexColumn" style={{alignItems: "flex-start", gap: "4px"}}>
                        Gain {num} {pluralize("Command Token", num)} and Redistribute 
                        <div className="flexRow" style={{flexWrap: "wrap", justifyContent: "flex-start", gap: "4px", padding: "0px 8px"}}>
                          {factions.map((faction) => {
                            return <FactionTile key={faction.name} faction={faction} opts={{fontSize: "16px"}}/>
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
            </ol>
            <button onClick={nextPhase}>Next</button>
            </div>
            <div style={{flexBasis: "25%"}}>
              Third column
            </div>
          </div>
        </div>
      );
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {state.round}: Status Phase</h3>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );
    case "AGENDA":
      return (
        <div>
          <SpeakerModal visible={showSpeakerModal} onComplete={() => setShowSpeakerModal(false)} />
          <div className="flexColumn" style={{alignItems: "center"}}>
            <button style={{position: "fixed", top: "20px", left: "40px"}} onClick={() => setShowSpeakerModal(true)}>
              Set Speaker
            </button>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {state.round}: Agenda Phase</h3>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );

  }
  return (
    <div>Error...</div>
  );
}