import { FormattedMessage, useIntl } from "react-intl";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import {
  useCurrentTurn,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useRound } from "../../../../../../src/context/stateDataHooks";
import {
  hideObjectiveAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import {
  getLogEntries,
  getScoredObjectives,
} from "../../../../../../src/util/actionLog";
import { objectiveTypeString } from "../../../../../../src/util/strings";
import { rem } from "../../../../../../src/util/util";

export default function FactionStatusPhase({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const intl = useIntl();
  const objectives = useObjectives();
  const planets = usePlanets();
  const round = useRound();
  const viewOnly = useViewOnly();

  const type: ObjectiveType = round < 4 ? "STAGE ONE" : "STAGE TWO";
  const availableObjectives = Object.values(objectives).filter((objective) => {
    return (
      objective.selected &&
      (objective.type === "STAGE ONE" || objective.type === "STAGE TWO") &&
      !(objective.scorers ?? []).includes(factionId)
    );
  });
  const canScoreObjectives = Object.values(planets ?? {}).reduce(
    (canScore, planet) => {
      if (factionId === "Clan of Saar") {
        return true;
      }
      let planetFaction = factionId;
      if (factionId === "Council Keleres") {
        planetFaction = faction?.startswith?.faction ?? planetFaction;
      }
      if (
        planet.home &&
        planet.faction === planetFaction &&
        planet.owner !== factionId
      ) {
        return false;
      }
      return canScore;
    },
    true
  );
  const secrets = Object.values(objectives).filter((objective) => {
    return (
      objective.type === "SECRET" &&
      !(objective.scorers ?? []).includes(factionId) &&
      objective.phase === "STATUS"
    );
  });
  const scoredObjectives = getScoredObjectives(currentTurn, factionId);
  const scoredPublics = scoredObjectives.filter((objectiveId) => {
    const objective = objectives[objectiveId];
    if (!objective) {
      return false;
    }
    return objective.type === "STAGE ONE" || objective.type === "STAGE TWO";
  });
  const scoredSecrets = scoredObjectives.filter((objectiveId) => {
    const objective = objectives[objectiveId];
    return objective?.type === "SECRET";
  });
  const revealableObjectives = Object.values(objectives).filter((objective) => {
    return objective.type === type && !objective.selected;
  });
  const revealedObjective = getLogEntries<RevealObjectiveData>(
    currentTurn,
    "REVEAL_OBJECTIVE"
  ).map((logEntry) => logEntry.data.event.objective)[0];
  const revealedObjectiveObj = revealedObjective
    ? objectives[revealedObjective]
    : undefined;
  return (
    <>
      <div
        className="flexColumn"
        style={{
          padding: `0 ${rem(8)}`,
          flexWrap: "wrap",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        {scoredPublics[0] ? (
          <LabeledDiv
            label="SCORED PUBLIC"
            innerStyle={{ whiteSpace: "nowrap" }}
            blur
          >
            <SelectableRow
              itemId={scoredPublics[0]}
              removeItem={(objectiveId) =>
                unscoreObjectiveAsync(gameId, factionId, objectiveId)
              }
              viewOnly={viewOnly}
            >
              {scoredPublics[0]}
            </SelectableRow>
          </LabeledDiv>
        ) : !canScoreObjectives ? (
          <FormattedMessage
            id="CoNZle"
            description="Message telling a player that they cannot score public objectives."
            defaultMessage="Cannot score Public Objectives"
          />
        ) : (
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="73882v"
                description="Message telling a player to score a public objective."
                defaultMessage="Score Public Objective"
              />
            }
          >
            <div
              className="flexColumn"
              style={{
                whiteSpace: "nowrap",
                padding: rem(8),
                gap: rem(4),
                alignItems: "stretch",
              }}
            >
              {availableObjectives.length === 0 ? (
                <FormattedMessage
                  id="HQ3wv9"
                  description="Message telling a player that they have scored all objectives."
                  defaultMessage="No unscored Public Objectives"
                />
              ) : null}
              {availableObjectives.map((objective) => {
                return (
                  <button
                    key={objective.id}
                    onClick={() =>
                      scoreObjectiveAsync(gameId, factionId, objective.id)
                    }
                    disabled={viewOnly}
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
            innerStyle={{ whiteSpace: "nowrap" }}
            blur
          >
            <SelectableRow
              itemId={scoredSecrets[0]}
              removeItem={(objectiveId) =>
                unscoreObjectiveAsync(gameId, factionId, objectiveId)
              }
              viewOnly={viewOnly}
            >
              {scoredSecrets[0]}
            </SelectableRow>
          </LabeledDiv>
        ) : (
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="zlpl9F"
                description="Message telling a player to score a secret objective."
                defaultMessage="Score Secret Objective"
              />
            }
          >
            <div
              className="flexRow"
              style={{
                display: "grid",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(9, auto)",
                justifyContent: "flex-start",
                whiteSpace: "nowrap",
                padding: rem(8),
                gap: rem(4),
                alignItems: "stretch",
                maxWidth: "85vw",
                overflowX: "auto",
              }}
            >
              {secrets.map((objective) => {
                return (
                  <button
                    key={objective.id}
                    style={{ writingMode: "horizontal-tb" }}
                    onClick={() =>
                      scoreObjectiveAsync(gameId, factionId, objective.id)
                    }
                    disabled={viewOnly}
                  >
                    {objective.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        )}
      </div>
      <LabeledDiv
        label={
          <FormattedMessage
            id="5R8kPv"
            description="Label for a section for actions by the speaker."
            defaultMessage="Speaker Actions"
          />
        }
      >
        {revealedObjectiveObj ? (
          <LabeledDiv
            label={
              <FormattedMessage
                id="IfyaDZ"
                description="A label for revealed objectives."
                defaultMessage="Revealed {type} {count, plural, one {Objective} other {Objectives}}"
                values={{
                  count: 1,
                  type:
                    round > 3
                      ? objectiveTypeString("STAGE TWO", intl)
                      : objectiveTypeString("STAGE ONE", intl),
                }}
              />
            }
            blur
          >
            <ObjectiveRow
              objective={revealedObjectiveObj}
              removeObjective={() =>
                hideObjectiveAsync(gameId, revealedObjectiveObj.id)
              }
              viewing={true}
            />
          </LabeledDiv>
        ) : (
          <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
            <ClientOnlyHoverMenu
              label={
                <FormattedMessage
                  id="lDBTCO"
                  description="Instruction telling the speaker to reveal objectives."
                  defaultMessage="Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}"
                  values={{
                    count: 1,
                    type:
                      round > 3
                        ? objectiveTypeString("STAGE TWO", intl)
                        : objectiveTypeString("STAGE ONE", intl),
                  }}
                />
              }
              style={{ maxHeight: rem(400) }}
            >
              <div
                className="flexRow"
                style={{
                  maxWidth: "85vw",
                  gap: rem(4),
                  whiteSpace: "nowrap",
                  padding: rem(8),
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
                      objective.type === (round > 3 ? "STAGE TWO" : "STAGE ONE")
                    );
                  })
                  .map((objective) => {
                    return (
                      <button
                        key={objective.id}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() =>
                          revealObjectiveAsync(gameId, objective.id)
                        }
                        disabled={viewOnly}
                      >
                        {objective.name}
                      </button>
                    );
                  })}
              </div>
            </ClientOnlyHoverMenu>
          </div>
        )}
      </LabeledDiv>
    </>
  );
}
