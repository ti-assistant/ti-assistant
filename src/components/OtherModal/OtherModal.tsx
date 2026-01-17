import { FormattedMessage } from "react-intl";
import FullScreenModal from "../../modals/FullScreenModal";
import OtherPanel from "./OtherPanel";

export default function OtherModalContent() {
  return (
    <FullScreenModal
      title={
        <FormattedMessage
          id="sgqLYB"
          defaultMessage="Other"
          description="Text on a button used to select a non-listed value"
        />
      }
    >
      <OtherPanel />
    </FullScreenModal>
  );
}
