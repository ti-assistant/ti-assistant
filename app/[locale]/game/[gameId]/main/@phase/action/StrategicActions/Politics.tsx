import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { useSpeaker } from "../../../../../../../../src/context/stateDataHooks";
import { setSpeakerAsync } from "../../../../../../../../src/dynamic/api";
import { getNewSpeakerEventFromLog } from "../../../../../../../../src/util/api/data";
import { getColorForFaction } from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";

const Politics = {
  Primary,
};

export default Politics;

function Primary() {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const newSpeakerEvent = getNewSpeakerEventFromLog(currentTurn);
  const speaker = useSpeaker();
  const viewOnly = useViewOnly();

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
            ? getColorForFaction(newSpeakerEvent.newSpeaker)
            : undefined
        }
        onSelect={(factionId, _) => {
          if (factionId) {
            setSpeakerAsync(gameId, factionId);
          } else {
            if (!newSpeakerEvent?.prevSpeaker) {
              return;
            }
            setSpeakerAsync(gameId, newSpeakerEvent.prevSpeaker);
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
