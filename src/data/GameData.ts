import { IntlShape } from "react-intl";
import { isValidMapString, validSystemNumber } from "../util/map";
import { getMapString } from "../util/options";
import { objectEntries } from "../util/util";

let getBaseAgendas: DataFunction<AgendaId, BaseAgenda> = () => {
  return {};
};
import("../../server/data/agendas").then((module) => {
  getBaseAgendas = module.getBaseAgendas;
});

let getBaseAttachments: DataFunction<AttachmentId, BaseAttachment> = () => {
  return {};
};
import("../../server/data/attachments").then((module) => {
  getBaseAttachments = module.getBaseAttachments;
});

let getBaseComponents: DataFunction<
  ComponentId,
  BaseComponent | BaseTechComponent
> = () => {
  return {};
};
import("../../server/data/components").then((module) => {
  getBaseComponents = module.getBaseComponents;
});

let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
  return {};
};
import("../../server/data/factions").then((module) => {
  getBaseFactions = module.getBaseFactions;
});

let getBaseLeaders: DataFunction<LeaderId, BaseLeader> = () => {
  return {};
};
import("../../server/data/leaders").then((module) => {
  getBaseLeaders = module.getBaseLeaders;
});

let getBaseObjectives: DataFunction<ObjectiveId, BaseObjective> = () => {
  return {};
};
import("../../server/data/objectives").then((module) => {
  getBaseObjectives = module.getBaseObjectives;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../../server/data/planets").then((module) => {
  BASE_PLANETS = module.BASE_PLANETS;
});

let getBaseRelics: DataFunction<RelicId, BaseRelic> = () => {
  return {};
};
import("../../server/data/relics").then((module) => {
  getBaseRelics = module.getBaseRelics;
});

let getBaseStrategyCards: DataFunction<
  StrategyCardId,
  BaseStrategyCard
> = () => {
  return {};
};
import("../../server/data/strategyCards").then((module) => {
  getBaseStrategyCards = module.getBaseStrategyCards;
});

let BASE_SYSTEMS: Partial<Record<SystemId, BaseSystem>> = {};
import("../../server/data/systems").then((module) => {
  BASE_SYSTEMS = module.BASE_SYSTEMS;
});

let getBaseTechs: DataFunction<TechId, BaseTech> = () => {
  return {};
};
import("../../server/data/techs").then((module) => {
  getBaseTechs = module.getBaseTechs;
});

export function buildCompleteGameData(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const completeGameData: GameData = {
    actionLog: storedGameData.actionLog,
    agendas: buildAgendas(storedGameData, intl),
    attachments: buildAttachments(storedGameData, intl),
    components: buildComponents(storedGameData, intl),
    factions: buildFactions(storedGameData, intl),
    leaders: buildLeaders(storedGameData, intl),
    objectives: buildObjectives(storedGameData, intl),
    options: storedGameData.options,
    planets: buildPlanets(storedGameData),
    relics: buildRelics(storedGameData, intl),
    sequenceNum: storedGameData.sequenceNum,
    state: buildState(storedGameData),
    strategycards: buildStrategyCards(storedGameData, intl),
    systems: buildSystems(storedGameData),
    techs: buildTechs(storedGameData, intl),

    allPlanets: buildPlanets(storedGameData, true),
  };

  return completeGameData;
}

