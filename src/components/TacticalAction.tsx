import React, { CSSProperties, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { InfoRow } from "../InfoRow";
import { SelectableRow } from "../SelectableRow";
import { TechRow } from "../TechRow";
import { GameIdContext } from "../context/Context";
import {
  useActionLog,
  useFactions,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useSystems,
} from "../context/dataHooks";
import {
  addAttachmentAsync,
  addTechAsync,
  claimPlanetAsync,
  loseRelicAsync,
  playAdjudicatorBaalAsync,
  removeAttachmentAsync,
  removeTechAsync,
  scoreObjectiveAsync,
  unclaimPlanetAsync,
  undoAdjudicatorBaalAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import {
  getAdjudicatorBaalSystem,
  getAttachments,
  getGainedRelic,
  getObjectiveScorers,
  getResearchedTechs,
} from "../util/actionLog";
import { hasTech } from "../util/api/techs";
import { hasScoredObjective } from "../util/api/util";
import { getFactionColor } from "../util/factions";
import { applyPlanetAttachments } from "../util/planets";
import { Optional } from "../util/types/types";
import AttachmentSelectRadialMenu from "./AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import FactionIcon from "./FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import FrontierExploration from "./FrontierExploration/FrontierExploration";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import LabeledLine from "./LabeledLine/LabeledLine";
import SystemSelect from "./Map/SystemSelect";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "./ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import PlanetIcon from "./PlanetIcon/PlanetIcon";
import PlanetRow from "./PlanetRow/PlanetRow";
import styles from "./TacticalAction.module.scss";
import TechSelectHoverMenu from "./TechSelectHoverMenu/TechSelectHoverMenu";
import { rem } from "../util/util";
import { getMalliceSystemNumber } from "../util/map";
import { getMapString } from "../util/options";

export function TacticalAction({
  activeFactionId,
  attachments,
  claimablePlanets,
  conqueredPlanets,
  currentTurn,
  factions,
  frontier = true,
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
  frontier?: boolean;
  gameid: string;
  objectives: Partial<Record<ObjectiveId, Objective>>;
  planets: Partial<Record<PlanetId, Planet>>;
  scorableObjectives: Objective[];
  scoredObjectives: ObjectiveId[];
  style?: CSSProperties;
  techs: Partial<Record<TechId, Tech>>;
}) {
  const gameId = useContext(GameIdContext);
  const relics = useRelics();
  const nekroTechs = getResearchedTechs(currentTurn, "Nekro Virus");

  claimablePlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
  conqueredPlanets.sort((a, b) => {
    if (a.planet > b.planet) {
      return 1;
    }
    return -1;
  });

  const intl = useIntl();

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
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(12, claimablePlanets.length)}, auto)`,
    gap: rem(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  const secretButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    alignItems: "stretch",
    display: "grid",
    gridAutoFlow: "column",
    maxWidth: "85vw",
    justifyContent: "flex-start",
    overflowX: "auto",
    gridTemplateRows: `repeat(${Math.min(5, scorableObjectives.length)}, auto)`,
    gap: rem(4),
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

  const claimedAttachments = new Set<AttachmentId>();
  for (const planet of Object.values(planets)) {
    for (const attachment of planet.attachments ?? []) {
      claimedAttachments.add(attachment);
    }
  }

  const faction = factions[activeFactionId];
  if (!faction) {
    return null;
  }

  const gainedRelic = getGainedRelic(currentTurn);
  const relic = gainedRelic ? relics[gainedRelic] : undefined;

  return (
    <div
      className={`flexColumn largeFont ${styles.TacticalAction}`}
      style={{ ...style }}
    >
      {conqueredPlanets.length > 0 ? (
        <LabeledDiv
          label={
            <FormattedMessage
              id="E9UhAA"
              description="Label for section of newly controlled planets."
              defaultMessage="Newly Controlled {count, plural, one {Planet} other {Planets}}"
              values={{ count: conqueredPlanets.length }}
            />
          }
        >
          {/* <React.Fragment> */}
          <div
            className="flexColumn"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              width: "100%",
            }}
            // style={{ alignItems: "stretch", width: "100%" }}
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
              const currentAttachment = getAttachments(
                currentTurn,
                planet.planet
              )[0];
              const availableAttachments = Object.values(attachments)
                .filter(
                  (attachment) =>
                    ((adjustedPlanet.type === "ALL" &&
                      attachment.required.type) ||
                      attachment.required.type === adjustedPlanet.type) &&
                    (attachment.id === currentAttachment ||
                      !claimedAttachments.has(attachment.id))
                )
                .map((attachment) => attachment.id);
              return (
                <div
                  key={planet.planet}
                  className="flexRow"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "subgrid",
                    gridColumn: "span 2",
                  }}
                  // style={{ justifyContent: "center", gap: 0, width: "100%" }}
                >
                  <div style={{ width: "100%" }}>
                    <PlanetRow
                      key={planet.planet}
                      factionId={activeFactionId}
                      planet={adjustedPlanet}
                      removePlanet={() => removePlanet(activeFactionId, planet)}
                      prevOwner={planet.prevOwner}
                      opts={{
                        hideAttachButton: true,
                      }}
                    />
                  </div>
                  {availableAttachments.length > 0 &&
                  (!planet.prevOwner ||
                    (activeFactionId === "Naaz-Rokha Alliance" &&
                      factions[activeFactionId]?.commander === "readied")) ? (
                    <div
                      className="flexRow"
                      style={{ justifyContent: "center" }}
                    >
                      <AttachmentSelectRadialMenu
                        attachments={availableAttachments}
                        hasSkip={adjustedPlanet.attributes.reduce(
                          (hasSkip, attribute) => {
                            if (attribute.includes("skip")) {
                              if (
                                currentAttachment &&
                                attachments[currentAttachment]?.attribute ===
                                  attribute
                              ) {
                                return planetObj.attributes.reduce(
                                  (hasSkip, attribute) => {
                                    if (attribute.includes("skip")) {
                                      return true;
                                    }
                                    return hasSkip;
                                  },
                                  false
                                );
                              }
                              return true;
                            }
                            return hasSkip;
                          },
                          false
                        )}
                        onSelect={(attachmentId, prevAttachment) => {
                          if (prevAttachment) {
                            removeAttachmentAsync(
                              gameid,
                              planet.planet,
                              prevAttachment
                            );
                          }
                          if (attachmentId) {
                            addAttachmentAsync(
                              gameid,
                              planet.planet,
                              attachmentId
                            );
                          }
                        }}
                        selectedAttachment={currentAttachment}
                        tag={
                          adjustedPlanet.type === "ALL" ? undefined : (
                            <PlanetIcon type={adjustedPlanet.type} size="60%" />
                          )
                        }
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* </React.Fragment> */}
        </LabeledDiv>
      ) : null}
      {claimablePlanets.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="+8kwFc"
              description="Text on a hover menu allowing a player to take control of planets."
              defaultMessage="Take Control of Planet"
            />
          }
          renderProps={(closeFn) => (
            <div className="flexRow" style={targetButtonStyle}>
              {claimablePlanets.map((planet) => {
                return (
                  <button
                    key={planet.id}
                    style={{
                      width: rem(90),
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
      {hasCustodiansPoint ? (
        <FormattedMessage
          id="64NLXu"
          description="Text telling the player that they gained a victory point for removing the Custodians Token."
          defaultMessage="+1 VP for Custodians Token"
        />
      ) : null}
      {(scoredObjectives.length > 0 && !hasCustodiansPoint) ||
      scoredObjectives.length > 1 ? (
        <LabeledDiv
          label={
            <FormattedMessage
              id="DGs6vS"
              description="Label for section of scored action phase objectives."
              defaultMessage="Scored Action Phase {count, plural, one {Objective} other {Objectives}}"
              values={{ count: scoredObjectives.length }}
            />
          }
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
        <ObjectiveSelectHoverMenu
          action={(_, objectiveId) => {
            addObjective(activeFactionId, objectiveId);
          }}
          label={
            <FormattedMessage
              id="fCdj3q"
              description="Text on a hover menu allowing a player to score an action phase objective."
              defaultMessage="Score Action Phase Objective"
            />
          }
          objectives={scorableObjectives}
        />
      ) : null}
      {relic ? (
        <LabeledDiv
          label={
            <FormattedMessage
              id="cqWqzv"
              description="Label for section listing the relic gained."
              defaultMessage="Gained Relic"
            />
          }
        >
          <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
            <SelectableRow
              itemId={relic.id}
              removeItem={(relicId) => {
                loseRelicAsync(gameId, activeFactionId, relicId);
              }}
            >
              <InfoRow infoTitle={relic.name} infoContent={relic.description}>
                {relic.name}
              </InfoRow>
            </SelectableRow>
            {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
          </div>
        </LabeledDiv>
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
              label={intl.formatMessage({
                id: "Nekro Virus.Abilities.Technological Singularity.Title",
                description:
                  "Title of Faction Ability: Technological Singularity",
                defaultMessage: "Technological Singularity",
              })}
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
                selectedFaction={currentMartyrs[0] as Optional<FactionId>}
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
                      width: rem(32),
                      height: rem(32),
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
                        boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                        width: rem(20),
                        height: rem(20),
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
                            fontSize: rem(16),
                            lineHeight: rem(16),
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
      {frontier &&
      hasTech(faction, "Dark Energy Tap") &&
      conqueredPlanets.length === 0 &&
      !relic ? (
        <React.Fragment>
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="GyiC2A"
                description="Text on a hover menu for selecting the result of frontier exploration."
                defaultMessage="Frontier Exploration"
              />
            }
            style={{ whiteSpace: "nowrap" }}
            buttonStyle={{ fontSize: rem(14) }}
          >
            <div
              className={styles.OuterTechSelectMenu}
              style={{
                padding: rem(8),
                alignItems: "flex-start",
                overflow: "visible",
              }}
            >
              <FrontierExploration factionId={activeFactionId} />
            </div>
          </ClientOnlyHoverMenu>
        </React.Fragment>
      ) : null}
      {activeFactionId === "Embers of Muaat" ? <AdjudicatorBaal /> : null}
    </div>
  );
}

function AdjudicatorBaal() {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const leaders = useLeaders();
  const options = useOptions();
  const planets = usePlanets();
  const systems = useSystems();

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const adjudicatorBaalSystem = getAdjudicatorBaalSystem(actionLog);

  const mapString = getMapString(options, Object.keys(factions).length);
  if (!mapString) {
    return null;
  }

  const adjudicatorBaal = leaders["Adjudicator Ba'al"];
  if (!adjudicatorBaal) {
    return null;
  }

  if (adjudicatorBaalSystem) {
    const system = systems[adjudicatorBaalSystem];
    if (!system) {
      return null;
    }
    const planetString = system.planets.join("/");
    return (
      <LabeledDiv label={adjudicatorBaal.name}>
        <SelectableRow
          itemId={`${adjudicatorBaalSystem}`}
          removeItem={() => {
            undoAdjudicatorBaalAsync(gameId, adjudicatorBaalSystem);
          }}
          style={{ fontSize: rem(14) }}
        >
          <FormattedMessage
            id="dsGVrU"
            defaultMessage="Replaced System {system}"
            description="Message telling a player which system was replaced by the Muaat hero"
            values={{ system: adjudicatorBaalSystem }}
          />
          {planetString !== "" ? ` (${planetString})` : ""}
        </SelectableRow>
      </LabeledDiv>
    );
  }

  if (adjudicatorBaal.state !== "readied") {
    return null;
  }
  return (
    <ClientOnlyHoverMenu
      label={adjudicatorBaal.name}
      buttonStyle={{ fontSize: rem(14) }}
    >
      <div
        className="flexColumn"
        style={{ width: rem(320), height: rem(320), marginBottom: rem(16) }}
      >
        <SystemSelect
          mapString={mapString}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          canSelectSystem={(systemId) => {
            const systemNumber = parseInt(systemId);
            if (
              systemNumber < 19 ||
              (systemNumber > 50 && systemNumber < 59) ||
              (systemNumber > 80 && systemNumber < 82) ||
              (systemNumber > 82 && systemNumber < 1037)
            ) {
              return false;
            }
            return true;
          }}
          onSelect={(systemId) => {
            const systemNumber = parseInt(systemId);
            if (!systemNumber) {
              return;
            }

            if (
              systemNumber < 19 ||
              (systemNumber > 50 && systemNumber < 59) ||
              (systemNumber > 80 && systemNumber < 82) ||
              (systemNumber > 82 && systemNumber < 1037)
            ) {
              return;
            }

            playAdjudicatorBaalAsync(gameId, systemId as SystemId);
          }}
          mallice={getMalliceSystemNumber(options, planets, factions)}
        />
      </div>
    </ClientOnlyHoverMenu>
  );
}
