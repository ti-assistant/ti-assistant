import React, { CSSProperties, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { LockedButtons } from "../../../../../../src/LockedButton";
import { SmallStrategyCard } from "../../../../../../src/StrategyCard";
import {
  FactionSecondaryTimer,
  FactionTimer,
  StaticFactionTimer,
} from "../../../../../../src/Timer";
import Chip from "../../../../../../src/components/Chip/Chip";
import ExpeditionSelector from "../../../../../../src/components/Expedition/ExpeditionSelector";
import FactionCard from "../../../../../../src/components/FactionCard/FactionCard";
import FactionCircle from "../../../../../../src/components/FactionCircle/FactionCircle";
import FactionIcon from "../../../../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import PromissoryMenu from "../../../../../../src/components/PromissoryMenu/PromissoryMenu";
import { TacticalAction } from "../../../../../../src/components/TacticalAction";
import TechResearchSection from "../../../../../../src/components/TechResearchSection/TechResearchSection";
import ThreeWayToggle from "../../../../../../src/components/ThreeWayToggle/ThreeWayToggle";
import Toggle from "../../../../../../src/components/Toggle/Toggle";
import {
  useCurrentTurn,
  useGameId,
  usePlanets,
  usePrimaryCompleted,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useAllSecondariesCompleted,
  useFactions,
} from "../../../../../../src/context/factionDataHooks";
import {
  useActiveFaction,
  useOnDeckFaction,
} from "../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../src/context/stateDataHooks";
import {
  advancePhaseAsync,
  endTurnAsync,
  markPrimaryAsync,
  markSecondaryAsync,
  scoreObjectiveAsync,
  selectActionAsync,
  unscoreObjectiveAsync,
  unselectActionAsync,
} from "../../../../../../src/dynamic/api";
import { SymbolX } from "../../../../../../src/icons/svgs";
import {
  getClaimedPlanets,
  isPrimaryComplete,
} from "../../../../../../src/util/actionLog";
import {
  getNewSpeakerEventFromLog,
  getSelectedActionFromLog,
} from "../../../../../../src/util/api/data";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../src/util/factions";
import { getStrategyCardsForFaction } from "../../../../../../src/util/helpers";
import { phaseString } from "../../../../../../src/util/strings";
import { rem } from "../../../../../../src/util/util";
import styles from "./ActionPhase.module.scss";
import { ComponentAction } from "./ComponentAction";
import Diplomacy from "./StrategicActions/Diplomacy";
import Imperial from "./StrategicActions/Imperial";
import Politics from "./StrategicActions/Politics";
import Technology from "./StrategicActions/Technology";
import Warfare from "./StrategicActions/Warfare";

interface FactionActionButtonsProps {
  factionId: FactionId;
}

function SecondaryCheck({
  activeFactionId,
  gameId,
  primaryCompleted,
  orderedFactions,
}: {
  activeFactionId: FactionId;
  gameId: string;
  primaryCompleted: boolean;
  orderedFactions: Faction[];
}) {
  let allCompleted = true;
  const viewOnly = useViewOnly();
  return (
    <div className="flexColumn hugeFont">
      <div
        className="flexRow"
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
          gap: rem(2),
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
            <div
              key={faction.id}
              className="flexColumn"
              style={{ gap: rem(2) }}
            >
              <ThreeWayToggle
                key={faction.id}
                selected={
                  secondaryState === "DONE"
                    ? "Positive"
                    : secondaryState === "SKIPPED"
                    ? "Negative"
                    : undefined
                }
                toggleFn={(newVal) => {
                  if (newVal === "Positive") {
                    markSecondaryAsync(gameId, faction.id, "DONE");
                  } else if (newVal === "Negative") {
                    markSecondaryAsync(gameId, faction.id, "SKIPPED");
                  } else {
                    markSecondaryAsync(gameId, faction.id, "PENDING");
                  }
                }}
              >
                <FactionIcon factionId={faction.id} size={24} />
              </ThreeWayToggle>
              <FactionSecondaryTimer
                factionId={faction.id}
                active={primaryCompleted && secondaryState === "PENDING"}
                style={{
                  fontSize: rem(16),
                  width: "auto",
                  color:
                    primaryCompleted && secondaryState === "PENDING"
                      ? "#eee"
                      : "#555",
                }}
              />
            </div>
          );
          return (
            <FactionCircle
              key={faction.id}
              blur
              borderColor={color}
              fade={secondaryState !== "PENDING"}
              factionId={faction.id}
              onClick={
                viewOnly
                  ? undefined
                  : () => {
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
                    }
              }
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
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  function canFactionPass(factionId: FactionId) {
    for (const card of getStrategyCardsForFaction(strategyCards, factionId)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  const selectedAction = getSelectedActionFromLog(currentTurn);

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
              disabled={viewOnly}
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
        disabled={viewOnly}
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
        disabled={viewOnly}
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
          disabled={viewOnly}
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
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const viewOnly = useViewOnly();

  const currentTurn = useCurrentTurn();

  const activeFaction = factions[factionId];

  if (!activeFaction) {
    return null;
  }

  function lastFaction() {
    const numFactions = Object.keys(factions).length;
    const numPassed = Object.values(factions).filter(
      (faction) => faction.passed
    ).length;
    return numFactions - 1 === numPassed;
  }

  const primaryCompleted = isPrimaryComplete(currentTurn);

  const claimedPlanets = getClaimedPlanets(currentTurn, activeFaction.id);
  const claimablePlanets = Object.values(planets).filter((planet) => {
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
    if (planet.attributes.includes("ocean")) {
      return factionId === "Deepwrought Scholarate";
    }
    // Avernus could be in any system.
    if (planet.id === "Avernus" && planet.owner) {
      return true;
    }
    if (claimedPlanets.length > 0) {
      for (const claimedPlanetEvent of claimedPlanets) {
        if (claimedPlanetEvent.planet === "Avernus") {
          continue;
        }
        const claimedPlanet = planets[claimedPlanetEvent.planet];
        if (claimedPlanet?.attributes.includes("ocean")) {
          continue;
        }
        if (claimedPlanet?.faction) {
          return planet.faction === claimedPlanet.faction;
        }
        if (claimedPlanet?.system) {
          return planet.system === claimedPlanet.system;
        }
        return false;
      }
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

  const selectedAction = getSelectedActionFromLog(currentTurn);

  switch (selectedAction) {
    case "Technology":
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
              <TechResearchSection
                factionId={activeFaction.id}
                numTechs={numTechs}
                hideWrapper
              />
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
                    gameId={gameId}
                    primaryCompleted={primaryCompleted}
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
                rightLabel={
                  <Toggle
                    selected={primaryCompleted}
                    toggleFn={() => markPrimaryAsync(gameId, !primaryCompleted)}
                  >
                    <FormattedMessage
                      id="9F+GVy"
                      description="Text on a button for marking something completed."
                      defaultMessage="Done"
                    />
                  </Toggle>
                }
              />
              <Technology.Primary factionId={activeFaction.id} />
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
            <Technology.AllSecondaries activeFactionId={activeFaction.id} />
            <SecondaryCheck
              activeFactionId={activeFaction.id}
              gameId={gameId}
              primaryCompleted={primaryCompleted}
              orderedFactions={orderedFactions}
            />
          </div>
        </div>
      );
    case "Politics":
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
              rightLabel={
                <Toggle
                  selected={primaryCompleted}
                  toggleFn={() => markPrimaryAsync(gameId, !primaryCompleted)}
                >
                  <FormattedMessage
                    id="9F+GVy"
                    description="Text on a button for marking something completed."
                    defaultMessage="Done"
                  />
                </Toggle>
              }
            />
            <Politics.Primary />
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
            gameId={gameId}
            primaryCompleted={primaryCompleted}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Diplomacy":
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
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  markPrimaryAsync(gameId, !primaryCompleted);
                }}
              >
                <FormattedMessage
                  id="9F+GVy"
                  description="Text on a button for marking something completed."
                  defaultMessage="Done"
                />
              </Toggle>
            }
          />
          <Diplomacy.Primary factionId={activeFaction.id} />
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            }
          />
          <Diplomacy.AllSecondaries activeFactionId={activeFaction.id} />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameId={gameId}
            primaryCompleted={primaryCompleted}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Leadership":
    case "Construction":
    case "Trade":
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine
            leftLabel={
              <FormattedMessage
                id="mhqGMn"
                description="The main ability for a strategy card."
                defaultMessage="Primary"
              />
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => markPrimaryAsync(gameId, !primaryCompleted)}
              >
                <FormattedMessage
                  id="9F+GVy"
                  description="Text on a button for marking something completed."
                  defaultMessage="Done"
                />
              </Toggle>
            }
          />
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
            gameId={gameId}
            primaryCompleted={primaryCompleted}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Warfare": {
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
              rightLabel={
                <Toggle
                  selected={primaryCompleted}
                  toggleFn={() => markPrimaryAsync(gameId, !primaryCompleted)}
                >
                  <FormattedMessage
                    id="9F+GVy"
                    description="Text on a button for marking something completed."
                    defaultMessage="Done"
                  />
                </Toggle>
              }
            />
            <div></div>
            <Warfare.Primary factionId={activeFaction.id} />
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
            gameId={gameId}
            primaryCompleted={primaryCompleted}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    }
    case "Imperial":
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
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => markPrimaryAsync(gameId, !primaryCompleted)}
              >
                <FormattedMessage
                  id="9F+GVy"
                  description="Text on a button for marking something completed."
                  defaultMessage="Done"
                />
              </Toggle>
            }
          />
          <Imperial.Primary factionId={activeFaction.id} />
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
            gameId={gameId}
            primaryCompleted={primaryCompleted}
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
          <FormattedMessage
            id="Objectives.Prove Endurance.Title"
            defaultMessage="Prove Endurance"
            description="Title of Objective: Prove Endurance"
          />
          :
          <FactionCircle
            key={activeFaction.id}
            blur
            borderColor={getFactionColor(activeFaction)}
            factionId={activeFaction.id}
            onClick={
              viewOnly
                ? undefined
                : () => {
                    if (!gameId) {
                      return;
                    }
                    if (hasProveEndurance) {
                      unscoreObjectiveAsync(
                        gameId,
                        activeFaction.id,
                        "Prove Endurance"
                      );
                    } else {
                      scoreObjectiveAsync(
                        gameId,
                        activeFaction.id,
                        "Prove Endurance"
                      );
                    }
                  }
            }
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
    case "Tactical":
      const scorableObjectives = Object.values(objectives).filter(
        (objective) => {
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
          if (objective.type === "OTHER") {
            return false;
          }
          if (objective.type === "SECRET" && scorers.length > 0) {
            return false;
          }
          return objective.phase === "ACTION";
        }
      );
      return (
        <TacticalAction
          activeFactionId={activeFaction.id}
          claimablePlanets={claimablePlanets}
          conqueredPlanets={claimedPlanets}
          scorableObjectives={scorableObjectives}
          scoredObjectives={scoredActionPhaseObjectives}
          style={style}
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
  const gameId = useGameId();
  const currentTurn = useCurrentTurn();
  const viewOnly = useViewOnly();
  const selectedAction = getSelectedActionFromLog(currentTurn);
  const newSpeaker = getNewSpeakerEventFromLog(currentTurn);

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
          disabled={viewOnly}
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
              disabled={viewOnly}
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

function ActivePlayerColumn({
  activeFaction,
  onDeckFaction,
}: ActivePlayerColumnProps) {
  const allSecondariesCompleted = useAllSecondariesCompleted();
  const gameId = useGameId();
  const intl = useIntl();
  const primaryCompleted = usePrimaryCompleted();
  const viewOnly = useViewOnly();

  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.ActivePlayerColumn}>
      <FormattedMessage
        id="vTtJ6S"
        description="Label showing that the specific player is the current player."
        defaultMessage="Active Player"
      />
      <SwitchTransition>
        <CSSTransition
          key={activeFaction.id}
          timeout={120}
          classNames="fade"
          nodeRef={primaryRef}
        >
          <FactionCard
            faction={activeFaction}
            rightLabel={
              <FactionTimer
                active={!primaryCompleted || allSecondariesCompleted}
                factionId={activeFaction.id}
                style={{ fontSize: rem(16), width: "auto" }}
              />
            }
            opts={{
              iconSize: rem(200),
              fontSize: rem(32),
            }}
          >
            <div ref={primaryRef} className={styles.ActivePlayerSection}>
              <div className={styles.PromissoryMenu}>
                <PromissoryMenu factionId={activeFaction.id} />
              </div>
              <FactionActions factionId={activeFaction.id} />
              <AdditionalActions
                factionId={activeFaction.id}
                style={{ minWidth: rem(350) }}
              />
              <ExpeditionSelector factionId={activeFaction.id} />
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
          <CSSTransition
            key={onDeckFaction.id}
            timeout={120}
            classNames="fade"
            nodeRef={secondaryRef}
          >
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
                  active={false}
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
                ref={secondaryRef}
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
              advancePhaseAsync(gameId);
            },
          },
        ]}
        viewOnly={viewOnly}
      />
    </div>
  );
}

