import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useFactionColors } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { useSpeaker } from "../../../../../../../../src/context/stateDataHooks";
import { getNewSpeakerEventFromLog } from "../../../../../../../../src/util/api/data";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../../src/util/util";

const Politics = {
  Primary,
};

export default Politics;

function Primary() {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const newSpeakerEvent = getNewSpeakerEventFromLog(currentTurn);
  const speaker = useSpeaker();
  const viewOnly = useViewOnly();
  const factionColors = useFactionColors();

  return (
    <div
      className="flexRow largeFont"
      style={{
        justifyContent: "flex-start",
        paddingLeft: rem(24),
        width: "100%",
      }}
    >
      <FormattedMessage
        id="pTiYPm"
        description="Label for a selector selecting a new speaker."
        defaultMessage="New Speaker"
      />
      :
      <FactionSelectRadialMenu
        borderColor={
          newSpeakerEvent?.newSpeaker
            ? factionColors[newSpeakerEvent.newSpeaker]
            : undefined
        }
        onSelect={(factionId, _) => {
          if (factionId) {
            dataUpdate(Events.SetSpeakerEvent(factionId));
          } else {
            if (!newSpeakerEvent?.prevSpeaker) {
              return;
            }
            dataUpdate(Events.SetSpeakerEvent(newSpeakerEvent.prevSpeaker));
          }
        }}
        factions={mapOrderedFactionIds}
        invalidFactions={[
          newSpeakerEvent?.prevSpeaker ? newSpeakerEvent.prevSpeaker : speaker,
        ]}
        selectedFaction={newSpeakerEvent?.newSpeaker}
        size={52}
        viewOnly={viewOnly}
      />
    </div>
  );
}
