import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import {
  useSpeaker,
  useTyrant,
} from "../../../../../../../../src/context/stateDataHooks";
import {
  setSpeakerAsync,
  setTyrantAsync,
} from "../../../../../../../../src/dynamic/api";
import {
  getNewSpeakerEventFromLog,
  getNewTyrantEventFromLog,
} from "../../../../../../../../src/util/api/data";
import { getColorForFaction } from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";

const Tyrannus = {
  Primary,
};

export default Tyrannus;

function Primary() {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const newSpeakerEvent = getNewSpeakerEventFromLog(currentTurn);
  const newTyrantEvent = getNewTyrantEventFromLog(currentTurn);
  const speaker = useSpeaker();
  const tyrant = useTyrant();
  const viewOnly = useViewOnly();

  const invalidTyrants: FactionId[] = [speaker];
  if (newTyrantEvent?.prevTyrant) {
    invalidTyrants.push(newTyrantEvent.prevTyrant);
  } else if (!newTyrantEvent && tyrant) {
    invalidTyrants.push(tyrant);
  }
  return (
    <div
      className="flexColumn largeFont"
      style={{
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
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
            newSpeakerEvent?.prevSpeaker
              ? newSpeakerEvent.prevSpeaker
              : speaker,
          ]}
          selectedFaction={newSpeakerEvent?.newSpeaker}
          size={52}
          viewOnly={viewOnly}
        />
      </div>
      <div
        className="flexRow largeFont"
        style={{
          justifyContent: "flex-start",
          paddingLeft: rem(24),
          width: "100%",
        }}
      >
        <FormattedMessage
          id="4QPpwL"
          description="Label for a selector selecting a new tyrant."
          defaultMessage="New Tyrant"
        />
        :
        <FactionSelectRadialMenu
          borderColor={
            newTyrantEvent?.newTyrant
              ? getColorForFaction(newTyrantEvent.newTyrant)
              : undefined
          }
          onSelect={(factionId, _) => {
            if (factionId) {
              setTyrantAsync(gameId, factionId);
            } else {
              if (!newTyrantEvent) {
                return;
              }
              setTyrantAsync(gameId, newTyrantEvent.prevTyrant);
            }
          }}
          factions={mapOrderedFactionIds}
          invalidFactions={invalidTyrants}
          selectedFaction={newTyrantEvent?.newTyrant}
          size={52}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
}
