import { useState } from "react";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { Optional } from "../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../src/util/util";
import Diplomacy from "../StrategicActions/Diplomacy";
import Technology from "../StrategicActions/Technology";

export default function Strategize({ factionId }: { factionId: FactionId }) {
  // TODO: Switch to a server item.
  const [selectedCard, setSelectedCard] = useState<Optional<StrategyCardId>>();

  const viewOnly = useViewOnly();
  const strategyCards = useStrategyCards();
  const validStrategyCards = Object.values(strategyCards).filter(
    (card) => !card.used
  );

  let additionalActions;
  switch (selectedCard) {
    case "Diplomacy":
      additionalActions = <Diplomacy.Secondary factionId={factionId} />;
      break;
    case "Technology":
      additionalActions = <Technology.Secondary factionId={factionId} />;
      break;
  }

  return (
    <div className="flexColumn" style={{ alignItems: "flex-start" }}>
      <Selector
        autoSelect
        hoverMenuLabel="Select Strategy Card"
        hoverMenuStyle={{ fontSize: rem(12) }}
        selectedItem={selectedCard}
        toggleItem={(item, add) => setSelectedCard(add ? item : undefined)}
        viewOnly={viewOnly}
        options={validStrategyCards}
      />
      {additionalActions}
    </div>
  );
}
