import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { AddPlanetList } from "/src/AddPlanetList.js";
import { AddTechList } from "/src/AddTechList.js";
import { Resources } from "/src/Resources.js";
import { PlanetRow, PlanetAttributes, PlanetSymbol } from "/src/PlanetRow.js";
import { TechRow } from "/src/TechRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { Modal } from "/src/Modal.js";
import useSWR, { useSWRConfig } from 'swr'
import { ObjectiveList } from "/src/ObjectiveList";
import { fetcher, poster } from '../../../src/util/api/util';
import { pluralize } from "../../../src/util/util";
import { lockTech, unlockTech } from "../../../src/util/api/techs";
import { claimPlanet, exhaustPlanets, readyPlanets, unclaimPlanet } from "../../../src/util/api/planets";
import { FactionCard, FactionSymbol } from "../../../src/FactionCard";
import { BasicFactionTile } from "../../../src/FactionTile";
import { TechIcon } from "../../../src/TechRow";
import { FactionSummary } from "../../../src/FactionSummary";

const techOrder = [
  "green",
  "blue",
  "yellow",
  "red",
  "upgrade",
];

function Prompt({ faction, prompt }) {
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
  async function addTech(tech) {
    const data = {
      action: "CHOOSE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = [
      ...(updatedFactions[faction.name].startswith.techs ?? []),
      tech,
    ];
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set(updatedFactions["Council Keleres"].startswith.choice.options);
      councilChoice.add(tech);
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
    }

    const options = {
      optimisticData: updatedFactions,
    };

    await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

    const opts = {
      optimisticData: updatedFactions[faction.name],
    };
    
    mutate(`/api/${gameid}/factions/${faction.name}`, fetcher(`/api/${gameid}/factions/${faction.name}`, data), opts)
  }

  async function removeTech(tech) {
    const data = {
      action: "REMOVE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = (updatedFactions[faction.name].startswith.techs ?? []).filter((startingTech) => startingTech !== tech);
    
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set();
      for (const [name, faction] of Object.entries(factions)) {
        if (name === "Council Keleres") {
          continue;
        }
        (faction.startswith.techs ?? []).forEach((tech) => {
          councilChoice.add(tech);
        });
      }
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
      for (const [index, tech] of (factions["Council Keleres"].startswith.techs ?? []).entries()) {
        if (!councilChoice.has(tech)) {
          delete updatedFactions["Council Keleres"].techs[tech];
          factions["Council Keleres"].startswith.techs.splice(index, 1);
        }
      }
    }

    const options = {
      optimisticData: updatedFactions,
    };

    await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
    
    const opts = {
      optimisticData: updatedFactions[faction.name],
    };
    
    mutate(`/api/${gameid}/factions/${faction.name}`, fetcher(`/api/${gameid}/factions/${faction.name}`, data), opts)
  }

  const numToChoose = !startswith.choice ? 0 : startswith.choice.select - (startswith.techs ?? []).length;

  function confirmChoice() {
    // TODO: This should clear the prompt on the server (or mark as completed)
  }

  switch (prompt.type) {
    case "STARTING_TECH":
      return <div> 
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
        : <button onClick={confirmChoice}>Confirm</button>}
      </div>;
  }
}

// function FactionSummary({ VPs, ownedTechs, ownedPlanets, options={} }) {
//   let resources = 0;
//   let influence = 0;
//   let cultural = 0;
//   let hazardous = 0;
//   let industrial = 0;
//   const skips = [];
//   for (const planet of ownedPlanets) {
//     if (planet.ready || options.total) {
//       resources += planet.resources;
//       influence += planet.influence;
//       for (const attribute of planet.attributes) {
//         if (attribute.includes("skip")) {
//           skips.push(attribute);
//         }
//       }
//     }
//     switch (planet.type) {
//       case "Cultural":
//         ++cultural;
//         break;
//       case "Industrial":
//         ++industrial;
//         break;
//       case "Hazardous":
//         ++hazardous;
//         break;
//     }
//     if (planet.attributes.includes("all-types")) {
//       ++cultural;
//       ++industrial;
//       ++hazardous;
//     }
//   }

