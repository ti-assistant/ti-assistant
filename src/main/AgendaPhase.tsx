import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../AgendaRow";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { InfoRow } from "../InfoRow";
import { LockedButtons } from "../LockedButton";
import { SelectableRow } from "../SelectableRow";
import { AgendaTimer } from "../Timer";
import FactionCircle from "../components/FactionCircle/FactionCircle";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import VoteBlock, {
  getTargets,
  translateOutcome,
} from "../components/VoteBlock/VoteBlock";
import { GameIdContext } from "../context/Context";
import {
  advancePhaseAsync,
  claimPlanetAsync,
  gainRelicAsync,
  hideAgendaAsync,
  hideObjectiveAsync,
  loseRelicAsync,
  playActionCardAsync,
  playPromissoryNoteAsync,
  resolveAgendaAsync,
  revealAgendaAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  selectEligibleOutcomesAsync,
  selectSubAgendaAsync,
  speakerTieBreakAsync,
  startVotingAsync,
  unclaimPlanetAsync,
  unplayActionCardAsync,
  unplayPromissoryNoteAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import {
  getActionCardTargets,
  getActiveAgenda,
  getAllVotes,
  getFactionVotes,
  getGainedRelic,
  getNewOwner,
  getObjectiveScorers,
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
import {
  objectiveTypeString,
  outcomeString,
  phaseString,
} from "../util/strings";
import styles from "./AgendaPhase.module.scss";
import { Selector } from "../components/Selector/Selector";
import MawOfWorlds from "../components/MawOfWorlds/MawOfWorlds";
import ObjectiveSelectHoverMenu from "../components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import {
  useActionLog,
  useAgendas,
  useFactions,
  useGameState,
  useObjectives,
  usePlanets,
  useRelics,
  useStrategyCards,
} from "../context/dataHooks";
import { Optional } from "../util/types/types";

export function computeVotes(
  agenda: Optional<Agenda>,
  currentTurn: ActionLogEntry[],
  numFactions: number
) {
  const currentCouncilor = getActionCardTargets(
    currentTurn,
    "Distinguished Councilor"
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
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const relics = useRelics();
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const intl = useIntl();

  function addRelic(relicId: RelicId, factionId: FactionId) {
    if (!gameId) {
      return;
    }
    gainRelicAsync(gameId, factionId, relicId);
  }
  function removeRelic(relicId: RelicId, factionId: FactionId) {
    if (!gameId) {
      return;
    }
    loseRelicAsync(gameId, factionId, relicId);
  }

  let agendaId = getActiveAgenda(currentTurn);
  if (agendaId === "Covert Legislation") {
    agendaId = getSelectedSubAgenda(currentTurn);
  }

  const agenda = agendaId ? (agendas ?? {})[agendaId] : undefined;

  const votes = computeVotes(agenda, currentTurn, Object.keys(factions).length);
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
  let driveTheDebate: Optional<FactionId>;
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
    if (!gameId) {
      return;
    }
    scoreObjectiveAsync(gameId, factionId, toScore);
  }

  function undoObjective(factionId: FactionId, toRemove: ObjectiveId) {
    if (!gameId) {
      return;
    }
    unscoreObjectiveAsync(gameId, factionId, toRemove);
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
            paddingLeft: "12px",
          }}
        >
          <FormattedMessage
            id="Objectives.Drive the Debate.Title"
            description="Title of Objective: Drive the Debate"
            defaultMessage="Drive the Debate"
          />
          :{" "}
          <FactionCircle
            blur
            borderColor={getFactionColor((factions ?? {})[driveTheDebate])}
            factionId={driveTheDebate}
            onClick={() => {
              if (!gameId || !driveTheDebate) {
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
                      fontSize: "18px",
                      lineHeight: "18px",
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
      const revealedObjective = getRevealedObjectives(currentTurn)[0];
      const revealedObjectiveObj = revealedObjective
        ? objectives[revealedObjective]
        : null;
      agendaSelection =
        revealedObjective && revealedObjectiveObj ? (
          <LabeledDiv
            label={
              <FormattedMessage
                id="IfyaDZ"
                description="A label for revealed objectives."
                defaultMessage="Revealed {type} {count, plural, one {Objective} other {Objectives}}"
                values={{
                  count: 1,
                  type: type,
                }}
              />
            }
          >
            <ObjectiveRow
              objective={revealedObjectiveObj}
              removeObjective={() =>
                hideObjectiveAsync(gameId, revealedObjective)
              }
              hideScorers={true}
            />
          </LabeledDiv>
        ) : (
          <ObjectiveSelectHoverMenu
            action={revealObjectiveAsync}
            label={
              <FormattedMessage
                id="lDBTCO"
                description="Instruction telling the speaker to reveal objectives."
                defaultMessage="Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}"
                values={{
                  count: 1,
                  type: objectiveTypeString(type, intl),
                }}
              />
            }
            objectives={availableObjectives}
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
      const availableFactions = Object.values(factions ?? {}).filter(
        (faction) => {
          return (
            computeVPs(factions ?? {}, faction.id, objectives ?? {}) === minVPs
          );
        }
      );
      const selectedFaction = getNewOwner(currentTurn, selectedOutcome);
      agendaSelection = (
        <Selector
          hoverMenuLabel={
            <FormattedMessage
              id="YoQKZ7"
              description="Text on a hover menu for giving a planet to another faction."
              defaultMessage="Give Planet to Faction"
            />
          }
          options={availableFactions}
          selectedLabel={
            <FormattedMessage
              id="HI2ztT"
              description="Label saying which faction is gaining control of a planet."
              defaultMessage="Faction Gaining Control of Planet"
            />
          }
          selectedItem={selectedFaction}
          toggleItem={(factionId, add) => {
            if (!gameId) {
              return;
            }
            if (add) {
              claimPlanetAsync(gameId, factionId, selectedOutcome as PlanetId);
            } else {
              unclaimPlanetAsync(
                gameId,
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
      const unownedRelics = Object.values(relics ?? {}).filter(
        (relic) => !relic.owner
      );
      agendaSelection = (
        <Selector
          hoverMenuLabel={
            <FormattedMessage
              id="Components.Gain Relic.Title"
              description="Title of Component: Gain Relic"
              defaultMessage="Gain Relic"
            />
          }
          options={unownedRelics}
          renderItem={(itemId) => {
            const relic = (relics ?? {})[itemId];
            if (!relic) {
              return null;
            }
            return (
              <LabeledDiv
                label={
                  <FormattedMessage
                    id="cqWqzv"
                    description="Label for section listing the relic gained."
                    defaultMessage="Gained Relic"
                  />
                }
              >
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
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  let currentAgenda: Optional<Agenda>;
  const agendaNum = state?.agendaNum ?? 1;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = (agendas ?? {})[activeAgenda];
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

  async function completeAgenda() {
    if (!gameId || !currentAgenda) {
      return;
    }
    const target = getSelectedOutcome(selectedTargets, currentTurn);
    if (!target) {
      return;
    }

    resolveAgendaAsync(gameId, currentAgenda.id, target);
  }

  function selectAgenda(agendaId: AgendaId) {
    if (!gameId) {
      return;
    }
    revealAgendaAsync(gameId, agendaId);
  }
  function hideAgendaLocal(agendaId?: AgendaId, veto?: boolean) {
    if (!gameId || !agendaId) {
      return;
    }
    hideAgendaAsync(gameId, agendaId, veto);
  }

  function selectSubAgendaLocal(agendaId: Optional<AgendaId>) {
    if (!gameId) {
      return;
    }
    selectSubAgendaAsync(gameId, agendaId ?? "None");
  }
  function selectEligibleOutcome(outcome: OutcomeType | "None") {
    if (!gameId) {
      return;
    }
    selectEligibleOutcomesAsync(gameId, outcome);
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
  const label = (
    <FormattedMessage
      id="OpsE1E"
      defaultMessage="{num, select, 1 {First} 2 {Second} other {First}} Agenda"
      description="Label specifying which agenda this is."
      values={{ num: agendaNum }}
    />
  );

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
    intl
  );
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

  const vetoText = !(factions ?? {})["Xxcha Kingdom"] ? (
    <FormattedMessage
      id="Components.Veto.Title"
      description="Title of Component: Veto"
      defaultMessage="Veto"
    />
  ) : (
    <FormattedMessage
      id="KzTGw5"
      description="Text on a button for replacing the current agenda."
      defaultMessage="Veto or Quash or Political Favor"
    />
  );

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
            fontSize: "40px",
            textAlign: "center",
            marginTop: "120px",
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
            fontSize: "18px",
            alignItems: "stretch",
          }}
        >
          {(!currentAgenda && agendaNum === 1) || ancientBurialSites ? (
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
                  padding: "8px",
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
                />
                <MawOfWorlds />
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
                        padding: "8px",
                        maxWidth: "70vw",
                        overflowX: "auto",
                        gap: "4px",
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
                              fontSize: "14px",
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
                    hoverMenuLabel={
                      <FormattedMessage
                        id="cKaLW8"
                        description="Text on a hover menu for revealing eligible outcomes."
                        defaultMessage="Reveal Eligible Outcomes"
                      />
                    }
                    selectedLabel={
                      <FormattedMessage
                        id="+BcBcX"
                        description="Label for a section showing the eligible outcomes."
                        defaultMessage="Eligible Outcomes"
                      />
                    }
                    options={Array.from(outcomes).map((outcome) => ({
                      id: outcome,
                      name: outcomeString(outcome, intl),
                    }))}
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
              </LabeledDiv>
            )}
          </div>
          {currentAgenda &&
          !haveVotesBeenCast() &&
          !getSelectedOutcome(selectedTargets, currentTurn) ? (
            <>
              <div className="flexRow"></div>
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="0MawcE"
                    description="Label on hover menu for actions that happen when an agenda is revealed."
                    defaultMessage="When an Agenda is Revealed"
                  />
                }
              >
                <div
                  className="flexColumn"
                  style={{
                    padding: "8px",
                    paddingTop: 0,
                    alignItems: "flex-start",
                  }}
                >
                  <button
                    onClick={() => hideAgendaLocal(currentAgenda?.id, true)}
                  >
                    {vetoText}
                  </button>
                  <LabeledDiv
                    label={
                      <FormattedMessage
                        id="Promissories.Political Secret.Title"
                        description="Title of Promissory: Political Secret"
                        defaultMessage="Political Secret"
                      />
                    }
                  >
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
                              width: "32px",
                              height: "32px",
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
                                boxShadow: `${"1px"} ${"1px"} ${"1px"} black`,
                                width: "20px",
                                height: "20px",
                                color: politicalSecret ? "green" : "red",
                              }}
                              onClick={() => {
                                if (!gameId) {
                                  return;
                                }
                                if (politicalSecret) {
                                  unplayPromissoryNoteAsync(
                                    gameId,
                                    "Political Secret",
                                    faction.id
                                  );
                                } else {
                                  playPromissoryNoteAsync(
                                    gameId,
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
                                    fontSize: "18px",
                                    lineHeight: "18px",
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
              label={
                <FormattedMessage
                  id="++U8Ff"
                  description="Label on hover menu for actions that happen after an agenda is revealed."
                  defaultMessage="After an Agenda is Revealed"
                />
              }
              style={{ minWidth: "100%" }}
            >
              <div
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  padding: "8px",
                  paddingTop: 0,
                }}
              >
                <button
                  className={electionHacked ? "selected" : ""}
                  onClick={() => {
                    if (!gameId) {
                      return;
                    }
                    if (electionHacked) {
                      unplayActionCardAsync(gameId, "Hack Election", "None");
                    } else {
                      playActionCardAsync(gameId, "Hack Election", "None");
                    }
                  }}
                >
                  <FormattedMessage
                    id="Components.Hack Election.Title"
                    description="Title of Component: Hack Election"
                    defaultMessage="Hack Election"
                  />
                </button>
                <Selector
                  hoverMenuLabel={
                    <FormattedMessage
                      id="Components.Assassinate Representative.Title"
                      description="Title of Component: Assassinate Representative"
                      defaultMessage="Assassinate Representative"
                    />
                  }
                  selectedLabel={
                    <FormattedMessage
                      id="c9hO6S"
                      description="Label for section describing the faction that has has Assassinate Representative played on them."
                      defaultMessage="Assassinated Representative"
                    />
                  }
                  options={Object.values(factions)}
                  selectedItem={assassinatedRep}
                  toggleItem={(factionId, add) => {
                    if (!gameId) {
                      return;
                    }
                    if (add) {
                      playActionCardAsync(
                        gameId,
                        "Assassinate Representative",
                        factionId
                      );
                    } else {
                      unplayActionCardAsync(
                        gameId,
                        "Assassinate Representative",
                        factionId
                      );
                    }
                  }}
                />
              </div>
            </ClientOnlyHoverMenu>
          ) : null}
          {currentAgenda ? (
            !state.votingStarted ? (
              <div className="flexRow">
                <button
                  style={{ width: "fit-content" }}
                  onClick={() => {
                    if (!gameId) {
                      return;
                    }
                    startVotingAsync(gameId);
                  }}
                >
                  <FormattedMessage
                    id="gQ0twG"
                    description="Text on a button that will start the voting part of Agenda Phase."
                    defaultMessage="Start Voting"
                  />
                </button>
              </div>
            ) : (
              <FormattedMessage
                id="m5acGq"
                description="Text label telling players to cast votes or abstain."
                defaultMessage="Cast votes (or abstain)"
              />
            )
          ) : null}
          {/* {currentAgenda ? <DistinguishedCouncilor /> : null} */}
          {(votes && Object.keys(votes).length > 0) ||
          getSelectedOutcome(selectedTargets, currentTurn) ? (
            <LabeledDiv
              label={
                <FormattedMessage
                  id="uxvbkq"
                  defaultMessage="Results"
                  description="Label for section describing the results of voting on an agenda."
                />
              }
            >
              {votes && Object.keys(votes).length > 0 ? (
                <div
                  className={flexDirection}
                  style={{
                    gap: "4px",
                    padding: `8px 20px`,
                    alignItems: "flex-start",
                    border: `${"1px"} solid #555`,
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  {Object.entries(votes).map(([target, voteCount]) => {
                    let displayText = translateOutcome(
                      target,
                      localAgenda?.elect,
                      planets,
                      factions,
                      objectives,
                      agendas,
                      strategyCards,
                      intl
                    );
                    return (
                      <div key={target}>
                        {displayText}: {voteCount}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {getSelectedOutcome(selectedTargets, currentTurn) ? (
                currentAgenda && currentAgenda.id === "Covert Legislation" ? (
                  <Selector
                    style={{ maxWidth: "70vw" }}
                    hoverMenuLabel={
                      <FormattedMessage
                        id="Agendas.Covert Legislation.Title"
                        description="Title of Agenda Card: Covert Legislation"
                        defaultMessage="Covert Legislation"
                      />
                    }
                    options={possibleSubAgendas}
                    selectedItem={subAgenda?.id}
                    renderItem={(agendaId) => {
                      const agenda = (agendas ?? {})[agendaId];
                      if (!agenda) {
                        return null;
                      }
                      return (
                        <LabeledDiv
                          label={
                            <FormattedMessage
                              id="Agendas.Covert Legislation.Title"
                              description="Title of Agenda Card: Covert Legislation"
                              defaultMessage="Covert Legislation"
                            />
                          }
                        >
                          <AgendaRow
                            agenda={agenda}
                            removeAgenda={() => selectSubAgendaLocal(undefined)}
                          />
                        </LabeledDiv>
                      );
                    }}
                    toggleItem={(agendaId, add) => {
                      if (add) {
                        selectSubAgendaLocal(agendaId);
                      } else {
                        selectSubAgendaLocal(undefined);
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
                    if (!gameId) {
                      return;
                    }
                    setSubStateOther(
                      gameId,
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
                  style={{ paddingTop: "8px", width: "100%" }}
                >
                  <button onClick={completeAgenda}>
                    <FormattedMessage
                      id="GR4fXA"
                      defaultMessage="Resolve with Outcome: {outcome}"
                      description="Text on a button that resolves the current agenda with a specific outcome."
                      values={{
                        outcome: translateOutcome(
                          getSelectedOutcome(selectedTargets, currentTurn),
                          localAgenda?.elect,
                          planets,
                          factions,
                          objectives,
                          agendas,
                          strategyCards,
                          intl
                        ),
                      }}
                    />
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
                  if (!gameId) {
                    return;
                  }
                  setSubStateOther(
                    gameId,
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
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
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
        marginTop: "12px",
      }}
    >
      <ObjectiveRow objective={dictatePolicy} hideScorers />
      {dictatePolicy.type === "SECRET" ? (
        <FactionSelectRadialMenu
          onSelect={(factionId, prevFaction) => {
            if (!gameId) {
              return;
            }
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
                width: "32px",
                height: "32px",
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
                  boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                  width: "20px",
                  height: "20px",
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
                      fontSize: "18px",
                      lineHeight: "18px",
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
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();

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
          paddingTop: agendaNum > 2 ? "160px" : undefined,
          gap: numFactions > 7 ? 0 : "8px",
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
                fontSize: "40px",
                textAlign: "center",
                marginTop: "120px",
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
                  fontSize: "28px",
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
                  fontSize: "28px",
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
                marginTop: "12px",
                fontSize: "24px",
              }}
              onClick={() => nextPhase()}
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
            <div
              className="flexRow"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                paddingBottom: "8px",
                alignItems: "flex-end",
                maxWidth: "400px",
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
                  {/* <div className="flexRow" style={{ gridColumn: "span 3" }}>
                    Votes
                  </div> */}
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
                {/* <div
                  style={{ textAlign: "center", width: "80px" }}
                >
                  Available Votes
                </div>
                <div
                  style={{ textAlign: "center", width: "40px" }}
                >
                  Cast Votes
                </div>
                <div
                  style={{ textAlign: "center", width: "120px" }}
                >
                  Extra Votes
                </div> */}
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
                          gap: "4px",
                          padding: "8px",
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
                                    fontSize: "14px",
                                    writingMode: "horizontal-tb",
                                  }}
                                  onClick={() => selectSpeakerTieBreak(target)}
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
                                    fontSize: "14px",
                                    writingMode: "horizontal-tb",
                                  }}
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
                    label="Speaker Tie Break"
                    style={{ gridColumn: "span 4" }}
                  >
                    <SelectableRow
                      itemId={tieBreak}
                      removeItem={() => selectSpeakerTieBreak(undefined)}
                    >
                      {tieBreak}
                    </SelectableRow>
                  </LabeledDiv>
                )
              ) : null}
            </div>
            <DictatePolicy />
            <LockedButtons
              unlocked={false}
              style={{
                marginTop: "12px",
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
                    fontSize: "24px",
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
