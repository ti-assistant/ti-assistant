import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { FactionTile } from "../src/FactionCard";
import { BasicFactionTile } from "../src/FactionTile";
import { Modal } from "../src/Modal";

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

function getFactionColor(color) {
  if (!color) {
    return "#555";
  }
  switch (color) {
    case "Blue":
      return "cornflowerblue";
    // case "Magenta":
    //   return "hotpink";
    // case "Green":
    //   return "mediumseagreen";
  }
  return color;
}

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
  const filteredColors = colors.filter((color) => {
    if (color === "Magenta" || color === "Orange") {
      if (!expansions.has("pok")) {
        return false;
      }
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
      <label>SPEAKER</label>
      <input
        name="speaker"
        type="checkbox"
        checked={isSpeaker}
        onChange={updateSpeaker}
      />
      <select
        onChange={setFaction}
        value={faction.name === null ? "" : faction.name}
        style={{fontFamily: 'Myriad Pro'}}
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
        {filteredColors.map((color) => {
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

function FactionSelect({ faction, isSpeaker, setFaction, setColor, setSpeaker, expansions, opts }) {
  const [showFactionModal, setShowFactionModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
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
  const filteredColors = colors.filter((color) => {
    if (color === "Magenta" || color === "Orange") {
      if (!expansions.has("pok")) {
        return false;
      }
    }
    return true;
  });

  function selectFaction(factionName) {
    setShowFactionModal(false);
    setFaction(factionName);
  }
  
  function selectColor(color) {
    setShowColorModal(false);
    setColor(color);
  }

  const menuButtons = [];
  if (!faction.name) {
    menuButtons.push({
      text: "Select Faction",
      action: () => setShowFactionModal(true),
    });
  } else {
    menuButtons.push({
      text: "Change Faction",
      action: () => setShowFactionModal(true),
    });
  }
  if (!faction.color) {
    menuButtons.push({
      text: "Select Color",
      action: () => setShowColorModal(true),
    });
  } else {
    menuButtons.push({
      text: "Change Color",
      action: () => setShowColorModal(true),
    });
  }
  if (!isSpeaker) {
    menuButtons.push({
      text: "Make Speaker",
      action: () => setSpeaker(),
    });
  }

  const color = getFactionColor(faction.color);

  return (
    <div style={{flexBasis: "50%"}}>
      <Modal top="20%" closeMenu={() => setShowFactionModal(false)} visible={showFactionModal} title="Select Faction" content={
        <div className="flexRow" style={{padding: "16px", flexWrap: "wrap", gap: "16px 40px"}}>
          {filteredFactions.map(([factionName, faction]) => {
            faction.color = color;
            return (
              <div style={{flexBasis: "15%", flexGrow: 2, flexShrink: 2}}>
                <BasicFactionTile faction={faction} onClick={() => selectFaction(faction.name)} />
              </div>
            );
          })}
        </div>
      } />
      <Modal top="20%" closeMenu={() => setShowColorModal(false)} visible={showColorModal} title="Select Color" content={
        <div className="flexRow" style={{padding: "16px", flexWrap: "wrap", gap: "16px 40px"}}>
          {filteredColors.map((color) => {
            const tempFaction = {
              name: faction.name ?? null,
              color: color,
            };
            return (
              <div style={{flexBasis: "20%"}}>
                <BasicFactionTile faction={tempFaction} onClick={() => selectColor(color)} />
              </div>
            );
          })}
        </div>
      } />
      <BasicFactionTile faction={faction} speaker={isSpeaker} menuButtons={menuButtons} opts={opts} />
    </div>
  )
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
  const [speaker, setSpeaker] = useState(-1);
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
    setSpeaker(-1);
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
    if (speaker >= count) {
      setSpeaker(0);
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

  function randomColors() {
    let selectedColors = [];
    for (let index = 0; index < factions.length; index++) {
      if (factions[index].color !== null) {
        selectedColors[index] = factions[index].color;
      }
    }
    const filteredColors = colors.filter((color) => {
      if (color === "Magenta" || color === "Orange") {
        if (!options.expansions.has("pok")) {
          return false;
        }
      }
      return true;
    });
    for (let index = 0; index < factions.length; index++) {
      if (factions[index].color !== null) {
        continue;
      }
      let selectedColor = null;
      while (
        selectedColor === null ||
        selectedColors.includes(selectedColor)
      ) {
        let randomIndex = Math.floor(Math.random() * filteredColors.length);
        selectedColor = filteredColors[randomIndex];
      }
      selectedColors[index] = selectedColor;
    }
    setFactions(
      factions.map((faction, index) => {
        return { ...faction, color: selectedColors[index] };
      })
    );
  }

  async function startGame() {
    const optionsToSend = {};
    optionsToSend.expansions = Array.from(options.expansions);
    
    // TODO: Consider just leaving gaps in the factions array to avoid this nonsense.
    const factionsToSend = [];
    let speakerToSend = 0;
    factionsToSend.push(factions[0]);
    if (factions.length > 6) {
      factionsToSend.push(factions[6]);
      if (speaker === 6) {
        speakerToSend = factionsToSend.length - 1;
      }
    }
    factionsToSend.push(factions[2]);
    if (speaker === 2) {
      speakerToSend = factionsToSend.length - 1;
    }
    if (factions.length > 5) {
      factionsToSend.push(factions[5]);
      if (speaker === 5) {
        speakerToSend = factionsToSend.length - 1;
      }
    }
    if (factions.length > 7) {
      factionsToSend.push(factions[7]);
      if (speaker === 7) {
        speakerToSend = factionsToSend.length - 1;
      }
    }
    if (factions.length > 3) {
      factionsToSend.push(factions[3]);
      if (speaker === 3) {
        speakerToSend = factionsToSend.length - 1;
      }
    }
    if (factions.length > 4) {
      factionsToSend.push(factions[4]);
      if (speaker === 4) {
        speakerToSend = factionsToSend.length - 1;
      }
    }
    factionsToSend.push(factions[1]);
    if (speaker === 1) {
      speakerToSend = factionsToSend.length - 1;
    }

    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        factions: factionsToSend,
        speaker: speakerToSend,
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

  function disableRandomizeColorsButton() {
    for (let faction of factions) {
      if (faction.color === null) {
        return false;
      }
    }
    return true;
  }

  function disableNextButton() {
    if (speaker === -1) {
      return true;
    }
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
      setFactions(factions.map((faction, index) => {
        const tempFaction = {...faction};
        if (tempFaction.color === "Magenta" || tempFaction.color === "Orange") {
          tempFaction.color = null;
        }
        if (!tempFaction.name || availableFactions[tempFaction.name].game === "base") {
          return tempFaction;
        }
        if (!currentOptions.expansions.has(availableFactions[tempFaction.name].game)) {
          tempFaction.name = null;
        };
        return tempFaction;
      }));
      if (!currentOptions.expansions.has("pok")) {
        if (factions.length > 6) {
          updatePlayerCount(6);
        }
      }
    }
    setOptions(currentOptions);
  }

  const selectedFactions = factions.map((faction) => faction.name);
  const selectedColors = factions.map((faction) => faction.color);

  const maxFactions = options.expansions.has("pok") ? 8 : 6;

  return (
    <div className="flexColumn" style={{gap: "20px"}}>
      <div>
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
      </div>
      <div className="flexColumn" style={{position: "relative", gap: "120px", alignItems: "center"}}>
        <div className="flexRow" style={{position: "absolute", width: "100%", height: "100%"}}>
          TABLE (replace with image)
        </div>
        {/* Player 1 and 8 */}
        <div className="flexRow" style={{gap: "60px"}}>
          <FactionSelect faction={factions[0]}
            isSpeaker={0 === speaker} 
            setFaction={(value) => updatePlayerFaction(0, value)}
            setColor={(value) => updatePlayerColor(0, value)}
            setSpeaker={() => setSpeaker(0)}
            expansions={options.expansions}
            opts={{menuSide: "bottom"}} />
          {factions.length > 6 ?
            <FactionSelect faction={factions[6]}
              isSpeaker={6 === speaker} 
              setFaction={(value) => updatePlayerFaction(6, value)}
              setColor={(value) => updatePlayerColor(6, value)}
              setSpeaker={() => setSpeaker(6)}
              expansions={options.expansions}
              opts={{menuSide: "bottom"}} /> : null}
        </div>
        <div className="flexRow" style={{gap: "400px"}}>
          {/* Player 2 and 5 */}
          <div className="flexColumn" style={{gap: "80px"}}>
            <FactionSelect faction={factions[1]}
              isSpeaker={1 === speaker} 
              setFaction={(value) => updatePlayerFaction(1, value)}
              setColor={(value) => updatePlayerColor(1, value)}
              setSpeaker={() => setSpeaker(1)}
              expansions={options.expansions}
              opts={{menuSide: "right"}} />
            {factions.length > 4 ?
              <FactionSelect faction={factions[4]}
                isSpeaker={4 === speaker} 
                setFaction={(value) => updatePlayerFaction(4, value)}
                setColor={(value) => updatePlayerColor(4, value)}
                setSpeaker={() => setSpeaker(4)}
                expansions={options.expansions}
                opts={{menuSide: "right"}} /> : null}
          </div>
          {/* Player 3 and 6 */}
          <div className="flexColumn" style={{flexBasis: "10%", gap: "80px"}}>
            <FactionSelect faction={factions[2]}
              isSpeaker={2 === speaker} 
              setFaction={(value) => updatePlayerFaction(2, value)}
              setColor={(value) => updatePlayerColor(2, value)}
              setSpeaker={() => setSpeaker(2)}
              expansions={options.expansions}
              opts={{menuSide: "left"}} />
            {factions.length > 5 ?
              <FactionSelect faction={factions[5]}
                isSpeaker={5 === speaker} 
                setFaction={(value) => updatePlayerFaction(5, value)}
                setColor={(value) => updatePlayerColor(5, value)}
                setSpeaker={() => setSpeaker(5)}
                expansions={options.expansions}
                opts={{menuSide: "left"}} /> : null}
          </div>
        </div>
        {/* Player 4 and 8 */}
        <div className="flexRow" style={{gap: "60px"}}>
          {factions.length > 3 ?
            <FactionSelect faction={factions[3]}
              isSpeaker={3 === speaker} 
              setFaction={(value) => updatePlayerFaction(3, value)}
              setColor={(value) => updatePlayerColor(3, value)}
              setSpeaker={() => setSpeaker(3)}
              expansions={options.expansions}
              opts={{menuSide: "top"}} /> : null}
          {factions.length > 7 ?
            <FactionSelect faction={factions[7]}
              isSpeaker={7 === speaker} 
              setFaction={(value) => updatePlayerFaction(7, value)}
              setColor={(value) => updatePlayerColor(7, value)}
              setSpeaker={() => setSpeaker(7)}
              expansions={options.expansions}
              opts={{menuSide: "top"}} /> : null}
        </div>
      </div>
      {/* <div>
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
      </div> */}
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
      <div className="flexColumn" style={{gap: "8px"}}>
        <button onClick={reset}>Reset</button>
        <div className="flexRow" style={{gap: "8px"}}>
          <button onClick={randomSpeaker}>Randomize Speaker</button>
          <button
            onClick={randomFactions}
            disabled={disableRandomizeFactionButton()}
          >
            Randomize Remaining Factions
          </button>
          <button onClick={randomColors}
          disabled={disableRandomizeColorsButton()}
          > Randomize Remaining Colors</button>
        </div>
        <button onClick={startGame} disabled={disableNextButton()}>
          Start Game
        </button>
      </div>
    </div>
  );
}
