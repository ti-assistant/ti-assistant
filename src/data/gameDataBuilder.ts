import { isValidMapString, validSystemNumber } from "../util/map";
import { getMapString } from "../util/options";
import { objectEntries } from "../util/util";

export function buildCompleteGameData(
  storedGameData: StoredGameData,
  baseData: BaseData
) {
  const completeGameData: GameData = {
    actionCards: buildCompleteActionCards(baseData, storedGameData),
    actionLog: storedGameData.actionLog,
    agendas: buildCompleteAgendas(baseData, storedGameData),
    attachments: buildCompleteAttachments(baseData, storedGameData),
    components: buildCompleteComponents(baseData, storedGameData),
    expedition: storedGameData.expedition,
    factions: buildCompleteFactions(baseData, storedGameData),
    leaders: buildCompleteLeaders(baseData, storedGameData),
    objectives: buildCompleteObjectives(baseData, storedGameData),
    options: storedGameData.options,
    planets: buildCompletePlanets(baseData, storedGameData),
    relics: buildCompleteRelics(baseData, storedGameData),
    sequenceNum: storedGameData.sequenceNum,
    state: buildCompleteState(storedGameData),
    strategycards: buildCompleteStrategyCards(baseData, storedGameData),
    systems: buildCompleteSystems(baseData, storedGameData),
    techs: buildCompleteTechs(baseData, storedGameData),
    timers: storedGameData.timers,

    allPlanets: buildCompletePlanets(baseData, storedGameData, true),
  };

  return completeGameData;
}

export function buildCompleteActionCards(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const actionCards: Partial<Record<ActionCardId, ActionCard>> = {};

  const expansions = storedGameData.options.expansions;
  const gameActionCards = storedGameData.actionCards ?? {};

  objectEntries(baseData.actionCards).forEach(([actionCardId, actionCard]) => {
    if (
      actionCard.expansion !== "BASE" &&
      !expansions.includes(actionCard.expansion)
    ) {
      return;
    }

    actionCards[actionCardId] = {
      ...actionCard,
      ...(gameActionCards[actionCardId] ?? {}),
    };
  });

  return actionCards;
}

