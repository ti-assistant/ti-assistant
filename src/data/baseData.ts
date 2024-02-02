import { IntlShape } from "react-intl";
import { getBaseFactions } from "../../server/data/factions";
import { getBaseAgendas } from "../../server/data/agendas";
import { getBaseAttachments } from "../../server/data/attachments";
import { getBaseComponents } from "../../server/data/components";
import { getBaseObjectives } from "../../server/data/objectives";
import { BASE_PLANETS } from "../../server/data/planets";
import { getBaseRelics } from "../../server/data/relics";
import { getBaseStrategyCards } from "../../server/data/strategyCards";
import { BASE_SYSTEMS } from "../../server/data/systems";
import { getBaseTechs } from "../../server/data/techs";
import { getBaseLeaders } from "../../server/data/leaders";

export function getBaseData(intl: IntlShape): BaseData {
  return {
    agendas: getBaseAgendas(intl),
    attachments: getBaseAttachments(intl),
    components: getBaseComponents(intl),
    factions: getBaseFactions(intl),
    leaders: getBaseLeaders(intl),
    objectives: getBaseObjectives(intl),
    planets: BASE_PLANETS,
    relics: getBaseRelics(intl),
    strategycards: getBaseStrategyCards(intl),
    systems: BASE_SYSTEMS,
    techs: getBaseTechs(intl),
  };
}
