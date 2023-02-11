import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { fetcher } from "../src/util/api/util";
import Image from "next/image";
import { getFactionColor } from "../src/util/factions";
import { HoverMenu } from "../src/HoverMenu";
import { LabeledDiv } from "../src/LabeledDiv";
import { responsivePixels } from "../src/util/util";
import { FullFactionSymbol } from "../src/FactionCard";
import Head from "next/head";
import { Map } from "../src/util/Map";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function MobileOptions({ updatePlayerCount, toggleOption, toggleExpansion, options, numFactions, maxFactions, isCouncil }) {
  const mapStringRef = useRef(null)

  useEffect(() => {
    if (options['map-string'] === "") {
      mapStringRef.current.value = "";
    }
  }, [options['map-string']]);

  let mapStyles;
  switch (numFactions) {
    case 3:
      mapStyles = ["standard"];
      break;
    case 4:
      mapStyles = ["standard"];
      break;
    case 5:
      mapStyles = ["standard", "warp", "skinny"];
      break;
    case 6:
      mapStyles = ["standard", "large"];
      break;
    case 7:
      mapStyles = ["standard", "warp"];
      break;
    case 8:
      mapStyles = ["standard", "warp"];
      break;
  }

  const rowOrColumn = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return <div className="flexColumn" style={{ width: "100%" }}>
    <label>Player Count</label>
    <div className='flexRow'>
      {[...Array(maxFactions - 2)].map((e, index) => {
        const number = index + 3;
        return (
          <button key={number} onClick={() => updatePlayerCount(number)} className={numFactions === number ? "selected" : ""}>{number}</button>
        );
      })}
    </div>
    <div className="flexRow" style={{ width: "100%", justifyContent: "flex-start" }}>
      <HoverMenu label="Options">
        <div style={{ width: "90vw", overflowX: "scroll" }}>
          <div className="flexColumn" style={{ alignItems: "flex-start", padding: `${responsivePixels(8)} ${responsivePixels(16)} 0 ${responsivePixels(16)}` }}>
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              Victory Points:
              <div className="flexRow" style={{ justifyContent: "flex-start", padding: `0 ${responsivePixels(20)}` }}>
                <button className={options['victory-points'] === 10 ? "selected" : ""} onClick={() => { toggleOption(10, "victory-points") }}>10</button>
                <button className={options['victory-points'] === 14 ? "selected" : ""} onClick={() => { toggleOption(14, "victory-points") }}>14</button>
              </div>
            </div>
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              Expansions:
              <div className={rowOrColumn} style={{ alignItems: "flex-start", justifyContent: "flex-start", padding: `0 ${responsivePixels(20)}` }}>
                <button className={options.expansions.has("pok") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("pok"), "pok")}>Prophecy of Kings</button>
                <button className={options.expansions.has("codex-one") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-one"), "codex-one")}>Codex I</button>
                <button className={options.expansions.has("codex-two") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-two"), "codex-two")}>Codex II</button>
                <button className={options.expansions.has("codex-three") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-three"), "codex-three")}>Codex III</button>
              </div>
            </div>
            <div>
              Map:
              <div className="flexColumn" style={{ fontFamily: "Myriad Pro", padding: `${responsivePixels(8)} ${responsivePixels(16)}`, alignItems: "flex-start", whiteSpace: "pre-wrap" }}>
                {mapStyles.length > 1 ?
                  <React.Fragment>
                    Map Type:
                    <div className="flexRow" style={{ paddingLeft: `${responsivePixels(16)}` }}>
                      {mapStyles.map((style) => {
                        return <button key={style} className={options['map-style'] === style ? "selected" : ""} onClick={() => toggleOption(style, "map-style")}>{capitalizeFirstLetter(style)}</button>
                      })}
                    </div>
                  </React.Fragment> : null}
                Map String:<input ref={mapStringRef} type="textbox" className="mediumFont" style={{ width: "100%" }} onChange={(event) => toggleOption(event.target.value, "map-string")}></input>
                Used to filter out planets that are not claimable.
              </div>
            </div>
            {isCouncil ?
              <div>
                Council Keleres:
                <div className="flexColumn" style={{ alignItems: "flex-start", padding: `${responsivePixels(8)} ${responsivePixels(20)}` }}>
                  <button className={options['allow-double-council'] ? "selected" : ""} onClick={() => toggleOption(!options['allow-double-council'], "allow-double-council")}>Allow selecting a duplicate sub-faction</button>
                </div>
              </div>
              : null}
          </div>
        </div>
      </HoverMenu>
    </div>
  </div>
}

function Options({ updatePlayerCount, toggleOption, toggleExpansion, options, numFactions, maxFactions, isCouncil }) {
  const mapStringRef = useRef(null)

  useEffect(() => {
    if (options['map-string'] === "") {
      mapStringRef.current.value = "";
    }
  }, [options['map-string']]);

  let mapStyles;
  switch (numFactions) {
    case 3:
      mapStyles = ["standard"];
      break;
    case 4:
      mapStyles = ["standard"];
      break;
    case 5:
      mapStyles = ["standard", "warp", "skinny"];
      break;
    case 6:
      mapStyles = ["standard", "large"];
      break;
    case 7:
      mapStyles = ["standard", "warp"];
      break;
    case 8:
      mapStyles = ["standard", "warp"];
      break;
  }

  return <div className="flexColumn">
    <label>Player Count</label>
    <div className='flexRow'>
      {[...Array(maxFactions - 2)].map((e, index) => {
        const number = index + 3;
        return (
          <button key={number} onClick={() => updatePlayerCount(number)} className={numFactions === number ? "selected" : ""}>{number}</button>
        );
      })}
    </div>
    <HoverMenu label="Options">
      <div>
        <div className="flexColumn" style={{ alignItems: "flex-start", padding: `${responsivePixels(8)} ${responsivePixels(16)} 0 ${responsivePixels(16)}` }}>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            Victory Points:
            <div className="flexRow" style={{ justifyContent: "flex-start", padding: `0 ${responsivePixels(20)}` }}>
              <button className={options['victory-points'] === 10 ? "selected" : ""} onClick={() => { toggleOption(10, "victory-points") }}>10</button>
              <button className={options['victory-points'] === 14 ? "selected" : ""} onClick={() => { toggleOption(14, "victory-points") }}>14</button>
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            Expansions:
            <div className="flexRow" style={{ justifyContent: "flex-start", padding: `0 ${responsivePixels(20)}` }}>
              <button className={options.expansions.has("pok") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("pok"), "pok")}>Prophecy of Kings</button>
              <button className={options.expansions.has("codex-one") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-one"), "codex-one")}>Codex I</button>
              <button className={options.expansions.has("codex-two") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-two"), "codex-two")}>Codex II</button>
              <button className={options.expansions.has("codex-three") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-three"), "codex-three")}>Codex III</button>
            </div>
          </div>
          <div>
            Map:
            <div className="flexColumn" style={{ fontFamily: "Myriad Pro", padding: `${responsivePixels(8)} ${responsivePixels(16)}`, alignItems: "flex-start" }}>
              {mapStyles.length > 1 ?
                <React.Fragment>
                  Map Type:
                  <div className="flexRow" style={{ paddingLeft: `${responsivePixels(16)}` }}>
                    {mapStyles.map((style) => {
                      return <button key={style} className={options['map-style'] === style ? "selected" : ""} onClick={() => toggleOption(style, "map-style")}>{capitalizeFirstLetter(style)}</button>
                    })}
                  </div>
                </React.Fragment> : null}
              Map String:<input ref={mapStringRef} type="textbox" className="mediumFont" style={{ width: "100%" }} onChange={(event) => toggleOption(event.target.value, "map-string")}></input>
              Used to filter out planets that are not claimable.
            </div>
          </div>
          {isCouncil ?
            <div>
              Council Keleres:
              <div className="flexColumn" style={{ alignItems: "flex-start", padding: `${responsivePixels(8)} ${responsivePixels(20)}` }}>
                <button className={options['allow-double-council'] ? "selected" : ""} onClick={() => toggleOption(!options['allow-double-council'], "allow-double-council")}>Allow selecting a duplicate sub-faction</button>
              </div>
            </div>
            : null}
        </div>
      </div>
    </HoverMenu>
  </div>
}

function getFactionIndex(numFactions, position, options) {
  switch (numFactions) {
    case 3:
      switch (position) {
        case 7:
          return 2;
        case 1:
          return 0;
        case 4:
          return 1;
      }
    case 4:
      switch (position) {
        case 7:
          return 3;
        case 0:
          return 0;
        case 1:
          return 1;
        case 4:
          return 2;
      }
    case 5:
      const warp = options['map-style'] === "warp";
      switch (position) {
        case 0:
          return 0;
        case 1:
          return warp ? 1 : 0;
        case 2:
          return warp ? 2 : 1;
        case 4:
          return 2;
        case 6:
          return 3;
        case 7:
          return 4;
      }
    case 6:
      switch (position) {
        case 0:
          return 0;
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 3;
        case 6:
          return 4;
        case 7:
          return 5;
      }
    case 7:
      switch (position) {
        case 0:
          return 0;
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 3;
        case 5:
          return 4;
        case 6:
          return 5;
        case 7:
          return 6;
      }
    case 8:
      return position;
  }
  return null;
}

function FactionSelect({ factions, position, mobile = false, speaker, setFaction, setColor, setSpeaker, setPlayerName, options }) {
  const nameRef = useRef(null);
  const [showFactionModal, setShowFactionModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const { data: availableFactions, error: factionError } = useSWR("/api/factions", fetcher);
  const { data: colors, error: colorError } = useSWR("/api/colors", fetcher);

  const factionIndex = mobile ? position : getFactionIndex(factions.length, position, options);

  useEffect(() => {
    if (nameRef && nameRef.current && !factions[factionIndex].playerName) {
      nameRef.current.innerText = "Player Name";
    }
  }, [factions[factionIndex].playerName])

  if (factionError) {
    return (<div>Failed to load factions</div>);
  }
  if (colorError) {
    return (<div>Failed to load colors</div>);
  }
  if (!availableFactions || !factions || !colors) {
    return (<div>Loading...</div>);
  }

  const faction = factions[factionIndex];
  const isSpeaker = speaker === factionIndex;

  const filteredFactions = Object.entries(availableFactions).filter(([name, faction]) => {
    if (faction.game === "base") {
      return true;
    }
    if (!options.expansions.has(faction.game)) {
      return false;
    }
    return true;
  });
  const filteredColors = colors.filter((color) => {
    if (color === "Magenta" || color === "Orange") {
      if (!options.expansions.has("pok")) {
        return false;
      }
    }
    return true;
  });

  function selectFaction(factionName) {
    setShowFactionModal(false);
    setFaction(factionIndex, factionName);
  }

  function selectColor(color) {
    setShowColorModal(false);
    setColor(factionIndex, color);
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

  function savePlayerName(element) {
    if (element.innerText !== "" && !element.innerText.includes("Player")) {
      setPlayerName(factionIndex, element.innerText);
    } else {
      element.innerText = factions[factionIndex].playerName ?? "Player Name";
    }
  }

  function numberToString(number) {
    switch (number) {
      case 0:
        return "First";
      case 1:
        return "Second";
      case 2:
        return "Third";
      case 3:
        return "Fourth";
      case 4:
        return "Fifth";
      case 5:
        return "Sixth";
      case 6:
        return "Seventh";
      case 7:
        return "Eighth";
    }
    return null;
  }

  const label =
    <React.Fragment>
      <span ref={nameRef} spellCheck={false} contentEditable={true} suppressContentEditableWarning={true}
        onClick={(e) => e.target.innerText = ""}
        onBlur={(e) => savePlayerName(e.target)}>
        Player Name
      </span>
      {isSpeaker ? " - Speaker" : null}
    </React.Fragment>

  return (
    <LabeledDiv label={label} color={getFactionColor(faction)} style={{ width: mobile ? "100%" : "22vw" }}>
      <div className="flexColumn" style={{ width: "100%", alignItems: "flex-start", whiteSpace: "nowrap", gap: responsivePixels(4), padding: responsivePixels(8), boxSizing: "border-box" }}>
        <div className="flexColumn" style={{ whiteSpace: "nowrap", alignItems: "flex-start", overflow: "visible", width: "100%" }}>
          <HoverMenu label={faction.name ? faction.name : "Pick Faction"}>
            <div className="flexRow" style={{
              padding: `${responsivePixels(8)}`,
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(9, auto)",
              maxWidth: "80vw",
              overflowX: "auto",
              gap: `${responsivePixels(4)}`,
              justifyContent: "flex-start",
            }}>
              {filteredFactions.map(([factionName, local]) => {
                return <button key={local.name} className={"mediumFont" + (faction.name === factionName ? " selected" : "")} style={{ width: `${responsivePixels(140)}`, writingMode: "horizontal-tb", fontSize: responsivePixels(14) }} onClick={() => selectFaction(factionName)}>{local.name}</button>
              })}
            </div>
          </HoverMenu>
          <div className="flexRow" style={{ width: "100%", justifyContent: "space-between" }}>
            <HoverMenu label={faction.color ? "Change Color" : "Pick Color"}>
              <div className="flexRow" style={{
                padding: `${responsivePixels(8)}`,
                display: "grid",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(3, auto)",
                overflowX: "auto",
                gap: `${responsivePixels(4)}`,
                justifyContent: "flex-start"
              }}>
                {filteredColors.map((color) => {
                  const factionColor = getFactionColor({ color: color });
                  return (
                    <button key={color} style={{ width: `${responsivePixels(60)}`, writingMode: "horizontal-tb", backgroundColor: factionColor, color: factionColor }} className={faction.color === color ? "selected" : ""} onClick={() => selectColor(color)}>{color}</button>
                  );
                })}
              </div>
            </HoverMenu>
            {isSpeaker ? null : <button onClick={() => setSpeaker(factionIndex)}>Make Speaker</button>}
          </div>
        </div>
        {/* </HoverMenu> */}
        {/* <BasicFactionTile faction={faction} speaker={isSpeaker} menuButtons={menuButtons} opts={opts} /> */}
      </div>
    </LabeledDiv>
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
  'map-style': "standard",
  'map-string': "",
  'victory-points': 10,
}

export default function SetupPage() {
  const [speaker, setSpeaker] = useState(0);
  const [factions, setFactions] = useState([...INITIAL_FACTIONS]);
  const [options, setOptions] = useState({
    ...INITIAL_OPTIONS,
    expansions: new Set(INITIAL_OPTIONS.expansions),
  });

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
    setFactions([...INITIAL_FACTIONS]);
    setOptions({
      ...INITIAL_OPTIONS,
      expansions: new Set(INITIAL_OPTIONS.expansions),
    });
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
    toggleOption("standard", "map-style");
    if (speaker >= count) {
      setSpeaker(0);
    }
  }

  function updatePlayerFaction(index, value) {
    const prevValue = factions[index].name;
    setFactions(
      factions.map((faction, i) => {
        if (index === i) {
          return { ...faction, name: value };
        }
        if (faction.name === value) {
          return { ...faction, name: prevValue };
        }
        return faction;
      })
    );
  }

  function updatePlayerColor(index, value) {
    const prevValue = factions[index].color;
    setFactions(
      factions.map((faction, i) => {
        if (index === i) {
          return { ...faction, color: value };
        }
        if (faction.color === value) {
          return { ...faction, color: prevValue };
        }
        return faction;
      })
    );
  }

  function updatePlayerName(index, value) {
    setFactions(
      factions.map((faction, i) => {
        if (index === i) {
          return { ...faction, playerName: value };
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
    const optionsToSend = { ...options };
    optionsToSend.expansions = Array.from(options.expansions);

    // TODO: Consider just leaving gaps in the factions array to avoid this nonsense.
    const factionsToSend = factions;
    const speakerToSend = speaker;

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
    const currentOptions = { ...options };
    currentOptions[option] = value;

    setOptions(currentOptions);
  }

  function toggleExpansion(value, expansion) {
    const currentOptions = { ...options };
    if (value) {
      currentOptions.expansions.add(expansion);
    } else {
      currentOptions.expansions.delete(expansion);
      setFactions(factions.map((faction, index) => {
        const tempFaction = { ...faction };
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

  function MiddleTopGapDiv({ }) {
    let height = "0";
    switch (factions.length) {
      case 3:
        height = responsivePixels(98);
        break;
      case 5:
        if (options['map-style'] !== "warp") {
          height = responsivePixels(98);
          break;
        }
      default:
        return null;
    }
    return <div style={{ flex: `${height} 0 0` }}></div>
  }

  function RightTopGapDiv({ }) {
    let height = responsivePixels(80);
    switch (factions.length) {
      case 3:
        height = responsivePixels(60);
        break;
      case 4:
        height = responsivePixels(110);
        break;
      case 5:
      case 6:
        height = responsivePixels(60);
        break;
      case 7:
        if (options['map-style'] === "warp") {
          height = responsivePixels(80);
          break;
        }
      case 8:
        height = responsivePixels(24);
        break;
    }
    return <div style={{ height: height }}></div>
  }

  function SideGapDiv({ }) {
    let height = responsivePixels(80);
    switch (factions.length) {
      default:
        return null;
      case 5:
      case 6:
        height = responsivePixels(36);
        break;
      case 7:
      case 8:
        height = responsivePixels(0);
        break;
    }
    return <div style={{ height: height }}></div>
  }

  function LeftTopGapDiv({ }) {
    let height = responsivePixels(80);
    switch (factions.length) {
      case 3:
        height = responsivePixels(60);
        break;
      case 4:
        height = responsivePixels(160);
        break;
      case 5:
      case 6:
        height = responsivePixels(60);
        break;
      case 7:
      case 8:
        height = responsivePixels(20);
        break;
    }
    return <div style={{ height: height }}></div>
  }
  function LeftBottomGapDiv({ }) {
    let height = responsivePixels(80);
    switch (factions.length) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return null;
    }
    return <div style={{ height: height }}></div>
  }
  function RightBottomGapDiv({ }) {
    let height = responsivePixels(80);
    switch (factions.length) {
      case 3:
        height = responsivePixels(242);
        break;
      case 4:
        height = responsivePixels(172);
        break;
      case 5:
      case 6:
        height = responsivePixels(41);
        break;
      case 7:
        if (options['map-style'] === "warp") {
          height = responsivePixels(80);
          break;
        }
      case 8:
        height = responsivePixels(38);
        break;
    }
    return <div style={{ height: height }}></div>
  }

  const selectedFactions = factions.map((faction) => faction.name);
  const selectedColors = factions.map((faction) => faction.color);

  const maxFactions = options.expansions.has("pok") ? 8 : 6;

  const mapSize = Math.min(window.innerHeight * 0.5, window.innerWidth * 0.25);
  if (window.innerWidth < 960) {
    // TODO: Allow setting up a game on mobile.
  }
  // const mapSize = (Math.min(window.innerHeight, window.innerWidth * .5) - 96) * .6;
  return (
    <React.Fragment>
      <Header />
      {/* Large Screen */}
      <div className="flexRow nonMobile" style={{ alignItems: "flex-start", justifyContent: "center", margin: `${responsivePixels(48)} 0 0 0`, width: "100%" }}>
        <div className="flexColumn" style={{ height: "100%", justifyContent: "flex-start" }}>
          <Options updatePlayerCount={updatePlayerCount} toggleOption={toggleOption} toggleExpansion={toggleExpansion} options={options} numFactions={factions.length} maxFactions={maxFactions} isCouncil={isCouncilInGame()} />
          <LeftTopGapDiv />
          <FactionSelect
            factions={factions}
            position={7}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} />
          <SideGapDiv />
          {factions.length > 4 ? <FactionSelect
            factions={factions}
            position={6}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
          <SideGapDiv />
          {factions.length > 6 ? <FactionSelect
            factions={factions}
            position={5}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
          <LeftBottomGapDiv />
        </div>
        <div className="flexColumn" style={{ flex: `30vw 0 0`, height: "100%", justifyContent: "flex-start" }}>
          <MiddleTopGapDiv />
          {factions.length > 3 && !(factions.length === 5 && options['map-style'] !== "warp") ? <FactionSelect
            factions={factions}
            position={0}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
          <div className="flexRow" style={{ flexShrink: 0, flexGrow: 0, position: "relative", width: "30vw", height: "30vw" }}>
            {/* TODO: Add zoom button 
              <div style={{position: "absolute", right: 24, top: 24}}>
                Icon button zoom
              </div>
            */}
            <Map mapStyle={options['map-style']} mapString={options['map-string']} mallice={options['expansions'].has("pok") ? "A" : null} factions={factions} />
          </div>
          {!(factions.length === 5 && options['map-style'] === "warp") && !(factions.length === 7 && options['map-style'] !== "warp") ? <FactionSelect
            factions={factions}
            position={4}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
        </div>
        <div className="flexColumn" style={{ height: "100%", alignItems: "flex-start", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ width: "100%" }}>
            <LabeledDiv label="Randomize">
              <div className="flexRow" style={{ whiteSpace: "nowrap", width: "100%" }}>
                <button style={{ textAlign: "center" }} onClick={randomSpeaker}>Speaker</button>
                <button style={{ textAlign: "center" }}
                  onClick={randomFactions}
                  disabled={disableRandomizeFactionButton()}
                >
                  Factions
                </button>
                <button style={{ textAlign: "center" }} onClick={randomColors}
                  disabled={disableRandomizeColorsButton()}
                >Colors</button>
              </div>
            </LabeledDiv>
            <button onClick={reset}>Reset</button>

            {/* </div> */}
          </div>

          {/* Spacing Div */}
          <RightTopGapDiv />

          <FactionSelect
            factions={factions}
            position={1}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} />
          <SideGapDiv />
          {factions.length > 4 ? <FactionSelect
            factions={factions}
            position={2}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
          <SideGapDiv />
          {(factions.length > 6 && options['map-style'] === "standard") || factions.length > 7 ? <FactionSelect
            factions={factions}
            position={3}
            speaker={speaker}
            setFaction={updatePlayerFaction}
            setColor={updatePlayerColor}
            setSpeaker={setSpeaker}
            setPlayerName={updatePlayerName}
            options={options} /> : null}
          <RightBottomGapDiv />
          <div className="flexColumn" style={{ width: "100%" }}>
            <button style={{ fontSize: `${responsivePixels(40)}`, fontFamily: "Slider" }} onClick={startGame} disabled={disableNextButton()}>
              Start Game
            </button>
            {disableNextButton() && !invalidCouncil() ?
              <div style={{ color: "firebrick" }}>Select all factions and colors</div>
              : null}
            {invalidCouncil() ?
              <div style={{ color: "firebrick" }}>No sub-factions available for Council Keleres</div>
              : null}
          </div>
        </div>
      </div>
      {/* Mobile Screen */}
      <div className="flexColumn mobileOnly" style={{ width: "100%", paddingTop: responsivePixels(56), boxSizing: "border-box", overflow: "hidden" }}>
        <div className="flexColumn" style={{ alignItems: "flex-start", gap: responsivePixels(12), width: "100%", justifyContent: "flex-start", height: "88vh", overflowY: "auto" }}>
          <div className="flexRow" style={{ width: "100%", fontSize: responsivePixels(20) }}>Setup Game</div>
          <MobileOptions updatePlayerCount={updatePlayerCount} toggleOption={toggleOption} toggleExpansion={toggleExpansion} options={options} numFactions={factions.length} maxFactions={maxFactions} isCouncil={isCouncilInGame()} />
          {factions.map((faction, index) => {
            return <FactionSelect
              factions={factions}
              position={index}
              mobile={true}
              speaker={speaker}
              setFaction={updatePlayerFaction}
              setColor={updatePlayerColor}
              setSpeaker={setSpeaker}
              setPlayerName={updatePlayerName}
              options={options} />
          })}
          <div className="flexColumn" style={{ width: "100%" }}>
            <LabeledDiv label="Randomize">
              <div className="flexRow" style={{ whiteSpace: "nowrap", width: "100%" }}>
                <button style={{ textAlign: "center" }} onClick={randomSpeaker}>Speaker</button>
                <button style={{ textAlign: "center" }}
                  onClick={randomFactions}
                  disabled={disableRandomizeFactionButton()}
                >
                  Factions
                </button>
                <button style={{ textAlign: "center" }} onClick={randomColors}
                  disabled={disableRandomizeColorsButton()}
                >Colors</button>
              </div>
            </LabeledDiv>
            <button onClick={reset}>Reset</button>

            {/* </div> */}
          </div>
          <div className="flexColumn" style={{ width: "100%" }}>
            <button style={{ fontSize: `${responsivePixels(40)}`, fontFamily: "Slider" }} onClick={startGame} disabled={disableNextButton()}>
              Start Game
            </button>
            {disableNextButton() && !invalidCouncil() ?
              <div style={{ color: "firebrick" }}>Select all factions and colors</div>
              : null}
            {invalidCouncil() ?
              <div style={{ color: "firebrick" }}>No sub-factions available for Council Keleres</div>
              : null}
          </div>
        </div>
      </div>
    </React.Fragment>);
}

function Sidebar({ side, content }) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{ letterSpacing: responsivePixels(3) }}>
      {content}
    </div>
  );
}

function Header() {
  const router = useRouter();

  return <div className="flexRow" style={{ top: 0, position: "fixed", alignItems: "flex-start", justifyContent: "flex-start" }}>
    <Head>
      <title>Twilight Imperium Assistant</title>
      <link rel="shortcut icon" href="/images/favicon.ico"></link>
    </Head>
    <Sidebar side="left" content={`SETUP GAME`} />
    <Sidebar side="right" content={`SETUP GAME`} />
    <div className="nonMobile extraLargeFont" style={{ cursor: "pointer", position: "fixed", backgroundColor: "#222", top: `${responsivePixels(12)}`, left: `${responsivePixels(150)}` }} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    <div className="flexColumn extraLargeFont mobileOnly" style={{ cursor: "pointer", position: "fixed", backgroundColor: "#222", textAlign: "center", paddingTop: `${responsivePixels(20)}`, width: "100%" }} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
  </div>
}