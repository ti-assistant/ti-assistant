import React, { CSSProperties } from "react";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { TechRow } from "../TechRow";
import {
  addTechAsync,
  claimPlanetAsync,
  removeTechAsync,
  scoreObjectiveAsync,
  unclaimPlanetAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import { TechSelectHoverMenu } from "../main/util/TechSelectHoverMenu";
import { getObjectiveScorers, getResearchedTechs } from "../util/actionLog";
import { hasTech } from "../util/api/techs";
import { hasScoredObjective } from "../util/api/util";
import { getFactionColor } from "../util/factions";
import { applyPlanetAttachments } from "../util/planets";
import { pluralize, responsivePixels } from "../util/util";
import FactionIcon from "./FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import LabeledLine from "./LabeledLine/LabeledLine";
import PlanetRow from "./PlanetRow/PlanetRow";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import styles from "./TacticalAction.module.scss";

export function TacticalAction({
  activeFactionId,
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
  activeFactionId: FactionId;
  attachments: Partial<Record<AttachmentId, Attachment>>;
  claimablePlanets: Planet[];
  conqueredPlanets: ClaimPlanetEvent[];
  currentTurn: ActionLogEntry[];
  factions: Partial<Record<FactionId, Faction>>;
  gameid: string;
  objectives: Partial<Record<ObjectiveId, Objective>>;
  planets: Partial<Record<PlanetId, Planet>>;
  scorableObjectives: Objective[];
  scoredObjectives: ObjectiveId[];
  style?: CSSProperties;
  techs: Partial<Record<TechId, Tech>>;
}) {
  const nekroTechs = getResearchedTechs(currentTurn, "Nekro Virus");

  const custodiansScorer = getObjectiveScorers(
    currentTurn,
    "Custodians Token"
  )[0];

  const currentMartyrs = getObjectiveScorers(
    currentTurn,
    "Become a Martyr"
  ) as FactionId[];
  const possibleMartyrs = new Set(currentMartyrs);
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
        conqueredPlanet.prevOwner !== activeFactionId &&
        !scorers.includes(conqueredPlanet.prevOwner)
      ) {
        possibleMartyrs.add(conqueredPlanet.prevOwner as FactionId);
      }
    }
  }
  const orderedMartyrs = Array.from(possibleMartyrs).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    return -1;
  });

  function removeTechLocal(factionId: FactionId, toRemove: TechId) {
    if (!gameid) {
      return;
    }
    removeTechAsync(gameid, factionId, toRemove);
  }

  function addTechLocal(factionId: FactionId, tech: Tech) {
    if (!gameid) {
      return;
    }
    addTechAsync(gameid, factionId, tech.id);
  }

  let hasCustodiansPoint = false;
  const mecatolConquerers = currentTurn.filter(
    (logEntry) =>
      logEntry.data.action === "CLAIM_PLANET" &&
      logEntry.data.event.planet === "Mecatol Rex"
  );
  if (mecatolConquerers[0]) {
    const event = (mecatolConquerers[0].data as ClaimPlanetData).event;
    if (event.faction === activeFactionId && !event.prevOwner) {
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
  function getResearchableTechs(factionId: FactionId) {
    const faction = factions[factionId];
    if (!faction) {
      return [];
    }
    if (factionId === "Nekro Virus") {
      const addedTechs = getResearchedTechs(currentTurn, "Nekro Virus");
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((id) => {
          const techId = id as TechId;
          if (!hasTech(faction, techId) && !addedTechs.includes(techId)) {
            nekroTechs.add(techId);
          }
        });
      });
      return Array.from(nekroTechs).map(
        (techId) => (techs ?? {})[techId] as Tech
      );
    }
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.id)) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      const researchedTechs = getResearchedTechs(currentTurn, faction.id);
      if (researchedTechs.includes(tech.id)) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.id !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.id));
    }
    return availableTechs;
  }

  const researchableTechs = getResearchableTechs(activeFactionId);

  function removePlanet(factionId: FactionId, toRemove: ClaimPlanetEvent) {
    if (!gameid) {
      return;
    }
    unclaimPlanetAsync(gameid, factionId, toRemove.planet);
  }

  function addPlanet(factionId: FactionId, toAdd: Planet) {
    if (!gameid) {
      return;
    }

    claimPlanetAsync(gameid, factionId, toAdd.id);
  }

  function addObjective(factionId: FactionId, toScore: ObjectiveId) {
    if (!gameid) {
      return;
    }
    scoreObjectiveAsync(gameid, factionId, toScore);
  }

  function undoObjective(factionId: FactionId, toRemove: ObjectiveId) {
    if (!gameid) {
      return;
    }
    unscoreObjectiveAsync(gameid, factionId, toRemove);
  }

  return (
    <div
      className={`flexColumn largeFont ${styles.TacticalAction}`}
      style={{ ...style }}
    >
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
                    factionId={activeFactionId}
                    planet={adjustedPlanet}
                    removePlanet={() => removePlanet(activeFactionId, planet)}
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
                    key={planet.id}
                    style={{
                      width: responsivePixels(90),
                    }}
                    onClick={() => {
                      closeFn();
                      addPlanet(activeFactionId, planet);
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
                      undoObjective(activeFactionId, objective)
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
                    key={objective.id}
                    onClick={() => {
                      closeFn();
                      addObjective(activeFactionId, objective.id);
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
      {activeFactionId === "Nekro Virus" &&
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
                      removeTech={() => removeTechLocal(activeFactionId, tech)}
                    />
                  );
                })}
              </div>
            </LabeledDiv>
          ) : null}
          {nekroTechs.length < 4 && researchableTechs.length > 0 ? (
            <TechSelectHoverMenu
              factionId="Nekro Virus"
              label="Technological Singularity"
              techs={researchableTechs}
              selectTech={(tech) => addTechLocal(activeFactionId, tech)}
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
                onSelect={(factionId, prevFaction) => {
                  if (factionId && prevFaction) {
                    undoObjective(prevFaction, "Become a Martyr");
                    addObjective(factionId, "Become a Martyr");
                  } else if (prevFaction) {
                    undoObjective(prevFaction, "Become a Martyr");
                  } else if (factionId) {
                    addObjective(factionId, "Become a Martyr");
                  }
                }}
                borderColor={getFactionColor(
                  currentMartyrs[0] ? factions[currentMartyrs[0]] : undefined
                )}
                selectedFaction={currentMartyrs[0] as FactionId | undefined}
                factions={orderedMartyrs}
              />
            ) : (
              orderedMartyrs.map((factionId) => {
                const current = hasScoredObjective(factionId, becomeAMartyr);
                return (
                  <div
                    key={factionId}
                    className="flexRow hiddenButtonParent"
                    style={{
                      position: "relative",
                      width: responsivePixels(32),
                      height: responsivePixels(32),
                    }}
                  >
                    <FactionIcon factionId={factionId} size="100%" />
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
                          undoObjective(factionId, "Become a Martyr");
                        } else {
                          addObjective(factionId, "Become a Martyr");
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
