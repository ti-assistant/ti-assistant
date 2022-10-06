import Image from 'next/image';
import { useRouter } from 'next/router'
import { useState } from "react";
import useSWR, { useSWRConfig } from 'swr'
import { unassignStrategyCard, swapStrategyCards, setFirstStrategyCard } from './util/api/cards';
import { chooseStartingTech, removeStartingTech } from './util/api/techs';
import { fetcher, poster } from './util/api/util';
import { getNextIndex } from './util/util';

import { TechRow } from '/src/TechRow.js'
import { setSpeaker } from '/src/util/api/state.js';

function getFactionColor(color) {
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

export function FactionSymbol({ faction, size }) {
  let width = size;
  let height = size;
  switch (faction) {
    case "Arborec":
      width = height * 0.816;
      break;
    case "Barony of Letnev":
      width = height * 0.96;
      break;
    case "Clan of Saar":
      height = width / 1.017;
      break;
    case "Embers of Muaat":
      width = height * 0.591;
      break;
    case "Emirates of Hacan":
      height = width / 1.064;
      break;
    case "Federation of Sol":
      height = width / 1.151;
      break;
    case "Ghosts of Creuss":
      height = width / 1.058;
      break;
    case "L1Z1X Mindnet":
      height = width / 1.268;
      break;
    case "Mentak Coalition":
      height = width / 1.023;
      break;
    case "Naalu Collective":
      height = width / 1.259;
      break;
    case "Nekro Virus":
      height = width / 1.021;
      break;
    case "Sardakk N'orr":
      width = height * 0.878;
      break;
    case "Universities of Jol'Nar":
      height = width / 1.093;
      break;
    case "Winnu":
      height = width / 1.051;
      break;
    case "Xxcha Kingdom":
      height = width / 1.043;
      break;
    case "Yin Brotherhood":
      width = height * 0.979;
      break;
    case "Yssaril Tribes":
      width = height * 0.950;
      break;
    case "Argent Flight":
      height = width / 1.013;
      break;
    case "Empyrean":
      width = height * 0.989;
      break;
    case "Mahact Gene-Sorcerers":
      height = width / 1.229;
      break;
    case "Naaz-Rokha Alliance":
      width = height * 0.829;
      break;
    case "Nomad":
      width = height * 0.958;
      break;
    case "Titans of Ul":
      width = height * 0.984;
      break;
    case "Vuil'Raith Cabal":
      width = height * 0.974;
      break;
    case "Council Keleres":
      width = height * 0.944;
      break;
  }
  return <Image src={`/images/factions/${faction}.webp`} alt={`${faction} Icon`} width={`${width}px`} height={`${height}px`} />;
}

const shouldNotPluralize = [
  "Infantry",
];

function pluralize(text, number) {
  if (number === 1 || shouldNotPluralize.includes(text)) {
    return `${text}`;
  } else {
    return `${text}s`;
  }
}

const unitOrder = [
  "Carrier",
  "Cruiser",
  "Destroyer",
  "Dreadnought",
  "Flagship",
  "War Sun",
  "Fighter",
  "Infantry",
  "Space Dock",
  "PDS",
];

const techOrder = [
  "green",
  "blue",
  "yellow",
  "red",
];

function StartingComponents({ faction }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (techError) {
    return (<div>Failed to load techs</div>);
  }
  if (!techs || !factions) {
    return (<div>Loading...</div>);
  }

  const startswith = faction.startswith;

  const orderedPlanets = (startswith.planets ?? []).sort((a, b) => {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  const orderedUnits = Object.entries(startswith.units).sort((a, b) => unitOrder.indexOf(a[0]) - unitOrder.indexOf(b[0]));
  const orderedTechs = (startswith.techs ?? []).map((tech) => {
    return techs[tech];
  }).sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
  const orderedChoices = ((startswith.choice ?? {}).options ?? []).filter((tech) => {
    return !(startswith.techs ?? []).includes(tech);
  }).map((tech) => {
    return techs[tech];
  }).sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  function addTech(tech) {
    chooseStartingTech(mutate, gameid, factions, faction.name, tech);
  }

  function removeTech(tech) {
    removeStartingTech(mutate, gameid, factions, faction.name, tech);
  }

  const numToChoose = !startswith.choice ? 0 : startswith.choice.select - (startswith.techs ?? []).length;

  return (
    <div style={{paddingLeft: "4px", display: "flex", flexDirection: "column", gap: "4px"}}>
      Planets
      <div style={{paddingLeft: "8px", fontFamily: "Myriad Pro"}}>
        {orderedPlanets.map((planet) => {
          return <div key={planet}>
            {planet}
          </div>;
        })}
      </div>
      Units
      <div style={{paddingLeft: "4px", fontFamily: "Myriad Pro"}}>
        {orderedUnits.map(([unit, number]) => {
          return <div key={unit} className="flexRow" style={{justifyContent: "flex-start"}}>
            <div style={{display: "flex", justifyContent: "center", flexBasis: "14%"}}>
              {number}
            </div>{pluralize(unit, number)}
          </div>;
        })}
      </div>
      Techs {startswith.choice ? "(Choice)" : null}
      <div style={{paddingLeft: "4px"}}>
        {orderedTechs.map((tech) => {
          return <TechRow key={tech.name} tech={tech} removeTech={startswith.choice ? () => removeTech(tech.name) : null} />;
        })}
      </div>
      {numToChoose > 0 ?
        <div>
          Choose {numToChoose} more {pluralize("tech", numToChoose)}
          <div>
            {orderedChoices.map((tech) => {
              return <TechRow key={tech.name} tech={tech} addTech={() => addTech(tech.name)} />;
            })}
          </div>
        </div>
      : null}
    </div>
  )
}

export function FactionTile({ faction, onClick, menu, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards, cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [showMenu, setShowMenu] = useState(false);

  if (!state) {
    return (<div>Loading...</div>);
  }
  if (stateError || factionsError || cardsError) {
    return (<div>Failed to load game state</div>);
  }

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function hideMenu() {
    setShowMenu(false);
  }

  function setFactionToSpeaker() {
    hideMenu();
    setSpeaker(mutate, gameid, state, faction.name, factions);
    console.log("setting speaker");
  }

  function publicDisgrace() {
    hideMenu();
    console.log("Public Disgrace!");
    const card = Object.values(strategyCards).find((card) => card.faction === faction.name);
    unassignStrategyCard(mutate, gameid, strategyCards, card.name, state);
  }

  function quantumDatahubNode() {
    hideMenu();
    console.log("Quantum");
    const factionCard = Object.values(strategyCards).find((card) => card.faction === faction.name);
    const hacanCard = Object.values(strategyCards).find((card) => card.faction === "Emirates of Hacan");
    swapStrategyCards(mutate, gameid, strategyCards, factionCard, hacanCard);
  }

  function giftOfPrescience() {
    hideMenu();
    console.log("Gift");
    const factionCard = Object.values(strategyCards).find((card) => card.faction === faction.name);
    setFirstStrategyCard(mutate, gameid, strategyCards, factionCard.name);
  }

  // NOTE: Only works for Strategy phase. Other phases are not deterministic.
  function didFactionJustGo() {
    const numFactions = Object.keys(factions).length;
    if (numFactions === 3 || numFactions === 4) {
      let numPicked = 0;
      for (const card of Object.values(strategyCards)) {
        if (card.faction) {
          ++numPicked;
        }
      }
      if (numPicked === numFactions) {
        return faction.order === numFactions;
      }
      if (numPicked > numFactions) {
        const nextOrder = numFactions - (numPicked - numFactions) + 1;
        return faction.order === nextOrder;
      }
    }
    if (state.activeplayer === "None") {
      return faction.order === numFactions;
    }
    return getNextIndex(faction.order, numFactions + 1, 1) === factions[state.activeplayer].order;
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions).length;
    let numPicked = 0;
    for (const card of Object.values(strategyCards)) {
      if (card.faction) {
        ++numPicked;
      }
    }
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  const iconStyle = {
    width: "40px",
    height: "40px",
    position: "absolute",
    zIndex: -1,
    left: 0,
    width: "100%",
    opacity: "60%",
  };
  const iconButtonStyle = {
    width: "27px",
    height: "27px",
    position: "absolute",
    zIndex: 2,
    left: 0,
    width: "100%",
    opacity: "60%",
  };

  function getMenuButtons() {
    const buttons = [];
    switch (state.phase) {
      case "STRATEGY":
        if (didFactionJustGo()) {
          // NOTE: Doesn't work correctly for 3 to 4 players.
          buttons.push(<div key="Public Disgrace" style={{cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid ${color}`, borderRadius: "5px", fontSize: opts.fontSize ?? "24px"}} onClick={publicDisgrace}>Public Disgrace</div>)
        }
        if (haveAllFactionsPicked()) {
          // TODO: Decide whether this should be on Hacan instead.
          if (Object.keys(factions).includes("Emirates of Hacan") && faction.name !== "Emirates of Hacan" && Object.keys(factions['Emirates of Hacan'].techs).includes("Quantum Datahub Node")) {
            buttons.push(<div key="Quantum Datahub Node" style={{position: "relative", cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid ${color}`, borderRadius: "5px", fontSize: opts.fontSize ?? "24px"}} onClick={quantumDatahubNode}>
              Quantum Datahub Node
            </div>)
          }
          if (Object.keys(factions).includes("Naalu Collective") && faction.name !== "Naalu Collective") {
            buttons.push(<div key="Gift of Prescience" style={{position: "relative", cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid ${color}`, borderRadius: "5px", fontSize: opts.fontSize ?? "24px"}} onClick={giftOfPrescience}>
              Gift of Prescience
            </div>)
          }
        }
        return buttons;
      case "ACTION":
        break;
      case "STATUS":
        break;
      case "AGENDA":
        break;
    }
    return buttons;
  }

  const speaker = faction.name === state.speaker;

  const color = getFactionColor(faction.color);
  const border = "3px solid " + (faction.passed ? "#555" : color);
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);

  return (
    <div
      style={{position: "relative"}}
      tabIndex={0}
      onBlur={onClick ? () => {} : hideMenu}>
      <div
        onClick={onClick ? onClick : toggleMenu}
        style={{
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          border: border,
          fontSize: opts.fontSize ?? "24px",
          position: "relative",
          cursor: (onClick || (menu && getMenuButtons().length !== 0)) ? "pointer" : "auto",
          alignItems: "center",
          whiteSpace: "nowrap",
          padding: "0px 4px",
        }}
      >
        <div className="flexRow" style={{justifyContent: "flex-start", gap: "4px", padding: "0px 4px", height: "40px"}}>
          <div className="flexRow" style={iconStyle}>
            <FactionSymbol faction={faction.name} size={40} />
          </div>
          {speaker ? <div style={{fontFamily: "Myriad Pro",
            position: "absolute",
            color: color === "Black" ? "#eee" : color,
            borderRadius: "5px",
            border: `2px solid ${color}`,
            padding: "0px 2px",
            fontSize: "12px",
            top: "-10px",
            left: "4px",
            zIndex: 1,
            backgroundColor: "#222"}}>
            Speaker
          </div> : null}
          {opts.hideName ? null : <div style={{ textAlign: "center", position: "relative"}}>{faction.name}</div>}
        </div>
      </div>
      {menu ? <div className="flexColumn" style={{fontFamily: "Myriad Pro", left: "100%", marginLeft: "4px", top: "0", position: "absolute", display: showMenu ? "flex" : "none", height: "40px", zIndex: 2}}>
        <div className="flexColumn" style={{alignItems: "stretch", gap: "4px"}}>
          {getMenuButtons()}
        </div>
      </div> : null}
    </div>
  );
}

export function FactionCard({ faction, onClick, style, content, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  if (!state) {
    return (<div>Loading...</div>);
  }
  if (stateError) {
    return (<div>Failed to load game state</div>);
  }

  const speaker = faction.name === state.speaker;
  
  const color = getFactionColor(faction.color);

  const border = "3px solid " + color;
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  const iconStyle = {
    width: "40px",
    height: "52px",
    position: opts.backgroundIcon ? "absolute" : "relative",
    zIndex: opts.backgroundIcon ? -1 : 1,

  };
  const cardStyle = {
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    border: border,
    fontSize: opts.fontSize ?? "24px",
    position: "relative",
    boxSizing: "border-box",
    cursor: onClick ? "pointer" : "auto",
    ...(style ?? {}),
  }
  return (
    <div
      onClick={onClick}
      style={cardStyle}
    >
      {speaker ? <div style={{fontFamily: "Myriad Pro",
          position: "absolute",
          color: color === "Black" ? "#eee" : color,
          borderRadius: "5px",
          border: `2px solid ${color}`,
          padding: "0px 2px",
          fontSize: "12px",
          top: "-10px",
          left: "4px",
          zIndex: 1,
          backgroundColor: "#222"}}>
          Speaker
        </div> : null}
      {opts.hideTitle ? null : <div className="flexRow" style={{justifyContent: "center", gap: "4px", padding: "0px 4px"}}>
        <div className="flexRow" style={iconStyle}>
          <FactionSymbol faction={faction.name} size={40} />
        </div>
        {opts.hideName ? null : <div style={{ paddingRight: "12px" }}>{faction.name}</div>}
      </div>}
      <div>
        {content}
      </div>
      {opts.displayStartingComponents ? 
        <StartingComponents faction={faction} />
      : null}
    </div>
  );
}