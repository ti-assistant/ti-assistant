import { IntlShape } from "react-intl";
import { getAgendas } from "../../server/data/agendas";
import { getAttachments } from "../../server/data/attachments";
import { getComponents } from "../../server/data/components";
import { getFactions } from "../../server/data/factions";
import { getLeaders } from "../../server/data/leaders";
import { getObjectives } from "../../server/data/objectives";
import { getPlanets } from "../../server/data/planets";
import { getRelics } from "../../server/data/relics";
import { getStrategyCards } from "../../server/data/strategyCards";
import { getSystems } from "../../server/data/systems";
import { getTechs } from "../../server/data/techs";
import { getEvents } from "../../server/data/events";
import { getActionCards } from "../../server/data/actionCards";
import { getAbilities } from "../../server/data/abilities";
import { getGenomes } from "../../server/data/genomes";
import { getParadigms } from "../../server/data/paradigms";
import { getUnitUpgrades } from "../../server/data/upgrades";
import { BASE_COLORS } from "../../server/data/colors";

export function getBaseData(intl: IntlShape): BaseData {
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
    // Twilight's Fall
    abilities: getAbilities(intl),
    genomes: getGenomes(intl),
    paradigms: getParadigms(intl),
    upgrades: getUnitUpgrades(intl),
  };
}
