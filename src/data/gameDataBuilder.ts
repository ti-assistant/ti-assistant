import {
  isValidMapString,
  updateMapString,
  validSystemNumber,
} from "../util/map";
import { getMapString } from "../util/options";

export function buildCompleteGameData(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const completeGameData: GameData = {
    actionLog: storedGameData.actionLog,
    agendas: buildAgendas(storedGameData, baseData),
    attachments: buildAttachments(storedGameData, baseData),
    components: buildComponents(storedGameData, baseData),
    factions: buildFactions(storedGameData, baseData),
    leaders: buildLeaders(storedGameData, baseData),
    objectives: buildObjectives(storedGameData, baseData),
    options: storedGameData.options,
    planets: buildPlanets(storedGameData, baseData),
    relics: buildRelics(storedGameData, baseData),
    sequenceNum: storedGameData.sequenceNum,
    state: buildState(storedGameData, baseData),
    strategycards: buildStrategyCards(storedGameData, baseData),
    systems: buildSystems(storedGameData, baseData),
    techs: buildTechs(storedGameData, baseData),
    timers: storedGameData.timers,

    allPlanets: buildPlanets(storedGameData, baseData, true),
  };

  return completeGameData;
}

export function buildAgendas(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const gameAgendas = storedGameData.agendas ?? {};

  const agendas: Partial<Record<AgendaId, Agenda>> = {};

  const expansions = storedGameData.options.expansions;

  Object.entries(baseData.agendas ?? {}).forEach(([agendaId, agenda]) => {
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

    agendas[agendaId as AgendaId] = {
      ...agenda,
      ...(gameAgendas[agendaId as AgendaId] ?? {}),
    };
  });

  return agendas;
}

export function buildAttachments(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const gameAttachments = storedGameData.attachments ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const expansions = storedGameData.options.expansions;

  const attachments: Partial<Record<AttachmentId, Attachment>> = {};
  Object.entries(baseData.attachments ?? {}).forEach(
    ([attachmentId, attachment]) => {
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

      attachments[attachmentId as AttachmentId] = {
        ...attachment,
        ...(gameAttachments[attachmentId as AttachmentId] ?? {}),
      };
    }
  );

  Object.values(attachments).forEach((attachment) => {
    if (attachment.replaces) {
      delete attachments[attachment.replaces];
    }
  });

  return attachments;
}

export function buildComponents(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const gameComponents = storedGameData.components ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameRelics = storedGameData.relics ?? {};

  const expansions = storedGameData.options.expansions;

  let components: Record<string, Component> = {};
  Object.entries(baseData.components ?? {}).forEach(
    ([componentId, component]) => {
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
    }
  );

  const componentLeaders = Object.entries(baseData.leaders)
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
      ...components[componentId],
      ...(gameComponents[componentId] ?? {}),
      ...leader,
      type: "LEADER",
      leader: leader.type,
    };
  });

  if (!isYssarilComponent) {
    delete components["Ssruu"];
  }

  Object.entries(baseData.relics ?? {})
    .filter(([_, relic]) => relic.timing === "COMPONENT_ACTION")
    .forEach(([relicId, relic]) => {
      if (!expansions.includes("POK")) {
        return;
      }
      // Maybe filter out Codex Two relics.
      if (!expansions.includes(relic.expansion)) {
        return;
      }

      components[relicId as RelicId] = {
        ...relic,
        ...(gameComponents[relicId as RelicId] ?? {}),
        ...(gameRelics[relicId as RelicId] ?? {}),
        type: "RELIC",
      };
    });

  if (storedGameData.options.scenario === "AGE_OF_EXPLORATION") {
    components["Dark Energy Tap"] = {
      description:
        "ACTION: You may exhaust DARK ENERGY TAP and roll 1 die. On a result of 1-4, draw a random unused red tile, on a result of 5-10, draw a random unused blue tile; place that tile adjacent to any border system that contains your ships. Place a frontier token in the newly placed system if it does not contain any planets.",
      expansion: "BASE", // TODO: Add expansion when it comes out.
      id: "Dark Energy Tap",
      name: "Age of Exploration",
      type: "TECH",
    };
  }

  Object.values(components).forEach((component) => {
    if (component.replaces) {
      delete components[component.replaces];
    }
  });

  return components;
}

