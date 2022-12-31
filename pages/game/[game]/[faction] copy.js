import { useEffect, useRef, useState } from "react";
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
import { FactionTimer } from "../../../src/Timer";
import { applyAllPlanetAttachments, filterToClaimedPlanets } from "../../../src/util/planets";
import { filterToOwnedTechs, filterToUnownedTechs, sortTechs } from "../../../src/util/techs";
import { useSharedUpdateTimes } from "../../../src/Updater";

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
  const startingTechs = filterToStartingTechs(techs, faction);
  sortTechs(startingTechs);
  // const orderedTechs = (startswith.techs ?? []).map((tech) => {
  //   return techs[tech];
  // }).sort((a, b) => {
  //   const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
  //   if (typeDiff !== 0) {
  //     return typeDiff;
  //   }
  //   const prereqDiff = a.prereqs.length - b.prereqs.length;
  //   if (prereqDiff !== 0) {
  //     return prereqDiff;
  //   }
  //   if (a.name < b.name) {
  //     return -1;
  //   } else {
  //     return 1;
  //   }
  // });
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
          {startingTechs.map((tech) => {
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

function FactionContent() {
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState("planets");
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: techs, error: techsError } = useSWR(gameid && playerFaction ? `/api/${gameid}/techs` : null, fetcher);
  const { data: strategyCards, error: cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: options, error: optionsError } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

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

  const ownedPlanets = filterToClaimedPlanets(planets, playerFaction);

  function toggleAddTechMenu() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(toRemove) {
    unclaimPlanet(mutate, gameid, planets, toRemove, playerFaction);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, gameid, planets, toAdd, playerFaction, options);
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
  
  const faction = factions[playerFaction];

  const techsObj = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (tech.faction) {
      if (playerFaction === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (playerFaction !== "Nekro Virus" && tech.faction !== playerFaction) {
        return;
      }
    }
    techsObj[tech.name] = tech;
  });
  if (playerFaction !== "Nekro Virus") {
    Object.values(techsObj).forEach((tech) => {
      if (tech.replaces) {
        delete techsObj[tech.replaces];
      }
    });
  }


  const ownedTechs = filterToOwnedTechs(techsObj, faction);
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
  const remainingTechs = filterToUnownedTechs(techsObj, faction);

  const claimedPlanets = filterToClaimedPlanets(planets, playerFaction);
  const updatedPlanets = applyAllPlanetAttachments(claimedPlanets, attachments);

  let VPs = 0;
  for (const objective of Object.values(objectives ?? {})) {
    if ((objective.scorers ?? []).includes(playerFaction)) {
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

  function allPlanetsExhausted() {
    for (const planet of updatedPlanets) {
      if (planet.ready) {
        return false;
      }
    }
    return true;
  }

  function allPlanetsReady() {
    for (const planet of updatedPlanets) {
      if (!planet.ready) {
        return false;
      }
    }
    return true;
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
  <FactionSummary factionName={playerFaction} VPs={VPs} ownedTechs={ownedTechs} ownedPlanets={updatedPlanets} />
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
          <div className="flexColumn" style={{gap: "8px", maxHeight: `${maxHeight}px`, padding: "6px", overflow: "auto", justifyContent: "space-between", alignItems: "stretch"}}>
            {ownedTechs.map((tech) => {
              return <TechRow key={tech.name} tech={tech} removeTech={removeTech} />
            })}
          </div>
        </div>} />
        <TabBody id="planets" selectedId={tabShown} content={
        <div>
        <div className="flexRow" style={{height: "32px"}}>
          <button onClick={toggleAddPlanetMenu}>Add Planet</button>
          <button onClick={readyAll} disabled={allPlanetsReady()}>Ready All</button>
          <button onClick={exhaustAll} disabled={allPlanetsExhausted()}>Exhaust All</button>
        </div>
        <div style={{maxHeight: `${maxHeight}px`, overflow: "auto", paddingBottom: "4px"}}>
          {updatedPlanets.map((planet) => {
            return <PlanetRow key={planet.name} factionName={playerFaction} planet={planet} updatePlanet={updatePlanet} removePlanet={removePlanet} opts={{showAttachButton: true}} />;
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

  if (!factions[playerFaction]) {
    router.push(`/game/${gameid}`);
    return
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
      <div className="flexColumn" style={{width: "100%", maxWidth: "800px"}}>
      {/* TODO: Uncomment after putting in server-side functionality for adding/removing prompts */}
      {/* <Modal closeMenu={ignorePrompt} visible={validPrompts.length > 0} title={validPrompts[0].title}
        content={
          <Prompt prompt={validPrompts[0]} faction={faction} />
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
        return <BasicFactionTile key={faction.name} faction={faction} onClick={() => swapToFaction(faction.name)} opts={{hideName: true, iconSize: 28}} />
      })}
    </div>
  </div>
      <div style={{width: "100%", margin: "4px"}}>
        <FactionCard faction={factions[playerFaction]} style={{width: "100%"}} content={<FactionContent />} />
      </div>
      </div>
    </div>);
}
