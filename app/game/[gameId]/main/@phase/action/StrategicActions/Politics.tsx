import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { useSpeaker } from "../../../../../../../src/context/stateDataHooks";
import { setSpeakerAsync } from "../../../../../../../src/dynamic/api";
import { getNewSpeakerEventFromLog } from "../../../../../../../src/util/api/data";
import { getFactionColor } from "../../../../../../../src/util/factions";
import { rem } from "../../../../../../../src/util/util";

const Politics = {
  Primary,
};

export default Politics;

function Primary() {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const newSpeakerEvent = getNewSpeakerEventFromLog(currentTurn);
  const speaker = useSpeaker();
  const viewOnly = useViewOnly();

  const selectedSpeaker = newSpeakerEvent?.newSpeaker
    ? factions[newSpeakerEvent.newSpeaker]
    : undefined;
  const mapOrderedFactionIds = Object.values(factions)
    .sort((a, b) => a.mapPosition - b.mapPosition)
    .map((faction) => faction.id);

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
          selectedSpeaker ? getFactionColor(selectedSpeaker) : undefined
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
          selectedSpeaker
            ? (newSpeakerEvent?.prevSpeaker as FactionId)
            : speaker,
        ]}
        selectedFaction={selectedSpeaker?.id}
        size={52}
        viewOnly={viewOnly}
      />
    </div>
  );
}
