import useSWR from "swr";
import { StoredGameData, fetcher } from "../util/api/util";
import { GameData } from "../util/api/state";
import { Agenda } from "../util/api/agendas";
import { BASE_AGENDAS } from "../../server/data/agendas";
import { Attachment } from "../util/api/attachments";
import { BASE_ATTACHMENTS } from "../../server/data/attachments";
import { BaseFaction, Faction } from "../util/api/factions";
import { BaseLeader, Component } from "../util/api/components";
import { BASE_COMPONENTS } from "../../server/data/components";
import { BASE_LEADERS } from "../../server/data/leaders";
import { BASE_RELICS } from "../../server/data/relics";
import { Relic } from "../util/api/relics";
import { BASE_FACTIONS } from "../../server/data/factions";
import { BASE_OBJECTIVES } from "../../server/data/objectives";
import { Objective } from "../util/api/objectives";
import { validateMapString } from "../util/util";
import { BASE_PLANETS } from "../../server/data/planets";
import { Planet } from "../util/api/planets";
import { BASE_STRATEGY_CARDS } from "../../server/data/strategyCards";
import { StrategyCard } from "../util/api/cards";
import { BASE_OPTIONS } from "../../server/data/options";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { BASE_TECHS } from "../../server/data/techs";
import { Tech } from "../util/api/techs";
import stableHash from "stable-hash";

export function useIsGameDataValidating(gameid: string | undefined) {
  const { isValidating }: { isValidating?: boolean } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  return isValidating;
}

export function useGameData(
  gameid: string | undefined,
  paths?: string[]
): GameData {
  const { data: storedGameData }: { data?: StoredGameData } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    fetcher,
    {
      compare: (a?: StoredGameData, b?: StoredGameData) => {
        if (paths && paths.length > 0 && a && b) {
          for (const path of paths) {
            if (stableHash(a[path]) !== stableHash(b[path])) {
              return false;
            }
          }
          return true;
        }
        return stableHash(a) === stableHash(b);
      },
      revalidateIfStale: false,
    }
  );

  if (!storedGameData) {
    return {
      agendas: BASE_AGENDAS,
      attachments: BASE_ATTACHMENTS,
      components: BASE_COMPONENTS,
      factions: {},
      objectives: BASE_OBJECTIVES,
      options: BASE_OPTIONS,
      planets: BASE_PLANETS,
      relics: BASE_RELICS,
      state: {
        phase: "UNKNOWN",
        round: 1,
        speaker: "None",
      },
      strategycards: getDefaultStrategyCards(),
      techs: BASE_TECHS,
    };
  }

  const completeGameData = buildCompleteGameData(storedGameData);

  return completeGameData;
}

export function buildCompleteGameData(storedGameData: StoredGameData) {
  const completeGameData: GameData = {
    actionLog: storedGameData.actionLog,
    agendas: buildAgendas(storedGameData),
    attachments: buildAttachments(storedGameData),
    components: buildComponents(storedGameData),
    factions: buildFactions(storedGameData),
    objectives: buildObjectives(storedGameData),
    options: storedGameData.options,
    planets: buildPlanets(storedGameData),
    relics: buildRelics(storedGameData),
    state: buildState(storedGameData),
    strategycards: buildStrategyCards(storedGameData),
    techs: buildTechs(storedGameData),
  };

  return completeGameData;
}

