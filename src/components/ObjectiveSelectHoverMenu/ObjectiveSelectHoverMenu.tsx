import { CSSProperties, ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { useGameId, useViewOnly } from "../../context/dataHooks";
import styles from "./ObjectiveSelectHoverMenu.module.scss";

interface ObjectiveGridCSSProperties extends CSSProperties {
  "--font-size": string;
  "--num-items": number;
  "--per-column": number;
}

interface ObjectiveSelectHoverMenuProps {
  action: (gameId: string, objectiveId: ObjectiveId) => void;
  fontSize?: string;
  label: ReactNode;
  objectives: Objective[];
  perColumn?: number;
}

export default function ObjectiveSelectHoverMenu({
  action,
  fontSize = "unset",
  label,
  objectives,
  perColumn = 5,
}: ObjectiveSelectHoverMenuProps) {
  const intl = useIntl();
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const [description, setDescription] = useState("Hover to see full text.");

  const objectiveGridCSSProperties: ObjectiveGridCSSProperties = {
    "--font-size": fontSize,
    "--num-items": objectives.length,
    "--per-column": perColumn,
  };

  return (
    <ClientOnlyHoverMenu
      label={label}
      renderProps={(closeFn) => (
        <>
          <div
            className={styles.ObjectiveGrid}
            style={objectiveGridCSSProperties}
            onMouseLeave={() =>
              setDescription(
                intl.formatMessage({
                  id: "49U8Wl",
                  description:
                    "Text telling the user that they can hover over objectives to see the full text.",
                  defaultMessage: "Hover to see full text.",
                })
              )
            }
          >
            {objectives.map((objective) => {
              return (
                <button
                  key={objective.id}
                  className={styles.ObjectiveButton}
                  onClick={() => {
                    closeFn();
                    action(gameId, objective.id);
                  }}
                  onMouseEnter={() => setDescription(objective.description)}
                  disabled={viewOnly}
                >
                  {objective.name}
                </button>
              );
            })}
          </div>
        </>
      )}
      postContent={
        <div className={styles.Description} style={{ fontSize: fontSize }}>
          {description}
        </div>
      }
    ></ClientOnlyHoverMenu>
  );
}
