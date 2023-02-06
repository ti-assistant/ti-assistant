import { useRouter } from "next/router";
import { useRef, useState, useTransition } from "react";
import useSWR, { useSWRConfig } from "swr";
import { FullFactionSymbol } from "./FactionCard";
import { Modal } from "./Modal";
import { FullPlanetSymbol, PlanetAttributes, PlanetRow, PlanetSymbol } from "./PlanetRow";
import { SystemRow } from "./SystemRow";
import { Resources, ResponsiveResources } from "./Resources";
import { FullTechIcon, TechIcon, TechRow, WrappedTechIcon } from "./TechRow";
import { manualVPUpdate } from "./util/api/factions";
import { claimPlanet, unclaimPlanet } from "./util/api/planets";
import { fetcher } from "./util/api/util";
import { applyAllPlanetAttachments, filterToClaimedPlanets } from "./util/planets";
import { filterToOwnedTechs, getTechColor, sortTechs } from "./util/techs";
import { pluralize, responsivePixels } from "./util/util";
import { hasTech, lockTech, unlockTech } from "./util/api/techs";
import { ObjectiveRow } from "./ObjectiveRow";
import { removeObjective, revealObjective, scoreObjective, unscoreObjective } from "./util/api/objectives";
import { useSharedUpdateTimes } from "./Updater";
import React from "react";
import { getFactionColor, getFactionName } from "./util/factions";
import { LabeledDiv } from "./LabeledDiv";

