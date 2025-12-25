import { GainTFCardHandler, LoseTFCardHandler } from "../model/gainTFCard";
import dataUpdate from "./dataUpdate";

export function gainTFCard(
  gameId: string,
  faction: FactionId,
  event: AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent
) {
  const data: GameUpdateData = {
    action: "GAIN_TF_CARD",
    event: {
      faction,
      ...event,
    },
  };

  return dataUpdate(gameId, data, GainTFCardHandler);
}

export function loseTFCard(
  gameId: string,
  faction: FactionId,
  event: AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent
) {
  const data: GameUpdateData = {
    action: "LOSE_TF_CARD",
    event: {
      faction,
      ...event,
    },
  };

  return dataUpdate(gameId, data, LoseTFCardHandler);
}
