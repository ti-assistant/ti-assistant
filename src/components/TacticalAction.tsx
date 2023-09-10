import React, { CSSProperties } from "react";
import { FullFactionSymbol } from "../FactionCard";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv, LabeledLine } from "../LabeledDiv";
import { ObjectiveRow } from "../ObjectiveRow";
import { PlanetRow } from "../PlanetRow";
import { TechRow } from "../TechRow";
import { SymbolX } from "../icons/svgs";
import { TechSelectHoverMenu } from "../main/util/TechSelectHoverMenu";
import { getObjectiveScorers, getResearchedTechs } from "../util/actionLog";
import { addTech, removeTech } from "../util/api/addTech";
import { Attachment } from "../util/api/attachments";
import { claimPlanet, unclaimPlanet } from "../util/api/claimPlanet";
import { Faction } from "../util/api/factions";
import { Objective, hasScoredObjective } from "../util/api/objectives";
import { Planet } from "../util/api/planets";
import { scoreObjective, unscoreObjective } from "../util/api/scoreObjective";
import { PlanetEvent } from "../util/api/subState";
import { Tech, hasTech } from "../util/api/techs";
import { ActionLogEntry } from "../util/api/util";
import { getFactionColor } from "../util/factions";
import { ClaimPlanetData } from "../util/model/claimPlanet";
import { applyPlanetAttachments } from "../util/planets";
import { pluralize, responsivePixels } from "../util/util";
import { FactionSelectRadialMenu } from "./FactionSelect";

