import React, { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LockedButtons } from "../LockedButton";
import { SmallStrategyCard } from "../StrategyCard";
import { TechRow } from "../TechRow";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import AttachmentSelectRadialMenu from "../components/AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import Chip from "../components/Chip/Chip";
import FactionCard from "../components/FactionCard/FactionCard";
import FactionCircle from "../components/FactionCircle/FactionCircle";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../components/LabeledLine/LabeledLine";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import PlanetIcon from "../components/PlanetIcon/PlanetIcon";
import PlanetRow from "../components/PlanetRow/PlanetRow";
import PromissoryMenu from "../components/PromissoryMenu/PromissoryMenu";
import { TacticalAction } from "../components/TacticalAction";
import TechSelectHoverMenu from "../components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  useActionLog,
  useAttachments,
  useFactions,
  useGameId,
  useGameState,
  useLeaders,
  useObjectives,
  usePlanets,
  useStrategyCards,
  useTechs,
} from "../context/dataHooks";
import {
  addAttachmentAsync,
  addTechAsync,
  advancePhaseAsync,
  claimPlanetAsync,
  endTurnAsync,
  markSecondaryAsync,
  removeAttachmentAsync,
  removeTechAsync,
  scoreObjectiveAsync,
  selectActionAsync,
  setSpeakerAsync,
  unclaimPlanetAsync,
  unscoreObjectiveAsync,
  unselectActionAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import { getAttachments, getResearchedTechs } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import {
  getNewSpeakerEventFromLog,
  getSelectedActionFromLog,
} from "../util/api/data";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getOnDeckFaction, getStrategyCardsForFaction } from "../util/helpers";
import { applyPlanetAttachments } from "../util/planets";
import { phaseString } from "../util/strings";
import { rem } from "../util/util";
import styles from "./ActionPhase.module.scss";
import { ComponentAction } from "./util/ComponentAction";

interface FactionActionButtonsProps {
  factionId: FactionId;
}

function SecondaryCheck({
  activeFactionId,
  gameId,
  orderedFactions,
}: {
  activeFactionId: FactionId;
  gameId: string;
  orderedFactions: Faction[];
}) {
  let allCompleted = true;
  return (
    <div className="flexColumn hugeFont">
      <div
        className="flexRow"
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {orderedFactions.map((faction) => {
          if (faction.id === activeFactionId) {
            return null;
          }
          const secondaryState = faction.secondary ?? "PENDING";
          const color = getFactionColor(faction);
          if (secondaryState === "PENDING") {
            allCompleted = false;
          }
          return (
            <FactionCircle
              key={faction.id}
              blur
              borderColor={color}
              fade={secondaryState !== "PENDING"}
              factionId={faction.id}
              onClick={() => {
                if (!gameId) {
                  return;
                }
                let nextState: Secondary = "DONE";
                switch (secondaryState) {
                  case "DONE":
                    nextState = "SKIPPED";
                    break;
                  case "PENDING":
                    nextState = "DONE";
                    break;
                  case "SKIPPED":
                    nextState = "PENDING";
                    break;
                }
                markSecondaryAsync(gameId, faction.id, nextState);
              }}
              size={52}
              tag={
                secondaryState === "PENDING" ? undefined : (
                  <div
                    className="flexRow largeFont"
                    style={{
                      width: "80%",
                      height: "80%",
                      color: secondaryState === "DONE" ? "green" : "red",
                      // fontWeight: "bold",
                    }}
                  >
                    {secondaryState === "DONE" ? (
                      <div
                        className="symbol"
                        style={{
                          fontSize: rem(18),
                          lineHeight: rem(18),
                        }}
                      >
                        ✓
                      </div>
                    ) : (
                      <SymbolX color="red" />
                    )}
                  </div>
                )
              }
              tagBorderColor={secondaryState === "DONE" ? "green" : "red"}
            />
          );
        })}
      </div>
      {allCompleted ? "Secondaries completed" : null}
    </div>
  );
}

