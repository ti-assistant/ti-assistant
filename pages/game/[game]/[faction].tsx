import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher, setGameId } from "../../../src/util/api/util";
import { responsivePixels } from "../../../src/util/util";
import {
  hasTech,
  lockTech,
  Tech,
  unlockTech,
} from "../../../src/util/api/techs";
import {
  claimPlanet,
  Planet,
  unclaimPlanet,
} from "../../../src/util/api/planets";
import { FactionCard, StartingComponents } from "../../../src/FactionCard";
import { BasicFactionTile } from "../../../src/FactionTile";
import { FactionSummary } from "../../../src/FactionSummary";
import { StaticFactionTimer } from "../../../src/Timer";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../../src/util/planets";
import {
  filterToOwnedTechs,
  filterToUnownedTechs,
} from "../../../src/util/techs";
import { Updater } from "../../../src/Updater";
import { LabeledDiv, LabeledLine } from "../../../src/LabeledDiv";
import { StrategyCardElement } from "../../../src/StrategyCard";
import { assignStrategyCard, StrategyCard } from "../../../src/util/api/cards";
import {
  GameState,
  nextPlayer,
  setAgendaNum,
} from "../../../src/util/api/state";
import {
  AdditionalActions,
  advanceToStatusPhase,
  FactionActionButtons,
  NextPlayerButtons,
} from "../../../src/main/ActionPhase";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";
import {
  castSubStateVotes,
  hideSubStateAgenda,
  hideSubStateObjective,
  revealSubStateAgenda,
  revealSubStateObjective,
  scoreSubStateObjective,
  setSubStateOther,
  SubState,
  unscoreSubStateObjective,
} from "../../../src/util/api/subState";
import { SelectableRow } from "../../../src/SelectableRow";
import { ObjectiveRow } from "../../../src/ObjectiveRow";
import {
  Objective,
  scoreObjective,
  unscoreObjective,
} from "../../../src/util/api/objectives";
import { AgendaRow } from "../../../src/AgendaRow";
import { canFactionVote, getTargets } from "../../../src/VoteCount";
import { computeVotes } from "../../../src/main/AgendaPhase";
import {
  Agenda,
  OutcomeType,
  repealAgenda,
  resolveAgenda,
} from "../../../src/util/api/agendas";
import { Faction, updateCastVotes } from "../../../src/util/api/factions";
import { advanceToActionPhase } from "../../../src/main/StrategyPhase";
import {
  setupPhaseComplete,
  startFirstRound,
} from "../../../src/main/SetupPhase";
import {
  advanceToAgendaPhase,
  statusPhaseComplete,
} from "../../../src/main/StatusPhase";
import { startNextRound } from "../../../src/main/AgendaPhase";
import Head from "next/head";
import { Attachment } from "../../../src/util/api/attachments";
import { Modal } from "../../../src/Modal";
import { AddTechList } from "../../../src/AddTechList";
import { AddPlanetList } from "../../../src/AddPlanetList";
import { Tab, TabBody } from "../../../src/Tab";
import { TechRow } from "../../../src/TechRow";
import { PlanetRow } from "../../../src/PlanetRow";
import { ObjectiveList } from "../../../src/ObjectiveList";
import { getDefaultStrategyCards } from "../../../src/util/api/defaults";

const techOrder = ["green", "blue", "yellow", "red", "upgrade"];

