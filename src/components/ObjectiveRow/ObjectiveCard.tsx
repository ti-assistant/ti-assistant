import { use } from "react";
import { useObjective } from "../../context/objectiveDataHooks";
import InfoModal from "../../InfoModal";
import { SelectableRow } from "../../SelectableRow";
import { em } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import { ModalContext } from "../../context/contexts";
import { ModalContent } from "../Modal/Modal";
import styles from "../../InfoModal.module.scss";

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
  const { openModal } = use(ModalContext);

  if (!objective) {
    return null;
  }

  return (
    <SelectableRow
      itemId={objective.id}
      removeItem={removeObjective}
      style={{ alignItems: "flex-start" }}
    >
      <div
        style={{
          fontSize: "1em",
          width: "100%",
          cursor: hideZoomButton ? undefined : "zoom-in",
        }}
        onClick={
          hideZoomButton
            ? undefined
            : () => {
                openModal(
                  <ModalContent title={objective.name}>
                    <div className={styles.infoContent}>
                      <FormattedDescription
                        description={objective.description}
                      />
                    </div>
                  </ModalContent>,
                );
              }
        }
      >
        <div
          className="flexRow"
          style={{
            fontFamily: "var(--main-font)",

            // fontWeight: "bold",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {objective.name}
          {/* {hideZoomButton ? null : (
            <InfoModal title={objective.name} style={{ marginLeft: em(8) }}>
              <FormattedDescription description={objective.description} />
            </InfoModal>
          )} */}
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
