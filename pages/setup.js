import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

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
  updateSpeaker,
  expansions,
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

  const filteredFactions = Object.entries(availableFactions).filter(([name, faction]) => {
    if (faction.game === "base") {
      return true;
    }
    if (!expansions.has(faction.game)) {
      return false;
    }
    return true;
  });

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
        {filteredFactions.map(([name, faction]) => {
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

const INITIAL_OPTIONS = {
  'expansions': new Set([
    "pok",
    "codex-one",
    "codex-two",
    "codex-three",
  ]),
}

export default function SetupPage() {
  const [speaker, setSpeaker] = useState(0);
  const [factions, setFactions] = useState(INITIAL_FACTIONS);
  const [options, setOptions] = useState(INITIAL_OPTIONS);

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

  function updatePlayerCount(count) {
    if (count === factions.length) {
      return;
    }
    if (count > factions.length) {
      const newPlayers = [];
      for (let i = factions.length; i < count; i++) {
        newPlayers.push({
          name: null,
          color: null
        });
      }
      setFactions([...factions, ...newPlayers]);
    }
    if (count < factions.length) {
      for (let i = count; i < factions.length; i++) {
        if (factions[i].name !== null) {
          updatePlayerFaction(i, null);
        }
        if (factions[i].color !== null) {
          updatePlayerColor(i, null);
        }
      }
      setFactions(factions.slice(0, count));
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
    const filteredFactions = Object.entries(availableFactions).filter(([name, faction]) => {
      if (faction.game === "base") {
        return true;
      }
      if (!options.expansions.has(faction.game)) {
        return false;
      }
      return true;
    });
    const factionKeys = filteredFactions.map(([name, faction]) => name);
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
    const optionsToSend = {};
    optionsToSend.expansions = Array.from(options.expansions);
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        factions: factions,
        speaker: speaker,
        options: optionsToSend,
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

  function toggleExpansion(value, expansion) {
    const currentOptions = {...options};
    if (value) {
      currentOptions.expansions.add(expansion);
    } else {
      currentOptions.expansions.delete(expansion);
      if (!currentOptions.expansions.has("pok")) {
        if (factions.length > 6) {
          updatePlayerCount(6);
        }
      }
      setFactions(factions.map((faction, index) => {
        if (!faction.name || availableFactions[faction.name].game === "base") {
          return faction;
        }
        if (!currentOptions.expansions.has(availableFactions[faction.name].game)) {
          return {
            ...faction,
            name: null
          };
        };
        return faction;
      }));
    }
    setOptions(currentOptions);
  }

  const selectedFactions = factions.map((faction) => faction.name);
  const selectedColors = factions.map((faction) => faction.color);

  const maxFactions = options.expansions.has("pok") ? 8 : 6;

  return (
    <div className="App">
      <label>Player Count</label>
      <div>
        {[...Array(maxFactions - 2)].map((e, index) => {
          const number = index + 3;
          return (
            <span key={number}>
              <input onChange={(event) => updatePlayerCount(event.target.value)} type="radio" value={number} name="numPlayers" checked={factions.length === number} /> {number}
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
              updateSpeaker={() => setSpeaker(index)}
              expansions={options.expansions}
            />
          );
        })}
      </div>
      <div>
        Options:
        <div>
          Expansions:
          <div className="flexColumn">
            <label>
              Prophecy of Kings
              <input
                type="checkbox"
                checked={options.expansions.has("pok")}
                onChange={(event) => toggleExpansion(event.target.checked, "pok")}
              />
            </label>
            <label>
              Codex I
              <input
                type="checkbox"
                checked={options.expansions.has("codex-one")}
                onChange={(event) => toggleExpansion(event.target.checked, "codex-one")}
              />
            </label>
            <label>
              Codex II
              <input
                type="checkbox"
                checked={options.expansions.has("codex-two")}
                onChange={(event) => toggleExpansion(event.target.checked, "codex-two")}
              />
            </label>
            <label>
              Codex III
              <input
                type="checkbox"
                checked={options.expansions.has("codex-three")}
                onChange={(event) => toggleExpansion(event.target.checked, "codex-three")}
              />
            </label>
          </div>
        </div>
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
