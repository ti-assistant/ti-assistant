import { getFirestore } from "firebase-admin/firestore";

import { validateMapString } from "../../src/util/util";

import { Planet } from "../../src/util/api/planets";
import { GameData } from "../../src/util/api/util";
import { StrategyCard } from "../../src/util/api/cards";
import { GameObjective, Objective } from "../../src/util/api/objectives";
import { Options } from "../../src/util/api/options";
import { Attachment } from "../../src/util/api/attachments";
import { Agenda } from "../../src/util/api/agendas";
import { BaseLeader, Component } from "../../src/util/api/components";
import { BaseFaction, Faction } from "../../src/util/api/factions";
import { BASE_AGENDAS } from "../data/agendas";
import { BASE_FACTIONS } from "../data/factions";
import { BASE_ATTACHMENTS } from "../data/attachments";
import { BASE_OBJECTIVES } from "../data/objectives";
import { BASE_PLANETS } from "../data/planets";
import { BASE_STRATEGY_CARDS } from "../data/strategyCards";
import { BASE_COMPONENTS } from "../data/components";
import { BASE_LEADERS } from "../data/leaders";
import { BASE_RELICS } from "../data/relics";
import { Relic } from "../../src/util/api/relics";

/**
 * Returns the game data for a given game.
 */
export async function getGameData(gameId: string): Promise<Partial<GameData>> {
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();
  return gameRef.data() ?? {};
}

/**
 * Fetches the strategy cards associated with a game.
 */
export async function fetchStrategyCards(
  gameId: string
): Promise<Record<string, StrategyCard>> {
  const gameData = await getGameData(gameId);

  const strategyCards = gameData.strategycards ?? {};

  const cards: Record<string, StrategyCard> = {};
  Object.entries(BASE_STRATEGY_CARDS).forEach(([cardId, card]) => {
    cards[cardId] = {
      ...card,
      ...(strategyCards[cardId] ?? {}),
    };
  });

  return cards;
}

/**
 * Fetches the objectives associated with a game.
 */
export async function fetchObjectives(
  gameId: string,
  secret: string
): Promise<Record<string, Objective>> {
  const gameData = await getGameData(gameId);

  const gameObjectives = gameData.objectives ?? {};
  const secretObjectives: Record<string, GameObjective> =
    gameData[secret]?.objectives ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const objectives: Record<string, Objective> = {};
  Object.entries(BASE_OBJECTIVES).forEach(([objectiveId, objective]) => {
    // Maybe filter out PoK objectives.
    if (!expansions.includes("POK") && objective.expansion === "POK") {
      return;
    }
    // Filter out objectives that are removed by PoK.
    if (expansions.includes("POK") && objective.expansion === "BASE ONLY") {
      return;
    }

    if (objective.omega && expansions.includes(objective.omega.expansion)) {
      objective.description = objective.omega.description;
    }

    objectives[objectiveId] = {
      ...objective,
      ...(gameObjectives[objectiveId] ?? {}),
      ...(secretObjectives[objectiveId] ?? {}),
    };
  });

  Object.values(objectives).forEach((objective) => {
    if (objective.replaces) {
      delete objectives[objective.replaces];
    }
  });

  return objectives;
}

/**
 * Fetches the attachments associated with a game.
 */
export async function fetchAttachments(
  gameId: string
): Promise<Record<string, Attachment>> {
  const gameData = await getGameData(gameId);

  const gameAttachments = gameData.attachments ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const attachments: Record<string, Attachment> = {};
  Object.entries(BASE_ATTACHMENTS).forEach(([attachmentId, attachment]) => {
    // Maybe filter out PoK objectives.
    if (
      attachment.expansion !== "BASE" &&
      attachment.expansion !== "BASE ONLY" &&
      !expansions.includes(attachment.expansion)
    ) {
      return;
    }
    // Filter out objectives that are removed by PoK.
    if (expansions.includes("POK") && attachment.expansion === "BASE ONLY") {
      return;
    }

    attachments[attachmentId] = {
      ...attachment,
      ...(gameAttachments[attachmentId] ?? {}),
    };
  });

  Object.values(attachments).forEach((attachment) => {
    if (attachment.replaces) {
      delete attachments[attachment.replaces];
    }
  });

  // Remove faction specific attachments if those factions are not in the game.
  const gameFactions = gameData.factions ?? {};

  if (!gameFactions["Titans of Ul"]) {
    delete attachments["Elysium"];
    delete attachments["Terraform"];
  }

  return attachments;
}

