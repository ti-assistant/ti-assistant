import { getFirestore } from "firebase-admin/firestore";

import { validateMapString } from "../../src/util/util";

import { BasePlanet, Planet } from "../../src/util/api/planets";
import { GameData } from "../../src/util/api/util";
import { BaseStrategyCard, StrategyCard } from "../../src/util/api/cards";
import {
  BaseObjective,
  GameObjective,
  Objective,
} from "../../src/util/api/objectives";
import { Options } from "../../src/util/api/options";
import { Attachment, BaseAttachment } from "../../src/util/api/attachments";
import { Agenda, BaseAgenda } from "../../src/util/api/agendas";
import {
  BaseComponent,
  BaseLeader,
  Component,
} from "../../src/util/api/components";
import { BaseFaction, Faction } from "../../src/util/api/factions";

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
  const db = getFirestore();

  const strategiesRef = await db
    .collection("strategycards")
    .orderBy("order")
    .get();

  const gameData = await getGameData(gameId);

  const strategyCards = gameData.strategycards ?? {};

  const cards: Record<string, StrategyCard> = {};
  strategiesRef.forEach(async (val) => {
    const card = val.data() as BaseStrategyCard;

    cards[val.id] = {
      ...card,
      ...(strategyCards[val.id] ?? {}),
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
  const db = getFirestore();

  const objectivesRef = await db.collection("objectives").get();

  const gameData = await getGameData(gameId);

  const gameObjectives = gameData.objectives ?? {};
  const secretObjectives: Record<string, GameObjective> =
    gameData[secret]?.objectives ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const objectives: Record<string, Objective> = {};
  objectivesRef.forEach(async (val) => {
    let objective = val.data() as BaseObjective;
    const objectiveId = val.id;

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
  const db = getFirestore();

  const attachmentsRef = await db.collection("attachments").get();

  const gameData = await getGameData(gameId);

  const gameAttachments = gameData.attachments ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const attachments: Record<string, Attachment> = {};
  attachmentsRef.forEach(async (val) => {
    const attachment = val.data() as BaseAttachment;
    const attachmentId = val.id;

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
      ...(gameAttachments[val.id] ?? {}),
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
  const db = getFirestore();

  const planetsRef = await db.collection("planets").get();

  const gameData = await getGameData(gameId);

  const gamePlanets = gameData.planets ?? {};
  const gameFactions = gameData.factions ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const gameOptions: Partial<Options> = gameData.options ?? {};
  const mapString = gameOptions["map-string"] ?? "";
  const isValidMapString = validateMapString(mapString);
  const inGameSystems = mapString.split(" ").map((system) => parseInt(system));

  let planets = {} as Record<string, Planet>;
  planetsRef.forEach(async (val) => {
    let planet = val.data() as BasePlanet;
    let id = val.id;

    if (planet.home && planet.faction && !gameFactions[planet.faction]) {
      if (
        !gameFactions["Council Keleres"] ||
        !(gameFactions["Council Keleres"]?.startswith?.planets ?? []).includes(
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

    planet = {
      ...planet,
      ...(gamePlanets[id] ?? {}),
    };

    if (id === "000") {
      id = "[0.0.0]";
    }
    planets[id] = planet;
  });

  return planets;
}

/**
 * Fetches the agendas associated with a game.
 */
export async function fetchAgendas(
  gameId: string
): Promise<Record<string, Agenda>> {
  const db = getFirestore();

  const agendasRef = await db.collection("agendas").get();

  const gameData = await getGameData(gameId);

  const gameAgendas = gameData.agendas ?? {};
  const expansions = gameData.options?.expansions ?? [];

  const agendas: Record<string, Agenda> = {};
  agendasRef.forEach(async (val) => {
    let agenda = val.data() as BaseAgenda;

    // Remove POK from Representative Government
    let agendaId = val.id.replace(" POK", "");

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

  const componentsRef = await db.collection("components").get();

  const gameData = await getGameData(gameId);

  const gameComponents = gameData.components ?? {};
  const expansions = gameData.options?.expansions ?? [];

  let components: Record<string, Component> = {};
  componentsRef.forEach((val) => {
    let component = val.data() as BaseComponent;
    const componentId = val.id;

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
    if (!expansions.includes("POK") && component.type === "relic") {
      return;
    }
    // Filter out leaders if not using PoK.
    if (!expansions.includes("POK") && component.type === "leader") {
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

  const leadersRef = await db
    .collectionGroup("leaders")
    .where("timing", "in", ["COMPONENT ACTION", "MULTIPLE"])
    .get();

  let isYssarilComponent = false;
  leadersRef.forEach((val) => {
    let leader = val.data() as BaseLeader;
    const componentId = val.id;

    // Filter out factions that are not in the game.
    if (leader.faction && !(gameData.factions ?? {})[leader.faction]) {
      return;
    }

    // Filter out unused expansions.
    if (!expansions.includes(leader.expansion)) {
      return;
    }

    if (leader.type === "AGENT") {
      isYssarilComponent = true;
    }

    components[componentId] = {
      ...leader,
      type: "leader",
      leader: leader.type,
    };
  });

  if (!isYssarilComponent) {
    delete components["Ssruu"];
  }

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
  const db = getFirestore();

  const gameData = await getGameData(gameId);

  const factionsRef = await db.collection("factions").get();
  const baseFactions: Record<string, BaseFaction> = {};
  factionsRef.forEach((val) => {
    const faction = val.data() as BaseFaction;
    const factionId = val.id;
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