export function buildAgendas(storedGameData: StoredGameData, intl: IntlShape) {
  const gameAgendas = storedGameData.agendas ?? {};

  const agendas: Partial<Record<AgendaId, Agenda>> = {};

  const expansions = storedGameData.options.expansions;

  objectEntries(getBaseAgendas(intl)).forEach(([agendaId, agenda]) => {
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

export function buildAttachments(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const gameAttachments = storedGameData.attachments ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const expansions = storedGameData.options.expansions;

  const attachments: Partial<Record<AttachmentId, Attachment>> = {};
  objectEntries(getBaseAttachments(intl)).forEach(
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

      attachments[attachmentId] = {
        ...attachment,
        ...(gameAttachments[attachmentId] ?? {}),
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
  intl: IntlShape
) {
  const gameComponents = storedGameData.components ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameRelics = storedGameData.relics ?? {};

  const expansions = storedGameData.options.expansions;

  let components: Record<string, Component> = {};
  objectEntries(getBaseComponents(intl)).forEach(([componentId, component]) => {
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

  const componentLeaders = objectEntries(getBaseLeaders(intl))
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

  objectEntries(getBaseRelics(intl))
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

  if (storedGameData.options.expansions.includes("CODEX FOUR")) {
    const events = storedGameData.options.events ?? [];
    if (events.includes("Age of Exploration")) {
      components["Age of Exploration"] = {
        description:
          "ACTION: Exhaust DARK ENERGY TAP and choose a non-home edge system that contains your ships to roll 1 die. On a result of 1-4, draw a random unused red tile; on a result of 5-10, draw a random unused blue tile. Place that tile adjacent to the chosen system so that it is touching at least 2 non-home systems. Place a frontier token in the system if it does not contain any planets.",
        expansion: "CODEX FOUR",
        id: "Age of Exploration",
        name: "Age of Exploration",
        type: "EVENT",
      };
    }
    if (events.includes("Total War")) {
      components["Total War"] = {
        description:
          "ACTION: Discard 10 commodities from planets in your home system to gain 1 victory point.",
        expansion: "CODEX FOUR",
        id: "Total War",
        name: "Total War",
        type: "EVENT",
      };
    }
  }

  Object.values(components).forEach((component) => {
    if (component.replaces) {
      delete components[component.replaces];
    }
  });

  return components;
}

export function buildFactions(storedGameData: StoredGameData, intl: IntlShape) {
  const baseFactions: Partial<Record<FactionId, BaseFaction>> = {};
  objectEntries(getBaseFactions(intl)).forEach(([id, faction]) => {
    const factionId = id;
    baseFactions[factionId] = faction;
  });

  const factions: Partial<Record<FactionId, Faction>> = {};
  objectEntries(storedGameData.factions).forEach(([id, faction]) => {
    const factionId = id;
    const baseFaction = baseFactions[factionId];
    if (!baseFaction) {
      throw new Error(`Unable to get base version of faction ${factionId}.`);
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

export function buildFaction(
  factionId: FactionId,
  options: Options,
  intl: IntlShape
): BaseFaction {
  const localFactions = {
    ...getBaseFactions(intl),
  };
  const baseFaction = localFactions[factionId];
  if (!baseFaction) {
    throw new Error(`Unable to get base version of faction ${factionId}.`);
  }

  const promissories: PromissoryNote[] = [];
  for (const promissory of baseFaction.promissories ?? []) {
    const localPromissory = { ...promissory };
    if (
      promissory.omega &&
      options.expansions.includes(promissory.omega.expansion)
    ) {
      localPromissory.description =
        promissory.omega.description ?? promissory.description;
      localPromissory.name = promissory.omega.name ?? promissory.name;
    }
    promissories.push(localPromissory);
  }
  baseFaction.promissories = promissories;

  const units: Unit[] = [];
  for (const unit of baseFaction.units ?? []) {
    const localUnit = { ...unit };
    if (
      unit.expansion !== "BASE" &&
      !options.expansions.includes(unit.expansion)
    ) {
      continue;
    }
    if (unit.omega && options.expansions.includes(unit.omega.expansion)) {
      localUnit.abilities = unit.omega.abilities ?? unit.abilities;
      localUnit.description = unit.omega.description ?? unit.description;
      localUnit.name = unit.omega.name ?? unit.name;
      localUnit.stats = unit.omega.stats ?? unit.stats;
      localUnit.type = unit.omega.type ?? unit.type;
      localUnit.upgrade = unit.omega.upgrade ?? unit.upgrade;
    }
    units.push(localUnit);
  }
  baseFaction.units = units;

  return baseFaction;
}

// TODO: Fix secrets (or remove ability to reveal them)
export function buildObjectives(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const gameObjectives = storedGameData.objectives ?? {};
  // const secretObjectives: Record<string, GameObjective> =
  //   storedGameData[secret]?.objectives ?? {};
  const expansions = storedGameData.options?.expansions ?? [];

  const objectives: Partial<Record<ObjectiveId, Objective>> = {};
  objectEntries(getBaseObjectives(intl)).forEach(([objectiveId, objective]) => {
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
    };
  });

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

  let planets: Partial<Record<PlanetId, Planet>> = {};
  objectEntries(BASE_PLANETS).forEach(([_, planet]) => {
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

export function buildRelics(storedGameData: StoredGameData, intl: IntlShape) {
  const gameRelics = storedGameData.relics ?? {};
  const expansions = storedGameData.options.expansions;

  const relics: Partial<Record<RelicId, Relic>> = {};
  objectEntries(getBaseRelics(intl)).forEach(([relicId, relic]) => {
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

export function buildStrategyCards(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const strategyCards = storedGameData.strategycards ?? {};

  const cards: Partial<Record<StrategyCardId, StrategyCard>> = {};
  objectEntries(getBaseStrategyCards(intl)).forEach(([cardId, card]) => {
    cards[cardId] = {
      ...card,
      ...(strategyCards[cardId] ?? {}),
    };
  });

  return cards;
}

export function buildSystems(storedGameData: StoredGameData) {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  objectEntries(BASE_SYSTEMS).forEach(([systemId, system]) => {
    if (
      system.expansion !== "BASE" &&
      !storedGameData.options.expansions.includes(system.expansion)
    ) {
      return;
    }

    systems[systemId] = {
      ...system,
    };
  });

  return systems;
}

export function buildTechs(storedGameData: StoredGameData, intl: IntlShape) {
  const options = storedGameData.options;

  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(getBaseTechs(intl)).forEach((tech) => {
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

export function buildLeaders(storedGameData: StoredGameData, intl: IntlShape) {
  const factions = storedGameData.factions;
  const options = storedGameData.options;
  const storedLeaders = storedGameData.leaders ?? {};

  const leaders: Record<string, Leader> = {};
  objectEntries(getBaseLeaders(intl)).forEach(([leaderId, leader]) => {
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

    leaders[leaderId] = {
      ...leaderCopy,
      ...(storedLeaders[leaderId] ?? {}),
    };
  });

  return leaders;
}

export function buildBaseTechs(options: Options, intl: IntlShape) {
  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(getBaseTechs(intl)).forEach((tech) => {
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

export function buildBaseLeaders(options: Options, intl: IntlShape) {
  const leaders: Record<string, BaseLeader> = {};
  objectEntries(getBaseLeaders(intl)).forEach(([leaderId, leader]) => {
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

    leaders[leaderId] = leaderCopy;
  });

  return leaders;
}

export function buildBaseSystems() {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  objectEntries(BASE_SYSTEMS).forEach(([systemId, system]) => {
    systems[systemId] = {
      ...system,
    };
  });

  return systems;
}
