import { useIntl } from "react-intl";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { objectiveTypeString } from "../../../util/strings";
import { rem } from "../../../util/util";
import ObjectiveColumn from "./ObjectiveColumn";

function getObjectiveColor(type: ObjectiveType) {
  switch (type) {
    case "STAGE ONE":
      return "orange";
    case "STAGE TWO":
      return "royalblue";
  }
}

export default function ObjectiveGridSection({
  type,
  selectedObjectives,
  startColumn,
}: {
  type: ObjectiveType;
  selectedObjectives: Objective[];
  startColumn: number;
}) {
  const intl = useIntl();
  const orderedFactionIds = useOrderedFactionIds("ALLIANCE");

  const numRows = orderedFactionIds.length + 1;

  const numColumns = selectedObjectives.length;

  const color = getObjectiveColor(type);

  return (
    <>
      <div
        className="flexRow"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: "100%",
          gridColumn: `${startColumn} / ${numColumns + startColumn}`,
          gridRow: `2 / ${numRows + 1}`,
          borderLeft: `${"1px"} solid ${color}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            marginBottom: rem(-68),
            transform: "rotate(270deg)",
            transformOrigin: "left center",
            backgroundColor: "var(--background-color)",
            padding: `0 ${rem(4)}`,
            color,
            whiteSpace: "nowrap",
          }}
        >
          {objectiveTypeString(type, intl)}
        </div>
      </div>
      {selectedObjectives.map((objective) => {
        return (
          <ObjectiveColumn
            key={objective.id}
            objective={objective}
            orderedFactionIds={orderedFactionIds}
          />
        );
      })}
    </>
  );
}
