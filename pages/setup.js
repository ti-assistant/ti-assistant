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

function FactionSelect({ faction, isSpeaker, setFaction, setColor, setSpeaker, setPlayerName, expansions, opts }) {
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

  function savePlayerName(element) {
    if (element.innerText !== "" && element.innerText !== "Player Name") {
      setPlayerName(element.innerText);
    }
    if (element.innerText === "") {
      element.innerText = "Player Name";
      setPlayerName(null);
    }
  }

  const label = 
  <React.Fragment>
  <span spellcheck={false} contentEditable={true} suppressContentEditableWarning={true} 
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
    maxHeight: "310px",
    alignItems: "stretch",
    gap: "4px",
    writingMode: "vertical-lr",
    justifyContent: "flex-start"}}>
          {filteredFactions.map(([factionName, local]) => {
            return <button key={local.name} className={faction.name === factionName ? "selected" : ""} style={{width: "160px"}} onClick={() => selectFaction(factionName)}>{local.name}</button>
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
        {isSpeaker ? null : <button onClick={() => setSpeaker()}>Make Speaker</button>}
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
  'map-string': "",
}

function FactionSystemImage({factionName}) {
  if (!factionName || factionName === "Council Keleres") {
    return <Image src="/images/systems/ST_0.png" alt="Faction Tile" width="69px" height="60px" />
  }
  return <Image src={`/images/systems/${factionName}.png`} alt={`${factionName}'s Home System`} width="69px" height="60px" />
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
    return <Image style={{opacity: "10%"}} src="/images/systems/Hexagon.png" alt={`System Tile`} width="69px" height="60px" />
    // return <div style={{width: "57px", height: "50px"}}></div>
  }
  const checkForA = systemNumber.split("A");
  if (checkForA.length > 1) {
    return <Image src={`/images/systems/ST_${checkForA[0]}A.png`} alt={`System ${systemNumber} Tile`} width="69px" height="60px" />;
  }
  const checkForB = systemNumber.split("A");
  if (checkForB.length > 1) {
    return <Image src={`/images/systems/ST_${checkForB[0]}A.png`} alt={`System ${systemNumber} Tile`} width="69px" height="60px" />;
  }
  if (systemNumber > 81) {
    return <Image style={{opacity: "10%"}} src="/images/systems/Hexagon.png" alt={`System Tile`} width="69px" height="60px" />
  }
  return <Image src={`/images/systems/ST_${systemNumber}.png`} alt={`System ${systemNumber} Tile`} width="69px" height="60px" />
}

function Map({mapString, factions}) {
  const systemTiles = mapString.split(" ");

  switch (factions.length) {
    case 3:
      return (
        <div className="flexRow" style={{position: "relative"}}>
          {/* Column 1 */}
          <div className="flexColumn" style={{marginTop: "-180px"}}>
            <FactionSystemImage factionName={factions[0].name} />
            <SystemImage systemNumber={systemTiles[32]} />
          </div>
          {/* Column 2 */}
          <div className="flexColumn" style={{marginTop: "-120px", marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[34]} />
            <SystemImage systemNumber={systemTiles[16]} />
            <SystemImage systemNumber={systemTiles[15]} />
            <SystemImage systemNumber={systemTiles[14]} />
          </div>
          {/* Column 3 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[17]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[13]} />
            <SystemImage systemNumber={systemTiles[28]} />
          </div>
          {/* Column 4 - Middle Column */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[6]} />
            <SystemImage systemNumber={systemTiles[0]} />
            <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
            <SystemImage systemNumber={systemTiles[3]} />
            <SystemImage systemNumber={systemTiles[12]} />
            <FactionSystemImage factionName={factions[2].name} />
          </div>
          {/* Column 5 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[7]} />
            <SystemImage systemNumber={systemTiles[1]} />
            <SystemImage systemNumber={systemTiles[2]} />
            <SystemImage systemNumber={systemTiles[11]} />
            <SystemImage systemNumber={systemTiles[26]} />
          </div>
          {/* Column 6 */}
          <div className="flexColumn" style={{marginTop: "-120px", marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[20]} />
            <SystemImage systemNumber={systemTiles[8]} />
            <SystemImage systemNumber={systemTiles[9]} />
            <SystemImage systemNumber={systemTiles[10]} />
          </div>
          {/* Column 7 */}
          <div className="flexColumn" style={{marginTop: "-180px", marginLeft: "-17px"}}>
            <FactionSystemImage factionName={factions[1].name} />
            <SystemImage systemNumber={systemTiles[22]} />
          </div>
        </div>
      );
      case 4:
        return (
          <div className="flexRow" style={{position: "relative"}}>
            {/* Column 1 */}
            <div className="flexColumn">
              <SystemImage systemNumber={systemTiles[33]} />
              <SystemImage systemNumber={systemTiles[32]} />
              <FactionSystemImage factionName={factions[0].name} />
              <SystemImage systemNumber={systemTiles[30]} />
            </div>
            {/* Column 2 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[34]} />
              <SystemImage systemNumber={systemTiles[16]} />
              <SystemImage systemNumber={systemTiles[15]} />
              <SystemImage systemNumber={systemTiles[14]} />
              <SystemImage systemNumber={systemTiles[29]} />
            </div>
            {/* Column 3 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <FactionSystemImage factionName={factions[1].name} />
              <SystemImage systemNumber={systemTiles[17]} />
              <SystemImage systemNumber={systemTiles[5]} />
              <SystemImage systemNumber={systemTiles[4]} />
              <SystemImage systemNumber={systemTiles[13]} />
              <SystemImage systemNumber={systemTiles[28]} />
            </div>
            {/* Column 4 - Middle Column */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[18]} />
              <SystemImage systemNumber={systemTiles[6]} />
              <SystemImage systemNumber={systemTiles[0]} />
              <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
              <SystemImage systemNumber={systemTiles[3]} />
              <SystemImage systemNumber={systemTiles[12]} />
              <SystemImage systemNumber={systemTiles[27]} />
            </div>
            {/* Column 5 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[19]} />
              <SystemImage systemNumber={systemTiles[7]} />
              <SystemImage systemNumber={systemTiles[1]} />
              <SystemImage systemNumber={systemTiles[2]} />
              <SystemImage systemNumber={systemTiles[11]} />
              <FactionSystemImage factionName={factions[3].name} />
            </div>
            {/* Column 6 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[20]} />
              <SystemImage systemNumber={systemTiles[8]} />
              <SystemImage systemNumber={systemTiles[9]} />
              <SystemImage systemNumber={systemTiles[10]} />
              <SystemImage systemNumber={systemTiles[25]} />
            </div>
            {/* Column 7 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[21]} />
              <FactionSystemImage factionName={factions[2].name} />
              <SystemImage systemNumber={systemTiles[23]} />
              <SystemImage systemNumber={systemTiles[24]} />
            </div>
          </div>
        );

    case 5:
      return (
        <div className="flexRow" style={{position: "relative"}}>
          {/* Column 1 */}
          <div className="flexColumn">
            <FactionSystemImage factionName={factions[1].name} />
            <SystemImage systemNumber={systemTiles[32]} />
            <SystemImage systemNumber={systemTiles[31]} />
            <FactionSystemImage factionName={factions[0].name} />
          </div>
          {/* Column 2 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[34]} />
            <SystemImage systemNumber={systemTiles[16]} />
            <SystemImage systemNumber={systemTiles[15]} />
            <SystemImage systemNumber={systemTiles[14]} />
            <SystemImage systemNumber={systemTiles[29]} />
          </div>
          {/* Column 3 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[35]} />
            <SystemImage systemNumber={systemTiles[17]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[4]} />
            <SystemImage systemNumber="87A" />
            <SystemImage systemNumber="84A" />
          </div>
          {/* Column 4 - Middle Column */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <FactionSystemImage factionName={factions[2].name} />
            <SystemImage systemNumber={systemTiles[6]} />
            <SystemImage systemNumber={systemTiles[0]} />
            <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
            <SystemImage systemNumber="86A" />
            <SystemImage systemNumber={systemTiles[12]} />
            <SystemImage systemNumber="85A" />
          </div>
          {/* Column 5 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[19]} />
            <SystemImage systemNumber={systemTiles[7]} />
            <SystemImage systemNumber={systemTiles[1]} />
            <SystemImage systemNumber={systemTiles[2]} />
            <SystemImage systemNumber="88A" />
            <SystemImage systemNumber="83A" />
          </div>
          {/* Column 6 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[20]} />
            <SystemImage systemNumber={systemTiles[8]} />
            <SystemImage systemNumber={systemTiles[9]} />
            <SystemImage systemNumber={systemTiles[10]} />
            <SystemImage systemNumber={systemTiles[25]} />
          </div>
          {/* Column 7 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <FactionSystemImage factionName={factions[3].name} />
            <SystemImage systemNumber={systemTiles[22]} />
            <SystemImage systemNumber={systemTiles[23]} />
            <FactionSystemImage factionName={factions[4].name} />
          </div>
        </div>
      );
    case 6:
      return (
        <div className="flexRow" style={{position: "relative"}}>
          {/* Column 1 */}
          <div className="flexColumn">
            <FactionSystemImage factionName={factions[1].name} />
            <SystemImage systemNumber={systemTiles[32]} />
            <SystemImage systemNumber={systemTiles[31]} />
            <FactionSystemImage factionName={factions[0].name} />
          </div>
          {/* Column 2 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[34]} />
            <SystemImage systemNumber={systemTiles[16]} />
            <SystemImage systemNumber={systemTiles[15]} />
            <SystemImage systemNumber={systemTiles[14]} />
            <SystemImage systemNumber={systemTiles[29]} />
          </div>
          {/* Column 3 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[35]} />
            <SystemImage systemNumber={systemTiles[17]} />
            <SystemImage systemNumber={systemTiles[5]} />
            <SystemImage systemNumber={systemTiles[4]} />
            <SystemImage systemNumber={systemTiles[13]} />
            <SystemImage systemNumber={systemTiles[28]} />
          </div>
          {/* Column 4 - Middle Column */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <FactionSystemImage factionName={factions[2].name} />
            <SystemImage systemNumber={systemTiles[6]} />
            <SystemImage systemNumber={systemTiles[0]} />
            <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
            <SystemImage systemNumber={systemTiles[3]} />
            <SystemImage systemNumber={systemTiles[12]} />
            <FactionSystemImage factionName={factions[5].name} />
          </div>
          {/* Column 5 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[19]} />
            <SystemImage systemNumber={systemTiles[7]} />
            <SystemImage systemNumber={systemTiles[1]} />
            <SystemImage systemNumber={systemTiles[2]} />
            <SystemImage systemNumber={systemTiles[11]} />
            <SystemImage systemNumber={systemTiles[26]} />
          </div>
          {/* Column 6 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <SystemImage systemNumber={systemTiles[20]} />
            <SystemImage systemNumber={systemTiles[8]} />
            <SystemImage systemNumber={systemTiles[9]} />
            <SystemImage systemNumber={systemTiles[10]} />
            <SystemImage systemNumber={systemTiles[25]} />
          </div>
          {/* Column 7 */}
          <div className="flexColumn" style={{marginLeft: "-17px"}}>
            <FactionSystemImage factionName={factions[3].name} />
            <SystemImage systemNumber={systemTiles[22]} />
            <SystemImage systemNumber={systemTiles[23]} />
            <FactionSystemImage factionName={factions[4].name} />
          </div>
        </div>
      );
      case 7:
        return (
          <div className="flexRow" style={{position: "relative"}}>
            {/* Column 1 */}
            <div className="flexColumn">
              <SystemImage systemNumber={systemTiles[56]} />
              <SystemImage systemNumber={systemTiles[55]} />
              <FactionSystemImage factionName={factions[1].name} />
              <SystemImage systemNumber={systemTiles[53]} />
              <SystemImage systemNumber={systemTiles[52]} />
            </div>
            {/* Column 2 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <FactionSystemImage factionName={factions[2].name} />
              <SystemImage systemNumber={systemTiles[33]} />
              <SystemImage systemNumber={systemTiles[32]} />
              <SystemImage systemNumber={systemTiles[31]} />
              <SystemImage systemNumber={systemTiles[30]} />
              <FactionSystemImage factionName={factions[0].name} />
            </div>
            {/* Column 3 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[58]} />
              <SystemImage systemNumber={systemTiles[34]} />
              <SystemImage systemNumber={systemTiles[16]} />
              <SystemImage systemNumber={systemTiles[15]} />
              <SystemImage systemNumber={systemTiles[14]} />
              <SystemImage systemNumber={systemTiles[29]} />
              <SystemImage systemNumber={systemTiles[50]} />
            </div>
            {/* Column 4 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
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
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <FactionSystemImage factionName={factions[3].name} />
              <SystemImage systemNumber={systemTiles[18]} />
              <SystemImage systemNumber={systemTiles[6]} />
              <SystemImage systemNumber={systemTiles[0]} />
              <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
              <SystemImage systemNumber={systemTiles[3]} />
              <SystemImage systemNumber="86A" />
              <SystemImage systemNumber={systemTiles[27]} />
              <SystemImage systemNumber="85A" />
            </div>
            {/* Column 5 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
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
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[38]} />
              <SystemImage systemNumber={systemTiles[20]} />
              <SystemImage systemNumber={systemTiles[8]} />
              <SystemImage systemNumber={systemTiles[9]} />
              <SystemImage systemNumber={systemTiles[10]} />
              <SystemImage systemNumber={systemTiles[25]} />
              <SystemImage systemNumber={systemTiles[46]} />
            </div>
            {/* Column 6 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <FactionSystemImage factionName={factions[4].name} />
              <SystemImage systemNumber={systemTiles[21]} />
              <SystemImage systemNumber={systemTiles[22]} />
              <SystemImage systemNumber={systemTiles[23]} />
              <SystemImage systemNumber={systemTiles[24]} />
              <FactionSystemImage factionName={factions[6].name} />
            </div>
            {/* Column 7 */}
            <div className="flexColumn" style={{marginLeft: "-17px"}}>
              <SystemImage systemNumber={systemTiles[40]} />
              <SystemImage systemNumber={systemTiles[41]} />
              <FactionSystemImage factionName={factions[5].name} />
              <SystemImage systemNumber={systemTiles[43]} />
              <SystemImage systemNumber={systemTiles[44]} />
            </div>
          </div>
        );
        case 8:
          return (
            <div className="flexRow" style={{position: "relative"}}>
              {/* Column 1 */}
              <div className="flexColumn">
                <SystemImage systemNumber={systemTiles[56]} />
                <SystemImage systemNumber={systemTiles[55]} />
                <FactionSystemImage factionName={factions[1].name} />
                <SystemImage systemNumber={systemTiles[53]} />
                <SystemImage systemNumber={systemTiles[52]} />
              </div>
              {/* Column 2 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <FactionSystemImage factionName={factions[2].name} />
                <SystemImage systemNumber={systemTiles[33]} />
                <SystemImage systemNumber={systemTiles[32]} />
                <SystemImage systemNumber={systemTiles[31]} />
                <SystemImage systemNumber={systemTiles[30]} />
                <FactionSystemImage factionName={factions[0].name} />
              </div>
              {/* Column 3 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <SystemImage systemNumber={systemTiles[58]} />
                <SystemImage systemNumber={systemTiles[34]} />
                <SystemImage systemNumber={systemTiles[16]} />
                <SystemImage systemNumber={systemTiles[15]} />
                <SystemImage systemNumber={systemTiles[14]} />
                <SystemImage systemNumber={systemTiles[29]} />
                <SystemImage systemNumber={systemTiles[50]} />
              </div>
              {/* Column 4 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
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
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <FactionSystemImage factionName={factions[3].name} />
                <SystemImage systemNumber={systemTiles[18]} />
                <SystemImage systemNumber={systemTiles[6]} />
                <SystemImage systemNumber={systemTiles[0]} />
                <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="69px" height="60px" />
                <SystemImage systemNumber={systemTiles[3]} />
                <SystemImage systemNumber={systemTiles[3]} />
                <SystemImage systemNumber={systemTiles[27]} />
                <FactionSystemImage factionName={factions[7].name} />
              </div>
              {/* Column 5 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
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
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <SystemImage systemNumber={systemTiles[38]} />
                <SystemImage systemNumber={systemTiles[20]} />
                <SystemImage systemNumber={systemTiles[8]} />
                <SystemImage systemNumber={systemTiles[9]} />
                <SystemImage systemNumber={systemTiles[10]} />
                <SystemImage systemNumber={systemTiles[25]} />
                <SystemImage systemNumber={systemTiles[46]} />
              </div>
              {/* Column 6 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <FactionSystemImage factionName={factions[4].name} />
                <SystemImage systemNumber={systemTiles[21]} />
                <SystemImage systemNumber={systemTiles[22]} />
                <SystemImage systemNumber={systemTiles[23]} />
                <SystemImage systemNumber={systemTiles[24]} />
                <FactionSystemImage factionName={factions[6].name} />
              </div>
              {/* Column 7 */}
              <div className="flexColumn" style={{marginLeft: "-17px"}}>
                <SystemImage systemNumber={systemTiles[40]} />
                <SystemImage systemNumber={systemTiles[41]} />
                <FactionSystemImage factionName={factions[5].name} />
                <SystemImage systemNumber={systemTiles[43]} />
                <SystemImage systemNumber={systemTiles[44]} />
              </div>
            </div>
          );
  }
}

function getFactionSelectStyle(numFactions, index) {
  const baseStyle = {
    position: 'absolute',
    width: "300px",
  };
  switch (numFactions) {
    case 3:
      switch (index) {
        case 0:
          baseStyle.marginRight = "700px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = "240px";
          return baseStyle;
        case 1:
          baseStyle.marginLeft = "700px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = "240px";
          return baseStyle;
        case 2:
          baseStyle.marginTop = "480px";
          baseStyle.justifyContent = "center";
          return baseStyle;
      }
      break;
    case 4:
      switch (index) {
        case 0:
          baseStyle.marginRight = "700px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = "60px";
          return baseStyle;
        case 1:
          baseStyle.marginRight = "380px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = "480px";
          return baseStyle;
        case 2:
          baseStyle.marginLeft = "700px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = "60px";
          return baseStyle;
        case 3:
          baseStyle.marginLeft = "380px";
          baseStyle.marginTop = "480px";
          baseStyle.justifyContent = "flex-start";
          return baseStyle;
      }
      break;
    case 5:
    case 6:
      switch (index) {
        case 0:
          baseStyle.marginRight = "700px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = "180px";
          return baseStyle;
        case 1:
          baseStyle.marginRight = "700px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = "180px";
          return baseStyle;
        case 2:
          baseStyle.justifyContent = "center";
          baseStyle.marginBottom = "540px";
          return baseStyle;
        case 3:
          baseStyle.marginLeft = "700px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = "180px";
          return baseStyle;
        case 4:
          baseStyle.marginLeft = "700px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginTop = "180px";
          return baseStyle;
        case 5:
          baseStyle.justifyContent = "center";
          baseStyle.marginTop = "540px";
          return baseStyle;
      }
      break;
    case 7:
    case 8:
      switch (index) {
        case 0:
          baseStyle.marginRight = "580px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginTop = "480px";
          return baseStyle;
        case 1:
          baseStyle.marginRight = "800px";
          baseStyle.justifyContent = "flex-end";
          return baseStyle;
        case 2:
          baseStyle.marginRight = "580px";
          baseStyle.justifyContent = "flex-end";
          baseStyle.marginBottom = "480px";
          return baseStyle;
        case 3:
          baseStyle.justifyContent = "center";
          baseStyle.marginBottom = "660px";
          return baseStyle;
        case 4:
          baseStyle.marginLeft = "580px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginBottom = "480px";
          return baseStyle;
        case 5:
          baseStyle.marginLeft = "800px";
          baseStyle.justifyContent = "flex-start";
          return baseStyle;
        case 6:
          baseStyle.marginLeft = "580px";
          baseStyle.justifyContent = "flex-start";
          baseStyle.marginTop = "480px";
          return baseStyle;
        case 7:
          baseStyle.justifyContent = "center";
          baseStyle.marginTop = "660px";
          return baseStyle;
      }
      break;
  }
  return baseStyle;
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
      <div className="flexColumn" style={{position: "relative", flex: "0 0 60%", height: "60vh"}}>
      {/* <div className="flexColumn" style={{flexBasis: "60%", position: "relative", gap: "120px", alignItems: "center"}}> */}
        <div className="flexRow" style={{position: "absolute", width: "100%", height: "100%"}}>
          <Map mapString={options['map-string']} factions={factions} />
          {/* <Image src="/images/systems/Mecatol Rex.png" alt="Mecatol Rex" width="364px" height="317px" /> */}

          {/* TABLE (replace with image) */}
        </div>
        {/* Player 1 */}
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 0)}>
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
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 1)}>
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
        <div className="flexRow" style={getFactionSelectStyle(factions.length, 2)}>
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
        {factions.length > 3 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 3)}>
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
        {factions.length > 4 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 4)}>
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
        {factions.length > 5 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 5)}>
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
        {factions.length > 6 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 6)}>
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
        {factions.length > 7 ? <div className="flexRow" style={getFactionSelectStyle(factions.length, 7)}>
          <FactionSelect faction={factions[7]}
            isSpeaker={7 === speaker} 
            setFaction={(value) => updatePlayerFaction(7, value)}
            setColor={(value) => updatePlayerColor(7, value)}
            setSpeaker={() => setSpeaker(7)}
            setPlayerName={(value) => updatePlayerName(7, value)}
            expansions={options.expansions}
            opts={{menuSide: "bottom"}} />
        </div> : null}
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