import { createIntl, createIntlCache } from "react-intl";
import { buildComponents, buildState } from "../../data/GameData";
import { AddAttachmentHandler, RemoveAttachmentHandler } from "./addAttachment";
import { UpdateLeaderStateHandler } from "./updateLeaderState";
import { AddTechHandler, RemoveTechHandler } from "./addTech";

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
    const state = buildState(this.gameData);

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const component = components[this.data.event.name];
    if (!component) {
      return updates;
    }

    switch (component.type) {
      case "CARD":
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
      case "TECH":
        if (!state.activeplayer || state.activeplayer === "None") {
          break;
        }
        updates[
          `factions.${state.activeplayer}.techs.${this.data.event.name}.ready`
        ] = false;
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

    if (
      this.data.event.name === "Fires of the Gashlai" &&
      this.data.event.factionId
    ) {
      const handler = new AddTechHandler(this.gameData, {
        action: "ADD_TECH",
        event: {
          faction: this.data.event.factionId,
          tech: "War Sun",
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
      [`sequenceNum`]: "INCREMENT",
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
    if (component.type === "TECH") {
      const state = buildState(this.gameData);
      if (state.activeplayer && state.activeplayer !== "None") {
        updates[
          `factions.${state.activeplayer}.techs.${this.data.event.name}.ready`
        ] = true;
      }
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

    if (
      this.data.event.name === "Fires of the Gashlai" &&
      this.data.event.factionId
    ) {
      const handler = new RemoveTechHandler(this.gameData, {
        action: "REMOVE_TECH",
        event: {
          faction: this.data.event.factionId,
          tech: "War Sun",
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
