import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useGameId,
  useOptions,
  useViewOnly,
} from "../../context/dataHooks";
import { useFaction } from "../../context/factionDataHooks";
import { manualCCUpdateAsync } from "../../dynamic/api";
import { getGainedCCs } from "../../util/actionLog";
import NumberInput from "../NumberInput/NumberInput";

export default function GainCommandTokens({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const options = useOptions();
  const viewOnly = useViewOnly();

  if (
    options.hide?.includes("COMMAND_COUNTERS") ||
    faction?.commandCounters == undefined
  ) {
    return null;
  }

  const gainedCCs = getGainedCCs(currentTurn, factionId);

  return (
    <div className="flexRow" style={{ gap: "0.25rem" }}>
      <FormattedMessage
        id="t5fXQR"
        description="Text telling a player how many command tokens to gain."
        defaultMessage="Gain {count} command {count, plural, one {token} other {tokens}}"
        values={{
          count: (
            <NumberInput
              key={factionId}
              value={gainedCCs}
              onChange={(value) => {
                manualCCUpdateAsync(gameId, factionId, value - gainedCCs);
              }}
              maxValue={16 - faction.commandCounters + gainedCCs}
              minValue={0}
              viewOnly={viewOnly}
            />
          ),
        }}
      />
    </div>
  );
}