export function FactionActionButtons({ factionId }: FactionActionButtonsProps) {
  const actionLog = useActionLog();
  const factions = useFactions();
  const gameId = useGameId();
  const strategyCards = useStrategyCards();

  function canFactionPass(factionId: FactionId) {
    for (const card of getStrategyCardsForFaction(strategyCards, factionId)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  const selectedAction = getSelectedActionFromLog(actionLog);

  function toggleAction(action: Action) {
    if (!gameId) {
      return;
    }
    if (selectedAction === action) {
      unselectActionAsync(gameId, action);
    } else {
      selectActionAsync(gameId, action);
    }
  }

  const activeFaction = factions[factionId];
  if (!activeFaction) {
    return null;
  }

  return (
    <div
      className="flexRow"
      style={{
        padding: `0 ${rem(8)}`,
        boxSizing: "border-box",
        width: "100%",
        flexWrap: "wrap",
        fontFamily: "Myriad Pro",
        gap: rem(4),
        justifyContent: "center",
      }}
    >
      {getStrategyCardsForFaction(strategyCards, activeFaction.id).map(
        (card) => {
          if (card.used) {
            return null;
          }
          return (
            <Chip
              key={card.id}
              selected={selectedAction === card.id}
              fontSize={18}
              toggleFn={() => toggleAction(card.id)}
            >
              {card.name}
            </Chip>
          );
        }
      )}
      <Chip
        selected={selectedAction === "Tactical"}
        fontSize={18}
        toggleFn={() => toggleAction("Tactical")}
      >
        <FormattedMessage
          id="/KXhGz"
          description="Text on a button that will select a tactical action."
          defaultMessage="Tactical"
        />
      </Chip>
      <Chip
        selected={selectedAction === "Component"}
        fontSize={18}
        toggleFn={() => toggleAction("Component")}
      >
        <FormattedMessage
          id="43UU69"
          description="Text on a button that will select a component action."
          defaultMessage="Component"
        />
      </Chip>
      {canFactionPass(activeFaction.id) ? (
        <Chip
          selected={selectedAction === "Pass"}
          fontSize={18}
          toggleFn={() => toggleAction("Pass")}
        >
          <FormattedMessage
            id="7ECd6J"
            description="Text on a button that will pass."
            defaultMessage="Pass"
          />
        </Chip>
      ) : null}
    </div>
  );
}

export function FactionActions({ factionId }: { factionId: FactionId }) {
  return (
    <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
      <div style={{ fontSize: rem(20) }}>
        <FormattedMessage
          id="YeYE6S"
          description="Label telling the user to select the action a player took."
          defaultMessage="Select Action"
        />
      </div>
      <FactionActionButtons factionId={factionId} />
    </div>
  );
}

interface AdditionalActionsProps {
  factionId: FactionId;
  style?: CSSProperties;
  ClientOnlyHoverMenuStyle?: CSSProperties;
  primaryOnly?: boolean;
  secondaryOnly?: boolean;
}

export function AdditionalActions({
  factionId,
  style = {},
  primaryOnly = false,
  secondaryOnly = false,
}: AdditionalActionsProps) {
  const actionLog = useActionLog();
  const attachments = useAttachments();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const techs = useTechs();

  const intl = useIntl();

  const activeFaction = factions[factionId];

  if (!activeFaction) {
    return null;
  }

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  function getResearchableTechs(faction: Faction) {
    const researchedTechs = getResearchedTechs(currentTurn, faction.id);
    if (faction.id === "Nekro Virus") {
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((id) => {
          const techId = id as TechId;
          if (!hasTech(faction, techId) && !researchedTechs.includes(techId)) {
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
      if (researchedTechs.includes(tech.id)) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }

  const researchableTechs = getResearchableTechs(activeFaction);

  function removePlanet(factionId: FactionId, toRemove: PlanetId) {
    if (!gameId) {
      return;
    }
    unclaimPlanetAsync(gameId, factionId, toRemove);
  }

  function addPlanet(factionId: FactionId, toAdd: Planet) {
    if (!gameId) {
      return;
    }
    claimPlanetAsync(gameId, factionId, toAdd.id);
  }

  function addObjective(factionId: FactionId, toScore: ObjectiveId) {
    if (!gameId) {
      return;
    }
    scoreObjectiveAsync(gameId, factionId, toScore);
  }

  function undoObjective(factionId: FactionId, toRemove: ObjectiveId) {
    if (!gameId) {
      return;
    }
    unscoreObjectiveAsync(gameId, factionId, toRemove);
  }

  function removeTechLocal(factionId: FactionId, toRemove: TechId) {
    if (!gameId) {
      return;
    }
    removeTechAsync(gameId, factionId, toRemove);
  }

  function researchTech(factionId: FactionId, tech: Tech) {
    if (!gameId) {
      return;
    }
    addTechAsync(gameId, factionId, tech.id);
  }

  async function selectSpeaker(factionId: FactionId) {
    if (!gameId) {
      return;
    }
    setSpeakerAsync(gameId, factionId);
  }

  const newSpeakerEvent = getNewSpeakerEventFromLog(actionLog);

  async function resetSpeaker() {
    if (!gameId || !newSpeakerEvent?.prevSpeaker) {
      return;
    }
    setSpeakerAsync(gameId, newSpeakerEvent.prevSpeaker);
  }

  function lastFaction() {
    const numFactions = Object.keys(factions).length;
    const numPassed = Object.values(factions).filter(
      (faction) => faction.passed
    ).length;
    return numFactions - 1 === numPassed;
  }

  const claimedPlanets = currentTurn
    .filter(
      (logEntry) =>
        logEntry.data.action === "CLAIM_PLANET" &&
        logEntry.data.event.faction === activeFaction.id
    )
    .map((logEntry) => {
      return (logEntry.data as ClaimPlanetData).event;
    });
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if (!planets) {
      return false;
    }
    if (planet.owner === activeFaction.id) {
      return false;
    }
    if (planet.locked) {
      return false;
    }
    for (const claimedPlanet of claimedPlanets) {
      if (claimedPlanet.planet === planet.id) {
        return false;
      }
    }
    if (claimedPlanets.length > 0) {
      const claimedPlanet = claimedPlanets[0]
        ? planets[claimedPlanets[0].planet]
        : null;
      if (claimedPlanet?.faction) {
        return planet.faction === claimedPlanet.faction;
      }
      if (claimedPlanet?.system) {
        return planet.system === claimedPlanet.system;
      }
      return false;
    }
    return true;
  });
  const scoredObjectives = currentTurn
    .filter(
      (logEntry) =>
        logEntry.data.action === "SCORE_OBJECTIVE" &&
        logEntry.data.event.faction === activeFaction.id
    )
    .map((logEntry) => (logEntry.data as ScoreObjectiveData).event.objective);
  const scoredActionPhaseObjectives = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return objectiveObj.phase === "ACTION";
  });
  const scorableObjectives = Object.values(objectives).filter((objective) => {
    const scorers = objective.scorers ?? [];
    if (scorers.includes(activeFaction.id)) {
      return false;
    }
    if (scoredObjectives.includes(objective.id)) {
      return false;
    }
    if (
      objective.id === "Become a Martyr" ||
      objective.id === "Prove Endurance"
    ) {
      return false;
    }
    if (objective.type === "SECRET" && scorers.length > 0) {
      return false;
    }
    return objective.phase === "ACTION";
  });

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

  const orderedFactions = Object.values(factions).sort((a, b) => {
    if (a.order === activeFaction.order) {
      return -1;
    }
    if (b.order === activeFaction.order) {
      return 1;
    }
    if (a.order < activeFaction.order) {
      if (b.order < activeFaction.order) {
        return a.order - b.order;
      }
      return 1;
    }
    if (b.order > activeFaction.order) {
      return a.order - b.order;
    }
    return -1;
  });

  const selectedAction = getSelectedActionFromLog(actionLog);

  switch (selectedAction) {
    case "Technology":
      const researchedTech = getResearchedTechs(currentTurn, factionId);
      if (!!primaryOnly || !!secondaryOnly) {
        const isActive = state?.activeplayer === factionId;
        const numTechs =
          isActive || factionId === "Universities of Jol-Nar" ? 2 : 1;
        return activeFaction.id !== "Nekro Virus" ? (
          <div className="flexColumn largeFont" style={{ width: "100%" }}>
            <LabeledLine
              leftLabel={
                isActive ? "Technology Primary" : "Technology Secondary"
              }
            />
            <React.Fragment>
              {researchedTech.length > 0 ? (
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {researchedTech.map((tech) => {
                    const techObj = techs[tech];
                    if (!techObj) {
                      return null;
                    }
                    return (
                      <TechRow
                        key={tech}
                        tech={techObj}
                        removeTech={() => {
                          // if (gameId && !isActive) {
                          //   markSecondary(
                          //     gameId,
                          //     activeFaction.id,
                          //     "PENDING"
                          //   );
                          // }
                          removeTechLocal(activeFaction.id, tech);
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}
              {researchedTech.length < numTechs ? (
                <TechSelectHoverMenu
                  factionId={activeFaction.id}
                  label={intl.formatMessage({
                    id: "3qIvsL",
                    description: "Label on a hover menu used to research tech.",
                    defaultMessage: "Research Tech",
                  })}
                  techs={researchableTechs}
                  selectTech={(tech) => {
                    // if (
                    //   gameId &&
                    //   !isActive &&
                    //   researchedTech.length + 1 === numTechs
                    // ) {
                    //   markSecondary(gameId, activeFaction.id, "DONE");
                    // }
                    researchTech(activeFaction.id, tech);
                  }}
                />
              ) : null}
              {isActive ? (
                <React.Fragment>
                  <LabeledLine
                    leftLabel={
                      <FormattedMessage
                        id="PBW6vs"
                        description="The alternate ability for a strategy card."
                        defaultMessage="Secondary"
                      />
                    }
                  />
                  <SecondaryCheck
                    activeFactionId={activeFaction.id}
                    gameId={gameId ?? ""}
                    orderedFactions={orderedFactions}
                  />
                </React.Fragment>
              ) : null}
            </React.Fragment>
          </div>
        ) : null;
      }
      return (
        <div className="flexColumn largeFont" style={{ ...style, gap: rem(4) }}>
          {activeFaction.id !== "Nekro Virus" ? (
            <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
              <LabeledLine
                leftLabel={
                  <FormattedMessage
                    id="mhqGMn"
                    description="The main ability for a strategy card."
                    defaultMessage="Primary"
                  />
                }
              />

              <div style={{ width: "fit-content" }}>
                <LabeledDiv
                  label={getFactionName(activeFaction)}
                  color={getFactionColor(activeFaction)}
                >
                  {researchedTech.length > 0 ? (
                    <div
                      className="flexColumn"
                      style={{ alignItems: "stretch", gap: 0 }}
                    >
                      {researchedTech.map((tech) => {
                        const techObj = techs[tech];
                        if (!techObj) {
                          return null;
                        }
                        return (
                          <TechRow
                            key={tech}
                            tech={techObj}
                            removeTech={() =>
                              removeTechLocal(activeFaction.id, tech)
                            }
                          />
                        );
                      })}
                    </div>
                  ) : null}
                  {researchedTech.length < 2 ? (
                    <TechSelectHoverMenu
                      factionId={activeFaction.id}
                      techs={researchableTechs}
                      label={intl.formatMessage({
                        id: "3qIvsL",
                        description:
                          "Label on a hover menu used to research tech.",
                        defaultMessage: "Research Tech",
                      })}
                      selectTech={(tech) =>
                        researchTech(activeFaction.id, tech)
                      }
                    />
                  ) : null}
                </LabeledDiv>
              </div>
            </div>
          ) : null}
          <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
            <LabeledLine
              leftLabel={
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              }
            />
            <div
              className="flexRow mediumFont"
              style={{
                paddingTop: rem(4),
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {orderedFactions.map((faction) => {
                if (
                  faction.id === activeFaction.id ||
                  faction.id === "Nekro Virus"
                ) {
                  return null;
                }
                let maxTechs = 1;
                if (faction.id === "Universities of Jol-Nar") {
                  maxTechs = 2;
                  // TODO: Add ability for people to copy them.
                }
                const researchedTechs = getResearchedTechs(
                  currentTurn,
                  faction.id
                );
                const availableTechs = getResearchableTechs(faction);
                const secondaryState =
                  factions[faction.id]?.secondary ?? "PENDING";
                if (
                  researchedTechs.length === 0 &&
                  secondaryState === "SKIPPED"
                ) {
                  return null;
                }
                return (
                  <LabeledDiv
                    key={faction.id}
                    label={getFactionName(faction)}
                    color={getFactionColor(faction)}
                    style={{ width: "48%" }}
                    opts={{ fixedWidth: true }}
                  >
                    <React.Fragment>
                      {researchedTechs.map((tech) => {
                        const techObj = techs[tech];
                        if (!techObj) {
                          return null;
                        }
                        return (
                          <TechRow
                            key={tech}
                            tech={techObj}
                            removeTech={() => {
                              // if (gameId) {
                              //   markSecondary(gameId, faction.id, "PENDING");
                              // }
                              removeTechLocal(faction.id, tech);
                            }}
                            opts={{ hideSymbols: true }}
                          />
                        );
                      })}
                      {researchedTechs.length < maxTechs ? (
                        <TechSelectHoverMenu
                          factionId={faction.id}
                          label={intl.formatMessage({
                            id: "3qIvsL",
                            description:
                              "Label on a hover menu used to research tech.",
                            defaultMessage: "Research Tech",
                          })}
                          techs={availableTechs}
                          selectTech={(tech) => {
                            // if (
                            //   gameId &&
                            //   researchedTechs.length + 1 === maxTechs
                            // ) {
                            //   markSecondary(gameId, faction.id, "DONE");
                            // }
                            researchTech(faction.id, tech);
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  </LabeledDiv>
                );
              })}
              <SecondaryCheck
                activeFactionId={activeFaction.id}
                gameId={gameId ?? ""}
                orderedFactions={orderedFactions}
              />
            </div>
          </div>
        </div>
      );
    case "Politics":
      const selectedSpeaker = newSpeakerEvent?.newSpeaker
        ? factions[newSpeakerEvent.newSpeaker]
        : undefined;
      const mapOrderedFactions = [...orderedFactions].sort(
        (a, b) => a.mapPosition - b.mapPosition
      );
      return (
        <div
          className="flexColumn"
          style={{ gap: rem(4), width: "100%", ...style }}
        >
          <React.Fragment>
            <LabeledLine
              leftLabel={
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              }
            />
            <div
              className="flexRow largeFont"
              style={{
                justifyContent: "flex-start",
                paddingLeft: rem(24),
                width: "100%",
              }}
            >
              <FormattedMessage
                id="pTiYPm"
                description="Label for a selector selecting a new speaker."
                defaultMessage="New Speaker"
              />
              :
              <FactionSelectRadialMenu
                borderColor={
                  selectedSpeaker ? getFactionColor(selectedSpeaker) : undefined
                }
                onSelect={(factionId, _) => {
                  if (factionId) {
                    selectSpeaker(factionId);
                  } else {
                    resetSpeaker();
                  }
                }}
                factions={mapOrderedFactions.map((faction) => faction.id)}
                invalidFactions={[
                  selectedSpeaker
                    ? (newSpeakerEvent?.prevSpeaker as FactionId)
                    : state.speaker,
                ]}
                selectedFaction={selectedSpeaker?.id}
                size={52}
              />
            </div>
          </React.Fragment>
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            }
          />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameId={gameId ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Diplomacy":
      if (activeFaction.id === "Xxcha Kingdom") {
        const peaceAccordsPlanets = claimablePlanets.filter(
          (planet) => planet.id !== "Mecatol Rex"
        );
        return (
          <div className="flexColumn largeFont" style={{ ...style }}>
            <LabeledLine
              leftLabel={
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              }
            />
            <LabeledDiv
              label={
                <FormattedMessage
                  id="Xxcha Kingdom.Abilities.Peace Accords.Title"
                  defaultMessage="Peace Accords"
                  description="Title of Faction Ability: Peace Accords"
                />
              }
            >
              <React.Fragment>
                {claimedPlanets.length > 0 ? (
                  <div
                    className="flexColumn"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    {claimedPlanets.map((planet) => {
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
                      const claimedAttachments = new Set<AttachmentId>();
                      for (const planet of Object.values(planets)) {
                        for (const attachment of planet.attachments ?? []) {
                          claimedAttachments.add(attachment);
                        }
                      }
                      const availableAttachments = Object.values(attachments)
                        .filter(
                          (attachment) =>
                            ((adjustedPlanet.type === "ALL" &&
                              attachment.required.type) ||
                              attachment.required.type ===
                                adjustedPlanet.type) &&
                            (attachment.id === currentAttachment ||
                              !claimedAttachments.has(attachment.id))
                        )
                        .map((attachment) => attachment.id);
                      return (
                        <div
                          key={planet.planet}
                          className="flexRow"
                          style={{ width: "100%" }}
                        >
                          <div style={{ width: "100%" }}>
                            <PlanetRow
                              factionId={"Xxcha Kingdom"}
                              planet={adjustedPlanet}
                              removePlanet={() => {
                                removePlanet("Xxcha Kingdom", planet.planet);
                              }}
                            />
                          </div>
                          {availableAttachments.length > 0 &&
                          !planet.prevOwner ? (
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
                                        attachments[currentAttachment]
                                          ?.attribute === attribute
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
                                    <PlanetIcon
                                      type={adjustedPlanet.type}
                                      size="60%"
                                    />
                                  )
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {peaceAccordsPlanets.length > 0 &&
                claimedPlanets.length === 0 ? (
                  <ClientOnlyHoverMenu
                    label={
                      <FormattedMessage
                        id="UJs3kj"
                        description="Text on a hover menu for claiming an empty planet."
                        defaultMessage="Claim Empty Planet"
                      />
                    }
                  >
                    <div className="flexRow" style={targetButtonStyle}>
                      {peaceAccordsPlanets.map((planet) => {
                        return (
                          <button
                            key={planet.id}
                            style={{
                              writingMode: "horizontal-tb",
                              width: rem(90),
                            }}
                            onClick={() => addPlanet(activeFaction.id, planet)}
                          >
                            {planet.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </React.Fragment>
            </LabeledDiv>
            <LabeledLine
              leftLabel={
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              }
            />
            <SecondaryCheck
              activeFactionId={activeFaction.id}
              gameId={gameId ?? ""}
              orderedFactions={orderedFactions}
            />
          </div>
        );
      } else if (factions["Xxcha Kingdom"]) {
        const xxchaPlanets = currentTurn
          .filter(
            (logEntry) =>
              logEntry.data.action === "CLAIM_PLANET" &&
              logEntry.data.event.faction === "Xxcha Kingdom"
          )
          .map((logEntry) => {
            return (logEntry.data as ClaimPlanetData).event;
          });
        const nonXxchaPlanets = Object.values(planets ?? {}).filter(
          (planet) => {
            if (planet.owner === "Xxcha Kingdom") {
              return false;
            }
            if (planet.locked) {
              return false;
            }
            for (const claimedPlanet of claimedPlanets) {
              if (claimedPlanet.planet === planet.id) {
                return false;
              }
            }
            if (claimedPlanets.length > 0) {
              const claimedPlanet = claimedPlanets[0]
                ? planets[claimedPlanets[0].planet]
                : undefined;
              if (claimedPlanet?.system) {
                return planet.system === claimedPlanet.system;
              }
              if (claimedPlanet?.faction) {
                return planet.faction === claimedPlanet.faction;
              }
              return false;
            }
            return true;
          }
        );
        return (
          <div
            className="flexColumn largeFont"
            style={{ width: "100%", ...style }}
          >
            <LabeledLine
              leftLabel={
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              }
            />
            <LabeledDiv
              label={`${getFactionName(
                factions["Xxcha Kingdom"]
              )} - ${intl.formatMessage({
                id: "Xxcha Kingdom.Abilities.Peace Accords.Title",
                defaultMessage: "Peace Accords",
                description: "Title of Faction Ability: Peace Accords",
              })}
              `}
              color={getFactionColor(factions["Xxcha Kingdom"])}
            >
              <React.Fragment>
                {xxchaPlanets.length > 0 ? (
                  <div
                    className="flexColumn"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    {xxchaPlanets.map((planet) => {
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
                      const claimedAttachments = new Set<AttachmentId>();
                      for (const planet of Object.values(planets)) {
                        for (const attachment of planet.attachments ?? []) {
                          claimedAttachments.add(attachment);
                        }
                      }
                      const availableAttachments = Object.values(attachments)
                        .filter(
                          (attachment) =>
                            ((adjustedPlanet.type === "ALL" &&
                              attachment.required.type) ||
                              attachment.required.type ===
                                adjustedPlanet.type) &&
                            (attachment.id === currentAttachment ||
                              !claimedAttachments.has(attachment.id))
                        )
                        .map((attachment) => attachment.id);
                      return (
                        <div
                          key={planet.planet}
                          className="flexRow"
                          style={{ width: "100%" }}
                        >
                          <div style={{ width: "100%" }}>
                            <PlanetRow
                              factionId={"Xxcha Kingdom"}
                              planet={adjustedPlanet}
                              removePlanet={() => {
                                removePlanet("Xxcha Kingdom", planet.planet);
                              }}
                            />
                          </div>
                          {availableAttachments.length > 0 &&
                          !planet.prevOwner ? (
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
                                        attachments[currentAttachment]
                                          ?.attribute === attribute
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
                                    <PlanetIcon
                                      type={adjustedPlanet.type}
                                      size="60%"
                                    />
                                  )
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {nonXxchaPlanets.length > 0 && xxchaPlanets.length === 0 ? (
                  <ClientOnlyHoverMenu
                    label={
                      <FormattedMessage
                        id="UJs3kj"
                        description="Text on a hover menu for claiming an empty planet."
                        defaultMessage="Claim Empty Planet"
                      />
                    }
                  >
                    <div className="flexRow" style={targetButtonStyle}>
                      {nonXxchaPlanets.map((planet) => {
                        return (
                          <button
                            key={planet.id}
                            style={{
                              writingMode: "horizontal-tb",
                              width: rem(90),
                            }}
                            onClick={() => {
                              addPlanet("Xxcha Kingdom", planet);
                            }}
                          >
                            {planet.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </React.Fragment>
            </LabeledDiv>
            <SecondaryCheck
              activeFactionId={activeFaction.id}
              gameId={gameId}
              orderedFactions={orderedFactions}
            />
          </div>
        );
      }
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            }
          />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameId={gameId ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Leadership":
    case "Construction":
    case "Trade":
    case "Warfare":
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            }
          />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameId={gameId ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Imperial":
      let hasImperialPoint = false;
      const mecatol = planets["Mecatol Rex"];
      if (mecatol && mecatol.owner === activeFaction.id) {
        hasImperialPoint = true;
      }
      scoredObjectives.forEach((objective) => {
        if (objective === "Imperial Point") {
          hasImperialPoint = true;
        }
      });
      const availablePublicObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          if ((objective.scorers ?? []).includes(activeFaction.id)) {
            return false;
          }
          if (!objective.selected) {
            return false;
          }
          return (
            objective.type === "STAGE ONE" || objective.type === "STAGE TWO"
          );
        }
      );
      const scoredPublics = scoredObjectives.filter((objective) => {
        const objectiveObj = objectives[objective];
        if (!objectiveObj) {
          return false;
        }
        return (
          objectiveObj.type === "STAGE ONE" || objectiveObj.type === "STAGE TWO"
        );
      });

      const secretButtonStyle: CSSProperties = {
        fontFamily: "Myriad Pro",
        padding: rem(8),
        alignItems: "stretch",
        display: "grid",
        gridAutoFlow: "column",
        maxWidth: "85vw",
        justifyContent: "flex-start",
        overflowX: "auto",
        gridTemplateRows: `repeat(${Math.min(
          availablePublicObjectives.length,
          8
        )}, auto)`,
        gap: rem(4),
      };
      return (
        <div
          className="flexColumn largeFont"
          style={{ width: "100%", ...style }}
        >
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="mhqGMn"
                description="The main ability for a strategy card."
                defaultMessage="Primary"
              />
            }
          />
          <div
            style={{
              backdropFilter: `blur(${rem(4)})`,
              padding: `${rem(2)} 0`,
            }}
          >
            {hasImperialPoint ? (
              <FormattedMessage
                id="a1rHE+"
                description="Message telling a player that they get a victory point."
                defaultMessage="+1 VP for controlling Mecatol Rex"
              />
            ) : (
              <FormattedMessage
                id="dd3UAo"
                description="Message telling a player to draw a secret objective."
                defaultMessage="Draw 1 secret objective"
              />
            )}
          </div>
          <LabeledDiv
            label={
              <FormattedMessage
                id="73882v"
                description="Message telling a player to score a public objective."
                defaultMessage="Score Public Objective"
              />
            }
          >
            <React.Fragment>
              {scoredPublics.length > 0 ? (
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {scoredPublics.map((objective) => {
                    if (!objectives) {
                      return null;
                    }
                    const objectiveObj = objectives[objective];
                    if (!objectiveObj) {
                      return null;
                    }
                    return (
                      <ObjectiveRow
                        key={objective}
                        objective={objectiveObj}
                        removeObjective={() =>
                          undoObjective(activeFaction.id, objective)
                        }
                        hideScorers={true}
                      />
                    );
                  })}
                </div>
              ) : null}
              {scoredPublics.length < 1 ? (
                availablePublicObjectives.length > 0 ? (
                  <ObjectiveSelectHoverMenu
                    action={(_, objectiveId) =>
                      addObjective(activeFaction.id, objectiveId)
                    }
                    label={
                      <FormattedMessage
                        id="73882v"
                        description="Message telling a player to score a public objective."
                        defaultMessage="Score Public Objective"
                      />
                    }
                    objectives={availablePublicObjectives}
                  />
                ) : (
                  "No unscored public objectives"
                )
              ) : null}
            </React.Fragment>
          </LabeledDiv>
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            }
          />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameId={gameId ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Component":
      return <ComponentAction factionId={activeFaction.id} />;
    case "Pass":
      let hasProveEndurance = false;
      scoredActionPhaseObjectives.forEach((objective) => {
        if (objective === "Prove Endurance") {
          hasProveEndurance = true;
        }
      });
      function canProveEndurance() {
        if (hasProveEndurance) {
          return true;
        }
        if (!lastFaction()) {
          return false;
        }
        const proveEndurance = (objectives ?? {})["Prove Endurance"];
        if (!proveEndurance) {
          return false;
        }
        const scorers = proveEndurance.scorers ?? [];
        if (scorers.includes(factionId)) {
          return false;
        }
        if (proveEndurance.type === "SECRET" && scorers.length !== 0) {
          return false;
        }
        return true;
      }
      if (!canProveEndurance()) {
        return null;
      }
      return (
        <div
          className="flexRow largeFont"
          style={{
            justifyContent: "center",
            paddingTop: rem(12),
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          Prove Endurance:
          <FactionCircle
            key={activeFaction.id}
            blur
            borderColor={getFactionColor(activeFaction)}
            factionId={activeFaction.id}
            onClick={() => {
              if (!gameId) {
                return;
              }
              if (hasProveEndurance) {
                undoObjective(activeFaction.id, "Prove Endurance");
              } else {
                addObjective(activeFaction.id, "Prove Endurance");
              }
            }}
            size={52}
            tag={
              <div
                className="flexRow largeFont"
                style={{
                  width: "100%",
                  height: "100%",
                  color: hasProveEndurance ? "green" : "red",
                }}
              >
                {hasProveEndurance ? (
                  <div
                    className="symbol"
                    style={{
                      fontSize: rem(18),
                      lineHeight: rem(18),
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
            }
            tagBorderColor={hasProveEndurance ? "green" : "red"}
          />
        </div>
      );
      return null;
    case "Tactical":
      const conqueredPlanets = currentTurn
        .filter(
          (logEntry) =>
            logEntry.data.action === "CLAIM_PLANET" &&
            logEntry.data.event.faction === activeFaction.id
        )
        .map((logEntry) => (logEntry.data as ClaimPlanetData).event);
      return (
        <TacticalAction
          activeFactionId={activeFaction.id}
          attachments={attachments ?? {}}
          claimablePlanets={claimablePlanets}
          conqueredPlanets={conqueredPlanets}
          currentTurn={currentTurn}
          factions={factions ?? {}}
          gameid={gameId ?? ""}
          leaders={leaders}
          objectives={objectives ?? {}}
          planets={planets ?? {}}
          scorableObjectives={scorableObjectives}
          scoredObjectives={scoredActionPhaseObjectives}
          style={style}
          techs={techs ?? {}}
        />
      );
  }
  return null;
}

interface NextPlayerButtonsProps {
  buttonStyle?: CSSProperties;
}

export function NextPlayerButtons({
  buttonStyle = {},
}: NextPlayerButtonsProps) {
  const actionLog = useActionLog();
  const gameId = useGameId();
  const selectedAction = getSelectedActionFromLog(actionLog);
  const newSpeaker = getNewSpeakerEventFromLog(actionLog);

  async function completeActions() {
    if (!gameId || selectedAction === null) {
      return;
    }

    endTurnAsync(gameId);
  }

  async function finalizeAction() {
    if (!gameId || selectedAction === null) {
      return;
    }
    endTurnAsync(gameId, true);
  }

  function isTurnComplete() {
    switch (selectedAction) {
      case "Politics":
        return !!newSpeaker;
    }
    return !!selectedAction;
  }

  if (!isTurnComplete()) {
    return null;
  } else {
    return (
      <div className="flexRow" style={{ gap: rem(16) }}>
        <button
          onClick={completeActions}
          className={styles.EndTurnButton}
          style={buttonStyle}
        >
          <FormattedMessage
            id="NxpzKH"
            description="Text on a button that will end the player's turn."
            defaultMessage="End Turn"
          />
        </button>
        {selectedAction !== "Pass" ? (
          <React.Fragment>
            <div style={{ fontSize: rem(16) }}>
              <FormattedMessage
                id="PnNSxg"
                description="Text between two fields linking them together."
                defaultMessage="OR"
              />
            </div>
            <button
              onClick={finalizeAction}
              className={styles.EndTurnButton}
              style={buttonStyle}
            >
              <FormattedMessage
                id="5ChhqO"
                description="Text on a button that will let the player take another action."
                defaultMessage="Take Another Action"
              />
            </button>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

interface ActivePlayerColumnProps {
  activeFaction: Faction;
  onDeckFaction: Faction;
}

export function ActivePlayerColumn({
  activeFaction,
  onDeckFaction,
}: ActivePlayerColumnProps) {
  const gameId = useGameId();
  const intl = useIntl();

  return (
    <div className={styles.ActivePlayerColumn}>
      <FormattedMessage
        id="vTtJ6S"
        description="Label showing that the specific player is the current player."
        defaultMessage="Active Player"
      />
      <SwitchTransition>
        <CSSTransition key={activeFaction.id} timeout={120} classNames="fade">
          <FactionCard
            faction={activeFaction}
            rightLabel={
              <FactionTimer
                factionId={activeFaction.id}
                style={{ fontSize: rem(16), width: "auto" }}
              />
            }
            opts={{
              iconSize: rem(200),
              fontSize: rem(32),
            }}
          >
            <div className={styles.ActivePlayerSection}>
              <div className={styles.PromissoryMenu}>
                <PromissoryMenu factionId={activeFaction.id} />
              </div>
              <FactionActions factionId={activeFaction.id} />
              <AdditionalActions
                factionId={activeFaction.id}
                style={{ minWidth: rem(350) }}
              />
            </div>
          </FactionCard>
        </CSSTransition>
      </SwitchTransition>
      <NextPlayerButtons />
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "center" }}
      >
        <SwitchTransition>
          <CSSTransition key={onDeckFaction.id} timeout={120} classNames="fade">
            <LabeledDiv
              label={
                <FormattedMessage
                  id="S0vXJt"
                  description="Label showing that the specific player is up next."
                  defaultMessage="On Deck"
                />
              }
              rightLabel={
                <StaticFactionTimer
                  factionId={onDeckFaction.id}
                  style={{
                    fontSize: rem(16),
                  }}
                  width={84}
                />
              }
              color={getFactionColor(onDeckFaction)}
              style={{
                width: "fit-content",
                minWidth: rem(200),
              }}
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  height: rem(44),
                  whiteSpace: "nowrap",
                  gap: rem(4),
                  fontSize: rem(24),
                }}
              >
                {getFactionName(onDeckFaction)}
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    width: rem(44),
                    height: rem(44),
                    zIndex: -1,
                    opacity: 0.7,
                    userSelect: "none",
                  }}
                >
                  <FactionIcon factionId={onDeckFaction.id} size="100%" />
                </div>
              </div>
            </LabeledDiv>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <LockedButtons
        unlocked={!activeFaction}
        style={{ marginTop: rem(12) }}
        buttons={[
          {
            text: intl.formatMessage(
              {
                id: "8/h2ME",
                defaultMessage: "Advance to {phase} Phase",
                description:
                  "Text on a button that will advance the game to a specific phase.",
              },
              { phase: phaseString("STATUS", intl) }
            ),
            onClick: () => {
              if (!gameId) {
                return;
              }
              advanceToStatusPhase(gameId);
            },
          },
        ]}
      />
    </div>
  );
}

export function advanceToStatusPhase(gameId: string) {
  advancePhaseAsync(gameId);
}

export default function ActionPhase() {
  const factions = useFactions();
  const gameId = useGameId();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const intl = useIntl();

  const activeFaction =
    state.activeplayer && state.activeplayer !== "None"
      ? factions[state.activeplayer]
      : undefined;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
  const orderedStrategyCards = Object.values(strategyCards)
    .filter((card) => card.faction)
    .sort((a, b) => a.order - b.order);

  const cardsByFaction: Partial<Record<FactionId, StrategyCard[]>> = {};
  orderedStrategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    if (!cardsByFaction[card.faction]) {
      cardsByFaction[card.faction] = [];
    }
    cardsByFaction[card.faction]?.push(card);
  });

  const numFactions = Object.keys(factions).length;

  return (
    <React.Fragment>
      <div
        className={styles.LeftColumn}
        style={
          {
            "--gap": numFactions > 7 ? rem(4) : rem(8),
          } as CSSProperties
        }
      >
        {Object.values(cardsByFaction).map((cards) => {
          const isActivePlayer = cards[0]?.faction === state.activeplayer;
          return (
            <div
              key={cards[0] ? cards[0].id : "Error"}
              style={{
                transition: "padding 120ms",
                paddingRight:
                  isActivePlayer && activeFaction && onDeckFaction
                    ? 0
                    : rem(40),
                paddingLeft:
                  isActivePlayer && activeFaction && onDeckFaction
                    ? rem(40)
                    : 0,
              }}
            >
              <SmallStrategyCard cards={cards} />
            </div>
          );
        })}
      </div>
      <div className="flexColumn" style={{ gap: rem(16) }}>
        <div className="flexColumn" style={{ width: "100%" }}>
          {activeFaction && onDeckFaction ? (
            <ActivePlayerColumn
              activeFaction={activeFaction}
              onDeckFaction={onDeckFaction}
            />
          ) : (
            <div
              className="flexColumn"
              style={{ height: `calc(100dvh - ${rem(180)})` }}
            >
              <div
                className="flexRow"
                style={{
                  fontSize: rem(28),
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <FormattedMessage
                  id="Gns4AS"
                  description="Text showing that the current phase is complete"
                  defaultMessage="{phase} Phase Complete"
                  values={{ phase: phaseString("ACTION", intl) }}
                />
              </div>
              <LockedButtons
                unlocked={true}
                buttons={[
                  {
                    text: intl.formatMessage(
                      {
                        id: "8/h2ME",
                        defaultMessage: "Advance to {phase} Phase",
                        description:
                          "Text on a button that will advance the game to a specific phase.",
                      },
                      { phase: phaseString("STATUS", intl) }
                    ),
                    onClick: () => {
                      if (!gameId) {
                        return;
                      }
                      advanceToStatusPhase(gameId);
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
