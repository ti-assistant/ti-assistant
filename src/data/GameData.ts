import { IntlShape } from "react-intl";
import { getActionCards } from "../../server/data/actionCards";
import { getAgendas } from "../../server/data/agendas";
import { getAttachments } from "../../server/data/attachments";
import { getComponents } from "../../server/data/components";
import { getEvents } from "../../server/data/events";
import { getFactions } from "../../server/data/factions";
import { getLeaders } from "../../server/data/leaders";
import { getObjectives } from "../../server/data/objectives";
import { getPlanets } from "../../server/data/planets";
import { getRelics } from "../../server/data/relics";
import { getStrategyCards } from "../../server/data/strategyCards";
import { getSystems } from "../../server/data/systems";
import { getTechs } from "../../server/data/techs";
import { buildMergeFunction } from "../util/expansions";
import { objectEntries } from "../util/util";
import {
  buildCompleteActionCards,
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

export function buildBaseData(intl: IntlShape): BaseData {
  return {
    actionCards: getActionCards(intl),
    agendas: getAgendas(intl),
    attachments: getAttachments(intl),
    components: getComponents(intl),
    events: getEvents(intl),
    factions: getFactions(intl),
    leaders: getLeaders(intl),
    objectives: getObjectives(intl),
    planets: getPlanets(intl),
    relics: getRelics(intl),
    strategycards: getStrategyCards(intl),
    systems: getSystems(),
    techs: getTechs(intl),
  };
}

export function buildGameData(storedGameData: StoredGameData, intl: IntlShape) {
  const baseData = buildBaseData(intl);

  return buildCompleteGameData(storedGameData, baseData);
}

export function buildActionCards(
  storedGameData: StoredGameData,
  intl: IntlShape
) {
  const baseData = buildBaseData(intl);

  return buildCompleteActionCards(baseData, storedGameData);
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

  const omegaMergeFn = buildMergeFunction(options.expansions);

  Object.values(getTechs(intl)).forEach((tech) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && tech.expansion === "POK") {
      return;
    }

    techs[tech.id] = omegaMergeFn(tech);
  });

  // Handle replacement.
  for (const tech of Object.values(techs)) {
    if (tech.type !== "UPGRADE" && tech.deprecates) {
      delete techs[tech.deprecates];
    }
  }

  return techs;
}

export function buildBaseLeaders(options: Options, intl: IntlShape) {
  const leaders: Record<string, BaseLeader> = {};
  const omegaMergeFn = buildMergeFunction(options.expansions);
  objectEntries(getLeaders(intl)).forEach(([leaderId, leader]) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && leader.expansion === "POK") {
      return;
    }

    leaders[leaderId] = omegaMergeFn(leader);
  });

  return leaders;
}

export function buildBaseSystems() {
  const systems: Partial<Record<SystemId, BaseSystem>> = {};
  objectEntries(getSystems()).forEach(([systemId, system]) => {
    systems[systemId] = {
      ...system,
    };
  });

  return systems;
}
