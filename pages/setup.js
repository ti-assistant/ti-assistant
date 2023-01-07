import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { FactionTile } from "../src/FactionCard";
import { BasicFactionTile } from "../src/FactionTile";
import { Modal } from "../src/Modal";
import { fetcher } from "../src/util/api/util";
import Image from "next/image";
import { getFactionColor } from "../src/util/factions";
import { HoverMenu } from "../src/HoverMenu";
import { LabeledDiv } from "../src/LabeledDiv";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Options({ updatePlayerCount, toggleOption, toggleExpansion, options, numFactions, maxFactions, isCouncil }) {

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
  
return <div className="flexColumn" style={{gap: "8px"}}>
  <label>Player Count</label>
  <div className='flexRow' style={{gap: "8px"}}>
    {[...Array(maxFactions - 2)].map((e, index) => {
      const number = index + 3;
      return (
        <button key={number} onClick={() => updatePlayerCount(number)} className={numFactions === number ? "selected" : ""}>{number}</button>
      );
    })}
  </div>
  <HoverMenu label="Options">
<div style={{width: "540px"}}>
  <div style={{padding: "8px 16px 0px 16px"}}>
  <div>
    Expansions:
    <div className="flexRow" style={{justifyContent: "flex-start", gap: "8px", padding: "8px 20px"}}>
      <button className={options.expansions.has("pok") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("pok"), "pok")}>Prophecy of Kings</button>
      <button className={options.expansions.has("codex-one") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-one"), "codex-one")}>Codex I</button>
      <button className={options.expansions.has("codex-two") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-two"), "codex-two")}>Codex II</button>
      <button className={options.expansions.has("codex-three") ? "selected" : ""} onClick={() => toggleExpansion(!options.expansions.has("codex-three"), "codex-three")}>Codex III</button>
    </div>
  </div>
  <div>
    Map:
    <div className="flexColumn" style={{fontFamily: "Myriad Pro", gap: "8px", padding: "8px 16px", alignItems: "flex-start"}}>
      {mapStyles.length > 1 ?
      <React.Fragment>
        Map Type:
        <div className="flexRow" style={{paddingLeft: "16px", gap: '8px'}}>
          {mapStyles.map((style) => {
            return <button key={style} className={options['map-style'] === style ? "selected" : ""} onClick={() => toggleOption(style, "map-style")}>{capitalizeFirstLetter(style)}</button>
          })}
        </div>
      </React.Fragment> : null}
      Map String:<input type="textbox" style={{width: "100%"}} onChange={(event)=> toggleOption(event.target.value, "map-string")}></input>
      Used to filter out planets that are not claimable.
    </div>
  </div>
  {/* <div>
    Assistant Options:
    <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
      <button className={options['multiple-planet-owners'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-owners'], "multiple-planet-owners")}>Allow multiple factions to claim planet</button>
    </div>
    <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
      <button className={options['multiple-planet-attachments'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-attachments'], "multiple-planet-attachments")}>Allow the same attachment to be placed on multiple planets</button>
    </div>
  </div> */}
  {isCouncil ? 
  <div>
    Council Keleres:
    <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
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

function FactionSelect({ factions, position, speaker, setFaction, setColor, setSpeaker, setPlayerName, options }) {
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
  if (!availableFactions || !factions || !colors) {
    return (<div>Loading...</div>);
  }

  const factionIndex = getFactionIndex(factions.length, position, options);
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
  <span spellCheck={false} contentEditable={true} suppressContentEditableWarning={true}
    onClick={(e) => e.target.innerText = ""} 
    onBlur={(e) => savePlayerName(e.target)}>
    Player Name
  </span>
  {isSpeaker ? " - Speaker" : null}
  </React.Fragment>

  return (
    <LabeledDiv label={label} color={getFactionColor(faction)} style={{width: "280px"}}>
    <div className="flexColumn" style={{width: "100%", alignItems: "flex-start", whiteSpace: "nowrap", gap: "4px"}}>
      <Modal top="20%" closeMenu={() => setShowFactionModal(false)} visible={showFactionModal} title="Select Faction" content={
        <div className="flexRow" style={{padding: "16px", flexWrap: "wrap", gap: "16px 40px"}}>
          {filteredFactions.map(([factionName, faction]) => {
            faction.color = color;
            return (
              <div key={factionName} style={{flexBasis: "15%", flexGrow: 2, flexShrink: 2}}>
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
              <div key={color} style={{flexBasis: "20%"}}>
                <BasicFactionTile faction={tempFaction} onClick={() => selectColor(color)} />
              </div>
            );
          })}
        </div>
      } />
      {/* <HoverMenu label={faction.name ? faction.name : "Select Faction"} borderColor={faction.color ? faction.color : undefined}> */}
        <div className="flexColumn" style={{paddingTop: "8px", whiteSpace: "nowrap", alignItems: "flex-start", gap: "8px", overflow: "visible", width: "100%"}}>
        <HoverMenu label={faction.name ? faction.name : "Pick Faction"}>
          <div className="flexRow" style={{padding: "8px",
    flexWrap: "wrap",
    maxHeight: "284px",
    alignItems: "stretch",
    gap: "4px",
    writingMode: "vertical-lr",
    justifyContent: "flex-start",
    fontSize: "12px"}}>
          {filteredFactions.map(([factionName, local]) => {
            return <button key={local.name} className={faction.name === factionName ? "selected" : ""} style={{width: "140px", fontSize: "14px"}} onClick={() => selectFaction(factionName)}>{local.name}</button>
          })}
          </div>
        </HoverMenu>
        <div className="flexRow" style={{width: "100%", justifyContent: "space-between"}}>
        <HoverMenu label={faction.color ? "Change Color" : "Pick Color"} style={{minWidth: "92px"}}>
        <div className="flexRow" style={{padding: "8px",
    flexWrap: "wrap",
    maxHeight: "122px",
    alignItems: "stretch",
    gap: "4px",
    writingMode: "vertical-lr",
    justifyContent: "flex-start"}}>
          {filteredColors.map((color) => {
              const factionColor = getFactionColor({color: color});
              return (
                <button key={color} style={{width: "60px", backgroundColor: factionColor, color: factionColor}} className={faction.color === color ? "selected" : ""} onClick={() => selectColor(color)}>{color}</button>
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
}

function FactionSystemImage({className, factionName}) {
  if (!factionName || factionName === "Council Keleres") {
    return (
      <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
      <Image src="/images/systems/ST_0.png" alt={`Faction Tile`} layout="fill" objectFit="contain" /></div>
    );
  }
  return (
    <div className={`flexRow ${className}`} style={{position: "relative", width: "100%", height: "100%"}}>
      <Image src={`/images/systems/${factionName}.png`} alt={`${factionName}'s Home System`} layout="fill" objectFit="contain" />
    </div>
  );
}

function validSystemNumber(number) {
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return false;
  }
  if (intVal < 19 || (intVal > 50 && intVal < 59) || (intVal === 81) || (intVal === 82) || intVal > 91) {
    return false;
  }
  return true;
}

function SystemImage({systemNumber}) {
  if (!systemNumber || !validSystemNumber(systemNumber)) {
    return (
      <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
      <Image style={{opacity: "10%"}} src="/images/systems/Hexagon.png" alt={`System Tile`} layout="fill" objectFit="contain" /></div>
    );
  }
  const checkForA = systemNumber.split("A");
  if (checkForA.length > 1) {
    return (
    <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
      <Image src={`/images/systems/ST_${checkForA[0]}A.png`} alt={`System ${systemNumber} Tile`} layout="fill" objectFit="contain" />
    </div>);
  }
  const checkForB = systemNumber.split("B");
  if (checkForB.length > 1) {
    return (
    <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
      <Image src={`/images/systems/ST_${checkForB[0]}A.png`} alt={`System ${systemNumber} Tile`} layout="fill" objectFit="contain" />
    </div>);
  }
  if (systemNumber > 81) {
    return (
    <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
    <Image style={{opacity: "10%"}} src="/images/systems/Hexagon.png" alt={`System Tile`} layout="fill" objectFit="contain" /></div>);
  }
  return (
  <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
    <Image src={`/images/systems/ST_${systemNumber}.png`} alt={`System ${systemNumber} Tile`} layout="fill" objectFit="contain" />
  </div>);
}

export function Map({mapString, mapStyle, factions}) {
  const systemTiles = mapString.split(" ");

  let numColumns = 7;
  if (factions.length > 6 || mapStyle === "large") {
    numColumns = 9;
  }

  let columns = [
    [56, 55, 54, 53, 52],
    [57, 33, 32, 31, 30, 51],
    [58, 34, 16, 15, 14, 29, 50],
    [59, 35, 17, 5, 4, 13, 28, 49],
    [36, 18, 6, 0, "Mecatol Rex", 3, 12, 27, 48],
    [37, 19, 7, 1, 2, 11, 26, 47],
    [38, 20, 8, 9, 10, 25, 46],
    [39, 21, 22, 23, 24, 45],
    [40, 41, 42, 43, 44],
  ];

  function clearOuterRing() {
    columns[0] = columns[0].map((val) => null);
    columns[1][0] = null;
    columns[1][5] = null;
    columns[2][0] = null;
    columns[2][6] = null;
    columns[3][0] = null;
    columns[3][7] = null;
    columns[4][0] = null;
    columns[4][8] = null;
    columns[5][0] = null;
    columns[5][7] = null;
    columns[6][0] = null;
    columns[6][6] = null;
    columns[7][0] = null;
    columns[7][5] = null;
    columns[8] = columns[8].map((val) => null);
  }

  // Set special tiles.
  switch (factions.length) {
    case 3:
      clearOuterRing();
      columns[7][1] = factions[0].name ?? "ST_0";
      columns[7][3] = "empty";
      columns[7][4] = "empty";
      columns[3][1] = "empty";
      columns[4][1] = "empty";    
      columns[5][1] = "empty";
      columns[4][7] = factions[1].name ?? "ST_0";
      columns[1][1] = factions[2].name ?? "ST_0";
      columns[1][3] = "empty";
      columns[1][4] = "empty";
      columns[2][5] = "empty";
      columns[6][5] = "empty";
      break;
    case 4:
      clearOuterRing();
      columns[3][1] = factions[0].name ?? "ST_0";
      columns[7][2] = factions[1].name ?? "ST_0";
      columns[5][6] = factions[2].name ?? "ST_0";
      columns[1][3] = factions[3].name ?? "ST_0";
      break;
    case 5:
      clearOuterRing();
      switch (mapStyle) {
        case "standard":
          columns[6][1] = factions[0].name ?? "ST_0";
          columns[7][4] = factions[1].name ?? "ST_0";
          columns[4][7] = factions[2].name ?? "ST_0";
          columns[1][4] = factions[3].name ?? "ST_0";
          columns[2][1] = factions[4].name ?? "ST_0";
          break;
        case "skinny":
          columns[6][1] = factions[0].name ?? "ST_0";
          columns[7][3] = factions[1].name ?? "ST_0";
          columns[4][7] = factions[2].name ?? "ST_0";
          columns[1][3] = factions[3].name ?? "ST_0";
          columns[2][1] = factions[4].name ?? "ST_0";
          columns[1][1] = "empty";
          columns[1][4] = "empty";
          columns[2][5] = "empty";
          columns[7][1] = "empty";
          columns[7][4] = "empty";
          columns[6][5] = "empty";
          break;
        case "warp":
          columns[4][1] = factions[0].name ?? "ST_0";
          columns[7][1] = factions[1].name ?? "ST_0";
          columns[7][4] = factions[2].name ?? "ST_0";
          columns[1][4] = factions[3].name ?? "ST_0";
          columns[1][1] = factions[4].name ?? "ST_0";
          columns[4][5] = "ST_86A";
          columns[3][5] = "ST_87A";
          columns[3][6] = "ST_84A";
          columns[4][7] = "ST_85A";
          columns[5][5] = "ST_88A";
          columns[5][6] = "ST_83A";
          break;
          break;
      }
      break;
    case 6:
      switch (mapStyle) {
        case "standard":
          clearOuterRing();
          columns[4][1] = factions[0].name ?? "ST_0";
          columns[7][1] = factions[1].name ?? "ST_0";
          columns[7][4] = factions[2].name ?? "ST_0";
          columns[4][7] = factions[3].name ?? "ST_0";
          columns[1][4] = factions[4].name ?? "ST_0";
          columns[1][1] = factions[5].name ?? "ST_0";
          break;
        case "large":
          columns[4][0] = factions[0].name ?? "ST_0";
          columns[8][0] = factions[1].name ?? "ST_0";
          columns[8][4] = factions[2].name ?? "ST_0";
          columns[4][8] = factions[3].name ?? "ST_0";
          columns[0][4] = factions[4].name ?? "ST_0";
          columns[0][0] = factions[5].name ?? "ST_0";
          break;
      }
      break;
    case 7:
      switch (mapStyle) {
        case "standard":
          columns[4][0] = factions[0].name ?? "ST_0";
          columns[7][0] = factions[1].name ?? "ST_0";
          columns[8][2] = factions[2].name ?? "ST_0";
          columns[7][5] = factions[3].name ?? "ST_0";
          columns[1][5] = factions[4].name ?? "ST_0";
          columns[0][2] = factions[5].name ?? "ST_0";
          columns[1][0] = factions[6].name ?? "ST_0";
          columns[4][6] = "ST_86A";
          columns[3][6] = "ST_87A";
          columns[3][7] = "ST_84A";
          columns[4][8] = "ST_85A";
          columns[5][6] = "ST_88A";
          columns[5][7] = "ST_83A";
          break;
        case "warp":
          columns[8] = columns[8].map((col) => "empty");
          columns[4][0] = factions[0].name ?? "ST_0";
          columns[7][1] = factions[1].name ?? "ST_0";
          columns[7][4] = factions[2].name ?? "ST_0";
          columns[4][8] = factions[3].name ?? "ST_0";
          columns[1][5] = factions[4].name ?? "ST_0";
          columns[0][2] = factions[5].name ?? "ST_0";
          columns[1][0] = factions[6].name ?? "ST_0";
          columns[0][0] = "empty";
          columns[0][3] = "empty";
          columns[0][4] = "empty";
          columns[7][0] = "empty";
          columns[7][5] = "empty";
          columns[6][0] = "empty";
          columns[6][6] = "empty";
          columns[1][2] = "rotateOneTwenty:ST_83B";
          columns[3][4] = "ST_90B";
          columns[4][3] = "ST_85B";
          columns[4][5] = "ST_84B";
          columns[5][1] = "rotateOneEighty:ST_88B";
          columns[5][6] = "ST_86B";
          break;
      }
      break;
    case 8:
      columns[4][0] = factions[0].name ?? "ST_0";
      columns[7][0] = factions[1].name ?? "ST_0";
      columns[8][2] = factions[2].name ?? "ST_0";
      columns[7][5] = factions[3].name ?? "ST_0";
      columns[4][8] = factions[4].name ?? "ST_0";
      columns[1][5] = factions[5].name ?? "ST_0";
      columns[0][2] = factions[6].name ?? "ST_0";
      columns[1][0] = factions[7].name ?? "ST_0";
      switch (mapStyle) {
        case "warp":
          columns[0][0] = "empty";
          columns[0][3] = "empty";
          columns[0][4] = "empty";
          columns[8][0] = "empty";
          columns[8][1] = "empty";
          columns[8][4] = "empty";
          columns[3][4] = "ST_89B";
          columns[5][3] = "rotateOneEighty:ST_90B";
          columns[4][3] = "rotateSixty:ST_87A";
          columns[4][5] = "rotateOneTwenty:ST_88A";
          columns[1][2] = "rotateOneTwenty:ST_83B";
          columns[7][3] = "rotateOneTwenty:ST_85B";
          break;
      }
  }

  const classnames = "flexRow map";

  return <div className={classnames} style={{position: "relative", width: "100%", height: "100%", padding: "1%", boxSizing: 'border-box'}}>
    {columns.map((column, index) => {
      if (numColumns === 7 && (index === 0 || index === 8)) {
        return null;
      }
      let classNames = numColumns === 9 ? "eightPlayerMapColumn" : "mapColumn";
      const nonNullTiles = column.filter((tile) => tile !== null);
      switch (nonNullTiles.length) {
        case 9:
          classNames += " nineTiles";
          break;
        case 8:
          classNames += " eightTiles";
          break;
        case 7:
          classNames += " sevenTiles";
          break;
        case 6:
          classNames += " sixTiles";
          break;
        case 5:
          classNames += " fiveTiles";
          break;
        case 4:
          classNames += " fourTiles";
          break;
      }
      switch (index) {
        case 0:
          classNames += " leftFour";
          break;
        case 1:
          classNames += " leftThree";
          break;
        case 2:
          classNames += " leftTwo";
          break;
        case 3:
          classNames += " leftOne";
          break;
        case 5:
          classNames += " rightOne";
          break;
        case 6:
          classNames += " rightTwo";
          break;
        case 7:
          classNames += " rightThree";
          break;
        case 8:
          classNames += " rightFour";
          break;
      }

      return (
      <div key={index} className={classNames}>
        {column.map((tileNum, subIndex) => {
          const key = tileNum + "-" + subIndex;
          if (tileNum === null) {
            return null;
          }
          if (tileNum === "empty") {
            return <div key={key} className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}></div>
          }
          if (typeof(tileNum) === "string") {
            let classNames = "";
            if (tileNum.split(":").length > 1) {
              classNames = tileNum.split(":")[0];
              tileNum = tileNum.split(":")[1];
            }
            return <FactionSystemImage key={key} className={classNames} factionName={tileNum} />
          }
          // if (systemTiles[tileNum]) {
            return <SystemImage key={key} systemNumber={systemTiles[tileNum] ?? 0} />
          // }
        })}
      </div>);
    })}
  </div>

  /**
   * 3-6 players
   * Ratio: 14% across, 12% per tile vertically
   */
  switch (factions.length) {
    case 3:
      return (
        <div className="flexRow map" style={{position: "relative", width: "100%", height: "100%", padding: "1%", boxSizing: 'border-box'}}>
          {/* Column 1 */}
          <div className="mapColumn leftThree twoTiles" style={{bottom: "19.5%"}}>
            <FactionSystemImage factionName={factions[2].name} />
            <SystemImage systemNumber={systemTiles[32]} />
          </div>
          {/* Column 2 */}
          <div className="mapColumn leftTwo fourTiles" style={{bottom: "13%"}}>
            <SystemImage systemNumber={systemTiles[34]} />
            <SystemImage systemNumber={systemTiles[16]} />
            <SystemImage systemNumber={systemTiles[15]} />
            <SystemImage systemNumber={systemTiles[14]} />
          </div>
          {/* Column 3 */}
          <div className="mapColumn leftOne fiveTiles">
            <SystemImage systemNumber={systemTiles[17]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[13]} />
            <SystemImage systemNumber={systemTiles[28]} />
          </div>
          {/* Column 4 - Middle Column */}
          <div className="mapColumn sixTiles">
            <SystemImage systemNumber={systemTiles[6]} />
            <SystemImage systemNumber={systemTiles[0]} />
            <div className="flexRow" style={{position: "relative", width: "100%", height: "100%"}}>
              <Image src="/images/systems/Mecatol Rex.png" alt={`Mecatol Rex`} layout="fill" objectFit="contain" />
            </div>
            {/* <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" /> */}
            <SystemImage systemNumber={systemTiles[3]} />
            <SystemImage systemNumber={systemTiles[12]} />
            <FactionSystemImage factionName={factions[1].name} />
          </div>
          {/* Column 5 */}
          <div className="mapColumn rightOne fiveTiles">
            <SystemImage systemNumber={systemTiles[7]} />
            <SystemImage systemNumber={systemTiles[1]} />
            <SystemImage systemNumber={systemTiles[2]} />
            <SystemImage systemNumber={systemTiles[11]} />
            <SystemImage systemNumber={systemTiles[26]} />
          </div>
          {/* Column 6 */}
          <div className="mapColumn rightTwo fourTiles" style={{bottom: "13%"}}>
            <SystemImage systemNumber={systemTiles[20]} />
            <SystemImage systemNumber={systemTiles[8]} />
            <SystemImage systemNumber={systemTiles[9]} />
            <SystemImage systemNumber={systemTiles[10]} />
          </div>
          {/* Column 7 */}
          <div className="mapColumn rightThree twoTiles" style={{bottom: "19.5%"}}>
            <FactionSystemImage factionName={factions[0].name} />
            <SystemImage systemNumber={systemTiles[22]} />
          </div>
        </div>
      );
      case 4:
        return (
          <div className="flexRow map">
            {/* Column 1 */}
            <div className="mapColumn leftThree fourTiles">
              <SystemImage systemNumber={systemTiles[33]} />
              <SystemImage systemNumber={systemTiles[32]} />
              <FactionSystemImage factionName={factions[3].name} />
              <SystemImage systemNumber={systemTiles[30]} />
            </div>
            {/* Column 2 */}
            <div className="mapColumn leftTwo fiveTiles">
              <SystemImage systemNumber={systemTiles[34]} />
              <SystemImage systemNumber={systemTiles[16]} />
              <SystemImage systemNumber={systemTiles[15]} />
              <SystemImage systemNumber={systemTiles[14]} />
              <SystemImage systemNumber={systemTiles[29]} />
            </div>
            {/* Column 3 */}
            <div className="mapColumn leftOne sixTiles">
              <FactionSystemImage factionName={factions[0].name} />
              <SystemImage systemNumber={systemTiles[17]} />
              <SystemImage systemNumber={systemTiles[5]} />
              <SystemImage systemNumber={systemTiles[4]} />
              <SystemImage systemNumber={systemTiles[13]} />
              <SystemImage systemNumber={systemTiles[28]} />
            </div>
            {/* Column 4 - Middle Column */}
            <div className="mapColumn sevenTiles">
              <SystemImage systemNumber={systemTiles[18]} />
              <SystemImage systemNumber={systemTiles[6]} />
              <SystemImage systemNumber={systemTiles[0]} />
              <FactionSystemImage factionName="Mecatol Rex" />
              <SystemImage systemNumber={systemTiles[3]} />
              <SystemImage systemNumber={systemTiles[12]} />
              <SystemImage systemNumber={systemTiles[27]} />
            </div>
            {/* Column 5 */}
            <div className="mapColumn rightOne sixTiles">
              <SystemImage systemNumber={systemTiles[19]} />
              <SystemImage systemNumber={systemTiles[7]} />
              <SystemImage systemNumber={systemTiles[1]} />
              <SystemImage systemNumber={systemTiles[2]} />
              <SystemImage systemNumber={systemTiles[11]} />
              <FactionSystemImage factionName={factions[2].name} />
            </div>
            {/* Column 6 */}
            <div className="mapColumn rightTwo fiveTiles">
              <SystemImage systemNumber={systemTiles[20]} />
              <SystemImage systemNumber={systemTiles[8]} />
              <SystemImage systemNumber={systemTiles[9]} />
              <SystemImage systemNumber={systemTiles[10]} />
              <SystemImage systemNumber={systemTiles[25]} />
            </div>
            {/* Column 7 */}
            <div className="mapColumn rightThree fourTiles">
              <SystemImage systemNumber={systemTiles[21]} />
              <FactionSystemImage factionName={factions[1].name} />
              <SystemImage systemNumber={systemTiles[23]} />
              <SystemImage systemNumber={systemTiles[24]} />
            </div>
          </div>
        );

    case 5:
      return (
        <div className="flexRow map">
          {/* Column 1 */}
          <div className="mapColumn leftThree fourTiles">
            <FactionSystemImage factionName={factions[4].name} />
            <SystemImage systemNumber={systemTiles[32]} />
            <SystemImage systemNumber={systemTiles[31]} />
            <FactionSystemImage factionName={factions[3].name} />
          </div>
          {/* Column 2 */}
          <div className="mapColumn leftTwo fiveTiles">
            <SystemImage systemNumber={systemTiles[34]} />
            <SystemImage systemNumber={systemTiles[16]} />
            <SystemImage systemNumber={systemTiles[15]} />
            <SystemImage systemNumber={systemTiles[14]} />
            <SystemImage systemNumber={systemTiles[29]} />
          </div>
          {/* Column 3 */}
          <div className="mapColumn leftOne sixTiles">
            <SystemImage systemNumber={systemTiles[35]} />
            <SystemImage systemNumber={systemTiles[17]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[4]} />
            <SystemImage systemNumber="87A" />
            <SystemImage systemNumber="84A" />
          </div>
          {/* Column 4 - Middle Column */}
          <div className="mapColumn sevenTiles">
            <FactionSystemImage factionName={factions[0].name} />
            <SystemImage systemNumber={systemTiles[6]} />
            <SystemImage systemNumber={systemTiles[0]} />
            <FactionSystemImage factionName="Mecatol Rex" />
            {/* <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" /> */}
            <SystemImage systemNumber="86A" />
            <SystemImage systemNumber={systemTiles[12]} />
            <SystemImage systemNumber="85A" />
          </div>
          {/* Column 5 */}
          <div className="mapColumn rightOne sixTiles">
            <SystemImage systemNumber={systemTiles[19]} />
            <SystemImage systemNumber={systemTiles[7]} />
            <SystemImage systemNumber={systemTiles[1]} />
            <SystemImage systemNumber={systemTiles[2]} />
            <SystemImage systemNumber="88A" />
            <SystemImage systemNumber="83A" />
          </div>
          {/* Column 6 */}
          <div className="mapColumn rightTwo fiveTiles">
            <SystemImage systemNumber={systemTiles[20]} />
            <SystemImage systemNumber={systemTiles[8]} />
            <SystemImage systemNumber={systemTiles[9]} />
            <SystemImage systemNumber={systemTiles[10]} />
            <SystemImage systemNumber={systemTiles[25]} />
          </div>
          {/* Column 7 */}
          <div className="mapColumn rightThree fourTiles">
            <FactionSystemImage factionName={factions[1].name} />
            <SystemImage systemNumber={systemTiles[22]} />
            <SystemImage systemNumber={systemTiles[23]} />
            <FactionSystemImage factionName={factions[2].name} />
          </div>
        </div>
      );
    case 6:
      switch (mapStyle) {
        case "standard":
          return (
            <div className="flexRow" style={{position: "relative", width: "100%", height: "100%", boxSizing: 'border-box'}}>
              {/* Column 1 */}
              <div className="mapColumn leftThree fourTiles">
                <FactionSystemImage factionName={factions[5].name} />
                <SystemImage systemNumber={systemTiles[32]} />
                <SystemImage systemNumber={systemTiles[31]} />
                <FactionSystemImage factionName={factions[4].name} />
              </div>
              {/* Column 2 */}
              <div className="mapColumn leftTwo fiveTiles">
                <SystemImage systemNumber={systemTiles[34]} />
                <SystemImage systemNumber={systemTiles[16]} />
                <SystemImage systemNumber={systemTiles[15]} />
                <SystemImage systemNumber={systemTiles[14]} />
                <SystemImage systemNumber={systemTiles[29]} />
              </div>
              {/* Column 3 */}
              <div className="mapColumn leftOne sixTiles">
                <SystemImage systemNumber={systemTiles[35]} />
                <SystemImage systemNumber={systemTiles[17]} />
                <SystemImage systemNumber={systemTiles[5]} />
                <SystemImage systemNumber={systemTiles[4]} />
                <SystemImage systemNumber={systemTiles[13]} />
                <SystemImage systemNumber={systemTiles[28]} />
              </div>
              {/* Column 4 - Middle Column */}
              <div className="mapColumn sevenTiles">
                <FactionSystemImage factionName={factions[0].name} />
                <SystemImage systemNumber={systemTiles[6]} />
                <SystemImage systemNumber={systemTiles[0]} />
                <div className="flexRow" style={{width: "100%", height: "100%"}}>
                  <Image src="/images/systems/Mecatol Rex.png" alt={`Mecatol Rex`} layout="fill" objectFit="contain" />
                </div>            <SystemImage systemNumber={systemTiles[3]} />
                <SystemImage systemNumber={systemTiles[12]} />
                <FactionSystemImage factionName={factions[3].name} />
              </div>
              {/* Column 5 */}
              <div className="mapColumn rightOne sixTiles">
                <SystemImage systemNumber={systemTiles[19]} />
                <SystemImage systemNumber={systemTiles[7]} />
                <SystemImage systemNumber={systemTiles[1]} />
                <SystemImage systemNumber={systemTiles[2]} />
                <SystemImage systemNumber={systemTiles[11]} />
                <SystemImage systemNumber={systemTiles[26]} />
              </div>
              {/* Column 6 */}
              <div className="mapColumn rightTwo fiveTiles">
                <SystemImage systemNumber={systemTiles[20]} />
                <SystemImage systemNumber={systemTiles[8]} />
                <SystemImage systemNumber={systemTiles[9]} />
                <SystemImage systemNumber={systemTiles[10]} />
                <SystemImage systemNumber={systemTiles[25]} />
              </div>
              {/* Column 7 */}
              <div className="mapColumn rightThree fourTiles">
                <FactionSystemImage factionName={factions[1].name} />
                <SystemImage systemNumber={systemTiles[22]} />
                <SystemImage systemNumber={systemTiles[23]} />
                <FactionSystemImage factionName={factions[2].name} />
              </div>
            </div>
          );
      }
      break;
      case 7:
        return (
          <div className="map flexRow eightPlayer">
            {/* Column 1 */}
            <div className="eightPlayerMapColumn leftFour fiveTiles">
              <SystemImage systemNumber={systemTiles[56]} />
              <SystemImage systemNumber={systemTiles[55]} />
              <FactionSystemImage factionName={factions[5].name} />
              <SystemImage systemNumber={systemTiles[53]} />
              <SystemImage systemNumber={systemTiles[52]} />
            </div>
            {/* Column 2 */}
            <div className="eightPlayerMapColumn leftThree sixTiles">
              <FactionSystemImage factionName={factions[6].name} />
              <SystemImage systemNumber={systemTiles[33]} />
              <SystemImage systemNumber={systemTiles[32]} />
              <SystemImage systemNumber={systemTiles[31]} />
              <SystemImage systemNumber={systemTiles[30]} />
              <FactionSystemImage factionName={factions[4].name} />
            </div>
            {/* Column 3 */}
            <div className="eightPlayerMapColumn leftTwo sevenTiles">
              <SystemImage systemNumber={systemTiles[58]} />
              <SystemImage systemNumber={systemTiles[34]} />
              <SystemImage systemNumber={systemTiles[16]} />
              <SystemImage systemNumber={systemTiles[15]} />
              <SystemImage systemNumber={systemTiles[14]} />
              <SystemImage systemNumber={systemTiles[29]} />
              <SystemImage systemNumber={systemTiles[50]} />
            </div>
            {/* Column 4 */}
            <div className="eightPlayerMapColumn leftOne eightTiles">
              <SystemImage systemNumber={systemTiles[59]} />
              <SystemImage systemNumber={systemTiles[35]} />
              <SystemImage systemNumber={systemTiles[17]} />
              <SystemImage systemNumber={systemTiles[5]} />
              <SystemImage systemNumber={systemTiles[4]} />
              <SystemImage systemNumber={systemTiles[13]} />
              <SystemImage systemNumber="87A" />
              <SystemImage systemNumber="84A" />
            </div>
            {/* Column 5 - Middle Column */}
            <div className="eightPlayerMapColumn nineTiles">
              <FactionSystemImage factionName={factions[0].name} />
              <SystemImage systemNumber={systemTiles[18]} />
              <SystemImage systemNumber={systemTiles[6]} />
              <SystemImage systemNumber={systemTiles[0]} />
              <FactionSystemImage factionName="Mecatol Rex" />
              <SystemImage systemNumber={systemTiles[3]} />
              <SystemImage systemNumber="86A" />
              <SystemImage systemNumber={systemTiles[27]} />
              <SystemImage systemNumber="85A" />
            </div>
            {/* Column 5 */}
            <div className="eightPlayerMapColumn rightOne eightTiles">
              <SystemImage systemNumber={systemTiles[37]} />
              <SystemImage systemNumber={systemTiles[19]} />
              <SystemImage systemNumber={systemTiles[7]} />
              <SystemImage systemNumber={systemTiles[1]} />
              <SystemImage systemNumber={systemTiles[2]} />
              <SystemImage systemNumber={systemTiles[11]} />
              <SystemImage systemNumber="88A" />
              <SystemImage systemNumber="83A" />
            </div>
            {/* Column 6 */}
            <div className="eightPlayerMapColumn rightTwo sevenTiles">
              <SystemImage systemNumber={systemTiles[38]} />
              <SystemImage systemNumber={systemTiles[20]} />
              <SystemImage systemNumber={systemTiles[8]} />
              <SystemImage systemNumber={systemTiles[9]} />
              <SystemImage systemNumber={systemTiles[10]} />
              <SystemImage systemNumber={systemTiles[25]} />
              <SystemImage systemNumber={systemTiles[46]} />
            </div>
            {/* Column 6 */}
            <div className="eightPlayerMapColumn rightThree sixTiles">
              <FactionSystemImage factionName={factions[1].name} />
              <SystemImage systemNumber={systemTiles[21]} />
              <SystemImage systemNumber={systemTiles[22]} />
              <SystemImage systemNumber={systemTiles[23]} />
              <SystemImage systemNumber={systemTiles[24]} />
              <FactionSystemImage factionName={factions[3].name} />
            </div>
            {/* Column 7 */}
            <div className="eightPlayerMapColumn rightFour fiveTiles">
              <SystemImage systemNumber={systemTiles[40]} />
              <SystemImage systemNumber={systemTiles[41]} />
              <FactionSystemImage factionName={factions[2].name} />
              <SystemImage systemNumber={systemTiles[43]} />
              <SystemImage systemNumber={systemTiles[44]} />
            </div>
          </div>
        );
        case 8:
          return (
            <div className="map flexRow eightPlayer">
              {/* Column 1 */}
              <div className="eightPlayerMapColumn leftFour fiveTiles">
                <SystemImage systemNumber={systemTiles[56]} />
                <SystemImage systemNumber={systemTiles[55]} />
                <FactionSystemImage factionName={factions[6].name} />
                <SystemImage systemNumber={systemTiles[53]} />
                <SystemImage systemNumber={systemTiles[52]} />
              </div>
              {/* Column 2 */}
              <div className="eightPlayerMapColumn leftThree sixTiles">
                <FactionSystemImage factionName={factions[7].name} />
                <SystemImage systemNumber={systemTiles[33]} />
                <SystemImage systemNumber={systemTiles[32]} />
                <SystemImage systemNumber={systemTiles[31]} />
                <SystemImage systemNumber={systemTiles[30]} />
                <FactionSystemImage factionName={factions[5].name} />
              </div>
              {/* Column 3 */}
              <div className="eightPlayerMapColumn leftTwo sevenTiles">
                <SystemImage systemNumber={systemTiles[58]} />
                <SystemImage systemNumber={systemTiles[34]} />
                <SystemImage systemNumber={systemTiles[16]} />
                <SystemImage systemNumber={systemTiles[15]} />
                <SystemImage systemNumber={systemTiles[14]} />
                <SystemImage systemNumber={systemTiles[29]} />
                <SystemImage systemNumber={systemTiles[50]} />
              </div>
              {/* Column 4 */}
              <div className="eightPlayerMapColumn leftOne eightTiles">
                <SystemImage systemNumber={systemTiles[59]} />
                <SystemImage systemNumber={systemTiles[35]} />
                <SystemImage systemNumber={systemTiles[17]} />
                <SystemImage systemNumber={systemTiles[5]} />
                <SystemImage systemNumber={systemTiles[4]} />
                <SystemImage systemNumber={systemTiles[13]} />
                <SystemImage systemNumber={systemTiles[28]} />
                <SystemImage systemNumber={systemTiles[49]} />
              </div>
              {/* Column 5 - Middle Column */}
              <div className="eightPlayerMapColumn nineTiles">
                <FactionSystemImage factionName={factions[0].name} />
                <SystemImage systemNumber={systemTiles[18]} />
                <SystemImage systemNumber={systemTiles[6]} />
                <SystemImage systemNumber={systemTiles[0]} />
                <FactionSystemImage factionName="Mecatol Rex" />
                {/* <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" /> */}
                <SystemImage systemNumber={systemTiles[3]} />
                <SystemImage systemNumber={systemTiles[12]} />
                <SystemImage systemNumber={systemTiles[27]} />
                <FactionSystemImage factionName={factions[4].name} />
              </div>
              {/* Column 5 */}
              <div className="eightPlayerMapColumn rightOne eightTiles">
                <SystemImage systemNumber={systemTiles[37]} />
                <SystemImage systemNumber={systemTiles[19]} />
                <SystemImage systemNumber={systemTiles[7]} />
                <SystemImage systemNumber={systemTiles[1]} />
                <SystemImage systemNumber={systemTiles[2]} />
                <SystemImage systemNumber={systemTiles[11]} />
                <SystemImage systemNumber={systemTiles[26]} />
                <SystemImage systemNumber={systemTiles[47]} />
              </div>
              {/* Column 6 */}
              <div className="eightPlayerMapColumn rightTwo sevenTiles">
                <SystemImage systemNumber={systemTiles[38]} />
                <SystemImage systemNumber={systemTiles[20]} />
                <SystemImage systemNumber={systemTiles[8]} />
                <SystemImage systemNumber={systemTiles[9]} />
                <SystemImage systemNumber={systemTiles[10]} />
                <SystemImage systemNumber={systemTiles[25]} />
                <SystemImage systemNumber={systemTiles[46]} />
              </div>
              {/* Column 6 */}
              <div className="eightPlayerMapColumn rightThree sixTiles">
                <FactionSystemImage factionName={factions[1].name} />
                <SystemImage systemNumber={systemTiles[21]} />
                <SystemImage systemNumber={systemTiles[22]} />
                <SystemImage systemNumber={systemTiles[23]} />
                <SystemImage systemNumber={systemTiles[24]} />
                <FactionSystemImage factionName={factions[3].name} />
              </div>
              {/* Column 7 */}
              <div className="eightPlayerMapColumn rightFour fiveTiles">
                <SystemImage systemNumber={systemTiles[40]} />
                <SystemImage systemNumber={systemTiles[41]} />
                <FactionSystemImage factionName={factions[2].name} />
                <SystemImage systemNumber={systemTiles[43]} />
                <SystemImage systemNumber={systemTiles[44]} />
              </div>
            </div>
          );
  }
}

function getFactionSelectStyle(numFactions, index, mapSize) {
  const baseStyle = {
    position: 'absolute',
    width: "300px",
  };
  switch (numFactions) {
    case 3:
      switch (index) {
        case 0:
          baseStyle.marginRight = `${mapSize + 228}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = `${mapSize * .5}px`;
          return baseStyle;
        case 1:
          baseStyle.marginLeft = `${mapSize + 228}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = `${mapSize * .5}px`;
          return baseStyle;
        case 2:
          baseStyle.marginTop = `${mapSize + 12}px`;
          baseStyle.justifyContent = "center";
          return baseStyle;
      }
      break;
    case 4:
      switch (index) {
        case 0:
          baseStyle.marginRight = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = `${mapSize * .1}px`;
          return baseStyle;
        case 1:
          baseStyle.justifyContent = "center";
          baseStyle.marginBottom = `${mapSize + 92}px`;
          return baseStyle;
        case 2:
          baseStyle.marginLeft = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = `${mapSize * .15}px`;
          return baseStyle;
        case 3:
          baseStyle.marginTop = `${mapSize + 72}px`;
          baseStyle.justifyContent = "center";
          return baseStyle;
      }
      break;
    case 5:
    case 6:
      switch (index) {
        case 0:
          baseStyle.marginRight = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = `${mapSize * .4}px`;
          return baseStyle;
        case 1:
          baseStyle.marginRight = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = `${mapSize * .4}px`;
          return baseStyle;
        case 2:
          baseStyle.justifyContent = "center";
          baseStyle.marginBottom = `${mapSize + 100}px`;
          return baseStyle;
        case 3:
          baseStyle.marginLeft = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = `${mapSize * .4}px`;
          return baseStyle;
        case 4:
          baseStyle.marginLeft = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginTop = `${mapSize * .4}px`;
          return baseStyle;
        case 5:
          baseStyle.marginTop = `${mapSize + 80}px`;
          return baseStyle;
      }
      break;
    case 7:
    case 8:
      switch (index) {
        case 0:
          baseStyle.marginRight = `${mapSize + 140}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = `${mapSize * .75}px`;
          return baseStyle;
        case 1:
          baseStyle.marginRight = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-end";
          return baseStyle;
        case 2:
          baseStyle.marginRight = `${mapSize + 140}px`;
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = `${mapSize * .8}px`;
          return baseStyle;
        case 3:
          baseStyle.justifyContent = "center";
          baseStyle.marginBottom = `${mapSize + 88}px`;
          return baseStyle;
        case 4:
          baseStyle.marginLeft = `${mapSize + 140}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = `${mapSize * .8}px`;
          return baseStyle;
        case 5:
          baseStyle.marginLeft = `${mapSize + 240}px`;
          baseStyle.justifyContent = "flex-start";
          return baseStyle;
        case 6:
          baseStyle.marginLeft = `${mapSize + 140}px`;
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginTop = `${mapSize * .75}px`;
          return baseStyle;
        case 7:
          baseStyle.justifyContent = "center";
          baseStyle.marginTop = `${mapSize + 88}px`;
          return baseStyle;
      }
      break;
  }
  return baseStyle;
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
    setOptions(INITIAL_OPTIONS);
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
    const optionsToSend = {...options};
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

  function MiddleTopGapDiv({}) {
    let height = "0px";
    switch (factions.length) {
      case 3:
        height = "117px";
        break;
      case 5:
        if (options['map-style'] !== "warp") {
          height = "117px";
          break;
        }
      default:
        return null;
    }
    return <div style={{flex: `${height} 0 0`}}></div>
  }

  function RightTopGapDiv({}) {
    let height = "80px";
    switch (factions.length) {
      case 3:
        height = "40px";
        break;
      case 4:
        height = "110px";
        break;
      case 5:
      case 6:
        height = "60px";
        break;
      case 7:
        if (options['map-style'] === "warp") {
          height = "80px";
          break;
        }
      case 8:
        height = "10px";
        break;
    }
    return <div style={{height: height}}></div>
  }

  function SideGapDiv({}) {
    let height = "80px";
    switch (factions.length) {
      default:
        return null;
      case 5:
      case 6:
        height = "32px";
        break;
      case 7:
      case 8:
        height = "0px";
        break;
    }
    return <div style={{height: height}}></div>
  }

  function LeftTopGapDiv({}) {
    let height = "80px";
    switch (factions.length) {
      case 3:
        height = "40px";
        break;
      case 4:
        height = "160px";
        break;
      case 5:
      case 6:
        height = "60px";
        break;
      case 7:
      case 8:
        height = "20px";
        break;
    }
    return <div style={{height: height}}></div>
  }
  function LeftBottomGapDiv({}) {
    let height = "80px";
    switch (factions.length) {
      case 3:
      case 4:
      case 5:
      case 6:
        return null;
    }
    return <div style={{height: height}}></div>
  }
  function RightBottomGapDiv({}) {
    let height = "80px";
    switch (factions.length) {
      case 3:
        height = "242px";
        break;
      case 4:
        height = "172px";
        break;
      case 5:
      case 6:
        height = "41px";
        break;
      case 7:
        if (options['map-style'] === "warp") {
          height = "80px";
          break;
        }
      case 8:
        height = "38px";
        break;
    }
    return <div style={{height: height}}></div>
  }

  const selectedFactions = factions.map((faction) => faction.name);
  const selectedColors = factions.map((faction) => faction.color);

  const maxFactions = options.expansions.has("pok") ? 8 : 6;

  const mapSize = 360;
  if (window.innerWidth < 960) {
    // TODO: Allow setting up a game on mobile.
  }
  // const mapSize = (Math.min(window.innerHeight, window.innerWidth * .5) - 96) * .6;
  return (
    <React.Fragment>
      <Header />
      <div className="flexRow" style={{alignItems: "flex-start", justifyContent: "center", margin: "48px 0", height: "calc(100vh - 96px)"}}>
        <div className="flexColumn" style={{height: "100%", justifyContent: "flex-start"}}>
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
        <div className="flexColumn" style={{flex: `${mapSize}px 0 0`, height: "100%", justifyContent: "flex-start"}}>
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
          <div className="flexRow" style={{flexShrink: 0, flexGrow: 0, position: "relative", width: `${mapSize}px`, height: `${mapSize}px`}}>
            {/* TODO: Add zoom button 
              <div style={{position: "absolute", right: 24, top: 24}}>
                Icon button zoom
              </div>
            */}
            <Map mapStyle={options['map-style']} mapString={options['map-string']} factions={factions} />
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
        <div className="flexColumn" style={{height: "100%", alignItems: "flex-start", justifyContent: "flex-start"}}>
          <div className="flexColumn" style={{width: "100%", gap: "8px"}}>
            {/* <div className="flexRow" style={{gap: "8px"}}> */}
            <LabeledDiv label="Randomize">
              <div className="flexRow" style={{whiteSpace: "nowrap", width: "100%"}}>
              <button style={{textAlign: "center"}} onClick={randomSpeaker}>Speaker</button>
              <button style={{textAlign: "center"}} 
                onClick={randomFactions}
                disabled={disableRandomizeFactionButton()}
              >
                Factions
              </button>
              <button style={{textAlign: "center"}} onClick={randomColors}
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
          <div className="flexColumn" style={{width: "100%", gap: "8px"}}>
            <button style={{fontSize: "40px", fontFamily: "Slider"}} onClick={startGame} disabled={disableNextButton()}>
              Start Game
            </button>
            {disableNextButton() ?
              <div style={{color: "darkred"}}>Select all factions and colors</div>
            : null}
          </div>
        </div>
      </div>
      <div className="flexColumn" style={{position: "relative", height: "100vh", alignItems: "center", justifyContent: "center", display: "none"}}>
      <div className="flexColumn" style={{position: "absolute", gap: "8px", marginRight: `${mapSize + 260}px`, marginBottom: `${mapSize * 1.25}px`}}>
        <label>Player Count</label>
        <div className='flexRow' style={{gap: "8px"}}>
          {[...Array(maxFactions - 2)].map((e, index) => {
            const number = index + 3;
            return (
              <button key={number} onClick={() => updatePlayerCount(number)} className={factions.length === number ? "selected" : ""}>{number}</button>
            );
          })}
        </div>
        <HoverMenu label="Options">
      <div style={{width: "540px"}}>
        <div style={{padding: "8px 16px 0px 16px"}}>
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
            <div className="flexRow">
              <button className={options['map-style'] === "standard" ? "selected" : ""} onClick={() => toggleOption("standard", "map-style")}>Standard</button>
            </div>
            Map String:<input type="textbox" style={{width: "100%"}} onChange={(event)=> toggleOption(event.target.value, "map-string")}></input>
            Used to filter out planets that are not claimable.
          </div>
        </div>
        {/* <div>
          Assistant Options:
          <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
            <button className={options['multiple-planet-owners'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-owners'], "multiple-planet-owners")}>Allow multiple factions to claim planet</button>
          </div>
          <div className="flexColumn" style={{gap: "8px", alignItems: "flex-start", padding: "8px 20px"}}>
            <button className={options['multiple-planet-attachments'] ? "selected" : ""} onClick={() => toggleOption(!options['multiple-planet-attachments'], "multiple-planet-attachments")}>Allow the same attachment to be placed on multiple planets</button>
          </div>
        </div> */}
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
      </HoverMenu>
      </div>
      {/* <div className="flexRow" style={{}}> */}
      {/* <div className="flexColumn" style={{position: "relative", flex: "0 0 60%", height: "60vh"}}> */}
      {/* <div className="flexColumn" style={{flexBasis: "60%", position: "relative", gap: "120px", alignItems: "center"}}> */}
        <div className="flexRow" style={{position: "absolute", height: "100vh"}}>
          <div className="flexRow" style={{position: "relative", width: `${mapSize}px`, height: `${mapSize}px`}}>
            <Map mapString={options['map-string']} factions={factions} />
            {/* <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="364px" height="317px" /> */}

            {/* TABLE (replace with image) */}
          </div>
        </div>
        {/* Player 1 */}
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 0, mapSize)}>
          <FactionSelect faction={factions[0]}
            isSpeaker={0 === speaker} 
            setFaction={(value) => updatePlayerFaction(0, value)}
            setColor={(value) => updatePlayerColor(0, value)}
            setSpeaker={() => setSpeaker(0)}
            setPlayerName={(value) => updatePlayerName(0, value)}
            expansions={options.expansions}
            opts={{menuSide: "left"}} />
        </div>
        {/* Player 2 */}
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 1, mapSize)}>
          <FactionSelect faction={factions[1]}
            isSpeaker={1 === speaker} 
            setFaction={(value) => updatePlayerFaction(1, value)}
            setColor={(value) => updatePlayerColor(1, value)}
            setSpeaker={() => setSpeaker(1)}
            setPlayerName={(value) => updatePlayerName(1, value)}
            expansions={options.expansions}
            opts={{menuSide: "left"}} />
        </div>
        {/* Player 3 */}
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 2, mapSize)}>
          <FactionSelect faction={factions[2]}
            isSpeaker={2 === speaker} 
            setFaction={(value) => updatePlayerFaction(2, value)}
            setColor={(value) => updatePlayerColor(2, value)}
            setSpeaker={() => setSpeaker(2)}
            setPlayerName={(value) => updatePlayerName(2, value)}
            expansions={options.expansions}
            opts={{menuSide: "top"}} />
        </div>
        {/* Player 4 */}
        {factions.length > 3 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 3, mapSize)}>
        <FactionSelect faction={factions[3]}
            isSpeaker={3 === speaker} 
            setFaction={(value) => updatePlayerFaction(3, value)}
            setColor={(value) => updatePlayerColor(3, value)}
            setSpeaker={() => setSpeaker(3)}
            setPlayerName={(value) => updatePlayerName(3, value)}
            expansions={options.expansions}
            opts={{menuSide: "right"}} />
        </div> : null}
        {/* Player 5 */}
        {factions.length > 4 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 4, mapSize)}>
          <FactionSelect faction={factions[4]}
            isSpeaker={4 === speaker} 
            setFaction={(value) => updatePlayerFaction(4, value)}
            setColor={(value) => updatePlayerColor(4, value)}
            setSpeaker={() => setSpeaker(4)}
            setPlayerName={(value) => updatePlayerName(4, value)}
            expansions={options.expansions}
            opts={{menuSide: "right"}} />
        </div> : null}
        {/* Player 6 */}
        {factions.length > 5 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 5, mapSize)}>
          <FactionSelect faction={factions[5]}
            isSpeaker={5 === speaker} 
            setFaction={(value) => updatePlayerFaction(5, value)}
            setColor={(value) => updatePlayerColor(5, value)}
            setSpeaker={() => setSpeaker(5)}
            setPlayerName={(value) => updatePlayerName(5, value)}
            expansions={options.expansions}
            opts={{menuSide: "bottom"}} />
        </div> : null}
        {/* Player 7 */}
        {factions.length > 6 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 6, mapSize)}>
          <FactionSelect faction={factions[6]}
            isSpeaker={6 === speaker} 
            setFaction={(value) => updatePlayerFaction(6, value)}
            setColor={(value) => updatePlayerColor(6, value)}
            setSpeaker={() => setSpeaker(6)}
            setPlayerName={(value) => updatePlayerName(6, value)}
            expansions={options.expansions}
            opts={{menuSide: "bottom"}} />
        </div> : null}
        {/* Player 8 */}
        {factions.length > 7 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 7, mapSize)}>
          <FactionSelect faction={factions[7]}
            isSpeaker={7 === speaker} 
            setFaction={(value) => updatePlayerFaction(7, value)}
            setColor={(value) => updatePlayerColor(7, value)}
            setSpeaker={() => setSpeaker(7)}
            setPlayerName={(value) => updatePlayerName(7, value)}
            expansions={options.expansions}
            opts={{menuSide: "bottom"}} />
        </div> : null}
        <div className="flexColumn" style={{position: "absolute", marginLeft: `${mapSize + 260}px`, marginBottom: `${mapSize * 1.25}px`, gap: "8px"}}>
        <button onClick={reset}>Reset</button>
        <div className="flexRow" style={{gap: "8px"}}>
          <button style={{textAlign: "center"}} onClick={randomSpeaker}>Randomize Speaker</button>
          <button style={{textAlign: "center"}} 
            onClick={randomFactions}
            disabled={disableRandomizeFactionButton()}
          >
            Randomize Remaining Factions
          </button>
          <button style={{textAlign: "center"}} onClick={randomColors}
          disabled={disableRandomizeColorsButton()}
          > Randomize Remaining Colors</button>
        </div>
        </div>
        {/* {missingFactions() ?
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
        : null} */}
      {/* </div> */}
      
    {/* </div> */}
    <div className="flexColumn" style={{position: "absolute", marginLeft: `${mapSize + 260}px`, marginTop: `${mapSize * 1.25}px`, gap: "8px"}}>
      <button style={{fontSize: "40px", fontFamily: "Slider"}} onClick={startGame} disabled={disableNextButton()}>
        Start Game
      </button>
    </div>
      </div>
    {/* </div> */}
    </React.Fragment>);
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

  return <div className="flexColumn" style={{top: 0, position: "fixed", alignItems: "flex-start", justifyContent: "flex-start"}}>
    <Sidebar side="left" content={`SETUP GAME`} />
    <Sidebar side="right" content={`SETUP GAME`} />

    {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
      SETUP PHASE
    </div> */}
    <div style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", top: "12px", left: "150px", fontSize: "24px"}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    {/* <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", left: "144px", top: "8px"}}>
      {qrCode ? <img src={qrCode} /> : null}
      <div>Game ID: {gameid}</div>
    </div>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "288px", top: "16px"}}>
      <GameTimer />
    </div> */}
  </div>
}