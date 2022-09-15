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
  faction,
  isSpeaker,
  selectedFactions,
  selectedColors,
  handleChange,
  updateColor,
  updateSpeaker
}) {
  const { data: availableFactions, error: factionError } = useSWR("/api/factions", fetcher);
  const { data: colors, error: colorError } = useSWR("/api/colors", fetcher);

  if (factionError) {
    return (<div>Failed to load factions</div>);
  }
  if (colorError) {
    return (<div>Failed to load colors</div>);
  }
  if (!availableFactions || !colors) {
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
        value={faction.name === null ? "" : faction.name}
      >
        <option key="None" value="" disabled hidden>
          Select Faction
        </option>
        {Object.entries(availableFactions).map(([name, faction]) => {
          return (
            <option key={name} value={name} style={selectedFactions.includes(name) ? { color: "grey" } : {}}>
              {name}
            </option>
          );
        })}
      </select>
      <select
        onChange={setColor}
        value={faction.color === null ? "" : faction.color}
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

const INITIAL_FACTIONS = [
  {
    name: null,
    color: null
  },
  {
    name: null,
    color: null
  },
  {
    name: null,
    color: null
  },
  {
    name: null,
    color: null
  },
  {
    name: null,
    color: null
  },
  {
    name: null,
    color: null
  }
];

export default function SetupPage() {
  const [speaker, setSpeaker] = useState(0);
  const [factions, setFactions] = useState(INITIAL_FACTIONS);

  const router = useRouter();

  const { data: availableFactions, error: factionError } = useSWR("/api/factions", fetcher);
  const { data: colors, error: colorError } = useSWR("/api/colors", fetcher);

  if (factionError) {
    return (<div>Failed to load factions</div>);
  }
  if (colorError) {
    return (<div>Failed to load colors</div>);
  }
  if (!availableFactions || !colors) {
    return (<div>Loading...</div>);
  }

  function reset() {
    setFactions(INITIAL_FACTIONS);
    setSpeaker(0);
  }

  function updatePlayerCount(event) {
    const newCount = event.target.value;
    if (newCount === factions.length) {
      return;
    }
    if (newCount > factions.length) {
      const newPlayers = [];
      for (let i = factions.length; i < newCount; i++) {
        newPlayers.push({
          name: null,
          color: null
        });
      }
      setFactions([...factions, ...newPlayers]);
    }
    if (newCount < factions.length) {
      for (let i = newCount; i < factions.length; i++) {
        if (factions[i].name !== null) {
          updatePlayerFaction(i, null);
        }
        if (factions[i].color !== null) {
          updatePlayerColor(i, null);
        }
      }
      setFactions(factions.slice(0, newCount));
    }
  }

  function updatePlayerFaction(index, value) {
    setFactions(
      factions.map((faction, i) => {
        if (index === i) {
          return { ...faction, name: value };
        }
        if (faction.name === value) {
          return { ...faction, name: null };
        }
        return faction;
      })
    );
  }

  function updatePlayerColor(index, value) {
    setFactions(
      factions.map((faction, i) => {
        if (index === i) {
          return { ...faction, color: value };
        }
        if (faction.color === value) {
          return { ...faction, color: null };
        }
        return faction;
      })
    );
  }

  function randomSpeaker() {
    setSpeaker(Math.floor(Math.random() * factions.length));
  }

  function randomFactions() {
    let selectedFactions = [];
    for (let index = 0; index < factions.length; index++) {
      if (factions[index].name !== null) {
        selectedFactions[index] = factions[index].name;
      }
    }
    const factionKeys = Object.keys(availableFactions);
    for (let index = 0; index < factions.length; index++) {
      if (factions[index].name !== null) {
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
    setFactions(
      factions.map((faction, index) => {
        return { ...faction, name: selectedFactions[index] };
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
        factions: factions,
        speaker: speaker,
      }),
    });
    const data = await res.json();
    router.push(`/game/${data.gameid}`);
  }

  function disableRandomizeFactionButton() {
    for (let faction of factions) {
      if (faction.name === null) {
        return false;
      }
    }
    return true;
  }

  function disableNextButton() {
    for (let faction of factions) {
      if (faction.color === null || faction.name === null) {
        return true;
      }
    }
    return false;
  }

  const selectedFactions = factions.map((faction) => faction.name);
  const selectedColors = factions.map((faction) => faction.color);

  return (
    <div className="App">
      <label>Player Count</label>
      <div>
        {[...Array(6)].map((e, index) => {
          const number = index + 3;
          return (
            <span key={number}>
              <input onChange={updatePlayerCount} type="radio" value={number} name="numPlayers" checked={factions.length === number} /> {number}
            </span>
          );
        })}
      </div>
      <div>
        {factions.map((faction, index) => {
          return (
            <PlayerSelect
              key={index}
              faction={faction}
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
