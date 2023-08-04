import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { StartingComponents } from "../FactionCard";
import { ObjectiveRow } from "../ObjectiveRow";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels, validateMapString } from "../util/util";
import { NumberedItem } from "../NumberedItem";
import { Faction } from "../util/api/factions";
import { SelectableRow } from "../SelectableRow";
import { LockedButtons } from "../LockedButton";
import { useGameData } from "../data/GameData";
import { hideObjective, revealObjective } from "../util/api/revealObjective";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { RevealObjectiveData } from "../util/model/revealObjective";
import { advancePhase } from "../util/api/advancePhase";
import { changeOption } from "../util/api/changeOption";

export function startFirstRound(gameid: string) {
  advancePhase(gameid);
}

function factionTechChoicesComplete(
  factions: Record<string, Faction>
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
  factions: Record<string, Faction>
): boolean {
  if (!factions["Council Keleres"]) {
    return true;
  }
  return (factions["Council Keleres"].startswith.planets ?? []).length !== 0;
}

export function setupPhaseComplete(
  factions: Record<string, Faction>,
  revealedObjectives: string[]
): boolean {
  return (
    factionSubFactionChoicesComplete(factions) &&
    factionTechChoicesComplete(factions) &&
    revealedObjectives.length === 2
  );
}

function getSetupPhaseText(
  factions: Record<string, Faction>,
  revealedObjectives: string[]
) {
  const textSections = [];
  if (
    !factionSubFactionChoicesComplete(factions) ||
    !factionTechChoicesComplete(factions)
  ) {
    textSections.push("Select all faction choices");
  }
  if (revealedObjectives.length !== 2) {
    textSections.push("Reveal 2 objectives");
  }
  return textSections.join(" and ");
}

export function setMapString(gameid: string | undefined, mapString: string) {
  if (!gameid || !validateMapString(mapString)) {
    return;
  }
  changeOption(gameid, "map-string", mapString);
}

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "factions",
    "objectives",
    "options",
    "state",
  ]);

  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const options = gameData.options;
  const state = gameData.state;

  const mapStringRef = useRef<HTMLInputElement>(null);

  const mapString = options["map-string"];

  useEffect(() => {
    if (!mapStringRef.current || !mapString) {
      return;
    }
    mapStringRef.current.value = mapString ?? "";
  }, [mapString]);

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);

  const orderedFactions = useMemo(() => {
    if (!factions) {
      return [];
    }
    return Object.entries(factions).sort((a, b) => {
      return a[1].order - b[1].order;
    });
  }, [factions]);

  const availableObjectives = useMemo(() => {
    return Object.values(objectives ?? {}).filter((objective) => {
      return (
        objective.type === "STAGE ONE" &&
        !revealedObjectives.includes(objective.name)
      );
    });
  }, [revealedObjectives, objectives]);

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  return (
    <div
      className="flexColumn"
      style={{
        alignItems: "flex-start",
        width: "100%",
        justifyContent: "flex-start",
        marginTop: responsivePixels(100),
      }}
    >
      <ol
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          padding: 0,
          fontSize: responsivePixels(24),
          margin: `0 ${responsivePixels(20)} 0 ${responsivePixels(40)}`,
        }}
      >
        <NumberedItem>
          Build the galaxy
          <div
            className="flexRow mediumFont"
            style={{
              fontFamily: "Myriad Pro",
              paddingTop: responsivePixels(8),
              alignItems: "flex-start",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            Map String:
            <input
              ref={mapStringRef}
              type="textbox"
              className="smallFont"
              style={{ width: `min(75vw, ${responsivePixels(700)})` }}
              onChange={(event) =>
                setMapString(gameid, event.currentTarget.value)
              }
            ></input>
          </div>
        </NumberedItem>
        <NumberedItem>Shuffle decks</NumberedItem>
        <NumberedItem>
          <LabeledDiv label="Gather starting components">
            <div
              className="flexRow"
              style={{
                position: "relative",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
              }}
            >
              {orderedFactions.map(([name, faction]) => {
                return (
                  <ClientOnlyHoverMenu
                    key={name}
                    label={getFactionName(faction)}
                    borderColor={getFactionColor(faction)}
                  >
                    <div
                      style={{
                        padding: `0 ${responsivePixels(8)} ${responsivePixels(
                          8
                        )} ${responsivePixels(8)}`,
                      }}
                    >
                      <StartingComponents faction={faction} />
                    </div>
                  </ClientOnlyHoverMenu>
                );
              })}
            </div>
          </LabeledDiv>
        </NumberedItem>
        <NumberedItem>Draw 2 secret objectives and keep one</NumberedItem>
        <NumberedItem>Re-shuffle secret objectives</NumberedItem>
        <NumberedItem>
          <LabeledDiv
            label={getFactionName(speaker)}
            color={getFactionColor(speaker)}
          >
            Draw 5 stage one objectives and reveal 2
            {revealedObjectives.length > 0 ? (
              <LabeledDiv label="Revealed Objectives">
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {revealedObjectives.map((objectiveName) => {
                    const objective = (objectives ?? {})[objectiveName];
                    if (!objective) {
                      return (
                        <SelectableRow
                          key={objectiveName}
                          itemName={objectiveName}
                          removeItem={() => {
                            if (!gameid) {
                              return;
                            }
                            hideObjective(gameid, objectiveName);
                          }}
                        >
                          {objectiveName}
                        </SelectableRow>
                      );
                    }
                    return (
                      <ObjectiveRow
                        key={objectiveName}
                        objective={objective}
                        removeObjective={() => {
                          if (!gameid) {
                            return;
                          }
                          hideObjective(gameid, objectiveName);
                        }}
                        viewing={true}
                      />
                    );
                  })}
                </div>
              </LabeledDiv>
            ) : null}
            {revealedObjectives.length < 2 ? (
              <ClientOnlyHoverMenu
                label="Reveal Objective"
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
                            key={objective.name}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() => {
                              if (!gameid) {
                                return;
                              }
                              closeFn();
                              revealObjective(gameid, objective.name);
                            }}
                          >
                            {objective.name}
                          </button>
                        );
                      })}
                  </div>
                )}
              ></ClientOnlyHoverMenu>
            ) : null}
          </LabeledDiv>
        </NumberedItem>
        <NumberedItem>
          <LabeledDiv
            label={getFactionName(speaker)}
            color={getFactionColor(speaker)}
          >
            Draw 5 stage two objectives
          </LabeledDiv>
        </NumberedItem>
      </ol>
      <div className="centered flexColumn" style={{ width: "100%" }}>
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
  );
}
