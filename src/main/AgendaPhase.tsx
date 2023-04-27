import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import SummaryColumn from "./SummaryColumn";
import { AgendaTimer } from "../Timer";
import { fetcher, poster } from "../util/api/util";
import { getTargets, VoteCount } from "../VoteCount";
import { AgendaRow } from "../AgendaRow";
import {
  Agenda,
  OutcomeType,
  repealAgenda,
  resolveAgenda,
} from "../util/api/agendas";
import { SelectableRow } from "../SelectableRow";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import {
  addSubStatePlanet,
  addSubStateRider,
  addSubStateTech,
  clearAddedSubStateTech,
  finalizeSubState,
  hideSubStateAgenda,
  hideSubStateObjective,
  removeSubStatePlanet,
  removeSubStateRider,
  resolveRiders,
  revealSubStateAgenda,
  revealSubStateObjective,
  scoreSubStateObjective,
  setSubStateOther,
  SubState,
  SubStateFaction,
  toggleSubStatePoliticalSecret,
  toggleSubStateRelic,
  unscoreSubStateObjective,
} from "../util/api/subState";
import { Faction, resetCastVotes, updateCastVotes } from "../util/api/factions";
import { responsivePixels } from "../util/util";
import { resetAgendaTimers } from "../util/api/timers";
import { resetStrategyCards, StrategyCard } from "../util/api/cards";
import {
  ancientBurialSites,
  GameState,
  setAgendaNum,
  setSpeaker,
  StateUpdateData,
} from "../util/api/state";
import {
  addAttachment,
  claimPlanet,
  Planet,
  removeAttachment,
  unclaimPlanet,
} from "../util/api/planets";
import {
  changeObjectivePoints,
  changeObjectiveType,
  hasScoredObjective,
  Objective,
  removeObjective,
  revealObjective,
  scoreObjective,
  takeObjective,
  unscoreObjective,
} from "../util/api/objectives";
import { getDefaultStrategyCards } from "../util/api/defaults";
import React, { useEffect, useState } from "react";
import { Selector } from "../Selector";
import { ObjectiveRow } from "../ObjectiveRow";
import { computeVPs } from "../FactionSummary";
import { Options } from "../util/api/options";
import { LockedButtons } from "../LockedButton";
import { TechSelectHoverMenu } from "./util/TechSelectHoverMenu";
import { Tech } from "../util/api/techs";
import { FullFactionSymbol } from "../FactionCard";
import { gainRelic, loseRelic, Relic } from "../util/api/relics";
import { InfoRow } from "../InfoRow";
import { FactionCircle } from "../components/FactionCircle";
import { FactionSelectHoverMenu } from "../components/FactionSelect";
import { SymbolX } from "../icons/svgs";

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
  subStateFactions: Record<string, SubStateFaction> = {}
) {
  const castVotes: { [key: string]: number } =
    agenda && agenda.elect === "For/Against" ? { For: 0, Against: 0 } : {};
  Object.values(subStateFactions).forEach((faction) => {
    if (
      faction.target &&
      faction.target !== "Abstain" &&
      (faction.votes ?? 0) > 0
    ) {
      if (!castVotes[faction.target]) {
        castVotes[faction.target] = 0;
      }
      castVotes[faction.target] += faction.votes ?? 0;
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

export function startNextRound(gameid: string, subState: SubState) {
  resetCastVotes(gameid);
  resetAgendaTimers(gameid);
  resetStrategyCards(gameid);
  const data: StateUpdateData = {
    action: "START_NEXT_ROUND",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = "STRATEGY";
        updatedState.activeplayer = state.speaker;
        updatedState.round = state.round + 1;
        updatedState.agendaNum = 1;

        return updatedState;
      },
      revalidate: false,
    }
  );

  finalizeSubState(gameid, subState);
}

export function getSelectedOutcome(
  selectedTargets: string[],
  subState: SubState
) {
  if (subState.overwrite) {
    return subState.overwrite;
  }

  if (selectedTargets.length === 1) {
    return selectedTargets[0];
  }
  return subState["tieBreak"];
}

function PredictionDetails() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const agendaName =
    subState.agenda === "Covert Legislation"
      ? subState.subAgenda
      : subState.agenda;

  const votes = computeVotes(
    (agendas ?? {})[agendaName ?? ""],
    subState.factions
  );
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

  const selectedOutcome = getSelectedOutcome(selectedTargets, subState);

  if (!selectedOutcome) {
    return null;
  }

  const galacticThreat = (subState.riders ?? {})["Galactic Threat"];
  if (!galacticThreat) {
    return null;
  }

  if (selectedOutcome !== galacticThreat.outcome) {
    return null;
  }

  const techOptions = new Set<string>();

  Object.entries(subState.factions ?? {}).forEach(
    ([factionName, subStateFaction]) => {
      if (!subStateFaction.target || !subStateFaction.votes) {
        return;
      }
      if (subStateFaction.target !== selectedOutcome) {
        return;
      }

      const factionTechs = (factions ?? {})[factionName]?.techs ?? {};
      Object.keys(factionTechs).forEach((techName) => {
        techOptions.add(techName);
      });
    }
  );

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

  const gainedTech = ((subState.turnData?.factions ?? {})["Nekro Virus"]
    ?.techs ?? [])[0];

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
          clearAddedSubStateTech(gameid, "Nekro Virus", gainedTech);
        }}
        selectedItem={gainedTech}
        selectedLabel="Galactic Threat"
      />
    );
  }

  return (
    <TechSelectHoverMenu
      techs={availableTechs}
      selectTech={(techName) => {
        if (!gameid) {
          return;
        }
        addSubStateTech(gameid, "Nekro Virus", techName.name);
      }}
      label="Galactic Threat"
    />
  );
}

