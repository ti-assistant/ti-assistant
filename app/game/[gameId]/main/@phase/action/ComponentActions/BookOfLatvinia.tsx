import { FormattedMessage } from "react-intl";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import { getLogEntries } from "../../../../../../../src/util/actionLog";

export default function BookOfLatvinia({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const bookEntry = getLogEntries<PlayComponentData>(
    currentTurn,
    "PLAY_COMPONENT"
  )[0];

  if (bookEntry && bookEntry.data.event.prevFaction) {
    return (
      <div className="flexRow" style={{ width: "100%" }}>
        <FormattedMessage
          id="pTiYPm"
          description="Label for a selector selecting a new speaker."
          defaultMessage="New Speaker"
        />
        : <FactionComponents.Name factionId={factionId} />
      </div>
    );
  }

  return (
    <div className="flexRow" style={{ width: "100%" }}>
      +1 VP
    </div>
  );
}
