import React, { CSSProperties, PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  useAttachments,
  useCurrentTurn,
  useFactions,
  useGameId,
  useLeaders,
  useObjectives,
  useOptions,
  usePlanets,
  useRelics,
  useSystems,
  useTechs,
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
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { InfoRow } from "../InfoRow";
import { SelectableRow } from "../SelectableRow";
import { TechRow } from "../TechRow";
import {
  getAdjudicatorBaalSystem,
  getAttachments,
  getGainedRelic,
  getLogEntries,
  getResearchedTechs,
} from "../util/actionLog";
import { hasTech } from "../util/api/techs";
import { getWormholeNexusSystemNumber } from "../util/map";
import { getMapString } from "../util/options";
import { applyPlanetAttachments } from "../util/planets";
import { objectKeys, rem } from "../util/util";
import AttachmentSelectRadialMenu from "./AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import FrontierExploration from "./FrontierExploration/FrontierExploration";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import LabeledLine from "./LabeledLine/LabeledLine";
import GameMap from "./Map/GameMap";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import ScoreObjectiveRow from "./ObjectiveRow/ScoreObjectiveRow";
import ObjectiveSelectHoverMenu from "./ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import PlanetIcon from "./PlanetIcon/PlanetIcon";
import PlanetRow from "./PlanetRow/PlanetRow";
import styles from "./TacticalAction.module.scss";
import TechSelectHoverMenu from "./TechSelectHoverMenu/TechSelectHoverMenu";

export function TacticalAction({
  activeFactionId,
  claimablePlanets,
  conqueredPlanets,
  frontier = true,
  scorableObjectives,
  scoredObjectives,
  style = {},
}: {
  activeFactionId: FactionId;
  claimablePlanets: Planet[];
  conqueredPlanets: ClaimPlanetEvent[];
  frontier?: boolean;
  scorableObjectives: Objective[];
  scoredObjectives: ObjectiveId[];
  style?: CSSProperties;
}) {
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const planets = usePlanets();
  const relics = useRelics();
  const techs = useTechs();
  const nekroTechs = getResearchedTechs(currentTurn, "Nekro Virus");

  claimablePlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const intl = useIntl();

  let hasCustodiansPoint = false;
  const mecatolConquerers = getLogEntries<ClaimPlanetData>(
    currentTurn,
    "CLAIM_PLANET"
  ).filter((logEntry) => logEntry.data.event.planet === "Mecatol Rex");
  if (mecatolConquerers[0]) {
    const event = mecatolConquerers[0].data.event;
    if (event.faction === activeFactionId && !event.prevOwner) {
      hasCustodiansPoint = true;
    }
  }

  const maxPlanets = claimablePlanets.length > 50 ? 15 : 12;
  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(
      maxPlanets,
      claimablePlanets.length
    )}, auto)`,
    gap: rem(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  function getResearchableTechs(factionId: FactionId) {
    const faction = factions[factionId];
    if (!faction) {
      return [];
    }
    if (factionId === "Nekro Virus") {
      const addedTechs = getResearchedTechs(currentTurn, "Nekro Virus");
      const nekroTechs = new Set<TechId>();
      Object.values(factions).forEach((otherFaction) => {
        objectKeys(otherFaction.techs).forEach((id) => {
          const techId = id;
          if (!hasTech(faction, techId) && !addedTechs.includes(techId)) {
            nekroTechs.add(techId);
          }
        });
      });
      return Array.from(nekroTechs).map((techId) => techs[techId] as Tech);
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
          blur
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
              const hasNRACommander =
                activeFactionId === "Naaz-Rokha Alliance" &&
                leaders["Dart and Tai"]?.state === "readied";
              return (
                <div
                  key={planet.planet}
                  className="flexRow"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "subgrid",
                    gridColumn: "span 2",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <PlanetRow
                      key={planet.planet}
                      factionId={activeFactionId}
                      planet={adjustedPlanet}
                      removePlanet={() =>
                        unclaimPlanetAsync(
                          gameId,
                          activeFactionId,
                          planet.planet
                        )
                      }
                      prevOwner={planet.prevOwner}
                      opts={{
                        hideAttachButton: true,
                      }}
                    />
                  </div>
                  {availableAttachments.length > 0 &&
                  (!planet.prevOwner || hasNRACommander) ? (
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
                              gameId,
                              planet.planet,
                              prevAttachment
                            );
                          }
                          if (attachmentId) {
                            addAttachmentAsync(
                              gameId,
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
                      width: claimablePlanets.length > 50 ? rem(72) : rem(90),
                      fontSize:
                        claimablePlanets.length > 50 ? rem(14) : undefined,
                    }}
                    onClick={() => {
                      closeFn();
                      claimPlanetAsync(gameId, activeFactionId, planet.id);
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
          blur
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
                      unscoreObjectiveAsync(gameId, activeFactionId, objective)
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
            scoreObjectiveAsync(gameId, activeFactionId, objectiveId);
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
          blur
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
            <LabeledDiv
              label={intl.formatMessage({
                id: "Nekro Virus.Abilities.Technological Singularity.Title",
                description:
                  "Title of Faction Ability: Technological Singularity",
                defaultMessage: "Technological Singularity",
              })}
              blur
            >
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
                        removeTechAsync(gameId, activeFactionId, tech)
                      }
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
              selectTech={(tech) =>
                addTechAsync(gameId, activeFactionId, tech.id)
              }
            />
          ) : null}
        </React.Fragment>
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

      <OtherFactionsSection>
        <BecomeAMartyr conqueredPlanets={conqueredPlanets} />
      </OtherFactionsSection>
    </div>
  );
}

function OtherFactionsSection({ children }: PropsWithChildren) {
  return (
    <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
      <LabeledLine
        className={styles.OtherFactionsLabel}
        leftLabel="Other Factions"
      />
      {children}
    </div>
  );
}

function AdjudicatorBaal() {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const options = useOptions();
  const planets = usePlanets();
  const systems = useSystems();

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const adjudicatorBaalSystem = getAdjudicatorBaalSystem(currentTurn);

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
      <LabeledDiv label={adjudicatorBaal.name} blur>
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
        <GameMap
          hideLegend
          mapString={mapString}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          planets={planets}
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
          wormholeNexus={getWormholeNexusSystemNumber(
            options,
            planets,
            factions
          )}
        />
      </div>
    </ClientOnlyHoverMenu>
  );
}

function BecomeAMartyr({
  conqueredPlanets,
}: {
  conqueredPlanets: ClaimPlanetEvent[];
}) {
  const planets = usePlanets();

  function canScore(faction: Faction) {
    for (const conqueredPlanet of conqueredPlanets) {
      const planet = planets[conqueredPlanet.planet];
      const prevOwner = conqueredPlanet.prevOwner;
      if (!planet || !planet.home || !prevOwner) {
        continue;
      }
      if (faction.id === prevOwner) {
        return true;
      }
    }
    return false;
  }

  return (
    <ScoreObjectiveRow objectiveId="Become a Martyr" canScore={canScore} />
  );
}
