import { FormattedMessage, useIntl } from "react-intl";
import FactionCircle from "../../../../../../../src/components/FactionCircle/FactionCircle";
import FormattedDescription from "../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useActionLog,
  useAgendas,
  useGameId,
  usePlanets,
  useRelics,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import {
  claimPlanetAsync,
  gainRelicAsync,
  hideObjectiveAsync,
  loseRelicAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unclaimPlanetAsync,
  unscoreObjectiveAsync,
} from "../../../../../../../src/dynamic/api";
import { SymbolX } from "../../../../../../../src/icons/svgs";
import { InfoRow } from "../../../../../../../src/InfoRow";
import { SelectableRow } from "../../../../../../../src/SelectableRow";
import {
  getActiveAgenda,
  getGainedRelic,
  getNewOwner,
  getRevealedObjectives,
  getScoredObjectives,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../../src/util/api/actionLog";
import {
  computeVPs,
  getFactionColor,
} from "../../../../../../../src/util/factions";
import { objectiveTypeString } from "../../../../../../../src/util/strings";
import { ActionLog, Optional } from "../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../src/util/util";
import { computeVotes } from "../AgendaPhase";

function canScoreObjective(
  factionId: FactionId,
  objectiveId: ObjectiveId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  currentTurn: ActionLog
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

function getSelectedOutcome(selectedTargets: string[], currentTurn: ActionLog) {
  if (selectedTargets.length === 1) {
    return selectedTargets[0];
  }
  return getSpeakerTieBreak(currentTurn);
}

export default function AgendaDetails({
  hideObjectives,
}: {
  hideObjectives?: boolean;
}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const planets = usePlanets();
  const relics = useRelics();
  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const viewOnly = useViewOnly();

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
            paddingLeft: rem(12),
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
          viewOnly={viewOnly}
        />
      );
      break;
    }
    case "Minister of Antiques": {
      const gainedRelic = getGainedRelic(currentTurn);
      const unownedRelics = Object.values(relics ?? {}).filter(
        (relic) => !relic.owner || relic.id === gainedRelic
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
                    viewOnly={viewOnly}
                  >
                    <InfoRow
                      infoTitle={relic.name}
                      infoContent={
                        <FormattedDescription description={relic.description} />
                      }
                    >
                      {relic.name}
                    </InfoRow>
                  </SelectableRow>
                  {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
                </div>
              </LabeledDiv>
            );
          }}
          selectedItem={gainedRelic}
          toggleItem={(relicId, add) => {
            if (add) {
              addRelic(relicId, selectedOutcome as FactionId);
            } else {
              removeRelic(relicId, selectedOutcome as FactionId);
            }
          }}
          viewOnly={viewOnly}
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
      {hideObjectives ? null : driveSection}
    </>
  );
}
