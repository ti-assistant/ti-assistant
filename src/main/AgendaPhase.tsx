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
  finalizeSubState,
  hideSubStateAgenda,
  hideSubStateObjective,
  revealSubStateAgenda,
  revealSubStateObjective,
  setSubStateOther,
  SubState,
  SubStateFaction,
} from "../util/api/subState";
import { Faction, resetCastVotes, updateCastVotes } from "../util/api/factions";
import { responsivePixels } from "../util/util";
import { NumberedItem } from "../NumberedItem";
import { resetAgendaTimers } from "../util/api/timers";
import { resetStrategyCards, StrategyCard } from "../util/api/cards";
import { GameState, setAgendaNum, StateUpdateData } from "../util/api/state";
import { Planet } from "../util/api/planets";
import { Objective } from "../util/api/objectives";
import { getDefaultStrategyCards } from "../util/api/defaults";
import React from "react";
import { Selector } from "../Selector";
import { ObjectiveRow } from "../ObjectiveRow";

const RIDERS = [
  "Construction Rider",
  "Diplomacy Rider",
  "Imperial Rider",
  "Leadership Rider",
  "Politics Rider",
  "Technology Rider",
  "Trade Rider",
  "Warfare Rider",
  "Sanction",
  "Keleres Rider",
  "Galactic Threat",
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
  if (selectedTargets.length === 1) {
    return selectedTargets[0];
  }
  return subState["tieBreak"];
}

function AgendaDetails() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
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

  switch (agendaName) {
    case "Incentive Program":
      const type = selectedOutcome === "For" ? "stage-one" : "stage-two";
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return objective.type === type && !objective.selected;
        }
      );
      return (
        <Selector
          hoverMenuLabel={`Reveal Stage ${
            type === "stage-one" ? "I" : "II"
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
                  type === "stage-one" ? "I" : "II"
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
            } else {
              hideSubStateObjective(gameid, objectiveName);
            }
          }}
        />
      );
  }

  return null;
}

function AgendaSteps() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
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

  async function completeAgenda() {
    if (!gameid || !subState.agenda) {
      return;
    }
    const target = isTie ? subState.tieBreak : selectedTargets[0];
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
      repealAgenda(gameid, target);
      revealSubStateAgenda(gameid, target);
      setSubStateOther(gameid, "miscount", true);
    } else {
      finalizeSubState(gameid, subState);
      const agendaNum = state?.agendaNum ?? 1;
      setAgendaNum(gameid, agendaNum + 1);
    }
  }

  function nextPhase() {
    if (!gameid) {
      return;
    }
    startNextRound(gameid, subState);
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

  const flexDirection =
    currentAgenda && currentAgenda.elect === "For/Against"
      ? "flexRow"
      : "flexColumn";
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

  const vetoText = (factions ?? {})["Xxcha Kingom"]
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

  return (
    <React.Fragment>
      <AgendaTimer />
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
          <div
            className="flexRow mediumFont"
            style={{ justifyContent: "flex-start", whiteSpace: "nowrap" }}
          >
            {!currentAgenda ? (
              <div className="flexRow" style={{ justifyContent: "flex-start" }}>
                <LabeledDiv
                  label={`Speaker: ${getFactionName(speaker)}`}
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
              </LabeledDiv>
            )}
          </div>
          {currentAgenda && !haveVotesBeenCast() ? (
            <div className="flexRow">
              <button onClick={() => hideAgenda()}>{vetoText}</button>
            </div>
          ) : null}
          {currentAgenda && !haveVotesBeenCast() ? (
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
                <ClientOnlyHoverMenu label="Predict Outcome">
                  <div
                    className="flexColumn"
                    style={{ padding: responsivePixels(8) }}
                  >
                    Work in Progress
                  </div>
                </ClientOnlyHoverMenu>
              </div>
            </LabeledDiv>
          ) : null}
          Cast votes (or abstain)
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
              <AgendaDetails />
              {readyToResolve() ? (
                <div
                  className="flexColumn"
                  style={{ paddingTop: responsivePixels(8), width: "100%" }}
                >
                  <button onClick={completeAgenda}>
                    Resolve with target:{" "}
                    {getSelectedOutcome(selectedTargets, subState)}
                  </button>
                </div>
              ) : null}
            </LabeledDiv>
          ) : null}
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
    </React.Fragment>
  );
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );

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

  async function completeAgenda() {
    if (!gameid || !subState.agenda) {
      return;
    }
    const target = isTie ? subState.tieBreak : selectedTargets[0];
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
      repealAgenda(gameid, target);
      revealSubStateAgenda(gameid, target);
      setSubStateOther(gameid, "miscount", true);
    } else {
      finalizeSubState(gameid, subState);
      const agendaNum = state?.agendaNum ?? 1;
      setAgendaNum(gameid, agendaNum + 1);
    }
  }

  function nextPhase() {
    if (!gameid) {
      return;
    }
    startNextRound(gameid, subState);
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

  return (
    <div
      className="flexRow"
      style={{
        gap: responsivePixels(40),
        height: "100svh",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <div className="flexColumn" style={{ paddingTop: responsivePixels(140) }}>
        <AgendaSteps />
      </div>
      <div
        className="flexColumn"
        style={{
          paddingTop: responsivePixels(80),
          gap: numFactions > 7 ? 0 : responsivePixels(8),
          alignItems: "stretch",
        }}
      >
        <div
          className="flexRow"
          style={{ paddingBottom: responsivePixels(8), alignItems: "flex-end" }}
        >
          <div style={{ textAlign: "center", width: responsivePixels(80) }}>
            Available Votes
          </div>
          <div style={{ textAlign: "center", width: responsivePixels(40) }}>
            Cast Votes
          </div>
          <div style={{ textAlign: "center", width: responsivePixels(120) }}>
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
              label={`Speaker: ${getFactionName(speaker)}`}
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
      </div>
      <div className="flexColumn" style={{ width: responsivePixels(280) }}>
        <SummaryColumn />
      </div>
    </div>
  );
}
