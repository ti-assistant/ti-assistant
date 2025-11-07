import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../../../../../../src/AgendaRow";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import ObjectiveRow from "../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import StartingComponents from "../../../../../../src/components/StartingComponents/StartingComponents";
import {
  canFactionVote,
  computeRemainingVotes,
  getTargets,
} from "../../../../../../src/components/VoteBlock/VoteBlock";
import {
  useActionLog,
  useAgendas,
  useAttachments,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useStrategyCards,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../src/context/stateDataHooks";
import {
  castVotesAsync,
  hideAgendaAsync,
  hideObjectiveAsync,
  markSecondaryAsync,
  resolveAgendaAsync,
  revealAgendaAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  selectEligibleOutcomesAsync,
  speakerTieBreakAsync,
  undoAsync,
  unscoreObjectiveAsync,
} from "../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import InfluenceSVG from "../../../../../../src/icons/planets/Influence";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import {
  getActiveAgenda,
  getFactionVotes,
  getLogEntries,
  getPlayedRelic,
  getScoredObjectives,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../../../../src/util/actionLog";
import {
  getCurrentPhaseLogEntries,
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../../../../../src/util/api/actionLog";
import { getSelectedActionFromLog } from "../../../../../../src/util/api/data";
import { filterToClaimedPlanets } from "../../../../../../src/util/planets";
import {
  objectiveTypeString,
  phaseString,
} from "../../../../../../src/util/strings";
import { Optional } from "../../../../../../src/util/types/types";
import { rem } from "../../../../../../src/util/util";
import {
  AdditionalActions,
  FactionActionButtons,
  NextPlayerButtons,
} from "../../../main/@phase/action/ActionPhase";
import { computeVotes } from "../../../main/@phase/agenda/AgendaPhase";
import { StrategyCardSelectList } from "../../../main/@phase/strategy/StrategyPhase";
import styles from "../faction-page.module.scss";

export default function PhaseSection({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const techs = useTechs();
  const viewOnly = useViewOnly();
  const voteRef = useRef<HTMLDivElement>(null);

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const currentPhase = getCurrentPhaseLogEntries(actionLog);
  let currentAgenda: Optional<Agenda>;
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
  function selectSpeakerTieBreak(tieBreak: Optional<string>) {
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

  let { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog),
    leaders,
    techs
  );
  const mawOfWorlds = relics["Maw of Worlds"];
  if (mawOfWorlds && mawOfWorlds.owner === factionId) {
    const mawEvent: Optional<MawOfWorldsEvent> = getPlayedRelic(
      currentPhase,
      "Maw of Worlds"
    ) as Optional<MawOfWorldsEvent>;
    if (mawEvent) {
      influence = 0;
    }
  }

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
    target: Optional<string>,
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

  let leftLabel: Optional<React.ReactNode>;
  let centerLabel: Optional<React.ReactNode>;
  let phaseContent = null;
  switch (state?.phase) {
    case "SETUP": {
      const revealedObjectiveIds = getLogEntries<RevealObjectiveData>(
        currentTurn,
        "REVEAL_OBJECTIVE"
      ).map((logEntry) => logEntry.data.event.objective);
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
            <div
              style={{ width: "100%", fontSize: rem(16), whiteSpace: "nowrap" }}
            >
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
                    defaultMessage="Revealed stage I {count, plural, one {objective} other {objectives}}"
                    values={{ count: revealedObjectiveIds.length }}
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
                    padding: rem(8),
                    gap: rem(4),
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
                          disabled={viewOnly}
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
              style={{ alignItems: "stretch", width: "100%", gap: rem(4) }}
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
              undoAsync(gameId);
            }}
            disabled={viewOnly}
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
                <NextPlayerButtons activeFactionId={factionId} />
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
      const revealedObjective = getLogEntries<RevealObjectiveData>(
        currentTurn,
        "REVEAL_OBJECTIVE"
      ).map((logEntry) => logEntry.data.event.objective)[0];
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
              padding: `0 ${rem(8)}`,
              flexWrap: "wrap",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            {scoredPublics[0] ? (
              <LabeledDiv
                label="SCORED PUBLIC"
                innerStyle={{ whiteSpace: "nowrap" }}
                blur
              >
                <SelectableRow
                  itemId={scoredPublics[0]}
                  removeItem={unscoreObj}
                  viewOnly={viewOnly}
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
                    padding: rem(8),
                    gap: rem(4),
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
                        disabled={viewOnly}
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
                innerStyle={{ whiteSpace: "nowrap" }}
                blur
              >
                <SelectableRow
                  itemId={scoredSecrets[0]}
                  removeItem={unscoreObj}
                  viewOnly={viewOnly}
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
                    padding: rem(8),
                    gap: rem(4),
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
                        disabled={viewOnly}
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
                blur
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
                  style={{ maxHeight: rem(400) }}
                >
                  <div
                    className="flexRow"
                    style={{
                      maxWidth: "85vw",
                      gap: rem(4),
                      whiteSpace: "nowrap",
                      padding: rem(8),
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
                            disabled={viewOnly}
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
              innerStyle={{ paddingTop: rem(12) }}
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
                    gap: rem(4),
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(8, auto)",
                    whiteSpace: "nowrap",
                    padding: rem(8),
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
                        disabled={viewOnly}
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
                    innerStyle={{ paddingTop: rem(8) }}
                  >
                    <SelectableRow
                      itemId={eligibleOutcomes}
                      removeItem={() => selectEligibleOutcome("None")}
                      viewOnly={viewOnly}
                    >
                      <div style={{ display: "flex", fontSize: rem(18) }}>
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
                    style={{ marginTop: rem(4) }}
                    innerStyle={{ paddingTop: rem(12) }}
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
                          padding: rem(8),
                          gap: rem(4),
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        {Array.from(outcomes).map((outcome) => {
                          return (
                            <button
                              key={outcome}
                              onClick={() => selectEligibleOutcome(outcome)}
                              disabled={viewOnly}
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
              {!canFactionVote(
                faction,
                agendas,
                state,
                currentTurn,
                leaders
              ) ? (
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
                      paddingLeft: rem(8),
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
                        <div className={styles.InfluenceSymbol}>
                          <InfluenceSVG influence={influence} />
                        </div>

                        <div style={{ fontSize: rem(16) }}>+ {extraVotes}</div>
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
                          gap: rem(12),
                          fontSize: rem(24),
                          paddingLeft: rem(12),
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
                          <div style={{ width: rem(12) }}></div>
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
                          style={{ width: rem(32) }}
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
                    innerStyle={{ paddingTop: rem(12) }}
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
                          gap: rem(4),
                          whiteSpace: "nowrap",
                          padding: rem(8),
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
                                  disabled={viewOnly}
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
                                  disabled={viewOnly}
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
                    innerStyle={{ paddingTop: rem(8) }}
                  >
                    <SelectableRow
                      itemId={tieBreak}
                      removeItem={() => selectSpeakerTieBreak(undefined)}
                      viewOnly={viewOnly}
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
                  <button onClick={completeAgenda} disabled={viewOnly}>
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

function SecondaryCheck({
  faction,
  gameId,
}: {
  faction: Faction;
  gameId: string;
}) {
  const secondaryState = faction.secondary ?? "PENDING";
  const viewOnly = useViewOnly();
  return (
    <div className="flexRow">
      {secondaryState === "PENDING" ? (
        <React.Fragment>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, faction.id, "DONE");
            }}
            disabled={viewOnly}
          >
            Mark Completed
          </button>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, faction.id, "SKIPPED");
            }}
            disabled={viewOnly}
          >
            Skip
          </button>
        </React.Fragment>
      ) : (
        <button
          onClick={() => {
            markSecondaryAsync(gameId, faction.id, "PENDING");
          }}
          disabled={viewOnly}
        >
          Not Done Yet
        </button>
      )}
    </div>
  );
}
