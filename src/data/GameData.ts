import { IntlShape } from "react-intl";
import { getAbilities } from "../../server/data/abilities";
import { getActionCards } from "../../server/data/actionCards";
import { getAgendas } from "../../server/data/agendas";
import { getAttachments } from "../../server/data/attachments";
import { BASE_COLORS } from "../../server/data/colors";
import { getComponents } from "../../server/data/components";
import { getEdicts } from "../../server/data/edicts";
import { getEvents } from "../../server/data/events";
import { getFactions } from "../../server/data/factions";
import { getGenomes } from "../../server/data/genomes";
import { getLeaders } from "../../server/data/leaders";
import { getObjectives } from "../../server/data/objectives";
import { getParadigms } from "../../server/data/paradigms";
import { getPlanets } from "../../server/data/planets";
import { getRelics } from "../../server/data/relics";
import { getStrategyCards } from "../../server/data/strategyCards";
import { getSystems } from "../../server/data/systems";
import { getTechs } from "../../server/data/techs";
import { getUnitUpgrades } from "../../server/data/upgrades";
import {
  buildCompleteActionCards,
  buildCompleteAgendas,
  buildCompleteAttachments,
  buildCompleteComponents,
  buildCompleteFactions,
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
    colors: BASE_COLORS,
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

    abilities: getAbilities(intl),
    edicts: getEdicts(intl),
    genomes: getGenomes(intl),
    paradigms: getParadigms(intl),
    upgrades: getUnitUpgrades(intl),
  };
}

export function buildActionCards(
  storedGameData: StoredGameData,
  intl: IntlShape,
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
  intl: IntlShape,
) {
  const baseData = buildBaseData(intl);

  return buildCompleteAttachments(baseData, storedGameData);
}

export function buildComponents(
  storedGameData: StoredGameData,
  intl: IntlShape,
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
  intl: IntlShape,
) {
  const baseData = buildBaseData(intl);

  return buildCompleteObjectives(baseData, storedGameData);
}

export function buildPlanets(
  storedGameData: StoredGameData,
  intl: IntlShape,
  includePurged?: boolean,
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
  intl: IntlShape,
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
