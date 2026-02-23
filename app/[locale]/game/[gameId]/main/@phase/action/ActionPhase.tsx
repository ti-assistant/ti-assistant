import React, { CSSProperties, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Chip from "../../../../../../../src/components/Chip/Chip";
import Conditional from "../../../../../../../src/components/Conditional/Conditional";
import ExpeditionSelector from "../../../../../../../src/components/Expedition/ExpeditionSelector";
import FactionCard from "../../../../../../../src/components/FactionCard/FactionCard";
import FactionCircle from "../../../../../../../src/components/FactionCircle/FactionCircle";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../src/components/FactionIcon/FactionIcon";
import FormattedDescription from "../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../../src/components/LabeledLine/LabeledLine";
import MultiStateToggle from "../../../../../../../src/components/MultiStateToggle/MultiStateToggle";
import PromissoryMenu from "../../../../../../../src/components/PromissoryMenu/PromissoryMenu";
import { TacticalAction } from "../../../../../../../src/components/TacticalAction";
import TechResearchSection from "../../../../../../../src/components/TechResearchSection/TechResearchSection";
import Toggle from "../../../../../../../src/components/Toggle/Toggle";
import {
  useNewSpeaker,
  useSelectedAction,
} from "../../../../../../../src/context/actionLogDataHooks";
import {
  useActionCard,
  useCurrentTurn,
  useGameId,
  useLeader,
  usePlanets,
  usePrimaryCompleted,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import {
  useAllSecondariesCompleted,
  useFaction,
  useFactionColor,
  useFactionSecondary,
  useIsFactionPassed,
  usePassedFactionIds,
} from "../../../../../../../src/context/factionDataHooks";
import {
  useActiveFactionId,
  useOnDeckFactionId,
  useOrderedFactionIds,
} from "../../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../../src/context/stateDataHooks";
import { SymbolX } from "../../../../../../../src/icons/svgs";
import { InfoRow } from "../../../../../../../src/InfoRow";
import { LockedButtons } from "../../../../../../../src/LockedButton";
import { SmallStrategyCard } from "../../../../../../../src/StrategyCard";
import {
  FactionSecondaryTimer,
  FactionTimer,
  StaticFactionTimer,
} from "../../../../../../../src/Timer";
import {
  getClaimedPlanets,
  isPrimaryComplete,
} from "../../../../../../../src/util/actionLog";
import { getSelectedActionFromLog } from "../../../../../../../src/util/api/data";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../../src/util/factions";
import { getStrategyCardsForFaction } from "../../../../../../../src/util/helpers";
import { sortStrategyCards } from "../../../../../../../src/util/strategyCards";
import { phaseString } from "../../../../../../../src/util/strings";
import { Optional } from "../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../src/util/util";
import styles from "./ActionPhase.module.scss";
import Faunus from "./Actions/Faunus";
import { ComponentAction } from "./ComponentAction";
import StrategicActions from "./StrategicActions/StrategicActions";

interface FactionActionButtonsProps {
  factionId: FactionId;
}

function SecondaryFactionCheck({
  factionId,
  primaryCompleted,
}: {
  factionId: FactionId;
  primaryCompleted: boolean;
}) {
  const dataUpdate = useDataUpdate();
  const secondaryState = useFactionSecondary(factionId);
  const viewOnly = useViewOnly();

  return (
    <div key={factionId} className="flexColumn" style={{ gap: rem(2) }}>
      <MultiStateToggle
        key={factionId}
        selected={
          secondaryState === "DONE"
            ? "Positive"
            : secondaryState === "SKIPPED"
              ? "Negative"
              : undefined
        }
        toggleFn={(nextVal) => {
          if (viewOnly) {
            return;
          }
          if (!nextVal) {
            dataUpdate(Events.MarkSecondaryEvent(factionId, "PENDING"));
          }
          switch (nextVal) {
            case "Positive":
              dataUpdate(Events.MarkSecondaryEvent(factionId, "DONE"));
              break;
            case "Negative":
              dataUpdate(Events.MarkSecondaryEvent(factionId, "SKIPPED"));
              break;
          }
        }}
      >
        <FactionIcon factionId={factionId} size={24} />
      </MultiStateToggle>
      <FactionSecondaryTimer
        factionId={factionId}
        active={primaryCompleted && secondaryState === "PENDING"}
        style={{
          fontSize: rem(16),
          width: "auto",
          color:
            primaryCompleted && secondaryState === "PENDING" ? "#eee" : "#555",
        }}
      />
    </div>
  );
}

function SecondaryCheck({
  activeFactionId,
  primaryCompleted,
  orderedFactionIds,
}: {
  activeFactionId: FactionId;
  primaryCompleted: boolean;
  orderedFactionIds: FactionId[];
}) {
  let allCompleted = useAllSecondariesCompleted();
  return (
    <div className="flexColumn hugeFont">
      <div
        className="flexRow"
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
          gap: rem(4),
        }}
      >
        {orderedFactionIds.map((factionId) => {
          if (factionId === activeFactionId) {
            return null;
          }
          return (
            <SecondaryFactionCheck
              key={factionId}
              factionId={factionId}
              primaryCompleted={primaryCompleted}
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
  const isFactionPassed = useIsFactionPassed(factionId);
  const dataUpdate = useDataUpdate();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  function canFactionPass(factionId: FactionId) {
    if (isFactionPassed) {
      return false;
    }
    for (const card of getStrategyCardsForFaction(strategyCards, factionId)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  const selectedAction = getSelectedActionFromLog(currentTurn);

  function toggleAction(action: Action) {
    if (selectedAction === action) {
      dataUpdate(Events.UnselectActionEvent(action));
    } else {
      dataUpdate(Events.SelectActionEvent(action));
    }
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
      {getStrategyCardsForFaction(strategyCards, factionId).map((card) => {
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
      })}
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
      {canFactionPass(factionId) ? (
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
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();
  const factionColor = useFactionColor(factionId);

  const currentTurn = useCurrentTurn();
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    factionId,
  );
  const passedFactionIds = usePassedFactionIds();

  function lastFaction() {
    const numFactions = orderedFactionIds.length;
    const numPassed = passedFactionIds.length;
    return numFactions - 1 === numPassed;
  }

  const primaryCompleted = isPrimaryComplete(currentTurn);

  const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
  const claimablePlanets = Object.values(planets).filter((planet) => {
    if (!planets) {
      return false;
    }
    if (planet.owner === factionId) {
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
        logEntry.data.event.faction === factionId,
    )
    .map((logEntry) => (logEntry.data as ScoreObjectiveData).event.objective);
  const scoredActionPhaseObjectives = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return objectiveObj.phase === "ACTION";
  });

  const selectedAction = getSelectedActionFromLog(currentTurn);

  switch (selectedAction) {
    case "Technology":
      const strategyCard = strategyCards.Technology;
      if (!!primaryOnly || !!secondaryOnly) {
        const isActive = state?.activeplayer === factionId;
        const numTechs =
          isActive || factionId === "Universities of Jol-Nar" ? 2 : 1;
        return factionId !== "Nekro Virus" ? (
          <div className="flexColumn largeFont" style={{ width: "100%" }}>
            <LabeledLine
              leftLabel={
                isActive ? (
                  <InfoRow
                    infoTitle={`${strategyCard?.name} Primary`}
                    infoContent={
                      <FormattedDescription
                        description={strategyCard?.primary}
                      />
                    }
                  >
                    <FormattedMessage
                      id="mhqGMn"
                      description="The main ability for a strategy card."
                      defaultMessage="Primary"
                    />
                  </InfoRow>
                ) : (
                  <InfoRow
                    infoTitle={`${strategyCard?.name} Secondary`}
                    infoContent={
                      <FormattedDescription
                        description={strategyCard?.secondary}
                      />
                    }
                  >
                    <FormattedMessage
                      id="PBW6vs"
                      description="The alternate ability for a strategy card."
                      defaultMessage="Secondary"
                    />
                  </InfoRow>
                )
              }
            />
            <React.Fragment>
              <Conditional appSection="TECHS">
                <TechResearchSection
                  factionId={factionId}
                  numTechs={numTechs}
                  hideWrapper
                />
              </Conditional>
              {isActive ? (
                <React.Fragment>
                  <LabeledLine
                    leftLabel={
                      <InfoRow
                        infoTitle={`${strategyCard?.name} Secondary`}
                        infoContent={
                          <FormattedDescription
                            description={strategyCard?.secondary}
                          />
                        }
                      >
                        <FormattedMessage
                          id="PBW6vs"
                          description="The alternate ability for a strategy card."
                          defaultMessage="Secondary"
                        />
                      </InfoRow>
                    }
                  />
                  <SecondaryCheck
                    activeFactionId={factionId}
                    primaryCompleted={primaryCompleted}
                    orderedFactionIds={orderedFactionIds}
                  />
                </React.Fragment>
              ) : null}
            </React.Fragment>
          </div>
        ) : null;
      }
      return (
        <div className="flexColumn largeFont" style={{ ...style, gap: rem(4) }}>
          {factionId !== "Nekro Virus" ? (
            <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
              <LabeledLine
                leftLabel={
                  <InfoRow
                    infoTitle={`${strategyCard?.name} Primary`}
                    infoContent={
                      <FormattedDescription
                        description={strategyCard?.primary}
                      />
                    }
                  >
                    <FormattedMessage
                      id="mhqGMn"
                      description="The main ability for a strategy card."
                      defaultMessage="Primary"
                    />
                  </InfoRow>
                }
                rightLabel={
                  <Toggle
                    selected={primaryCompleted}
                    toggleFn={() =>
                      dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                    }
                  >
                    <FormattedMessage
                      id="9F+GVy"
                      description="Text on a button for marking something completed."
                      defaultMessage="Done"
                    />
                  </Toggle>
                }
              />
              <StrategicActions.Technology.Primary factionId={factionId} />
            </div>
          ) : null}
          <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
            <LabeledLine
              leftLabel={
                <InfoRow
                  infoTitle={`${strategyCard?.name} Secondary`}
                  infoContent={
                    <FormattedDescription
                      description={strategyCard?.secondary}
                    />
                  }
                >
                  <FormattedMessage
                    id="PBW6vs"
                    description="The alternate ability for a strategy card."
                    defaultMessage="Secondary"
                  />
                </InfoRow>
              }
            />
            <StrategicActions.Technology.AllSecondaries
              activeFactionId={factionId}
            />
            <SecondaryCheck
              activeFactionId={factionId}
              primaryCompleted={primaryCompleted}
              orderedFactionIds={orderedFactionIds}
            />
          </div>
        </div>
      );
    case "Politics": {
      const strategyCard = strategyCards.Politics;
      return (
        <div
          className="flexColumn"
          style={{ gap: rem(4), width: "100%", ...style }}
        >
          <React.Fragment>
            <LabeledLine
              leftLabel={
                <InfoRow
                  infoTitle={`${strategyCard?.name} Primary`}
                  infoContent={
                    <FormattedDescription description={strategyCard?.primary} />
                  }
                >
                  <FormattedMessage
                    id="mhqGMn"
                    description="The main ability for a strategy card."
                    defaultMessage="Primary"
                  />
                </InfoRow>
              }
              rightLabel={
                <Toggle
                  selected={primaryCompleted}
                  toggleFn={() =>
                    dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                  }
                >
                  <FormattedMessage
                    id="9F+GVy"
                    description="Text on a button for marking something completed."
                    defaultMessage="Done"
                  />
                </Toggle>
              }
            />
            <StrategicActions.Politics.Primary />
          </React.Fragment>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Diplomacy": {
      const strategyCard = strategyCards.Diplomacy;
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Diplomacy.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Diplomacy.AllSecondaries
            activeFactionId={factionId}
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Noctis": {
      const strategyCard = strategyCards.Noctis;
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Noctis.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Noctis.AllSecondaries activeFactionId={factionId} />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Tyrannus": {
      const strategyCard = strategyCards.Tyrannus;
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Tyrannus.Primary />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Magus": {
      const strategyCard = strategyCards.Magus;
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Magus.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Magus.AllSecondaries activeFactionId={factionId} />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Calamitas": {
      const strategyCard = strategyCards.Calamitas;
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Calamitas.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Calamitas.AllSecondaries
            activeFactionId={factionId}
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Leadership":
    case "Lux": {
      const strategyCard = strategyCards[selectedAction];
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() => {
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted));
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
          <StrategicActions.Leadership.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Leadership.AllSecondaries
            activeFactionId={factionId}
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Construction":
    case "Trade":
    case "Civitas":
    case "Amicus": {
      const strategyCard = strategyCards[selectedAction];
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() =>
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                }
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
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Warfare": {
      const strategyCard = strategyCards.Warfare;
      return (
        <div
          className="flexColumn"
          style={{ gap: rem(4), width: "100%", ...style }}
        >
          <React.Fragment>
            <LabeledLine
              leftLabel={
                <InfoRow
                  infoTitle={`${strategyCard?.name} Primary`}
                  infoContent={
                    <FormattedDescription description={strategyCard?.primary} />
                  }
                >
                  <FormattedMessage
                    id="mhqGMn"
                    description="The main ability for a strategy card."
                    defaultMessage="Primary"
                  />
                </InfoRow>
              }
              rightLabel={
                <Toggle
                  selected={primaryCompleted}
                  toggleFn={() =>
                    dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                  }
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
            <StrategicActions.Warfare.Primary factionId={factionId} />
          </React.Fragment>
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Aeterna": {
      const strategyCard = strategyCards.Aeterna;
      return (
        <div
          className="flexColumn largeFont"
          style={{ width: "100%", ...style }}
        >
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() =>
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                }
              >
                <FormattedMessage
                  id="9F+GVy"
                  description="Text on a button for marking something completed."
                  defaultMessage="Done"
                />
              </Toggle>
            }
          />
          <StrategicActions.Aeterna.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <StrategicActions.Aeterna.AllSecondaries
            activeFactionId={factionId}
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Imperial": {
      const strategyCard = strategyCards.Imperial;
      return (
        <div
          className="flexColumn largeFont"
          style={{ width: "100%", ...style }}
        >
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Primary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.primary} />
                }
              >
                <FormattedMessage
                  id="mhqGMn"
                  description="The main ability for a strategy card."
                  defaultMessage="Primary"
                />
              </InfoRow>
            }
            rightLabel={
              <Toggle
                selected={primaryCompleted}
                toggleFn={() =>
                  dataUpdate(Events.MarkPrimaryEvent(!primaryCompleted))
                }
              >
                <FormattedMessage
                  id="9F+GVy"
                  description="Text on a button for marking something completed."
                  defaultMessage="Done"
                />
              </Toggle>
            }
          />
          <StrategicActions.Imperial.Primary factionId={factionId} />
          <LabeledLine
            leftLabel={
              <InfoRow
                infoTitle={`${strategyCard?.name} Secondary`}
                infoContent={
                  <FormattedDescription description={strategyCard?.secondary} />
                }
              >
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              </InfoRow>
            }
          />
          <SecondaryCheck
            activeFactionId={factionId}
            primaryCompleted={primaryCompleted}
            orderedFactionIds={orderedFactionIds}
          />
        </div>
      );
    }
    case "Component":
      return <ComponentAction factionId={factionId} />;
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
      return (
        <div className="flexColumn largeFont">
          <div className="flexRow" style={{ width: "100%" }}>
            <Faunus factionId={factionId} />
          </div>
          {!canProveEndurance() ? null : (
            <div
              className="flexRow"
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
                key={factionId}
                blur
                borderColor={factionColor}
                factionId={factionId}
                onClick={
                  viewOnly
                    ? undefined
                    : () => {
                        if (!gameId) {
                          return;
                        }
                        if (hasProveEndurance) {
                          dataUpdate(
                            Events.UnscoreObjectiveEvent(
                              factionId,
                              "Prove Endurance",
                            ),
                          );
                        } else {
                          dataUpdate(
                            Events.ScoreObjectiveEvent(
                              factionId,
                              "Prove Endurance",
                            ),
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
          )}
        </div>
      );
    case "Tactical":
      const scorableObjectives = Object.values(objectives).filter(
        (objective) => {
          const scorers = objective.scorers ?? [];
          if (scorers.includes(factionId)) {
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
        },
      );
      return (
        <TacticalAction
          activeFactionId={factionId}
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

export function NextPlayerButtons({
  activeFactionId,
}: {
  activeFactionId: FactionId;
}) {
  const dataUpdate = useDataUpdate();
  const newSpeaker = useNewSpeaker();
  const selectedAction = useSelectedAction();
  const viewOnly = useViewOnly();

  if (!selectedAction) {
    return null;
  }

  if (selectedAction === "Politics" && !newSpeaker) {
    return null;
  }

  return (
    <div className="flexColumn">
      <div className="flexRow" style={{ gap: rem(8) }}>
        <button
          onClick={() => dataUpdate(Events.EndTurnEvent())}
          className={styles.EndTurnButton}
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
              onClick={() =>
                dataUpdate(Events.EndTurnEvent(/* samePlayer= */ true))
              }
              className={styles.EndTurnButton}
              style={{ fontSize: rem(16) }}
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
      <PuppetsOnAString activeFactionId={activeFactionId} />
    </div>
  );
}

function PuppetsOnAString({ activeFactionId }: { activeFactionId: FactionId }) {
  const dataUpdate = useDataUpdate();
  const passedFactions = usePassedFactionIds().filter(
    (factionId) => factionId !== activeFactionId,
  );
  const puppets = useActionCard("Puppets on a String");

  if (!puppets || passedFactions.length === 0) {
    return null;
  }
  return (
    <LabeledDiv
      label={
        <InfoRow infoTitle={puppets.name} infoContent={puppets.description}>
          Puppets on a String
        </InfoRow>
      }
      style={{ width: "min-content" }}
      innerStyle={{
        flexDirection: "row",
        gap: rem(2),
        justifyContent: "center",
      }}
    >
      {passedFactions.map((factionId) => {
        return (
          <button
            key={factionId}
            style={{ borderRadius: "100%", padding: rem(2) }}
            onClick={() =>
              dataUpdate(
                Events.EndTurnEvent(/* samePlayer= */ false, factionId),
              )
            }
          >
            <FactionIcon factionId={factionId} size={20} />
          </button>
        );
      })}
    </LabeledDiv>
  );
}

interface ActivePlayerColumnProps {
  activeFactionId: FactionId;
  onDeckFactionId: Optional<FactionId>;
}

function ActivePlayerColumn({
  activeFactionId,
  onDeckFactionId,
}: ActivePlayerColumnProps) {
  const allSecondariesCompleted = useAllSecondariesCompleted();
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const intl = useIntl();
  const primaryCompleted = usePrimaryCompleted();
  const viewOnly = useViewOnly();

  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  const onDeckFactionColor = useFactionColor(
    onDeckFactionId ?? "Vuil'raith Cabal",
  );

  return (
    <div className={styles.ActivePlayerColumn}>
      <FormattedMessage
        id="vTtJ6S"
        description="Label showing that the specific player is the current player."
        defaultMessage="Active Player"
      />
      <SwitchTransition>
        <CSSTransition
          key={activeFactionId}
          timeout={120}
          classNames="fade"
          nodeRef={primaryRef}
        >
          <FactionCard
            factionId={activeFactionId}
            rightLabel={
              <FactionTimer
                active={!primaryCompleted || allSecondariesCompleted}
                factionId={activeFactionId}
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
                <PromissoryMenu factionId={activeFactionId} />
              </div>
              <FactionActions factionId={activeFactionId} />
              <AdditionalActions
                factionId={activeFactionId}
                style={{ minWidth: rem(350) }}
              />
              <ExpeditionSelector factionId={activeFactionId} />
            </div>
          </FactionCard>
        </CSSTransition>
      </SwitchTransition>
      <NextPlayerButtons activeFactionId={activeFactionId} />
      {onDeckFactionId ? (
        <div
          className="flexRow"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <SwitchTransition>
            <CSSTransition
              key={onDeckFactionId}
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
                    factionId={onDeckFactionId}
                    style={{
                      fontSize: rem(16),
                    }}
                    width={84}
                  />
                }
                color={onDeckFactionColor}
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
                  {<FactionComponents.Name factionId={onDeckFactionId} />}
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
                    <FactionIcon factionId={onDeckFactionId} size="100%" />
                  </div>
                </div>
              </LabeledDiv>
            </CSSTransition>
          </SwitchTransition>
        </div>
      ) : null}
      <LockedButtons
        unlocked={!activeFactionId}
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
              { phase: phaseString("STATUS", intl) },
            ),
            onClick: () => {
              dataUpdate(Events.AdvancePhaseEvent());
            },
          },
        ]}
        viewOnly={viewOnly}
      />
    </div>
  );
}

type CardWithFaction = StrategyCard & { faction: FactionId };

function StrategyCardColumn({
  activeFactionId,
}: {
  activeFactionId: Optional<FactionId>;
}) {
  const strategyCards = useStrategyCards();

  const orderedStrategyCards = sortStrategyCards(Object.values(strategyCards));

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
        const isActivePlayer = primaryCard.faction === activeFactionId;
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
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const intl = useIntl();
  const viewOnly = useViewOnly();

  const activeFactionId = useActiveFactionId();
  const onDeckFactionId = useOnDeckFactionId();

  return (
    <>
      <StrategyCardColumn activeFactionId={activeFactionId} />
      <div className="flexColumn" style={{ gap: rem(16) }}>
        <div className="flexColumn" style={{ width: "100%" }}>
          {activeFactionId ? (
            <ActivePlayerColumn
              activeFactionId={activeFactionId}
              onDeckFactionId={onDeckFactionId}
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
              <UnpassSection />
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
                      { phase: phaseString("STATUS", intl) },
                    ),
                    onClick: () => {
                      dataUpdate(Events.AdvancePhaseEvent());
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

function UnpassSection() {
  const dataUpdate = useDataUpdate();
  const ralNel = useFaction("Ral Nel Consortium");
  const ralNelLeader = useLeader("Director Nel");

  if (!ralNel || !ralNelLeader) {
    return null;
  }

  if (ralNelLeader.state !== "readied") {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(ralNel)}
      color={getFactionColor(ralNel)}
      style={{ width: "min-content" }}
    >
      <button
        onClick={() => dataUpdate(Events.UnpassEvent("Ral Nel Consortium"))}
      >
        Use Hero to Unpass
      </button>
    </LabeledDiv>
  );
}
