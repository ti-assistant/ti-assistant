import { useRouter } from "next/router";
import React from "react";
import { AgendaRow } from "../AgendaRow";
import { FactionCircle } from "../components/FactionCircle";
import { FactionSelectRadialMenu } from "../components/FactionSelect";
import { useGameData } from "../data/GameData";
import { FullFactionSymbol } from "../FactionCard";
import { computeVPs } from "../FactionSummary";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { SymbolX } from "../icons/svgs";
import { InfoRow } from "../InfoRow";
import { LabeledDiv } from "../LabeledDiv";
import { LockedButtons } from "../LockedButton";
import { ObjectiveRow } from "../ObjectiveRow";
import { SelectableRow } from "../SelectableRow";
import { Selector } from "../Selector";
import { AgendaTimer } from "../Timer";
import {
  getActionCardTargets,
  getActiveAgenda,
  getAllVotes,
  getGainedRelic,
  getNewOwner,
  getObjectiveScorers,
  getPlayedRiders,
  getPromissoryTargets,
  getResearchedTechs,
  getRevealedObjectives,
  getScoredObjectives,
  getSelectedEligibleOutcomes,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { addTech } from "../util/api/addTech";
import { advancePhase } from "../util/api/advancePhase";
import { Agenda, OutcomeType } from "../util/api/agendas";
import { claimPlanet, unclaimPlanet } from "../util/api/claimPlanet";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { gainRelic, loseRelic } from "../util/api/gainRelic";
import { hasScoredObjective, Objective } from "../util/api/objectives";
import { playActionCard, unplayActionCard } from "../util/api/playActionCard";
import {
  playPromissoryNote,
  unplayPromissoryNote,
} from "../util/api/playPromissoryNote";
import { playRider, unplayRider } from "../util/api/playRider";
import { resolveAgenda } from "../util/api/resolveAgenda";
import { hideAgenda, revealAgenda } from "../util/api/revealAgenda";
import { hideObjective, revealObjective } from "../util/api/revealObjective";
import { scoreObjective, unscoreObjective } from "../util/api/scoreObjective";
import { selectEligibleOutcomes } from "../util/api/selectEligibleOutcomes";
import { selectSubAgenda } from "../util/api/selectSubAgenda";
import { speakerTieBreak } from "../util/api/speakerTieBreak";
import { Tech } from "../util/api/techs";
import { ActionLogEntry } from "../util/api/util";
import { getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { getTargets, VoteCount } from "../VoteCount";
import { TechSelectHoverMenu } from "./util/TechSelectHoverMenu";

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

export function startNextRound(gameid: string) {
  advancePhase(gameid, true);
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

function PredictionDetails() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "techs",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const techs = gameData.techs;

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);
  const revealedAgenda = getActiveAgenda(currentTurn);

  const agendaName =
    revealedAgenda === "Covert Legislation"
      ? getSelectedSubAgenda(currentTurn)
      : revealedAgenda;

  const votes = computeVotes((agendas ?? {})[agendaName ?? ""], currentTurn);
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

  const riders = getPlayedRiders(currentTurn);
  let galacticThreat;
  for (const rider of riders) {
    if (rider.rider === "Galactic Threat") {
      galacticThreat = rider;
    }
  }
  if (!galacticThreat) {
    return null;
  }

  if (selectedOutcome !== galacticThreat.outcome) {
    return null;
  }

  const techOptions = new Set<string>();

  const factionVotes = getAllVotes(currentTurn);

  factionVotes.forEach((voteEvent) => {
    if (voteEvent.faction === "Nekro Virus") {
      return;
    }
    if (
      !voteEvent.target ||
      !voteEvent.votes ||
      voteEvent.target !== selectedOutcome
    ) {
      return;
    }

    const factionTechs = (factions ?? {})[voteEvent.faction]?.techs ?? {};
    Object.keys(factionTechs).forEach((techName) => {
      techOptions.add(techName);
    });
  });

  const nekroTechs = (factions ?? {})["Nekro Virus"]?.techs ?? {};
  Object.keys(nekroTechs).forEach((techName) => {
    techOptions.delete(techName);
  });

  if (techOptions.size === 0) {
    return null;
  }

  const availableTechs = Array.from(techOptions).map(
    (techName) => (techs ?? {})[techName] as Tech
  );

  const gainedTech = getResearchedTechs(currentTurn, "Nekro Virus")[0];

  if (gainedTech) {
    return (
      <Selector
        hoverMenuLabel="error"
        autoSelect={false}
        options={["1", "2"]}
        toggleItem={() => {
          if (!gameid) {
            return;
          }
          addTech(gameid, "Nekro Virus", gainedTech);
        }}
        selectedItem={gainedTech}
        selectedLabel="Galactic Threat"
      />
    );
  }

  return (
    <TechSelectHoverMenu
      factionName={"Nekro Virus"}
      techs={availableTechs}
      selectTech={(techName) => {
        if (!gameid) {
          return;
        }
        addTech(gameid, "Nekro Virus", techName.name);
      }}
      label="Galactic Threat"
    />
  );
}

function canScoreObjective(
  factionName: string,
  objectiveName: string,
  objectives: Record<string, Objective>,
  currentTurn: ActionLogEntry[]
) {
  const scored = getScoredObjectives(currentTurn, factionName);
  if (scored.includes(objectiveName)) {
    return true;
  }
  const objective = objectives[objectiveName];
  if (!objective) {
    return false;
  }
  if (objective.type === "SECRET" && (objective.scorers ?? []).length > 0) {
    return false;
  }
  if ((objective.scorers ?? []).includes(factionName)) {
    return false;
  }
  return true;
}

function AgendaDetails() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "objectives",
    "planets",
    "relics",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const planets = gameData.planets;
  const relics = gameData.relics;
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  function addRelic(relicName: string, factionName: string) {
    if (!gameid) {
      return;
    }
    gainRelic(gameid, factionName, relicName);
  }
  function removeRelic(relicName: string, factionName: string) {
    if (!gameid) {
      return;
    }
    loseRelic(gameid, factionName, relicName);
  }

  let agendaName = getActiveAgenda(currentTurn);
  if (agendaName === "Covert Legislation") {
    agendaName = getSelectedSubAgenda(currentTurn);
  }

  const agenda = (agendas ?? {})[agendaName ?? ""];

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
  let driveTheDebate: string | undefined;
  switch (agenda?.elect) {
    case "Player": {
      driveTheDebate = selectedOutcome;
      break;
    }
    case "Cultural Planet":
    case "Hazardous Planet":
    case "Planet":
    case "Industrial Planet":
    case "Non-Home Planet Other Than Mecatol Rex": {
      const electedPlanet = (planets ?? {})[selectedOutcome];
      if (!electedPlanet || !electedPlanet.owner) {
        break;
      }
      driveTheDebate = electedPlanet.owner;
      break;
    }
  }

  function addObjective(factionName: string, toScore: string) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, toScore);
  }

  function undoObjective(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, toRemove);
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
            blur={true}
            borderColor={getFactionColor((factions ?? {})[driveTheDebate])}
            factionName={driveTheDebate}
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
  switch (agendaName) {
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
          options={availableObjectives.map((objective) => objective.name)}
          renderItem={(objectiveName) => {
            const objective = (objectives ?? {})[objectiveName];
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
                  removeObjective={() => hideObjective(gameid, objectiveName)}
                  hideScorers={true}
                />
              </LabeledDiv>
            );
          }}
          selectedItem={getRevealedObjectives(currentTurn)[0]}
          toggleItem={(objectiveName, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              revealObjective(gameid, objectiveName);
            } else {
              hideObjective(gameid, objectiveName);
            }
          }}
        />
      );
      break;
    }
    case "Colonial Redistribution": {
      const minVPs = Object.keys(factions ?? {}).reduce(
        (minVal, factionName) => {
          return Math.min(
            minVal,
            computeVPs(factions ?? {}, factionName, objectives ?? {})
          );
        },
        Number.MAX_SAFE_INTEGER
      );
      const availableFactions = Object.keys(factions ?? {}).filter(
        (factionName) => {
          return (
            computeVPs(factions ?? {}, factionName, objectives ?? {}) === minVPs
          );
        }
      );
      const selectedFaction = getNewOwner(currentTurn, selectedOutcome);
      agendaSelection = (
        <Selector
          hoverMenuLabel={`Give Planet to Faction`}
          options={availableFactions}
          selectedLabel="Faction Gaining Control of Planet"
          selectedItem={selectedFaction}
          toggleItem={(factionName, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              claimPlanet(gameid, factionName, selectedOutcome);
            } else {
              unclaimPlanet(gameid, factionName, selectedOutcome);
            }
          }}
        />
      );
      break;
    }
    case "Minister of Antiques": {
      const unownedRelics = Object.values(relics ?? {})
        .filter((relic) => !relic.owner)
        .map((relic) => relic.name);
      agendaSelection = (
        <Selector
          hoverMenuLabel="Gain Relic"
          options={unownedRelics}
          renderItem={(itemName) => {
            const relic = (relics ?? {})[itemName];
            if (!relic) {
              return null;
            }
            return (
              <LabeledDiv label="Gained Relic">
                <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
                  <SelectableRow
                    itemName={relic.name}
                    removeItem={() => {
                      removeRelic(relic.name, selectedOutcome);
                    }}
                  >
                    <InfoRow
                      infoTitle={relic.name}
                      infoContent={relic.description}
                    >
                      {relic.name}
                    </InfoRow>
                  </SelectableRow>
                  {relic.name === "Shard of the Throne" ? (
                    <div>+1 VP</div>
                  ) : null}
                </div>
              </LabeledDiv>
            );
          }}
          selectedItem={getGainedRelic(currentTurn)}
          toggleItem={(relicName, add) => {
            if (add) {
              addRelic(relicName, selectedOutcome);
            } else {
              removeRelic(relicName, selectedOutcome);
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
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "objectives",
    "options",
    "planets",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const options = gameData.options;
  const planets = gameData.planets;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

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
  const isTie = selectedTargets.length !== 1;

  // function resolveAgendaOutcome(agendaName: string, target: string) {
  //   if (!gameid) {
  //     return;
  //   }
  //   switch (agendaName) {
  //     case "Classified Document Leaks": {
  //       changeObjectiveType(gameid, target, "STAGE ONE");
  //       break;
  //     }
  //     case "Core Mining":
  //     case "Demilitarized Zone":
  //     case "Research Team: Biotic":
  //     case "Research Team: Cybernetic":
  //     case "Research Team: Propulsion":
  //     case "Research Team: Warfare":
  //     case "Senate Sanctuary":
  //     case "Terraforming Initiative": {
  //       addAttachment(gameid, target, agendaName);
  //       break;
  //     }
  //     case "Holy Planet of Ixth":
  //       addAttachment(gameid, target, agendaName);
  //       const planetOwner = (planets ?? {})[target]?.owner;
  //       if (planetOwner) {
  //         scoreObjective(gameid, planetOwner, "Holy Planet of Ixth");
  //       }
  //       break;
  //     case "Shard of the Throne":
  //     case "The Crown of Emphidia":
  //     case "Political Censure": {
  //       scoreObjective(gameid, target, agendaName);
  //       break;
  //     }
  //     case "Mutiny": {
  //       const forFactions = Object.entries(subState.factions ?? {})
  //         .filter(([_, faction]) => {
  //           return (faction.votes ?? 0) > 0 && faction.target === "For";
  //         })
  //         .map(([factionName, _]) => factionName);
  //       if (target === "For") {
  //         changeObjectivePoints(gameid, "Mutiny", 1);
  //       } else {
  //         changeObjectivePoints(gameid, "Mutiny", -1);
  //       }
  //       for (const factionName of forFactions) {
  //         scoreObjective(gameid, factionName, "Mutiny");
  //       }
  //       break;
  //     }
  //     case "Seed of an Empire": {
  //       let targetVPs = 0;
  //       if (target === "For") {
  //         targetVPs = Object.keys(factions ?? {}).reduce(
  //           (currentMax, factionName) => {
  //             return Math.max(
  //               currentMax,
  //               computeVPs(factions ?? {}, factionName, objectives ?? {})
  //             );
  //           },
  //           Number.MIN_SAFE_INTEGER
  //         );
  //       } else {
  //         targetVPs = Object.keys(factions ?? {}).reduce(
  //           (currentMin, factionName) => {
  //             return Math.min(
  //               currentMin,
  //               computeVPs(factions ?? {}, factionName, objectives ?? {})
  //             );
  //           },
  //           Number.MAX_SAFE_INTEGER
  //         );
  //       }
  //       const forFactions = Object.keys(factions ?? {}).filter(
  //         (factionName) => {
  //           return (
  //             computeVPs(factions ?? {}, factionName, objectives ?? {}) ===
  //             targetVPs
  //           );
  //         }
  //       );
  //       for (const factionName of forFactions) {
  //         scoreObjective(gameid, factionName, "Seed of an Empire");
  //       }
  //       break;
  //     }
  //     case "Colonial Redistribution": {
  //       // TODO: Give planet to lowest VP player
  //       break;
  //     }
  //     case "Judicial Abolishment": {
  //       repealAgenda(gameid, (agendas ?? {})[target]);
  //       break;
  //     }
  //     case "New Constitution": {
  //       const toRepeal = Object.values(agendas ?? {}).filter((agenda) => {
  //         return agenda.type === "LAW" && agenda.passed;
  //       });
  //       for (const agenda of toRepeal) {
  //         repealAgenda(gameid, agenda);
  //       }
  //       break;
  //     }
  //     case "Public Execution": {
  //       if (state?.speaker === target) {
  //         const nextPlayer = Object.values(factions ?? {}).find(
  //           (faction) => faction.order === 2
  //         );
  //         if (!nextPlayer) {
  //           break;
  //         }
  //         setSpeaker(gameid, nextPlayer.name);
  //       }
  //       break;
  //     }
  //   }
  // }

  async function completeAgenda() {
    if (!gameid || !currentAgenda) {
      return;
    }
    const target = getSelectedOutcome(selectedTargets, currentTurn);
    if (!target) {
      return;
    }

    resolveAgenda(gameid, currentAgenda.name, target);
  }

  function selectAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    revealAgenda(gameid, agendaName);
  }
  function hideAgendaLocal(agendaName?: string, veto?: boolean) {
    if (!gameid || !agendaName) {
      return;
    }
    hideAgenda(gameid, agendaName, veto);
  }

  function selectSubAgendaLocal(agendaName: string | null) {
    if (!gameid) {
      return;
    }
    selectSubAgenda(gameid, agendaName ?? "None");
  }
  function selectEligibleOutcome(outcome: OutcomeType | "None") {
    if (!gameid) {
      return;
    }
    selectEligibleOutcomes(gameid, outcome);
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

  const subAgenda = (agendas ?? {})[getSelectedSubAgenda(currentTurn) ?? ""];

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  const vetoText = !(factions ?? {})["Xxcha Kingom"]
    ? "Veto"
    : "Veto/Quash/Political Favor";

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
      currentAgenda.name === "Covert Legislation" ? subAgenda : currentAgenda;
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

  const ancientBurialSites = getActionCardTargets(
    currentTurn,
    "Ancient Burial Sites"
  )[0];
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
            <LabeledDiv
              label="Start of Agenda Phase"
              style={{ paddingTop: responsivePixels(12) }}
            >
              <Selector
                hoverMenuLabel="Ancient Burial Sites"
                selectedLabel="Cultural Planets Exhausted"
                options={Object.keys(factions ?? {})}
                toggleItem={(factionName, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    playActionCard(gameid, "Ancient Burial Sites", factionName);
                  } else {
                    unplayActionCard(
                      gameid,
                      "Ancient Burial Sites",
                      factionName
                    );
                  }
                }}
                selectedItem={ancientBurialSites}
              />
            </LabeledDiv>
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
                            key={agenda.name}
                            className={agenda.resolved ? "faded" : ""}
                            style={{
                              fontSize: responsivePixels(14),
                              writingMode: "horizontal-tb",
                            }}
                            onClick={() => selectAgenda(agenda.name)}
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
                  removeAgenda={() => hideAgendaLocal(currentAgenda?.name)}
                />
                {currentAgenda.name === "Covert Legislation" ? (
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
                        const faction = (factions ?? {})[rider.faction ?? ""];
                        let possibleFactions = Object.keys(
                          factions ?? {}
                        ).filter((faction) => {
                          const secrets = getPromissoryTargets(
                            currentTurn,
                            "Political Secret"
                          );
                          return !secrets.includes(faction);
                        });
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
                            itemName={rider.rider}
                            removeItem={() => {
                              if (!gameid) {
                                return;
                              }
                              unplayRider(gameid, rider.rider);
                            }}
                          >
                            <LabeledDiv
                              noBlur={true}
                              label={rider.rider}
                              color={getFactionColor(faction)}
                            >
                              <div className="flexRow">
                                <FactionSelectRadialMenu
                                  allowNone={possibleFactions.length > 1}
                                  selectedFaction={rider.faction}
                                  options={possibleFactions}
                                  onSelect={(factionName) => {
                                    if (!gameid) {
                                      return;
                                    }
                                    playRider(
                                      gameid,
                                      rider.rider,
                                      factionName,
                                      rider.outcome
                                    );
                                  }}
                                  borderColor={getFactionColor(
                                    factions[rider.faction ?? ""]
                                  )}
                                />
                                <Selector
                                  hoverMenuLabel="Outcome"
                                  selectedItem={rider.outcome}
                                  options={allTargets.filter(
                                    (target) => target !== "Abstain"
                                  )}
                                  toggleItem={(itemName, add) => {
                                    if (!gameid) {
                                      return;
                                    }
                                    if (add) {
                                      playRider(
                                        gameid,
                                        rider.rider,
                                        rider.faction,
                                        itemName as OutcomeType
                                      );
                                    } else {
                                      playRider(
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
              <div className="flexRow">
                <button
                  onClick={() => hideAgendaLocal(currentAgenda?.name, true)}
                >
                  {vetoText}
                </button>
              </div>
              <LabeledDiv label="Political Secret">
                <div className="flexRow" style={{ width: "100%" }}>
                  {votingOrder.map((faction) => {
                    const politicalSecret = politicalSecrets.includes(
                      faction.name
                    );
                    return (
                      <div
                        key={faction.name}
                        className="flexRow hiddenButtonParent"
                        style={{
                          position: "relative",
                          width: responsivePixels(32),
                          height: responsivePixels(32),
                        }}
                      >
                        <FullFactionSymbol faction={faction.name} />
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
                              unplayPromissoryNote(
                                gameid,
                                "Political Secret",
                                faction.name
                              );
                            } else {
                              playPromissoryNote(
                                gameid,
                                "Political Secret",
                                faction.name
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
            </>
          ) : null}
          {currentAgenda &&
          !haveVotesBeenCast() &&
          !getSelectedOutcome(selectedTargets, currentTurn) ? (
            <ClientOnlyHoverMenu label="After an Agenda is Revealed">
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
                      unplayActionCard(gameid, "Hack Election", "None");
                    } else {
                      playActionCard(gameid, "Hack Election", "None");
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
                    toggleItem={(itemName, add) => {
                      if (!gameid) {
                        return;
                      }
                      let factionName =
                        itemName === "Galactic Threat"
                          ? "Nekro Virus"
                          : undefined;
                      playRider(gameid, itemName, factionName, undefined);
                    }}
                  />
                ) : null}
                <Selector
                  hoverMenuLabel="Assassinate Representative"
                  selectedLabel="Assassinated Representative"
                  options={Object.keys(factions ?? {})}
                  selectedItem={assassinatedRep}
                  toggleItem={(itemName, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      playActionCard(
                        gameid,
                        "Assassinate Representative",
                        itemName
                      );
                    } else {
                      unplayActionCard(
                        gameid,
                        "Assassinate Representative",
                        itemName
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
                currentAgenda && currentAgenda.name === "Covert Legislation" ? (
                  <Selector
                    hoverMenuLabel="Covert Agenda"
                    options={possibleSubAgendas.map((agenda) => agenda.name)}
                    selectedItem={subAgenda?.name}
                    renderItem={(agendaName) => {
                      const agenda = (agendas ?? {})[agendaName];
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
                    toggleItem={(agendaName, add) => {
                      if (add) {
                        selectSubAgendaLocal(agendaName);
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
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "objectives",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const numLawsInPlay = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  }).length;
  const currentDictators = getObjectiveScorers(currentTurn, "Dictate Policy");
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
    for (const factionName of Object.keys(factions ?? {})) {
      if (!scorers.includes(factionName)) {
        possibleDictators.add(factionName);
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
          onSelect={(factionName, prevFaction) => {
            if (!gameid) {
              return;
            }
            if (prevFaction) {
              unscoreObjective(gameid, prevFaction, "Dictate Policy");
            }
            if (factionName) {
              scoreObjective(gameid, factionName, "Dictate Policy");
            }
          }}
          borderColor={getFactionColor(
            (factions ?? {})[currentDictators[0] ?? ""]
          )}
          options={orderedDictators}
          selectedFaction={currentDictators[0]}
        />
      ) : (
        orderedDictators.map((factionName) => {
          const current = hasScoredObjective(factionName, dictatePolicy);
          return (
            <div
              key={factionName}
              className="flexRow hiddenButtonParent"
              style={{
                position: "relative",
                width: responsivePixels(32),
                height: responsivePixels(32),
              }}
            >
              <FullFactionSymbol faction={factionName} />
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
                    unscoreObjective(gameid, factionName, "Dictate Policy");
                  } else {
                    scoreObjective(gameid, factionName, "Dictate Policy");
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
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "objectives",
    "planets",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const planets = gameData.planets;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  if (!agendas || !factions) {
    return null;
  }
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

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
    speakerTieBreak(gameid, tieBreak ?? "None");
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
      <div className="flexColumn" style={{ paddingTop: responsivePixels(140) }}>
        <AgendaSteps />
      </div>
      <div
        className="flexColumn"
        style={{
          paddingTop:
            agendaNum > 2 ? responsivePixels(160) : responsivePixels(80),
          gap: numFactions > 7 ? 0 : responsivePixels(8),
          alignItems: "stretch",
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
                  key={faction.name}
                  factionName={faction.name}
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
                    itemName={tieBreak}
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
