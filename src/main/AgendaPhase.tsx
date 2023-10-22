import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AgendaRow } from "../AgendaRow";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { InfoRow } from "../InfoRow";
import { LockedButtons } from "../LockedButton";
import { SelectableRow } from "../SelectableRow";
import { Selector } from "../Selector";
import { AgendaTimer } from "../Timer";
import { VoteCount, getTargets } from "../VoteCount";
import FactionCircle from "../components/FactionCircle/FactionCircle";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import {
  ActionLogContext,
  AgendaContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  RelicContext,
  StateContext,
  StrategyCardContext,
} from "../context/Context";
import {
  advancePhaseAsync,
  claimPlanetAsync,
  gainRelicAsync,
  hideAgendaAsync,
  hideObjectiveAsync,
  loseRelicAsync,
  playActionCardAsync,
  playPromissoryNoteAsync,
  playRiderAsync,
  resolveAgendaAsync,
  revealAgendaAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  selectEligibleOutcomesAsync,
  selectSubAgendaAsync,
  speakerTieBreakAsync,
  unclaimPlanetAsync,
  unplayActionCardAsync,
  unplayPromissoryNoteAsync,
  unplayRiderAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import styles from "./AgendaPhase.module.scss";
import {
  getActionCardTargets,
  getActiveAgenda,
  getAllVotes,
  getGainedRelic,
  getNewOwner,
  getObjectiveScorers,
  getPlayedRiders,
  getPromissoryTargets,
  getRevealedObjectives,
  getScoredObjectives,
  getSelectedEligibleOutcomes,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { hasScoredObjective } from "../util/api/util";
import { computeVPs, getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";

const RIDERS = [
  "Galactic Threat",
  "Leadership Rider",
  "Diplomacy Rider",
  "Politics Rider",
  "Construction Rider",
  "Trade Rider",
  "Warfare Rider",
  "Technology Rider",
  "Imperial Rider",
  "Sanction",
  "Keleres Rider",
];

export function computeVotes(
  agenda: Agenda | undefined,
  currentTurn: ActionLogEntry[]
) {
  const castVotes: { [key: string]: number } =
    agenda && agenda.elect === "For/Against" ? { For: 0, Against: 0 } : {};
  const voteEvents = getAllVotes(currentTurn);
  voteEvents.forEach((voteEvent) => {
    if (
      voteEvent.target &&
      voteEvent.target !== "Abstain" &&
      (voteEvent.votes ?? 0) > 0
    ) {
      if (!castVotes[voteEvent.target]) {
        castVotes[voteEvent.target] = 0;
      }
      castVotes[voteEvent.target] += voteEvent.votes ?? 0;
    }
  });
  const orderedVotes: {
    [key: string]: number;
  } = Object.keys(castVotes)
    .sort((a, b) => {
      if (a === "For") {
        return -1;
      }
      if (b === "For") {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 1;
    })
    .reduce((obj, key) => {
      const votes = castVotes[key];
      if (!votes) {
        return obj;
      }
      obj[key] = votes;
      return obj;
    }, {} as { [key: string]: number });
  return orderedVotes;
}

function startNextRound(gameid: string) {
  advancePhaseAsync(gameid, true);
}

function getSelectedOutcome(
  selectedTargets: string[],
  currentTurn: ActionLogEntry[]
) {
  if (selectedTargets.length === 1) {
    return selectedTargets[0];
  }
  return getSpeakerTieBreak(currentTurn);
}

function canScoreObjective(
  factionId: FactionId,
  objectiveId: ObjectiveId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  currentTurn: ActionLogEntry[]
) {
  const scored = getScoredObjectives(currentTurn, factionId);
  if (scored.includes(objectiveId)) {
    return true;
  }
  const objective = objectives[objectiveId];
  if (!objective) {
    return false;
  }
  if (objective.type === "SECRET" && (objective.scorers ?? []).length > 0) {
    return false;
  }
  if ((objective.scorers ?? []).includes(factionId)) {
    return false;
  }
  return true;
}

function AgendaDetails() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const relics = useContext(RelicContext);
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  function addRelic(relicId: RelicId, factionId: FactionId) {
    if (!gameid) {
      return;
    }
    gainRelicAsync(gameid, factionId, relicId);
  }
  function removeRelic(relicId: RelicId, factionId: FactionId) {
    if (!gameid) {
      return;
    }
    loseRelicAsync(gameid, factionId, relicId);
  }

  let agendaId = getActiveAgenda(currentTurn);
  if (agendaId === "Covert Legislation") {
    agendaId = getSelectedSubAgenda(currentTurn);
  }

  const agenda = agendaId ? (agendas ?? {})[agendaId] : undefined;

  const votes = computeVotes(agenda, currentTurn);
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });

  const selectedOutcome = getSelectedOutcome(selectedTargets, currentTurn);

  if (!selectedOutcome) {
    return null;
  }

  let driveSection = null;
  let driveTheDebate: FactionId | undefined;
  switch (agenda?.elect) {
    case "Player": {
      driveTheDebate = selectedOutcome as FactionId;
      break;
    }
    case "Cultural Planet":
    case "Hazardous Planet":
    case "Planet":
    case "Industrial Planet":
    case "Non-Home Planet Other Than Mecatol Rex": {
      const electedPlanet = (planets ?? {})[selectedOutcome as PlanetId];
      if (!electedPlanet || !electedPlanet.owner) {
        break;
      }
      driveTheDebate = electedPlanet.owner;
      break;
    }
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

  const driveObj = (objectives ?? {})["Drive the Debate"];
  if (driveTheDebate && driveObj) {
    let canScoreDrive = canScoreObjective(
      driveTheDebate,
      "Drive the Debate",
      objectives ?? {},
      currentTurn
    );
    if (canScoreDrive) {
      const scored = getScoredObjectives(currentTurn, driveTheDebate);
      const hasScoredDrive = scored.includes("Drive the Debate");
      driveSection = (
        <div
          className="flexRow"
          style={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: responsivePixels(12),
          }}
        >
          Drive the Debate:{" "}
          <FactionCircle
            blur
            borderColor={getFactionColor((factions ?? {})[driveTheDebate])}
            factionId={driveTheDebate}
            onClick={() => {
              if (!gameid || !driveTheDebate) {
                return;
              }
              if (hasScoredDrive) {
                undoObjective(driveTheDebate, "Drive the Debate");
              } else {
                addObjective(driveTheDebate, "Drive the Debate");
              }
            }}
            size={44}
            tag={
              <div
                className="flexRow largeFont"
                style={{
                  width: "100%",
                  height: "100%",
                  color: hasScoredDrive ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {hasScoredDrive ? (
                  <div
                    className="symbol"
                    style={{
                      fontSize: responsivePixels(18),
                      lineHeight: responsivePixels(18),
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
            tagBorderColor={hasScoredDrive ? "green" : "red"}
          />
        </div>
      );
    }
  }

  let agendaSelection = null;
  switch (agendaId) {
    case "Incentive Program": {
      const type = selectedOutcome === "For" ? "STAGE ONE" : "STAGE TWO";
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return objective.type === type && !objective.selected;
        }
      );
      agendaSelection = (
        <Selector
          hoverMenuLabel={`Reveal Stage ${
            type === "STAGE ONE" ? "I" : "II"
          } Objective`}
          options={availableObjectives.map((objective) => objective.id)}
          renderItem={(objectiveId) => {
            const objective = (objectives ?? {})[objectiveId];
            if (!objective || !gameid) {
              return null;
            }
            return (
              <LabeledDiv
                label={`Revealed Stage ${
                  type === "STAGE ONE" ? "I" : "II"
                } Objective`}
              >
                <ObjectiveRow
                  objective={objective}
                  removeObjective={() =>
                    hideObjectiveAsync(gameid, objectiveId)
                  }
                  hideScorers={true}
                />
              </LabeledDiv>
            );
          }}
          selectedItem={getRevealedObjectives(currentTurn)[0]}
          toggleItem={(objectiveId, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              revealObjectiveAsync(gameid, objectiveId);
            } else {
              hideObjectiveAsync(gameid, objectiveId);
            }
          }}
        />
      );
      break;
    }
    case "Colonial Redistribution": {
      const minVPs = Object.values(factions ?? {}).reduce((minVal, faction) => {
        return Math.min(
          minVal,
          computeVPs(factions ?? {}, faction.id, objectives ?? {})
        );
      }, Number.MAX_SAFE_INTEGER);
      const availableFactions = Object.values(factions ?? {})
        .filter((faction) => {
          return (
            computeVPs(factions ?? {}, faction.id, objectives ?? {}) === minVPs
          );
        })
        .map((faction) => faction.id);
      const selectedFaction = getNewOwner(currentTurn, selectedOutcome);
      agendaSelection = (
        <Selector
          hoverMenuLabel={`Give Planet to Faction`}
          options={availableFactions}
          selectedLabel="Faction Gaining Control of Planet"
          selectedItem={selectedFaction}
          toggleItem={(factionId, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              claimPlanetAsync(gameid, factionId, selectedOutcome as PlanetId);
            } else {
              unclaimPlanetAsync(
                gameid,
                factionId,
                selectedOutcome as PlanetId
              );
            }
          }}
        />
      );
      break;
    }
    case "Minister of Antiques": {
      const unownedRelics = Object.values(relics ?? {})
        .filter((relic) => !relic.owner)
        .map((relic) => relic.id);
      agendaSelection = (
        <Selector
          hoverMenuLabel="Gain Relic"
          options={unownedRelics}
          renderItem={(itemId) => {
            const relic = (relics ?? {})[itemId];
            if (!relic) {
              return null;
            }
            return (
              <LabeledDiv label="Gained Relic">
                <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
                  <SelectableRow
                    itemId={relic.id}
                    removeItem={() => {
                      removeRelic(relic.id, selectedOutcome as FactionId);
                    }}
                  >
                    <InfoRow
                      infoTitle={relic.name}
                      infoContent={relic.description}
                    >
                      {relic.name}
                    </InfoRow>
                  </SelectableRow>
                  {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
                </div>
              </LabeledDiv>
            );
          }}
          selectedItem={getGainedRelic(currentTurn)}
          toggleItem={(relicId, add) => {
            if (add) {
              addRelic(relicId, selectedOutcome as FactionId);
            } else {
              removeRelic(relicId, selectedOutcome as FactionId);
            }
          }}
        />
      );
      break;
    }
  }
  if (!agendaSelection && !driveSection) {
    return null;
  }

  return (
    <>
      {agendaSelection}
      {driveSection}
    </>
  );
}

function AgendaSteps() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = (agendas ?? {})[activeAgenda];
  }

  const votes = computeVotes(currentAgenda, currentTurn);
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });

  async function completeAgenda() {
    if (!gameid || !currentAgenda) {
      return;
    }
    const target = getSelectedOutcome(selectedTargets, currentTurn);
    if (!target) {
      return;
    }

    resolveAgendaAsync(gameid, currentAgenda.id, target);
  }

  function selectAgenda(agendaId: AgendaId) {
    if (!gameid) {
      return;
    }
    revealAgendaAsync(gameid, agendaId);
  }
  function hideAgendaLocal(agendaId?: AgendaId, veto?: boolean) {
    if (!gameid || !agendaId) {
      return;
    }
    hideAgendaAsync(gameid, agendaId, veto);
  }

  function selectSubAgendaLocal(agendaId: AgendaId | null) {
    if (!gameid) {
      return;
    }
    selectSubAgendaAsync(gameid, agendaId ?? "None");
  }
  function selectEligibleOutcome(outcome: OutcomeType | "None") {
    if (!gameid) {
      return;
    }
    selectEligibleOutcomesAsync(gameid, outcome);
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

  const electionHacked =
    getActionCardTargets(currentTurn, "Hack Election").length > 0;

  const votingOrder = Object.values(factions ?? {}).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === 1) {
      return 1;
    }
    if (b.order === 1) {
      return -1;
    }
    return electionHacked ? b.order - a.order : a.order - b.order;
  });

  const flexDirection = "flexColumn";
  const label =
    // !!subState.miscount
    //   ? "Re-voting on Miscounted Agenda"
    //   :
    agendaNum === 1 ? "First Agenda" : "Second Agenda";

  const localAgenda = currentAgenda
    ? structuredClone(currentAgenda)
    : undefined;
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (eligibleOutcomes && eligibleOutcomes !== "None" && localAgenda) {
    localAgenda.elect = eligibleOutcomes;
  }

  const allTargets = getTargets(
    localAgenda,
    factions ?? {},
    strategyCards,
    planets ?? {},
    agendas ?? {},
    objectives ?? {}
  );
  const numFactions = votingOrder.length;

  const checksAndBalances = (agendas ?? {})["Checks and Balances"];

  const committeeFormation = (agendas ?? {})["Committee Formation"];

  let items = (selectedTargets ?? []).length;
  if (items === 0) {
    items = allTargets.length;
  }
  if (items > 10) {
    items = 10;
  }

  const possibleSubAgendas = Object.values(agendas ?? {}).filter(
    (agenda) => agenda.elect === eligibleOutcomes
  );

  const selectedSubAgenda = getSelectedSubAgenda(currentTurn);
  const subAgenda = selectedSubAgenda
    ? (agendas ?? {})[selectedSubAgenda]
    : undefined;

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  const vetoText = !(factions ?? {})["Xxcha Kingdom"]
    ? "Veto"
    : "Veto or Quash or Political Favor";

  function haveVotesBeenCast() {
    const castVotesActions = currentTurn.filter(
      (logEntry) => logEntry.data.action === "CAST_VOTES"
    );
    return castVotesActions.length > 0;
  }

  function readyToResolve() {
    if (!currentAgenda || !getSelectedOutcome(selectedTargets, currentTurn)) {
      return false;
    }
    const localAgenda =
      currentAgenda.id === "Covert Legislation" ? subAgenda : currentAgenda;
    if (!localAgenda) {
      return false;
    }
    return true;
  }

  const riders = getPlayedRiders(currentTurn);
  const orderedRiders = riders.sort((a, b) => {
    if (a.rider > b.rider) {
      return 1;
    }
    return -1;
  });

  const remainingRiders = RIDERS.filter((rider) => {
    if (rider === "Keleres Rider" && factions && !factions["Council Keleres"]) {
      return false;
    }
    if (rider === "Galactic Threat" && factions && !factions["Nekro Virus"]) {
      return false;
    }
    const secrets = getPromissoryTargets(currentTurn, "Political Secret");
    if (rider === "Galactic Threat" && secrets.includes("Nekro Virus")) {
      return false;
    }
    if (
      rider === "Sanction" &&
      options &&
      !options.expansions.includes("CODEX ONE")
    ) {
      return false;
    }
    const playedRiders = getPlayedRiders(currentTurn);
    for (const playedRider of playedRiders) {
      if (playedRider.rider === rider) {
        return false;
      }
    }
    return true;
  });

  if (agendaNum > 2) {
    return null;
  }

  let ancientBurialSites = getActionCardTargets(
    currentTurn,
    "Ancient Burial Sites"
  )[0];
  if (ancientBurialSites === "None") {
    ancientBurialSites = undefined;
  }
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  const assassinatedRep = getActionCardTargets(
    currentTurn,
    "Assassinate Representative"
  )[0];
  return (
    <React.Fragment>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div
          className="flexRow"
          style={{ width: "100%", justifyContent: "space-evenly" }}
        >
          <AgendaTimer agendaNum={1} />
          <AgendaTimer agendaNum={2} />
        </div>
      </div>
      {agendaNum > 2 ? (
        <div
          style={{
            fontSize: responsivePixels(40),
            textAlign: "center",
            marginTop: responsivePixels(120),
            width: "100%",
          }}
        >
          Agenda Phase Complete
        </div>
      ) : (
        <div
          className="flexColumn"
          style={{
            margin: "0",
            padding: "0",
            fontSize: responsivePixels(18),
            alignItems: "stretch",
          }}
        >
          {(!currentAgenda && agendaNum === 1) || ancientBurialSites ? (
            <ClientOnlyHoverMenu
              label="Start of Agenda Phase Actions"
              style={{ width: "100%" }}
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                  padding: responsivePixels(8),
                  paddingTop: 0,
                }}
              >
                <Selector
                  hoverMenuLabel="Ancient Burial Sites"
                  selectedLabel="Cultural Planets Exhausted"
                  options={Object.values(factions ?? {}).map(
                    (faction) => faction.id
                  )}
                  toggleItem={(factionId, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      playActionCardAsync(
                        gameid,
                        "Ancient Burial Sites",
                        factionId
                      );
                    } else {
                      unplayActionCardAsync(
                        gameid,
                        "Ancient Burial Sites",
                        factionId
                      );
                    }
                  }}
                  selectedItem={ancientBurialSites}
                />
              </div>
            </ClientOnlyHoverMenu>
          ) : null}
          <div
            className="flexRow mediumFont"
            style={{ justifyContent: "flex-start", whiteSpace: "nowrap" }}
          >
            {!currentAgenda ? (
              <div className="flexRow" style={{ justifyContent: "flex-start" }}>
                <LabeledDiv
                  label={getFactionName(speaker)}
                  color={getFactionColor(speaker)}
                >
                  <ClientOnlyHoverMenu label="Reveal and Read one Agenda">
                    <div
                      className="flexRow"
                      style={{
                        padding: responsivePixels(8),
                        gap: responsivePixels(4),
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: "repeat(10, auto)",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                      }}
                    >
                      {orderedAgendas.map((agenda) => {
                        return (
                          <button
                            key={agenda.id}
                            className={agenda.resolved ? "faded" : ""}
                            style={{
                              fontSize: responsivePixels(14),
                              writingMode: "horizontal-tb",
                            }}
                            onClick={() => selectAgenda(agenda.id)}
                          >
                            {agenda.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                </LabeledDiv>
              </div>
            ) : (
              <LabeledDiv label={label}>
                <AgendaRow
                  agenda={currentAgenda}
                  removeAgenda={() => hideAgendaLocal(currentAgenda?.id)}
                />
                {currentAgenda.id === "Covert Legislation" ? (
                  <Selector
                    hoverMenuLabel="Reveal Eligible Outcomes"
                    selectedLabel="Eligible Outcomes"
                    options={Array.from(outcomes)}
                    selectedItem={eligibleOutcomes}
                    toggleItem={(outcome, add) => {
                      if (add) {
                        selectEligibleOutcome(outcome as OutcomeType);
                      } else {
                        selectEligibleOutcome("None");
                      }
                    }}
                  />
                ) : null}
                {orderedRiders.length > 0 ? (
                  <ClientOnlyHoverMenu label="Predictions">
                    <div
                      className="flexRow"
                      style={{
                        padding: responsivePixels(8),
                        display: "grid",
                        gridAutoFlow: "row",
                        gridTemplateColumns: "repeat(3, auto)",
                        flexWrap: "wrap",
                      }}
                    >
                      {orderedRiders.map((rider) => {
                        const faction = rider.faction
                          ? (factions ?? {})[rider.faction]
                          : undefined;
                        let possibleFactions = Object.values(factions ?? {})
                          .filter((faction) => {
                            const secrets = getPromissoryTargets(
                              currentTurn,
                              "Political Secret"
                            );
                            return !secrets.includes(faction.id);
                          })
                          .map((faction) => faction.id);
                        if (rider.rider === "Galactic Threat") {
                          possibleFactions = ["Nekro Virus"];
                        }
                        if (rider.rider === "Keleres Rider") {
                          possibleFactions.filter(
                            (faction) => faction !== "Council Keleres"
                          );
                        }
                        return (
                          <SelectableRow
                            key={rider.rider}
                            itemId={rider.rider}
                            removeItem={() => {
                              if (!gameid) {
                                return;
                              }
                              unplayRiderAsync(gameid, rider.rider);
                            }}
                          >
                            <LabeledDiv
                              noBlur={true}
                              label={rider.rider}
                              color={getFactionColor(faction)}
                            >
                              <div className="flexRow">
                                <FactionSelectRadialMenu
                                  selectedFaction={
                                    rider.faction as FactionId | undefined
                                  }
                                  factions={possibleFactions}
                                  onSelect={(factionId) => {
                                    if (!gameid) {
                                      return;
                                    }
                                    playRiderAsync(
                                      gameid,
                                      rider.rider,
                                      factionId,
                                      rider.outcome
                                    );
                                  }}
                                  borderColor={getFactionColor(
                                    rider.faction
                                      ? factions[rider.faction]
                                      : undefined
                                  )}
                                />
                                <Selector
                                  hoverMenuLabel="Outcome"
                                  selectedItem={rider.outcome}
                                  options={allTargets.filter(
                                    (target) => target !== "Abstain"
                                  )}
                                  toggleItem={(itemId, add) => {
                                    if (!gameid) {
                                      return;
                                    }
                                    if (add) {
                                      playRiderAsync(
                                        gameid,
                                        rider.rider,
                                        rider.faction,
                                        itemId as OutcomeType
                                      );
                                    } else {
                                      playRiderAsync(
                                        gameid,
                                        rider.rider,
                                        rider.faction,
                                        undefined
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </LabeledDiv>
                          </SelectableRow>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </LabeledDiv>
            )}
          </div>
          {currentAgenda &&
          !haveVotesBeenCast() &&
          !getSelectedOutcome(selectedTargets, currentTurn) ? (
            <>
              <div className="flexRow"></div>
              <ClientOnlyHoverMenu label="When an Agenda is Revealed">
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    paddingTop: 0,
                    alignItems: "flex-start",
                  }}
                >
                  <button
                    onClick={() => hideAgendaLocal(currentAgenda?.id, true)}
                  >
                    {vetoText}
                  </button>
                  <LabeledDiv label="Political Secret">
                    <div className="flexRow" style={{ width: "100%" }}>
                      {votingOrder.map((faction) => {
                        const politicalSecret = politicalSecrets.includes(
                          faction.id
                        );
                        return (
                          <div
                            key={faction.id}
                            className="flexRow hiddenButtonParent"
                            style={{
                              position: "relative",
                              width: responsivePixels(32),
                              height: responsivePixels(32),
                            }}
                          >
                            <FactionIcon factionId={faction.id} size="100%" />
                            <div
                              className="flexRow"
                              style={{
                                position: "absolute",
                                backgroundColor: "#222",
                                borderRadius: "100%",
                                marginLeft: "60%",
                                cursor: "pointer",
                                marginTop: "60%",
                                boxShadow: `${responsivePixels(
                                  1
                                )} ${responsivePixels(1)} ${responsivePixels(
                                  4
                                )} black`,
                                width: responsivePixels(20),
                                height: responsivePixels(20),
                                color: politicalSecret ? "green" : "red",
                              }}
                              onClick={() => {
                                if (!gameid) {
                                  return;
                                }
                                if (politicalSecret) {
                                  unplayPromissoryNoteAsync(
                                    gameid,
                                    "Political Secret",
                                    faction.id
                                  );
                                } else {
                                  playPromissoryNoteAsync(
                                    gameid,
                                    "Political Secret",
                                    faction.id
                                  );
                                }
                              }}
                            >
                              {politicalSecret ? (
                                <div
                                  className="symbol"
                                  style={{
                                    fontSize: responsivePixels(18),
                                    lineHeight: responsivePixels(18),
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
                      })}
                    </div>
                  </LabeledDiv>
                </div>
              </ClientOnlyHoverMenu>
            </>
          ) : null}
          {currentAgenda &&
          !haveVotesBeenCast() &&
          !getSelectedOutcome(selectedTargets, currentTurn) ? (
            <ClientOnlyHoverMenu
              label="After an Agenda is Revealed"
              style={{ width: "100%" }}
            >
              <div
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  padding: responsivePixels(8),
                  paddingTop: 0,
                }}
              >
                <button
                  className={electionHacked ? "selected" : ""}
                  onClick={() => {
                    if (!gameid) {
                      return;
                    }
                    if (electionHacked) {
                      unplayActionCardAsync(gameid, "Hack Election", "None");
                    } else {
                      playActionCardAsync(gameid, "Hack Election", "None");
                    }
                  }}
                >
                  Hack Election
                </button>
                {remainingRiders.length !== 0 ? (
                  <Selector
                    hoverMenuLabel="Predict Outcome"
                    options={remainingRiders}
                    selectedItem={undefined}
                    toggleItem={(itemId, add) => {
                      if (!gameid) {
                        return;
                      }
                      const factionId =
                        itemId === "Galactic Threat"
                          ? "Nekro Virus"
                          : undefined;
                      playRiderAsync(gameid, itemId, factionId, undefined);
                    }}
                  />
                ) : null}
                <Selector
                  hoverMenuLabel="Assassinate Representative"
                  selectedLabel="Assassinated Representative"
                  options={Object.values(factions ?? {}).map(
                    (faction) => faction.id
                  )}
                  selectedItem={assassinatedRep}
                  toggleItem={(factionId, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      playActionCardAsync(
                        gameid,
                        "Assassinate Representative",
                        factionId
                      );
                    } else {
                      unplayActionCardAsync(
                        gameid,
                        "Assassinate Representative",
                        factionId
                      );
                    }
                  }}
                />
              </div>
            </ClientOnlyHoverMenu>
          ) : null}
          {currentAgenda ? "Cast votes (or abstain)" : null}
          {(votes && Object.keys(votes).length > 0) ||
          getSelectedOutcome(selectedTargets, currentTurn) ? (
            <LabeledDiv label="Results">
              {votes && Object.keys(votes).length > 0 ? (
                <div
                  className={flexDirection}
                  style={{
                    gap: responsivePixels(4),
                    padding: `${responsivePixels(8)} ${responsivePixels(20)}`,
                    alignItems: "flex-start",
                    border: `${responsivePixels(1)} solid #555`,
                    borderRadius: responsivePixels(10),
                    width: "100%",
                  }}
                >
                  {Object.entries(votes).map(([target, voteCount]) => {
                    return (
                      <div key={target}>
                        {target}: {voteCount}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {getSelectedOutcome(selectedTargets, currentTurn) ? (
                currentAgenda && currentAgenda.id === "Covert Legislation" ? (
                  <Selector
                    hoverMenuLabel="Covert Agenda"
                    options={possibleSubAgendas.map((agenda) => agenda.id)}
                    selectedItem={subAgenda?.id}
                    renderItem={(agendaId) => {
                      const agenda = (agendas ?? {})[agendaId];
                      if (!agenda) {
                        return null;
                      }
                      return (
                        <LabeledDiv label="Covert Agenda">
                          <AgendaRow
                            agenda={agenda}
                            removeAgenda={() => selectSubAgendaLocal(null)}
                          />
                        </LabeledDiv>
                      );
                    }}
                    toggleItem={(agendaId, add) => {
                      if (add) {
                        selectSubAgendaLocal(agendaId);
                      } else {
                        selectSubAgendaLocal(null);
                      }
                    }}
                  />
                ) : null
              ) : null}
              {/* {readyToResolve() ? (
                <Selector
                  hoverMenuLabel="Overwrite Outcome"
                  options={allTargets
                    .filter((target) => {
                      return target !== getSelectedOutcome(selectedTargets);
                    })
                    .map((target) => {
                      if (target === "Abstain") {
                        return "No Effect";
                      }
                      return target;
                    })}
                  selectedLabel="Overwritten Outcome"
                  selectedItem={subState.overwrite}
                  toggleItem={(targetName, add) => {
                    if (!gameid) {
                      return;
                    }
                    setSubStateOther(
                      gameid,
                      "overwrite",
                      add ? targetName : undefined
                    );
                  }}
                />
              ) : null} */}
              <AgendaDetails />
              {/* <PredictionDetails /> */}
              {readyToResolve() ? (
                <div
                  className="flexColumn"
                  style={{ paddingTop: responsivePixels(8), width: "100%" }}
                >
                  <button onClick={completeAgenda}>
                    Resolve with Outcome:{" "}
                    {getSelectedOutcome(selectedTargets, currentTurn)}
                  </button>
                </div>
              ) : null}
            </LabeledDiv>
          ) : currentAgenda ? (
            <div style={{ width: "fit-content" }}>
              {/* <Selector
                hoverMenuLabel="Overwrite Outcome"
                options={allTargets
                  .filter((target) => {
                    return target !== getSelectedOutcome(selectedTargets);
                  })
                  .map((target) => {
                    if (target === "Abstain") {
                      return "No Effect";
                    }
                    return target;
                  })}
                selectedLabel="Overwritten Outcome"
                selectedItem={subState.overwrite}
                toggleItem={(targetName, add) => {
                  if (!gameid) {
                    return;
                  }
                  setSubStateOther(
                    gameid,
                    "overwrite",
                    add ? targetName : undefined
                  );
                }}
              /> */}
            </div>
          ) : null}
        </div>
      )}
    </React.Fragment>
  );
}

function DictatePolicy({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const numLawsInPlay = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  }).length;
  const currentDictators = getObjectiveScorers(
    currentTurn,
    "Dictate Policy"
  ) as FactionId[];
  const dictatePolicy = (objectives ?? {})["Dictate Policy"];
  const possibleDictators = new Set(currentDictators);
  if (
    dictatePolicy &&
    numLawsInPlay >= 3 &&
    (currentDictators.length > 0 ||
      (dictatePolicy.scorers ?? []).length === 0 ||
      dictatePolicy.type === "STAGE ONE")
  ) {
    const scorers = dictatePolicy.scorers ?? [];
    for (const faction of Object.values(factions ?? {})) {
      if (!scorers.includes(faction.id)) {
        possibleDictators.add(faction.id);
      }
    }
  }
  const orderedDictators = Array.from(possibleDictators).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    return -1;
  });
  if (!dictatePolicy || orderedDictators.length < 1) {
    return null;
  }
  return (
    <div
      className="flexRow"
      style={{
        justifyContent: "center",
        marginTop: responsivePixels(12),
      }}
    >
      <ObjectiveRow objective={dictatePolicy} hideScorers />
      {dictatePolicy.type === "SECRET" ? (
        <FactionSelectRadialMenu
          onSelect={(factionId, prevFaction) => {
            if (!gameid) {
              return;
            }
            if (prevFaction) {
              unscoreObjectiveAsync(gameid, prevFaction, "Dictate Policy");
            }
            if (factionId) {
              scoreObjectiveAsync(gameid, factionId, "Dictate Policy");
            }
          }}
          borderColor={getFactionColor(
            currentDictators[0]
              ? (factions ?? {})[currentDictators[0]]
              : undefined
          )}
          factions={orderedDictators}
          selectedFaction={currentDictators[0] as FactionId | undefined}
        />
      ) : (
        orderedDictators.map((factionId) => {
          const current = hasScoredObjective(factionId, dictatePolicy);
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
                    unscoreObjectiveAsync(gameid, factionId, "Dictate Policy");
                  } else {
                    scoreObjectiveAsync(gameid, factionId, "Dictate Policy");
                  }
                }}
              >
                {current ? (
                  <div
                    className="symbol"
                    style={{
                      fontSize: responsivePixels(18),
                      lineHeight: responsivePixels(18),
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
  );
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  if (!agendas || !factions) {
    return null;
  }
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = agendas[activeAgenda];
  }

  const votes = computeVotes(currentAgenda, currentTurn);
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });
  const isTie = selectedTargets.length !== 1;

  const localAgenda = currentAgenda
    ? structuredClone(currentAgenda)
    : undefined;
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (eligibleOutcomes && eligibleOutcomes !== "None" && localAgenda) {
    localAgenda.elect = eligibleOutcomes;
  }

  const allTargets = getTargets(
    localAgenda,
    factions ?? {},
    strategyCards,
    planets ?? {},
    agendas ?? {},
    objectives ?? {}
  );

  function selectSpeakerTieBreak(tieBreak: string | null) {
    if (!gameid) {
      return;
    }
    speakerTieBreakAsync(gameid, tieBreak ?? "None");
  }

  const electionHacked =
    getActionCardTargets(currentTurn, "Hack Election").length > 0;

  const votingOrder = Object.values(factions ?? {}).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === 1) {
      return 1;
    }
    if (b.order === 1) {
      return -1;
    }
    return electionHacked ? b.order - a.order : a.order - b.order;
  });

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

  let width = 1400;
  if (orderedAgendas.length < 35) {
    width = 920;
  }
  if (orderedAgendas.length < 18) {
    width = 460;
  }

  const flexDirection =
    currentAgenda && currentAgenda.elect === "For/Against"
      ? "flexRow"
      : "flexColumn";
  const label =
    // !!subState.miscount
    //   ? "Re-voting on Miscounted Agenda"
    //   :
    agendaNum === 1 ? "First Agenda" : "Second Agenda";

  const numFactions = votingOrder.length;

  const checksAndBalances = agendas["Checks and Balances"];

  let items = (selectedTargets ?? []).length;
  if (items === 0) {
    items = allTargets.length;
  }
  if (items > 10) {
    items = 10;
  }

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  const tieBreak = getSpeakerTieBreak(currentTurn);

  function nextPhase() {
    if (!gameid) {
      return;
    }
    startNextRound(gameid);
  }

  return (
    <React.Fragment>
      <div className={`flexColumn ${styles.LeftColumn}`}>
        <AgendaSteps />
      </div>
      <div
        className={`flexColumn ${styles.MiddleColumn}`}
        style={{
          paddingTop: agendaNum > 2 ? responsivePixels(160) : undefined,
          gap: numFactions > 7 ? 0 : responsivePixels(8),
        }}
      >
        {agendaNum > 2 ? (
          <div className="flexColumn" style={{ height: "100%" }}>
            <div className="flexColumn" style={{ width: "100%" }}>
              <div
                className="flexRow"
                style={{ width: "100%", justifyContent: "space-evenly" }}
              >
                <AgendaTimer agendaNum={1} />
                <AgendaTimer agendaNum={2} />
              </div>
            </div>
            <div
              style={{
                fontSize: responsivePixels(40),
                textAlign: "center",
                marginTop: responsivePixels(120),
              }}
            >
              Agenda Phase Complete
            </div>
            <DictatePolicy />
            {checksAndBalances &&
            checksAndBalances.resolved &&
            !checksAndBalances.passed &&
            checksAndBalances.activeRound === state?.round ? (
              <div
                style={{
                  fontSize: responsivePixels(28),
                }}
              >
                Ready 3 planets, then
              </div>
            ) : (
              <div
                style={{
                  fontSize: responsivePixels(28),
                }}
              >
                Ready all planets, then
              </div>
            )}
            <button
              style={{
                marginTop: responsivePixels(12),
                fontSize: responsivePixels(24),
              }}
              onClick={() => nextPhase()}
            >
              Start Next Round
            </button>
          </div>
        ) : (
          <React.Fragment>
            <div
              className="flexRow"
              style={{
                paddingBottom: responsivePixels(8),
                alignItems: "flex-end",
              }}
            >
              <div style={{ textAlign: "center", width: responsivePixels(80) }}>
                Available Votes
              </div>
              <div style={{ textAlign: "center", width: responsivePixels(40) }}>
                Cast Votes
              </div>
              <div
                style={{ textAlign: "center", width: responsivePixels(120) }}
              >
                Outcome
              </div>
            </div>
            {votingOrder.map((faction) => {
              return (
                <VoteCount
                  key={faction.id}
                  factionId={faction.id}
                  agenda={localAgenda}
                />
              );
            })}
            {currentAgenda && isTie ? (
              !tieBreak ? (
                <LabeledDiv
                  label={getFactionName(speaker)}
                  color={getFactionColor(speaker)}
                  style={{ width: "auto" }}
                >
                  <ClientOnlyHoverMenu label="Choose outcome if tied">
                    <div
                      className="flexRow"
                      style={{
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                        gap: responsivePixels(4),
                        padding: responsivePixels(8),
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: `repeat(${items}, auto)`,
                      }}
                    >
                      {selectedTargets.length > 0
                        ? selectedTargets.map((target) => {
                            return (
                              <button
                                key={target}
                                style={{
                                  fontSize: responsivePixels(14),
                                  writingMode: "horizontal-tb",
                                }}
                                onClick={() => selectSpeakerTieBreak(target)}
                              >
                                {target}
                              </button>
                            );
                          })
                        : allTargets.map((target) => {
                            if (target === "Abstain") {
                              return null;
                            }
                            return (
                              <button
                                key={target}
                                style={{
                                  fontSize: responsivePixels(14),
                                  writingMode: "horizontal-tb",
                                }}
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
                <LabeledDiv label="Speaker Tie Break">
                  <SelectableRow
                    itemId={tieBreak}
                    removeItem={() => selectSpeakerTieBreak(null)}
                  >
                    {tieBreak}
                  </SelectableRow>
                </LabeledDiv>
              )
            ) : null}
            <DictatePolicy />
            <LockedButtons
              unlocked={false}
              style={{
                marginTop: responsivePixels(12),
                justifyContent: "center",
              }}
              buttons={[
                {
                  text: "Start Next Round",
                  style: {
                    fontSize: responsivePixels(24),
                  },
                  onClick: nextPhase,
                },
              ]}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}
