import { useEffect, useState } from "react";
import { AddPlanetList } from "/src/AddPlanetList.js";
import { Resources } from "/src/Resources.js";
import { PlanetRow } from "/src/PlanetRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { Modal } from "/src/Modal.js";
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  console.log(data);
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};


const allTech = [
  {
    name: "Gravity Drive",
    canExhaust: false
  },
  {
    name: "Sling Relay",
    canExhaust: true
  },
  {
    name: "Sarween Tools",
    canExhaust: false
  }
];

export default function GamePage() {
  let initial_player = {
    faction: "Universities of Jol'Nar",
    strategy_card: {
      name: "Construction",
      order: 4
    },
    timer: "01:30:00",
    active_player: true,
    technologies: [
      {
        name: "Gravity Drive",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Sling Relay",
        canExhaust: true,
        isReady: false
      },
      {
        name: "Sarween Tools",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Neural Motivator",
        canExhaust: false,
        isReady: true
      },
      {
        name: "War Sun",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Carrier II",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Magen Defense Grid",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Light/Wave Deflector",
        canExhaust: false,
        isReady: true
      },
      {
        name: "Integrated Economy",
        canExhaust: true,
        isReady: true
      },
      {
        name: "Dreadnaught II",
        canExhaust: false,
        isReady: true
      }
    ],
    planets: [
      {
        name: "Lodor",
        resources: 3,
        influence: 1,
        isReady: true,
        type: "Cultural",
        home: false,
        attributes: [],
        attachments: ["Demilitarized Zone", "Dyson Sphere"]
      },
      {
        name: "New Albion",
        resources: 2,
        influence: 1,
        isReady: true,
        type: "Hazardous",
        home: false,
        attributes: [],
        attachments: []
      },
      {
        name: "Mecatol Rex",
        resources: 1,
        influence: 6,
        isReady: true,
        attributes: [],
        home: false,
        type: "none",
        attachments: []
      },
      {
        name: "Archon Vail",
        resources: 2,
        influence: 1,
        isReady: false,
        type: "Industrial",
        home: false,
        attributes: [],
        attachments: []
      },
      {
        name: "Dal Bootha",
        resources: 4,
        influence: 1,
        isReady: false,
        type: "Industrial",
        home: false,
        attributes: [],
        attachments: []
      },
      {
        name: "Avar",
        resources: 1,
        influence: 1,
        isReady: true,
        type: "None",
        home: true,
        attributes: [],
        attachments: []
      }
    ]
  };

  const [player, setPlayer] = useState(initial_player);
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState("planets");
  const { data: attachments, error: attachmentsError } = useSWR("/api/attachments", fetcher);
  const { data: planets, error: planetsError } = useSWR("/api/planets", fetcher);

  if (planetsError) {
    return (<div>Failed to load planets</div>);
  }
  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (!attachments || !planets) {
    return (<div>Loading...</div>);
  }

  function removeTech(remove) {
    let techs = player.technologies.filter((tech) => tech.name !== remove);
    setPlayer({
      ...player,
      technologies: techs
    });
  }

  function toggleAddTech() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(remove) {
    let planets = player.planets.filter((planet) => planet.name !== remove);
    setPlayer({
      ...player,
      planets: planets
    });
  }

  function addPlanet(add) {
    const planet = planets.find((value) => value.name === add);
    setPlayer({
      ...player,
      planets: [...player.planets, {...planet, isReady: false}], 
    });
  }

  function readyAll() {
    setPlayer({
      ...player,
      planets: player.planets.map((planet) => {
        return {
          ...planet,
          isReady: true,
        };
      })
    });
  }
  function exhaustAll() {
    setPlayer({
      ...player,
      planets: player.planets.map((planet) => {
        return {
          ...planet,
          isReady: false,
        };
      })
    });
  }

  function exhaustPlanet(name) {
    let planets = player.planets.map((planet) => {
      if (planet.name === name) {
        return {
          ...planet,
          isReady: false
        };
      }
      return planet;
    });
    setPlayer({
      ...player,
      planets: planets
    });
  }

  function readyPlanet(name) {
    let planets = player.planets.map((planet) => {
      if (planet.name === name) {
        return {
          ...planet,
          isReady: true
        };
      }
      return planet;
    });
    setPlayer({
      ...player,
      planets: planets
    });
  }

  function updatePlanet(name, updatedPlanet) {
    let planets = player.planets.map((planet) => {
      if (planet.name === name) {
        return {
          ...planet,
          attachments: updatedPlanet.attachments,
          isReady: updatedPlanet.isReady,
        };
      }
      return planet;
    });
    setPlayer({
      ...player,
      planets: planets
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
    planet.attachments.forEach((name) => {
      const attachment = attachments[name];
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
        if (attachment.attribute) {
          updatedPlanet.attributes.push(attachment.attribute);
        }
      }
    });
    return updatedPlanet;
  }

  const updatedPlanets = player.planets.map(applyPlanetAttachments);

  const remainingPlanets = planets.filter((planet) => {
    return player.planets.findIndex((ownedPlanet) => ownedPlanet.name === planet.name) === -1;
  });

  function remainingResources() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.isReady) {
        return prev;
      }
      return prev + current.resources;
    }, 0);
  }
  function remainingInfluence() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.isReady) {
        return prev;
      }
      return prev + current.influence;
    }, 0);
  }

  function toggleAddPlanetMenu() {
    setShowAddPlanet(!showAddPlanet);
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Modal closeMenu={toggleAddPlanetMenu} visible={showAddPlanet} title="Add Planet"
        content={
          <AddPlanetList planets={remainingPlanets} addPlanet={addPlanet} />
      } />
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
        {player.faction}
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
          {player.strategy_card.order}: {player.strategy_card.name}
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
                  {!tech.isReady ? (
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
            <div className="flexRow" style={{ margin: "0px 4px", borderBottom: "1px solid black"}}>
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
              Technologies
            </div>} />
            <TabBody id="planets" selectedId={tabShown} content={
            <div>
            <div className="flexRow" style={{height: "32px"}}>
              <button onClick={toggleAddPlanetMenu}>Add Planet</button>
              <button onClick={readyAll}>Ready All</button>
              <button onClick={exhaustAll}>Exhaust All</button>
            </div>
            <div>
              {updatedPlanets.map((planet) => {
                return <PlanetRow key={planet.name} planet={planet} updatePlanet={updatePlanet} removePlanet={removePlanet} />;
              })}
            </div>
            </div>} />

            <TabBody id="objectives" selectedId={tabShown} content={
            <div>
              Objectives
            </div>} />
          </div>
        </div>
      </div>
    </div>
  );
}
