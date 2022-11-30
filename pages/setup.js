import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { FactionTile } from "../src/FactionCard";
import { BasicFactionTile } from "../src/FactionTile";
import { Modal } from "../src/Modal";
import { fetcher } from "../src/util/api/util";

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
  'multiple-planet-owners': false,
  'multiple-planet-attachments': false,
  'allow-double-council': false,
  'map-string': "",
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
    setOptions(INITIAL_OPTIONS);
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
    const optionsToSend = options;
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
    if (invalidCouncil()) {
      return true;
    }
    return false;
  }

  function missingFactions() {
    for (let faction of factions) {
      if (faction.name === null) {
        return true;
      }
    }
  }

  function missingColors() {
    for (let faction of factions) {
      if (faction.color === null) {
        return true;
      }
    }
  }

  function isCouncilInGame() {
    for (let faction of factions) {
      if (faction.name === "Council Keleres") {
        return true;
      }
    }
    return false;
  }

  function invalidCouncil() {
    if (options['allow-double-council']) {
      return false;
    }
    let factionCount = options.expansions.has("pok") ? 0 : 1;
    for (let faction of factions) {
      if (faction.name === "Xxcha Kingdom" || faction.name === "Argent Flight" || faction.name === "Mentak Coalition" || faction.name === "Council Keleres") {
        ++factionCount;
      }
    }
    return factionCount === 4;
  }

  function toggleOption(value, option) {
    const currentOptions = {...options};
    currentOptions[option] = value;

    setOptions(currentOptions);
  }

  function toggleExpansion(value, expansion) {
    const currentOptions = {...options};
    if (value) {
      currentOptions.expansions.add(expansion);
    } else {
      currentOptions.expansions.delete(expansion);
      setFactions(factions.map((faction, index) => {
        const tempFaction = {...faction};
        if (!currentOptions.expansions.has("pok") &&
            (tempFaction.color === "Magenta" || tempFaction.color === "Orange")) {
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
      <Header />
      <div className="flexColumn" style={{height: "100vh", width: "100%", alignItems: "center", gap: "32px"}}>
      <div className="flexColumn" style={{gap: "8px"}}>
        <label>Player Count</label>
        <div className='flexRow' style={{gap: "8px"}}>
          {[...Array(maxFactions - 2)].map((e, index) => {
            const number = index + 3;
            return (
              <button key={number} onClick={() => updatePlayerCount(number)} className={factions.length === number ? "selected" : ""}>{number}</button>
            );
          })}
        </div>
      </div>
      <div className="flexRow" style={{width: "100%"}}>
      <div className="flexColumn" style={{flexBasis: "60%", position: "relative", gap: "120px", alignItems: "center"}}>
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
      <div>
      <div style={{width: "540px"}}>
        <div style={{fontSize: "24px"}}>Options:</div>
        <div style={{padding: "16px 16px 0px 16px"}}>
        <div>
          Expansions:
          <div className="flexRow" style={{gap: "8px", padding: "8px 20px"}}>
            <button className={options.expansions.has("pok") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("pok"), "pok")}>Prophecy of Kings</button>
            <button className={options.expansions.has("codex-one") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-one"), "codex-one")}>Codex I</button>
            <button className={options.expansions.has("codex-two") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-two"), "codex-two")}>Codex II</button>
            <button className={options.expansions.has("codex-three") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-three"), "codex-three")}>Codex III</button>
          </div>
        </div>
        <div>
          Map:
          <div className="flexColumn" style={{fontFamily: "Myriad Pro", gap: "8px", padding: "8px 20px", alignItems: "flex-start"}}>
            Map String (opt):<input type="textbox" style={{width: "100%"}} onChange={(event)=> toggleOption(event.target.value, "map-string")}></input>
            Used to filter out planets that are not claimable.
          </div>
        </div>
        <div>
          Assistant Options:
          <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
            <button className={options['multiple-planet-owners'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-owners'], "multiple-planet-owners")}>Allow multiple factions to claim planet</button>
          </div>
          <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
            <button className={options['multiple-planet-attachments'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-attachments'], "multiple-planet-attachments")}>Allow the same attachment to be placed on multiple planets</button>
          </div>
        </div>
        {isCouncilInGame() ? 
        <div>
          Council Keleres:
          <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
            <button className={options['allow-double-council'] ? "selected" : ""} onClick={() => toggleOption(!options['allow-double-council'], "allow-double-council")}>Allow selecting a duplicate sub-faction</button>
          </div>
        </div>
        : null}
        </div>
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
        {missingFactions() ?
          <div style={{color: "darkred"}}>Select All Factions</div>
        : null}
        {speaker === -1 ?
          <div style={{color: "darkred"}}>Select Speaker</div>
        : null}
        {missingColors() ?
          <div style={{color: "darkred"}}>Select All Colors</div>
        : null}
        {invalidCouncil() ?
          <div style={{color: "darkred"}}>No available sub-faction for Council Keleres</div>
        : null}
        <button onClick={startGame} disabled={disableNextButton()}>
          Start Game
        </button>
      </div>
    </div></div>
  );
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
  return <div className="flexColumn" style={{top: 0, position: "fixed", alignItems: "center", justifyContent: "center"}}>
    <Sidebar side="left" content={`SETUP GAME`} />
    <Sidebar side="right" content={`SETUP GAME`} />

    {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
      SETUP PHASE
    </div> */}
    <h2>Twilight Imperium Assistant</h2>
    {/* <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", left: "144px", top: "8px"}}>
      {qrCode ? <img src={qrCode} /> : null}
      <div>Game ID: {gameid}</div>
    </div>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "288px", top: "16px"}}>
      <GameTimer />
    </div> */}
  </div>
}