import { computeVPs } from "../../FactionSummary";
import {
  buildAgendas,
  buildFactions,
  buildObjectives,
} from "../../data/GameData";
import { getPlayedRiders, getSelectedSubAgenda } from "../actionLog";
import {
  getCurrentPhaseLogEntries,
  getCurrentTurnLogEntries,
} from "../api/actionLog";
import { Handler, ActionLogAction } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";
import { AddAttachmentHandler, RemoveAttachmentHandler } from "./addAttachment";
import { CastVotesData } from "./castVotes";
import {
  HideObjectiveHandler,
  RevealObjectiveHandler,
} from "./revealObjective";
import {
  ScoreObjectiveData,
  ScoreObjectiveHandler,
  UnscoreObjectiveData,
  UnscoreObjectiveHandler,
} from "./scoreObjective";
import { SetSpeakerHandler } from "./setSpeaker";

export interface ResolveAgendaEvent {
  agenda: string;
  target: string; // Consider computing this?
  resolvedBy?: string;

  // Set by server, used to undo Politics Rider.
  prevSpeaker?: string;
}

export interface RepealAgendaEvent {
  agenda: string;
  target: string; // Consider computing this?
  repealedBy?: string;
  prevSpeaker?: string;
}

export interface ResolveAgendaData {
  action: "RESOLVE_AGENDA";
  event: ResolveAgendaEvent;
}

export interface RepealAgendaData {
  action: "REPEAL_AGENDA";
  event: RepealAgendaEvent;
}

