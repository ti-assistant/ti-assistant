import { FormattedMessage, useIntl } from "react-intl";
import FactionCircle from "../../../../../../../../src/components/FactionCircle/FactionCircle";
import FormattedDescription from "../../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "../../../../../../../../src/components/Selector/Selector";
import {
  useActionLog,
  useAgendas,
  useGameId,
  useOptions,
  usePlanets,
  useRelics,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../../../src/context/objectiveDataHooks";
import { SymbolX } from "../../../../../../../../src/icons/svgs";
import { InfoRow } from "../../../../../../../../src/InfoRow";
import { SelectableRow } from "../../../../../../../../src/SelectableRow";
import {
  getActiveAgenda,
  getGainedRelic,
  getNewOwner,
  getRevealedObjectives,
  getScoredObjectives,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../../../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../../../src/util/api/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import {
  computeVPs,
  getFactionColor,
} from "../../../../../../../../src/util/factions";
import { objectiveTypeString } from "../../../../../../../../src/util/strings";
import {
  ActionLog,
  Optional,
} from "../../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../../src/util/util";
import { computeVotes } from "../AgendaPhase";

function canScoreObjective(
  factionId: FactionId,
  objectiveId: ObjectiveId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  currentTurn: ActionLog,
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
  const dataUpdate = useDataUpdate();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const viewOnly = useViewOnly();

  const intl = useIntl();

  let agendaId = getActiveAgenda(currentTurn);
  if (agendaId === "Covert Legislation") {
    agendaId = getSelectedSubAgenda(currentTurn);
  }

  const agenda = agendaId ? (agendas ?? {})[agendaId] : undefined;

  const representativeGovernmentPassed =
    agendas["Representative Government"]?.passed;

  const votes = computeVotes(
    agenda,
    currentTurn,
    Object.keys(factions).length,
    !!representativeGovernmentPassed,
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

  const driveObj = (objectives ?? {})["Drive the Debate"];
  if (driveTheDebate && driveObj && !options.hide?.includes("OBJECTIVES")) {
    let canScoreDrive = canScoreObjective(
      driveTheDebate,
      "Drive the Debate",
      objectives ?? {},
      currentTurn,
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
              if (hasScoredDrive) {
                dataUpdate(
                  Events.UnscoreObjectiveEvent(
                    driveTheDebate,
                    "Drive the Debate",
                  ),
                );
              } else {
                dataUpdate(
                  Events.ScoreObjectiveEvent(
                    driveTheDebate,
                    "Drive the Debate",
                  ),
                );
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
      if (options.hide?.includes("OBJECTIVES")) {
        break;
      }
      const type = selectedOutcome === "For" ? "STAGE ONE" : "STAGE TWO";
      const availableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          return objective.type === type && !objective.selected;
        },
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
                dataUpdate(Events.HideObjectiveEvent(revealedObjective))
              }
              hideScorers={true}
            />
          </LabeledDiv>
        ) : (
          <ObjectiveSelectHoverMenu
            action={(objectiveId) =>
              dataUpdate(Events.RevealObjectiveEvent(objectiveId))
            }
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
      if (options.hide?.includes("PLANETS")) {
        break;
      }
      const minVPs = Object.values(factions ?? {}).reduce((minVal, faction) => {
        return Math.min(
          minVal,
          computeVPs(factions ?? {}, faction.id, objectives ?? {}),
        );
      }, Number.MAX_SAFE_INTEGER);
      const availableFactions = Object.values(factions ?? {}).filter(
        (faction) => {
          return (
            computeVPs(factions ?? {}, faction.id, objectives ?? {}) === minVPs
          );
        },
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
              dataUpdate(
                Events.ClaimPlanetEvent(factionId, selectedOutcome as PlanetId),
              );
            } else {
              dataUpdate(
                Events.UnclaimPlanetEvent(
                  factionId,
                  selectedOutcome as PlanetId,
                ),
              );
            }
          }}
          viewOnly={viewOnly}
        />
      );
      break;
    }
    case "Minister of Antiques": {
      if (options.hide?.includes("RELICS")) {
        break;
      }
      const gainedRelic = getGainedRelic(currentTurn);
      const unownedRelics = Object.values(relics ?? {}).filter(
        (relic) => !relic.owner || relic.id === gainedRelic,
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
                      dataUpdate(
                        Events.LoseRelicEvent(
                          selectedOutcome as FactionId,
                          relic.id,
                        ),
                      );
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
              dataUpdate(
                Events.GainRelicEvent(selectedOutcome as FactionId, relicId),
              );
            } else {
              dataUpdate(
                Events.LoseRelicEvent(selectedOutcome as FactionId, relicId),
              );
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
