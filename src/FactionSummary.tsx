import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { FullFactionSymbol } from "./FactionCard";
import { Modal } from "./Modal";
import { FullPlanetSymbol, PlanetRow } from "./PlanetRow";
import { ResponsiveResources } from "./Resources";
import { FullTechIcon, TechRow, WrappedTechIcon } from "./TechRow";
import { Faction, manualVPUpdate } from "./util/api/factions";
import { claimPlanet, Planet, unclaimPlanet } from "./util/api/planets";
import { fetcher } from "./util/api/util";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { filterToOwnedTechs, getTechColor, sortTechs } from "./util/techs";
import { pluralize, responsivePixels } from "./util/util";
import { hasTech, lockTech, Tech, unlockTech } from "./util/api/techs";
import { ObjectiveRow } from "./ObjectiveRow";
import {
  Objective,
  removeObjective,
  revealObjective,
  scoreObjective,
  unscoreObjective,
} from "./util/api/objectives";
import React from "react";
import { getFactionColor, getFactionName } from "./util/factions";
import { LabeledDiv } from "./LabeledDiv";
import { GameState } from "./util/api/state";
import { Options } from "./util/api/options";
import { Attachment } from "./util/api/attachments";

function TechList({ techs }: { techs: Tech[] }) {
  return (
    <div
      className="flexColumn"
      style={{
        alignItems: "stretch",
        padding: "4px 8px",
        backgroundColor: "#222",
        boxShadow: "1px 1px 4px black",
        whiteSpace: "nowrap",
        gap: "4px",
        border: `2px solid #333`,
        borderRadius: "5px",
      }}
    >
      {techs.map((tech) => (
        <div key={tech.name} style={{ color: getTechColor(tech) }}>
          {tech.name}
        </div>
      ))}
    </div>
  );
}

