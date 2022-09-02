import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  console.log(data);
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

function PlayerSelect({
  player,
  isSpeaker,
  selectedFactions,
  selectedColors,
  handleChange,
  updateColor,
  updateSpeaker
}) {
  const { data: factions, error: factionError } = useSWR("/api/factions", fetcher);
  const { data: colors, error: colorError } = useSWR("/api/colors", fetcher);

  if (factionError) {
    return (<div>Failed to load factions</div>);
  }
  if (colorError) {
    return (<div>Failed to load colors</div>);
  }
  if (!factions || !colors) {
    return (<div>Loading...</div>);
  }

  function setFaction(event) {
    const value = event.target.value === "" ? null : event.target.value;
    handleChange(value);
  }
  function setColor(event) {
    const value = event.target.value === "" ? null : event.target.value;
    updateColor(value);
  }
  return (
    <div>
      <label>Speaker</label>
      <input
        name="speaker"
        type="checkbox"
        checked={isSpeaker}
        onChange={updateSpeaker}
      />
      <select
        onChange={setFaction}
        value={player.faction === null ? "" : player.faction}
      >
        <option key="None" value="" disabled hidden>
          Select Faction
        </option>
        {Object.entries(factions).map(([name, faction]) => {
          return (
            <option key={name} value={name} style={selectedFactions.includes(name) ? { color: "grey" } : {}}>
              {name}
            </option>
          );
        })}
      </select>
      <select
        onChange={setColor}
        value={player.color === null ? "" : player.color}
      >
        <option key="None" value="">
          Select Color
        </option>
        {colors.map((color) => {
          return (
            <option key={color} value={color} style={selectedColors.includes(color) ? { color: "grey" } : {}}>
              {color}
            </option>
          );
        })}
      </select>
    </div>
  );
}

const INITIAL_PLAYERS = [
  {
    faction: null,
    color: null
  },
  {
    faction: null,
    color: null
  },
  {
    faction: null,
    color: null
  },
  {
    faction: null,
    color: null
  },
  {
    faction: null,
    color: null
  },
  {
    faction: null,
    color: null
  }
];

export default function SetupPage() {
  const [speaker, setSpeaker] = useState(0);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  const router = useRouter();

  const { data: factions, error: factionError } = useSWR("/api/factions", fetcher);
  const { data: colors, error: colorError } = useSWR("/api/colors", fetcher);

  if (factionError) {
    return (<div>Failed to load factions</div>);
  }
  if (colorError) {
    return (<div>Failed to load colors</div>);
  }
  if (!factions || !colors) {
    return (<div>Loading...</div>);
  }

  function reset() {
    setPlayers(INITIAL_PLAYERS);
    setSpeaker(0);
  }

  function updatePlayerCount(event) {
    const newCount = event.target.value;
    if (newCount === players.length) {
      return;
    }
    if (newCount > players.length) {
      const newPlayers = [];
      for (let i = players.length; i < newCount; i++) {
        newPlayers.push({
          faction: null,
          color: null
        });
      }
      setPlayers([...players, ...newPlayers]);
    }
    if (newCount < players.length) {
      for (let i = newCount; i < players.length; i++) {
        if (players[i].faction !== null) {
          updatePlayerFaction(i, null);
        }
        if (players[i].color !== null) {
          updatePlayerColor(i, null);
        }
      }
      setPlayers(players.slice(0, newCount));
    }
  }

  function updatePlayerFaction(index, value) {
    setPlayers(
      players.map((player, i) => {
        if (index === i) {
          return { ...player, faction: value };
        }
        if (player.faction === value) {
          return { ...player, faction: null };
        }
        return player;
      })
    );
  }

  function updatePlayerColor(index, value) {
    setPlayers(
      players.map((player, i) => {
        if (index === i) {
          return { ...player, color: value };
        }
        if (player.color === value) {
          return { ...player, color: null };
        }
        return player;
      })
    );
  }

  function randomSpeaker() {
    setSpeaker(Math.floor(Math.random() * players.length));
  }

  function randomFactions() {
    let selectedFactions = [];
    for (let index = 0; index < players.length; index++) {
      if (players[index].faction !== null) {
        selectedFactions[index] = players[index].faction;
      }
    }
    const factionKeys = Object.keys(factions);
    for (let index = 0; index < players.length; index++) {
      if (players[index].faction !== null) {
        continue;
      }
      let selectedFaction = null;
      while (
        selectedFaction === null ||
        selectedFactions.includes(selectedFaction)
      ) {
        let randomIndex = Math.floor(Math.random() * factionKeys.length);
        selectedFaction = factionKeys[randomIndex];
      }
      selectedFactions[index] = selectedFaction;
    }
    setPlayers(
      players.map((player, index) => {
        return { ...player, faction: selectedFactions[index] };
      })
    );
  }

  async function startGame() {
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        players: players,
        speaker: speaker,
      }),
    });
    const data = await res.json();
    router.push(`/game/${data.gameid}`);
  }

  function disableRandomizeFactionButton() {
    for (let player of players) {
      if (player.faction === null) {
        return false;
      }
    }
    return true;
  }

  function disableNextButton() {
    for (let player of players) {
      if (player.color === null || player.faction === null) {
        return true;
      }
    }
    return false;
  }

  const selectedFactions = players.map((player) => player.faction);
  const selectedColors = players.map((player) => player.color);

  return (
    <div className="App">
      <label>Player Count</label>
      <div>
        {[...Array(6)].map((e, index) => {
          const number = index + 3;
          return (
            <span key={number}>
              <input onChange={updatePlayerCount} type="radio" value={number} name="numPlayers" checked={players.length === number} /> {number}
            </span>
          );
        })}
      </div>
      <div>
        {players.map((player, index) => {
          return (
            <PlayerSelect
              key={index}
              player={player}
              isSpeaker={index === speaker}
              selectedFactions={selectedFactions}
              selectedColors={selectedColors}
              handleChange={(value) => updatePlayerFaction(index, value)}
              updateColor={(value) => updatePlayerColor(index, value)}
              updateSpeaker={(value) => setSpeaker(index)}
            />
          );
        })}
      </div>
      <button onClick={reset}>Reset</button>
      <button onClick={randomSpeaker}>Randomize Speaker</button>
      <button
        onClick={randomFactions}
        disabled={disableRandomizeFactionButton()}
      >
        Randomize Remaining Factions
      </button>
      <button onClick={startGame} disabled={disableNextButton()}>
        Start Game
      </button>
    </div>
  );
}
