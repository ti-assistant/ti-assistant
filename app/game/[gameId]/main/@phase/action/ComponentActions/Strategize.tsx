import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useCurrentTurn,
  useGameId,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { selectSubComponentAsync } from "../../../../../../../src/dynamic/api";
import { getSelectedSubComponent } from "../../../../../../../src/util/actionLog";
import { rem } from "../../../../../../../src/util/util";
import StrategicActions from "../StrategicActions/StrategicActions";

export default function Strategize({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const selectedCard = getSelectedSubComponent(currentTurn);

  const validStrategyCards = Object.values(strategyCards).filter(
    (card) => !card.used
  );

  let additionalActions;
  switch (selectedCard) {
    case "Diplomacy":
      additionalActions = (
        <StrategicActions.Diplomacy.Secondary factionId={factionId} />
      );
      break;
    case "Technology":
      additionalActions = (
        <StrategicActions.Technology.Secondary factionId={factionId} />
      );
      break;
  }

  return (
    <div className="flexColumn" style={{ alignItems: "flex-start" }}>
      <Selector
        autoSelect
        hoverMenuLabel="Select Strategy Card"
        hoverMenuStyle={{ fontSize: rem(12) }}
        selectedItem={selectedCard}
        toggleItem={(item, add) =>
          selectSubComponentAsync(gameId, add ? item : "None")
        }
        viewOnly={viewOnly}
        options={validStrategyCards}
      />
      {additionalActions}
    </div>
  );
}
