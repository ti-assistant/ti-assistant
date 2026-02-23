import { useActionLog, useViewOnly } from "../../context/dataHooks";
import { useFactionColors } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { useObjective } from "../../context/objectiveDataHooks";
import { SymbolX } from "../../icons/svgs";
import { getObjectiveScorers } from "../../util/actionLog";
import { getCurrentTurnLogEntries } from "../../util/api/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { hasScoredObjective } from "../../util/api/util";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import ObjectiveRow from "./ObjectiveRow";

export default function ScoreObjectiveRow({
  objectiveId,
  canScore,
}: {
  objectiveId: ObjectiveId;
  canScore: (factionId: FactionId) => boolean;
}) {
  const actionLog = useActionLog();
  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const dataUpdate = useDataUpdate();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
  const objective = useObjective(objectiveId);
  const viewOnly = useViewOnly();

  if (!objective) {
    return null;
  }

  const currentScorers = getObjectiveScorers(currentTurn, objectiveId);

  const possibleScorers = new Set([
    ...currentScorers,
    ...mapOrderedFactionIds.filter(canScore),
  ]);

  if (possibleScorers.size === 0) {
    return null;
  }

  const orderedScorers = Array.from(possibleScorers).sort((a, b) => {
    if (a > b) {
      return 1;
    }
    return -1;
  });

  const useRadialMenu = objective.type === "SECRET" && possibleScorers.size > 1;

  return (
    <div className="flexRow">
      <ObjectiveRow objective={objective} hideScorers />
      {useRadialMenu ? (
        <FactionSelectRadialMenu
          onSelect={(factionId, prevFaction) => {
            if (factionId && prevFaction) {
              dataUpdate(
                Events.UnscoreObjectiveEvent(prevFaction, objectiveId),
              );
              dataUpdate(Events.ScoreObjectiveEvent(factionId, objectiveId));
            } else if (prevFaction) {
              dataUpdate(
                Events.UnscoreObjectiveEvent(prevFaction, objectiveId),
              );
            } else if (factionId) {
              dataUpdate(Events.ScoreObjectiveEvent(factionId, objectiveId));
            }
          }}
          borderColor={
            currentScorers[0] ? factionColors[currentScorers[0]] : undefined
          }
          selectedFaction={currentScorers[0]}
          factions={orderedScorers}
          viewOnly={viewOnly}
        />
      ) : (
        orderedScorers.map((factionId) => {
          const current = hasScoredObjective(factionId, objective);
          return (
            <FactionCircle
              key={factionId}
              blur
              borderColor={factionColors[factionId]}
              factionId={factionId}
              onClick={
                viewOnly
                  ? undefined
                  : () => {
                      if (current) {
                        dataUpdate(
                          Events.UnscoreObjectiveEvent(factionId, objectiveId),
                        );
                      } else {
                        dataUpdate(
                          Events.ScoreObjectiveEvent(factionId, objectiveId),
                        );
                      }
                    }
              }
              size={32}
              tag={
                <div
                  className="flexRow largeFont"
                  style={{
                    width: "100%",
                    height: "100%",
                    color: current ? "green" : "red",
                  }}
                >
                  {current ? (
                    <div
                      className="symbol"
                      style={{
                        fontSize: rem(12),
                        lineHeight: rem(12),
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
              tagBorderColor={current ? "green" : "red"}
            />
          );
        })
      )}
    </div>
  );
}
