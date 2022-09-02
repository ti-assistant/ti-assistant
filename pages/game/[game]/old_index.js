import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  console.log(data);
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

function InitiativeList({ players }) {
  let sortedPlayers = players.slice();
  sortedPlayers.sort((a, b) => {
    if (a.strategy_card.order > b.strategy_card.order) {
      return 1;
    } else if (a.strategy_card.order < b.strategy_card.order) {
      return -1;
    }
    return 0;
  });

  return (
    <div>
      <h1>Initiative List</h1>
      {sortedPlayers.map((player) => {
        return (
          <div
            key={player.faction}
            style={player.active_player ? { color: player.color } : {}}
          >
            {player.faction}
            <div>
              {player.strategy_card.order}: {player.strategy_card.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpeakerList({ players }) {
  const speakerIndex = players.findIndex((player) => {
    return player.is_speaker;
  });
  let sortedPlayers = [];
  if (speakerIndex !== -1) {
    for (let index = speakerIndex; index < players.length; index++) {
      sortedPlayers.push(players[index]);
    }
    for (let index = 0; index < speakerIndex; index++) {
      sortedPlayers.push(players[index]);
    }
  }

  return (
    <div>
      <h1>Speaker List</h1>
      {sortedPlayers.map((player) => {
        return (
          <div key={player.faction}>
            {player.is_speaker ? "Speaker\n" : ""}
            {player.faction}
            <div>
              {player.strategy_card.order}: {player.strategy_card.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivePlayer({ player, endTurn }) {
  const [action, setAction] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  if (!player) {
    return;
  }

  function handleEndTurn() {
    endTurn(action);
    setAction(null);
  }

  return (
    <div>
      <h1>Active player: {player.faction}</h1>
      <button
        disabled={player.strategy_card.used}
        onClick={() => setAction("Strategy")}
      >
        {player.strategy_card.name}
      </button>
      <button onClick={() => setAction("Tactical")}>Tactical</button>
      <button
        disabled={!player.strategy_card.used}
        onClick={() => setAction("Pass")}
      >
        Pass
      </button>
      <button disabled={action === null} onClick={handleEndTurn}>
        End Turn
      </button>
    </div>
  );
}

let webSocket;

export default function GamePage() {
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState("Strategy");
  const [isAgendaUnlocked, setIsAgendaUnlocked] = useState(false);

  const router = useRouter();
  const { gameid } = router.query;

  const { mutate } = useSWRConfig();
  const { data: gameState, error } = useSWR(`/api/game/${gameid}`, fetcher);

  useEffect(() => {
    webSocket = new WebSocket("ws://localhost:8080");

    webSocket.onopen = (event) => {
      webSocket.send("Test Message");
    };
  },[])

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (!gameState) {
    return (<div>Loading...</div>);
  }

  function getActivePlayer() {
    return gameState.players.find((player) => {
      return player.active_player;
    });
  }

  function getNextPlayerIndex() {
    const activePlayer = getActivePlayer();
    if (!activePlayer) {
      return null;
    }
    const initiative = activePlayer.strategy_card.order;
    let minLarger = 9;
    let minLargerIndex = 0;
    let minOverall = 9;
    let minOverallIndex = 0;
    for (let index = 0; index < gameState.players.length; index++) {
      if (gameState.players[index].has_passed) {
        continue;
      }
      const order = gameState.players[index].strategy_card.order;
      if (order < minOverall) {
        minOverall = order;
        minOverallIndex = index;
      }
      if (order > initiative && order < minLarger) {
        minLarger = order;
        minLargerIndex = index;
      }
    }
    if (minOverall === 9) {
      return -1;
    }
    if (minLarger === 9) {
      return minOverallIndex;
    }
    return minLargerIndex;
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function wait() {
    await delay(3000);
  }

  /**
   * This function should update the server. Websockets?
   */
  function updateGameStateTest() {
    return {...gameState, 
      players: gameState.players.map((player, index) => {
        if (player.active_player) {
          return {...player,
            active_player: false,
          };
        }
        if (!player.active_player) {
          return {...player,
            active_player: true,
          };
        }
        return player;
      }),
    };
  } 

  function endTurn(action) {
    let activePlayer = getActivePlayer();
    if (!activePlayer) {
      return;
    }
    let usedStrategyCard = activePlayer.strategy_card.used;
    let passed = activePlayer.has_passed;
    switch (action) {
      case "Strategy":
        usedStrategyCard = true;
        break;
      case "Tactical/Component":
        break;
      case "Pass":
        passed = true;
        break;
      default:
        break;
    }
    const nextPlayerIndex = getNextPlayerIndex();
    const localState = updateGameStateTest();
    const options = { optimisticData: localState, rollbackOnError: true }

    // updates the local data immediately
    // send a request to update the data
    // triggers a revalidation (refetch) to make sure our local data is correct
    mutate(`/api/game/${gameid}`, wait(), options);

    setPlayers(
      players.map((player, index) => {
        if (player.active_player) {
          return {
            ...player,
            strategy_card: { ...player.strategy_card, used: usedStrategyCard },
            has_passed: passed,
            active_player: index === nextPlayerIndex && !passed
          };
        }
        if (index === nextPlayerIndex) {
          return {
            ...player,
            active_player: true
          };
        }
        return player;
      })
    );
    if (passed && gameState.players[nextPlayerIndex] === activePlayer) {
      setPhase("Status");
    }
    console.log(nextPlayerIndex);
    console.log(gameState.players[nextPlayerIndex].faction);
    if (nextPlayerIndex === -1) {
      setPhase("Status");
    }
  }

  console.log(gameState);

  function getStatusPhaseActions() {
    let actions = [];
    for (let player of gameState.players) {
      if (player.faction === "Arborec") {
        actions.push(
          "Arborec (Mitosis): Place 1 infantry from your reinforcements on any planet you control"
        );
      }
    }
    return actions;
  }

  switch (phase) {
    case "Strategy":
      // TODO: Implement strategy phase
      break;
    case "Action":
      return (
        <div>
          <InitiativeList players={gameState.players} />
          <SpeakerList players={gameState.players} />
          <ActivePlayer player={getActivePlayer()} endTurn={endTurn} />
        </div>
      );
    case "Status":
      const extraActions = getStatusPhaseActions();
      return (
        <div>
          <ol start={extraActions.length === 0 ? "1" : "0"}>
            {getStatusPhaseActions().map((action, index) => {
              return <li key={index}>{action}</li>;
            })}
            <li>Score Objectives</li>
            <li>Reveal Public Objective</li>
            <li>Draw Action Cards</li>
            <li>Remove Command Tokens</li>
            <li>Gain and Redistribute Command Tokens</li>
            <li>Ready Cards</li>
            <li>Repair Units</li>
            <li>Return Strategy Cards</li>
          </ol>
          {isAgendaUnlocked ? (
            <button onClick={nextPhase}>Next Phase</button>
          ) : (
            <div>
              <label>Is Mecatol Rex controlled by a player?</label>
              <button
                onClick={() => {
                  setIsAgendaUnlocked(true);
                  nextPhase();
                }}
              >
                Yes
              </button>
              <button onClick={() => setPhase("Strategy")}>No</button>
            </div>
          )}
        </div>
      );
      // TODO: Implement status phase.
      break;
    case "Pre-Agenda":
      // TODO: Implement pre-agenda phase
      break;
    case "Agenda":
      // TODO: Implement agenda phase.
      break;
    default:
      return null;
  }

  function nextPhase() {
    switch (phase) {
      case "Strategy":
        setPhase("Action");
        break;
      case "Action":
        setPhase("Status");
        break;
      case "Status":
        setPhase("Agenda");
        break;
      case "Agenda":
        setPhase("Strategy");
        break;
      default:
        setPhase("Strategy");
        break;
    }
  }

  return (
    <div>
      <h1>Welcome to game: {gameid}</h1>
      <button onClick={nextPhase}>Next Phase</button>
      <InitiativeList players={gameState.players} />
      <SpeakerList players={gameState.players} />
      <ActivePlayer player={getActivePlayer()} endTurn={endTurn} />
    </div>
  );
}
