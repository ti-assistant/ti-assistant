type CardEvent = AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent;

function tfCardEquals(a: CardEvent, b: CardEvent): boolean {
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

export class RevealTFCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: RevealTFCardData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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
      entry.data.action === "HIDE_TF_CARD" &&
      tfCardEquals(entry.data.event, this.data.event)
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class HideTFCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: HideTFCardData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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
      entry.data.action === "REVEAL_TF_CARD" &&
      tfCardEquals(this.data.event, entry.data.event)
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
