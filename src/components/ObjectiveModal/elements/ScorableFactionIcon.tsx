import { CSSProperties } from "react";
import { useGameId, useViewOnly } from "../../../context/dataHooks";
import {
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { getColorForFaction } from "../../../util/factions";
import FactionIcon from "../../FactionIcon/FactionIcon";
import styles from "../ObjectivePanel.module.scss";

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

export default function ScorableFactionIcon({
  factionId,
  inGrid,
  objective,
}: {
  factionId: FactionId;
  inGrid?: boolean;
  objective: Objective;
}) {
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  if (!objective) {
    return null;
  }

  const scoredObjective = objective.scorers?.includes(factionId);
  return (
    <div
      className={`flexRow ${styles.selected} ${
        inGrid ? styles.factionGridIconWrapper : styles.factionIconWrapper
      } ${viewOnly ? styles.viewOnly : ""}`}
      onClick={() => {
        if (viewOnly) {
          return;
        }
        if (scoredObjective) {
          unscoreObjectiveAsync(gameId, factionId, objective.id);
        } else {
          scoreObjectiveAsync(gameId, factionId, objective.id);
        }
      }}
    >
      <div
        className={`${styles.factionIcon} ${
          scoredObjective ? styles.selected : ""
        } ${viewOnly ? styles.viewOnly : ""}`}
        style={
          {
            "--color": getColorForFaction(factionId),
          } as ExtendedCSS
        }
      >
        <FactionIcon factionId={factionId} size="100%" />
      </div>
    </div>
  );
}