export function buildCompleteAgendas(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const agendas: Partial<Record<AgendaId, Agenda>> = {};

  const expansions = storedGameData.options.expansions;
  const gameAgendas = storedGameData.agendas ?? {};

  objectEntries(baseData.agendas).forEach(([agendaId, agenda]) => {
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

export function buildCompleteAttachments(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const gameAttachments = storedGameData.attachments ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const expansions = storedGameData.options.expansions;

  const attachments: Partial<Record<AttachmentId, Attachment>> = {};
  objectEntries(baseData.attachments).forEach(([attachmentId, attachment]) => {
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

export function buildCompleteComponents(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const gameComponents = storedGameData.components ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameRelics = storedGameData.relics ?? {};

  const expansions = storedGameData.options.expansions;
  const events = storedGameData.options.events ?? [];

  let components: Record<string, Component> = {};
  Object.entries(baseData.components).forEach(([componentId, component]) => {
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

    // Filter out event components.
    if (component.event && !events.includes(component.event)) {
      return;
    }

    components[componentId] = {
      ...component,
      ...(gameComponents[componentId] ?? {}),
    };
  });

  const componentLeaders = objectEntries(baseData.leaders)
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

  // objectEntries(baseData.relics)
  //   .filter(([_, relic]) => relic.timing === "COMPONENT_ACTION")
  //   .forEach(([relicId, relic]) => {
  //     if (!expansions.includes("POK")) {
  //       return;
  //     }
  //     // Maybe filter out Codex Two relics.
  //     if (!expansions.includes(relic.expansion)) {
  //       return;
  //     }

  //     components[relicId] = {
  //       ...relic,
  //       ...(gameComponents[relicId] ?? {}),
  //       ...(gameRelics[relicId] ?? {}),
  //       type: "RELIC",
  //     };
  //   });

  // Faction breakthroughs
  if (expansions.includes("THUNDERS EDGE")) {
    objectEntries(baseData.factions).map(([factionId, faction]) => {
      if (faction.breakthrough?.timing === "COMPONENT_ACTION") {
        components[faction.breakthrough.id] = {
          ...faction.breakthrough,
          expansion: "THUNDERS EDGE",
          faction: factionId,
          type: "BREAKTHROUGH",
        };
      }
    });
  }

  Object.values(components).forEach((component) => {
    if (component.replaces) {
      delete components[component.replaces];
    }
  });

  return components;
}

export function buildCompleteFactions(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const factions: Partial<Record<FactionId, Faction>> = {};
  objectEntries(storedGameData.factions).forEach(([id, faction]) => {
    const factionId = id;
    const baseFaction = baseData.factions[factionId];
    if (!baseFaction) {
      throw new Error("Unable to get base version of faction.");
    }
    const breakthrough = {
      ...baseFaction.breakthrough,
      ...faction.breakthrough,
    };
    factions[factionId] = {
      ...baseFaction,
      ...faction,
      breakthrough,
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
export function buildCompleteObjectives(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const gameObjectives = storedGameData.objectives ?? {};
  const expansions = storedGameData.options.expansions;
  const events = storedGameData.options.events ?? [];

  const objectives: Partial<Record<ObjectiveId, Objective>> = {};
  objectEntries(baseData.objectives).forEach(([objectiveId, objective]) => {
    // Maybe filter out PoK objectives.
    if (!expansions.includes("POK") && objective.expansion === "POK") {
      return;
    }
    // Filter out objectives that are removed by PoK.
    if (expansions.includes("POK") && objective.expansion === "BASE ONLY") {
      return;
    }

    // Filter out event objectives.
    if (objective.event && !events.includes(objective.event)) {
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

export function buildCompletePlanets(
  baseData: BaseData,
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
  objectEntries(baseData.planets).forEach(([_, planet]) => {
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
      !planet.alwaysInclude &&
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

    if (
      planet.alwaysInclude &&
      planet.expansion !== "BASE" &&
      !gameOptions.expansions.includes(planet.expansion)
    ) {
      return;
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

export function buildCompleteRelics(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const gameRelics = storedGameData.relics ?? {};
  const expansions = storedGameData.options.expansions;

  const relics: Partial<Record<RelicId, Relic>> = {};
  objectEntries(baseData.relics).forEach(([relicId, relic]) => {
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

export function buildCompleteState(storedGameData: StoredGameData) {
  const state = storedGameData.state;

  if (!state.agendaUnlocked) {
    const mecatol = storedGameData.planets["Mecatol Rex"];
    if (mecatol && mecatol.owner) {
      state.agendaUnlocked = true;
    }
  }
  return state;
}

export function buildCompleteStrategyCards(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const strategyCards = storedGameData.strategycards ?? {};

  const cards: Partial<Record<StrategyCardId, StrategyCard>> = {};
  objectEntries(baseData.strategycards).forEach(([cardId, card]) => {
    cards[cardId] = {
      ...card,
      ...(strategyCards[cardId] ?? {}),
    };
  });

  return cards;
}

export function buildCompleteSystems(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  objectEntries(baseData.systems).forEach(([systemId, system]) => {
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

export function buildCompleteTechs(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const options = storedGameData.options;

  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(baseData.techs).forEach((tech) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && tech.expansion === "POK") {
      return;
    }
    const techCopy = { ...tech };

    // Maybe update techs for codices.
    const omegas = tech.omegas ?? [];
    for (const omega of omegas) {
      if (!options.expansions.includes(omega.expansion)) {
        continue;
      }
      techCopy.name = omega.name;
      techCopy.description = omega.description;
      techCopy.expansion = omega.expansion;
    }

    techs[tech.id] = techCopy;
  });

  return techs;
}

export function buildCompleteLeaders(
  baseData: BaseData,
  storedGameData: StoredGameData
) {
  const factions = storedGameData.factions;
  const options = storedGameData.options;
  const storedLeaders = storedGameData.leaders ?? {};
  const leaders: Partial<Record<LeaderId, Leader>> = {};
  objectEntries(baseData.leaders).forEach(([leaderId, leader]) => {
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