export class ResolveAgendaHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ResolveAgendaData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`agendas.${this.data.event.agenda}.passed`]:
        this.data.event.target !== "Against",
      [`agendas.${this.data.event.agenda}.resolved`]: true,
      [`agendas.${this.data.event.agenda}.target`]: this.data.event.target,
    };
    if (this.data.event.resolvedBy !== "UNDO") {
      updates[`state.agendaNum`] = (this.gameData.state.agendaNum ?? 0) + 1;
    }

    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);

    // TODO: Handle all the various agendas.
    switch (this.data.event.agenda) {
      case "Shard of the Throne":
      case "The Crown of Emphidia":
      case "Political Censure": {
        const scoreObjectiveData: ScoreObjectiveData = {
          action: "SCORE_OBJECTIVE",
          event: {
            faction: this.data.event.target,
            objective: this.data.event.agenda,
          },
        };
        const objectiveHandler = new ScoreObjectiveHandler(
          this.gameData,
          scoreObjectiveData
        );
        updates = {
          ...updates,
          ...objectiveHandler.getUpdates(),
        };
        break;
      }
      case "Classified Document Leaks": {
        updates[`objectives.${this.data.event.target}.type`] = "STAGE ONE";
        const handler = new RevealObjectiveHandler(this.gameData, {
          action: "REVEAL_OBJECTIVE",
          event: {
            objective: this.data.event.target,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Core Mining":
      case "Demilitarized Zone":
      case "Research Team: Biotic":
      case "Research Team: Cybernetic":
      case "Research Team: Propulsion":
      case "Research Team: Warfare":
      case "Senate Sanctuary":
      case "Terraforming Initiative": {
        const handler = new AddAttachmentHandler(this.gameData, {
          action: "ADD_ATTACHMENT",
          event: {
            attachment: this.data.event.agenda,
            planet: this.data.event.target,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Holy Planet of Ixth": {
        const handler = new AddAttachmentHandler(this.gameData, {
          action: "ADD_ATTACHMENT",
          event: {
            attachment: this.data.event.agenda,
            planet: this.data.event.target,
          },
        });
        const objectiveHandler = new ScoreObjectiveHandler(this.gameData, {
          action: "SCORE_OBJECTIVE",
          event: {
            faction: this.data.event.target,
            objective: this.data.event.agenda,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
          ...objectiveHandler.getUpdates(),
        };
        break;
      }
      case "Mutiny": {
        const castVotesActions = currentTurn.filter(
          (logEntry) => logEntry.data.action === "CAST_VOTES"
        );

        const forFactions = new Set();
        for (const votes of castVotesActions) {
          const data = votes.data as CastVotesData;
          if (data.event.target === "For") {
            forFactions.add(data.event.faction);
          }
        }

        if (this.data.event.target === "For") {
          updates[`objectives.${this.data.event.agenda}.points`] = 1;
        } else {
          updates[`objectives.${this.data.event.agenda}.points`] = -1;
        }

        updates[`objectives.${this.data.event.agenda}.scorers`] =
          Array.from(forFactions);
        break;
      }
      case "Seed of an Empire": {
        let targetVPs = 0;
        const factions = buildFactions(this.gameData);
        const objectives = buildObjectives(this.gameData);
        if (this.data.event.target === "For") {
          targetVPs = Object.keys(factions).reduce(
            (currentMax, factionName) => {
              return Math.max(
                currentMax,
                computeVPs(factions, factionName, objectives)
              );
            },
            Number.MIN_SAFE_INTEGER
          );
        } else {
          targetVPs = Object.keys(factions ?? {}).reduce(
            (currentMin, factionName) => {
              return Math.min(
                currentMin,
                computeVPs(factions, factionName, objectives)
              );
            },
            Number.MAX_SAFE_INTEGER
          );
        }
        const forFactions = new Set();
        for (const factionName of Object.keys(factions)) {
          if (computeVPs(factions, factionName, objectives) === targetVPs) {
            forFactions.add(factionName);
          }
        }

        updates[`objectives.${this.data.event.agenda}.scorers`] =
          Array.from(forFactions);
        break;
      }
      case "Judicial Abolishment": {
        const agenda = buildAgendas(this.gameData)[this.data.event.target];
        if (!agenda || !agenda.target) {
          return {};
        }

        const repealHandler = new RepealAgendaHandler(this.gameData, {
          action: "REPEAL_AGENDA",
          event: {
            agenda: this.data.event.target,
            target: agenda.target,
          },
        });
        updates = {
          ...updates,
          ...repealHandler.getUpdates(),
        };
        break;
      }
      case "New Constitution": {
        const agendas = buildAgendas(this.gameData);
        const toRepeal = Object.values(agendas).filter(
          (agenda) => agenda.type === "LAW" && agenda.passed
        );
        updates[`agendas.${this.data.event.agenda}.affected`] = toRepeal.map(
          (agenda) => agenda.name
        );
        for (const agenda of toRepeal) {
          const repealHandler = new RepealAgendaHandler(this.gameData, {
            action: "REPEAL_AGENDA",
            event: {
              agenda: agenda.name,
              target: agenda.target ?? "UNKNOWN",
            },
          });
          updates = {
            ...updates,
            ...repealHandler.getUpdates(),
          };
        }
        break;
      }
      case "Public Execution": {
        if (this.gameData.state.speaker !== this.data.event.target) {
          break;
        }
        updates[`agendas.${this.data.event.agenda}.affected`] = [
          this.data.event.target,
        ];
        const factions = buildFactions(this.gameData);
        const nextPlayer = Object.values(factions).find(
          (faction) => faction.order === 2
        );
        if (!nextPlayer) {
          return {};
        }
        const handler = new SetSpeakerHandler(this.gameData, {
          action: "SET_SPEAKER",
          event: {
            newSpeaker: nextPlayer.name,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Colonial Redistribution": {
        // TODO - give planet to lowest VP player.
      }
      case "Covert Legislation": {
        const subAgenda = getSelectedSubAgenda(currentTurn);
        if (!subAgenda) {
          break;
        }
        const handler = new ResolveAgendaHandler(this.gameData, {
          action: "RESOLVE_AGENDA",
          event: {
            agenda: subAgenda,
            target: this.data.event.target,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
    }

    const riders = getPlayedRiders(currentTurn);
    for (const rider of riders) {
      if (!rider.faction || rider.outcome !== this.data.event.target) {
        continue;
      }
      switch (rider.rider) {
        case "Politics Rider": {
          this.data.event.prevSpeaker = this.gameData.state.speaker;
          const setSpeakerHandler = new SetSpeakerHandler(this.gameData, {
            action: "SET_SPEAKER",
            event: {
              newSpeaker: rider.faction,
              prevSpeaker: this.gameData.state.speaker,
            },
          });
          updates = {
            ...updates,
            ...setSpeakerHandler.getUpdates(),
          };
          break;
        }
        case "Technology Rider": {
          // TODO: Add ability to select a technology.
          break;
        }
        case "Imperial Rider": {
          const objectiveHandler = new ScoreObjectiveHandler(this.gameData, {
            action: "SCORE_OBJECTIVE",
            event: {
              faction: rider.faction,
              objective: "Imperial Rider",
            },
          });
          updates = {
            ...updates,
            ...objectiveHandler.getUpdates(),
          };
          break;
        }
      }
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
    if (
      entry.data.action === "REPEAL_AGENDA" &&
      entry.data.event.agenda === this.data.event.agenda
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class RepealAgendaHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: RepealAgendaData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`agendas.${this.data.event.agenda}.passed`]: "DELETE",
      // Decide how to handle this.
      // [`agendas.${this.data.event.agenda}.resolved`]: true,
      // [`agendas.${this.data.event.agenda}.target`]: "DELETE",
    };
    if (this.data.event.repealedBy === "UNDO") {
      updates[`agendas.${this.data.event.agenda}.target`] = "DELETE";
      updates[`agendas.${this.data.event.agenda}.resolved`] = "DELETE";
      updates[`state.agendaNum`] = (this.gameData.state.agendaNum ?? 0) - 1;

      const currentTurn = getCurrentTurnLogEntries(
        this.gameData.actionLog ?? []
      );

      // NOTE: Each rider should only be able to be played once in a given round.
      // NOTE: This may not properly undo riders.
      const riders = getPlayedRiders(currentTurn);
      for (const rider of riders) {
        if (!rider.faction || rider.outcome !== this.data.event.target) {
          continue;
        }
        switch (rider.rider) {
          case "Politics Rider": {
            if (!this.data.event.prevSpeaker) {
              break;
            }
            const setSpeakerHandler = new SetSpeakerHandler(this.gameData, {
              action: "SET_SPEAKER",
              event: {
                newSpeaker: this.data.event.prevSpeaker,
              },
            });
            updates = {
              ...updates,
              ...setSpeakerHandler.getUpdates(),
            };
            break;
          }
          case "Technology Rider": {
            // TODO: Undo selected technology.
            break;
          }
          case "Imperial Rider": {
            const objectiveHandler = new UnscoreObjectiveHandler(
              this.gameData,
              {
                action: "UNSCORE_OBJECTIVE",
                event: {
                  faction: rider.faction,
                  objective: "Imperial Rider",
                },
              }
            );
            updates = {
              ...updates,
              ...objectiveHandler.getUpdates(),
            };
            break;
          }
        }
      }
    }

    // TODO: Handle all the various agendas.
    switch (this.data.event.agenda) {
      case "Political Censure": {
        const unscoreObjectiveData: UnscoreObjectiveData = {
          action: "UNSCORE_OBJECTIVE",
          event: {
            faction: this.data.event.target,
            objective: this.data.event.agenda,
          },
        };
        const objectiveHandler = new UnscoreObjectiveHandler(
          this.gameData,
          unscoreObjectiveData
        );
        updates = {
          ...updates,
          ...objectiveHandler.getUpdates(),
        };
        break;
      }
      case "Classified Document Leaks": {
        updates[`objectives.${this.data.event.target}.type`] = "DELETE";
        const handler = new HideObjectiveHandler(this.gameData, {
          action: "HIDE_OBJECTIVE",
          event: {
            objective: this.data.event.target,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Core Mining":
      case "Demilitarized Zone":
      case "Research Team: Biotic":
      case "Research Team: Cybernetic":
      case "Research Team: Propulsion":
      case "Research Team: Warfare":
      case "Senate Sanctuary":
      case "Terraforming Initiative": {
        const handler = new RemoveAttachmentHandler(this.gameData, {
          action: "REMOVE_ATTACHMENT",
          event: {
            attachment: this.data.event.agenda,
            planet: this.data.event.target,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Holy Planet of Ixth": {
        const handler = new RemoveAttachmentHandler(this.gameData, {
          action: "REMOVE_ATTACHMENT",
          event: {
            attachment: this.data.event.agenda,
            planet: this.data.event.target,
          },
        });
        const objectiveHandler = new UnscoreObjectiveHandler(this.gameData, {
          action: "UNSCORE_OBJECTIVE",
          event: {
            faction: this.data.event.target,
            objective: this.data.event.agenda,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
          ...objectiveHandler.getUpdates(),
        };
        break;
      }
      case "Mutiny": {
        // Reset Mutiny
        updates[`objectives.${this.data.event.agenda}.points`] = "DELETE";
        updates[`objectives.${this.data.event.agenda}.scorers`] = "DELETE";
        break;
      }
      case "Seed of an Empire": {
        updates[`objectives.${this.data.event.agenda}.scorers`] = "DELETE";
        break;
      }
      case "Judicial Abolishment": {
        const agendas = buildAgendas(this.gameData);
        const agenda = agendas[this.data.event.target];
        if (!agenda || !agenda.target) {
          return {};
        }
        const resolveHandler = new ResolveAgendaHandler(this.gameData, {
          action: "RESOLVE_AGENDA",
          event: {
            agenda: this.data.event.target,
            target: agenda.target,
            resolvedBy: "UNDO",
          },
        });
        updates = {
          ...updates,
          ...resolveHandler.getUpdates(),
        };
      }
      case "New Constitution": {
        const agendas = buildAgendas(this.gameData);
        const agenda = agendas[this.data.event.agenda];
        if (!agenda) {
          return {};
        }
        const toResolve = agenda.affected ?? [];
        for (const agendaName of toResolve) {
          const agenda = agendas[agendaName];
          if (!agenda || !agenda.target) {
            return {};
          }
          const repealHandler = new ResolveAgendaHandler(this.gameData, {
            action: "RESOLVE_AGENDA",
            event: {
              agenda: agenda.name,
              target: agenda.target,
              resolvedBy: "UNDO",
            },
          });
          updates = {
            ...updates,
            ...repealHandler.getUpdates(),
          };
        }
        break;
      }
      case "Public Execution": {
        const agendas = buildAgendas(this.gameData);
        const agenda = agendas[this.data.event.agenda];
        if (!agenda) {
          return {};
        }
        const affected = (agenda.affected ?? [])[0];
        if (!affected) {
          break;
        }
        const handler = new SetSpeakerHandler(this.gameData, {
          action: "SET_SPEAKER",
          event: {
            newSpeaker: affected,
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
      case "Colonial Redistribution": {
        // TODO - return planet.
      }
      case "Covert Legislation": {
        // Need to bypass turn boundaries.
        const subAgenda = getSelectedSubAgenda(this.gameData.actionLog ?? []);
        if (!subAgenda) {
          break;
        }
        const handler = new RepealAgendaHandler(this.gameData, {
          action: "REPEAL_AGENDA",
          event: {
            agenda: subAgenda,
            target: this.data.event.target ?? "UNKNOWN",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
        break;
      }
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
    if (
      entry.data.action === "RESOLVE_AGENDA" &&
      entry.data.event.agenda === this.data.event.agenda
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
