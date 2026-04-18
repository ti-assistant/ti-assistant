import { CSSProperties, ReactNode } from "react";
import { useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { useViewOnly } from "../../context/dataHooks";
import ObjectiveCard from "../ObjectiveRow/ObjectiveCard";
import styles from "./ObjectiveSelectHoverMenu.module.scss";

interface ObjectiveGridCSSProperties extends CSSProperties {
  "--font-size": string;
  "--num-items": number;
  "--per-column": number;
}

interface ObjectiveSelectHoverMenuProps {
  action: (objectiveId: ObjectiveId) => void;
  fontSize?: string;
  label: ReactNode;
  objectives: Objective[];
  perColumn?: number;
  buttonStyle?: CSSProperties;
}

export default function ObjectiveSelectHoverMenu({
  action,
  fontSize = "1rem",
  label,
  objectives,
  perColumn = 5,
  buttonStyle = {},
}: ObjectiveSelectHoverMenuProps) {
  const viewOnly = useViewOnly();

  const objectiveGridCSSProperties: ObjectiveGridCSSProperties = {
    "--font-size": fontSize,
    "--num-items": objectives.length,
    "--per-column": perColumn,
  };

  const sortedObjectives = [...objectives].sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <ClientOnlyHoverMenu
      label={label}
      renderProps={(closeFn) => (
        <div className={styles.Container} style={objectiveGridCSSProperties}>
          <div
            className={styles.ObjectiveGrid}
            style={objectiveGridCSSProperties}
          >
            {sortedObjectives.map((objective) => {
              return (
                <button
                  key={objective.id}
                  className={`${styles.ObjectiveButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    action(objective.id);
                  }}
                  disabled={viewOnly}
                  style={{ padding: "0.25rem", fontSize }}
                >
                  <ObjectiveCard objectiveId={objective.id} hideZoomButton />
                </button>
              );
            })}
          </div>
        </div>
      )}
      buttonStyle={buttonStyle}
    ></ClientOnlyHoverMenu>
  );
}
