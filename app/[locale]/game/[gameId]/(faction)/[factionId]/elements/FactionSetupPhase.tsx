import { FormattedMessage } from "react-intl";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import StartingComponents from "../../../../../../../src/components/StartingComponents/StartingComponents";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import { ClientOnlyHoverMenu } from "../../../../../../../src/HoverMenu";
import { getLogEntries } from "../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../src/util/util";

export default function FactionSetupPhase({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();

  const revealedObjectiveIds = getLogEntries<RevealObjectiveData>(
    currentTurn,
    "REVEAL_OBJECTIVE",
  ).map((logEntry) => logEntry.data.event.objective);
  const availableObjectives = Object.values(objectives).filter((objective) => {
    return (
      objective.type === "STAGE ONE" &&
      !revealedObjectiveIds.includes(objective.id)
    );
  });

  return (
    <>
      <LabeledDiv
        label={
          <FormattedMessage
            id="rlGbdz"
            description="A label for a section of components that a faction starts with."
            defaultMessage="Starting Components"
          />
        }
      >
        <div style={{ width: "100%", fontSize: rem(16), whiteSpace: "nowrap" }}>
          <StartingComponents factionId={factionId} />
        </div>
      </LabeledDiv>
      <LabeledDiv
        label={
          <FormattedMessage
            id="5R8kPv"
            description="Label for a section for actions by the speaker."
            defaultMessage="Speaker Actions"
          />
        }
      >
        {revealedObjectiveIds.length > 0 ? (
          <LabeledDiv
            label={
              <FormattedMessage
                id="RBlsAq"
                description="A label for the stage I objectives that have been revealed"
                defaultMessage="Revealed stage I {count, plural, one {objective} other {objectives}}"
                values={{ count: revealedObjectiveIds.length }}
              />
            }
          >
            {revealedObjectiveIds.map((objectiveId) => {
              const objectiveObj = objectives[objectiveId];
              if (!objectiveObj) {
                return null;
              }
              return (
                <ObjectiveRow
                  key={objectiveId}
                  objective={objectiveObj}
                  removeObjective={() =>
                    dataUpdate(Events.HideObjectiveEvent(objectiveId))
                  }
                  viewing={true}
                />
              );
            })}
          </LabeledDiv>
        ) : null}
        {revealedObjectiveIds.length < 2 ? (
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="6L07nG"
                description="Text telling the user to reveal an objective."
                defaultMessage="Reveal Objective"
              />
            }
          >
            <div
              className="flexRow"
              style={{
                display: "grid",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(10, auto)",
                justifyContent: "flex-start",
                whiteSpace: "nowrap",
                padding: rem(8),
                gap: rem(4),
                alignItems: "stretch",
                maxWidth: "85vw",
                overflowX: "auto",
              }}
            >
              {Object.values(availableObjectives)
                .filter((objective) => {
                  return objective.type === "STAGE ONE";
                })
                .map((objective) => {
                  return (
                    <button
                      key={objective.id}
                      style={{ writingMode: "horizontal-tb" }}
                      onClick={() =>
                        dataUpdate(Events.RevealObjectiveEvent(objective.id))
                      }
                      disabled={viewOnly}
                    >
                      {objective.name}
                    </button>
                  );
                })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
      </LabeledDiv>
    </>
  );
}
