import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import { TechChoice } from '/src/TechChoice.js'
import QRCode from "qrcode";
import { StrategyCard } from '../../../src/StrategyCard';

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

const poster = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const val = await res.json();

  if (res.status !== 200) {
    throw new Error(val.message);
  }
  return val;
}

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: gameState, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: strategycards, strategyCardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

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
  if (!gameState || !techs || !factions || !strategycards) {
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

  const defaultOrder = {
    "Leadership": 1,
    "Diplomacy": 2,
    "Politics": 3,
    "Construction": 4,
    "Trade": 5,
    "Warfare": 6,
    "Technology": 7,
    "Imperial": 8,
  };

  function clearStrategyCards() {
    const data = {
      action: "CLEAR_STRATEGY_CARDS",
    };

    const updatedCards = {...strategycards};
    for (const name of Object.keys(updatedCards)) {
      delete updatedCards[name].faction;
      updatedCards[name].order = defaultOrder[name];
    }

    const options = {
      optimisticData: updatedCards,
    };

    mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
  }

  function nextPhase() {
    const data = {
      action: "ADVANCE_PHASE",
    };
    let phase;
    let activefaction;
    let round = gameState.state.round;
    switch (gameState.state.phase) {
      case "SETUP":
        phase = "STRATEGY";
        break;
      case "STRATEGY":
        phase = "ACTION";
        break;
      case "ACTION":
        phase = "STATUS";
        break;
      case "STATUS":
        // TODO(jboman): Update to consider not agenda
        clearStrategyCards();
        phase = "AGENDA";
        break;
      case "AGENDA":
        phase = "STRATEGY";
        activefaction = null;
        for (const faction of Object.values(factions)) {
          if (faction.order === 1) {
            activefaction = faction;
            break;
          }
        }
        ++round;
        break;
    }

    const updatedState = {...gameState};
    updatedState.state.phase = phase;
    updatedState.state.activeplayer = activefaction ? activefaction.name : "None";
    updatedState.state.round = round;

    console.log(updatedState);

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  function nextPlayer() {
    const data = {
      action: "ADVANCE_PLAYER",
    };
    
    const updatedState = {...gameState};
    const activefaction = factions[gameState.state.activeplayer];
    let ondeckfaction;
    if (gameState.state.phase === "STRATEGY") {
      const nextorder = activefaction.order + 1;
      for (const faction of Object.values(factions)) {
        if (faction.order === nextorder) {
          ondeckfaction = faction;
          break;
        }
      }
    }
    updatedState.state.activeplayer = ondeckfaction ? ondeckfaction.name : "None";

    const options = {
      optimisticData: updatedState,
    };
    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  console.log(gameState);

  switch (gameState.state.phase) {
    case "SETUP":
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
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
              <li>Draw 5 stage one objectives and reveal 2</li>
              <li>Draw 5 stage two objectives</li>
            </ol>
            <button disabled={!factionChoicesComplete()} onClick={nextPhase}>Next</button>
            {!factionChoicesComplete() ? <div style={{color: "darkred"}}>Select all tech choices</div> : null}
          </div>
        </div>
      );
    case "STRATEGY":
      function assignStrategyCard(card, faction) {
        const data = {
          action: "ASSIGN_STRATEGY_CARD",
          card: card.name,
          faction: faction.name,
        };
    
        const updatedCards = {...strategycards};
        updatedCards[card.name] = {
          ...card,
          faction: faction.name,
        };
    
        console.log(updatedCards);
    
        const options = {
          optimisticData: updatedCards,
        };
    
        mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
        nextPlayer();
      }
      const activefaction = factions[gameState.state.activeplayer] ?? null;
      let ondeckfaction;
      if (activefaction) {
        const nextorder = activefaction.order + 1;
        for (const faction of Object.values(factions)) {
          if (faction.order === nextorder) {
            ondeckfaction = faction;
            break;
          }
        }
      }
      const orderedStrategyCards = Object.entries(strategycards).sort((a, b) => a[1].order - b[1].order);
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center", gap: "8px"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {gameState.state.round}: Strategy Phase</h3>
            <div className="flexRow" style={{gap: "8px"}}>
              {activefaction ?
              <div className="flexColumn" style={{alignItems: "center"}}>
                Active Player
                <FactionCard faction={activefaction} />
              </div>
              : "Strategy Phase Complete"}
              {ondeckfaction ? 
                <div className="flexColumn" style={{alignItems: "center"}}>
                  On Deck
                  <FactionCard faction={ondeckfaction} opts={{fontSize: "20px"}}/>
                </div>
              : null}
            </div>
            <div className="flexColumn" style={{gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "400px"}}>
              {orderedStrategyCards.map(([name, card]) => {
                return <StrategyCard key={name} card={card} faction={card.faction ? factions[card.faction] : null} onClick={card.faction ? null : () => assignStrategyCard(card, activefaction)}/>
              })}
            </div>
            {activefaction ? null :
              <button onClick={nextPhase}>Next</button>
            }
          </div>
        </div>
      );
    case "ACTION":
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {gameState.state.round}: Action Phase</h3>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );
    case "STATUS":
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {gameState.state.round}: Status Phase</h3>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );
    case "AGENDA":
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Round {gameState.state.round}: Agenda Phase</h3>
            <button onClick={nextPhase}>Next</button>
          </div>
        </div>
      );

  }
  return (
    <div>Error...</div>
  );
}