function PhaseSection() {
  const router = useRouter();
  const {
    game: gameid,
    faction: factionName,
  }: { game?: string; faction?: string } = router.query;
  const { data: agendas = {} }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: attachments = {} }: { data?: Record<string, Attachment> } =
    useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: factions = {} }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: planets = {} }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher
  );
  const { data: objectives = {} }: { data?: Record<string, Objective> } =
    useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );

  function assignCard(cardName: string) {
    if (!gameid || !factionName) {
      return;
    }
    assignStrategyCard(gameid, cardName, factionName);
    nextPlayer(gameid, factions, strategyCards, subState);
  }
  function addObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    revealSubStateObjective(gameid, objectiveName);
  }
  function removeObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    hideSubStateObjective(gameid, objectiveName);
  }
  function scoreObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    scoreObjective(gameid, factionName, objectiveName);
    scoreSubStateObjective(gameid, factionName, objectiveName);
  }
  function unscoreObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    unscoreObjective(gameid, factionName, objectiveName);
    unscoreSubStateObjective(gameid, factionName, objectiveName);
  }
  function selectAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    revealSubStateAgenda(gameid, agendaName);
  }
  function hideAgenda() {
    if (!gameid) {
      return;
    }
    hideSubStateAgenda(gameid);
  }
  function selectEligibleOutcome(outcome: OutcomeType | null) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "outcome", outcome);
  }
  function selectSpeakerTieBreak(tieBreak: string | null) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "tieBreak", tieBreak);
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
  let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  if (agendaNum > 2) {
    return null;
  }
  if (subState.agenda) {
    currentAgenda = agendas[subState.agenda];
  }
  const factionSubState = (subState.factions ?? {})[factionName];

  const localAgenda = structuredClone(currentAgenda);
  if (localAgenda && subState.outcome) {
    localAgenda.elect = subState.outcome as OutcomeType;
  }
  const targets = getTargets(
    localAgenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives
  );
  const totalVotes = computeVotes(currentAgenda, subState.factions);
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

  let influence = 0;
  for (const planet of updatedPlanets) {
    if (planet.ready) {
      influence += planet.influence;
    }
  }
  const faction = factions[factionName];
  if (!faction) {
    return null;
  }

  influence -= Math.min(faction.votes ?? 0, influence);
  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (hasTech(faction, "Predictive Intelligence")) {
    extraVotes += 3;
  }
  const label = !!subState.miscount
    ? "Re-voting on Miscounted Agenda"
    : agendaNum === 1
    ? "FIRST AGENDA"
    : "SECOND AGENDA";
  async function completeAgenda() {
    if (!gameid || !subState.agenda) {
      return;
    }
    const target = subState.tieBreak ? subState.tieBreak : selectedTargets[0];
    if (!target) {
      return;
    }
    let activeAgenda = subState.agenda;
    if (subState.subAgenda) {
      activeAgenda = subState.subAgenda;
      resolveAgenda(gameid, subState.agenda, subState.subAgenda);
    }
    resolveAgenda(gameid, activeAgenda, target);

    updateCastVotes(gameid, subState.factions);
    hideSubStateAgenda(gameid);
    if (activeAgenda === "Miscount Disclosed") {
      repealAgenda(gameid, agendas[target]);
      revealSubStateAgenda(gameid, target);
      setSubStateOther(gameid, "miscount", true);
    } else {
      const agendaNum = state?.agendaNum ?? 1;
      setAgendaNum(gameid, agendaNum + 1);
    }
  }
  function castVotes(target: string | undefined, votes: number) {
    if (!gameid || !factionName) {
      return;
    }
    if (!target || target === "Abstain") {
      castSubStateVotes(gameid, factionName, "Abstain", 0);
    } else {
      castSubStateVotes(gameid, factionName, target, votes);
    }
  }

  let phaseName = `${state?.phase} PHASE`;
  let phaseContent = null;
  switch (state?.phase) {
    case "SETUP": {
      const revealedObjectiveNames = subState.objectives ?? [];
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return (
            objective.type === "stage-one" &&
            !revealedObjectiveNames.includes(objective.name)
          );
        }
      );
      phaseName = "SETUP PHASE";
      phaseContent = (
        <React.Fragment>
          <LabeledDiv label="Speaker Actions">
            {(subState.objectives ?? []).length > 0 ? (
              <LabeledDiv label="REVEALED OBJECTIVES">
                {(subState.objectives ?? []).map((objectiveName) => {
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
            {(subState.objectives ?? []).length < 2 ? (
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
                      return objective.type === "stage-one";
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
          <LabeledDiv label="Starting Components">
            <div style={{ fontSize: "16px", whiteSpace: "nowrap" }}>
              <StartingComponents faction={faction} />
            </div>
          </LabeledDiv>
          {setupPhaseComplete(factions, subState) ? (
            <button
              onClick={() => {
                if (!gameid) {
                  return;
                }
                startFirstRound(gameid, subState, factions);
              }}
            >
              Start Game
            </button>
          ) : null}
        </React.Fragment>
      );
      break;
    }
    case "STRATEGY":
      if (factionName === state.activeplayer) {
        phaseName = "SELECT STRATEGY CARD";
        phaseContent = (
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", width: "100%", gap: "4px" }}
          >
            {Object.values(strategyCards)
              .filter((card) => !card.faction)
              .map((card) => {
                return (
                  <StrategyCardElement
                    key={card.name}
                    card={card}
                    active={true}
                    onClick={() => assignCard(card.name)}
                  />
                );
              })}
          </div>
        );
      }
      if (state.activeplayer === "None") {
        phaseName = "END OF STRATEGY PHASE";
        phaseContent = (
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", width: "100%", gap: "4px" }}
          >
            <div className="flexRow">
              <button
                onClick={() => {
                  if (!gameid) {
                    return;
                  }
                  advanceToActionPhase(gameid, strategyCards, subState);
                }}
              >
                Advance to Action Phase
              </button>
            </div>
          </div>
        );
      }
      break;
    case "ACTION":
      if (factionName === state.activeplayer) {
        phaseName = "ACTION PHASE";
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
                ClientOnlyHoverMenuStyle={{
                  overflowX: "auto",
                  maxWidth: "85vw",
                }}
                factionOnly={true}
              />
            </div>
            {subState.selectedAction ? (
              <div className="flexRow" style={{ width: "100%" }}>
                <NextPlayerButtons
                  factionName={factionName}
                  buttonStyle={{ fontSize: "20px" }}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      } else if (subState.selectedAction === "Technology") {
        phaseContent = (
          <AdditionalActions
            factionName={factionName}
            style={{ width: "100%" }}
            ClientOnlyHoverMenuStyle={{ overflowX: "auto", maxWidth: "85vw" }}
            factionOnly={true}
          />
        );
      }
      if (state.activeplayer === "None") {
        phaseName = "END OF ACTION PHASE";
        phaseContent = (
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", width: "100%", gap: "4px" }}
          >
            <div className="flexRow">
              <button
                onClick={() => {
                  if (!gameid) {
                    return;
                  }
                  advanceToStatusPhase(gameid);
                }}
              >
                Advance to Status Phase
              </button>
            </div>
          </div>
        );
      }
      break;
    case "STATUS": {
      const type = state.round < 4 ? "stage-one" : "stage-two";
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return (
            objective.selected &&
            (objective.type === "stage-one" ||
              objective.type === "stage-two") &&
            !(objective.scorers ?? []).includes(factionName)
          );
        }
      );
      const secrets = Object.values(objectives ?? {}).filter((objective) => {
        return (
          objective.type === "secret" &&
          !(objective.scorers ?? []).includes(factionName) &&
          objective.phase === "status"
        );
      });
      const scoredPublics = (
        ((subState.factions ?? {})[factionName] ?? {}).objectives ?? []
      ).filter((objective) => {
        return (
          (objectives[objective] ?? {}).type === "stage-one" ||
          (objectives[objective] ?? {}).type === "stage-two"
        );
      });
      const scoredSecrets = (
        ((subState.factions ?? {})[factionName] ?? {}).objectives ?? []
      ).filter((objective) => {
        return (objectives[objective] ?? {}).type === "secret";
      });
      const revealableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return objective.type === type && !objective.selected;
        }
      );
      const subStateObjective = (subState.objectives ?? [])[0];
      const subStateObjectiveObj = objectives[subStateObjective ?? ""];
      phaseName = "STATUS PHASE";
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
            {subStateObjectiveObj ? (
              <LabeledDiv label="REVEALED OBJECTIVE">
                <ObjectiveRow
                  objective={subStateObjectiveObj}
                  removeObjective={() => removeObj(subStateObjectiveObj.name)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                {(subState.objectives ?? []).map((objective) => {
                  const objectiveObj = objectives[objective];
                  if (!objectiveObj) {
                    return null;
                  }
                  return (
                    <ObjectiveRow
                      key={objective}
                      objective={objectiveObj}
                      removeObjective={() => removeObj(objective)}
                      viewing={true}
                    />
                  );
                })}
                {(subState.objectives ?? []).length < 1 ? (
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
                            (state.round > 3 ? "stage-two" : "stage-one")
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
                ) : null}
              </div>
            )}
          </LabeledDiv>
          {statusPhaseComplete(subState) ? (
            <React.Fragment>
              {!state.agendaUnlocked ? (
                <button
                  onClick={() => {
                    if (!gameid) {
                      return;
                    }
                    startNextRound(gameid, subState);
                  }}
                >
                  Start Next Round
                </button>
              ) : null}
              <button
                onClick={() => {
                  if (!gameid) {
                    return;
                  }
                  advanceToAgendaPhase(gameid, subState);
                }}
              >
                Advance to Agenda Phase
              </button>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      );
      break;
    }
    case "AGENDA": {
      const items = Math.min((targets ?? []).length, 12);
      phaseName = "AGENDA PHASE";
      phaseContent = (
        <React.Fragment>
          {!currentAgenda ? (
            <LabeledDiv
              label="Speaker Actions"
              style={{ marginTop: "4px", paddingTop: "12 px" }}
            >
              <ClientOnlyHoverMenu label="Reveal and Read one Agenda">
                <div
                  className="flexRow"
                  style={{
                    maxWidth: "85vw",
                    gap: "4px",
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(10, auto)",
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
                  <AgendaRow agenda={currentAgenda} removeAgenda={hideAgenda} />
                </LabeledDiv>
              </div>
              {currentAgenda.name === "Covert Legislation" ? (
                subState.outcome ? (
                  <LabeledDiv
                    label="ELIGIBLE OUTCOMES"
                    style={{ paddingTop: "8px" }}
                  >
                    <SelectableRow
                      itemName={subState.outcome}
                      removeItem={() => selectEligibleOutcome(null)}
                    >
                      <div style={{ display: "flex", fontSize: "18px" }}>
                        {subState.outcome}
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
                subState,
                factions
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
                    Outcome:
                    <ClientOnlyHoverMenu
                      label={
                        factionSubState?.target
                          ? factionSubState?.target
                          : "Select Vote Outcome"
                      }
                      buttonStyle={{ paddingLeft: "8px" }}
                    >
                      <div
                        className="flexRow"
                        style={{
                          maxWidth: "80vw",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          padding: "8px",
                          display: "grid",
                          gridAutoFlow: "column",
                          gridTemplateRows: `repeat(${items}, auto)`,
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                          overflowX: "auto",
                        }}
                      >
                        {targets.map((target) => {
                          return (
                            <button
                              key={target}
                              style={{ writingMode: "horizontal-tb" }}
                              onClick={() => {
                                castVotes(target, 0);
                              }}
                            >
                              {target}
                            </button>
                          );
                        })}
                      </div>
                    </ClientOnlyHoverMenu>
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
                        {factionSubState?.votes ?? 0 > 0 ? (
                          <div
                            className="arrowDown"
                            onClick={() =>
                              castVotes(
                                factionSubState?.target,
                                factionSubState?.votes ?? 0 - 1
                              )
                            }
                          ></div>
                        ) : (
                          <div style={{ width: "12px" }}></div>
                        )}
                        <div className="flexRow" style={{ width: "32px" }}>
                          {factionSubState?.votes ?? 0}
                        </div>
                        {factionSubState?.target &&
                        factionSubState?.target !== "Abstain" ? (
                          <div
                            className="arrowUp"
                            onClick={() =>
                              castVotes(
                                factionSubState.target,
                                factionSubState?.votes ?? 0 + 1
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
                !subState.tieBreak ? (
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
                                  className={
                                    subState.tieBreak === target
                                      ? "selected"
                                      : ""
                                  }
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
                                  className={
                                    subState.tieBreak === target
                                      ? "selected"
                                      : ""
                                  }
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
                      itemName={subState.tieBreak}
                      removeItem={() => selectSpeakerTieBreak(null)}
                    >
                      {subState.tieBreak}
                    </SelectableRow>
                  </LabeledDiv>
                )
              ) : null}
              {selectedTargets.length === 1 || subState.tieBreak ? (
                <div
                  className="flexRow"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <button onClick={completeAgenda}>
                    Resolve with target:{" "}
                    {selectedTargets.length === 1
                      ? selectedTargets[0]
                      : subState.tieBreak}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            onClick={() => {
              if (!gameid) {
                return;
              }
              startNextRound(gameid, subState);
            }}
          >
            Start Next Round
          </button>
        </React.Fragment>
      );
      break;
    }
  }
  if (!phaseContent) {
    return null;
  }
  return (
    <div className="flexColumn largeFont">
      <LabeledLine label={phaseName} />
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
  const { data: factions = {} }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: attachments = {} }: { data?: Record<string, Attachment> } =
    useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives = {} }: { data?: Record<string, Objective> } =
    useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: planets = {} }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher
  );
  const { data: techs = {} }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
    fetcher
  );

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
    unclaimPlanet(gameid, toRemove, playerFaction);
  }

  function addPlanet(toAdd: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    claimPlanet(gameid, toAdd, playerFaction);
  }

  function removeTech(toRemove: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    lockTech(gameid, playerFaction, toRemove);
  }

  function addTech(toAdd: string) {
    if (!gameid || !playerFaction) {
      return;
    }
    unlockTech(gameid, playerFaction, toAdd);
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
      if (tech.replaces) {
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

  const maxHeight = screen.height - 420;
  return (
    <div className="flexColumn" style={{ gap: "8px", width: "100%" }}>
      <Modal
        closeMenu={toggleAddTechMenu}
        visible={showAddTech}
        title="Research Tech"
      >
        <AddTechList techs={remainingTechs} addTech={addTech} />
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
                      maxHeight: `${maxHeight}px`,
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
                          removeTech={removeTech}
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
                      maxHeight: `${maxHeight}px`,
                      boxSizing: "border-box",
                      overflow: "auto",
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
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );

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
      for (const card of orderedCards) {
        if (card.faction) {
          const faction = factions[card.faction];
          if (!faction) {
            return;
          }
          orderedFactions.push(faction);
        }
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

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <Updater />
      <div className="flexColumn" style={{ width: "100%", maxWidth: "800px" }}>
        <h2
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "8px 0",
            fontWeight: "normal",
            cursor: "pointer",
          }}
          onClick={() => router.push(gameid ? `/game/${gameid}` : "/")}
        >
          Twilight Imperium Assistant
        </h2>
        <div
          className="flexColumn"
          style={{
            height: "60px",
            width: "100%",
            gap: "4px",
            fontSize: "18px",
            marginBottom: "8px",
          }}
        >
          {orderTitle}
          <div
            className="flexRow"
            style={{ width: "100%", alignItems: "space-evenly" }}
          >
            {orderedFactions.map((faction) => {
              return (
                <BasicFactionTile
                  key={faction.name}
                  faction={faction}
                  onClick={() => swapToFaction(faction.name)}
                  opts={{ hideName: true, iconSize: 28 }}
                />
              );
            })}
          </div>
        </div>
        <div style={{ width: "100%", margin: "4px" }}>
          <FactionCard
            faction={faction}
            style={{ width: "100%" }}
            rightLabel={
              <StaticFactionTimer
                factionName={playerFaction}
                style={{ fontSize: responsivePixels(16), width: "auto" }}
              />
            }
            opts={{ hideTitle: true }}
          >
            <FactionContent />
          </FactionCard>
        </div>
      </div>
    </div>
  );
}