export function TechSummary({ techs }: { techs: Tech[] }) {
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

  const techOrder = ["red", "green", "blue", "yellow", "upgrade"];

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
    <div
      className="flexColumn"
      style={{
        gap: responsivePixels(4),
        fontSize: responsivePixels(12),
        justifyContent: "space-evenly",
      }}
    >
      <div className="flexRow" style={{ width: "100%" }}>
        <div
          className="flexRow hoverParent"
          style={{
            gap: responsivePixels(3),
            flexBasis: "50%",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="flexColumn"
            style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}
          >
            {redTechs.length}
          </div>
          <div
            style={{
              position: "relative",
              height: responsivePixels(16),
              width: responsivePixels(18),
            }}
          >
            <FullTechIcon type={"red"} />
          </div>
        </div>
        <div
          className="flexRow hoverParent"
          style={{
            gap: responsivePixels(3),
            flexBasis: "50%",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="flexColumn"
            style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}
          >
            {greenTechs.length}
          </div>
          <div
            style={{
              position: "relative",
              height: responsivePixels(16),
              width: responsivePixels(18),
            }}
          >
            <FullTechIcon type={"green"} />
          </div>
        </div>
      </div>
      <div className="flexRow" style={{ width: "100%" }}>
        <div
          className="flexRow hoverParent"
          style={{
            gap: responsivePixels(3),
            flexBasis: "50%",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="flexColumn"
            style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}
          >
            {blueTechs.length}
          </div>
          <div
            style={{
              position: "relative",
              height: responsivePixels(16),
              width: responsivePixels(18),
            }}
          >
            <FullTechIcon type={"blue"} />
          </div>
        </div>
        <div
          className="flexRow hoverParent"
          style={{
            gap: responsivePixels(3),
            flexBasis: "50%",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="flexColumn"
            style={{ flexBasis: "30%", fontSize: responsivePixels(14) }}
          >
            {yellowTechs.length}
          </div>
          <div
            style={{
              position: "relative",
              height: responsivePixels(16),
              width: responsivePixels(18),
            }}
          >
            <FullTechIcon type={"yellow"} />
          </div>
        </div>
      </div>
      <div
        className="flexRow hoverParent"
        style={{
          width: "100%",
          minWidth: responsivePixels(80),
          fontSize: responsivePixels(14),
        }}
      >
        {upgradeTechs.length} {pluralize("Upgrade", upgradeTechs.length)}
      </div>
    </div>
  );
}

export function UpdateObjectives({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (state && factionName === "") {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
  }

  function scoreObj(objectiveName: string, score: boolean) {
    if (!gameid) {
      return;
    }
    if (score) {
      addObjective(objectiveName);
      scoreObjective(gameid, factionName, objectiveName);
    } else {
      unscoreObjective(gameid, factionName, objectiveName);
    }
  }

  function addObjective(objectiveName: string) {
    if (!gameid) {
      return;
    }
    revealObjective(gameid, factionName, objectiveName);
  }

  function removeObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    removeObjective(gameid, factionName, objectiveName);
  }

  const orderedFactionNames = Object.keys(factions ?? {}).sort();

  const sortedObjectives = Object.values(objectives ?? {}).sort((a, b) => {
    if (a.selected && !b.selected) {
      return -1;
    } else if (b.selected && !a.selected) {
      return 1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const stageOneObjectives = sortedObjectives.filter(
    (obj) => obj.type === "stage-one"
  );
  const stageTwoObjectives = sortedObjectives.filter(
    (obj) => obj.type === "stage-two"
  );
  const secretObjectives = sortedObjectives.filter(
    (obj) => obj.type === "secret"
  );
  const otherObjectives = sortedObjectives.filter(
    (obj) => obj.type === "other"
  );

  let transition = {
    "stage-one":
      (stageOneObjectives.length > 0 &&
        stageOneObjectives[0] &&
        stageOneObjectives[0].selected) ??
      false,
    "stage-two":
      (stageTwoObjectives.length > 0 &&
        stageTwoObjectives[0] &&
        stageTwoObjectives[0].selected) ??
      false,
    secret:
      (secretObjectives.length > 0 &&
        secretObjectives[0] &&
        secretObjectives[0].selected) ??
      false,
    other:
      (otherObjectives.length > 0 &&
        otherObjectives[0] &&
        otherObjectives[0].selected) ??
      false,
  };

  return (
    <div className="flexColumn" style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          fontSize: responsivePixels(24),
          marginTop: responsivePixels(8),
        }}
      >
        Score objectives for{" "}
        {factions ? getFactionName(factions[factionName]) : factionName}
      </div>
      <div
        className="flexColumn"
        style={{
          top: 0,
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
          opacity: 0.2,
        }}
      >
        <div
          className="flexColumn"
          style={{
            position: "relative",
            height: responsivePixels(240),
            width: responsivePixels(240),
          }}
        >
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div
        className="flexRow"
        style={{
          flexWrap: "wrap",
          backgroundColor: "#222",
          zIndex: 904,
          fontSize: responsivePixels(14),
        }}
      >
        {orderedFactionNames.map((name) => {
          return (
            <button
              key={name}
              className={name === factionName ? "selected" : ""}
              style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{
          width: "100%",
          padding: `${responsivePixels(8)} 0px`,
          backgroundColor: "#222",
          position: "sticky",
          alignItems: "flex-start",
          justifyContent: "space-between",
          zIndex: 902,
        }}
      >
        <div
          className="flexColumn"
          style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}
        >
          Stage I
        </div>
        <div
          className="flexColumn"
          style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}
        >
          Stage II
        </div>
        <div
          className="flexColumn"
          style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}
        >
          Secret
        </div>
        <div
          className="flexColumn"
          style={{ flex: "0 0 24%", fontSize: responsivePixels(24) }}
        >
          Other
        </div>
      </div>
      <div
        className="flexRow smallFont"
        style={{
          boxSizing: "border-box",
          padding: responsivePixels(8),
          alignItems: "flex-start",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <div
          className="flexColumn"
          style={{
            flex: "0 0 24%",
            gap: responsivePixels(8),
            justifyItems: "flex-start",
            alignItems: "stretch",
          }}
        >
          {stageOneObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return (
                <ObjectiveRow
                  key={obj.name}
                  objective={obj}
                  scoreObjective={(name, score) => scoreObj(name, score)}
                  factionName={factionName}
                  removeObjective={
                    scorers.length === 0 ? () => removeObj(obj.name) : undefined
                  }
                />
              );
            }
            if (transition["stage-one"] && !obj.selected) {
              transition["stage-one"] = false;
              return (
                <div
                  key={obj.name}
                  style={{
                    paddingTop: responsivePixels(4),
                    borderTop: `${responsivePixels(1)} solid #777`,
                  }}
                >
                  <ObjectiveRow
                    objective={obj}
                    factionName={factionName}
                    scoreObjective={(name, score) => scoreObj(name, score)}
                    addObjective={() => addObjective(obj.name)}
                  />
                </div>
              );
            }
            return (
              <ObjectiveRow
                key={obj.name}
                objective={obj}
                factionName={factionName}
                scoreObjective={(name, score) => scoreObj(name, score)}
                addObjective={() => addObjective(obj.name)}
              />
            );
          })}
        </div>
        <div
          className="flexColumn"
          style={{
            flex: "0 0 24%",
            justifyItems: "flex-start",
            alignItems: "stretch",
          }}
        >
          {stageTwoObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return (
                <ObjectiveRow
                  key={obj.name}
                  objective={obj}
                  scoreObjective={(name, score) => scoreObj(name, score)}
                  factionName={factionName}
                  removeObjective={
                    scorers.length === 0 ? () => removeObj(obj.name) : undefined
                  }
                />
              );
            }
            if (transition["stage-two"] && !obj.selected) {
              transition["stage-two"] = false;
              return (
                <div
                  key={obj.name}
                  style={{
                    paddingTop: responsivePixels(8),
                    borderTop: `${responsivePixels(1)} solid #777`,
                  }}
                >
                  <ObjectiveRow
                    objective={obj}
                    factionName={factionName}
                    scoreObjective={(name, score) => scoreObj(name, score)}
                    addObjective={() => addObjective(obj.name)}
                  />
                </div>
              );
            }
            return (
              <ObjectiveRow
                key={obj.name}
                objective={obj}
                factionName={factionName}
                scoreObjective={(name, score) => scoreObj(name, score)}
                addObjective={() => addObjective(obj.name)}
              />
            );
          })}
        </div>
        <div
          className="flexColumn"
          style={{
            flex: "0 0 24%",
            justifyItems: "flex-start",
            alignItems: "stretch",
          }}
        >
          {secretObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return (
                <ObjectiveRow
                  key={obj.name}
                  objective={obj}
                  scoreObjective={(name, score) => scoreObj(name, score)}
                  factionName={factionName}
                  removeObjective={
                    scorers.length === 0 ? () => removeObj(obj.name) : undefined
                  }
                />
              );
            }
            if (transition["secret"] && !obj.selected) {
              transition["secret"] = false;
              return (
                <div
                  key={obj.name}
                  style={{
                    paddingTop: responsivePixels(4),
                    borderTop: `${responsivePixels(1)} solid #777`,
                  }}
                >
                  <ObjectiveRow
                    objective={obj}
                    factionName={factionName}
                    scoreObjective={(name, score) => scoreObj(name, score)}
                    addObjective={() => addObjective(obj.name)}
                  />
                </div>
              );
            }
            return (
              <ObjectiveRow
                key={obj.name}
                objective={obj}
                factionName={factionName}
                scoreObjective={(name, score) => scoreObj(name, score)}
                addObjective={() => addObjective(obj.name)}
              />
            );
          })}
        </div>
        <div
          className="flexColumn"
          style={{
            flex: "0 0 24%",
            justifyItems: "flex-start",
            alignItems: "stretch",
          }}
        >
          {otherObjectives.map((obj) => {
            const scorers = obj.scorers ?? [];
            if (obj.selected) {
              return (
                <ObjectiveRow
                  key={obj.name}
                  objective={obj}
                  scoreObjective={(name, score) => scoreObj(name, score)}
                  factionName={factionName}
                  removeObjective={
                    scorers.length === 0 ? () => removeObj(obj.name) : undefined
                  }
                />
              );
            }
            if (transition["other"] && !obj.selected) {
              transition["other"] = false;
              return (
                <div
                  key={obj.name}
                  style={{
                    paddingTop: responsivePixels(4),
                    borderTop: `${responsivePixels(1)} solid #777`,
                  }}
                >
                  <ObjectiveRow
                    objective={obj}
                    factionName={factionName}
                    scoreObjective={(name, score) => scoreObj(name, score)}
                    addObjective={() => addObjective(obj.name)}
                  />
                </div>
              );
            }
            return (
              <ObjectiveRow
                key={obj.name}
                objective={obj}
                factionName={factionName}
                scoreObjective={(name, score) => scoreObj(name, score)}
                addObjective={() => addObjective(obj.name)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface UpdateObjectivesModalProps {
  visible: boolean;
  onComplete?: () => void;
}

export function UpdateObjectivesModal({
  visible,
  onComplete,
}: UpdateObjectivesModalProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (!state) {
    return null;
  }

  if (factionName === "") {
    setFactionName(state.speaker);
    return null;
  }

  return (
    <div>
      <Modal
        closeMenu={onComplete}
        title={"Score Objectives for " + factionName}
        visible={visible}
      >
        <UpdateObjectives />
      </Modal>
    </div>
  );
}

export function UpdateTechs({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (!state || !factions) {
    return null;
  }

  if (factionName === "") {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
  }

  const faction = factions[factionName];
  if (!faction) {
    return null;
  }

  const techsObj: Record<string, Tech> = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (!factions) {
      return;
    }
    if (tech.faction) {
      if (factionName === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (
        factionName !== "Nekro Virus" &&
        tech.faction !== factionName
      ) {
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

  const techArr = Object.values(techsObj);
  sortTechs(techArr);
  const greenTechs = techArr.filter((tech) => tech.type === "green");
  const blueTechs = techArr.filter((tech) => tech.type === "blue");
  const yellowTechs = techArr.filter((tech) => tech.type === "yellow");
  const redTechs = techArr.filter((tech) => tech.type === "red");
  const upgradeTechs = techArr.filter((tech) => tech.type === "upgrade");

  function addTech(toAdd: string) {
    if (!gameid) {
      return;
    }
    unlockTech(gameid, factionName, toAdd);
  }

  function removeTech(toRemove: string) {
    if (!gameid) {
      return;
    }
    lockTech(gameid, factionName, toRemove);
  }

  function getTechRow(tech: Tech) {
    if (!tech.name || !faction) {
      return <div style={{ height: "10px" }}></div>;
    }
    if (hasTech(faction, tech.name)) {
      return (
        <div key={tech.name}>
          <TechRow tech={tech} removeTech={removeTech} />
        </div>
      );
    } else {
      return (
        <div key={tech.name}>
          <TechRow tech={tech} addTech={addTech} />
        </div>
      );
    }
  }

  const orderedFactionNames = Object.keys(factions).sort();

  return (
    <div
      className="flexColumn"
      style={{ justifyContent: "flex-start", width: "100%", height: "100%" }}
    >
      <div
        style={{
          fontSize: responsivePixels(24),
          marginTop: responsivePixels(8),
        }}
      >
        Update techs for {getFactionName(factions[factionName])}
      </div>
      <div
        className="flexColumn"
        style={{
          top: 0,
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
          opacity: 0.2,
        }}
      >
        <div
          className="flexColumn"
          style={{
            position: "relative",
            height: responsivePixels(240),
            width: responsivePixels(240),
          }}
        >
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div
        className="flexRow"
        style={{
          flexWrap: "wrap",
          backgroundColor: "#222",
          zIndex: 904,
          fontSize: responsivePixels(14),
        }}
      >
        {orderedFactionNames.map((name) => {
          return (
            <button
              key={name}
              className={name === factionName ? "selected" : ""}
              style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
          padding: responsivePixels(8),
        }}
      >
        <div
          className="flexColumn"
          style={{ alignItems: "stretch", justifyContent: "flex-start" }}
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", justifyContent: "flex-start" }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "center",
                fontSize: responsivePixels(20),
              }}
            >
              <WrappedTechIcon type="green" size={20} />
              Biotic
              <WrappedTechIcon type="green" size={20} />{" "}
            </div>
            <div>{greenTechs.map(getTechRow)}</div>
          </div>
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", justifyContent: "flex-start" }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "center",
                fontSize: responsivePixels(20),
              }}
            >
              <WrappedTechIcon type="red" size={20} />
              Warfare
              <WrappedTechIcon type="red" size={20} />
            </div>
            <div>{redTechs.map(getTechRow)}</div>
          </div>
        </div>
        <div
          className="flexColumn"
          style={{ alignItems: "stretch", justifyContent: "flex-start" }}
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", justifyContent: "flex-start" }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "center",
                fontSize: responsivePixels(20),
              }}
            >
              <WrappedTechIcon type="blue" size={20} />
              Propulsion
              <WrappedTechIcon type="blue" size={20} />
            </div>
            <div>{blueTechs.map(getTechRow)}</div>
          </div>
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", justifyContent: "flex-start" }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "center",
                fontSize: responsivePixels(20),
              }}
            >
              <WrappedTechIcon type="yellow" size={20} />
              Cybernetic
              <WrappedTechIcon type="yellow" size={20} />
            </div>
            <div>{yellowTechs.map(getTechRow)}</div>
          </div>
        </div>
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "stretch" }}
        >
          <div
            className="flexColumn"
            style={{ fontSize: responsivePixels(20) }}
          >
            Unit Upgrades
          </div>
          <div>{upgradeTechs.map(getTechRow)}</div>
        </div>
      </div>
    </div>
  );
}

export interface UpdateTechsModalProps {
  visible: boolean;
  onComplete: () => void;
}

export function UpdateTechsModal({
  visible,
  onComplete,
}: UpdateTechsModalProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (!state) {
    return null;
  }

  if (factionName === "") {
    setFactionName(state.speaker);
    return null;
  }

  return (
    <div>
      <Modal
        closeMenu={onComplete}
        title={"Update Techs for " + factionName}
        visible={visible}
      >
        <UpdateTechs />
      </Modal>
    </div>
  );
}

export function UpdatePlanets({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: attachments }: { data?: Record<string, Attachment> } = useSWR(
    gameid ? `/api/${gameid}/attachments` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (!state) {
    return null;
  }

  if (factionName === "") {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
  }

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets ?? {}),
    attachments ?? {}
  );

  const planetsArr: Planet[] = [];
  updatedPlanets.forEach((planet) => {
    planetsArr.push(planet);
  });

  function removePlanet(toRemove: string) {
    if (!gameid) {
      return;
    }
    unclaimPlanet(gameid, toRemove, factionName);
  }

  function addPlanet(toAdd: string) {
    if (!gameid) {
      return;
    }
    claimPlanet(gameid, toAdd, factionName);
  }
  const orderedFactionNames = Object.keys(factions ?? {}).sort();

  const unownedPlanets = planetsArr.filter((planet) => {
    return !planet.locked && planet.owner !== factionName;
  });

  const half = Math.ceil(unownedPlanets.length / 2);
  const middlePlanetCol = unownedPlanets.slice(0, half);
  const lastPlanetCol = unownedPlanets.slice(half);

  return (
    <div className="flexColumn" style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          fontSize: responsivePixels(24),
          marginTop: responsivePixels(8),
        }}
      >
        Update planets for{" "}
        {factions ? getFactionName(factions[factionName]) : factionName}
      </div>
      <div
        className="flexColumn"
        style={{
          top: 0,
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
          opacity: 0.2,
        }}
      >
        <div
          className="flexColumn"
          style={{
            position: "relative",
            height: responsivePixels(240),
            width: responsivePixels(240),
          }}
        >
          <FullFactionSymbol faction={factionName} />
        </div>
      </div>
      <div
        className="flexRow"
        style={{
          flexWrap: "wrap",
          backgroundColor: "#222",
          zIndex: 904,
          fontSize: responsivePixels(14),
        }}
      >
        {orderedFactionNames.map((name) => {
          return (
            <button
              key={name}
              className={name === factionName ? "selected" : ""}
              style={{ fontSize: responsivePixels(14) }}
              onClick={() => setFactionName(name)}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
          padding: responsivePixels(8),
        }}
      >
        <LabeledDiv
          noBlur={true}
          label={`Controlled by ${
            factions ? getFactionName(factions[factionName]) : factionName
          }`}
          color={factions ? getFactionColor(factions[factionName]) : "#555"}
          style={{ flex: "0 0 32%" }}
        >
          <div
            className="flexColumn"
            style={{ width: "100%", alignItems: "stretch" }}
          >
            {planetsArr.map((planet) => {
              if (planet.owner !== factionName) {
                return null;
              }
              return (
                <div key={planet.name}>
                  <PlanetRow
                    factionName={factionName}
                    planet={planet}
                    removePlanet={removePlanet}
                  />
                </div>
              );
            })}
          </div>
        </LabeledDiv>
        <div
          className="flexColumn"
          style={{
            flexWrap: "wrap",
            alignItems: "stretch",
            justifyContent: "stretch",
            alignContent: "stretch",
            boxSizing: "border-box",
            padding: `0 ${responsivePixels(8)}`,
          }}
        >
          {middlePlanetCol.map((planet) => {
            return (
              <div key={planet.name} style={{ flex: "0 0 32%" }}>
                <PlanetRow
                  factionName={factionName}
                  planet={planet}
                  addPlanet={addPlanet}
                  opts={{ showSelfOwned: true }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="flexColumn"
          style={{
            flexWrap: "wrap",
            alignItems: "stretch",
            justifyContent: "stretch",
            alignContent: "stretch",
            boxSizing: "border-box",
            padding: `0 ${responsivePixels(8)}`,
          }}
        >
          {lastPlanetCol.map((planet) => {
            return (
              <div key={planet.name} style={{ flex: "0 0 32%" }}>
                <PlanetRow
                  factionName={factionName}
                  planet={planet}
                  addPlanet={addPlanet}
                  opts={{ showSelfOwned: true }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface UpdatePlanetsModalProps {
  visible: boolean;
  onComplete?: () => void;
}

export function UpdatePlanetsModal({
  visible,
  onComplete,
}: UpdatePlanetsModalProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");

  if (!state) {
    return null;
  }

  if (factionName === "") {
    setFactionName(state.speaker);
    return null;
  }

  return (
    <div>
      <Modal
        closeMenu={onComplete}
        title={"Update Planets for " + factionName}
        visible={visible}
      >
        <UpdatePlanets />
      </Modal>
    </div>
  );
}

export interface PlanetSummaryProps {
  planets: Planet[];
  faction: Faction;
  options?: {
    total?: number;
  };
}

export function PlanetSummary({
  planets,
  faction,
  options = {},
}: PlanetSummaryProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: gameOptions }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  let resources = 0;
  let influence = 0;
  let cultural = 0;
  let hazardous = 0;
  let industrial = 0;
  const skips = [];
  for (const planet of planets) {
    if (planet.ready || options.total) {
      if (
        (gameOptions?.expansions ?? []).includes("CODEX THREE") &&
        faction.name === "Xxcha Kingdom" &&
        faction.hero === "unlocked"
      ) {
        resources += planet.resources + planet.influence;
        influence += planet.resources + planet.influence;
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
    <div
      className="flexRow"
      style={{
        gap: responsivePixels(12),
        flexBasis: "30%",
        maxWidth: responsivePixels(80),
      }}
    >
      <div className="flexRow">
        <ResponsiveResources resources={resources} influence={influence} />
        {/* <PlanetAttributes attributes={skips} /> */}
      </div>
      <div
        className="flexColumn"
        style={{ gap: responsivePixels(4), fontSize: responsivePixels(14) }}
      >
        <div
          className="flexRow"
          style={{ gap: responsivePixels(4), flexBasis: "33%" }}
        >
          <div className="flexColumn">{cultural}</div>
          <FullPlanetSymbol type={"Cultural"} size={16} />
        </div>
        <div
          className="flexRow"
          style={{ gap: responsivePixels(4), flexBasis: "33%" }}
        >
          <div>{hazardous}</div>
          <FullPlanetSymbol type={"Hazardous"} size={16} />
        </div>
        <div
          className="flexRow"
          style={{ gap: responsivePixels(4), flexBasis: "33%" }}
        >
          <div>{industrial}</div>
          <FullPlanetSymbol type={"Industrial"} size={16} />
        </div>
      </div>
    </div>
  );
}

export function computeVPs(
  factions: Record<string, Faction>,
  factionName: string,
  objectives: Record<string, Objective>
) {
  const faction = factions[factionName];
  if (!faction) {
    return 0;
  }
  return (
    (faction.vps ?? 0) +
    Object.values(objectives)
      .filter((objective) => {
        return (objective.scorers ?? []).includes(factionName);
      })
      .reduce((total, objective) => {
        const count = (objective.scorers ?? []).reduce((count, scorer) => {
          if (scorer === factionName) {
            return count + 1;
          }
          return count;
        }, 0);
        return total + count * objective.points;
      }, 0)
  );
}

export interface FactionSummaryProps {
  factionName: string;
  options?: {
    hidePlanets?: boolean;
    hideTechs?: boolean;
    showIcon?: boolean;
  };
}

export function FactionSummary({
  factionName,
  options = {},
}: FactionSummaryProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: attachments } = useSWR(
    gameid ? `/api/${gameid}/attachments` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const faction = factions ? factions[factionName] : undefined;

  if (!faction) {
    return null;
  }

  const ownedTechs = filterToOwnedTechs(techs ?? {}, faction);

  const ownedPlanets = filterToClaimedPlanets(planets ?? {}, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const VPs = computeVPs(factions ?? {}, factionName, objectives ?? {});

  function manualVpAdjust(increase: boolean) {
    if (!gameid) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdate(gameid, factionName, value);
  }

  const editable = state?.phase !== "END";

  return (
    <div
      className="flexRow"
      style={{
        height: "100%",
        width: "100%",
        maxWidth: responsivePixels(800),
        position: "relative",
      }}
    >
      {options.showIcon ? (
        <div
          className="flexColumn"
          style={{
            position: "absolute",
            zIndex: -1,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            className="flexColumn"
            style={{
              position: "absolute",
              zIndex: -1,
              opacity: 0.5,
              width: responsivePixels(60),
              height: responsivePixels(60),
            }}
          >
            <FullFactionSymbol faction={factionName} />
          </div>
        </div>
      ) : null}
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
      <div className="flexColumn" style={{ gap: 0 }}>
        <div
          className="flexRow"
          style={{
            gap: responsivePixels(4),
            justifyContent: "space-between",
            fontSize: responsivePixels(28),
          }}
        >
          {VPs > 0 && editable ? (
            <div
              className="arrowDown"
              onClick={() => manualVpAdjust(false)}
            ></div>
          ) : (
            <div style={{ width: responsivePixels(12) }}></div>
          )}
          <div className="flexRow" style={{ width: responsivePixels(24) }}>
            {VPs}
          </div>
          {editable ? (
            <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
          ) : (
            <div style={{ width: responsivePixels(12) }}></div>
          )}
        </div>
        <div style={{ fontSize: responsivePixels(20) }}>
          {pluralize("VP", VPs)}
        </div>
      </div>
      {options.hidePlanets ? null : (
        <PlanetSummary planets={updatedPlanets} faction={faction} />
      )}
    </div>
  );
}
