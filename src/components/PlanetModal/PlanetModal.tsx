import { FormattedMessage } from "react-intl";
import FullScreenModal from "../../modals/FullScreenModal";
import PlanetPanel from "./PlanetPanel";

export default function PlanetModal() {
  return (
    <FullScreenModal
      title={
        <FormattedMessage
          id="1fNqTf"
          description="Planets."
          defaultMessage="Planets"
        />
      }
    >
      <PlanetPanel />
    </FullScreenModal>
  );
}
