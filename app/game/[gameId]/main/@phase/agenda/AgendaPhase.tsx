import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { LockedButtons } from "../../../../../../src/LockedButton";
import AgendaTimer from "../../../../../../src/components/AgendaTimer/AgendaTimer";
import Conditional from "../../../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../src/components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import MawOfWorlds from "../../../../../../src/components/MawOfWorlds/MawOfWorlds";
import ObjectiveRow from "../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import { getTargets } from "../../../../../../src/components/VoteBlock/VoteBlock";
import {
  useActionLog,
  useAgendas,
  useCurrentTurn,
  useGameId,
  useOptions,
  usePlanets,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../src/context/stateDataHooks";
import {
  advancePhaseAsync,
  playActionCardAsync,
  scoreObjectiveAsync,
  speakerTieBreakAsync,
  unplayActionCardAsync,
  unscoreObjectiveAsync,
} from "../../../../../../src/dynamic/api";
import { SymbolX } from "../../../../../../src/icons/svgs";
import {
  getActionCardTargets,
  getActiveAgenda,
  getAllVotes,
  getObjectiveScorers,
  getPromissoryTargets,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../src/util/api/actionLog";
import { hasScoredObjective } from "../../../../../../src/util/api/util";
import {
  getColorForFaction,
  getFactionColor,
} from "../../../../../../src/util/factions";
import { phaseString } from "../../../../../../src/util/strings";
import { ActionLog, Optional } from "../../../../../../src/util/types/types";
import { rem } from "../../../../../../src/util/util";
import styles from "./AgendaPhase.module.scss";
import AfterAnAgendaIsRevealed from "./components/AfterAnAgendaIsRevealed";
import AgendaSelect from "./components/AgendaSelect";
import { CastVotesSection } from "./components/CastVotesSection";
import CovertLegislation from "./components/CovertLegislation";
import StartVoting from "./components/StartVoting";
import VotingColumn from "./components/VotingColumn";
import WhenAnAgendaIsRevealed from "./components/WhenAnAgendaIsRevealed";

export function computeVotes(
  agenda: Optional<Agenda>,
  currentTurn: ActionLog,
  numFactions: number
) {
  const currentCouncilor = getActionCardTargets(
    currentTurn,
    "Distinguished Councilor"
  )[0] as Optional<FactionId>;
  const councilPreservePlayer = getActionCardTargets(
    currentTurn,
    "Council Preserve"
  )[0] as Optional<FactionId>;
  const bloodPactUsed =
    getPromissoryTargets(currentTurn, "Blood Pact").length > 0;
  const usingPredictive = getActionCardTargets(
    currentTurn,
    "Predictive Intelligence"
  ) as FactionId[];
  const castVotes: { [key: string]: number } =
    agenda && agenda.elect === "For/Against" ? { For: 0, Against: 0 } : {};
  const voteEvents = getAllVotes(currentTurn);
  voteEvents.forEach((voteEvent) => {
    if (
      voteEvent.target &&
      voteEvent.target !== "Abstain" &&
      (voteEvent.votes ?? 0) > 0
    ) {
      let votes = castVotes[voteEvent.target] ?? 0;
      votes += voteEvent.votes ?? 0;
      votes += voteEvent.extraVotes ?? 0;
      if (voteEvent.faction === "Empyrean" && bloodPactUsed) {
        votes += 4;
      }
      if (voteEvent.faction === currentCouncilor) {
        votes += 5;
      }
      if (voteEvent.faction === councilPreservePlayer) {
        votes += 5;
      }
      if (usingPredictive.includes(voteEvent.faction)) {
        votes += 3;
      }
      if (voteEvent.faction === "Argent Flight") {
        votes += numFactions;
      }
      castVotes[voteEvent.target] = votes;
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

function startNextRound(gameId: string) {
  advancePhaseAsync(gameId, true);
}

function AgendaSteps() {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const state = useGameState();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  const agendaNum = state.agendaNum ?? 1;
  const currentAgenda = getActiveAgenda(currentTurn);

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
  return (
    <React.Fragment>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div
          className="flexRow"
          style={{
            width: "90%",
            justifyContent: "space-evenly",
            paddingTop: rem(16),
          }}
        >
          <AgendaTimer agendaNum={1} />
          <AgendaTimer agendaNum={2} />
        </div>
      </div>
      {agendaNum > 2 ? (
        <div
          style={{
            fontSize: rem(40),
            textAlign: "center",
            marginTop: rem(120),
            width: "100%",
          }}
        >
          <FormattedMessage
            id="Gns4AS"
            description="Text showing that the current phase is complete"
            defaultMessage="{phase} Phase Complete"
            values={{ phase: phaseString("AGENDA", intl) }}
          />
        </div>
      ) : (
        <div
          className="flexColumn"
          style={{
            margin: "0",
            padding: "0",
            fontSize: rem(18),
            alignItems: "stretch",
          }}
        >
          {(!currentAgenda && agendaNum === 1) || ancientBurialSites ? (
            <Conditional appSection="PLANETS">
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="4PYolM"
                    description="Text showing that something will occur at the start of a specific phase."
                    defaultMessage="Start of {phase} Phase"
                    values={{ phase: phaseString("AGENDA", intl) }}
                  />
                }
                style={{ width: "100%" }}
              >
                <div
                  className="flexColumn"
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    padding: rem(8),
                    paddingTop: 0,
                  }}
                >
                  <Selector
                    hoverMenuLabel={
                      <FormattedMessage
                        id="Components.Ancient Burial Sites.Title"
                        description="Title of Component: Ancient Burial Sites"
                        defaultMessage="Ancient Burial Sites"
                      />
                    }
                    selectedLabel={
                      <FormattedMessage
                        id="AO8lj8"
                        description="Label for section explaining which player has had their cultural planets exhausted."
                        defaultMessage="Cultural Planets Exhausted"
                      />
                    }
                    options={Object.values(factions)}
                    toggleItem={(factionId, add) => {
                      if (!gameId) {
                        return;
                      }
                      if (add) {
                        playActionCardAsync(
                          gameId,
                          "Ancient Burial Sites",
                          factionId
                        );
                      } else {
                        unplayActionCardAsync(
                          gameId,
                          "Ancient Burial Sites",
                          factionId
                        );
                      }
                    }}
                    selectedItem={ancientBurialSites}
                    viewOnly={viewOnly}
                  />
                  <MawOfWorlds />
                </div>
              </ClientOnlyHoverMenu>
            </Conditional>
          ) : null}
          <div
            className="flexColumn mediumFont"
            style={{ justifyContent: "flex-start", whiteSpace: "nowrap" }}
          >
            <LabeledDiv
              label={<FactionComponents.Name factionId={state.speaker} />}
              color={getColorForFaction(state.speaker)}
            >
              <AgendaSelect />
              <CovertLegislation.RevealOutcomes />
            </LabeledDiv>
          </div>
          <WhenAnAgendaIsRevealed speaker={state.speaker} />
          <AfterAnAgendaIsRevealed />
          <StartVoting />
          <CastVotesSection showRemainingVotes />
        </div>
      )}
    </React.Fragment>
  );
}

function DictatePolicy({}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();
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
        marginTop: rem(12),
      }}
    >
      <ObjectiveRow objective={dictatePolicy} hideScorers />
      {dictatePolicy.type === "SECRET" ? (
        <FactionSelectRadialMenu
          onSelect={(factionId, prevFaction) => {
            if (prevFaction) {
              unscoreObjectiveAsync(gameId, prevFaction, "Dictate Policy");
            }
            if (factionId) {
              scoreObjectiveAsync(gameId, factionId, "Dictate Policy");
            }
          }}
          borderColor={getFactionColor(
            currentDictators[0]
              ? (factions ?? {})[currentDictators[0]]
              : undefined
          )}
          factions={orderedDictators}
          selectedFaction={currentDictators[0] as Optional<FactionId>}
          viewOnly={viewOnly}
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
                width: rem(32),
                height: rem(32),
              }}
            >
              <FactionIcon factionId={factionId} size="100%" />
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--light-bg)",
                  cursor: "pointer",
                  borderRadius: "100%",
                  marginLeft: "60%",
                  marginTop: "60%",
                  boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                  width: rem(20),
                  height: rem(20),
                  color: current ? "green" : "red",
                }}
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  if (current) {
                    unscoreObjectiveAsync(gameId, factionId, "Dictate Policy");
                  } else {
                    scoreObjectiveAsync(gameId, factionId, "Dictate Policy");
                  }
                }}
              >
                {current ? (
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
            </div>
          );
        })
      )}
    </div>
  );
}