export function buildFactions(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const baseFactions: Partial<Record<FactionId, BaseFaction>> = {};
  Object.entries(baseData.factions).forEach(([id, faction]) => {
    const factionId = id as FactionId;
    baseFactions[factionId] = faction;
  });

  const factions: Partial<Record<FactionId, Faction>> = {};
  Object.entries(storedGameData.factions ?? {}).forEach(([id, faction]) => {
    const factionId = id as FactionId;
    const baseFaction = baseFactions[factionId];
    if (!baseFaction) {
      throw new Error("Unable to get base version of faction.");
    }
    factions[factionId] = {
      ...baseFaction,
      ...faction,
    };
  });

  if (Object.keys(factions).includes("Council Keleres")) {
    const councilChoice = new Set<TechId>();
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
export function buildObjectives(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const gameObjectives = storedGameData.objectives ?? {};
  // const secretObjectives: Record<string, GameObjective> =
  //   storedGameData[secret]?.objectives ?? {};
  const expansions = storedGameData.options?.expansions ?? [];

  const objectives: Partial<Record<ObjectiveId, Objective>> = {};
  Object.entries(baseData.objectives ?? {}).forEach(
    ([objectiveId, objective]) => {
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

      objectives[objectiveId as ObjectiveId] = {
        ...objective,
        ...(gameObjectives[objectiveId as ObjectiveId] ?? {}),
        // ...(secretObjectives[objectiveId] ?? {}),
      };
    }
  );

  Object.values(objectives).forEach((objective) => {
    if (objective.replaces) {
      delete objectives[objective.replaces];
    }
  });

  return objectives;
}

function validateMapString(mapString: string) {
  const systemArray = mapString.split(" ");
  switch (systemArray.length) {
    // 3 rings or less
    case 36:
      break;
    // 4 rings
    case 60:
      break;
  }
  for (const system of systemArray) {
    if (isNaN(parseInt(system))) {
      return false;
    }
  }
  // TODO: Load systems and ensure that they are all found.
  return true;
}

export function buildPlanets(
  storedGameData: StoredGameData,
  baseData: BaseData,
  includePurged?: boolean
) {
  const gamePlanets = storedGameData.planets ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameOptions = storedGameData.options;

  const numFactions = Object.keys(gameFactions).length;
  const mapString = getMapString(gameOptions, numFactions) ?? "";
  const validMapString = isValidMapString(mapString, numFactions);
  const inGameSystems = mapString
    .split(" ")
    .filter(validSystemNumber)
    .filter(
      (systemNumber) =>
        systemNumber !== "-1" &&
        systemNumber !== "0" &&
        !isNaN(parseInt(systemNumber))
    )
    .map((system) => parseInt(system) as SystemId);

  let planets = {} as Partial<Record<PlanetId, Planet>>;
  Object.entries(baseData.planets).forEach(([_, planet]) => {
    let isPlanetInMap = planet.system && inGameSystems.includes(planet.system);
    if (planet.id === "Creuss" && inGameSystems.includes(17)) {
      isPlanetInMap = true;
    }
    if (planet.faction && !gameFactions[planet.faction] && !isPlanetInMap) {
      if (!gameFactions["Council Keleres"]) {
        return;
      }
      if (
        !gameFactions["Council Keleres"].startswith.planets?.includes(planet.id)
      ) {
        return;
      }
    }
    if (
      planet.faction &&
      planet.subFaction &&
      gameFactions[planet.faction]?.startswith.faction !== planet.subFaction
    ) {
      return;
    }
    if (
      validMapString &&
      inGameSystems.length > 0 &&
      !isPlanetInMap &&
      planet.system &&
      planet.id !== "Mirage" &&
      planet.id !== "Mallice" &&
      planet.id !== "Mecatol Rex" &&
      !planet.faction
    ) {
      // TODO: Remove once Milty Draft site fixes numbering
      if (typeof planet.system === "number") {
        const maybeSystem = planet.system + 3200;
        if (!inGameSystems.includes(maybeSystem as SystemId)) {
          return;
        }
      } else {
        return;
      }
    }
    // Maybe filter out PoK/DS systems. Only do it this way if not using the map to filter.
    if (
      (!validMapString || inGameSystems.length === 0) &&
      planet.expansion !== "BASE" &&
      planet.expansion !== "BASE ONLY" &&
      !gameOptions.expansions.includes(planet.expansion)
    ) {
      // Check for Argent Flight. Might be able to remedy this in some other way.
      if (
        !gameFactions["Council Keleres"] ||
        !(gameFactions["Council Keleres"]?.startswith?.planets ?? []).includes(
          planet.id
        )
      ) {
        return;
      }
    }

    if (
      !includePurged &&
      gamePlanets[planet.id] &&
      gamePlanets[planet.id]?.state === "PURGED"
    ) {
      return;
    }

    planet = {
      ...planet,
      ...(gamePlanets[planet.id] ?? {}),
    };

    if (planet.faction && isPlanetInMap && !gameFactions[planet.faction]) {
      const attributes = new Set(planet.attributes);
      attributes.add("all-types");
      planet.attributes = Array.from(attributes);
      planet.type = "ALL";
    }

    planets[planet.id] = planet;
  });

  return planets;
}

export function buildRelics(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const gameRelics = storedGameData.relics ?? {};
  const expansions = storedGameData.options.expansions;

  const relics: Partial<Record<RelicId, Relic>> = {};
  Object.entries(baseData.relics).forEach(([relicId, relic]) => {
    // Maybe filter out Codex relics.
    if (!expansions.includes("POK") || !expansions.includes(relic.expansion)) {
      return;
    }

    relics[relicId as RelicId] = {
      ...relic,
      ...(gameRelics[relicId as RelicId] ?? {}),
    };
  });

  return relics;
}

export function buildState(storedGameData: StoredGameData, baseData: BaseData) {
  const state = storedGameData.state;

  if (!state.agendaUnlocked) {
    const mecatol = buildPlanets(storedGameData, baseData)["Mecatol Rex"];
    if (mecatol && mecatol.owner) {
      state.agendaUnlocked = true;
    }
  }
  return state;
}

export function buildStrategyCards(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const strategyCards = storedGameData.strategycards ?? {};

  const cards: Partial<Record<StrategyCardId, StrategyCard>> = {};
  Object.entries(baseData.strategycards).forEach(([cardId, card]) => {
    cards[cardId as StrategyCardId] = {
      ...card,
      ...(strategyCards[cardId as StrategyCardId] ?? {}),
    };
  });

  return cards;
}

export function buildSystems(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  Object.entries(baseData.systems).forEach(([systemId, system]) => {
    if (
      system.expansion !== "BASE" &&
      !storedGameData.options.expansions.includes(system.expansion)
    ) {
      return;
    }

    systems[systemId as SystemId] = {
      ...system,
    };
  });

  return systems;
}

export function buildTechs(storedGameData: StoredGameData, baseData: BaseData) {
  const options = storedGameData.options;

  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(baseData.techs).forEach((tech) => {
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

    techs[tech.id] = techCopy;
  });

  return techs;
}

export function buildLeaders(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const factions = storedGameData.factions;
  const options = storedGameData.options;
  const storedLeaders = storedGameData.leaders ?? {};
  const leaders: Partial<Record<LeaderId, Leader>> = {};
  Object.entries(baseData.leaders).forEach(([leaderId, leader]) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && leader.expansion === "POK") {
      return;
    }
    const leaderCopy = { ...leader };

    // Maybe update techs for codices.
    if (leader.omega && options.expansions.includes(leader.omega.expansion)) {
      leaderCopy.abilityName =
        leader.omega.abilityName ?? leaderCopy.abilityName;
      leaderCopy.name = leader.omega.name ?? leaderCopy.name;
      leaderCopy.description =
        leader.omega.description ?? leaderCopy.description;
      leaderCopy.unlock = leader.omega.unlock ?? leaderCopy.unlock;
      leaderCopy.timing = leader.omega.timing ?? leaderCopy.timing;
    }

    if (
      leader.subFaction &&
      factions["Council Keleres"]?.startswith.faction !== leader.subFaction
    ) {
      return;
    }

    leaders[leaderId as LeaderId] = {
      ...leaderCopy,
      ...(storedLeaders[leaderId as LeaderId] ?? {}),
    };
  });

  return leaders;
}
