import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useFactionColors } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import {
  useSpeaker,
  useTyrant,
} from "../../../../../../../../src/context/stateDataHooks";
import {
  getNewSpeakerEventFromLog,
  getNewTyrantEventFromLog,
} from "../../../../../../../../src/util/api/data";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../../src/util/util";

const Tyrannus = {
  Primary,
};

export default Tyrannus;

function Primary() {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
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
              ? factionColors[newTyrantEvent.newTyrant]
              : undefined
          }
          onSelect={(factionId, _) => {
            if (factionId) {
              dataUpdate(Events.SetTyrantEvent(factionId));
            } else {
              if (!newTyrantEvent) {
                return;
              }
              dataUpdate(Events.SetTyrantEvent(newTyrantEvent.prevTyrant));
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
