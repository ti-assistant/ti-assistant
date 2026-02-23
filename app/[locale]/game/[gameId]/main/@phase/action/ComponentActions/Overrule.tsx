import { Selector } from "../../../../../../../../src/components/Selector/Selector";
import {
  useCurrentTurn,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { getSelectedSubComponent } from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../../src/util/util";
import StrategicActions from "../StrategicActions/StrategicActions";

export default function Overrule({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const selectedCard = getSelectedSubComponent(currentTurn);

  const validStrategyCards = Object.values(strategyCards).filter(
    (card) => !card.used,
  );

  let additionalActions;
  switch (selectedCard) {
    case "Diplomacy":
      additionalActions = (
        <StrategicActions.Diplomacy.Primary factionId={factionId} />
      );
      break;
    case "Politics":
      additionalActions = <StrategicActions.Politics.Primary />;
      break;
    case "Warfare":
      additionalActions = (
        <StrategicActions.Warfare.Primary factionId={factionId} />
      );
      break;
    case "Technology":
      additionalActions = (
        <StrategicActions.Technology.Primary factionId={factionId} />
      );
      break;
    case "Imperial":
      additionalActions = (
        <StrategicActions.Imperial.Primary factionId={factionId} />
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
          dataUpdate(Events.SelectSubComponentEvent(add ? item : "None"))
        }
        viewOnly={viewOnly}
        options={validStrategyCards}
      />
      {additionalActions}
    </div>
  );
}
