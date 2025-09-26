import { createIntl, createIntlCache } from "react-intl";
import {
  buildActionCards,
  buildAttachments,
  buildComponents,
  buildPlanets,
  buildRelics,
  buildState,
} from "../../data/GameData";
import { getCurrentTurnLogEntries } from "../api/actionLog";
import { applyPlanetAttachments } from "../planets";
import { Optional } from "../types/types";
import { AddAttachmentHandler, RemoveAttachmentHandler } from "./addAttachment";
import { AddTechHandler, RemoveTechHandler } from "./addTech";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "./scoreObjective";
import { SetSpeakerHandler } from "./setSpeaker";
import { UpdateLeaderStateHandler } from "./updateLeaderState";
import { objectEntries } from "../util";

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
    const actionCards = buildActionCards(this.gameData, intl);
    const components = buildComponents(this.gameData, intl);
    const relics = buildRelics(this.gameData, intl);
    const state = buildState(this.gameData);

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const component = components[this.data.event.name];
    if (!component) {
      const actionCard = actionCards[this.data.event.name as ActionCardId];
      if (actionCard) {
        updates[`actionCards.${this.data.event.name}.state`] = "discarded";
        return updates;
      }
      const relic = relics[this.data.event.name as RelicId];
      if (relic) {
        switch (relic.id) {
          case "Dynamis Core":
          case "Nano-Forge":
          case "Stellar Converter":
          case "The Codex":
          case "Book of Latvinia":
            updates[`relics.${this.data.event.name}.state`] = "purged";
            break;
          case "JR-XS455-O":
          case "Circlet of the Void":
            updates[`relics.${this.data.event.name}.state`] = "exhausted";
            break;
        }
        return updates;
      }
      return updates;
    }

    switch (component.type) {
      case "CARD":
        updates[`components.${this.data.event.name}.state`] = "used";
        break;
      case "BREAKTHROUGH":
        updates[`factions.${this.data.event.factionId}.breakthrough.state`] =
          "used";
        break;
      case "RELIC":
        switch (component.id) {
          case "Dynamis Core":
          case "Nano-Forge":
          case "Stellar Converter":
          case "The Codex":
          case "Book of Latvinia":
            updates[`components.${this.data.event.name}.state`] = "purged";
            break;
          case "JR-XS455-O":
          case "Circlet of the Void":
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
      case "PROMISSORY":
        switch (component.id) {
          case "Share Knowledge":
            updates[`components.${this.data.event.name}.state`] = "used";
            break;
        }
        break;
      case "ABILITY":
        switch (component.id) {
          case "Puppets of the Blade":
            const faction = this.gameData.factions["Firmament"];
            if (!faction) {
              break;
            }
            faction.id = "Obsidian";
            if (faction.techs["Neural Parasite"]) {
              faction.techs["Neural Parasite (Obsidian)"] =
                faction.techs["Neural Parasite"];
              delete faction.techs["Neural Parasite"];
            }
            if (faction.techs["Planesplitter"]) {
              faction.techs["Planesplitter (Obsidian)"] =
                faction.techs["Planesplitter"];
              delete faction.techs["Planesplitter"];
            }
            updates[`factions.Obsidian`] = faction;
            updates[`factions.Firmament`] = "DELETE";
            updates[`state.activeplayer`] = "Obsidian";
            for (const [id, strategyCard] of objectEntries(
              this.gameData.strategycards ?? {}
            )) {
              if (strategyCard.faction === "Firmament") {
                updates[`strategycards.${id}.faction`] = "Obsidian";
              }
            }
            for (const [id, objective] of objectEntries(
              this.gameData.objectives ?? {}
            )) {
              updates[`objectives.${id}.scorers`] = (
                objective.scorers ?? []
              ).map((factionId) =>
                factionId === "Firmament" ? "Obsidian" : factionId
              );
              for (const [factionId, scorers] of objectEntries(
                objective.keyedScorers ?? {}
              )) {
                updates[`objectives.${id}.keyedScorers.${factionId}`] =
                  scorers.map((factionId) =>
                    factionId === "Firmament" ? "Obsidian" : factionId
                  );
              }
            }
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

    if (this.data.event.name === "Total War" && this.data.event.factionId) {
      const handler = new ScoreObjectiveHandler(this.gameData, {
        action: "SCORE_OBJECTIVE",
        event: {
          faction: this.data.event.factionId,
          objective: "Total War",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }

    if (
      this.data.event.name === "Book of Latvinia" &&
      this.data.event.factionId
    ) {
      const planets = buildPlanets(this.gameData, intl);
      const attachments = buildAttachments(this.gameData, intl);
      const techSkips = new Set<PlanetAttribute>();
      for (const planet of Object.values(planets)) {
        if (planet.owner !== this.data.event.factionId) {
          continue;
        }
        const finalPlanet = applyPlanetAttachments(planet, attachments);
        for (const attribute of finalPlanet.attributes) {
          if (attribute.includes("skip")) {
            techSkips.add(attribute);
          }
        }
      }
      if (techSkips.size === 4) {
        const handler = new ScoreObjectiveHandler(this.gameData, {
          action: "SCORE_OBJECTIVE",
          event: {
            faction: this.data.event.factionId,
            objective: "Book of Latvinia",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      } else {
        this.data.event.prevFaction = this.gameData.state.speaker;
        const handler = new SetSpeakerHandler(this.gameData, {
          action: "SET_SPEAKER",
          event: {
            newSpeaker: this.data.event.factionId,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      }
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
    const actionCards = buildActionCards(this.gameData, intl);
    const components = buildComponents(this.gameData, intl);
    const relics = buildRelics(this.gameData, intl);

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`components.${this.data.event.name}.state`]: "DELETE",
    };

    const component = components[this.data.event.name];
    if (!component) {
      const actionCard = actionCards[this.data.event.name as ActionCardId];
      if (actionCard) {
        updates[`actionCards.${this.data.event.name}.state`] = "DELETE";
        return updates;
      }
      const relic = relics[this.data.event.name as RelicId];
      if (relic) {
        updates[`relics.${this.data.event.name}.state`] = "DELETE";
        return updates;
      }
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
    if (component.type === "BREAKTHROUGH") {
      updates[`factions.${this.data.event.factionId}.breakthrough.state`] =
        "readied";
    }
    if (component.type === "ABILITY") {
      switch (component.id) {
        case "Puppets of the Blade":
          const faction = this.gameData.factions["Obsidian"];
          if (!faction) {
            break;
          }
          faction.id = "Firmament";
          if (faction.techs["Neural Parasite (Obsidian)"]) {
            faction.techs["Neural Parasite"] =
              faction.techs["Neural Parasite (Obsidian)"];
            delete faction.techs["Neural Parasite (Obsidian)"];
          }
          if (faction.techs["Planesplitter (Obsidian)"]) {
            faction.techs["Planesplitter"] =
              faction.techs["Planesplitter (Obsidian)"];
            delete faction.techs["Planesplitter (Obsidian)"];
          }
          updates[`factions.Firmament`] = faction;
          updates[`factions.Obsidian`] = "DELETE";
          updates[`state.activeplayer`] = "Firmament";
          for (const [id, strategyCard] of objectEntries(
            this.gameData.strategycards ?? {}
          )) {
            if (strategyCard.faction === "Obsidian") {
              updates[`strategycards.${id}.faction`] = "Firmament";
            }
          }
          for (const [id, objective] of objectEntries(
            this.gameData.objectives ?? {}
          )) {
            updates[`objectives.${id}.scorers`] = (objective.scorers ?? []).map(
              (factionId) =>
                factionId === "Obsidian" ? "Firmament" : factionId
            );
            for (const [factionId, scorers] of objectEntries(
              objective.keyedScorers ?? {}
            )) {
              updates[`objectives.${id}.keyedScorers.${factionId}`] =
                scorers.map((factionId) =>
                  factionId === "Obsidian" ? "Firmament" : factionId
                );
            }
          }
          break;
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

    if (this.data.event.name === "Total War" && this.data.event.factionId) {
      const handler = new UnscoreObjectiveHandler(this.gameData, {
        action: "UNSCORE_OBJECTIVE",
        event: {
          faction: this.data.event.factionId,
          objective: "Total War",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }
    if (
      this.data.event.name === "Book of Latvinia" &&
      this.data.event.factionId
    ) {
      const planets = buildPlanets(this.gameData, intl);
      const attachments = buildAttachments(this.gameData, intl);
      const techSkips = new Set<PlanetAttribute>();
      for (const planet of Object.values(planets)) {
        if (planet.owner !== this.data.event.factionId) {
          continue;
        }
        const finalPlanet = applyPlanetAttachments(planet, attachments);
        for (const attribute of finalPlanet.attributes) {
          if (attribute.includes("skip")) {
            techSkips.add(attribute);
          }
        }
      }
      if (techSkips.size === 4) {
        const handler = new UnscoreObjectiveHandler(this.gameData, {
          action: "UNSCORE_OBJECTIVE",
          event: {
            faction: this.data.event.factionId,
            objective: "Book of Latvinia",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      } else {
        let prevSpeaker: Optional<FactionId>;
        const currentTurn = getCurrentTurnLogEntries(
          this.gameData.actionLog ?? []
        );
        for (const entry of currentTurn) {
          const action = this.getActionLogAction(entry);
          if (action === "REWIND_AND_DELETE") {
            prevSpeaker = (entry.data as PlayComponentData).event.prevFaction;
          }
        }
        if (prevSpeaker) {
          const handler = new SetSpeakerHandler(this.gameData, {
            action: "SET_SPEAKER",
            event: {
              newSpeaker: prevSpeaker,
            },
          });
          updates = {
            ...updates,
            ...handler.getUpdates(),
          };
        }
      }
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
    // Note: There should only ever be 1 played component, so no need to check any fields.
    if (entry.data.action === "PLAY_COMPONENT") {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