//   let blueTechs = 0;
//   let yellowTechs = 0;
//   let greenTechs = 0;
//   let redTechs = 0;
//   let upgradeTechs = 0;
//   for (const tech of ownedTechs) {
//     switch (tech.type) {
//       case "red":
//         ++redTechs;
//         break;
//       case "yellow":
//         ++yellowTechs;
//         break;
//       case "green":
//         ++greenTechs;
//         break;
//       case "blue":
//         ++blueTechs;
//         break;
//       case "upgrade":
//         ++upgradeTechs;
//         break;
//     }
//   }

//   return (
//     <div className="flexRow" style={{width: "100%"}}>
//       <div className="flexColumn" style={{flexBasis: "30%", fontSize: "16px", height: "90px", justifyContent: "space-evenly"}}>
//         <div className="flexRow" style={{width: "100%"}}>
//           <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
//             <div className="flexColumn" style={{flexBasis: "30%"}}>{redTechs}</div><TechIcon type={"red"} width="21px" height="22px" />
//           </div>
//           <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
//           <div className="flexColumn" style={{flexBasis: "30%"}}>{greenTechs}</div> <TechIcon type={"green"} width="21px" height="22px" />
//           </div>
//         </div>
//         <div className="flexRow" style={{width: "100%"}}>
//           <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
//           <div className="flexColumn" style={{flexBasis: "30%"}}>{blueTechs}</div><TechIcon type={"blue"} width="21px" height="22px" />
//           </div>
//           <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
//           <div className="flexColumn" style={{flexBasis: "30%"}}>{yellowTechs}</div><TechIcon type={"yellow"} width="21px" height="22px" />
//           </div>
//         </div>
//         <div className="flexRow" style={{width: "100%"}}>
//           {upgradeTechs} {pluralize("Upgrade", upgradeTechs)}
//         </div>
//       </div>
//       <div className="flexColumn" style={{flexBasis: "30%", fontSize: "28px"}}>
//         <div style={{fontSize: "40px"}}>
//           {VPs}
//         </div>
//         <div style={{fontSize: "28px"}}>{pluralize('VP', VPs)}</div>
//       </div>
//       <div className="flexColumn" style={{flexBasis: "30%"}}>
//         <div className="flexRow">
//           <Resources
//             resources={resources}
//             influence={influence}
//           />
//           <PlanetAttributes attributes={skips} />
//         </div>
//         <div className="flexRow" style={{fontSize: "16px", width: "100%"}}>
//           <div className="flexRow" style={{flexBasis: "33%"}}>
//             <div className="flexColumn" style={{flexBasis: "15%"}}>{cultural}</div>
//             <PlanetSymbol type={"Cultural"} size="18px" />
//           </div>
//           <div className="flexRow" style={{flexBasis: "33%"}}>
//             <div>{hazardous}</div>
//             <PlanetSymbol type={"Hazardous"} size="18px" />
//           </div>
//           <div className="flexRow" style={{flexBasis: "33%"}}>
//             <div>{industrial}</div>
//             <PlanetSymbol type={"Industrial"} size="18px" />
//           </div>
//         </div>
//       </div>
//     </div>);
// }