/**
 * Fetches the planets associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} planets keyed by name.
 */
export async function fetchPlanets(
  gameId: string
): Promise<Record<string, Planet>> {
  const gameData = await getGameData(gameId);

  const gamePlanets = gameData.planets ?? {};
  const gameFactions = gameData.factions ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const gameOptions: Partial<Options> = gameData.options ?? {};
  const mapString = gameOptions["map-string"] ?? "";
  const isValidMapString = validateMapString(mapString);
  const inGameSystems = mapString.split(" ").map((system) => parseInt(system));

  let planets = {} as Record<string, Planet>;
  Object.entries(BASE_PLANETS).forEach(([planetId, planet]) => {
    if (planet.faction && !gameFactions[planet.faction]) {
      if (!gameFactions["Council Keleres"]) {
        return;
      }
      if (
        !gameFactions["Council Keleres"].startswith.planets?.includes(
          planet.name
        )
      ) {
        return;
      }
    }
    if (
      isValidMapString &&
      planet.system &&
      !inGameSystems.includes(planet.system)
    ) {
      return;
    }
    // Maybe filter out PoK agendas.
    if (
      planet.expansion !== "BASE" &&
      planet.expansion !== "BASE ONLY" &&
      !expansions.includes(planet.expansion)
    ) {
      // Check for Argent Flight. Might be able to remedy this in some other way.
      if (
        !gameFactions["Council Keleres"] ||
        !(gameFactions["Council Keleres"]?.startswith?.planets ?? []).includes(
          planet.name
        )
      ) {
        return;
      }
    }

    if (gamePlanets[planetId] && gamePlanets[planetId]?.state === "PURGED") {
      return;
    }

    planet = {
      ...planet,
      ...(gamePlanets[planetId] ?? {}),
    };

    const clientId = planetId === "000" ? "[0.0.0]" : planetId;

    planets[clientId] = planet;
  });

  return planets;
}

/**
 * Fetches the agendas associated with a game.
 */
export async function fetchAgendas(
  gameId: string
): Promise<Record<string, Agenda>> {
  const gameData = await getGameData(gameId);

  const gameAgendas = gameData.agendas ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const agendas: Record<string, Agenda> = {};
  Object.entries(BASE_AGENDAS).forEach(([agendaId, agenda]) => {
    // Maybe filter out PoK agendas.
    if (
      agenda.expansion !== "BASE" &&
      agenda.expansion !== "BASE ONLY" &&
      !expansions.includes(agenda.expansion)
    ) {
      return;
    }
    // Filter out agendas that are removed by PoK.
    if (expansions.includes("POK") && agenda.expansion === "BASE ONLY") {
      return;
    }

    agendas[agendaId] = {
      ...agenda,
      ...(gameAgendas[agendaId] ?? {}),
    };
  });

  return agendas;
}

/**
 * Fetches the components associated with a game.
 */