export default function AgendaPhase() {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  if (!agendas || !factions) {
    return null;
  }
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  let currentAgenda: Optional<Agenda>;
  const agendaNum = state?.agendaNum ?? 1;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = agendas[activeAgenda];
  }

  const votes = computeVotes(
    currentAgenda,
    currentTurn,
    Object.keys(factions).length
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
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    options,
    intl
  );

  function selectSpeakerTieBreak(tieBreak: Optional<string>) {
    if (!gameId) {
      return;
    }
    speakerTieBreakAsync(gameId, tieBreak ?? "None");
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

  const outcomes = new Set<OutcomeType>();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });

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
    if (!gameId) {
      return;
    }
    startNextRound(gameId);
  }

  return (
    <React.Fragment>
      <div className={`flexColumn ${styles.LeftColumn}`}>
        <AgendaSteps />
      </div>
      <div
        className={`flexColumn ${styles.MiddleColumn}`}
        style={{
          paddingTop: agendaNum > 2 ? rem(160) : undefined,
          gap: numFactions > 7 ? 0 : rem(8),
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
                fontSize: rem(40),
                textAlign: "center",
                marginTop: rem(120),
              }}
            >
              <FormattedMessage
                id="Gns4AS"
                description="Text showing that the current phase is complete"
                defaultMessage="{phase} Phase Complete"
                values={{ phase: phaseString("AGENDA", intl) }}
              />
            </div>
            <DictatePolicy />
            {checksAndBalances &&
            checksAndBalances.resolved &&
            !checksAndBalances.passed &&
            checksAndBalances.activeRound === state?.round ? (
              <div
                style={{
                  fontSize: rem(28),
                }}
              >
                <FormattedMessage
                  id="urcttb"
                  defaultMessage="Ready {num, select, 3 {3} other {all}} planets, then"
                  description="Text explaining how many planets to ready."
                  values={{ num: 3 }}
                />
              </div>
            ) : (
              <div
                style={{
                  fontSize: rem(28),
                }}
              >
                <FormattedMessage
                  id="urcttb"
                  defaultMessage="Ready {num, select, 3 {3} other {all}} planets, then"
                  description="Text explaining how many planets to ready."
                  values={{ num: 1 }}
                />
              </div>
            )}
            <button
              style={{
                marginTop: rem(12),
                fontSize: rem(24),
              }}
              onClick={() => nextPhase()}
              disabled={viewOnly}
            >
              {intl.formatMessage({
                id: "5WXn8l",
                defaultMessage: "Start Next Round",
                description: "Text on a button that will start the next round.",
              })}
            </button>
          </div>
        ) : (
          <React.Fragment>
            <VotingColumn speaker={state.speaker} />
            {/* <div
              className="flexRow"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                paddingBottom: rem(8),
                alignItems: "flex-end",
                maxWidth: rem(400),
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridColumn: "span 4",
                  gridTemplateColumns: "subgrid",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <FormattedMessage
                    id="ifN0t/"
                    defaultMessage="Outcome"
                    description="Header for column listing what voting outcome players have selected."
                  />
                </div>
                <div
                  className="flexColumn"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "subgrid",
                    gridColumn: "span 3",
                  }}
                >
                  <div className="flexRow">
                    <FormattedMessage
                      id="5FWWeX"
                      defaultMessage="Available"
                      description="Header for column listing how many votes players have available."
                    />
                  </div>
                  <div className="flexRow">
                    <FormattedMessage
                      id="VIWZO7"
                      defaultMessage="Votes"
                      description="Header for column listing how many votes players have cast."
                    />
                  </div>
                  <div className="flexRow">
                    <FormattedMessage
                      id="X3VPhD"
                      defaultMessage="Extra"
                      description="Header for column listing how many extra votes players have cast."
                    />
                  </div>
                </div>
              </div>
              {votingOrder.map((faction) => {
                return (
                  <VoteBlock
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
                    style={{ width: "auto", gridColumn: "span 4" }}
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
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                          maxWidth: "92vw",
                          overflowX: "auto",
                          gap: rem(4),
                          padding: rem(8),
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
                                    fontSize: rem(14),
                                    writingMode: "horizontal-tb",
                                  }}
                                  onClick={() => selectSpeakerTieBreak(target)}
                                  disabled={viewOnly}
                                >
                                  {target}
                                </button>
                              );
                            })
                          : allTargets.map((target) => {
                              if (target.id === "Abstain") {
                                return null;
                              }
                              return (
                                <button
                                  key={target.id}
                                  style={{
                                    fontSize: rem(14),
                                    writingMode: "horizontal-tb",
                                  }}
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
                    label="Speaker Tie Break"
                    style={{ gridColumn: "span 4" }}
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
            </div> */}
            <DictatePolicy />
            <LockedButtons
              unlocked={false}
              style={{
                marginTop: rem(12),
                justifyContent: "center",
              }}
              buttons={[
                {
                  text: intl.formatMessage({
                    id: "5WXn8l",
                    defaultMessage: "Start Next Round",
                    description:
                      "Text on a button that will start the next round.",
                  }),
                  style: {
                    fontSize: rem(24),
                  },
                  onClick: nextPhase,
                },
              ]}
              viewOnly={viewOnly}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}
