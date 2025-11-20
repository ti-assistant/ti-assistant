import { createIntl, createIntlCache } from "react-intl";
import { buildFactions } from "../../data/GameData";

export class ManualVoteUpdateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ManualVoteUpdateData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    // Reset order for all other cards
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const factionVotes =
      buildFactions(this.gameData, intl)[this.data.event.faction]
        ?.availableVotes ?? 0;
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.faction}.availableVotes`]:
        factionVotes + this.data.event.votes,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (
      entry.data.action === "MANUAL_VOTE_UPDATE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.votes + this.data.event.votes === 0
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}
