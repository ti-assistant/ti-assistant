import { useEffect, useMemo, useRef } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { LockedButtons } from "../../../../../../src/LockedButton";
import { NumberedItem } from "../../../../../../src/NumberedItem";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import FactionDiv from "../../../../../../src/components/LabeledDiv/FactionDiv";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import StartingComponents from "../../../../../../src/components/StartingComponents/StartingComponents";
import {
  useGameId,
  useLogEntries,
  useOptions,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useFactions,
  useNumFactions,
} from "../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useSpeaker } from "../../../../../../src/context/stateDataHooks";
import {
  advancePhaseAsync,
  changeOptionAsync,
  hideObjectiveAsync,
  revealObjectiveAsync,
} from "../../../../../../src/dynamic/api";
import { processMapString } from "../../../../../../src/util/map";
import { objectiveTypeString } from "../../../../../../src/util/strings";
import { rem } from "../../../../../../src/util/util";
import styles from "./SetupPhase.module.scss";

function factionTechChoicesComplete(
  factions: Partial<Record<FactionId, Faction>>
): boolean {
  let complete = true;
  Object.values(factions).forEach((faction) => {
    if (faction.startswith.choice) {
      const numSelected = (faction.startswith.techs ?? []).length;
      let numRequired = faction.startswith.choice.select;
      let numAvailable = faction.startswith.choice.options.length;
      if (faction.id === "Deepwrought Scholarate") {
        numRequired = 2;
        numAvailable = 2;
      }
      if (numSelected !== numRequired && numSelected !== numAvailable) {
        complete = false;
      }
    }
  });
  return complete;
}

function factionSubFactionChoicesComplete(
  factions: Partial<Record<FactionId, Faction>>
): boolean {
  if (!factions["Council Keleres"]) {
    return true;
  }
  return (factions["Council Keleres"].startswith.planets ?? []).length !== 0;
}

export function setupPhaseComplete(
  factions: Partial<Record<FactionId, Faction>>,
  revealedObjectives: string[]
): boolean {
  return (
    factionSubFactionChoicesComplete(factions) &&
    factionTechChoicesComplete(factions) &&
    revealedObjectives.length === 2
  );
}

function getSetupPhaseText(
  factions: Partial<Record<FactionId, Faction>>,
  revealedObjectives: string[],
  intl: IntlShape
) {
  const textSections = [];
  if (
    !factionSubFactionChoicesComplete(factions) ||
    !factionTechChoicesComplete(factions)
  ) {
    textSections.push(
      intl.formatMessage({
        id: "xu0llf",
        defaultMessage: "Select all Faction Choices",
        description:
          "Error message telling the user to select all faction choices.",
      })
    );
  }
  if (revealedObjectives.length !== 2) {
    textSections.push(
      intl.formatMessage(
        {
          id: "lDBTCO",
          description: "Instruction telling the speaker to reveal objectives.",
          defaultMessage:
            "Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}",
        },
        {
          count: 2,
          type: objectiveTypeString("STAGE ONE", intl),
        }
      )
    );
  }
  return textSections.join(
    ` ${intl
      .formatMessage({
        id: "+WkrHz",
        defaultMessage: "AND",
        description: "Text between two fields linking them together.",
      })
      .toLowerCase()} `
  );
}

function setMapString(
  gameId: string,
  mapString: string,
  mapStyle: MapStyle,
  numFactions: number
) {
  changeOptionAsync(gameId, "map-string", mapString);
  if (mapString === "") {
    changeOptionAsync(gameId, "processed-map-string", "");
    return;
  }

  changeOptionAsync(
    gameId,
    "processed-map-string",
    processMapString(mapString, mapStyle, numFactions)
  );
}

