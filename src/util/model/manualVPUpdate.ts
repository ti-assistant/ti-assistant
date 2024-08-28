import { createIntl, createIntlCache } from "react-intl";
import { buildFactions } from "../../data/GameData";

export class ManualVPUpdateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ManualVPUpdateData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    // Reset order for all other cards
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const factionVPs =
      buildFactions(this.gameData, intl)[this.data.event.faction]?.vps ?? 0;
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.faction}.vps`]:
        factionVPs + this.data.event.vps,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "MANUAL_VP_UPDATE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.vps + this.data.event.vps === 0
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}
