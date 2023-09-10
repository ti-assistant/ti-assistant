import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { AddPlanetList } from "../../../src/AddPlanetList";
import { AddTechList } from "../../../src/AddTechList";
import { AgendaRow } from "../../../src/AgendaRow";
import {
  FactionCard,
  FullFactionSymbol,
  StartingComponents,
} from "../../../src/FactionCard";
import { FactionSummary } from "../../../src/FactionSummary";
import { NonGameHeader } from "../../../src/Header";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";
import {
  BLACK_BORDER_GLOW,
  LabeledDiv,
  LabeledLine,
} from "../../../src/LabeledDiv";
import { LockedButtons } from "../../../src/LockedButton";
import { Modal } from "../../../src/Modal";
import { ObjectiveList } from "../../../src/ObjectiveList";
import { ObjectiveRow } from "../../../src/ObjectiveRow";
import { PlanetRow } from "../../../src/PlanetRow";
import { SelectableRow } from "../../../src/SelectableRow";
import { Selector } from "../../../src/Selector";
import { Tab, TabBody } from "../../../src/Tab";
import { TechRow } from "../../../src/TechRow";
import { StaticFactionTimer } from "../../../src/Timer";
import { Updater } from "../../../src/Updater";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  canFactionVote,
  computeRemainingVotes,
  getTargets,
} from "../../../src/VoteCount";
import { useGameData } from "../../../src/data/GameData";
import {
  AdditionalActions,
  FactionActionButtons,
  NextPlayerButtons,
  advanceToStatusPhase,
} from "../../../src/main/ActionPhase";
import { computeVotes, startNextRound } from "../../../src/main/AgendaPhase";
import {
  setupPhaseComplete,
  startFirstRound,
} from "../../../src/main/SetupPhase";
import {
  advanceToAgendaPhase,
  statusPhaseComplete,
} from "../../../src/main/StatusPhase";
import {
  StrategyCardSelectList,
  advanceToActionPhase,
} from "../../../src/main/StrategyPhase";
import {
  getActiveAgenda,
  getFactionVotes,
  getScoredObjectives,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../src/util/actionLog";
import {
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../../src/util/api/actionLog";
import { addTech, removeTech } from "../../../src/util/api/addTech";
import { Agenda, OutcomeType } from "../../../src/util/api/agendas";
import { castVotes } from "../../../src/util/api/castVotes";
import { claimPlanet, unclaimPlanet } from "../../../src/util/api/claimPlanet";
import { getSelectedAction, undo } from "../../../src/util/api/data";
import { getDefaultStrategyCards } from "../../../src/util/api/defaults";
import { Faction } from "../../../src/util/api/factions";
import { markSecondary } from "../../../src/util/api/markSecondary";
import { ObjectiveType } from "../../../src/util/api/objectives";
import { resolveAgenda } from "../../../src/util/api/resolveAgenda";
import { hideAgenda, revealAgenda } from "../../../src/util/api/revealAgenda";
import {
  hideObjective,
  revealObjective,
} from "../../../src/util/api/revealObjective";
import {
  scoreObjective,
  unscoreObjective,
} from "../../../src/util/api/scoreObjective";
import { selectEligibleOutcomes } from "../../../src/util/api/selectEligibleOutcomes";
import { speakerTieBreak } from "../../../src/util/api/speakerTieBreak";
import { Tech, TechType, hasTech } from "../../../src/util/api/techs";
import { setGameId } from "../../../src/util/api/util";
import { getFactionColor } from "../../../src/util/factions";
import { RevealObjectiveData } from "../../../src/util/model/revealObjective";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../../src/util/planets";
import {
  filterToOwnedTechs,
  filterToUnownedTechs,
} from "../../../src/util/techs";
import { responsivePixels } from "../../../src/util/util";

const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

function SecondaryCheck({
  faction,
  gameid,
}: {
  faction: Faction;
  gameid: string;
}) {
  const factionName = faction.name;
  const secondaryState = faction.secondary ?? "PENDING";
  return (
    <div className="flexRow">
      {secondaryState === "PENDING" ? (
        <React.Fragment>
          <button
            onClick={() => {
              markSecondary(gameid, factionName, "DONE");
            }}
          >
            Mark Completed
          </button>
          <button
            onClick={() => {
              markSecondary(gameid, factionName, "SKIPPED");
            }}
          >
            Skip
          </button>
        </React.Fragment>
      ) : (
        <button
          onClick={() => {
            markSecondary(gameid, factionName, "PENDING");
          }}
        >
          Not Done Yet
        </button>
      )}
    </div>
  );
}

function PhaseSection() {
  const router = useRouter();
  const {
    game: gameid,
    faction: factionName,
  }: { game?: string; faction?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "attachments",
    "factions",
    "planets",
    "objectives",
    "options",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas ?? {};
  const attachments = gameData.attachments ?? {};
  const factions = gameData.factions ?? {};
  const planets = gameData.planets ?? {};
  const objectives = gameData.objectives ?? {};
  const options = gameData.options;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();
  const voteRef = useRef<HTMLDivElement>(null);

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);
  let currentAgenda: Agenda | undefined;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = (agendas ?? {})[activeAgenda];
  }

  function addObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    revealObjective(gameid, objectiveName);
  }
  function removeObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    hideObjective(gameid, objectiveName);
  }
  function scoreObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    scoreObjective(gameid, factionName, objectiveName);
  }
  function unscoreObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    unscoreObjective(gameid, factionName, objectiveName);
  }
  function selectAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    revealAgenda(gameid, agendaName);
  }
  function hideAgendaLocal(agendaName: string) {
    if (!gameid) {
      return;
    }
    hideAgenda(gameid, agendaName);
  }
  function selectEligibleOutcome(outcome: OutcomeType | "None") {
    if (!gameid) {
      return;
    }
    selectEligibleOutcomes(gameid, outcome);
  }
  function selectSpeakerTieBreak(tieBreak: string | null) {
    if (!gameid) {
      return;
    }
    speakerTieBreak(gameid, tieBreak ?? "None");
  }
  if (!factionName) {
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
    objectives
  );
  const totalVotes = computeVotes(currentAgenda, currentTurn);
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
  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const { influence, extraVotes } = computeRemainingVotes(
    factionName,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(gameData.actionLog ?? [])
  );

  const faction = factions[factionName];
  if (!faction) {
    return null;
  }

  const label =
    // !!subState.miscount
    //   ? "Re-voting on Miscounted Agenda"
    //   :
    agendaNum === 1 ? "FIRST AGENDA" : "SECOND AGENDA";
  async function completeAgenda() {
    if (!gameid) {
      return;
    }
    const tieBreak = getSpeakerTieBreak(currentTurn);
    const target = tieBreak ? tieBreak : selectedTargets[0];
    if (!target || !currentAgenda) {
      return;
    }
    resolveAgenda(gameid, currentAgenda?.name, target);
  }
  function castVotesLocal(target: string | undefined, votes: number) {
    if (!gameid || !factionName) {
      return;
    }
    if (target === "Abstain") {
      castVotes(gameid, factionName, 0, "Abstain");
    } else {
      castVotes(gameid, factionName, votes, target);
    }
  }
  const factionVotes = getFactionVotes(currentTurn, factionName);
  function saveCastVotes(element: HTMLDivElement) {
    if (element.innerText !== "") {
      const numerical = parseInt(element.innerText);
      if (!isNaN(numerical)) {
        castVotesLocal(factionVotes?.target, numerical);
        element.innerText = numerical.toString();
      }
    }
    element.innerText = factionVotes?.votes?.toString() ?? "0";
  }

  let leftLabel: string | undefined;
  let centerLabel: string | undefined;
  let phaseContent = null;
  switch (state?.phase) {
    case "SETUP": {
      const revealedObjectiveNames = currentTurn
        .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
        .map(
          (logEntry) => (logEntry.data as RevealObjectiveData).event.objective
        );
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return (
            objective.type === "STAGE ONE" &&
            !revealedObjectiveNames.includes(objective.name)
          );
        }
      );
      centerLabel = undefined;
      phaseContent = (
        <React.Fragment>
          <LabeledDiv label="Starting Components">
            <div style={{ fontSize: "16px", whiteSpace: "nowrap" }}>
              <StartingComponents faction={faction} />
            </div>
          </LabeledDiv>
          <LabeledDiv label="Speaker Actions">
            {revealedObjectiveNames.length > 0 ? (
              <LabeledDiv label="REVEALED OBJECTIVES">
                {revealedObjectiveNames.map((objectiveName) => {
                  const objectiveObj = objectives[objectiveName];
                  if (!objectiveObj) {
                    return null;
                  }
                  return (
                    <ObjectiveRow
                      key={objectiveName}
                      objective={objectiveObj}
                      removeObjective={() => removeObj(objectiveName)}
                      viewing={true}
                    />
                  );
                })}
              </LabeledDiv>
            ) : null}
            {revealedObjectiveNames.length < 2 ? (
              <ClientOnlyHoverMenu label="Reveal Objective">
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
                          key={objective.name}
                          style={{ writingMode: "horizontal-tb" }}
                          onClick={() => addObj(objective.name)}
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
          lastAction.data.event.pickedBy === factionName
        );
      }
      if (factionName === state.activeplayer) {
        centerLabel = "SELECT STRATEGY CARD";
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
        centerLabel = "STRATEGY PHASE";
        phaseContent = (
          <button
            onClick={() => {
              if (!gameid) {
                return;
              }
              undo(gameid);
            }}
          >
            Undo SC Pick
          </button>
        );
      }
      break;
    case "ACTION":
      const selectedAction = getSelectedAction(gameData);
      if (factionName === state.activeplayer) {
        centerLabel = "SELECT ACTION";
        phaseContent = (
          <React.Fragment>
            <FactionActionButtons factionName={factionName} />
            <div
              className="flexColumn"
              style={{ width: "95%", alignItems: "flex-start" }}
            >
              <AdditionalActions
                factionName={factionName}
                style={{ width: "100%", alignItems: "flex-start" }}
                primaryOnly={true}
              />
            </div>
            {selectedAction ? (
              <div className="flexRow" style={{ width: "100%" }}>
                <NextPlayerButtons
                  factionName={factionName}
                  buttonStyle={{ fontSize: "20px" }}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      } else {
        switch (selectedAction) {
          case "Leadership":
            leftLabel = "Leadership Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Diplomacy":
            leftLabel = "Diplomacy Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Politics":
            leftLabel = "Politics Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Construction":
            leftLabel = "Construction Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Trade":
            leftLabel = "Trade Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Warfare":
            leftLabel = "Warfare Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
            );
            break;
          case "Technology":
            if (factionName === "Nekro Virus") {
              leftLabel = "Technology Secondary";
              phaseContent = (
                <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
              );
            } else {
              phaseContent = (
                <AdditionalActions
                  factionName={factionName}
                  style={{ width: "100%" }}
                  secondaryOnly={true}
                />
              );
            }
            break;
          case "Imperial":
            leftLabel = "Imperial Secondary";
            phaseContent = (
              <SecondaryCheck faction={faction} gameid={gameid ?? ""} />
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
            !(objective.scorers ?? []).includes(factionName)
          );
        }
      );
      const canScoreObjectives = Object.values(planets ?? {}).reduce(
        (canScore, planet) => {
          if (faction.name === "Clan of Saar") {
            return true;
          }
          let planetFaction = faction.name;
          if (faction.name === "Council Keleres") {
            planetFaction = faction.startswith.faction ?? planetFaction;
          }
          if (
            planet.home &&
            planet.faction === planetFaction &&
            planet.owner !== faction.name
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
          !(objective.scorers ?? []).includes(factionName) &&
          objective.phase === "STATUS"
        );
      });
      const scoredObjectives = getScoredObjectives(currentTurn, factionName);
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
      const revealedObjectiveObj = objectives[revealedObjective ?? ""];
      centerLabel = "SCORE OBJECTIVES";
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
                  itemName={scoredPublics[0]}
                  removeItem={unscoreObj}
                >
                  {scoredPublics[0]}
                </SelectableRow>
              </LabeledDiv>
            ) : !canScoreObjectives ? (
              "Cannot score public objectives"
            ) : (
              <ClientOnlyHoverMenu label="Score Public Objective">
                <div
                  className="flexColumn"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "8px",
                    gap: "4px",
                    alignItems: "stretch",
                  }}
                >
                  {availableObjectives.length === 0
                    ? "No unscored public objectives"
                    : null}
                  {availableObjectives.map((objective) => {
                    return (
                      <button
                        key={objective.name}
                        onClick={() => scoreObj(objective.name)}
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
                  itemName={scoredSecrets[0]}
                  removeItem={unscoreObj}
                >
                  {scoredSecrets[0]}
                </SelectableRow>
              </LabeledDiv>
            ) : (
              <ClientOnlyHoverMenu label="Score Secret Objective">
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
                        key={objective.name}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() => scoreObj(objective.name)}
                      >
                        {objective.name}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            )}
          </div>
          <LabeledDiv label="Speaker Actions">
            {revealedObjectiveObj ? (
              <LabeledDiv label="REVEALED OBJECTIVE">
                <ObjectiveRow
                  objective={revealedObjectiveObj}
                  removeObjective={() => removeObj(revealedObjectiveObj.name)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                <ClientOnlyHoverMenu
                  label={`Reveal one Stage ${
                    state.round > 3 ? "II" : "I"
                  } objective`}
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
                            key={objective.name}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() => addObj(objective.name)}
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
      centerLabel = "AGENDA PHASE";
      phaseContent = (
        <React.Fragment>
          {!currentAgenda ? (
            <LabeledDiv
              label="Speaker Actions"
              style={{ marginTop: "4px", paddingTop: "12px" }}
            >
              <ClientOnlyHoverMenu label="Reveal and Read one Agenda">
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
                        key={agenda.name}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() => selectAgenda(agenda.name)}
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
                      hideAgendaLocal(currentAgenda.name);
                    }}
                  />
                </LabeledDiv>
              </div>
              {currentAgenda.name === "Covert Legislation" ? (
                eligibleOutcomes ? (
                  <LabeledDiv
                    label="ELIGIBLE OUTCOMES"
                    style={{ paddingTop: "8px" }}
                  >
                    <SelectableRow
                      itemName={eligibleOutcomes}
                      removeItem={() => selectEligibleOutcome("None")}
                    >
                      <div style={{ display: "flex", fontSize: "18px" }}>
                        {eligibleOutcomes}
                      </div>
                    </SelectableRow>
                  </LabeledDiv>
                ) : (
                  <LabeledDiv
                    label="Speaker Actions"
                    style={{ marginTop: "4px", paddingTop: "12px" }}
                  >
                    <ClientOnlyHoverMenu label="Reveal Eligible Outcomes">
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
              {!canFactionVote(
                factionName,
                agendas,
                state,
                factions,
                currentTurn
              ) ? (
                <div className="flexRow">Cannot Vote</div>
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
                      hoverMenuLabel="Select Vote Outcome"
                      selectedLabel="Selected Outcome"
                      options={targets}
                      selectedItem={factionVotes?.target}
                      toggleItem={(itemName, add) => {
                        if (add) {
                          castVotesLocal(itemName, 0);
                        } else {
                          castVotesLocal(undefined, 0);
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
                      <div className="votingBlock">
                        <div className="influenceSymbol">&#x2B21;</div>
                        <div className="influenceTextWrapper">{influence}</div>
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
                                (factionVotes?.votes ?? 0) - 1
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
                                (factionVotes?.votes ?? 0) + 1
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
                    label="Speaker Actions"
                    style={{ paddingTop: "12px" }}
                  >
                    <ClientOnlyHoverMenu label="Choose outcome (vote tied)">
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
                              if (target === "Abstain") {
                                return null;
                              }
                              return (
                                <button
                                  key={target}
                                  style={{ writingMode: "horizontal-tb" }}
                                  onClick={() => selectSpeakerTieBreak(target)}
                                >
                                  {target}
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
                      itemName={tieBreak}
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

function FactionContent() {
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState<string>("");
  const router = useRouter();
  const {
    game: gameid,
    faction: playerFaction,
  }: { game?: string; faction?: string } = router.query;
  const gameData = useGameData(gameid, [
    "attachments",
    "factions",
    "objectives",
    "planets",
    "techs",
  ]);
  const attachments = gameData.attachments ?? {};
  const factions = gameData.factions ?? {};
  const objectives = gameData.objectives ?? {};
  const planets = gameData.planets ?? {};
  const techs = gameData.techs ?? {};

  if (!factions || !playerFaction) {
    return null;
  }
  const faction = factions[playerFaction];

  if (!faction) {
    router.push(`/game/${gameid}`);
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

  function removePlanet(toRemove: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    unclaimPlanet(gameid, playerFaction, toRemove);
  }

  function addPlanet(toAdd: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    claimPlanet(gameid, playerFaction, toAdd);
  }

  function removeTechLocal(toRemove: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    removeTech(gameid, playerFaction, toRemove);
  }

  function addTechLocal(toAdd: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    addTech(gameid, playerFaction, toAdd);
  }

  const techsObj: Record<string, Tech> = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (tech.faction) {
      if (playerFaction === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (
        playerFaction !== "Nekro Virus" &&
        tech.faction !== playerFaction
      ) {
        return;
      }
    }
    techsObj[tech.name] = tech;
  });
  if (playerFaction !== "Nekro Virus") {
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

  const claimedPlanets = filterToClaimedPlanets(planets, playerFaction);
  const updatedPlanets = applyAllPlanetAttachments(claimedPlanets, attachments);

  let VPs = 0;
  for (const objective of Object.values(objectives ?? {})) {
    if ((objective.scorers ?? []).includes(playerFaction)) {
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
        title="Research Tech"
      >
        <AddTechList techs={remainingTechs} addTech={addTechLocal} />
      </Modal>
      <Modal
        closeMenu={toggleAddPlanetMenu}
        visible={showAddPlanet}
        title="Add Planet"
      >
        <AddPlanetList planets={planets} addPlanet={addPlanet} />
      </Modal>
      <FactionSummary
        factionName={playerFaction}
        options={{ showIcon: true }}
      />
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
            <PhaseSection />
            <LabeledLine label="FACTION DETAILS" />
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
                  Techs
                </Tab>
                <Tab
                  selectTab={toggleTabShown}
                  id="planets"
                  selectedId={tabShown}
                >
                  Planets
                </Tab>
                <Tab
                  selectTab={toggleTabShown}
                  id="objectives"
                  selectedId={tabShown}
                >
                  Objectives
                </Tab>
              </div>
              <TabBody id="techs" selectedId={tabShown}>
                <div>
                  <LabeledLine />
                  <div className="flexRow" style={{ height: "32px" }}>
                    <button onClick={toggleAddTechMenu}>Research Tech</button>
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
                          key={tech.name}
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
                    <button onClick={toggleAddPlanetMenu}>Add Planet</button>
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
                          key={planet.name}
                          factionName={playerFaction}
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
                  <ObjectiveList />
                </React.Fragment>
              </TabBody>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  const router = useRouter();
  const {
    game: gameid,
    faction: playerFaction,
  }: { game?: string; faction?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "factions",
    "state",
    "strategycards",
  ]);
  const factions = gameData.factions;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

  if (!factions || !playerFaction) {
    return <div>Loading...</div>;
  }

  const faction = factions[playerFaction];

  if (!faction) {
    router.push(`/game/${gameid}`);
    return;
  }

  function swapToFaction(factionName: string) {
    router.push(`/game/${gameid}/${factionName}`);
    return;
  }

  let orderedFactions: Faction[] = [];
  let orderTitle = "";
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderTitle = "Speaker Order";
      orderedFactions = Object.values(factions).sort(
        (a, b) => a.order - b.order
      );
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = "Initiative Order";
      const orderedCards = Object.values(strategyCards).sort(
        (a, b) => a.order - b.order
      );
      const orderedNames: string[] = [];
      for (const card of orderedCards) {
        if (card.faction && !orderedNames.includes(card.faction)) {
          orderedNames.push(card.faction);
        }
      }

      for (const factionName of orderedNames) {
        const faction = factions[factionName];
        if (!faction) {
          continue;
        }
        orderedFactions.push(faction);
      }
      break;
    case "AGENDA":
      orderTitle = "Voting Order";
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
                  text: "Start Game",
                  onClick: () => {
                    if (!gameid) {
                      return;
                    }
                    startFirstRound(gameid);
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
                  if (!gameid) {
                    return;
                  }
                  advanceToActionPhase(gameid);
                }}
              >
                Advance to Action Phase
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
                  text: "Advance to Status Phase",
                  onClick: () => {
                    if (!gameid) {
                      return;
                    }
                    advanceToStatusPhase(gameid);
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
            text: "Start Next Round",
            onClick: () => {
              if (!gameid) {
                return;
              }
              startNextRound(gameid);
            },
          });
        }
        buttons.push({
          text: "Advance to Agenda Phase",
          onClick: () => {
            if (!gameid) {
              return;
            }
            advanceToAgendaPhase(gameid);
          },
        });
        return (
          <div className="flexColumn" style={{ marginTop: "8px" }}>
            <LockedButtons
              unlocked={statusPhaseComplete(
                getCurrentTurnLogEntries(gameData.actionLog ?? [])
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
                  text: "Start Next Round",
                  onClick: () => {
                    if (!gameid) {
                      return;
                    }
                    startNextRound(gameid);
                  },
                },
              ]}
            />
          </div>
        );
    }
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100svh",
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <NonGameHeader />
        <Updater />
        <div
          className="flexColumn"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "800px",
            marginTop: responsivePixels(54),
          }}
        >
          <div
            className="flexColumn"
            style={{
              width: "100%",
              gap: "4px",
              fontSize: "18px",
            }}
          >
            <LabeledLine
              leftLabel={state?.phase + " PHASE"}
              rightLabel={"ROUND " + state?.round}
            />
            {orderTitle}
            <div
              className="flexRow"
              style={{ width: "100%", alignItems: "space-evenly", gap: 0 }}
            >
              {orderedFactions.map((faction) => {
                const color = faction.passed
                  ? "#555"
                  : getFactionColor(faction);
                return (
                  <div
                    className="flexRow"
                    key={faction.name}
                    style={{
                      position: "relative",
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: `3px solid ${color}`,
                      boxShadow:
                        color === "Black" ? BLACK_BORDER_GLOW : undefined,
                    }}
                    onClick={() => swapToFaction(faction.name)}
                  >
                    <div
                      className="flexRow"
                      style={{
                        position: "relative",
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "28px",
                          height: "28px",
                        }}
                      >
                        <FullFactionSymbol faction={faction.name} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <NextPhaseButtons />
          </div>
          <div style={{ width: "100%", margin: "4px" }}>
            <FactionCard
              faction={faction}
              style={{ width: "100%" }}
              rightLabel={
                <StaticFactionTimer
                  factionName={playerFaction}
                  width={80}
                  style={{
                    fontSize: responsivePixels(16),
                  }}
                />
              }
              opts={{ hideTitle: true }}
            >
              <FactionContent />
            </FactionCard>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