export default function SetupPhase() {
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const viewOnly = useViewOnly();

  const orderedFactionIds = useOrderedFactionIds("SPEAKER");
  const numFactions = useNumFactions();

  const revealedObjectives = useLogEntries<RevealObjectiveData>(
    "REVEAL_OBJECTIVE"
  ).map((entry) => entry.data.event.objective);
  const speaker = useSpeaker();

  const intl = useIntl();

  const mapStringRef = useRef<HTMLInputElement>(null);

  const userMapString = options["map-string"];

  useEffect(() => {
    if (!mapStringRef.current || !userMapString) {
      return;
    }
    mapStringRef.current.value = userMapString ?? "";
  }, [userMapString]);

  const availableObjectives = useMemo(() => {
    return Object.values(objectives).filter((objective) => {
      return (
        objective.type === "STAGE ONE" &&
        !revealedObjectives.includes(objective.id)
      );
    });
  }, [revealedObjectives, objectives]);

  return (
    <>
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
                fontFamily: "Myriad Pro",
                paddingTop: rem(8),
                alignItems: "flex-start",
                whiteSpace: "nowrap",
              }}
            >
              <input
                ref={mapStringRef}
                type="textbox"
                className="smallFont"
                style={{
                  width: `min(75vw, ${rem(268)})`,
                }}
                pattern={"((([0-9]{1,4}((A|B)[0-5]?)?)|(P[1-8])|(-1))($|\\s))+"}
                placeholder={
                  userMapString !== ""
                    ? userMapString
                    : intl.formatMessage({
                        id: "UJSVtn",
                        description:
                          "Label for a textbox used to specify the map string.",
                        defaultMessage: "Map String",
                      })
                }
                onBlur={(event) =>
                  setMapString(
                    gameId,
                    event.currentTarget.value,
                    options["map-style"],
                    numFactions
                  )
                }
              ></input>
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
                    <StartingComponentDiv
                      key={factionId}
                      factionId={factionId}
                    />
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
                              hideObjectiveAsync(gameId, objectiveId);
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
                            hideObjectiveAsync(gameId, objectiveId);
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
                    action={revealObjectiveAsync}
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
                      }
                    )}
                  />
                </FactionDiv>
              ) : null}
            </div>
          </NumberedItem>

          <div className={`flexColumn ${styles.Embedded}`}>
            {!setupPhaseComplete(factions, revealedObjectives) ? (
              <div
                style={{
                  color: "firebrick",
                  fontFamily: "Myriad Pro",
                  fontWeight: "bold",
                }}
              >
                {getSetupPhaseText(factions, revealedObjectives, intl)}
              </div>
            ) : null}
            <LockedButtons
              unlocked={setupPhaseComplete(factions, revealedObjectives)}
              buttons={[
                {
                  text: intl.formatMessage({
                    id: "lYD2yu",
                    description: "Text on a button that will start a game.",
                    defaultMessage: "Start Game",
                  }),
                  onClick: () => {
                    if (!gameId) {
                      return;
                    }
                    advancePhaseAsync(gameId);
                  },
                  style: { fontSize: rem(40) },
                },
              ]}
              viewOnly={viewOnly}
            />
          </div>
        </ol>
      </div>
      <div className={`flexColumn ${styles.MainColumn}`}>
        <div
          className="flexColumn"
          style={{
            alignItems: "center",
            marginTop: rem(40),
            boxSizing: "border-box",
            margin: 0,
            whiteSpace: "nowrap",
            gap: rem(8),
          }}
        >
          <div className="flexColumn" style={{ width: "100%" }}>
            <FormattedMessage
              id="rlGbdz"
              description="A label for a section of components that a faction starts with."
              defaultMessage="Starting Components"
            />
          </div>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
          <div className="flexColumn">
            {!setupPhaseComplete(factions, revealedObjectives) ? (
              <div
                style={{
                  color: "firebrick",
                  fontFamily: "Myriad Pro",
                  fontWeight: "bold",
                }}
              >
                {getSetupPhaseText(factions, revealedObjectives, intl)}
              </div>
            ) : null}
            <LockedButtons
              unlocked={setupPhaseComplete(factions, revealedObjectives)}
              buttons={[
                {
                  text: intl.formatMessage({
                    id: "lYD2yu",
                    description: "Text on a button that will start a game.",
                    defaultMessage: "Start Game",
                  }),
                  onClick: () => {
                    if (!gameId) {
                      return;
                    }
                    advancePhaseAsync(gameId);
                  },
                  style: { fontSize: rem(40) },
                },
              ]}
              viewOnly={viewOnly}
            />
          </div>
        </div>
      </div>
    </>
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
