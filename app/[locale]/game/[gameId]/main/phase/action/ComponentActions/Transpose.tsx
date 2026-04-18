import { FormattedMessage } from "react-intl";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useAllFactionColors } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { getSelectedFaction } from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../../src/util/util";

const Transpose = {
  Label,
  RightLabel,
  Content,
};

export default Transpose;

function Label() {
  const currentTurn = useCurrentTurn();
  const factionPicked = getSelectedFaction(currentTurn);

  if (!factionPicked || factionPicked === "None") {
    return (
      <FormattedMessage
        id="c6uq+j"
        description="Instruction telling the user to select their faction."
        defaultMessage="Select Faction"
      />
    );
  }

  return (
    <FormattedMessage
      id="c6uq+j"
      description="Instruction telling the user to select their faction."
      defaultMessage="Select Faction"
    />
  );
}

function RightLabel({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const factionPicked = getSelectedFaction(currentTurn);
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useAllFactionColors();
  const viewOnly = useViewOnly();

  const selectedFaction = factionPicked === "None" ? undefined : factionPicked;

  return (
    <FactionSelectRadialMenu
      selectedFaction={selectedFaction}
      invalidFactions={[factionId]}
      factions={mapOrderedFactionIds}
      onSelect={(factionId, _) => {
        dataUpdate(Events.SelectFactionEvent(factionId ?? "None"));
      }}
      size={44}
      borderColor={
        selectedFaction ? factionColors[selectedFaction]?.border : undefined
      }
      viewOnly={viewOnly}
    />
  );
}

function Content({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const selectedFaction = getSelectedFaction(currentTurn);

  if (!selectedFaction || selectedFaction === "None") {
    return <div style={{ width: "100%", minHeight: rem(12) }}></div>;
  }

  return (
    <div className="flexRow">
      <GainTFCard
        factionId={factionId}
        action={{ from: factionId, to: selectedFaction }}
        numToGain={{ abilities: 1 }}
      />
      <GainTFCard
        factionId={factionId}
        action={{ from: selectedFaction, to: factionId }}
        numToGain={{ abilities: 1 }}
      />
    </div>
  );
}
