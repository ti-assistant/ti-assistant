import { useRouter } from "next/router";
import { useRef, useState, useTransition } from "react";
import useSWR, { useSWRConfig } from "swr";
import { FactionSymbol } from "./FactionCard";
import { Modal } from "./Modal";
import { PlanetAttributes, PlanetRow, PlanetSymbol } from "./PlanetRow";
import { SystemRow } from "./SystemRow";
import { Resources } from "./Resources";
import { Tab, TabBody } from "./Tab";
import { TechIcon, TechRow } from "./TechRow";
import { manualVPUpdate } from "./util/api/factions";
import { claimPlanet, unclaimPlanet } from "./util/api/planets";
import { fetcher } from "./util/api/util";
import { applyAllPlanetAttachments, filterToClaimedPlanets } from "./util/planets";
import { filterToOwnedTechs, getTechColor, sortTechs } from "./util/techs";
import { pluralize } from "./util/util";
import { FactionSelectModal } from "./FactionSelectModal";
import { hasTech, lockTech, unlockTech } from "./util/api/techs";
import { ObjectiveRow } from "./ObjectiveRow";
import { removeObjective, revealObjective, scoreObjective, unscoreObjective } from "./util/api/objectives";
import { useSharedUpdateTimes } from "./Updater";

function TechList({ techs }) {
  return <div className="flexColumn" style={{alignItems: "stretch", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", whiteSpace: "nowrap", gap: "4px", border: `2px solid #333`, borderRadius: "5px"}}>
  {techs.map((tech) => <div key={tech.name} style={{color: getTechColor(tech)}}>{tech.name}</div>)}
</div>
}

export function TechSummary({ techs }) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "red":
        redTechs.push(tech);
        break;
      case "yellow":
        yellowTechs.push(tech);
        break;
      case "green":
        greenTechs.push(tech);
        break;
      case "blue":
        blueTechs.push(tech);
        break;
      case "upgrade":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder = [
    "red",
    "green",
    "blue",
    "yellow",
    "upgrade",
  ];

  techs.sort((a, b) => {
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

  return (
  <div className="flexColumn hoverParent" style={{flexBasis: "30%", flexGrow: 2, maxWidth: "120px", fontSize: "16px", height: "90px", justifyContent: "space-evenly"}}>
    <div className="hoverInfo left" style={{marginRight: "20px"}}>
      {techs.length > 0 ?
          <div className="flexColumn">
            <TechList techs={techs} />
          </div>
      : null}
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{redTechs.length}</div>
        <TechIcon type={"red"} width="21px" height="22px" />
      </div>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{greenTechs.length}</div>
        <TechIcon type={"green"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{blueTechs.length}</div>
        <TechIcon type={"blue"} width="21px" height="22px" />
      </div>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{yellowTechs.length}</div>
        <TechIcon type={"yellow"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow hoverParent" style={{width: "100%"}}>
      {upgradeTechs.length} {pluralize("Upgrade", upgradeTechs.length)}
    </div>
  </div>
  );
}

export function UpdateObjectivesModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [ factionName, setFactionName ] = useState(null);
  const { setUpdateTime } = useSharedUpdateTimes();

  if (!factions || !planets || !options || !state) {
    return <div>Loading...</div>;
  }

  if (factionName === null) {
    setFactionName(state.speaker);
    return <div>Loading...</div>;
  }

  function scoreObj(objectiveName, score) {
    if (score) {
      addObjective(objectiveName);
      scoreObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName);
    } else {
      unscoreObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName);
    }
  }

  function addObjective(objectiveName) {
    revealObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName);
  }

  function removeObj(objectiveName) {
    removeObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName);
  }

  const orderedFactionNames = Object.keys(factions ?? {}).sort();

  const sortedObjectives = Object.values(objectives ?? {}).sort((a, b) => {
    if (a.selected && !b.selected) {
      return -1;
    } else if (b.selected && !a.selected) {
      return 1;
    }
    return a.name - b.name;
  })

  const stageOneObjectives = sortedObjectives.filter((obj) => obj.type === "stage-one");
  const stageTwoObjectives = sortedObjectives.filter((obj) => obj.type === "stage-two");
  const secretObjectives = sortedObjectives.filter((obj) => obj.type === "secret");
  const otherObjectives = sortedObjectives.filter((obj) => obj.type === "other");

  let transition = {
    'stage-one': stageOneObjectives.length > 0 && stageOneObjectives[0].selected,
    'stage-two': stageTwoObjectives.length > 0 && stageTwoObjectives[0].selected,
    'secret': secretObjectives.length > 0 && secretObjectives[0].selected,
    'other': otherObjectives.length > 0 && otherObjectives[0].selected,
  };

  const innerContent = (
    <div className="flexColumn" style={{position: "sticky", minHeight: "400px", overflow: "hidden", maxHeight: "85vh"}}>
      <div className="flexColumn" style={{top: 0, height: "100%", position: "fixed", zIndex: -1, opacity: 0.2}}>
        <FactionSymbol faction={factionName} size={400} />
      </div>
      <div className="flexColumn" style={{position: "sticky", width: "100%", backgroundColor: "#222", zIndex: 902}}>
        <div className="flexRow" style={{backgroundColor: "#222", position: "sticky", zIndex: 904, fontSize: "16px", gap: "24px", margin: "8px 0px"}}>
          {orderedFactionNames.map((name) => {
            return (
              <button className={name === factionName ? "selected" : ""}
                onClick={() => setFactionName(name)}>{name}</button>

            );
          })}
        </div>
      </div>
      <div className="flexRow" style={{padding: "8px 0px", backgroundColor: "#222", position: "sticky", width: "1500px", alignItems: "flex-start", justifyContent: "space-between", zIndex: 902}}>
          <div className="flexColumn" style={{flex: "0 0 24%", fontSize: "24px"}}>Stage I</div>
          <div className="flexColumn" style={{flex: "0 0 24%", fontSize: "24px"}}>Stage II</div>
          <div className="flexColumn" style={{flex: "0 0 24%", fontSize: "24px"}}>Secret</div>
          <div className="flexColumn" style={{flex: "0 0 24%", fontSize: "24px"}}>Other</div>
      </div>
      <div className="flexRow" style={{width: "1500px", paddingBottom: "8px", alignItems: "flex-start", justifyContent: "space-between", height: "100%", overflowY: "scroll"}}>
        <div className="flexColumn" style={{flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch"}}>
          {stageOneObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['stage-one'] && !obj.selected) {
              transition['stage-one'] = false;
              return <div style={{paddingTop: "4px", borderTop: "1px solid #777"}}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch"}}>
          {stageTwoObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)}  faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['stage-two'] && !obj.selected) {
              transition['stage-two'] = false;
              return <div style={{paddingTop: "4px", borderTop: "1px solid #777"}}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /> 
          })}
        </div>
        <div className="flexColumn" style={{flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch"}}>
          {secretObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['secret'] && !obj.selected) {
              transition['secret'] = false;
              return <div style={{paddingTop: "4px", borderTop: "1px solid #777"}}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch"}}>
          {otherObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)}  faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['other'] && !obj.selected) {
              transition['other'] = false;
              return <div style={{paddingTop: "4px", borderTop: "1px solid #777"}}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
      </div>
    </div>
  );

  return <div>
    <Modal closeMenu={onComplete} title={"Score Objectives for " + factionName} visible={visible} content={innerContent} />
  </div>
}

export function UpdateTechsModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [ showFactionSelect, setShowFactionSelect ] = useState(false);

  const [ factionName, setFactionName ] = useState(null);
  const { setUpdateTime } = useSharedUpdateTimes();

  if (!factions || !techs || !options || !state) {
    return <div>Loading...</div>;
  }

  if (factionName === null) {
    setFactionName(state.speaker);
    return <div>Loading...</div>;
  }
  
  const techsObj = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (tech.faction) {
      if (factionName === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (factionName !== "Nekro Virus" && tech.faction !== factionName) {
        return;
      }
    }
    techsObj[tech.name] = tech;
  });
  if (factionName !== "Nekro Virus") {
    Object.values(techsObj).forEach((tech) => {
      if (tech.replaces) {
        delete techsObj[tech.replaces];
      }
    });
  }

  function equalizeTechListLengths(a, b) {
    while (a.length > b.length) {
      b.push({});
    }
    while (b.length > a.length) {
      a.push({});
    }
  }

  const techArr = Object.values(techsObj);
  sortTechs(techArr);
  const greenTechs = techArr.filter((tech) => tech.type === "green");
  const blueTechs = techArr.filter((tech) => tech.type === "blue");
  equalizeTechListLengths(greenTechs, blueTechs);
  const yellowTechs = techArr.filter((tech) => tech.type === "yellow");
  const redTechs = techArr.filter((tech) => tech.type === "red");
  equalizeTechListLengths(redTechs, yellowTechs);
  const upgradeTechs = techArr.filter((tech) => tech.type === "upgrade");

  function addTech(toAdd) {
    unlockTech(mutate, setUpdateTime, gameid, factions, factionName, toAdd);
  }

  function removeTech(toRemove) {
    lockTech(mutate, setUpdateTime, gameid, factions, factionName, toRemove);
  }

  function getTechRow(tech) {
    if (!tech.name) {
      return <div style={{height: "40px"}}></div>
    }
    if (hasTech(factions[factionName], tech.name)) {
      return <div key={tech.name}><TechRow tech={tech} removeTech={removeTech} /></div>;
    } else {
      return <div key={tech.name}><TechRow tech={tech} addTech={addTech} /></div>;
    }
  }

  const orderedFactionNames = Object.keys(factions).sort();

  const innerContent = (
    <div className="flexColumn" style={{position: "sticky", minHeight: "400px"}}>
      <div className="flexColumn" style={{top: 0, height: "100%", position: "fixed", zIndex: -1, opacity: 0.2}}>
        <FactionSymbol faction={factionName} size={400} />
      </div>
      <div className="flexColumn" style={{position: "sticky", width: "100%", top: "44px",  backgroundColor: "#222", zIndex: 902}}>
        <div className="flexRow" style={{backgroundColor: "#222", height: "32px", position: "sticky", zIndex: 904, top: "73px", fontSize: "16px", gap: "24px", margin: "8px 0px"}}>
          {orderedFactionNames.map((name) => {
            return (
              <button className={name === factionName ? "selected" : ""}
                onClick={() => setFactionName(name)}>{name}</button>

            );
          })}
        </div>
      </div>
      <div className="flexRow" style={{width: "1500px", height: "80vh", alignItems: "stretch", justifyContent: "space-between", gap: "20px"}}>
        <div className="flexColumn" style={{flex: "0 0 32%", gap: "20px", alignItems: "stretch", justifyContent: "flex-start"}}>
          <div className="flexColumn" style={{flex: "0 0 45%", gap: "8px", alignItems: "stretch", justifyContent: "flex-start"}}>
            <div className="flexRow" style={{gap: "8px", justifyContent: "center", fontSize: "28px"}}>
              <TechIcon type="green" width="27px" height="28px"/>
              Biotic
              <TechIcon type="green" width="27px" height="28px"/>
            </div>
            <div>
              {greenTechs.map(getTechRow)}
            </div>
          </div>
          <div className="flexColumn" style={{flex: "0 0 45%", gap: "8px", alignItems: "stretch", justifyContent: "flex-start"}}>
            <div className="flexRow" style={{gap: "8px", justifyContent: "center", fontSize: "28px"}}>
              <TechIcon type="red" width="26px" height="28px"/>
              Warfare
              <TechIcon type="red" width="26px" height="28px"/>
            </div>
            <div>
              {redTechs.map(getTechRow)}
            </div>
          </div>
        </div>
        <div className="flexColumn" style={{flex: "0 0 32%", gap: "20px", alignItems: "stretch", justifyContent: "flex-start"}}>
          <div className="flexColumn" style={{flex: "0 0 45%", gap: "8px", alignItems: "stretch", justifyContent: "flex-start"}}>
            <div className="flexRow" style={{gap: "8px", justifyContent: "center", fontSize: "28px"}}>
              <TechIcon type="blue" width="27px" height="28px"/>
              Propulsion
              <TechIcon type="blue" width="27px" height="28px"/>
            </div>
            <div>
              {blueTechs.map(getTechRow)}
            </div>
          </div>
          <div className="flexColumn" style={{flex: "0 0 45%", gap: "8px", alignItems: "stretch", justifyContent: "flex-start"}}>
            <div className="flexRow" style={{gap: "8px", justifyContent: "center", fontSize: "28px"}}>
              <TechIcon type="yellow" width="27px" height="28px"/>
              Cybernetic
              <TechIcon type="yellow" width="27px" height="28px"/>
            </div>
            <div>
              {yellowTechs.map(getTechRow)}
            </div>
          </div>
        </div>
        <div className="flexColumn" style={{flex: "0 0 32%", gap: "8px",  alignItems: "stretch"}}>
          <div className="flexColumn" style={{fontSize: "28px"}}>Unit Upgrades</div>
          <div>
            {upgradeTechs.map(getTechRow)}
          </div>
        </div>
      </div>
    </div>
  );

  return <div>
    <Modal closeMenu={onComplete} title={"Update Techs for " + factionName} visible={visible} content={innerContent} />
  </div>
}

