import { getCurrentTurnLogEntries } from "../api/actionLog";
import { Optional } from "../types/types";

type CardEvent = AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent;

function equals(
  a: TFCardEvent & CardEvent,
  b: TFCardEvent & CardEvent,
): boolean {
  if (a.faction !== b.faction) {
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
        const upgrades = this.gameData.upgrades ?? {};
        prevOwner = upgrades[this.data.event.upgrade]?.owner;
        break;
    }
    if (prevOwner) {
      this.data.event.prevFaction = prevOwner;
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
      equals(entry.data.event, this.data.event)
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
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "DELETE") {
        prevOwner = (entry.data as GainTFCardData).event.prevFaction;
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
      equals(entry.data.event, this.data.event)
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
