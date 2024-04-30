import { createIntl, createIntlCache } from "react-intl";
import { buildComponents } from "../../data/GameData";
import { AddAttachmentHandler, RemoveAttachmentHandler } from "./addAttachment";
import { UpdateLeaderStateHandler } from "./updateLeaderState";

export class PlayComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayComponentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const components = buildComponents(this.gameData, intl);

    let updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    const component = components[this.data.event.name];
    if (!component) {
      return updates;
    }

    switch (component.type) {
      case "CARD":
      case "TECH":
        updates[`components.${this.data.event.name}.state`] = "used";
        break;
      case "RELIC":
        switch (component.id) {
          case "Dynamis Core":
          case "Nano-Forge":
          case "Stellar Converter":
          case "The Codex":
            updates[`components.${this.data.event.name}.state`] = "purged";
            break;
          case "JR-XS455-O":
            updates[`components.${this.data.event.name}.state`] = "exhausted";
            break;
        }
        break;
      case "LEADER":
        let newState: LeaderState = "exhausted";
        if (component.leader === "HERO") {
          newState = "purged";
        }
        const updateLeaderStateHandler = new UpdateLeaderStateHandler(
          this.gameData,
          {
            action: "UPDATE_LEADER_STATE",
            event: {
              leaderId: this.data.event.name as LeaderId,
              state: newState,
            },
          }
        );

        updates = {
          ...updates,
          ...updateLeaderStateHandler.getUpdates(),
        };
        break;
    }

    if (this.data.event.name === "Ul the Progenitor") {
      const handler = new AddAttachmentHandler(this.gameData, {
        action: "ADD_ATTACHMENT",
        event: {
          planet: "Elysium",
          attachment: "Ul the Progenitor",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    return "IGNORE";
  }
}

export class UnplayComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayComponentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const components = buildComponents(this.gameData, intl);

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`components.${this.data.event.name}.state`]: "DELETE",
    };

    const component = components[this.data.event.name];
    if (!component) {
      return updates;
    }

    if (component.type === "LEADER") {
      const updateLeaderStateHandler = new UpdateLeaderStateHandler(
        this.gameData,
        {
          action: "UPDATE_LEADER_STATE",
          event: {
            leaderId: this.data.event.name as LeaderId,
            state: "readied",
          },
        }
      );

      updates = {
        ...updates,
        ...updateLeaderStateHandler.getUpdates(),
      };
    }

    if (this.data.event.name === "Ul the Progenitor") {
      const handler = new RemoveAttachmentHandler(this.gameData, {
        action: "REMOVE_ATTACHMENT",
        event: {
          planet: "Elysium",
          attachment: "Ul the Progenitor",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    // Note: There should only ever be 1 played component, so no need to check any fields.
    if (entry.data.action === "PLAY_COMPONENT") {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
