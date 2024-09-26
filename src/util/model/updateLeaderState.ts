// Note: This doesn't handle exhausted leaders.
export class UpdateLeaderStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdateLeaderStateData
  ) {
    const leader = (gameData.leaders ?? {})[data.event.leaderId];
    if (leader) {
      this.data.event.prevState = leader.state;
    } else {
      this.data.event.prevState = "locked";
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`leaders.${this.data.event.leaderId}.state`]: this.data.event.state,
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
      entry.data.action === "UPDATE_LEADER_STATE" &&
      entry.data.event.leaderId === this.data.event.leaderId
    ) {
      if (
        entry.data.event.prevState === this.data.event.state ||
        !entry.data.event.prevState
      ) {
        return "DELETE";
      }
      return "IGNORE";
    }
    return "IGNORE";
  }
}
