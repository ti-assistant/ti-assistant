import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { AddPlanetList } from "/src/AddPlanetList.js";
import { AddTechList } from "/src/AddTechList.js";
import { Resources } from "/src/Resources.js";
import { PlanetRow } from "/src/PlanetRow.js";
import { TechRow } from "/src/TechRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { Modal } from "/src/Modal.js";
import useSWR, { useSWRConfig } from 'swr'
import { ObjectiveList } from "/src/ObjectiveList";
import { fetcher, poster } from '../../../src/util/api/util';
import { pluralize } from "../../../src/util/util";

const techOrder = [
  "green",
  "blue",
  "yellow",
  "red",
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

export default function GamePage() {
  const [player, setPlayer] = useState({});
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState("planets");
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: faction, error: factionError } = useSWR(gameid && playerFaction ? `/api/${gameid}/factions/${playerFaction}` : null, fetcher);
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, error: objectivesError } = useSWR("/api/objectives", fetcher);
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets?faction=${playerFaction}` : null, fetcher);
  const { data: technologies, error: techsError } = useSWR(gameid && playerFaction ? `/api/${gameid}/techs?faction=${playerFaction}` : null, fetcher);

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (factionError) {
    return (<div>Failed to load faction</div>);
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
  if (!attachments || !faction || !objectives || !planets || !technologies) {
    return (<div>Loading...</div>);
  }

  const ownedPlanets = [];
  Object.values(planets).forEach((planet) => {
    if ((planet.owners ?? []).includes(playerFaction)) {
      ownedPlanets.push(planet);
    }
  });

  function toggleAddTechMenu() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(toRemove) {
    const data = {
      action: "REMOVE_PLANET",
      faction: playerFaction,
      planet: toRemove,
    };

    const updatedPlanets = {...planets};

    delete updatedPlanets[toRemove].owner;

    const options = {
      optimisticData: updatedPlanets,
    };

    mutate(`/api/${gameid}/planets?faction=${playerFaction}`, poster(`/api/${gameid}/planetUpdate`, data), options);
  }

  function addPlanet(toAdd) {
    const data = {
      action: "ADD_PLANET",
      faction: playerFaction,
      planet: toAdd,
    };

    const updatedPlanets = {...planets};

    updatedPlanets[toAdd].owner = playerFaction;
    updatedPlanets[toAdd].ready = false;

    const options = {
      optimisticData: updatedPlanets,
    };

    mutate(`/api/${gameid}/planets?faction=${playerFaction}`, poster(`/api/${gameid}/planetUpdate`, data), options);
  }
  
  function removeTech(toRemove) {
    const data = {
      action: "REMOVE_TECH",
      faction: playerFaction,
      tech: toRemove,
    };

    const updatedFaction = {...faction};
    const newString = toRemove.replace(" Ω", "");

    delete updatedFaction.techs[newString];

    const options = {
      optimisticData: updatedFaction,
    };

    mutate(`/api/${gameid}/factions/${playerFaction}`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  function addTech(toAdd) {
    console.log(newString);
    const data = {
      action: "ADD_TECH",
      faction: playerFaction,
      tech: toAdd,
    };

    const updatedFaction = {...faction};
    const newString = toAdd.replace(" Ω", "");

    updatedFaction.techs[newString] = {
      ready: true,
    };

    const options = {
      optimisticData: updatedFaction,
    };

    mutate(`/api/${gameid}/factions/${playerFaction}`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  function readyAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    const data = {
      action: "TOGGLE_PLANET",
      faction: playerFaction,
      planets: planetNames,
      ready: true,
    };

    let updatedPlanets = {...planets};

    planetNames.forEach((name) => {
      updatedPlanets[name].ready = true;
    });

    const options = {
      optimisticData: updatedPlanets,
    };

    mutate(`/api/${gameid}/planets?faction=${playerFaction}`, poster(`/api/${gameid}/planetUpdate`, data), options);
  }

  function exhaustAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    const data = {
      action: "TOGGLE_PLANET",
      faction: playerFaction,
      planets: planetNames,
      ready: false,
    };

    let updatedPlanets = {...planets};

    planetNames.forEach((name) => {
      updatedPlanets[name].ready = false;
    });

    const options = {
      optimisticData: updatedPlanets,
    };

    mutate(`/api/${gameid}/planets?faction=${playerFaction}`, poster(`/api/${gameid}/planetUpdate`, data), options);
  }

  function updatePlanet(name, updatedPlanet) {
    const data = {
      action: "TOGGLE_PLANET",
      faction: playerFaction,
      planets: [name],
      ready: updatedPlanet.ready,
    };

    let updatedPlanets = {...planets};

    planets[name].ready = updatedPlanet.ready;

    const options = {
      optimisticData: updatedPlanets,
    };

    mutate(`/api/${gameid}/planets?faction=${playerFaction}`, poster(`/api/${gameid}/planetUpdate`, data), options);
  }

  function updateTech(name, updatedTech) {
    const techs = player.technologies.map((tech) => {
      if (tech.name === name) {
        return {
          ...tech,
          ready: updatedTech.ready,
        };
      }
      return tech;
    });
    setPlayer({
      ...player,
      technologies: techs
    });
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

  const gamePlayer = faction;

  const ownedTechs = [];
  Object.entries(technologies).forEach(([key, tech]) => {
    if (gamePlayer.techs[key]) {
      ownedTechs.push(tech);
    }
  });
  const remainingTechs = [];
  Object.entries(technologies).forEach(([key, tech]) => {
    if (!gamePlayer.techs[key]) {
      remainingTechs.push(tech);
    }
  });

  const updatedPlanets = [];
  Object.values(planets).forEach((planet) => {
    let updatedPlanet = {...planet};
    if ((updatedPlanet.owners ?? []).includes(playerFaction)) {
      updatedPlanet = applyPlanetAttachments(updatedPlanet);
      updatedPlanets.push(updatedPlanet);
    }
  });

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

  function toggleAddPlanetMenu() {
    setShowAddPlanet(!showAddPlanet);
  }

  const maxHeight = screen.height - 330;

  const validPrompts = (faction.prompts ?? []).filter((prompt) => {
    return !prompt.ignored;
  });
  
  function ignorePrompt() {
    // TODO: Ignore prompt. Decide whether to remind the player later or not.
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Modal closeMenu={toggleAddTechMenu} visible={showAddTech} title="Research Tech"
        content={
          <AddTechList techs={remainingTechs} addTech={addTech} />
        } />
      <Modal closeMenu={toggleAddPlanetMenu} visible={showAddPlanet} title="Add Planet"
        content={
          <AddPlanetList planets={planets} addPlanet={addPlanet} />
      } />
      {/* TODO: Uncomment after putting in server-side functionality for adding/removing prompts */}
      {/* <Modal closeMenu={ignorePrompt} visible={validPrompts.length > 0} title={validPrompts[0].title}
        content={
          <Prompt prompt={validPrompts[0]} faction={gamePlayer} />
        } /> */}
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        Twilight Imperium Assistant
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {playerFaction}
      </div>
      <div style={{ display: "flex", width: "100%", maxWidth: "500px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexBasis: "50%",
            height: "30px",
            backgroundColor: "yellow",
            marginRight: "20px"
          }}
        >
          4: Construction
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          {player.timer}
        </div>
      </div>
      {player.active_player ? "Active Player" : null}
      {player.on_deck ? "Up Next" : null}
      <div style={{ height: "60px" }}>Player Order Block</div>
      <div style={{ display: "flex", border: "1px solid green" }}>
        Player Summary Block
        <Resources
          resources={remainingResources()}
          influence={remainingInfluence()}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {/* <div
          style={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexBasis: "50%",
            padding: "8px"
          }}
        >
          <b style={{ marginBottom: "8px" }}>Technologies</b>
          <button onClick={toggleAddTech}>+</button>
          {player.technologies.map((tech) => {
            return (
              <div
                key={tech.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  flexBasis: "50%",
                  marginBottom: "4px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "grey",
                      cursor: "pointer"
                    }}
                    onClick={() => removeTech(tech.name)}
                  >
                    X
                  </div>
                  <span
                    style={{
                      flexBasis: "80%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {tech.name}
                  </span>
                </div>
                <div style={{ display: "flex" }}>
                  {tech.canExhaust ? (
                    <button
                      style={{ marginLeft: "4px" }}
                      onClick={() => exhaustTech(tech.name)}
                    >
                      Exhaust
                    </button>
                  ) : null}
                  {!tech.ready ? (
                    <button onClick={() => readyTech(tech.name)}>Ready</button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid grey",
            flexBasis: "100%"
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            {/* Tabs */}
            <div className="flexRow" style={{ margin: "0px 4px", borderBottom: "1px solid grey"}}>
              <Tab selectTab={setTabShown} id="techs" selectedId={tabShown} content={
                <b style={{ textAlign: "center", margin: "4px" }}>Techs</b>
              } />
              <Tab selectTab={setTabShown} id="planets" selectedId={tabShown} content={
                <b style={{ textAlign: "center", margin: "4px" }}>Planets</b>
              } />
              <Tab selectTab={setTabShown} id="objectives" selectedId={tabShown} content={
                <b style={{ textAlign: "center", margin: "4px" }}>Objectives</b>
              } />
            </div>
            <TabBody id="techs" selectedId={tabShown} content={
            <div>
              <div className="flexRow" style={{height: "32px"}}>
                <button onClick={toggleAddTechMenu}>Research Tech</button>
              </div>
              <div style={{maxHeight: `${maxHeight}px`, padding: "4px", overflow: "auto"}}>
                {ownedTechs.map((tech) => {
                  return <TechRow key={tech.name} tech={tech} updateTech={updateTech} removeTech={removeTech} />
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
              <ObjectiveList objectives={objectives} faction={player.faction} />
            } />
          </div>
        </div>
      </div>
    </div>
  );
}