type CardWithFaction = StrategyCard & { faction: FactionId };

function StrategyCardColumn() {
  const activeFaction = useActiveFaction();
  const strategyCards = useStrategyCards();

  const orderedStrategyCards = Object.values(strategyCards).sort(
    (a, b) => a.order - b.order
  );

  const cardsByFaction: Partial<Record<FactionId, CardWithFaction[]>> = {};
  orderedStrategyCards.forEach((card) => {
    const faction = card.faction;
    if (!faction) {
      return;
    }
    if (!cardsByFaction[faction]) {
      cardsByFaction[faction] = [];
    }
    cardsByFaction[faction]?.push({ ...card, faction });
  });

  return (
    <div className={styles.LeftColumn}>
      {Object.values(cardsByFaction).map((cards) => {
        const primaryCard = cards[0];
        if (!primaryCard) {
          return null;
        }
        const isActivePlayer = primaryCard.faction === activeFaction?.id;
        return (
          <div
            key={primaryCard.id}
            style={{
              transition: "padding 120ms",
              paddingRight: isActivePlayer ? 0 : rem(40),
              paddingLeft: isActivePlayer ? rem(40) : 0,
            }}
          >
            <SmallStrategyCard cards={cards} />
          </div>
        );
      })}
    </div>
  );
}

export default function ActionPhase() {
  const gameId = useGameId();
  const intl = useIntl();
  const viewOnly = useViewOnly();

  const activeFaction = useActiveFaction();
  const onDeckFaction = useOnDeckFaction();

  return (
    <>
      <StrategyCardColumn />
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
                      advancePhaseAsync(gameId);
                    },
                  },
                ]}
                viewOnly={viewOnly}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
