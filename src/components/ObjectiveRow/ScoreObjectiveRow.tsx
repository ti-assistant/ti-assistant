import {
  useActionLog,
  useFactions,
  useGameId,
  useObjectives,
} from "../../context/dataHooks";
import { scoreObjectiveAsync, unscoreObjectiveAsync } from "../../dynamic/api";
import { SymbolX } from "../../icons/svgs";
import { getObjectiveScorers } from "../../util/actionLog";
import { getCurrentTurnLogEntries } from "../../util/api/actionLog";
import { hasScoredObjective } from "../../util/api/util";
import { getFactionColor } from "../../util/factions";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import ObjectiveRow from "./ObjectiveRow";

export default function ScoreObjectiveRow({
  objectiveId,
  canScore,
}: {
  objectiveId: ObjectiveId;
  canScore: (faction: Faction) => boolean;
}) {
  const actionLog = useActionLog();
  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();

  const objective = objectives[objectiveId];
  if (!objective) {
    return null;
  }

  const currentScorers = getObjectiveScorers(currentTurn, objectiveId);

  const possibleScorers = new Set([
    ...currentScorers,
    ...Object.values(factions)
      .filter(canScore)
      .map((faction) => faction.id),
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
              unscoreObjectiveAsync(gameId, prevFaction, objectiveId);
              scoreObjectiveAsync(gameId, factionId, objectiveId);
            } else if (prevFaction) {
              unscoreObjectiveAsync(gameId, prevFaction, objectiveId);
            } else if (factionId) {
              scoreObjectiveAsync(gameId, factionId, objectiveId);
            }
          }}
          borderColor={getFactionColor(
            currentScorers[0] ? factions[currentScorers[0]] : undefined
          )}
          selectedFaction={currentScorers[0]}
          factions={orderedScorers}
        />
      ) : (
        orderedScorers.map((factionId) => {
          const current = hasScoredObjective(factionId, objective);
          return (
            <FactionCircle
              key={factionId}
              blur
              borderColor={getFactionColor(factions[factionId])}
              factionId={factionId}
              onClick={() => {
                if (current) {
                  unscoreObjectiveAsync(gameId, factionId, objectiveId);
                } else {
                  scoreObjectiveAsync(gameId, factionId, objectiveId);
                }
              }}
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