function canScoreObjective(
  factionName: string,
  objectiveName: string,
  objectives: Record<string, Objective>,
  subState: SubState
) {
  if (
    (subState.turnData?.factions ?? {})[factionName]?.objectives?.includes(
      objectiveName
    )
  ) {
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
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: relics }: { data?: Record<string, Relic> } = useSWR(
    gameid ? `/api/${gameid}/relics` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  function addRelic(relicName: string, factionName: string) {
    if (!gameid) {
      return;
    }
    gainRelic(gameid, relicName, factionName);
    toggleSubStateRelic(gameid, relicName, factionName);
  }
  function removeRelic(relicName: string, factionName: string) {
    if (!gameid) {
      return;
    }
    loseRelic(gameid, relicName, factionName);
    toggleSubStateRelic(gameid, undefined, factionName);
  }

  const agendaName =
    subState.agenda === "Covert Legislation"
      ? subState.subAgenda
      : subState.agenda;

  const agenda = (agendas ?? {})[agendaName ?? ""];

  const votes = computeVotes(agenda, subState.factions);
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

  const selectedOutcome = getSelectedOutcome(selectedTargets, subState);

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
    scoreSubStateObjective(gameid, factionName, toScore);
  }

  function undoObjective(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, toRemove);
    unscoreSubStateObjective(gameid, factionName, toRemove);
  }

  const driveObj = (objectives ?? {})["Drive the Debate"];
  if (driveTheDebate && driveObj) {
    let canScoreDrive = canScoreObjective(
      driveTheDebate,
      "Drive the Debate",
      objectives ?? {},
      subState
    );
    if (canScoreDrive) {
      const hasScoredDrive = (subState.turnData?.factions ?? {})[
        driveTheDebate
      ]?.objectives?.includes("Drive the Debate");
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
                  <SymbolX />
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
                  removeObjective={() =>
                    hideSubStateObjective(gameid, objectiveName)
                  }
                  hideScorers={true}
                />
              </LabeledDiv>
            );
          }}
          selectedItem={(subState.objectives ?? [])[0]}
          toggleItem={(objectiveName, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              revealSubStateObjective(gameid, objectiveName);
              revealObjective(gameid, undefined, objectiveName);
            } else {
              hideSubStateObjective(gameid, objectiveName);
              removeObjective(gameid, undefined, objectiveName);
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
      let prevOwner: string | undefined;
      const selectedFaction = Object.entries(
        subState.turnData?.factions ?? {}
      ).find(([_, faction]) => {
        if (faction.planets) {
          for (const claimedPlanet of faction.planets) {
            if (claimedPlanet.name === selectedOutcome) {
              prevOwner = claimedPlanet.prevOwner;
              return true;
            }
          }
        }
        return false;
      });
      agendaSelection = (
        <Selector
          hoverMenuLabel={`Give Planet to Faction`}
          options={availableFactions}
          selectedLabel="Faction Gaining Control of Planet"
          selectedItem={selectedFaction?.[0]}
          toggleItem={(factionName, add) => {
            if (!gameid) {
              return;
            }
            if (add) {
              claimPlanet(gameid, factionName, selectedOutcome);
              const prevOwner = (planets ?? {})[selectedOutcome]?.owner;
              addSubStatePlanet(
                gameid,
                factionName,
                selectedOutcome,
                prevOwner
              );
            } else {
              if (prevOwner) {
                claimPlanet(gameid, prevOwner, selectedOutcome);
              } else {
                unclaimPlanet(gameid, selectedOutcome, factionName);
              }
              removeSubStatePlanet(gameid, factionName, selectedOutcome);
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
          selectedItem={
            (
              ((subState.turnData ?? {}).factions ?? {})[selectedOutcome]
                ?.relic ?? {}
            ).name
          }
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

export function resolveAgendaRepeal(gameid: string, agenda: Agenda) {
  if (!agenda.target) {
    return;
  }
  switch (agenda.name) {
    case "Classified Document Leaks": {
      changeObjectiveType(gameid, agenda.target, "SECRET");
      break;
    }
    case "Core Mining":
    case "Demilitarized Zone":
    case "Holy Planet of Ixth":
    case "Research Team: Biotic":
    case "Research Team: Cybernetic":
    case "Research Team: Propulsion":
    case "Research Team: Warfare":
    case "Senate Sanctuary":
    case "Terraforming Initiative": {
      removeAttachment(gameid, agenda.target, agenda.name);
      break;
    }
    case "Political Censure": {
      unscoreObjective(gameid, agenda.target, "Political Censure");
      break;
    }
  }
}

function AgendaSteps() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  if (subState.agenda) {
    currentAgenda = (agendas ?? {})[subState.agenda];
  }

  const votes = computeVotes(currentAgenda, subState.factions);
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

  function selectSpeakerTieBreak(tieBreak: string | null) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "tieBreak", tieBreak);
  }

  function resolveAgendaOutcome(agendaName: string, target: string) {
    if (!gameid) {
      return;
    }
    switch (agendaName) {
      case "Classified Document Leaks": {
        changeObjectiveType(gameid, target, "STAGE ONE");
        break;
      }
      case "Core Mining":
      case "Demilitarized Zone":
      case "Research Team: Biotic":
      case "Research Team: Cybernetic":
      case "Research Team: Propulsion":
      case "Research Team: Warfare":
      case "Senate Sanctuary":
      case "Terraforming Initiative": {
        addAttachment(gameid, target, agendaName);
        break;
      }
      case "Holy Planet of Ixth":
        addAttachment(gameid, target, agendaName);
        const planetOwner = (planets ?? {})[target]?.owner;
        if (planetOwner) {
          scoreObjective(gameid, planetOwner, "Holy Planet of Ixth");
        }
        break;
      case "Shard of the Throne":
      case "The Crown of Emphidia":
      case "Political Censure": {
        scoreObjective(gameid, target, agendaName);
        break;
      }
      case "Mutiny": {
        const forFactions = Object.entries(subState.factions ?? {})
          .filter(([_, faction]) => {
            return (faction.votes ?? 0) > 0 && faction.target === "For";
          })
          .map(([factionName, _]) => factionName);
        if (target === "For") {
          changeObjectivePoints(gameid, "Mutiny", 1);
        } else {
          changeObjectivePoints(gameid, "Mutiny", -1);
        }
        for (const factionName of forFactions) {
          scoreObjective(gameid, factionName, "Mutiny");
        }
        break;
      }
      case "Seed of an Empire": {
        let targetVPs = 0;
        if (target === "For") {
          targetVPs = Object.keys(factions ?? {}).reduce(
            (currentMax, factionName) => {
              return Math.max(
                currentMax,
                computeVPs(factions ?? {}, factionName, objectives ?? {})
              );
            },
            Number.MIN_SAFE_INTEGER
          );
        } else {
          targetVPs = Object.keys(factions ?? {}).reduce(
            (currentMin, factionName) => {
              return Math.min(
                currentMin,
                computeVPs(factions ?? {}, factionName, objectives ?? {})
              );
            },
            Number.MAX_SAFE_INTEGER
          );
        }
        const forFactions = Object.keys(factions ?? {}).filter(
          (factionName) => {
            return (
              computeVPs(factions ?? {}, factionName, objectives ?? {}) ===
              targetVPs
            );
          }
        );
        for (const factionName of forFactions) {
          scoreObjective(gameid, factionName, "Seed of an Empire");
        }
        break;
      }
      case "Colonial Redistribution": {
        // TODO: Give planet to lowest VP player
        break;
      }
      case "Judicial Abolishment": {
        repealAgenda(gameid, (agendas ?? {})[target]);
        break;
      }
      case "New Constitution": {
        const toRepeal = Object.values(agendas ?? {}).filter((agenda) => {
          return agenda.type === "LAW" && agenda.passed;
        });
        for (const agenda of toRepeal) {
          repealAgenda(gameid, agenda);
        }
        break;
      }
      case "Public Execution": {
        if (state?.speaker === target) {
          const nextPlayer = Object.values(factions ?? {}).find(
            (faction) => faction.order === 2
          );
          if (!nextPlayer) {
            break;
          }
          setSpeaker(gameid, nextPlayer.name);
        }
        break;
      }
    }
  }

  async function completeAgenda() {
    if (!gameid || !subState.agenda) {
      return;
    }
    const target = getSelectedOutcome(selectedTargets, subState);
    if (!target) {
      return;
    }
    if (target === "No Effect") {
      updateCastVotes(gameid, subState.factions);
      hideSubStateAgenda(gameid);
      finalizeSubState(gameid, subState);
      const agendaNum = state?.agendaNum ?? 1;
      setAgendaNum(gameid, agendaNum + 1);
      return;
    }
    let activeAgenda = subState.agenda;
    if (subState.subAgenda) {
      activeAgenda = subState.subAgenda;
      resolveAgenda(gameid, subState.agenda, subState.subAgenda);
    }

    resolveAgendaOutcome(activeAgenda, target);
    resolveRiders(gameid, subState, target);

    resolveAgenda(gameid, activeAgenda, target);

    updateCastVotes(gameid, subState.factions);
    hideSubStateAgenda(gameid);
    if (activeAgenda === "Miscount Disclosed") {
      repealAgenda(gameid, (agendas ?? {})[target]);
      revealSubStateAgenda(gameid, target);
      setSubStateOther(gameid, "miscount", true);
    } else {
      finalizeSubState(gameid, subState);
      const agendaNum = state?.agendaNum ?? 1;
      setAgendaNum(gameid, agendaNum + 1);
    }
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

  function selectSubAgenda(agendaName: string | null) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "subAgenda", agendaName);
  }
  function selectEligibleOutcome(outcome: OutcomeType | null) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "outcome", outcome);
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
    return subState["Hack Election"] ? b.order - a.order : a.order - b.order;
  });

  const flexDirection = "flexColumn";
  const label = !!subState.miscount
    ? "Re-voting on Miscounted Agenda"
    : agendaNum === 1
    ? "First Agenda"
    : "Second Agenda";

  const localAgenda = currentAgenda
    ? structuredClone(currentAgenda)
    : undefined;
  if (subState.outcome && localAgenda) {
    localAgenda.elect = subState.outcome as OutcomeType;
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
    (agenda) => agenda.elect === subState.outcome
  );

  const subAgenda = (agendas ?? {})[subState.subAgenda ?? ""];

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  const vetoText = !(factions ?? {})["Xxcha Kingom"]
    ? "Veto"
    : "Veto/Quash/Political Favor";

  function haveVotesBeenCast() {
    if (subState["tieBreak"]) {
      return true;
    }
    for (const subStateFaction of Object.values(subState.factions ?? {})) {
      if (subStateFaction.votes && subStateFaction.votes !== 0) {
        return true;
      }
      if (subStateFaction.target) {
        return true;
      }
    }
    return false;
  }

  function readyToResolve() {
    if (!currentAgenda || !getSelectedOutcome(selectedTargets, subState)) {
      return false;
    }
    const localAgenda =
      currentAgenda.name === "Covert Legislation" ? subAgenda : currentAgenda;
    if (!localAgenda) {
      return false;
    }
    return true;
  }

  const orderedRiders = Object.entries(subState.riders ?? {}).sort((a, b) => {
    if (a[0] > b[0]) {
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
    if (
      rider === "Galactic Threat" &&
      (subState.turnData?.factions ?? {})["Nekro Virus"]?.politicalSecret
    ) {
      return false;
    }
    if (
      rider === "Sanction" &&
      options &&
      !options.expansions.includes("CODEX ONE")
    ) {
      return false;
    }
    return !(subState.riders ?? {})[rider];
  });

  if (agendaNum > 2) {
    return null;
  }

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
          {(!currentAgenda && agendaNum === 1) || state?.ancientBurialSites ? (
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
                    ancientBurialSites(gameid, factionName);
                  } else {
                    ancientBurialSites(gameid, undefined);
                  }
                }}
                selectedItem={state?.ancientBurialSites}
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
                        gridTemplateRows: "repeat(13, auto)",
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
                  removeAgenda={
                    subState.miscount ? undefined : () => hideAgenda()
                  }
                />
                {currentAgenda.name === "Covert Legislation" ? (
                  <Selector
                    hoverMenuLabel="Reveal Eligible Outcomes"
                    selectedLabel="Eligible Outcomes"
                    options={Array.from(outcomes)}
                    selectedItem={subState.outcome}
                    toggleItem={(outcome, add) => {
                      if (add) {
                        selectEligibleOutcome(outcome as OutcomeType);
                      } else {
                        selectEligibleOutcome(null);
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
                      {orderedRiders.map(([riderName, rider]) => {
                        const faction = (factions ?? {})[
                          rider.factionName ?? ""
                        ];
                        let possibleFactions = Object.keys(
                          factions ?? {}
                        ).filter((faction) => {
                          if (
                            (subState.turnData?.factions ?? {})[faction]
                              ?.politicalSecret
                          ) {
                            return false;
                          }
                          return true;
                        });
                        if (riderName === "Galactic Threat") {
                          possibleFactions = ["Nekro Virus"];
                        }
                        if (riderName === "Keleres Rider") {
                          possibleFactions.filter(
                            (faction) => faction !== "Council Keleres"
                          );
                        }
                        return (
                          <SelectableRow
                            key={riderName}
                            itemName={riderName}
                            removeItem={() => {
                              if (!gameid) {
                                return;
                              }
                              removeSubStateRider(gameid, riderName);
                            }}
                          >
                            <LabeledDiv
                              noBlur={true}
                              label={riderName}
                              color={getFactionColor(faction)}
                            >
                              <Selector
                                hoverMenuLabel="Faction"
                                selectedItem={rider.factionName}
                                options={possibleFactions}
                                toggleItem={(itemName, add) => {
                                  if (!gameid) {
                                    return;
                                  }
                                  if (add) {
                                    addSubStateRider(
                                      gameid,
                                      riderName,
                                      itemName,
                                      rider.outcome
                                    );
                                  } else {
                                    addSubStateRider(
                                      gameid,
                                      riderName,
                                      undefined,
                                      rider.outcome
                                    );
                                  }
                                }}
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
                                    addSubStateRider(
                                      gameid,
                                      riderName,
                                      rider.factionName,
                                      itemName
                                    );
                                  } else {
                                    addSubStateRider(
                                      gameid,
                                      riderName,
                                      rider.factionName,
                                      undefined
                                    );
                                  }
                                }}
                              />
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
          !getSelectedOutcome(selectedTargets, subState) ? (
            <>
              <div className="flexRow">
                <button onClick={() => hideAgenda()}>{vetoText}</button>
              </div>
              <LabeledDiv label="Political Secret">
                <div className="flexRow" style={{ width: "100%" }}>
                  {votingOrder.map((faction) => {
                    const politicalSecret = ((subState.turnData ?? {})
                      .factions ?? {})[faction.name]?.politicalSecret;
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
                            toggleSubStatePoliticalSecret(
                              gameid,
                              faction.name,
                              !politicalSecret
                            );
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
                            <SymbolX />
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
          !getSelectedOutcome(selectedTargets, subState) ? (
            <LabeledDiv label="After an Agenda is Revealed">
              <div
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  paddingTop: subState["Assassinate Representative"]
                    ? responsivePixels(4)
                    : 0,
                }}
              >
                <Selector
                  hoverMenuLabel="Assassinate Representative"
                  selectedLabel="Assassinated Representative"
                  options={Object.keys(factions ?? {})}
                  selectedItem={subState["Assassinate Representative"]}
                  toggleItem={(itemName, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      setSubStateOther(
                        gameid,
                        "Assassinate Representative",
                        itemName
                      );
                    } else {
                      setSubStateOther(
                        gameid,
                        "Assassinate Representative",
                        undefined
                      );
                    }
                  }}
                />
                <button
                  className={subState["Hack Election"] ? "selected" : ""}
                  onClick={() => {
                    if (!gameid) {
                      return;
                    }
                    setSubStateOther(
                      gameid,
                      "Hack Election",
                      !subState["Hack Election"]
                    );
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
                      addSubStateRider(
                        gameid,
                        itemName,
                        factionName,
                        undefined
                      );
                    }}
                  />
                ) : null}
              </div>
            </LabeledDiv>
          ) : null}
          {currentAgenda ? "Cast votes (or abstain)" : null}
          {(votes && Object.keys(votes).length > 0) ||
          getSelectedOutcome(selectedTargets, subState) ? (
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
              {getSelectedOutcome(selectedTargets, subState) ? (
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
                            removeAgenda={() => selectSubAgenda(null)}
                          />
                        </LabeledDiv>
                      );
                    }}
                    toggleItem={(agendaName, add) => {
                      if (add) {
                        selectSubAgenda(agendaName);
                      } else {
                        selectSubAgenda(null);
                      }
                    }}
                  />
                ) : null
              ) : null}
              {readyToResolve() ? (
                <Selector
                  hoverMenuLabel="Overwrite Outcome"
                  options={allTargets
                    .filter((target) => {
                      return (
                        target !== getSelectedOutcome(selectedTargets, subState)
                      );
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
              ) : null}
              <AgendaDetails />
              <PredictionDetails />
              {readyToResolve() ? (
                <div
                  className="flexColumn"
                  style={{ paddingTop: responsivePixels(8), width: "100%" }}
                >
                  <button onClick={completeAgenda}>
                    Resolve with Outcome:{" "}
                    {getSelectedOutcome(selectedTargets, subState)}
                  </button>
                </div>
              ) : null}
            </LabeledDiv>
          ) : currentAgenda ? (
            <div style={{ width: "fit-content" }}>
              <Selector
                hoverMenuLabel="Overwrite Outcome"
                options={allTargets
                  .filter((target) => {
                    return (
                      target !== getSelectedOutcome(selectedTargets, subState)
                    );
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
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const numLawsInPlay = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  }).length;
  const currentDictators = [];
  for (const [factionName, faction] of Object.entries(
    subState.turnData?.factions ?? {}
  )) {
    if (faction.objectives?.includes("Dictate Policy")) {
      currentDictators.push(factionName);
    }
  }
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
        <FactionSelectHoverMenu
          onSelect={(factionName, prevFaction) => {
            if (!gameid) {
              return;
            }
            if (factionName && prevFaction) {
              takeObjective(gameid, "Dictate Policy", factionName, prevFaction);
              unscoreSubStateObjective(gameid, prevFaction, "Dictate Policy");
              scoreSubStateObjective(gameid, factionName, "Dictate Policy");
            } else if (prevFaction) {
              unscoreObjective(gameid, prevFaction, "Dictate Policy");
              unscoreSubStateObjective(gameid, prevFaction, "Dictate Policy");
            } else if (factionName) {
              scoreObjective(gameid, factionName, "Dictate Policy");
              scoreSubStateObjective(gameid, factionName, "Dictate Policy");
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
                    unscoreSubStateObjective(
                      gameid,
                      factionName,
                      "Dictate Policy"
                    );
                  } else {
                    scoreObjective(gameid, factionName, "Dictate Policy");
                    scoreSubStateObjective(
                      gameid,
                      factionName,
                      "Dictate Policy"
                    );
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
                  <SymbolX />
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
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [lockedButton, setLockedButton] = useState(true);

  if (!agendas || !factions) {
    return null;
  }

  let currentAgenda: Agenda | undefined;
  const agendaNum = state?.agendaNum ?? 1;
  if (subState.agenda) {
    currentAgenda = agendas[subState.agenda];
  }

  const votes = computeVotes(currentAgenda, subState.factions);
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
  if (subState.outcome && localAgenda) {
    localAgenda.elect = subState.outcome as OutcomeType;
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
    setSubStateOther(gameid, "tieBreak", tieBreak);
  }

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
    return subState["Hack Election"] ? b.order - a.order : a.order - b.order;
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
  const label = !!subState.miscount
    ? "Re-voting on Miscounted Agenda"
    : agendaNum === 1
    ? "First Agenda"
    : "Second Agenda";

  const numFactions = votingOrder.length;

  const checksAndBalances = agendas["Checks and Balances"];

  let items = (selectedTargets ?? []).length;
  if (items === 0) {
    items = allTargets.length;
  }
  if (items > 10) {
    items = 10;
  }

  const possibleSubAgendas = Object.values(agendas ?? {}).filter(
    (agenda) => agenda.elect === subState.outcome
  );

  const subAgenda = agendas[subState.subAgenda ?? ""];

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  function nextPhase() {
    if (!gameid) {
      return;
    }
    startNextRound(gameid, subState);
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
              !subState.tieBreak ? (
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
                                className={
                                  subState.tieBreak === target ? "selected" : ""
                                }
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
                                className={
                                  subState.tieBreak === target ? "selected" : ""
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
                <LabeledDiv label="Speaker Tie Break">
                  <SelectableRow
                    itemName={subState.tieBreak}
                    removeItem={() => selectSpeakerTieBreak(null)}
                  >
                    {subState.tieBreak}
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
