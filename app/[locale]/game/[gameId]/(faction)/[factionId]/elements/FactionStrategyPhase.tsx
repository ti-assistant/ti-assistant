import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useActiveFactionId } from "../../../../../../../src/context/gameDataHooks";
import { useUndo } from "../../../../../../../src/util/api/undo";
import { rem } from "../../../../../../../src/util/util";
import { StrategyCardSelectList } from "../../../main/@phase/strategy/StrategyPhase";

export default function FactionStrategyPhase({
  factionId,
}: {
  factionId: FactionId;
}) {
  const activeFactionId = useActiveFactionId();
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const undo = useUndo();
  const viewOnly = useViewOnly();

  function canUndo() {
    const lastAction = currentTurn[0];
    return (
      !!lastAction &&
      lastAction.data.action === "ASSIGN_STRATEGY_CARD" &&
      lastAction.data.event.pickedBy === factionId
    );
  }

  if (factionId === activeFactionId) {
    return (
      <div className="flexColumn" style={{ width: "100%" }}>
        <div
          className="flexColumn "
          style={{ alignItems: "stretch", width: "100%", gap: rem(4) }}
        >
          <StrategyCardSelectList mobile={true} />
        </div>
      </div>
    );
  }

  if (canUndo()) {
    return (
      <button
        onClick={() => {
          undo(gameId);
        }}
        disabled={viewOnly}
      >
        Undo SC Pick
      </button>
    );
  }
  return null;
}
