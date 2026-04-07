import { createIntl, createIntlCache } from "react-intl";
import { getUnitUpgrades } from "../../../server/data/upgrades";
import { getCurrentTurnLogEntries } from "../api/actionLog";
import { Optional } from "../types/types";
import { objectEntries } from "../util";

type CardEvent = AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent;

function tfCardEquals(
  a: TFCardEvent & CardEvent,
  b: TFCardEvent & CardEvent,
): boolean {
  if (a.faction !== b.faction || a.discard !== b.discard) {
    return false;
  }
  switch (a.type) {
    case "ABILITY":
      return b.type === "ABILITY" && a.ability === b.ability;
    case "GENOME":
      return b.type === "GENOME" && a.genome === b.genome;
    case "PARADIGM":
      return b.type === "PARADIGM" && a.paradigm === b.paradigm;
    case "UNIT_UPGRADE":
      return b.type === "UNIT_UPGRADE" && a.upgrade === b.upgrade;
  }
}

export class GainTFCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: GainTFCardData,
  ) {
    let prevUpgrade: Optional<TFUnitUpgradeId>;
    let prevOwner: Optional<FactionId>;
    switch (this.data.event.type) {
      case "ABILITY":
        const abilities = this.gameData.abilities ?? {};
        prevOwner = abilities[this.data.event.ability]?.owner;
        break;
      case "GENOME":
        const genomes = this.gameData.genomes ?? {};
        prevOwner = genomes[this.data.event.genome]?.owner;
        break;
      case "PARADIGM":
        const paradigms = this.gameData.paradigms ?? {};
        prevOwner = paradigms[this.data.event.paradigm]?.owner;
        break;
      case "UNIT_UPGRADE":
        const cache = createIntlCache();
        const intl = createIntl({ locale: "en" }, cache);
        const upgrades = this.gameData.upgrades ?? {};
        const baseUpgrades = getUnitUpgrades(intl);
        prevOwner = upgrades[this.data.event.upgrade]?.owner;
        const newType = baseUpgrades[this.data.event.upgrade].unitType;
        for (const [id, upgrade] of objectEntries(upgrades)) {
          if (
            upgrade.owner === this.data.event.faction &&
            newType === baseUpgrades[id].unitType
          ) {
            prevUpgrade = id;
            break;
          }
        }
        break;
    }
    if (prevOwner) {
      this.data.event.prevFaction = prevOwner;
    }
    if (prevUpgrade && this.data.event.type === "UNIT_UPGRADE") {
      this.data.event.prevUpgrade = prevUpgrade;
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    switch (this.data.event.type) {
      case "ABILITY":
        updates[`abilities.${this.data.event.ability}.owner`] =
          this.data.event.faction;
        break;
      case "GENOME":
        updates[`genomes.${this.data.event.genome}.owner`] =
          this.data.event.faction;
        break;
      case "PARADIGM":
        updates[`paradigms.${this.data.event.paradigm}.owner`] =
          this.data.event.faction;
        break;
      case "UNIT_UPGRADE":
        updates[`upgrades.${this.data.event.upgrade}.owner`] =
          this.data.event.faction;
        if (this.data.event.prevUpgrade) {
          updates[`upgrades.${this.data.event.prevUpgrade}.owner`] = "DELETE";
        }
        break;
    }

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
      entry.data.action === "LOSE_TF_CARD" &&
      tfCardEquals(entry.data.event, this.data.event)
    ) {
      return "DELETE";
    }

    if (
      entry.data.action === "GAIN_TF_CARD" &&
      this.data.event.type === "UNIT_UPGRADE" &&
      entry.data.event.type === "UNIT_UPGRADE" &&
      entry.data.event.prevUpgrade === this.data.event.upgrade
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class LoseTFCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: LoseTFCardData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let prevOwner: Optional<string>;
    let prevUpgrade: Optional<TFUnitUpgradeId>;
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "DELETE") {
        prevOwner = (entry.data as GainTFCardData).event.prevFaction;
        if ((entry.data as GainTFCardData).event.type === "UNIT_UPGRADE") {
          prevUpgrade = ((entry.data as GainTFCardData).event as any)
            .prevUpgrade;
        }
      }
    }

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const updateVal = prevOwner ?? "DELETE";

    switch (this.data.event.type) {
      case "ABILITY":
        updates[`abilities.${this.data.event.ability}.owner`] = updateVal;
        break;
      case "GENOME":
        updates[`genomes.${this.data.event.genome}.owner`] = updateVal;
        break;
      case "PARADIGM":
        updates[`paradigms.${this.data.event.paradigm}.owner`] = updateVal;
        break;
      case "UNIT_UPGRADE":
        updates[`upgrades.${this.data.event.upgrade}.owner`] = updateVal;
        if (prevUpgrade) {
          updates[`upgrades.${prevUpgrade}.owner`] = this.data.event.faction;
        }
        break;
    }

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
      entry.data.action === "GAIN_TF_CARD" &&
      tfCardEquals(entry.data.event, this.data.event)
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
