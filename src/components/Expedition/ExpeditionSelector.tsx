import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useExpedition,
  useGameId,
  useOptions,
  useViewOnly,
} from "../../context/dataHooks";
import { commitToExpeditionAsync } from "../../dynamic/api";
import { getLatestExpedition } from "../../util/actionLog";
import { getSelectedActionFromLog } from "../../util/api/data";
import { objectKeys, rem } from "../../util/util";
import ExpeditionSelectRadialMenu from "../ExpeditionSelectRadialMenu/ExpeditionSelectRadialMenu";

function expeditionComplete(expedition: Expedition) {
  return objectKeys(expedition).length === 6;
}

export default function ExpeditionSelector({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const expedition = useExpedition();
  const gameId = useGameId();
  const latestExpedition = getLatestExpedition(currentTurn, factionId);
  const options = useOptions();
  const viewOnly = useViewOnly();
  const selectedAction = getSelectedActionFromLog(currentTurn);

  console.log("Current Turn", currentTurn);

  if (!options.expansions.includes("THUNDERS EDGE")) {
    return null;
  }

  if (!selectedAction) {
    return null;
  }

  if (expeditionComplete(expedition) && !latestExpedition) {
    return null;
  }

  return (
    <div className="flexRow" style={{ fontSize: rem(16), gap: rem(4) }}>
      <FormattedMessage
        id="1bUwOq"
        description="Text shown on a menu for selecting an expedition."
        defaultMessage="Thunder's Edge Expedition"
      />
      :
      <ExpeditionSelectRadialMenu
        selectedExpedition={latestExpedition?.expedition}
        invalidExpeditions={objectKeys(expedition)}
        expeditions={[
          "resources",
          "actionCards",
          "influence",
          "secrets",
          "techSkip",
          "tradeGoods",
        ]}
        onSelect={(expeditionId, prevExpedition) => {
          if (prevExpedition) {
            commitToExpeditionAsync(gameId, prevExpedition, undefined);
          }
          if (expeditionId)
            commitToExpeditionAsync(gameId, expeditionId, factionId);
        }}
        size={40}
      />
    </div>
  );
}
