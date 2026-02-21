import { CSSProperties } from "react";
import { useViewOnly } from "../../../context/dataHooks";
import { useFactionColor } from "../../../context/factionDataHooks";
import { useDataUpdate } from "../../../util/api/dataUpdate";
import { Events } from "../../../util/api/events";
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
  const dataUpdate = useDataUpdate();
  const factionColor = useFactionColor(factionId);
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
          dataUpdate(Events.UnscoreObjectiveEvent(factionId, objective.id));
        } else {
          dataUpdate(Events.ScoreObjectiveEvent(factionId, objective.id));
        }
      }}
    >
      <div
        className={`${styles.factionIcon} ${
          scoredObjective ? styles.selected : ""
        } ${viewOnly ? styles.viewOnly : ""}`}
        style={
          {
            "--color": factionColor,
          } as ExtendedCSS
        }
      >
        <FactionIcon factionId={factionId} size="100%" />
      </div>
    </div>
  );
}