function FactionContent() {
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState("planets");
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: state, error: stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher, { refreshInterval: 5000 });
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets?faction=${playerFaction}` : null, fetcher);
  const { data: technologies, error: techsError } = useSWR(gameid && playerFaction ? `/api/${gameid}/techs?faction=${playerFaction}` : null, fetcher);
  const { data: strategyCards, error: cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }
  if (planetsError) {
    return (<div>Failed to load planets</div>);
  }
  if (techsError) {
    return (<div>Failed to load technologies</div>);
  }
  if (cardsError) {
    return (<div>Failed to load cards</div>);
  }
  // if (!strategyCards || !attachments || !factions || !objectives || !planets || !technologies) {
  //   return (<div>Loading...</div>);
  // }

  if (!factions[playerFaction]) {
    router.push(`/game/${gameid}`);
    return;
  }

  const ownedPlanets = [];
  Object.values(planets ?? {}).forEach((planet) => {
    if ((planet.owners ?? []).includes(playerFaction)) {
      ownedPlanets.push(planet);
    }
  });

  function toggleAddTechMenu() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(toRemove) {
    unclaimPlanet(mutate, gameid, planets, toRemove, playerFaction);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, gameid, planets, toAdd, playerFaction);
  }
  
  function removeTech(toRemove) {
    lockTech(mutate, gameid, factions, playerFaction, toRemove);
  }

  function addTech(toAdd) {
    unlockTech(mutate, gameid, factions, playerFaction, toAdd);
  }

  function readyAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    readyPlanets(mutate, gameid, planets, planetNames, playerFaction);
  }

  function exhaustAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    exhaustPlanets(mutate, gameid, planets, planetNames, playerFaction);
  }

  function updatePlanet(name, updatedPlanet) {
    if (updatedPlanet.ready) {
      readyPlanets(mutate, gameid, planets, [name], playerFaction);
    } else {
      exhaustPlanets(mutate, gameid, planets, [name], playerFaction);
    }
  }

  function hasSkip(planet) {
    return planet.attributes.includes("red-skip") ||
      planet.attributes.includes("blue-skip") ||
      planet.attributes.includes('green-skip') ||
      planet.attributes.includes('yellow-skip');
  }

  function applyPlanetAttachments(planet) {
    let updatedPlanet = {...planet};
    updatedPlanet.attributes = [...planet.attributes];
    const planetAttachments = Object.values(attachments).filter((attachment) => attachment.planet === planet.name);
    planetAttachments.forEach((attachment) => {
      if (attachment.attribute.includes("skip")) {
        if (hasSkip(updatedPlanet)) {
          updatedPlanet.resources += attachment.resources;
          updatedPlanet.influence += attachment.influence;
        } else {
          updatedPlanet.attributes.push(attachment.attribute);
        }
      } else if (attachment.attribute === "all-types") {
        updatedPlanet.type = "all";
        updatedPlanet.resources += attachment.resources;
        updatedPlanet.influence += attachment.influence;
      } else {
        updatedPlanet.resources += attachment.resources;
        updatedPlanet.influence += attachment.influence;
        if (attachment.attribute && !updatedPlanet.attributes.includes(attachment.attribute)) {
          updatedPlanet.attributes.push(attachment.attribute);
        }
      }
    });
    return updatedPlanet;
  }
  
  const gamePlayer = factions[playerFaction];

  const ownedTechs = [];
  Object.entries(technologies ?? {}).forEach(([key, tech]) => {
    if (gamePlayer.techs[key]) {
      ownedTechs.push(tech);
    }
  });
  ownedTechs.sort((a, b) => {
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
  const remainingTechs = [];
  Object.entries(technologies ?? {}).forEach(([key, tech]) => {
    if (!gamePlayer.techs[key]) {
      remainingTechs.push(tech);
    }
  });

  const updatedPlanets = [];
  Object.values(planets ?? {}).forEach((planet) => {
    let updatedPlanet = {...planet};
    if ((updatedPlanet.owners ?? []).includes(playerFaction)) {
      updatedPlanet = applyPlanetAttachments(updatedPlanet);
      updatedPlanets.push(updatedPlanet);
    }
  });

  let VPs = 0;
  for (const objective of Object.values(objectives ?? {})) {
    if ((objective.scorers ?? []).includes(playerFaction)) {
      console.log(objective);
      VPs += objective.points;
    }
  }

  function remainingResources() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.ready) {
        return prev;
      }
      return prev + current.resources;
    }, 0);
  }
  function remainingInfluence() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.ready) {
        return prev;
      }
      return prev + current.influence;
    }, 0);
  }

  const strategyCard = Object.values(strategyCards ?? {}).find((card) => {
    return card.faction === playerFaction;
  });

  const orderedFactions = Object.values(factions ?? {}).sort((a, b) => a.order - b.order);

  function toggleAddPlanetMenu() {
    setShowAddPlanet(!showAddPlanet);
  }

  const maxHeight = screen.height - 420;
  return (<div className="flexColumn" style={{gap: "8px"}}>
          <Modal closeMenu={toggleAddTechMenu} visible={showAddTech} title="Research Tech"
        content={
          <AddTechList techs={remainingTechs} addTech={addTech} />
        } />
      <Modal closeMenu={toggleAddPlanetMenu} visible={showAddPlanet} title="Add Planet"
        content={
          <AddPlanetList planets={planets} addPlanet={addPlanet} />
      } />
  <div style={{ display: "flex", width: "100%", maxWidth: "500px" }}>
    {/* {strategyCard ? <div
      style={{
        display: "flex",
        alignItems: "center",
        flexBasis: "50%",
        height: "32px",
        border: `2px solid ${strategyCard.color}`,
        borderRadius: "4px",
        paddingLeft: "12px"
      }}
    >
      {strategyCard.order} {strategyCard.name}
    </div> : null} */}
    <div
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      {gamePlayer.timer}
    </div>
  </div>
  <FactionSummary faction={gamePlayer} VPs={VPs} ownedTechs={ownedTechs} ownedPlanets={updatedPlanets} />
  <div
    style={{
      width: "100%",
      maxWidth: "800px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexBasis: "100%"
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        {/* Tabs */}
        <div className="flexRow" style={{ margin: "0px 4px", borderBottom: "1px solid grey"}}>
          <Tab selectTab={setTabShown} id="techs" selectedId={tabShown} content="Techs" />
          <Tab selectTab={setTabShown} id="planets" selectedId={tabShown} content="Planets" />
          <Tab selectTab={setTabShown} id="objectives" selectedId={tabShown} content="Objectives" />
        </div>
        <TabBody id="techs" selectedId={tabShown} content={
        <div>
          <div className="flexRow" style={{height: "32px"}}>
            <button onClick={toggleAddTechMenu}>Research Tech</button>
          </div>
          <div style={{maxHeight: `${maxHeight}px`, padding: "6px", overflow: "auto"}}>
            {ownedTechs.map((tech) => {
              return <TechRow key={tech.name} tech={tech} removeTech={removeTech} />
            })}
          </div>
        </div>} />
        <TabBody id="planets" selectedId={tabShown} content={
        <div>
        <div className="flexRow" style={{height: "32px"}}>
          <button onClick={toggleAddPlanetMenu}>Add Planet</button>
          <button onClick={readyAll}>Ready All</button>
          <button onClick={exhaustAll}>Exhaust All</button>
        </div>
        <div style={{maxHeight: `${maxHeight}px`, overflow: "auto", paddingBottom: "4px"}}>
          {updatedPlanets.map((planet) => {
            return <PlanetRow key={planet.name} planet={planet} updatePlanet={updatePlanet} removePlanet={removePlanet} />;
          })}
        </div>
        </div>} />

        <TabBody id="objectives" selectedId={tabShown} content={
          <ObjectiveList objectives={objectives} faction={factions[playerFaction]} />
        } />
      </div>
    </div>
  </div>
</div>);
}

export default function GamePage() {
  const router = useRouter();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state, error: stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards, error: cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);

  if (factionsError || cardsError || stateError) {
    return (<div>Failed to load factions</div>);
  }
  if (!factions || !strategyCards || !state) {
    return (<div>Loading...</div>);
  }
  
  function swapToFaction(factionName) {
    router.push(`/game/${gameid}/${factionName}`);
    return;
  }

  let orderedFactions = [];
  let orderTitle = "";
  switch (state.phase) {
    case "SETUP":
    case "STRATEGY":
    case "AGENDA":
      orderTitle = "Speaker Order";
      orderedFactions = Object.values(factions).sort((a, b) => a.order - b.order);
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = "Initiative Order";
      const orderedCards = Object.values(strategyCards).sort((a, b) => a.order - b.order);
      for (const card of orderedCards) {
        if (card.faction) {
          orderedFactions.push(factions[card.faction]);
        }
      }
      break;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* TODO: Uncomment after putting in server-side functionality for adding/removing prompts */}
      {/* <Modal closeMenu={ignorePrompt} visible={validPrompts.length > 0} title={validPrompts[0].title}
        content={
          <Prompt prompt={validPrompts[0]} faction={gamePlayer} />
        } /> */}
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "8px 0",
          fontWeight: "normal",
        }}
      >
        Twilight Imperium Assistant
      </h2>
  <div className="flexColumn" style={{ height: "60px", width: "100%", gap: "4px", fontSize: "18px", marginBottom: "8px"}}>
    {orderTitle}
    <div className="flexRow" style={{width: "100%", alignItems: "space-evenly"}}>
      {orderedFactions.map((faction) => {
        return <BasicFactionTile faction={faction} onClick={() => swapToFaction(faction.name)} opts={{hideName: true, iconSize: 28}} />
      })}
    </div>
  </div>
      <div style={{width: "100%", margin: "4px"}}>
        <FactionCard faction={factions[playerFaction]} style={{width: "100%"}} content={<FactionContent />} />
      </div>
    </div>);
}
