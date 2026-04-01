import { useObjective } from "../../context/objectiveDataHooks";
import InfoModal from "../../InfoModal";
import { SelectableRow } from "../../SelectableRow";
import { em } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";

export default function ObjectiveCard({
  objectiveId,
  removeObjective,
  hideZoomButton,
}: {
  objectiveId: ObjectiveId;
  removeObjective?: (objectiveId: ObjectiveId) => void;
  hideZoomButton?: boolean;
}) {
  const objective = useObjective(objectiveId);

  if (!objective) {
    return null;
  }

  return (
    <SelectableRow itemId={objective.id} removeItem={removeObjective}>
      <div style={{ fontSize: "1em" }}>
        <div
          className="flexRow"
          style={{
            fontFamily: "Slider",
            // fontWeight: "bold",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {objective.name}
          {hideZoomButton ? null : (
            <InfoModal title={objective.name} style={{ marginLeft: em(8) }}>
              <FormattedDescription description={objective.description} />
            </InfoModal>
          )}
        </div>
        <div
          style={{
            fontSize: "0.75em",
            color: "var(--muted-text)",
            lineHeight: "1.25em",
            whiteSpace: "normal",
            textAlign: "left",
          }}
        >
          <FormattedDescription description={objective.description} />
        </div>
      </div>
    </SelectableRow>
  );
}
