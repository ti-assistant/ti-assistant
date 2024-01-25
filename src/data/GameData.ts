import stableHash from "stable-hash";
import useSWR from "swr";
import { BASE_OPTIONS } from "../../server/data/options";
import { fetcher } from "../util/api/util";
import { validateMapString } from "../util/util";
import { IntlShape, useIntl } from "react-intl";

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

let BASE_COMPONENTS: Partial<
  Record<ComponentId, BaseComponent | BaseTechComponent>
> = {};
import("../../server/data/components").then((module) => {
  BASE_COMPONENTS = module.BASE_COMPONENTS;
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

let BASE_TECHS: Partial<Record<TechId, BaseTech>> = {};
import("../../server/data/techs").then((module) => {
  BASE_TECHS = module.BASE_TECHS;
});

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
  paths: string[]
): GameData {
  const { data: storedGameData }: { data?: StoredGameData } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    () => fetcher(`/api/${gameid}/data`),
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

  const intl = useIntl();

  if (!storedGameData) {
    return {
      agendas: getBaseAgendas(intl),
      attachments: getBaseAttachments(intl),
      components: BASE_COMPONENTS,
      factions: {},
      objectives: getBaseObjectives(intl),
      options: BASE_OPTIONS,
      planets: BASE_PLANETS,
      relics: getBaseRelics(intl),
      state: {
        phase: "UNKNOWN",
        round: 1,
        speaker: "Vuil'raith Cabal",
      },
      strategycards: getBaseStrategyCards(intl),
      systems: BASE_SYSTEMS,
      techs: BASE_TECHS,
    };
  }
  return buildCompleteGameData(storedGameData, intl);
  // }, [latestChange]);

  // const completeGameData = buildCompleteGameData(storedGameData);

  // return completeGameData;
}

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
    objectives: buildObjectives(storedGameData, intl),
    options: storedGameData.options,
    planets: buildPlanets(storedGameData),
    relics: buildRelics(storedGameData, intl),
    state: buildState(storedGameData),
    strategycards: buildStrategyCards(storedGameData, intl),
    systems: buildSystems(storedGameData),
    techs: buildTechs(storedGameData),
  };

  return completeGameData;
}

export function buildAgendas(storedGameData: StoredGameData, intl: IntlShape) {
  const gameAgendas = storedGameData.agendas ?? {};

  const agendas: Partial<Record<AgendaId, Agenda>> = {};

  const expansions = storedGameData.options.expansions;

  Object.entries(getBaseAgendas(intl)).forEach(([agendaId, agenda]) => {
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
  intl: IntlShape
) {
  const gameAttachments = storedGameData.attachments ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const expansions = storedGameData.options.expansions;

  const attachments: Partial<Record<AttachmentId, Attachment>> = {};
  Object.entries(getBaseAttachments(intl)).forEach(
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
  intl: IntlShape
) {
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

  const componentLeaders = Object.entries(getBaseLeaders(intl))
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

  Object.entries(getBaseRelics(intl))
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

  Object.values(components).forEach((component) => {
    if (component.replaces) {
      delete components[component.replaces];
    }
  });

  return components;
}

export function buildFactions(storedGameData: StoredGameData, intl: IntlShape) {
  const baseFactions: Partial<Record<FactionId, BaseFaction>> = {};
  Object.entries(getBaseFactions(intl)).forEach(([id, faction]) => {
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
    throw new Error("Unable to get base version of faction.");
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
  Object.entries(getBaseObjectives(intl)).forEach(
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

export function buildPlanets(storedGameData: StoredGameData) {
  const gamePlanets = storedGameData.planets ?? {};
  const gameFactions = storedGameData.factions ?? {};
  const gameOptions = storedGameData.options;

  const mapString = gameOptions["map-string"] ?? "";
  const isValidMapString = validateMapString(mapString);
  const inGameSystems = mapString
    .split(" ")
    .map((system) => parseInt(system) as SystemId);

  let planets = {} as Partial<Record<PlanetId, Planet>>;
  Object.entries(BASE_PLANETS).forEach(([_, planet]) => {
    if (planet.faction && !gameFactions[planet.faction]) {
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
      isValidMapString &&
      planet.system &&
      planet.id !== "Mirage" &&
      planet.id !== "Mallice" &&
      planet.id !== "Mecatol Rex" &&
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
          planet.id
        )
      ) {
        return;
      }
    }

    if (gamePlanets[planet.id] && gamePlanets[planet.id]?.state === "PURGED") {
      return;
    }

    planet = {
      ...planet,
      ...(gamePlanets[planet.id] ?? {}),
    };

    planets[planet.id] = planet;
  });

  return planets;
}

export function buildRelics(storedGameData: StoredGameData, intl: IntlShape) {
  const gameRelics = storedGameData.relics ?? {};
  const expansions = storedGameData.options.expansions;

  const relics: Partial<Record<RelicId, Relic>> = {};
  Object.entries(getBaseRelics(intl)).forEach(([relicId, relic]) => {
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
  Object.entries(getBaseStrategyCards(intl)).forEach(([cardId, card]) => {
    cards[cardId as StrategyCardId] = {
      ...card,
      ...(strategyCards[cardId as StrategyCardId] ?? {}),
    };
  });

  return cards;
}

export function buildSystems(storedGameData: StoredGameData) {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  Object.entries(BASE_SYSTEMS).forEach(([systemId, system]) => {
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

export function buildTechs(storedGameData: StoredGameData) {
  const options = storedGameData.options;

  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(BASE_TECHS).forEach((tech) => {
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

export function buildBaseTechs(options: Options) {
  const techs: Partial<Record<TechId, Tech>> = {};
  Object.values(BASE_TECHS).forEach((tech) => {
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

export function buildLeaders(options: Options, intl: IntlShape) {
  const leaders: Record<string, BaseLeader> = {};
  Object.entries(getBaseLeaders(intl)).forEach(([leaderId, leader]) => {
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
