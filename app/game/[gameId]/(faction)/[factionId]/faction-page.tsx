"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AddPlanetList } from "../../../../../src/AddPlanetList";
import { AddTechList } from "../../../../../src/AddTechList";
import { AgendaRow } from "../../../../../src/AgendaRow";
import { FactionSummary } from "../../../../../src/FactionSummary";
import { ClientOnlyHoverMenu } from "../../../../../src/HoverMenu";
import { LockedButtons } from "../../../../../src/LockedButton";
import { ObjectiveList } from "../../../../../src/ObjectiveList";
import { SelectableRow } from "../../../../../src/SelectableRow";
import { Tab, TabBody } from "../../../../../src/Tab";
import { TechRow } from "../../../../../src/TechRow";
import { StaticFactionTimer } from "../../../../../src/Timer";
import FactionCard from "../../../../../src/components/FactionCard/FactionCard";
import LabeledDiv from "../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../src/components/LabeledLine/LabeledLine";
import Modal from "../../../../../src/components/Modal/Modal";
import ObjectiveRow from "../../../../../src/components/ObjectiveRow/ObjectiveRow";
import PlanetRow from "../../../../../src/components/PlanetRow/PlanetRow";
import { Selector } from "../../../../../src/components/Selector/Selector";
import StartingComponents from "../../../../../src/components/StartingComponents/StartingComponents";
import Updater from "../../../../../src/components/Updater/Updater";
import {
  canFactionVote,
  computeRemainingVotes,
  getTargets,
} from "../../../../../src/components/VoteBlock/VoteBlock";
import {
  ActionLogContext,
  AgendaContext,
  AttachmentContext,
  FactionContext,
  GameIdContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  StateContext,
  StrategyCardContext,
  TechContext,
} from "../../../../../src/context/Context";
import {
  addTechAsync,
  advancePhaseAsync,
  castVotesAsync,
  claimPlanetAsync,
  hideAgendaAsync,
  hideObjectiveAsync,
  markSecondaryAsync,
  removeTechAsync,
  resolveAgendaAsync,
  revealAgendaAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  selectEligibleOutcomesAsync,
  speakerTieBreakAsync,
  unclaimPlanetAsync,
  undoAsync,
  unscoreObjectiveAsync,
} from "../../../../../src/dynamic/api";
import {
  AdditionalActions,
  FactionActionButtons,
  NextPlayerButtons,
  advanceToStatusPhase,
} from "../../../../../src/main/ActionPhase";
import { computeVotes } from "../../../../../src/main/AgendaPhase";
import {
  setupPhaseComplete,
  startFirstRound,
} from "../../../../../src/main/SetupPhase";
import { statusPhaseComplete } from "../../../../../src/main/StatusPhase";
import {
  StrategyCardSelectList,
  advanceToActionPhase,
} from "../../../../../src/main/StrategyPhase";
import {
  getActiveAgenda,
  getFactionVotes,
  getScoredObjectives,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../../../src/util/actionLog";
import {
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../../../../src/util/api/actionLog";
import { getSelectedActionFromLog } from "../../../../../src/util/api/data";
import { setGameId } from "../../../../../src/util/api/util";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../../../../src/util/planets";
import {
  objectiveTypeString,
  phaseString,
} from "../../../../../src/util/strings";
import {
  filterToOwnedTechs,
  filterToUnownedTechs,
} from "../../../../../src/util/techs";
import styles from "./faction-page.module.scss";

const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

function SecondaryCheck({
  faction,
  gameId,
}: {
  faction: Faction;
  gameId: string;
}) {
  const secondaryState = faction.secondary ?? "PENDING";
  return (
    <div className="flexRow">
      {secondaryState === "PENDING" ? (
        <React.Fragment>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, faction.id, "DONE");
            }}
          >
            Mark Completed
          </button>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, faction.id, "SKIPPED");
            }}
          >
            Skip
          </button>
        </React.Fragment>
      ) : (
        <button
          onClick={() => {
            markSecondaryAsync(gameId, faction.id, "PENDING");
          }}
        >
          Not Done Yet
        </button>
      )}
    </div>
  );
}

