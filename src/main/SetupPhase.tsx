import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LockedButtons } from "../LockedButton";
import { NumberedItem } from "../NumberedItem";
import { SelectableRow } from "../SelectableRow";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import StartingComponents from "../components/StartingComponents/StartingComponents";
import {
  ActionLogContext,
  FactionContext,
  GameIdContext,
  ObjectiveContext,
  OptionContext,
  StateContext,
} from "../context/Context";
import {
  advancePhaseAsync,
  changeOptionAsync,
  hideObjectiveAsync,
  revealObjectiveAsync,
} from "../dynamic/api";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { getFactionColor, getFactionName } from "../util/factions";
import styles from "./SetupPhase.module.scss";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { objectiveTypeString } from "../util/strings";
import ObjectiveSelectHoverMenu from "../components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";

export function startFirstRound(gameId: string) {
  advancePhaseAsync(gameId);
}

function factionTechChoicesComplete(
  factions: Partial<Record<FactionId, Faction>>
): boolean {
  let complete = true;
  Object.values(factions).forEach((faction) => {
    if (faction.startswith.choice) {
      const numSelected = (faction.startswith.techs ?? []).length;
      const numRequired = faction.startswith.choice.select;
      const numAvailable = faction.startswith.choice.options.length;
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

export function setMapString(gameId: string | undefined, mapString: string) {
  if (!gameId) {
    return;
  }

  changeOptionAsync(gameId, "map-string", mapString);
}

export default function SetupPhase() {
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const state = useContext(StateContext);

  const intl = useIntl();

  const mapStringRef = useRef<HTMLInputElement>(null);

  const mapString = options["map-string"];

  useEffect(() => {
    if (!mapStringRef.current || !mapString) {
      return;
    }
    mapStringRef.current.value = mapString ?? "";
  }, [mapString]);

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);

  const orderedFactions = useMemo(() => {
    if (!factions) {
      return [];
    }
    return Object.values(factions).sort((a, b) => {
      return a.order - b.order;
    });
  }, [factions]);

  const availableObjectives = useMemo(() => {
    return Object.values(objectives ?? {}).filter((objective) => {
      return (
        objective.type === "STAGE ONE" &&
        !revealedObjectives.includes(objective.id)
      );
    });
  }, [revealedObjectives, objectives]);

  return (
    <>
      <ol className={`flexColumn largeFont ${styles.LeftColumn}`}>
        <div className="flexRow" style={{ width: "100%" }}>
          <FormattedMessage
            id="9DZz2w"
            description="Text identifying that this is the setup step."
            defaultMessage="Setup Game"
          />
        </div>
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
              paddingTop: "8px",
              alignItems: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            <input
              ref={mapStringRef}
              type="textbox"
              className="smallFont"
              style={{
                width: `min(75vw, 268px)`,
              }}
              pattern={"([0-9]{1,4}((A|B)[0-5]?)?($|\\s))*"}
              placeholder={intl.formatMessage({
                id: "UJSVtn",
                description:
                  "Label for a textbox used to specify the map string.",
                defaultMessage: "Map String",
              })}
              onBlur={(event) =>
                setMapString(gameId, event.currentTarget.value)
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
                gap: "8px",
                paddingTop: "6px",
              }}
            >
              {Object.values(orderedFactions).map((faction) => {
                return (
                  <LabeledDiv
                    key={faction.id}
                    label={getFactionName(faction)}
                    color={getFactionColor(faction)}
                  >
                    <div
                      className="flexColumn"
                      style={{
                        paddingTop: `${"2px"}`,
                        alignItems: "flex-start",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <StartingComponents factionId={faction.id} />
                    </div>
                  </LabeledDiv>
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
                    defaultMessage="Revealed stage I objectives"
                  />
                }
              >
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {revealedObjectives.map((objectiveId) => {
                    const objective = (objectives ?? {})[objectiveId];
                    if (!objective) {
                      return (
                        <SelectableRow
                          key={objectiveId}
                          itemId={objectiveId}
                          removeItem={() => {
                            if (!gameId) {
                              return;
                            }
                            hideObjectiveAsync(gameId, objectiveId);
                          }}
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
                          if (!gameId) {
                            return;
                          }
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
              <LabeledDiv
                label={getFactionName(factions[state.speaker])}
                color={getFactionColor(factions[state.speaker])}
                style={{ width: "100%" }}
              >
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
              </LabeledDiv>
            ) : null}
          </div>
        </NumberedItem>

        <div className={`flexColumn ${styles.Embedded}`}>
          {!setupPhaseComplete(factions ?? {}, revealedObjectives) ? (
            <div
              style={{
                color: "firebrick",
                fontFamily: "Myriad Pro",
                fontWeight: "bold",
              }}
            >
              {getSetupPhaseText(factions ?? {}, revealedObjectives, intl)}
            </div>
          ) : null}
          <LockedButtons
            unlocked={setupPhaseComplete(factions ?? {}, revealedObjectives)}
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
                  startFirstRound(gameId);
                },
                style: { fontSize: "40px" },
              },
            ]}
          />
        </div>
      </ol>
      <div className={`flexColumn ${styles.MainColumn}`}>
        <div
          className="flexColumn"
          style={{
            alignItems: "center",
            marginTop: "40px",
            boxSizing: "border-box",
            margin: 0,
            whiteSpace: "nowrap",
            gap: "8px",
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
              gap: "8px",
              paddingTop: "6px",
            }}
          >
            {Object.values(orderedFactions).map((faction) => {
              return (
                <LabeledDiv
                  key={faction.id}
                  label={getFactionName(faction)}
                  color={getFactionColor(faction)}
                >
                  <div
                    className="flexColumn"
                    style={{
                      paddingTop: `${"2px"}`,
                      alignItems: "flex-start",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <StartingComponents factionId={faction.id} />
                  </div>
                </LabeledDiv>
              );
            })}
          </div>
          <div className="flexColumn">
            {!setupPhaseComplete(factions ?? {}, revealedObjectives) ? (
              <div
                style={{
                  color: "firebrick",
                  fontFamily: "Myriad Pro",
                  fontWeight: "bold",
                }}
              >
                {getSetupPhaseText(factions ?? {}, revealedObjectives, intl)}
              </div>
            ) : null}
            <LockedButtons
              unlocked={setupPhaseComplete(factions ?? {}, revealedObjectives)}
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
                    startFirstRound(gameId);
                  },
                  style: { fontSize: "40px" },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
