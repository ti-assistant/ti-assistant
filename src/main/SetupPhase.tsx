import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef } from "react";
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
import { responsivePixels, validateMapString } from "../util/util";

export function startFirstRound(gameid: string) {
  advancePhaseAsync(gameid);
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
  revealedObjectives: string[]
) {
  const textSections = [];
  if (
    !factionSubFactionChoicesComplete(factions) ||
    !factionTechChoicesComplete(factions)
  ) {
    textSections.push("Select all Faction Choices");
  }
  if (revealedObjectives.length !== 2) {
    textSections.push("Reveal 2 Objectives");
  }
  return textSections.join(" and ");
}

export function setMapString(gameid: string | undefined, mapString: string) {
  if (!gameid || !validateMapString(mapString)) {
    return;
  }
  changeOptionAsync(gameid, "map-string", mapString);
}

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const state = useContext(StateContext);

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

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  return (
    <>
      <ol
        className="flexColumn largeFont"
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          boxSizing: "border-box",
          height: "100svh",
          margin: 0,
          width: "min-content",
          paddingLeft: responsivePixels(20),
          whiteSpace: "normal",
        }}
      >
        <div className="flexRow" style={{ width: responsivePixels(268) }}>
          Setup
        </div>
        <NumberedItem>
          Build the Galaxy
          <div
            className="flexColumn mediumFont"
            style={{
              fontFamily: "Myriad Pro",
              paddingTop: responsivePixels(8),
              alignItems: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            Map String:
            <input
              ref={mapStringRef}
              type="textbox"
              className="smallFont"
              style={{
                width: `min(75vw, ${responsivePixels(268)})`,
              }}
              onChange={(event) =>
                setMapString(gameid, event.currentTarget.value)
              }
            ></input>
          </div>
        </NumberedItem>
        <NumberedItem>Shuffle decks</NumberedItem>
        <NumberedItem>Gather Starting Components</NumberedItem>
        <NumberedItem>Draw 2 secret objectives and keep 1</NumberedItem>
        <NumberedItem>Re-shuffle secret objectives</NumberedItem>
        <NumberedItem>Draw 5 stage I objectives</NumberedItem>
        <NumberedItem>Draw 5 stage II objectives</NumberedItem>
        <NumberedItem>
          <div className="flexColumn">
            {revealedObjectives.length > 0 ? (
              <LabeledDiv label="Revealed Stage I Objectives">
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {revealedObjectives.map((objectiveId) => {
                    const objective = (objectives ?? {})[objectiveId];
                    if (!objective) {
                      return (
                        <SelectableRow
                          key={objectiveId}
                          itemId={objectiveId}
                          removeItem={() => {
                            if (!gameid) {
                              return;
                            }
                            hideObjectiveAsync(gameid, objectiveId);
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
                          if (!gameid) {
                            return;
                          }
                          hideObjectiveAsync(gameid, objectiveId);
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
                label={getFactionName((factions ?? {})[state?.speaker ?? ""])}
                color={getFactionColor((factions ?? {})[state?.speaker ?? ""])}
                style={{ width: "100%" }}
              >
                <ClientOnlyHoverMenu
                  label="Reveal 2 stage I objectives"
                  renderProps={(closeFn) => (
                    <div
                      className="flexRow"
                      style={{
                        padding: `${responsivePixels(8)}`,
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: "repeat(5, auto)",
                        justifyContent: "flex-start",
                        gap: `${responsivePixels(4)}`,
                        maxWidth: "80vw",
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
                              onClick={() => {
                                if (!gameid) {
                                  return;
                                }
                                closeFn();
                                revealObjectiveAsync(gameid, objective.id);
                              }}
                            >
                              {objective.name}
                            </button>
                          );
                        })}
                    </div>
                  )}
                ></ClientOnlyHoverMenu>
              </LabeledDiv>
            ) : null}
          </div>
        </NumberedItem>
      </ol>
      <div className="flexColumn" style={{ height: "100dvh" }}>
        <div
          className="flexColumn"
          style={{
            alignItems: "center",
            marginTop: responsivePixels(40),
            boxSizing: "border-box",
            margin: 0,
            whiteSpace: "nowrap",
            gap: responsivePixels(8),
          }}
        >
          <div className="flexColumn" style={{ width: "100%" }}>
            Starting Components
          </div>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: responsivePixels(8),
              paddingTop: responsivePixels(6),
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
                      paddingTop: `${responsivePixels(2)}`,
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
                {getSetupPhaseText(factions ?? {}, revealedObjectives)}
              </div>
            ) : null}
            <LockedButtons
              unlocked={setupPhaseComplete(factions ?? {}, revealedObjectives)}
              buttons={[
                {
                  text: "Start Game",
                  onClick: () => {
                    if (!gameid) {
                      return;
                    }
                    startFirstRound(gameid);
                  },
                  style: { fontSize: responsivePixels(40) },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