export async function fetchComponents(
  gameId: string
): Promise<Record<string, Component>> {
  const db = getFirestore();

  const gameData = await getGameData(gameId);

  const gameComponents = gameData.components ?? {};
  const expansions = gameData.options?.expansions ?? [];

  let components: Record<string, Component> = {};
  Object.entries(BASE_COMPONENTS).forEach(([componentId, component]) => {
    // Maybe filter out PoK components.
    if (
      component.expansion &&
      component.expansion !== "BASE" &&
      component.expansion !== "BASE ONLY" &&
      !expansions.includes(component.expansion)
    ) {
      return;
    }

    // Filter out Codex Two relics if not using PoK.
    if (!expansions.includes("POK") && component.type === "RELIC") {
      return;
    }
    // Filter out leaders if not using PoK.
    if (!expansions.includes("POK") && component.type === "LEADER") {
      return;
    }
    // Filter out components that are removed by PoK.
    if (expansions.includes("POK") && component.expansion === "BASE ONLY") {
      return;
    }

    components[componentId] = {
      ...component,
      ...(gameComponents[componentId] ?? {}),
    };
  });

  const componentLeaders = Object.entries(BASE_LEADERS)
    // Filter out leaders that are not in the game.
    .filter(([_, leader]) => {
      if (leader.faction && !(gameData.factions ?? {})[leader.faction]) {
        return false;
      }
      if (!expansions.includes(leader.expansion)) {
        return false;
      }
      return true;
    })
    // Update leaders with omega versions if applicable.
    .map(([leaderId, leader]): [string, BaseLeader] => {
      const updatedLeader: BaseLeader = { ...leader };
      if (leader.omega && expansions.includes(leader.omega.expansion)) {
        if (leader.omega.abilityName) {
          updatedLeader.abilityName = leader.omega.abilityName;
        }
        updatedLeader.description = leader.omega.description;
        updatedLeader.name = leader.omega.name;
        if (leader.omega.timing) {
          updatedLeader.timing = leader.omega.timing;
        }
      }
      return [leaderId, updatedLeader];
    })
    // Filter out leaders that have the wrong timing.
    .filter(([_, leader]) => {
      return (
        leader.timing === "COMPONENT_ACTION" || leader.timing === "MULTIPLE"
      );
    });

  let isYssarilComponent = false;
  componentLeaders.forEach(([componentId, leader]) => {
    if (leader.type === "AGENT") {
      isYssarilComponent = true;
    }

    components[componentId] = {
      ...leader,
      type: "LEADER",
      leader: leader.type,
    };
  });

  if (!isYssarilComponent) {
    delete components["Ssruu"];
  }

  const gameRelics = gameData.relics ?? {};
  Object.entries(BASE_RELICS)
    .filter(([_, relic]) => relic.timing === "COMPONENT_ACTION")
    .forEach(([relicId, relic]) => {
      if (!expansions.includes("POK")) {
        return;
      }
      // Maybe filter out Codex Two relics.
      if (!expansions.includes(relic.expansion)) {
        return;
      }

      components[relicId] = {
        ...relic,
        ...(gameComponents[relicId] ?? {}),
        ...(gameRelics[relicId] ?? {}),
        type: "RELIC",
      };
    });

  Object.values(components).forEach((component) => {
    if (component.replaces) {
      delete components[component.replaces];
    }
  });

  return components;
}

/**
 * Fetches the factions associated with a game.
 */
export async function fetchFactions(
  gameId: string
): Promise<Record<string, Faction>> {
  const gameData = await getGameData(gameId);

  const baseFactions: Record<string, BaseFaction> = {};
  Object.entries(BASE_FACTIONS).forEach(([factionId, faction]) => {
    baseFactions[factionId] = faction;
  });

  const factionsToReturn: Record<string, Faction> = {};
  Object.entries(gameData.factions ?? {}).forEach(([id, faction]) => {
    const baseFaction = baseFactions[id];
    if (!baseFaction) {
      throw new Error("Unable to get base version of faction.");
    }
    factionsToReturn[id] = {
      ...baseFaction,
      ...faction,
    };
  });

  if (Object.keys(factionsToReturn).includes("Council Keleres")) {
    const councilChoice = new Set<string>();
    Object.values(factionsToReturn).forEach((faction) => {
      (faction.startswith.techs ?? []).forEach((tech) => {
        councilChoice.add(tech);
      });
    });
    const council = factionsToReturn["Council Keleres"];
    if (council?.startswith.choice) {
      council.startswith.choice.options = Array.from(councilChoice);
    }
  }

  return factionsToReturn;
}

/**
 * Fetches the relics associated with a game.
 */
export async function fetchRelics(
  gameId: string
): Promise<Record<string, Relic>> {
  const gameData = await getGameData(gameId);

  const gameRelics = gameData.relics ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const relics: Record<string, Relic> = {};
  Object.entries(BASE_RELICS).forEach(([relicId, relic]) => {
    // Maybe filter out Codex relics.
    if (!expansions.includes("POK") || !expansions.includes(relic.expansion)) {
      return;
    }

    relics[relicId] = {
      ...relic,
      ...(gameRelics[relicId] ?? {}),
    };
  });

  return relics;
}
