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
  revealSubStateAgenda,
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
    return a.order - b.order;
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
    ? "FIRST AGENDA"
    : "SECOND AGENDA";

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
      <div
        className="flexColumn"
        style={{
          paddingTop: responsivePixels(140),
          gap: numFactions > 7 ? 0 : responsivePixels(8),
          alignItems: "stretch",
          width: responsivePixels(300),
        }}
      >
        {numFactions < 7 ? (
          <div className="flexRow" style={{ alignItems: "flex-end" }}>
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
        ) : null}
        {votingOrder.map((faction) => {
          return (
            <VoteCount
              key={faction.name}
              factionName={faction.name}
              agenda={localAgenda}
            />
          );
        })}
      </div>
      <div
        className="flexColumn"
        style={{ flexBasis: "30%", paddingTop: responsivePixels(80) }}
      >
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
          <ol
            className="flexColumn"
            style={{
              margin: "0",
              padding: "0",
              fontSize: responsivePixels(18),
              alignItems: "stretch",
            }}
          >
            <NumberedItem>
              <div
                className="flexRow mediumFont"
                style={{ justifyContent: "flex-start", whiteSpace: "nowrap" }}
              >
                {!currentAgenda ? (
                  <div
                    className="flexRow"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <LabeledDiv
                      label={`Speaker: ${getFactionName(
                        factions[state?.speaker ?? ""]
                      )}`}
                      color={getFactionColor(factions[state?.speaker ?? ""])}
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
                  </LabeledDiv>
                )}
              </div>
            </NumberedItem>
            {currentAgenda && currentAgenda.name === "Covert Legislation" ? (
              <NumberedItem>
                <div
                  className="flexRow mediumFont"
                  style={{ justifyContent: "flex-start", whiteSpace: "nowrap" }}
                >
                  {subState.outcome ? (
                    <LabeledDiv label="ELIGIBLE OUTCOMES">
                      <SelectableRow
                        itemName={subState.outcome}
                        removeItem={() => selectEligibleOutcome(null)}
                      >
                        <div style={{ display: "flex" }}>
                          {subState.outcome}
                        </div>
                      </SelectableRow>
                    </LabeledDiv>
                  ) : (
                    <LabeledDiv
                      label={`Speaker: ${getFactionName(
                        factions[state?.speaker ?? ""]
                      )}`}
                      color={getFactionColor(factions[state?.speaker ?? ""])}
                    >
                      <ClientOnlyHoverMenu label="Reveal Eligible Outcomes">
                        <div
                          className="flexColumn"
                          style={{
                            padding: responsivePixels(8),
                            gap: responsivePixels(4),
                            alignItems: "stretch",
                            justifyContent: "flex-start",
                          }}
                        >
                          {Array.from(outcomes).map((outcome) => {
                            return (
                              <button
                                key={outcome}
                                style={{ fontSize: responsivePixels(14) }}
                                onClick={() => selectEligibleOutcome(outcome)}
                              >
                                {outcome}
                              </button>
                            );
                          })}
                        </div>
                      </ClientOnlyHoverMenu>
                    </LabeledDiv>
                  )}
                </div>
              </NumberedItem>
            ) : null}
            <NumberedItem>
              <div className="mediumFont">
                Perform any <i>When an Agenda is revealed</i> actions
              </div>
              <div className="mediumFont">
                Perform any <i>After an Agenda is revealed</i> actions
              </div>
            </NumberedItem>
            <NumberedItem>Discuss</NumberedItem>
            <NumberedItem>
              In Voting Order: Cast votes (or abstain)
              {votes && Object.keys(votes).length > 0 ? (
                <div
                  className={flexDirection}
                  style={{
                    marginTop: responsivePixels(12),
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
            </NumberedItem>
            {currentAgenda && isTie ? (
              <NumberedItem>
                <div>
                  {!subState.tieBreak ? (
                    <LabeledDiv
                      label={`Speaker: ${getFactionName(
                        factions[state?.speaker ?? ""]
                      )}`}
                      color={getFactionColor(factions[state?.speaker ?? ""])}
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
                                      subState.tieBreak === target
                                        ? "selected"
                                        : ""
                                    }
                                    onClick={() =>
                                      selectSpeakerTieBreak(target)
                                    }
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
                                      subState.tieBreak === target
                                        ? "selected"
                                        : ""
                                    }
                                    onClick={() =>
                                      selectSpeakerTieBreak(target)
                                    }
                                  >
                                    {target}
                                  </button>
                                );
                              })}
                        </div>
                      </ClientOnlyHoverMenu>
                    </LabeledDiv>
                  ) : (
                    <LabeledDiv label="SPEAKER SELECTED OPTION">
                      <SelectableRow
                        itemName={subState.tieBreak}
                        removeItem={() => selectSpeakerTieBreak(null)}
                      >
                        {subState.tieBreak}
                      </SelectableRow>
                    </LabeledDiv>
                  )}
                </div>
              </NumberedItem>
            ) : null}
            <NumberedItem>
              Resolve agenda outcome
              <div
                className="flexColumn mediumFont"
                style={{ width: "100%", paddingTop: responsivePixels(4) }}
              >
                {currentAgenda &&
                currentAgenda.name === "Covert Legislation" ? (
                  !subAgenda ? (
                    <ClientOnlyHoverMenu label="Reveal Covert Legislation Agenda">
                      <div
                        className="flexRow"
                        style={{
                          gap: responsivePixels(4),
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                          padding: responsivePixels(8),
                          display: "grid",
                          gridAutoFlow: "column",
                          gridTemplateRows: `repeat(${Math.min(
                            possibleSubAgendas.length,
                            13
                          )}, auto)`,
                        }}
                      >
                        {possibleSubAgendas.map((agenda) => {
                          return (
                            <button
                              key={agenda.name}
                              style={{
                                writingMode: "horizontal-tb",
                                fontSize: responsivePixels(14),
                              }}
                              className={agenda.resolved ? "faded" : ""}
                              onClick={() => selectSubAgenda(agenda.name)}
                            >
                              {agenda.name}
                            </button>
                          );
                        })}
                      </div>
                    </ClientOnlyHoverMenu>
                  ) : (
                    <AgendaRow
                      agenda={subAgenda}
                      removeAgenda={() => selectSubAgenda(null)}
                    />
                  )
                ) : null}
                {!isTie && selectedTargets.length > 0 ? (
                  <div
                    className="flexColumn"
                    style={{ paddingTop: responsivePixels(8), width: "100%" }}
                  >
                    <button onClick={completeAgenda}>
                      Resolve with target: {selectedTargets[0]}
                    </button>
                  </div>
                ) : null}
                {isTie &&
                subState.tieBreak &&
                (selectedTargets.length === 0 ||
                  selectedTargets.includes(subState.tieBreak)) ? (
                  <div
                    className="flexColumn"
                    style={{ paddingTop: responsivePixels(8), width: "100%" }}
                  >
                    <button onClick={completeAgenda}>
                      Resolve with target: {subState.tieBreak}
                    </button>
                  </div>
                ) : null}
              </div>
            </NumberedItem>
            {agendaNum === 1 ? (
              <NumberedItem>Repeat Steps 1 to 6</NumberedItem>
            ) : null}
            {checksAndBalances &&
            checksAndBalances.resolved &&
            checksAndBalances.target === "Against" &&
            checksAndBalances.activeRound === state?.round ? (
              <NumberedItem>Ready three planets</NumberedItem>
            ) : (
              <NumberedItem>Ready all planets</NumberedItem>
            )}
          </ol>
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
      <div
        className="flexColumn"
        style={{ flexBasis: "30%", maxWidth: responsivePixels(400) }}
      >
        <SummaryColumn />
      </div>
    </div>
  );
}