function TechList({ techs }) {
  return <div className="flexColumn" style={{ alignItems: "stretch", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", whiteSpace: "nowrap", gap: "4px", border: `2px solid #333`, borderRadius: "5px" }}>
    {techs.map((tech) => <div key={tech.name} style={{ color: getTechColor(tech) }}>{tech.name}</div>)}
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
    <div className="flexColumn" style={{ gap: responsivePixels(4), fontSize: responsivePixels(12), justifyContent: "space-evenly" }}>
      {/* <div className="hoverInfo left" style={{marginRight: "20px"}}>
      {techs.length > 0 ?
          <div className="flexColumn">
            <TechList techs={techs} />
          </div>
      : null}
    </div> */}
      <div className="flexRow" style={{ width: "100%" }}>
        <div className="flexRow hoverParent" style={{ gap: responsivePixels(3), flexBasis: "50%", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}>{redTechs.length}</div>
          <div style={{ position: "relative", height: responsivePixels(16), width: responsivePixels(18) }}>
            <FullTechIcon type={"red"} />
          </div>
        </div>
        <div className="flexRow hoverParent" style={{ gap: responsivePixels(3), flexBasis: "50%", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}>{greenTechs.length}</div>
          <div style={{ position: "relative", height: responsivePixels(16), width: responsivePixels(18) }}>
            <FullTechIcon type={"green"} />
          </div>
        </div>
      </div>
      <div className="flexRow" style={{ width: "100%" }}>
        <div className="flexRow hoverParent" style={{ gap: responsivePixels(3), flexBasis: "50%", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}>{blueTechs.length}</div>
          <div style={{ position: "relative", height: responsivePixels(16), width: responsivePixels(18) }}>
            <FullTechIcon type={"blue"} />
          </div>
        </div>
        <div className="flexRow hoverParent" style={{ gap: responsivePixels(3), flexBasis: "50%", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}>{yellowTechs.length}</div>
          <div style={{ position: "relative", height: responsivePixels(16), width: responsivePixels(18) }}>
            <FullTechIcon type={"yellow"} />
          </div>
        </div>
      </div>
      <div className="flexRow hoverParent" style={{ width: "100%", minWidth: responsivePixels(80), fontSize: responsivePixels(14) }}>
        {upgradeTechs.length} {pluralize("Upgrade", upgradeTechs.length)}
      </div>
    </div>
  );
}

export function UpdateObjectives({ }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [factionName, setFactionName] = useState(null);


  if (!factions || !planets || !options || !state) {
    return null;
  }

  if (factionName === null) {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
  }

  function scoreObj(objectiveName, score) {
    if (score) {
      addObjective(objectiveName);
      scoreObjective(mutate, gameid, factionName, objectiveName);
    } else {
      unscoreObjective(mutate, gameid, factionName, objectiveName);
    }
  }

  function addObjective(objectiveName) {
    revealObjective(mutate, gameid, factionName, objectiveName);
  }

  function removeObj(objectiveName) {
    removeObjective(mutate, gameid, factionName, objectiveName);
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

  return (
    <div className="flexColumn" style={{ width: "100%", height: "100%" }}>
      <div style={{ fontSize: responsivePixels(24), marginTop: responsivePixels(8) }}>Score objectives for {getFactionName(factions[factionName])}</div>
      <div className="flexColumn" style={{ top: 0, height: "100%", width: "100%", position: "absolute", zIndex: -1, opacity: 0.2 }}>
        <div className="flexColumn" style={{ position: "relative", height: responsivePixels(240), width: responsivePixels(240) }}>
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div className="flexRow" style={{ flexWrap: "wrap", backgroundColor: "#222", zIndex: 904, fontSize: responsivePixels(14) }}>
        {orderedFactionNames.map((name) => {
          return (
            <button key={name} className={name === factionName ? "selected" : ""} style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}>{name}</button>

          );
        })}
      </div>
      <div className="flexRow" style={{ width: "100%", padding: `${responsivePixels(8)} 0px`, backgroundColor: "#222", position: "sticky", alignItems: "flex-start", justifyContent: "space-between", zIndex: 902 }}>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}>Stage I</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}>Stage II</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}>Secret</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}>Other</div>
      </div>
      <div className="flexRow smallFont" style={{ boxSizing: "border-box", padding: responsivePixels(8), alignItems: "flex-start", justifyContent: "space-between", height: "100%", width: "100%", overflowY: "scroll" }}>
        <div className="flexColumn" style={{ flex: "0 0 24%", gap: responsivePixels(8), justifyItems: "flex-start", alignItems: "stretch" }}>
          {stageOneObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={scorers.length === 0 ? () => removeObj(obj.name) : null} />
            }
            if (transition['stage-one'] && !obj.selected) {
              transition['stage-one'] = false;
              return <div key={obj.name} style={{ paddingTop: responsivePixels(4), borderTop: `${responsivePixels(1)} solid #777` }}><ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", justifyItems: "flex-start", alignItems: "stretch" }}>
          {stageTwoObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={scorers.length === 0 ? () => removeObj(obj.name) : null} />
            }
            if (transition['stage-two'] && !obj.selected) {
              transition['stage-two'] = false;
              return <div key={obj.name} style={{ paddingTop: responsivePixels(8), borderTop: `${responsivePixels(1)} solid #777` }}><ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", justifyItems: "flex-start", alignItems: "stretch" }}>
          {secretObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={scorers.length === 0 ? () => removeObj(obj.name) : null} />
            }
            if (transition['secret'] && !obj.selected) {
              transition['secret'] = false;
              return <div key={obj.name} style={{ paddingTop: responsivePixels(4), borderTop: `${responsivePixels(1)} solid #777` }}><ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", justifyItems: "flex-start", alignItems: "stretch" }}>
          {otherObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={scorers.length === 0 ? () => removeObj(obj.name) : null} />
            }
            if (transition['other'] && !obj.selected) {
              transition['other'] = false;
              return <div key={obj.name} style={{ paddingTop: responsivePixels(4), borderTop: `${responsivePixels(1)} solid #777` }}><ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
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

  const [factionName, setFactionName] = useState(null);



  if (!factions || !planets || !options || !state) {
    return null;
  }

  if (factionName === null) {
    setFactionName(state.speaker);
    return null;
  }

  function scoreObj(objectiveName, score) {
    if (score) {
      addObjective(objectiveName);
      scoreObjective(mutate, gameid, fa ctionName, objectiveName);
    } else {
      unscoreObjective(mutate, gameid, factionName, objectiveName);
    }
  }

  function addObjective(objectiveName) {
    revealObjective(mutate, gameid, factionName, objectiveName);
  }

  function removeObj(objectiveName) {
    removeObjective(mutate, gameid, factionName, objectiveName);
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
    <div className="flexColumn" style={{ position: "sticky", minHeight: "400px", overflow: "hidden", maxHeight: "85vh" }}>
      <div className="flexColumn" style={{ top: 0, height: "100%", width: "100%", position: "absolute", zIndex: -1, opacity: 0.2 }}>
        <div className="flexColumn" style={{ position: "relative", height: responsivePixels(240), width: responsivePixels(240) }}>
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div className="flexColumn" style={{ position: "sticky", width: "100%", backgroundColor: "#222", zIndex: 902 }}>
        <div className="flexRow" style={{ backgroundColor: "#222", position: "sticky", zIndex: 904, fontSize: "16px", gap: "24px", margin: "8px 0px" }}>
          {orderedFactionNames.map((name) => {
            return (
              <button className={name === factionName ? "selected" : ""}
                onClick={() => setFactionName(name)}>{name}</button>

            );
          })}
        </div>
      </div>
      <div className="flexRow" style={{ padding: "8px 0px", backgroundColor: "#222", position: "sticky", width: "1500px", alignItems: "flex-start", justifyContent: "space-between", zIndex: 902 }}>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: "24px" }}>Stage I</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: "24px" }}>Stage II</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: "24px" }}>Secret</div>
        <div className="flexColumn" style={{ flex: "0 0 24%", fontSize: "24px" }}>Other</div>
      </div>
      <div className="flexRow" style={{ width: "1500px", paddingBottom: "8px", alignItems: "flex-start", justifyContent: "space-between", height: "100%", overflowY: "scroll" }}>
        <div className="flexColumn" style={{ flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch" }}>
          {stageOneObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow key={obj.name} objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['stage-one'] && !obj.selected) {
              transition['stage-one'] = false;
              return <div style={{ paddingTop: "4px", borderTop: "1px solid #777" }}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch" }}>
          {stageTwoObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['stage-two'] && !obj.selected) {
              transition['stage-two'] = false;
              return <div style={{ paddingTop: "4px", borderTop: "1px solid #777" }}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch" }}>
          {secretObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['secret'] && !obj.selected) {
              transition['secret'] = false;
              return <div style={{ paddingTop: "4px", borderTop: "1px solid #777" }}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
            }
            return <ObjectiveRow objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} />
          })}
        </div>
        <div className="flexColumn" style={{ flex: "0 0 24%", gap: "4px", justifyItems: "flex-start", alignItems: "stretch" }}>
          {otherObjectives.map((obj) => {
            if (obj.selected) {
              return <ObjectiveRow objective={obj} scoreObjective={(name, score) => scoreObj(name, score)} faction={factionName} removeObjective={() => removeObj(obj.name)} />
            }
            if (transition['other'] && !obj.selected) {
              transition['other'] = false;
              return <div style={{ paddingTop: "4px", borderTop: "1px solid #777" }}><ObjectiveRow key={obj.name} objective={obj} faction={factionName} scoreObjective={(name, score) => scoreObj(name, score)} addObjective={() => addObjective(obj.name)} /></div>
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

export function UpdateTechs({ }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [showFactionSelect, setShowFactionSelect] = useState(false);

  const [factionName, setFactionName] = useState(null);



  if (!factions || !techs || !options || !state) {
    return null;
  }

  if (factionName === null) {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
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
  const yellowTechs = techArr.filter((tech) => tech.type === "yellow");
  const redTechs = techArr.filter((tech) => tech.type === "red");
  const upgradeTechs = techArr.filter((tech) => tech.type === "upgrade");

  function addTech(toAdd) {
    unlockTech(mutate, gameid, factionName, toAdd);
  }

  function removeTech(toRemove) {
    lockTech(mutate, gameid, factionName, toRemove);
  }

  function getTechRow(tech) {
    if (!tech.name) {
      return <div style={{ height: "10px" }}></div>
    }
    if (hasTech(factions[factionName], tech.name)) {
      return <div key={tech.name}><TechRow tech={tech} removeTech={removeTech} /></div>;
    } else {
      return <div key={tech.name}><TechRow tech={tech} addTech={addTech} /></div>;
    }
  }

  const orderedFactionNames = Object.keys(factions).sort();

  return (
    <div className="flexColumn" style={{ justifyContent: "flex-start", width: "100%", height: "100%" }}>
      <div style={{ fontSize: responsivePixels(24), marginTop: responsivePixels(8) }}>Update techs for {getFactionName(factions[factionName])}</div>
      <div className="flexColumn" style={{ top: 0, height: "100%", width: "100%", position: "absolute", zIndex: -1, opacity: 0.2 }}>
        <div className="flexColumn" style={{ position: "relative", height: responsivePixels(240), width: responsivePixels(240) }}>
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div className="flexRow" style={{ flexWrap: "wrap", backgroundColor: "#222", zIndex: 904, fontSize: responsivePixels(14) }}>
        {orderedFactionNames.map((name) => {
          return (
            <button key={name} className={name === factionName ? "selected" : ""} style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}>{name}</button>

          );
        })}
      </div>
      <div className="flexRow" style={{ alignItems: "stretch", justifyContent: "space-between", width: "100%", height: "100%", boxSizing: "border-box", overflowY: "scroll", padding: responsivePixels(8) }}>
        <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
            <div className="flexRow" style={{ justifyContent: "center", fontSize: responsivePixels(20) }}>
              <WrappedTechIcon type="green" size={20} />
              Biotic
              <WrappedTechIcon type="green" size={20} />            </div>
            <div>
              {greenTechs.map(getTechRow)}
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
            <div className="flexRow" style={{ justifyContent: "center", fontSize: responsivePixels(20) }}>
              <WrappedTechIcon type="red" size={20} />
              Warfare
              <WrappedTechIcon type="red" size={20} />
            </div>
            <div>
              {redTechs.map(getTechRow)}
            </div>
          </div>
        </div>
        <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
          <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
            <div className="flexRow" style={{ justifyContent: "center", fontSize: responsivePixels(20) }}>
              <WrappedTechIcon type="blue" size={20} />
              Propulsion
              <WrappedTechIcon type="blue" size={20} />
            </div>
            <div>
              {blueTechs.map(getTechRow)}
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
            <div className="flexRow" style={{ justifyContent: "center", fontSize: responsivePixels(20) }}>
              <WrappedTechIcon type="yellow" size={20} />
              Cybernetic
              <WrappedTechIcon type="yellow" size={20} />
            </div>
            <div>
              {yellowTechs.map(getTechRow)}
            </div>
          </div>
        </div>
        <div className="flexColumn" style={{ justifyContent: "flex-start", alignItems: "stretch" }}>
          <div className="flexColumn" style={{ fontSize: responsivePixels(20) }}>Unit Upgrades</div>
          <div>
            {upgradeTechs.map(getTechRow)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpdateTechsModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  const [factionName, setFactionName] = useState(null);

  if (factionName === null) {
    setFactionName(state.speaker);
    return null;
  }

  return <div>
    <Modal closeMenu={onComplete} title={"Update Techs for " + factionName} visible={visible} content={<UpdateTechs />} />
  </div>
}

export function UpdatePlanets({ }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [factionName, setFactionName] = useState(null);



  if (!factions || !planets || !options || !state || !attachments) {
    return null;
  }

  if (factionName === null) {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
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
    unclaimPlanet(mutate, gameid, toRemove, factionName);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, gameid, toAdd, factionName);
  }

  const orderedFactionNames = Object.keys(factions).sort();

  const unownedPlanets = planetsArr.filter((planet) => {
    return !planet.locked && !(planet.owners ?? []).includes(factionName);
  });

  const half = Math.ceil(unownedPlanets.length / 2);   
  const middlePlanetCol = unownedPlanets.slice(0, half);
  const lastPlanetCol = unownedPlanets.slice(half);

  console.log("Re-render");
  return (
    <div className="flexColumn" style={{ width: "100%", height: "100%"}}>
      <div style={{ fontSize: responsivePixels(24), marginTop: responsivePixels(8) }}>Update planets for {getFactionName(factions[factionName])}</div>
      <div className="flexColumn" style={{ top: 0, height: "100%", width: "100%", position: "absolute", zIndex: -1, opacity: 0.2 }}>
        <div className="flexColumn" style={{ position: "relative", height: responsivePixels(240), width: responsivePixels(240) }}>
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div className="flexRow" style={{ flexWrap: "wrap", backgroundColor: "#222", zIndex: 904, fontSize: responsivePixels(14) }}>
        {orderedFactionNames.map((name) => {
          return (
            <button key={name} className={name === factionName ? "selected" : ""} style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}>{name}</button>

          );
        })}
      </div>
      <div className="flexRow" style={{alignItems: "flex-start", width: "100%", height: "100%", boxSizing: "border-box", overflowY: "auto", padding: responsivePixels(8)}}>
        <LabeledDiv noBlur={true} label={`Controlled by ${getFactionName(factions[factionName])}`} color={getFactionColor(factions[factionName])} style={{flex: "0 0 32%"}}>
        <div className="flexColumn" style={{width: "100%", alignItems: "stretch"}}>
          {planetsArr.map((planet) => {
            if (!(planet.owners ?? []).includes(factionName)) {
              return null;
            }
            return <div key={planet.name}><PlanetRow factionName={factionName} planet={planet} removePlanet={removePlanet} updatePlanet={() => { }} /></div>;
          })}
        </div>
        </LabeledDiv>
        <div className="flexColumn" style={{ flexWrap: "wrap", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", boxSizing: "border-box", padding: `0 ${responsivePixels(8)}`}}>
          {middlePlanetCol.map((planet) => {
            return <div key={planet.name} style={{ flex: "0 0 32%" }}><PlanetRow factionName={factionName} planet={planet} addPlanet={addPlanet} updatePlanet={() => { }} opts={{ showSelfOwned: true }} /></div>;
          })}
        </div>
        <div className="flexColumn" style={{ flexWrap: "wrap", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", boxSizing: "border-box", padding: `0 ${responsivePixels(8)}`}}>
          {lastPlanetCol.map((planet) => {
            return <div key={planet.name} style={{ flex: "0 0 32%" }}><PlanetRow factionName={factionName} planet={planet} addPlanet={addPlanet} updatePlanet={() => { }} opts={{ showSelfOwned: true }} /></div>;
          })}
        </div>
      </div>
    </div>
  );
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

  const [groupBySystem, setGroupBySystem] = useState(false);
  const [showFactionSelect, setShowFactionSelect] = useState(false);

  const [factionName, setFactionName] = useState(null);



  if (!factions || !planets || !options || !state || !attachments) {
    return null;
  }

  if (factionName === null) {
    setFactionName(state.speaker);
    return null;
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
    unclaimPlanet(mutate, gameid, toRemove, factionName);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, gameid, toAdd, factionName);
  }

  const orderedFactionNames = Object.keys(factions).sort();

  const innerContent = (
    <div className="flexColumn" style={{ position: "sticky", minHeight: "400px", maxHeight: "85vh" }}>
      <div className="flexColumn" style={{ top: 0, height: "100%", width: "100%", position: "absolute", zIndex: -1, opacity: 0.2 }}>
        <div className="flexColumn" style={{ position: "relative", height: "500px", width: "500px" }}>
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div className="flexColumn" style={{ position: "sticky", width: "100%", top: "44px", zIndex: 902, backgroundColor: "#222" }}>
        <div className="flexRow" style={{ backgroundColor: "#222", height: "32px", position: "sticky", zIndex: 904, top: "73px", fontSize: "16px", gap: "24px", margin: "8px 0px" }}>
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
      <div className="flexRow" style={{ width: "1600px", flexWrap: "wrap", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", overflowY: "scroll" }}>
        {groupBySystem ?
          planetsBySystem.map((system, systemName) => {
            let allControlled = true;
            system.forEach((planet) => {
              if (!(planet.owners ?? []).includes(factionName)) {
                allControlled = false;
              }
            });
            if (allControlled) {
              return <div key={systemName} className="flexColumn" style={{ alignItems: "flex-start", flex: "0 0 25%", borderBottom: "1px solid #777" }}><SystemRow factionName={factionName} planets={system} removePlanet={removePlanet} /></div>;
            } else {
              return <div key={systemName} className="flexColumn" style={{ alignItems: "flex-start", flex: "0 0 25%", borderBottom: "1px solid #777" }}><SystemRow factionName={factionName} planets={system} addPlanet={addPlanet} /></div>;
            }
          }) :
          planetsArr.map((planet) => {
            if ((planet.owners ?? []).includes(factionName)) {
              return <div key={planet.name} style={{ flex: "0 0 25%" }}><PlanetRow factionName={factionName} planet={planet} removePlanet={removePlanet} updatePlanet={() => { }} opts={{ showSelfOwned: true }} /></div>;
            } else {
              return <div key={planet.name} style={{ flex: "0 0 25%" }}><PlanetRow factionName={factionName} planet={planet} addPlanet={addPlanet} updatePlanet={() => { }} opts={{ showSelfOwned: true }} /></div>;
            }
          })
        }
      </div>
    </div>
  );

  return <div>
    <Modal closeMenu={onComplete} title={"Update Planets for " + factionName} visible={visible} content={<UpdatePlanets />} />
  </div>
}

export function PlanetSummary({ planets, faction, options = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: gameOptions = {} } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  let resources = 0;
  let influence = 0;
  let cultural = 0;
  let hazardous = 0;
  let industrial = 0;
  const skips = [];
  for (const planet of planets) {
    if (planet.ready || options.total) {
      if (gameOptions.expansions.includes('codex-three') &&
          faction.name === "Xxcha Kingdom" &&
          faction.hero === "unlocked") {
        resources += (planet.resources + planet.influence);
        influence += (planet.resources + planet.influence);
      } else {
        resources += planet.resources;
        influence += planet.influence;
      }
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
    <div className="flexRow" style={{ gap: responsivePixels(12), flexBasis: "30%", maxWidth: responsivePixels(80) }}>
      <div className="flexRow">
        <ResponsiveResources
          resources={resources}
          influence={influence}
        />
        {/* <PlanetAttributes attributes={skips} /> */}
      </div>
      <div className="flexColumn" style={{ gap: responsivePixels(4), fontSize: responsivePixels(14) }}>
        <div className="flexRow" style={{ gap: responsivePixels(4), flexBasis: "33%" }}>
          <div className="flexColumn">{cultural}</div>
          <FullPlanetSymbol type={"Cultural"} size={16} />
        </div>
        <div className="flexRow" style={{ gap: responsivePixels(4), flexBasis: "33%" }}>
          <div>{hazardous}</div>
          <FullPlanetSymbol type={"Hazardous"} size={16} />
        </div>
        <div className="flexRow" style={{ gap: responsivePixels(4), flexBasis: "33%" }}>
          <div>{industrial}</div>
          <FullPlanetSymbol type={"Industrial"} size={16} />
        </div>
      </div>
    </div>
  );
}

export function computeVPs(factions, factionName, objectives) {
  const faction = factions[factionName];
  return (faction.vps ?? 0) + Object.values(objectives).filter((objective) => {
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
}

export function FactionSummary({ factionName, options = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: state = {} } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: techs, error: techsError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);

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

  const VPs = computeVPs(factions ?? {}, factionName, objectives ?? {})

  function manualVpAdjust(increase) {
    const value = increase ? 1 : -1;
    manualVPUpdate(mutate, gameid, factionName, value);
  }

  const editable = state.phase !== "END";

  return (
    <div className="flexRow" style={{ height: "100%", width: "100%", maxWidth: responsivePixels(800), position: "relative" }}>
      {options.showIcon ?
        <div className="flexColumn" style={{ position: "absolute", zIndex: -1, width: "100%", height: "100%" }}>
          <div className="flexColumn" style={{ position: "absolute", zIndex: -1, opacity: 0.5, width: responsivePixels(60), height: responsivePixels(60) }}>
            <FullFactionSymbol faction={factionName} size={90} />
          </div>
        </div> : null}
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
      <div className="flexColumn" style={{ gap: 0 }}>
        <div className="flexRow" style={{ gap: responsivePixels(4), justifyContent: "space-between", fontSize: responsivePixels(28) }}>
          {VPs > 0 && editable ? <div className="arrowDown" onClick={() => manualVpAdjust(false)}></div> : <div style={{ width: responsivePixels(12) }}></div>}
          <div className="flexRow" style={{ width: responsivePixels(24) }}>{VPs}</div>
          {editable ? <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div> : <div style={{ width: responsivePixels(12) }}></div>}
        </div>
        <div style={{ fontSize: responsivePixels(20) }}>{pluralize('VP', VPs)}</div>
      </div>
      {options.hidePlanets ? null : <PlanetSummary planets={updatedPlanets} faction={faction} options={options} />}
    </div>);
}