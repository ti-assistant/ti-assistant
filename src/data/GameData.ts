import { IntlShape } from "react-intl";
import { getBaseAgendas } from "../../server/data/agendas";
import { getBaseAttachments } from "../../server/data/attachments";
import { getBaseComponents } from "../../server/data/components";
import { getBaseFactions } from "../../server/data/factions";
import { getBaseLeaders } from "../../server/data/leaders";
import { getBaseObjectives } from "../../server/data/objectives";
import { getBasePlanets } from "../../server/data/planets";
import { getBaseRelics } from "../../server/data/relics";
import { getBaseStrategyCards } from "../../server/data/strategyCards";
import { BASE_SYSTEMS } from "../../server/data/systems";
import { getBaseTechs } from "../../server/data/techs";
import { objectEntries } from "../util/util";
import {
  buildCompleteAgendas,
  buildCompleteAttachments,
  buildCompleteComponents,
  buildCompleteFactions,
  buildCompleteGameData,
  buildCompleteLeaders,
  buildCompleteObjectives,
  buildCompletePlanets,
  buildCompleteRelics,
  buildCompleteState,
  buildCompleteStrategyCards,
  buildCompleteSystems,
  buildCompleteTechs,
} from "./gameDataBuilder";

// let getBaseAgendas: DataFunction<AgendaId, BaseAgenda> = () => {
//   return {};
// };
// import("../../server/data/agendas").then((module) => {
//   getBaseAgendas = module.getBaseAgendas;
// });

// let getBaseAttachments: DataFunction<AttachmentId, BaseAttachment> = () => {
//   return {};
// };
// import("../../server/data/attachments").then((module) => {
//   getBaseAttachments = module.getBaseAttachments;
// });

// let getBaseComponents: DataFunction<
//   ComponentId,
//   BaseComponent | BaseTechComponent
// > = () => {
//   return {};
// };
// import("../../server/data/components").then((module) => {
//   getBaseComponents = module.getBaseComponents;
// });

// let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
//   return {};
// };
// import("../../server/data/factions").then((module) => {
//   getBaseFactions = module.getBaseFactions;
// });

// let getBaseLeaders: DataFunction<LeaderId, BaseLeader> = () => {
//   return {};
// };
// import("../../server/data/leaders").then((module) => {
//   getBaseLeaders = module.getBaseLeaders;
// });

// let getBaseObjectives: DataFunction<ObjectiveId, BaseObjective> = () => {
//   return {};
// };
// import("../../server/data/objectives").then((module) => {
//   getBaseObjectives = module.getBaseObjectives;
// });

// let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
// import("../../server/data/planets").then((module) => {
//   BASE_PLANETS = module.BASE_PLANETS;
// });

// let getBaseRelics: DataFunction<RelicId, BaseRelic> = () => {
//   return {};
// };
// import("../../server/data/relics").then((module) => {
//   getBaseRelics = module.getBaseRelics;
// });

// let getBaseStrategyCards: DataFunction<
//   StrategyCardId,
//   BaseStrategyCard
// > = () => {
//   return {};
// };
// import("../../server/data/strategyCards").then((module) => {
//   getBaseStrategyCards = module.getBaseStrategyCards;
// });

// let BASE_SYSTEMS: Partial<Record<SystemId, BaseSystem>> = {};
// import("../../server/data/systems").then((module) => {
//   BASE_SYSTEMS = module.BASE_SYSTEMS;
// });

// let getBaseTechs: DataFunction<TechId, BaseTech> = () => {
//   return {};
// };
// import("../../server/data/techs").then((module) => {
//   getBaseTechs = module.getBaseTechs;
// });

function buildBaseData(intl: IntlShape): BaseData {
  return {
    agendas: getBaseAgendas(intl),
    attachments: getBaseAttachments(intl),
    components: getBaseComponents(intl),
    factions: getBaseFactions(intl),
    leaders: getBaseLeaders(intl),
    objectives: getBaseObjectives(intl),
    planets: getBasePlanets(intl),
    relics: getBaseRelics(intl),
    strategycards: getBaseStrategyCards(intl),
    systems: BASE_SYSTEMS,
    techs: getBaseTechs(intl),
  };
}

export function buildGameData(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);

  return buildCompleteGameData(storedGameData, baseData);
}

export function buildAgendas(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);

  return buildCompleteAgendas(baseData, storedGameData);
}

export function buildAttachments(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const baseData = buildBaseData(intl);

  return buildCompleteAttachments(baseData, storedGameData);
}

export function buildComponents(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const baseData = buildBaseData(intl);

  return buildCompleteComponents(baseData, storedGameData);
}

export function buildFactions(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);

  return buildCompleteFactions(baseData, storedGameData);
}

// TODO: Fix secrets (or remove ability to reveal them)
export function buildObjectives(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const baseData = buildBaseData(intl);

  return buildCompleteObjectives(baseData, storedGameData);
}

export function buildPlanets(
  storedGameData: StoredGameData,
  intl: IntlShape,
  includePurged?: boolean
) {
  const baseData = buildBaseData(intl);

  return buildCompletePlanets(baseData, storedGameData, includePurged);
}

export function buildRelics(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);
  return buildCompleteRelics(baseData, storedGameData);
}

export function buildState(storedGameData: StoredGameData) {
  return buildCompleteState(storedGameData);
}

export function buildStrategyCards(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const baseData = buildBaseData(intl);

  return buildCompleteStrategyCards(baseData, storedGameData);
}

export function buildSystems(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);
  return buildCompleteSystems(baseData, storedGameData);
}

export function buildTechs(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);
  return buildCompleteTechs(baseData, storedGameData);
}

export function buildLeaders(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);

  return buildCompleteLeaders(baseData, storedGameData);
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
    const omegas = tech.omegas ?? [];
    for (const omega of omegas) {
      if (!options.expansions.includes(omega.expansion)) {
        continue;
      }
      techCopy.name = omega.name;
      techCopy.description = omega.description;
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
