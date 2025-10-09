import { useState } from "react";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { Optional } from "../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../src/util/util";
import Diplomacy from "../StrategicActions/Diplomacy";
import Imperial from "../StrategicActions/Imperial";
import Politics from "../StrategicActions/Politics";
import Technology from "../StrategicActions/Technology";

export default function Overrule({ factionId }: { factionId: FactionId }) {
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
      additionalActions = <Diplomacy.Primary factionId={factionId} />;
      break;
    case "Politics":
      additionalActions = <Politics.Primary />;
      break;
    case "Warfare":
      break;
    case "Technology":
      additionalActions = <Technology.Primary factionId={factionId} />;
      break;
    case "Imperial":
      additionalActions = <Imperial.Primary factionId={factionId} />;
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
  return <div>{validStrategyCards.map((card) => card.name)}</div>;
}