export function UpdatePlanetsModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [ groupBySystem, setGroupBySystem ] = useState(false);
  const [ showFactionSelect, setShowFactionSelect ] = useState(false);

  const [ factionName, setFactionName ] = useState(null);
  const { setUpdateTime } = useSharedUpdateTimes();

  if (!factions || !planets || !options || !state || !attachments) {
    return <div>Loading...</div>;
  }

  if (factionName === null) {
    setFactionName(state.speaker);
  }

  function updateFaction(factionName) {
    if (factions[factionName]) {
      setFactionName(factionName);
    }
    setShowFactionSelect(false);
  }

  const updatedPlanets = applyAllPlanetAttachments(Object.values(planets ?? {}), attachments);

  const planetsArr = [];
  const planetsBySystem = [];
  updatedPlanets.forEach((planet) => {
    planetsArr.push(planet);
    if (!planet.system) {
      planetsBySystem[planet.name] = [planet];
      return;
    }
    if (!planetsBySystem[planet.system]) {
      planetsBySystem[planet.system] = [];
    }
    planetsBySystem[planet.system].push(planet);
    });
  planetsBySystem.sort((a, b) => {
    if (a[0].name < b[0].name) {
      return -1;
    }
    if (b[0].name < a[0].name) {
      return 1;
    }
    return 0;
  });

  function removePlanet(toRemove) {
    unclaimPlanet(mutate, setUpdateTime, gameid, planets, toRemove, factionName);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, setUpdateTime, gameid, planets, toAdd, factionName, options);
  }

  const orderedFactionNames = Object.keys(factions).sort();

  const innerContent = (
    <div className="flexColumn" style={{position: "sticky", minHeight: "400px", maxHeight: "85vh"}}>
      <div className="flexColumn" style={{top: 0, height: "100%", position: "fixed", zIndex: -1, opacity: 0.2}}>
        <FactionSymbol faction={factionName} size={400} />
      </div>
      <div className="flexColumn" style={{position: "sticky", width: "100%", top: "44px", zIndex: 902,  backgroundColor: "#222"}}>
        <div className="flexRow" style={{backgroundColor: "#222", height: "32px", position: "sticky", zIndex: 904, top: "73px", fontSize: "16px", gap: "24px", margin: "8px 0px"}}>
        {orderedFactionNames.map((name) => {
            return (
              <button className={name === factionName ? "selected" : ""}
                onClick={() => setFactionName(name)}>{name}</button>
            );
          })}
          <button className={groupBySystem ? "selected" : ""} onClick={() => setGroupBySystem(!groupBySystem)}>
            Group By System
          </button>
        </div>
      </div>
        <div className="flexRow" style={{width: "1600px", flexWrap: "wrap", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", overflowY: "scroll"}}>
          {groupBySystem ? 
            planetsBySystem.map((system, systemName) => {
              let allControlled = true;
              system.forEach((planet) => {
                if (!(planet.owners ?? []).includes(factionName)) {
                  allControlled = false;
                }
              });
              if (allControlled) {
                return <div key={systemName} className="flexColumn" style={{alignItems: "flex-start", flex: "0 0 25%", borderBottom: "1px solid #777"}}><SystemRow factionName={factionName} planets={system} removePlanet={removePlanet} /></div>;
              } else {
                return <div key={systemName} className="flexColumn" style={{alignItems: "flex-start", flex: "0 0 25%", borderBottom: "1px solid #777"}}><SystemRow factionName={factionName} planets={system} addPlanet={addPlanet} /></div>;
              }
            }) :
            planetsArr.map((planet) => {
              if ((planet.owners ?? []).includes(factionName)) {
                return <div key={planet.name} style={{flex: "0 0 25%"}}><PlanetRow factionName={factionName} planet={planet} removePlanet={removePlanet} updatePlanet={() => {}} opts={{showSelfOwned: true}} /></div>;
              } else {
                return <div key={planet.name} style={{flex: "0 0 25%"}}><PlanetRow factionName={factionName} planet={planet} addPlanet={addPlanet} updatePlanet={() => {}} opts={{showSelfOwned: true}} /></div>;
              }
            })
          }
        </div>
    </div>
  );

  return <div>
    <Modal closeMenu={onComplete} title={"Update Planets for " + factionName} visible={visible} content={innerContent} />
  </div>
}

export function PlanetSummary({ planets, factionName, options = {} }) {
  let resources = 0;
  let influence = 0;
  let cultural = 0;
  let hazardous = 0;
  let industrial = 0;
  const skips = [];
  for (const planet of planets) {
    if (planet.ready || options.total) {
      resources += planet.resources;
      influence += planet.influence;
      for (const attribute of planet.attributes) {
        if (attribute.includes("skip")) {
          skips.push(attribute);
        }
      }
    }
    switch (planet.type) {
      case "Cultural":
        ++cultural;
        break;
      case "Industrial":
        ++industrial;
        break;
      case "Hazardous":
        ++hazardous;
        break;
    }
    if (planet.attributes.includes("all-types")) {
      ++cultural;
      ++industrial;
      ++hazardous;
    }
  }

  return (
  <div className="flexColumn" style={{flexBasis: "30%", flexGrow: 2, maxWidth: "120px"}}>
    <div className="flexRow">
      <Resources
        resources={resources}
        influence={influence}
      />
      <PlanetAttributes attributes={skips} />
    </div>
    <div className="flexRow" style={{fontSize: "16px", width: "100%"}}>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div className="flexColumn" style={{flexBasis: "15%"}}>{cultural}</div>
        <PlanetSymbol type={"Cultural"} size="18px" />
      </div>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div>{hazardous}</div>
        <PlanetSymbol type={"Hazardous"} size="18px" />
      </div>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div>{industrial}</div>
        <PlanetSymbol type={"Industrial"} size="18px" />
      </div>
    </div>
  </div>
  );
}

export function FactionSummary({ factionName, options={} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: techs, error: techsError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { setUpdateTime } = useSharedUpdateTimes();

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (planetsError) {
    return (<div>Failed to load planets</div>);
  }
  if (techsError) {
    return (<div>Failed to load technologies</div>);
  }
  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }

  const faction = factions[factionName] ?? {};

  const ownedTechs = filterToOwnedTechs(techs, faction);

  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const VPs = (faction.vps ?? 0) + Object.values(objectives ?? {}).filter((objective) => {
    return (objective.scorers ?? []).includes(factionName);
  }).reduce((total, objective) => {
    const count = objective.scorers.reduce((count, scorer) => {
      if (scorer === factionName) {
        return count + 1;
      }
      return count;
    }, 0);
    return total + (count * objective.points);
  }, 0);

  function manualVpAdjust(increase) {
    const value = increase ? 1 : -1;
    manualVPUpdate(mutate, setUpdateTime, gameid, factions, factionName, value);
  }

  return (
    <div className="flexRow" style={{width: "100%", maxWidth: "800px", padding: "4px 0px", position: "relative"}}>
      {options.showIcon ? <div className="flexColumn" style={{position: "absolute", zIndex: -1, opacity: 0.5}}>
        <FactionSymbol faction={factionName} size={90} />
      </div> : null}
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
      <div className="flexColumn" style={{flexBasis: "30%", height: "91px", fontSize: "28px"}}>
        <div className="flexRow" style={{gap: "4px", fontSize: "40px"}}>
          {VPs > 0 ? <div className="arrowDown" onClick={() => manualVpAdjust(false)}></div> : <div style={{width: "12px"}}></div>}
          <div className="flexRow" style={{width: "32px"}}>{VPs}</div>
          <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
        </div>
        <div style={{fontSize: "28px"}}>{pluralize('VP', VPs)}</div>
      </div>
      {options.hidePlanets ? null : <PlanetSummary planets={updatedPlanets} factionName={factionName} options={options} />}
    </div>);
}