export function buildAgendas(storedGameData: StoredGameData) {
  const gameAgendas = storedGameData.agendas ?? {};

  const agendas: Record<string, Agenda> = {};

  const expansions = storedGameData.options.expansions;

  Object.entries(BASE_AGENDAS).forEach(([agendaId, agenda]) => {
    if (
      agenda.expansion !== "BASE" &&
      agenda.expansion !== "BASE ONLY" &&
      !expansions.includes(agenda.expansion)
    ) {
      return;
    }
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

export function buildAttachments(storedGameData: StoredGameData) {
  const gameAttachments = storedGameData.attachments ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const expansions = storedGameData.options.expansions;

  const attachments: Record<string, Attachment> = {};
  Object.entries(BASE_ATTACHMENTS).forEach(([attachmentId, attachment]) => {
    // Maybe filter out PoK attachments.
    if (
      attachment.expansion !== "BASE" &&
      attachment.expansion !== "BASE ONLY" &&
      !expansions.includes(attachment.expansion)
    ) {
      return;
    }
    // Filter out attachments that are removed by PoK.
    if (expansions.includes("POK") && attachment.expansion === "BASE ONLY") {
      return;
    }

    // Remove faction specific attachments if those factions are not in the game.
    if (attachment.faction && !gameFactions[attachment.faction]) {
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

  return attachments;
}

export function buildComponents(storedGameData: StoredGameData) {
  const gameComponents = storedGameData.components ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameRelics = storedGameData.relics ?? {};

  const expansions = storedGameData.options.expansions;

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
      if (leader.faction && !gameFactions[leader.faction]) {
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

export function buildFactions(storedGameData: StoredGameData) {
  const baseFactions: Record<string, BaseFaction> = {};
  Object.entries(BASE_FACTIONS).forEach(([factionId, faction]) => {
    baseFactions[factionId] = faction;
  });

  const factions: Record<string, Faction> = {};
  Object.entries(storedGameData.factions ?? {}).forEach(([id, faction]) => {
    const baseFaction = baseFactions[id];
    if (!baseFaction) {
      throw new Error("Unable to get base version of faction.");
    }
    factions[id] = {
      ...baseFaction,
      ...faction,
    };
  });

  if (Object.keys(factions).includes("Council Keleres")) {
    const councilChoice = new Set<string>();
    Object.values(factions).forEach((faction) => {
      (faction.startswith.techs ?? []).forEach((tech) => {
        councilChoice.add(tech);
      });
    });
    const council = factions["Council Keleres"];
    if (council?.startswith.choice) {
      council.startswith.choice.options = Array.from(councilChoice);
    }
  }

  return factions;
}

// TODO: Fix secrets (or remove ability to reveal them)
export function buildObjectives(storedGameData: StoredGameData) {
  const gameObjectives = storedGameData.objectives ?? {};
  // const secretObjectives: Record<string, GameObjective> =
  //   storedGameData[secret]?.objectives ?? {};
  const expansions = storedGameData.options?.expansions ?? [];

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
      // ...(secretObjectives[objectiveId] ?? {}),
    };
  });

  Object.values(objectives).forEach((objective) => {
    if (objective.replaces) {
      delete objectives[objective.replaces];
    }
  });

  return objectives;
}

export function buildPlanets(storedGameData: StoredGameData) {
  const gamePlanets = storedGameData.planets ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameOptions = storedGameData.options;

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
      planet.name !== "Mirage" &&
      planet.name !== "Mallice" &&
      planet.name !== "Mecatol Rex" &&
      !planet.faction &&
      !inGameSystems.includes(planet.system)
    ) {
      return;
    }
    // Maybe filter out PoK agendas.
    if (
      planet.expansion !== "BASE" &&
      planet.expansion !== "BASE ONLY" &&
      !gameOptions.expansions.includes(planet.expansion)
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

export function buildRelics(storedGameData: StoredGameData) {
  const gameRelics = storedGameData.relics ?? {};
  const expansions = storedGameData.options.expansions;

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

export function buildState(storedGameData: StoredGameData) {
  const state = storedGameData.state;

  if (!state.agendaUnlocked) {
    const mecatol = buildPlanets(storedGameData)["Mecatol Rex"];
    if (mecatol && mecatol.owner) {
      state.agendaUnlocked = true;
    }
  }
  return state;
}

export function buildStrategyCards(storedGameData: StoredGameData) {
  const strategyCards = storedGameData.strategycards ?? {};

  const cards: Record<string, StrategyCard> = {};
  Object.entries(BASE_STRATEGY_CARDS).forEach(([cardId, card]) => {
    cards[cardId] = {
      ...card,
      ...(strategyCards[cardId] ?? {}),
    };
  });

  return cards;
}

export function buildTechs(storedGameData: StoredGameData) {
  const options = storedGameData.options;

  const techs: Record<string, Tech> = {};
  Object.entries(BASE_TECHS).forEach(([techId, tech]) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && tech.expansion === "POK") {
      return;
    }
    const techCopy = { ...tech };

    // Maybe update techs for codices.
    if (tech.omega && options.expansions.includes(tech.omega.expansion)) {
      techCopy.name += " Ω";
      techCopy.description = tech.omega.description;
    }

    techs[techId] = techCopy;
  });

  return techs;
}
