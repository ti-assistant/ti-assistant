import { useMemo } from "react";
import { FormattedMessage, IntlShape } from "react-intl";
import Conditional from "../../../../../../../src/components/Conditional/Conditional";
import FactionDiv from "../../../../../../../src/components/LabeledDiv/FactionDiv";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import StartingComponents from "../../../../../../../src/components/StartingComponents/StartingComponents";
import {
  useGameId,
  useLogEntries,
  useOptions,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import { useSpeaker } from "../../../../../../../src/context/stateDataHooks";
import { NumberedItem } from "../../../../../../../src/NumberedItem";
import { SelectableRow } from "../../../../../../../src/SelectableRow";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import { objectiveTypeString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";
import FinishPhaseButton from "./FinishPhaseButton";
import MapStringInput from "./MapStringInput";
import styles from "./SetupPhase.module.scss";

export default function SetupSteps({ intl }: { intl: IntlShape }) {
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const options = useOptions();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();
  const orderedFactionIds = useOrderedFactionIds("SPEAKER");
  const revealedObjectives = useLogEntries<RevealObjectiveData>(
    "REVEAL_OBJECTIVE",
  ).map((entry) => entry.data.event.objective);
  const speaker = useSpeaker();

  const availableObjectives = useMemo(() => {
    return Object.values(objectives).filter((objective) => {
      return (
        objective.type === "STAGE ONE" &&
        !revealedObjectives.includes(objective.id)
      );
    });
  }, [revealedObjectives, objectives]);

  return (
    <div className={`largeFont ${styles.LeftColumn}`}>
      <div className="flexRow" style={{ width: "100%" }}>
        <FormattedMessage
          id="9DZz2w"
          description="Text identifying that this is the setup step."
          defaultMessage="Setup Game"
        />
      </div>
      <ol className={`flexColumn largeFont ${styles.SetupList}`}>
        <NumberedItem>
          <FormattedMessage
            id="+mUg6N"
            description="A step in the setup phase: Build the Galaxy."
            defaultMessage="Build the Galaxy"
          />
          <div
            className="flexColumn mediumFont"
            style={{
              fontFamily: "Source Sans",
              paddingTop: rem(8),
              alignItems: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            <MapStringInput />
          </div>
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="OcsTaL"
            description="A step in the setup phase: Shuffle decks."
            defaultMessage="Shuffle decks"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="LD7frS"
            description="A step in the setup phase: Gather starting components."
            defaultMessage="Gather Starting Components"
          />
          <div className={styles.Embedded}>
            <div
              style={{
                display: "grid",
                gridAutoFlow: "row",
                width: "100%",
                gridTemplateColumns: "1fr",
                gap: rem(8),
                paddingTop: rem(6),
              }}
            >
              {Object.values(orderedFactionIds).map((factionId) => {
                return (
                  <StartingComponentDiv key={factionId} factionId={factionId} />
                );
              })}
            </div>
          </div>
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="CKpFBk"
            description="A step in the setup phase: Draw 2 secret objectives and keep 1."
            defaultMessage="Draw 2 secret objectives and keep 1"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="dmwygw"
            description="A step in the setup phase: Re-shuffle secret objectives."
            defaultMessage="Re-shuffle secret objectives"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="p4V2Yv"
            description="A step in the setup phase: Draw 5 stage I objectives."
            defaultMessage="Draw 5 stage I objectives"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="ChW/ih"
            description="A step in the setup phase: Draw 5 stage I objectives."
            defaultMessage="Draw 5 stage II objectives"
          />
        </NumberedItem>
        <NumberedItem>
          <Conditional
            appSection="OBJECTIVES"
            fallback={
              <FormattedMessage
                id="lDBTCO"
                description="Instruction telling the speaker to reveal objectives."
                defaultMessage="Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}"
                values={{
                  count: 2,
                  type: objectiveTypeString("STAGE ONE", intl),
                }}
              />
            }
          >
            <div className="flexColumn">
              {revealedObjectives.length > 0 ? (
                <LabeledDiv
                  label={
                    <FormattedMessage
                      id="RBlsAq"
                      description="A label for the stage I objectives that have been revealed"
                      defaultMessage="Revealed stage I {count, plural, one {objective} other {objectives}}"
                      values={{ count: revealedObjectives.length }}
                    />
                  }
                >
                  <div className="flexColumn" style={{ alignItems: "stretch" }}>
                    {revealedObjectives.map((objectiveId) => {
                      const objective = objectives[objectiveId];
                      if (!objective) {
                        return (
                          <SelectableRow
                            key={objectiveId}
                            itemId={objectiveId}
                            removeItem={() => {
                              dataUpdate(
                                Events.HideObjectiveEvent(objectiveId),
                              );
                            }}
                            viewOnly={viewOnly}
                          >
                            {objectiveId}
                          </SelectableRow>
                        );
                      }
                      return (
                        <ObjectiveRow
                          key={objectiveId}
                          objective={objective}
                          removeObjective={() => {
                            dataUpdate(Events.HideObjectiveEvent(objectiveId));
                          }}
                          viewing={true}
                        />
                      );
                    })}
                  </div>
                </LabeledDiv>
              ) : null}
              {revealedObjectives.length < 2 ? (
                <FactionDiv factionId={speaker}>
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
                          count: 2,
                          type: objectiveTypeString("STAGE ONE", intl),
                        }}
                      />
                    }
                    objectives={Object.values(availableObjectives).filter(
                      (objective) => {
                        return objective.type === "STAGE ONE";
                      },
                    )}
                  />
                </FactionDiv>
              ) : null}
            </div>
          </Conditional>
        </NumberedItem>
        {options.expansions.includes("TWILIGHTS FALL") ? (
          <NumberedItem>
            <FormattedMessage
              id="fHRZ5N"
              description="A step in the setup phase: The inaugural splice."
              defaultMessage="Inaugural Splice"
            />
          </NumberedItem>
        ) : null}
        <FinishPhaseButton embedded />
      </ol>
    </div>
  );
}

function StartingComponentDiv({ factionId }: { factionId: FactionId }) {
  return (
    <FactionDiv factionId={factionId}>
      <div
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          height: "100%",
          width: "100%",
        }}
      >
        <StartingComponents factionId={factionId} showFactionIcon />
      </div>
    </FactionDiv>
  );
}