export function TacticalAction({
  activeFactionName,
  attachments,
  claimablePlanets,
  conqueredPlanets,
  currentTurn,
  factions,
  gameid,
  objectives,
  planets,
  scorableObjectives,
  scoredObjectives,
  style = {},
  techs,
}: {
  activeFactionName: string;
  attachments: Record<string, Attachment>;
  claimablePlanets: Planet[];
  conqueredPlanets: PlanetEvent[];
  currentTurn: ActionLogEntry[];
  factions: Record<string, Faction>;
  gameid: string;
  objectives: Record<string, Objective>;
  planets: Record<string, Planet>;
  scorableObjectives: Objective[];
  scoredObjectives: string[];
  style?: CSSProperties;
  techs: Record<string, Tech>;
}) {
  const nekroTechs = getResearchedTechs(currentTurn, "Nekro Virus");

  const custodiansScorer = getObjectiveScorers(
    currentTurn,
    "Custodians Token"
  )[0];

  const currentMartyrs = getObjectiveScorers(currentTurn, "Become a Martyr");
  const possibleMartyrs = new Set<string>(currentMartyrs);
  const becomeAMartyr = (objectives ?? {})["Become a Martyr"];
  if (
    becomeAMartyr &&
    (currentMartyrs.length > 0 ||
      (becomeAMartyr.scorers ?? []).length === 0 ||
      becomeAMartyr.type === "STAGE ONE")
  ) {
    const scorers = becomeAMartyr.scorers ?? [];
    for (const conqueredPlanet of conqueredPlanets) {
      const planet = (planets ?? {})[conqueredPlanet.planet];
      if (!planet) {
        continue;
      }
      if (
        planet.home &&
        conqueredPlanet.prevOwner &&
        conqueredPlanet.prevOwner !== activeFactionName &&
        !scorers.includes(conqueredPlanet.prevOwner)
      ) {
        possibleMartyrs.add(conqueredPlanet.prevOwner);
      }
    }
  }
  const orderedMartyrs = Array.from(possibleMartyrs).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    return -1;
  });

  function removeTechLocal(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    removeTech(gameid, factionName, toRemove);
  }

  function addTechLocal(factionName: string, tech: Tech) {
    if (!gameid) {
      return;
    }
    addTech(gameid, factionName, tech.name);
  }

  let hasCustodiansPoint = false;
  const mecatolConquerers = currentTurn.filter(
    (logEntry) =>
      logEntry.data.action === "CLAIM_PLANET" &&
      logEntry.data.event.planet === "Mecatol Rex"
  );
  if (mecatolConquerers[0]) {
    const event = (mecatolConquerers[0].data as ClaimPlanetData).event;
    if (event.faction === activeFactionName && !event.prevOwner) {
      hasCustodiansPoint = true;
    }
  }

  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(12, claimablePlanets.length)}, auto)`,
    gap: responsivePixels(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  const secretButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    alignItems: "stretch",
    display: "grid",
    gridAutoFlow: "column",
    maxWidth: "85vw",
    justifyContent: "flex-start",
    overflowX: "auto",
    gridTemplateRows: `repeat(${Math.min(8, scorableObjectives.length)}, auto)`,
    gap: responsivePixels(4),
  };
  function getResearchableTechs(factionName: string) {
    const faction = factions[factionName];
    if (!faction) {
      return [];
    }
    if (factionName === "Nekro Virus") {
      const addedTechs = getResearchedTechs(currentTurn, "Nekro Virus");
      const nekroTechs = new Set<string>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((techName) => {
          if (!hasTech(faction, techName) && !addedTechs.includes(techName)) {
            nekroTechs.add(techName);
          }
        });
      });
      return Array.from(nekroTechs).map(
        (techName) => (techs ?? {})[techName] as Tech
      );
    }
    const replaces: string[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.name)) {
        return false;
      }
      if (
        faction.name !== "Nekro Virus" &&
        tech.faction &&
        faction.name !== tech.faction
      ) {
        return false;
      }
      const researchedTechs = getResearchedTechs(currentTurn, faction.name);
      if (researchedTechs.includes(tech.name)) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.name !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.name));
    }
    return availableTechs;
  }

  const researchableTechs = getResearchableTechs(activeFactionName);

  function removePlanet(factionName: string, toRemove: PlanetEvent) {
    if (!gameid) {
      return;
    }
    unclaimPlanet(gameid, factionName, toRemove.planet);
  }

  function addPlanet(factionName: string, toAdd: Planet) {
    if (!gameid) {
      return;
    }

    claimPlanet(gameid, factionName, toAdd.name);
  }

  function addObjective(factionName: string, toScore: string) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, toScore);
  }

  function undoObjective(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, toRemove);
  }

  return (
    <div className="flexColumn largeFont" style={{ ...style }}>
      {conqueredPlanets.length > 0 ? (
        <LabeledDiv label="NEWLY CONTROLLED PLANETS">
          <React.Fragment>
            <div
              className="flexColumn"
              style={{ alignItems: "stretch", width: "100%" }}
            >
              {conqueredPlanets.map((planet) => {
                const planetObj = planets[planet.planet];
                if (!planetObj) {
                  return null;
                }
                const adjustedPlanet = applyPlanetAttachments(
                  planetObj,
                  attachments ?? {}
                );
                return (
                  <PlanetRow
                    key={planet.planet}
                    factionName={activeFactionName}
                    planet={adjustedPlanet}
                    removePlanet={() => removePlanet(activeFactionName, planet)}
                    prevOwner={planet.prevOwner}
                  />
                );
              })}
            </div>
          </React.Fragment>
        </LabeledDiv>
      ) : null}
      {claimablePlanets.length > 0 ? (
        <ClientOnlyHoverMenu
          label="Take Control of Planet"
          renderProps={(closeFn) => (
            <div className="flexRow" style={targetButtonStyle}>
              {claimablePlanets.map((planet) => {
                return (
                  <button
                    key={planet.name}
                    style={{
                      width: responsivePixels(90),
                    }}
                    onClick={() => {
                      closeFn();
                      addPlanet(activeFactionName, planet);
                    }}
                  >
                    {planet.name}
                  </button>
                );
              })}
            </div>
          )}
        ></ClientOnlyHoverMenu>
      ) : null}
      {hasCustodiansPoint ? "+1 VP for Custodians Token" : null}
      {(scoredObjectives.length > 0 && !hasCustodiansPoint) ||
      scoredObjectives.length > 1 ? (
        <LabeledDiv
          label={`Scored Action Phase ${pluralize(
            "Objective",
            scoredObjectives.length
          )}`}
        >
          <React.Fragment>
            <div className="flexColumn" style={{ alignItems: "stretch" }}>
              {scoredObjectives.map((objective) => {
                if (!objectives) {
                  return null;
                }
                if (
                  objective === "Custodians Token" ||
                  objective === "Support for the Throne"
                ) {
                  return null;
                }
                const objectiveObj = objectives[objective];
                if (!objectiveObj) {
                  return null;
                }
                return (
                  <ObjectiveRow
                    key={objective}
                    hideScorers={true}
                    objective={objectiveObj}
                    removeObjective={() =>
                      undoObjective(activeFactionName, objective)
                    }
                  />
                );
              })}
            </div>
          </React.Fragment>
        </LabeledDiv>
      ) : null}
      {scorableObjectives.length > 0 && scoredObjectives.length < 4 ? (
        <ClientOnlyHoverMenu
          label="Score Action Phase Objective"
          renderProps={(closeFn) => (
            <div className="flexColumn" style={{ ...secretButtonStyle }}>
              {scorableObjectives.map((objective) => {
                return (
                  <button
                    key={objective.name}
                    onClick={() => {
                      closeFn();
                      addObjective(activeFactionName, objective.name);
                    }}
                  >
                    {objective.name}
                  </button>
                );
              })}
            </div>
          )}
        ></ClientOnlyHoverMenu>
      ) : null}
      {activeFactionName === "Nekro Virus" &&
      (nekroTechs.length > 0 || researchableTechs.length > 0) ? (
        <React.Fragment>
          {nekroTechs.length > 0 ? (
            <LabeledDiv label="TECHNOLOGICAL SINGULARITY">
              <div className="flexColumn" style={{ alignItems: "stretch" }}>
                {nekroTechs.map((tech) => {
                  const techObj = techs[tech];
                  if (!techObj) {
                    return null;
                  }
                  return (
                    <TechRow
                      key={tech}
                      tech={techObj}
                      removeTech={() =>
                        removeTechLocal(activeFactionName, tech)
                      }
                    />
                  );
                })}
              </div>
            </LabeledDiv>
          ) : null}
          {nekroTechs.length < 4 && researchableTechs.length > 0 ? (
            <TechSelectHoverMenu
              factionName="Nekro Virus"
              label="Technological Singularity"
              techs={researchableTechs}
              selectTech={(tech) => addTechLocal(activeFactionName, tech)}
            />
          ) : null}
        </React.Fragment>
      ) : null}
      {becomeAMartyr && possibleMartyrs.size > 0 ? (
        <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
          <LabeledLine leftLabel="Other Factions" />
          <div className="flexRow">
            <ObjectiveRow objective={becomeAMartyr} hideScorers />
            {becomeAMartyr.type === "SECRET" || possibleMartyrs.size === 1 ? (
              <FactionSelectRadialMenu
                onSelect={(factionName, prevFaction) => {
                  if (factionName && prevFaction) {
                    undoObjective(prevFaction, "Become a Martyr");
                    addObjective(factionName, "Become a Martyr");
                  } else if (prevFaction) {
                    undoObjective(prevFaction, "Become a Martyr");
                  } else if (factionName) {
                    addObjective(factionName, "Become a Martyr");
                  }
                }}
                borderColor={getFactionColor(factions[currentMartyrs[0] ?? ""])}
                selectedFaction={currentMartyrs[0]}
                options={orderedMartyrs}
              />
            ) : (
              orderedMartyrs.map((factionName) => {
                const current = hasScoredObjective(factionName, becomeAMartyr);
                return (
                  <div
                    key={factionName}
                    className="flexRow hiddenButtonParent"
                    style={{
                      position: "relative",
                      width: responsivePixels(32),
                      height: responsivePixels(32),
                    }}
                  >
                    <FullFactionSymbol faction={factionName} />
                    <div
                      className="flexRow"
                      style={{
                        position: "absolute",
                        backgroundColor: "#222",
                        cursor: "pointer",
                        borderRadius: "100%",
                        marginLeft: "60%",
                        marginTop: "60%",
                        boxShadow: `${responsivePixels(1)} ${responsivePixels(
                          1
                        )} ${responsivePixels(4)} black`,
                        width: responsivePixels(20),
                        height: responsivePixels(20),
                        color: current ? "green" : "red",
                      }}
                      onClick={() => {
                        if (!gameid) {
                          return;
                        }
                        if (current) {
                          undoObjective(factionName, "Become a Martyr");
                        } else {
                          addObjective(factionName, "Become a Martyr");
                        }
                      }}
                    >
                      {current ? (
                        <div
                          className="symbol"
                          style={{
                            fontSize: responsivePixels(16),
                            lineHeight: responsivePixels(16),
                          }}
                        >
                          ✓
                        </div>
                      ) : (
                        <div
                          className="flexRow"
                          style={{
                            width: "80%",
                            height: "80%",
                          }}
                        >
                          <SymbolX color="red" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