function PhaseSection({ factionId }: { factionId: FactionId }) {
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const planets = useContext(PlanetContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);
  const voteRef = useRef<HTMLDivElement>(null);

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  let currentAgenda: Agenda | undefined;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = (agendas ?? {})[activeAgenda];
  }

  function addObj(objectiveId: ObjectiveId) {
    if (!gameId) {
      return;
    }
    revealObjectiveAsync(gameId, objectiveId);
  }
  function removeObj(objectiveId: ObjectiveId) {
    if (!gameId) {
      return;
    }
    hideObjectiveAsync(gameId, objectiveId);
  }
  function scoreObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    scoreObjectiveAsync(gameId, factionId, objectiveId);
  }
  function unscoreObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    unscoreObjectiveAsync(gameId, factionId, objectiveId);
  }
  function selectAgenda(agendaId: AgendaId) {
    if (!gameId) {
      return;
    }
    revealAgendaAsync(gameId, agendaId);
  }
  function hideAgendaLocal(agendaId: AgendaId) {
    if (!gameId) {
      return;
    }
    hideAgendaAsync(gameId, agendaId);
  }
  function selectEligibleOutcome(outcome: OutcomeType | "None") {
    if (!gameId) {
      return;
    }
    selectEligibleOutcomesAsync(gameId, outcome);
  }
  function selectSpeakerTieBreak(tieBreak: string | null) {
    if (!gameId) {
      return;
    }
    speakerTieBreakAsync(gameId, tieBreak ?? "None");
  }
  if (!factionId) {
    return null;
  }

  const orderedAgendas = Object.values(agendas ?? {}).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  const outcomes = new Set<OutcomeType>();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });
  // let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  if (agendaNum > 2) {
    return null;
  }

  const localAgenda = structuredClone(currentAgenda);
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (localAgenda && eligibleOutcomes && eligibleOutcomes !== "None") {
    localAgenda.elect = eligibleOutcomes;
  }
  const targets = getTargets(
    localAgenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  );
  const totalVotes = computeVotes(
    currentAgenda,
    currentTurn,
    Object.keys(factions).length
  );
  const maxVotes = Object.values(totalVotes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(totalVotes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });
  const isTie = selectedTargets.length !== 1;
  const ownedPlanets = filterToClaimedPlanets(planets, factionId);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog)
  );

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const label =
    // !!subState.miscount
    //   ? "Re-voting on Miscounted Agenda"
    //   :
    agendaNum === 1 ? "FIRST AGENDA" : "SECOND AGENDA";
  async function completeAgenda() {
    if (!gameId) {
      return;
    }
    const tieBreak = getSpeakerTieBreak(currentTurn);
    const target = tieBreak ? tieBreak : selectedTargets[0];
    if (!target || !currentAgenda) {
      return;
    }
    resolveAgendaAsync(gameId, currentAgenda?.id, target);
  }
  function castVotesLocal(
    target: string | undefined,
    votes: number,
    extraVotes: number
  ) {
    if (!gameId || !factionId) {
      return;
    }
    if (target === "Abstain") {
      castVotesAsync(gameId, factionId, 0, 0, "Abstain");
    } else {
      castVotesAsync(gameId, factionId, votes, extraVotes, target);
    }
  }
  const factionVotes = getFactionVotes(currentTurn, factionId);
  function saveCastVotes(element: HTMLDivElement) {
    if (element.innerText !== "") {
      const numerical = parseInt(element.innerText);
      if (!isNaN(numerical)) {
        castVotesLocal(
          factionVotes?.target,
          numerical,
          factionVotes?.extraVotes ?? 0
        );
        element.innerText = numerical.toString();
      }
    }
    element.innerText = factionVotes?.votes?.toString() ?? "0";
  }

  let leftLabel: React.ReactNode | undefined;
  let centerLabel: React.ReactNode | undefined;
  let phaseContent = null;
  switch (state?.phase) {
    case "SETUP": {
      const revealedObjectiveIds = currentTurn
        .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
        .map(
          (logEntry) => (logEntry.data as RevealObjectiveData).event.objective
        );
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return (
            objective.type === "STAGE ONE" &&
            !revealedObjectiveIds.includes(objective.id)
          );
        }
      );
      centerLabel = undefined;
      phaseContent = (
        <React.Fragment>
          <LabeledDiv
            label={
              <FormattedMessage
                id="rlGbdz"
                description="A label for a section of components that a faction starts with."
                defaultMessage="Starting Components"
              />
            }
          >
            <div style={{ fontSize: "16px", whiteSpace: "nowrap" }}>
              <StartingComponents factionId={faction.id} />
            </div>
          </LabeledDiv>
          <LabeledDiv
            label={
              <FormattedMessage
                id="5R8kPv"
                description="Label for a section for actions by the speaker."
                defaultMessage="Speaker Actions"
              />
            }
          >
            {revealedObjectiveIds.length > 0 ? (
              <LabeledDiv
                label={
                  <FormattedMessage
                    id="RBlsAq"
                    description="A label for the stage I objectives that have been revealed"
                    defaultMessage="Revealed stage I objectives"
                  />
                }
              >
                {revealedObjectiveIds.map((objectiveId) => {
                  const objectiveObj = objectives[objectiveId];
                  if (!objectiveObj) {
                    return null;
                  }
                  return (
                    <ObjectiveRow
                      key={objectiveId}
                      objective={objectiveObj}
                      removeObjective={() => removeObj(objectiveId)}
                      viewing={true}
                    />
                  );
                })}
              </LabeledDiv>
            ) : null}
            {revealedObjectiveIds.length < 2 ? (
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="6L07nG"
                    description="Text telling the user to reveal an objective."
                    defaultMessage="Reveal Objective"
                  />
                }
              >
                <div
                  className="flexRow"
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(10, auto)",
                    justifyContent: "flex-start",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    gap: "4px",
                    alignItems: "stretch",
                    maxWidth: "85vw",
                    overflowX: "auto",
                  }}
                >
                  {Object.values(availableObjectives)
                    .filter((objective) => {
                      return objective.type === "STAGE ONE";
                    })
                    .map((objective) => {
                      return (
                        <button
                          key={objective.id}
                          style={{ writingMode: "horizontal-tb" }}
                          onClick={() => addObj(objective.id)}
                        >
                          {objective.name}
                        </button>
                      );
                    })}
                </div>
              </ClientOnlyHoverMenu>
            ) : null}
          </LabeledDiv>
        </React.Fragment>
      );
      break;
    }
    case "STRATEGY":
      function canUndo() {
        const lastAction = currentTurn[0];
        return (
          !!lastAction &&
          lastAction.data.action === "ASSIGN_STRATEGY_CARD" &&
          lastAction.data.event.pickedBy === factionId
        );
      }
      if (factionId === state.activeplayer) {
        centerLabel = (
          <FormattedMessage
            id="hCXyLw"
            defaultMessage="Select Strategy Card"
            description="Label telling a player to select a strategy card."
          />
        );
        phaseContent = (
          <div className="flexColumn" style={{ width: "100%" }}>
            <div
              className="flexColumn "
              style={{ alignItems: "stretch", width: "100%", gap: "4px" }}
            >
              <StrategyCardSelectList mobile={true} />
            </div>
          </div>
        );
      } else if (canUndo()) {
        centerLabel = (
          <FormattedMessage
            id="Irm2+w"
            defaultMessage="{phase} Phase"
            description="Text shown on side of screen during a specific phase"
            values={{ phase: phaseString("STRATEGY", intl).toUpperCase() }}
          />
        );
        phaseContent = (
          <button
            onClick={() => {
              if (!gameId) {
                return;
              }
              undoAsync(gameId);
            }}
          >
            Undo SC Pick
          </button>
        );
      }
      break;
    case "ACTION":
      const selectedAction = getSelectedActionFromLog(actionLog);
      if (factionId === state.activeplayer) {
        centerLabel = (
          <FormattedMessage
            id="YeYE6S"
            description="Label telling the user to select the action a player took."
            defaultMessage="Select Action"
          />
        );
        phaseContent = (
          <React.Fragment>
            <FactionActionButtons factionId={factionId} />
            <div
              className="flexColumn"
              style={{ width: "95%", alignItems: "flex-start" }}
            >
              <AdditionalActions
                factionId={factionId}
                style={{ width: "100%", alignItems: "flex-start" }}
                primaryOnly={true}
              />
            </div>
            {selectedAction ? (
              <div className="flexRow" style={{ width: "100%" }}>
                <NextPlayerButtons />
              </div>
            ) : null}
          </React.Fragment>
        );
      } else {
        switch (selectedAction) {
          case "Leadership":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Diplomacy":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Politics":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Construction":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Trade":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Warfare":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
          case "Technology":
            if (factionId === "Nekro Virus") {
              leftLabel = (
                <FormattedMessage
                  id="PBW6vs"
                  description="The alternate ability for a strategy card."
                  defaultMessage="Secondary"
                />
              );
              phaseContent = (
                <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
              );
            } else {
              phaseContent = (
                <AdditionalActions
                  factionId={factionId}
                  style={{ width: "100%" }}
                  secondaryOnly={true}
                />
              );
            }
            break;
          case "Imperial":
            leftLabel = (
              <FormattedMessage
                id="PBW6vs"
                description="The alternate ability for a strategy card."
                defaultMessage="Secondary"
              />
            );
            phaseContent = (
              <SecondaryCheck faction={faction} gameId={gameId ?? ""} />
            );
            break;
        }
      }
      if (state.activeplayer === "None") {
        return null;
      }
      break;
    case "STATUS": {
      const type: ObjectiveType = state.round < 4 ? "STAGE ONE" : "STAGE TWO";
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return (
            objective.selected &&
            (objective.type === "STAGE ONE" ||
              objective.type === "STAGE TWO") &&
            !(objective.scorers ?? []).includes(factionId)
          );
        }
      );
      const canScoreObjectives = Object.values(planets ?? {}).reduce(
        (canScore, planet) => {
          if (faction.id === "Clan of Saar") {
            return true;
          }
          let planetFaction = faction.id;
          if (faction.id === "Council Keleres") {
            planetFaction = faction.startswith.faction ?? planetFaction;
          }
          if (
            planet.home &&
            planet.faction === planetFaction &&
            planet.owner !== faction.id
          ) {
            return false;
          }
          return canScore;
        },
        true
      );
      const secrets = Object.values(objectives ?? {}).filter((objective) => {
        return (
          objective.type === "SECRET" &&
          !(objective.scorers ?? []).includes(factionId) &&
          objective.phase === "STATUS"
        );
      });
      const scoredObjectives = getScoredObjectives(currentTurn, factionId);
      const scoredPublics = scoredObjectives.filter((objective) => {
        return (
          (objectives[objective] ?? {}).type === "STAGE ONE" ||
          (objectives[objective] ?? {}).type === "STAGE TWO"
        );
      });
      const scoredSecrets = scoredObjectives.filter((objective) => {
        return (objectives[objective] ?? {}).type === "SECRET";
      });
      const revealableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return objective.type === type && !objective.selected;
        }
      );
      const revealedObjective = currentTurn
        .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
        .map(
          (logEntry) => (logEntry.data as RevealObjectiveData).event.objective
        )[0];
      const revealedObjectiveObj = revealedObjective
        ? objectives[revealedObjective]
        : undefined;
      centerLabel = (
        <FormattedMessage
          id="WHJC8f"
          description="Text telling the players to score objectives."
          defaultMessage="Score Objectives"
        />
      );
      phaseContent = (
        <React.Fragment>
          <div
            className="flexColumn"
            style={{
              padding: "0 8px",
              flexWrap: "wrap",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            {scoredPublics[0] ? (
              <LabeledDiv
                label="SCORED PUBLIC"
                style={{ whiteSpace: "nowrap" }}
              >
                <SelectableRow
                  itemId={scoredPublics[0]}
                  removeItem={unscoreObj}
                >
                  {scoredPublics[0]}
                </SelectableRow>
              </LabeledDiv>
            ) : !canScoreObjectives ? (
              <FormattedMessage
                id="CoNZle"
                description="Message telling a player that they cannot score public objectives."
                defaultMessage="Cannot score Public Objectives"
              />
            ) : (
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="73882v"
                    description="Message telling a player to score a public objective."
                    defaultMessage="Score Public Objective"
                  />
                }
              >
                <div
                  className="flexColumn"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "8px",
                    gap: "4px",
                    alignItems: "stretch",
                  }}
                >
                  {availableObjectives.length === 0 ? (
                    <FormattedMessage
                      id="HQ3wv9"
                      description="Message telling a player that they have scored all objectives."
                      defaultMessage="No unscored Public Objectives"
                    />
                  ) : null}
                  {availableObjectives.map((objective) => {
                    return (
                      <button
                        key={objective.id}
                        onClick={() => scoreObj(objective.id)}
                      >
                        {objective.name}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            )}
            {scoredSecrets[0] ? (
              <LabeledDiv
                label="SCORED SECRET"
                style={{ whiteSpace: "nowrap" }}
              >
                <SelectableRow
                  itemId={scoredSecrets[0]}
                  removeItem={unscoreObj}
                >
                  {scoredSecrets[0]}
                </SelectableRow>
              </LabeledDiv>
            ) : (
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="zlpl9F"
                    description="Message telling a player to score a secret objective."
                    defaultMessage="Score Secret Objective"
                  />
                }
              >
                <div
                  className="flexRow"
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(9, auto)",
                    justifyContent: "flex-start",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    gap: "4px",
                    alignItems: "stretch",
                    maxWidth: "85vw",
                    overflowX: "auto",
                  }}
                >
                  {secrets.map((objective) => {
                    return (
                      <button
                        key={objective.id}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() => scoreObj(objective.id)}
                      >
                        {objective.name}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            )}
          </div>
          <LabeledDiv
            label={
              <FormattedMessage
                id="5R8kPv"
                description="Label for a section for actions by the speaker."
                defaultMessage="Speaker Actions"
              />
            }
          >
            {revealedObjectiveObj ? (
              <LabeledDiv
                label={
                  <FormattedMessage
                    id="IfyaDZ"
                    description="A label for revealed objectives."
                    defaultMessage="Revealed {type} {count, plural, one {Objective} other {Objectives}}"
                    values={{
                      count: 1,
                      type:
                        state.round > 3
                          ? objectiveTypeString("STAGE TWO", intl)
                          : objectiveTypeString("STAGE ONE", intl),
                    }}
                  />
                }
              >
                <ObjectiveRow
                  objective={revealedObjectiveObj}
                  removeObjective={() => removeObj(revealedObjectiveObj.id)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                <ClientOnlyHoverMenu
                  label={
                    <FormattedMessage
                      id="lDBTCO"
                      description="Instruction telling the speaker to reveal objectives."
                      defaultMessage="Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}"
                      values={{
                        count: 1,
                        type:
                          state.round > 3
                            ? objectiveTypeString("STAGE TWO", intl)
                            : objectiveTypeString("STAGE ONE", intl),
                      }}
                    />
                  }
                  style={{ maxHeight: "400px" }}
                >
                  <div
                    className="flexRow"
                    style={{
                      maxWidth: "85vw",
                      gap: "4px",
                      whiteSpace: "nowrap",
                      padding: "8px",
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(10, auto)",
                      alignItems: "stretch",
                      justifyContent: "flex-start",
                      overflowX: "auto",
                    }}
                  >
                    {Object.values(revealableObjectives)
                      .filter((objective) => {
                        return (
                          objective.type ===
                          (state.round > 3 ? "STAGE TWO" : "STAGE ONE")
                        );
                      })
                      .map((objective) => {
                        return (
                          <button
                            key={objective.id}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() => addObj(objective.id)}
                          >
                            {objective.name}
                          </button>
                        );
                      })}
                  </div>
                </ClientOnlyHoverMenu>
              </div>
            )}
          </LabeledDiv>
        </React.Fragment>
      );
      break;
    }
    case "AGENDA": {
      const tieBreak = getSpeakerTieBreak(currentTurn);
      const hasVotableTarget =
        !!factionVotes?.target && factionVotes?.target !== "Abstain";
      const items = Math.min((targets ?? []).length, 12);
      const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
      centerLabel = (
        <FormattedMessage
          id="Irm2+w"
          defaultMessage="{phase} Phase"
          description="Text shown on side of screen during a specific phase"
          values={{ phase: phaseString("AGENDA", intl).toUpperCase() }}
        />
      );
      phaseContent = (
        <React.Fragment>
          {!currentAgenda ? (
            <LabeledDiv
              label={
                <FormattedMessage
                  id="5R8kPv"
                  description="Label for a section for actions by the speaker."
                  defaultMessage="Speaker Actions"
                />
              }
              style={{ marginTop: "4px", paddingTop: "12px" }}
            >
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="ZAYAbS"
                    description="Instruction telling the speaker to reveal an agenda."
                    defaultMessage="Reveal and Read one Agenda"
                  />
                }
              >
                <div
                  className="flexRow"
                  style={{
                    maxWidth: "85vw",
                    gap: "4px",
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(8, auto)",
                    whiteSpace: "nowrap",
                    padding: "8px",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    overflowX: "auto",
                  }}
                >
                  {orderedAgendas.map((agenda) => {
                    return (
                      <button
                        key={agenda.id}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() => selectAgenda(agenda.id)}
                      >
                        {agenda.name}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            </LabeledDiv>
          ) : (
            <React.Fragment>
              <div className="largeFont" style={{ width: "100%" }}>
                <LabeledDiv label={label}>
                  <AgendaRow
                    agenda={currentAgenda}
                    removeAgenda={() => {
                      if (!currentAgenda) {
                        return;
                      }
                      hideAgendaLocal(currentAgenda.id);
                    }}
                  />
                </LabeledDiv>
              </div>
              {currentAgenda.id === "Covert Legislation" ? (
                eligibleOutcomes ? (
                  <LabeledDiv
                    label={
                      <FormattedMessage
                        id="+BcBcX"
                        description="Label for a section showing the eligible outcomes."
                        defaultMessage="Eligible Outcomes"
                      />
                    }
                    style={{ paddingTop: "8px" }}
                  >
                    <SelectableRow
                      itemId={eligibleOutcomes}
                      removeItem={() => selectEligibleOutcome("None")}
                    >
                      <div style={{ display: "flex", fontSize: "18px" }}>
                        {eligibleOutcomes}
                      </div>
                    </SelectableRow>
                  </LabeledDiv>
                ) : (
                  <LabeledDiv
                    label={
                      <FormattedMessage
                        id="5R8kPv"
                        description="Label for a section for actions by the speaker."
                        defaultMessage="Speaker Actions"
                      />
                    }
                    style={{ marginTop: "4px", paddingTop: "12px" }}
                  >
                    <ClientOnlyHoverMenu
                      label={
                        <FormattedMessage
                          id="cKaLW8"
                          description="Text on a hover menu for revealing eligible outcomes."
                          defaultMessage="Reveal Eligible Outcomes"
                        />
                      }
                    >
                      <div
                        className="flexColumn"
                        style={{
                          padding: "8px",
                          gap: "4px",
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        {Array.from(outcomes).map((outcome) => {
                          return (
                            <button
                              key={outcome}
                              onClick={() => selectEligibleOutcome(outcome)}
                            >
                              {outcome}
                            </button>
                          );
                        })}
                      </div>
                    </ClientOnlyHoverMenu>
                  </LabeledDiv>
                )
              ) : null}
            </React.Fragment>
          )}
          {currentAgenda ? (
            <div
              className="flexColumn"
              style={{ alignItems: "stretch", width: "100%" }}
            >
              <LabeledLine leftLabel={`Vote on ${currentAgenda.name}`} />
              {!canFactionVote(faction, agendas, state, currentTurn) ? (
                <div className="flexRow">
                  <FormattedMessage
                    id="c4LYqr"
                    description="Text informing a player that they cannot vote."
                    defaultMessage="Cannot Vote"
                  />
                </div>
              ) : (
                <React.Fragment>
                  <div
                    className="flexColumn"
                    style={{
                      paddingLeft: "8px",
                      width: "100%",
                      alignItems: "flex-start",
                    }}
                  >
                    <Selector
                      hoverMenuLabel={
                        <FormattedMessage
                          id="cHsAYk"
                          description="Text on hover menu for selecting voting outcome."
                          defaultMessage="Select Outcome"
                        />
                      }
                      selectedLabel="Selected Outcome"
                      options={targets}
                      selectedItem={factionVotes?.target}
                      toggleItem={(itemId, add) => {
                        if (add) {
                          castVotesLocal(itemId, 0, 0);
                        } else {
                          castVotesLocal(undefined, 0, 0);
                        }
                      }}
                    />
                    <div
                      className="flexRow"
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      Available Votes:
                      <div className={styles.VotingBlock}>
                        <div className={styles.InfluenceSymbol}>&#x2B21;</div>
                        <div className={styles.InfluenceTextWrapper}>
                          {influence}
                        </div>
                        <div style={{ fontSize: "16px" }}>+ {extraVotes}</div>
                      </div>
                    </div>
                    <div
                      className="flexRow"
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      Cast Votes:
                      <div
                        className="flexRow"
                        style={{
                          justifyContent: "flex-start",
                          flexShrink: 0,
                          gap: "12px",
                          fontSize: "24px",
                          paddingLeft: "12px",
                        }}
                      >
                        {factionVotes?.votes ?? 0 > 0 ? (
                          <div
                            className="arrowDown"
                            onClick={() =>
                              castVotesLocal(
                                factionVotes?.target,
                                (factionVotes?.votes ?? 0) - 1,
                                factionVotes?.extraVotes ?? 0
                              )
                            }
                          ></div>
                        ) : (
                          <div style={{ width: "12px" }}></div>
                        )}
                        <div
                          className="flexRow"
                          ref={voteRef}
                          contentEditable={hasVotableTarget}
                          suppressContentEditableWarning={true}
                          onClick={(e) => {
                            if (!hasVotableTarget) {
                              return;
                            }
                            e.currentTarget.innerText = "";
                          }}
                          onBlur={(e) => saveCastVotes(e.currentTarget)}
                          style={{ width: "32px" }}
                        >
                          {factionVotes?.votes ?? 0}
                        </div>
                        {factionVotes?.target &&
                        factionVotes?.target !== "Abstain" ? (
                          <div
                            className="arrowUp"
                            onClick={() =>
                              castVotesLocal(
                                factionVotes.target,
                                (factionVotes?.votes ?? 0) + 1,
                                factionVotes?.extraVotes ?? 0
                              )
                            }
                          ></div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
              <LabeledLine />
              {isTie ? (
                !tieBreak ? (
                  <LabeledDiv
                    label={
                      <FormattedMessage
                        id="5R8kPv"
                        description="Label for a section for actions by the speaker."
                        defaultMessage="Speaker Actions"
                      />
                    }
                    style={{ paddingTop: "12px" }}
                  >
                    <ClientOnlyHoverMenu
                      label={
                        <FormattedMessage
                          id="Kzzn9t"
                          description="Text on a hover menu for the speaker choosing the outcome."
                          defaultMessage="Choose outcome if tied"
                        />
                      }
                    >
                      <div
                        className="flexRow"
                        style={{
                          maxWidth: "85vw",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          padding: "8px",
                          alignItems: "stretch",
                          display: "grid",
                          gridAutoFlow: "column",
                          gridTemplateRows: `repeat(${items}, auto)`,
                          justifyContent: "flex-start",
                          overflowX: "auto",
                        }}
                      >
                        {selectedTargets.length > 0
                          ? selectedTargets.map((target) => {
                              return (
                                <button
                                  key={target}
                                  style={{ writingMode: "horizontal-tb" }}
                                  onClick={() => selectSpeakerTieBreak(target)}
                                >
                                  {target}
                                </button>
                              );
                            })
                          : targets.map((target) => {
                              if (target.id === "Abstain") {
                                return null;
                              }
                              return (
                                <button
                                  key={target.id}
                                  style={{ writingMode: "horizontal-tb" }}
                                  onClick={() =>
                                    selectSpeakerTieBreak(target.id)
                                  }
                                >
                                  {target.name}
                                </button>
                              );
                            })}
                      </div>
                    </ClientOnlyHoverMenu>
                  </LabeledDiv>
                ) : (
                  <LabeledDiv
                    label="SPEAKER TIE BREAK"
                    style={{ paddingTop: "8px" }}
                  >
                    <SelectableRow
                      itemId={tieBreak}
                      removeItem={() => selectSpeakerTieBreak(null)}
                    >
                      {tieBreak}
                    </SelectableRow>
                  </LabeledDiv>
                )
              ) : null}
              {selectedTargets.length === 1 || tieBreak ? (
                <div
                  className="flexRow"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <button onClick={completeAgenda}>
                    Resolve with target:{" "}
                    {selectedTargets.length === 1
                      ? selectedTargets[0]
                      : tieBreak}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </React.Fragment>
      );
      break;
    }
  }
  if (!phaseContent) {
    return null;
  }

  const hasLabel = !!leftLabel || !!centerLabel;

  return (
    <div className="flexColumn largeFont">
      {hasLabel ? (
        <LabeledLine label={centerLabel} leftLabel={leftLabel} />
      ) : null}
      {phaseContent}
    </div>
  );
}

function FactionContent({ factionId }: { factionId: FactionId }) {
  const router = useRouter();
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState<string>("");
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const techs = useContext(TechContext);

  const faction = factions[factionId];

  if (!faction) {
    if (Object.keys(factions).length > 0) {
      router.push(`/game/${gameId}`);
    }
    return null;
  }

  function toggleTabShown(tab: string) {
    if (tabShown === tab) {
      setTabShown("");
    } else {
      setTabShown(tab);
    }
  }

  function toggleAddTechMenu() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(toRemove: PlanetId) {
    unclaimPlanetAsync(gameId, factionId, toRemove);
  }

  function addPlanet(toAdd: PlanetId) {
    claimPlanetAsync(gameId, factionId, toAdd);
  }

  function removeTechLocal(toRemove: TechId) {
    removeTechAsync(gameId, factionId, toRemove);
  }

  function addTechLocal(toAdd: TechId) {
    addTechAsync(gameId, factionId, toAdd);
  }

  const techsObj: Partial<Record<TechId, Tech>> = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (tech.faction) {
      if (factionId === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (factionId !== "Nekro Virus" && tech.faction !== factionId) {
        return;
      }
    }
    techsObj[tech.id] = tech;
  });
  if (factionId !== "Nekro Virus") {
    Object.values(techsObj).forEach((tech) => {
      if (tech.type === "UPGRADE" && tech.replaces) {
        delete techsObj[tech.replaces];
      }
    });
  }

  const ownedTechs = filterToOwnedTechs(techsObj, faction);
  ownedTechs.sort((a, b) => {
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
  const remainingTechs = filterToUnownedTechs(techsObj, faction);

  const claimedPlanets = filterToClaimedPlanets(planets, factionId);
  const updatedPlanets = applyAllPlanetAttachments(claimedPlanets, attachments);

  let VPs = 0;
  for (const objective of Object.values(objectives ?? {})) {
    if ((objective.scorers ?? []).includes(factionId)) {
      VPs += objective.points;
    }
  }

  function toggleAddPlanetMenu() {
    setShowAddPlanet(!showAddPlanet);
  }

  return (
    <div className="flexColumn" style={{ gap: "8px", width: "100%" }}>
      <Modal
        closeMenu={toggleAddTechMenu}
        visible={showAddTech}
        title={
          <FormattedMessage
            id="3qIvsL"
            description="Label on a hover menu used to research tech."
            defaultMessage="Research Tech"
          />
        }
      >
        <AddTechList techs={remainingTechs} addTech={addTechLocal} />
      </Modal>
      <Modal
        closeMenu={toggleAddPlanetMenu}
        visible={showAddPlanet}
        title={
          <FormattedMessage
            id="PrGqwQ"
            description="Label for adding a planet."
            defaultMessage="Add Planet"
          />
        }
      >
        <AddPlanetList
          factionId={factionId}
          planets={planets}
          addPlanet={addPlanet}
        />
      </Modal>
      <FactionSummary factionId={factionId} options={{ showIcon: true }} />
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexBasis: "100%",
          }}
        >
          <div
            className="flexColumn"
            style={{ width: "100%", alignItems: "stretch", padding: "0px 8px" }}
          >
            <PhaseSection factionId={factionId} />
            <LabeledLine
              label={
                <FormattedMessage
                  id="NUNF0C"
                  defaultMessage="Faction Details"
                  description="Label for a section of faction details."
                />
              }
            />
            <div
              className="flexColumn"
              style={{ gap: 0, alignItems: "stretch" }}
            >
              {/* Tabs */}
              <div
                className="flexRow"
                style={{ width: "100%", margin: "0px 4px" }}
              >
                <Tab
                  selectTab={toggleTabShown}
                  id="techs"
                  selectedId={tabShown}
                >
                  <FormattedMessage
                    id="ys7uwX"
                    description="Shortened version of technologies."
                    defaultMessage="Techs"
                  />
                </Tab>
                <Tab
                  selectTab={toggleTabShown}
                  id="planets"
                  selectedId={tabShown}
                >
                  <FormattedMessage
                    id="1fNqTf"
                    description="Planets."
                    defaultMessage="Planets"
                  />
                </Tab>
                <Tab
                  selectTab={toggleTabShown}
                  id="objectives"
                  selectedId={tabShown}
                >
                  <FormattedMessage
                    id="5Bl4Ek"
                    description="Cards that define how to score victory points."
                    defaultMessage="Objectives"
                  />
                </Tab>
              </div>
              <TabBody id="techs" selectedId={tabShown}>
                <div>
                  <LabeledLine />
                  <div className="flexRow" style={{ height: "32px" }}>
                    <button onClick={toggleAddTechMenu}>
                      <FormattedMessage
                        id="3qIvsL"
                        description="Label on a hover menu used to research tech."
                        defaultMessage="Research Tech"
                      />
                    </button>
                  </div>
                  <div
                    className="flexColumn largeFont"
                    style={{
                      gap: "8px",
                      padding: "6px",
                      overflow: "auto",
                      justifyContent: "space-between",
                      alignItems: "stretch",
                    }}
                  >
                    {ownedTechs.map((tech) => {
                      return (
                        <TechRow
                          key={tech.id}
                          tech={tech}
                          removeTech={removeTechLocal}
                        />
                      );
                    })}
                  </div>
                </div>
              </TabBody>
              <TabBody id="planets" selectedId={tabShown}>
                <div>
                  <LabeledLine />
                  <div className="flexRow" style={{ height: "40px" }}>
                    <button onClick={toggleAddPlanetMenu}>
                      <FormattedMessage
                        id="PrGqwQ"
                        description="Label for adding a planet."
                        defaultMessage="Add Planet"
                      />
                    </button>
                  </div>
                  <div
                    className="largeFont"
                    style={{
                      boxSizing: "border-box",
                      paddingBottom: "4px",
                    }}
                  >
                    {updatedPlanets.map((planet) => {
                      return (
                        <PlanetRow
                          key={planet.id}
                          factionId={factionId}
                          planet={planet}
                          removePlanet={removePlanet}
                        />
                      );
                    })}
                  </div>
                </div>
              </TabBody>

              <TabBody id="objectives" selectedId={tabShown}>
                <React.Fragment>
                  <LabeledLine />
                  <ObjectiveList factionId={factionId} />
                </React.Fragment>
              </TabBody>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function FactionPage({ factionId }: { factionId: FactionId }) {
//   return (
//     // <div
//     //   style={{
//     //     display: "flex",
//     //     flexDirection: "column",
//     //     alignItems: "center",
//     //     height: "100svh",
//     //   }}
//     // >
//       {/* <DataProvider> */}
//       {/* <DndProvider backend={HTML5Backend}> */}
//       <InnerFactionPage factionId={factionId} />
//       {/* </DndProvider> */}
//       {/* </DataProvider> */}
//     // </div>
//   );
// }

export default function FactionPage({ factionId }: { factionId: FactionId }) {
  const router = useRouter();
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  const intl = useIntl();

  const [showMenu, setShowMenu] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPlanetModal, setShowPlanetModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  const faction = factions[factionId];

  if (!faction) {
    if (Object.keys(factions).length > 0) {
      router.push(`/game/${gameId}`);
    }
    return null;
  }

  function swapToFaction(newFaction: FactionId) {
    router.push(`/game/${gameId}/${newFaction}`);
    return null;
  }

  let orderedFactions: Faction[] = [];
  let orderTitle = <></>;
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderTitle = (
        <FormattedMessage
          id="L4UH+0"
          description="An ordering of factions based on the speaker."
          defaultMessage="Speaker Order"
        />
      );
      orderedFactions = Object.values(factions).sort(
        (a, b) => a.order - b.order
      );
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = (
        <FormattedMessage
          id="09baik"
          description="An ordering of factions based on initiative."
          defaultMessage="Initiative Order"
        />
      );
      const orderedCards = Object.values(strategyCards).sort(
        (a, b) => a.order - b.order
      );
      const orderedIds: FactionId[] = [];
      for (const card of orderedCards) {
        if (card.faction && !orderedIds.includes(card.faction)) {
          orderedIds.push(card.faction);
        }
      }

      for (const factionId of orderedIds) {
        const faction = factions[factionId];
        if (!faction) {
          continue;
        }
        orderedFactions.push(faction);
      }
      break;
    case "AGENDA":
      orderTitle = (
        <FormattedMessage
          id="rbtRWF"
          description="An ordering of factions based on voting."
          defaultMessage="Voting Order"
        />
      );
      orderedFactions = Object.values(factions).sort((a, b) => {
        if (a.name === "Argent Flight") {
          return -1;
        }
        if (b.name === "Argent Flight") {
          return 1;
        }
        if (a.name === state.speaker) {
          return 1;
        }
        if (b.name === state.speaker) {
          return -1;
        }
        return a.order - b.order;
      });
      break;
  }

  function NextPhaseButtons({}) {
    switch (state?.phase) {
      case "SETUP":
        return (
          <div className="flexColumn" style={{ marginTop: "8px" }}>
            <LockedButtons
              unlocked={setupPhaseComplete(factions ?? {}, revealedObjectives)}
              buttons={[
                {
                  text: intl.formatMessage({
                    id: "lYD2yu",
                    description: "Text on a button that will start a game.",
                    defaultMessage: "Start Game",
                  }),
                  onClick: () => {
                    if (!gameId) {
                      return;
                    }
                    startFirstRound(gameId);
                  },
                },
              ]}
            />
          </div>
        );
      case "STRATEGY":
        if (state?.activeplayer === "None") {
          return (
            <div className="flexColumn" style={{ marginTop: "8px" }}>
              <button
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  advanceToActionPhase(gameId);
                }}
              >
                <FormattedMessage
                  id="8/h2ME"
                  defaultMessage="Advance to {phase} Phase"
                  description="Text on a button that will advance the game to a specific phase."
                  values={{
                    phase: phaseString("ACTION", intl),
                  }}
                />
              </button>
            </div>
          );
        }
        return null;
      case "ACTION":
        return (
          <div className="flexColumn" style={{ marginTop: "8px" }}>
            <LockedButtons
              unlocked={state?.activeplayer === "None"}
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
      case "STATUS":
        let buttons = [];
        if (!state?.agendaUnlocked) {
          buttons.push({
            text: intl.formatMessage({
              id: "5WXn8l",
              defaultMessage: "Start Next Round",
              description: "Text on a button that will start the next round.",
            }),
            onClick: () => {
              if (!gameId) {
                return;
              }
              advancePhaseAsync(gameId, true);
            },
          });
        }
        buttons.push({
          text: intl.formatMessage(
            {
              id: "8/h2ME",
              defaultMessage: "Advance to {phase} Phase",
              description:
                "Text on a button that will advance the game to a specific phase.",
            },
            { phase: phaseString("AGENDA", intl) }
          ),
          onClick: () => {
            if (!gameId) {
              return;
            }
            advancePhaseAsync(gameId);
          },
        });
        return (
          <div className="flexColumn" style={{ marginTop: "8px" }}>
            <LockedButtons
              unlocked={statusPhaseComplete(
                getCurrentTurnLogEntries(actionLog)
              )}
              buttons={buttons}
            />
          </div>
        );
      case "AGENDA":
        return (
          <div className="flexColumn" style={{ marginTop: "8px" }}>
            <LockedButtons
              unlocked={state?.agendaNum === 3}
              buttons={[
                {
                  text: intl.formatMessage({
                    id: "5WXn8l",
                    defaultMessage: "Start Next Round",
                    description:
                      "Text on a button that will start the next round.",
                  }),
                  onClick: () => {
                    if (!gameId) {
                      return;
                    }
                    advancePhaseAsync(gameId, true);
                  },
                },
              ]}
            />
          </div>
        );
    }
    return null;
  }

  const HEX_RATIO = 2 / Math.sqrt(3);

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let mallice;
  if (options && (options["expansions"] ?? []).includes("POK")) {
    mallice = "A";
    if (planets && (planets["Mallice"] ?? {}).owner) {
      mallice = "B";
    }
  }

  return (
    <>
      <Updater />
      <div style={{ width: "100%", margin: "4px" }}>
        <FactionCard
          faction={faction}
          hideIcon
          style={{ width: "100%" }}
          rightLabel={
            <StaticFactionTimer
              factionId={factionId}
              width={80}
              style={{
                fontSize: "16px",
              }}
            />
          }
        >
          <FactionContent factionId={factionId} />
        </FactionCard>
      </div>
    </>
  );
}
