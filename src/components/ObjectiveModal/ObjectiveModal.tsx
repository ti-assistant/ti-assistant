import { FormattedMessage } from "react-intl";
import FullScreenModal from "../../modals/FullScreenModal";
import ObjectivePanel from "./ObjectivePanel";
import { rem } from "../../util/util";
import styles from "./ObjectivePanel.module.scss";

export default function ObjectiveModalContent() {
  return (
    <FullScreenModal
      title={
        <FormattedMessage
          id="5Bl4Ek"
          description="Cards that define how to score victory points."
          defaultMessage="Objectives"
        />
      }
      bodyClass={styles.ObjectiveModalBody}
    >
      <ObjectivePanel asModal />
    </FullScreenModal>
  );
}
