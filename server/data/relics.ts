import { IntlShape } from "react-intl";
import { getBaseDiscordantStarsRelics } from "./discordantstars/relics";

export function getBaseRelics(intl: IntlShape): Record<RelicId, BaseRelic> {
  return {
    "Dominus Orb": {
      description: intl.formatMessage({
        id: "Relics.Dominus Orb.Description",
        description: "Description for Relic: Dominus Orb",
        defaultMessage:
          "Before you move units during a tactical action, you may purge this card to move and transport units that are in systems that contain 1 of your command tokens.",
      }),
      expansion: "POK",
      id: "Dominus Orb",
      name: intl.formatMessage({
        id: "Relics.Dominus Orb.Title",
        description: "Title of Relic: Dominus Orb",
        defaultMessage: "Dominus Orb",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Dynamis Core": {
      description: intl.formatMessage(
        {
          id: "Relics.Dynamis Core.Description",
          description: "Description for Relic: Dynamis Core",
          defaultMessage:
            "While this card is in your play area, your commodity value is increased by 2.{br}ACTION: Purge this card to gain trade goods equal to your printed commodity value +2.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX TWO",
      id: "Dynamis Core",
      name: intl.formatMessage({
        id: "Relics.Dynamis Core.Title",
        description: "Title of Relic: Dynamis Core",
        defaultMessage: "Dynamis Core",
      }),
      timing: "COMPONENT_ACTION",
    },
    "JR-XS455-O": {
      description: intl.formatMessage({
        id: "Relics.JR-XS455-O.Description",
        description: "Description for Relic: JR-XS455-O",
        defaultMessage:
          "ACTION: Exhaust this agent and choose a player; that player may spend 3 resources to place a structure on a planet they control. If they do not, they gain 1 trade good.",
      }),
      expansion: "CODEX TWO",
      id: "JR-XS455-O",
      name: intl.formatMessage({
        id: "Relics.JR-XS455-O.Title",
        description: "Title of Relic: JR-XS455-O",
        defaultMessage: "JR-XS455-O",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Maw of Worlds": {
      description: intl.formatMessage({
        id: "Relics.Maw of Worlds.Description",
        description: "Description for Relic: Maw of Worlds",
        defaultMessage:
          "At the start of the agenda phase, you may purge this card and exhaust all of your planets to gain any 1 technology.",
      }),
      expansion: "POK",
      id: "Maw of Worlds",
      name: intl.formatMessage({
        id: "Relics.Maw of Worlds.Title",
        description: "Title of Relic: Maw of Worlds",
        defaultMessage: "Maw of Worlds",
      }),
      timing: "AGENDA_PHASE_START",
    },
    "Nano-Forge": {
      description: intl.formatMessage({
        id: "Relics.Nano-Forge.Description",
        description: "Description for Relic: Nano-Forge",
        defaultMessage:
          "ACTION: Attach this card to a non-legendary, non-home planet you control; its resource and influence values are increased by 2 and it is a legendary planet.",
      }),
      expansion: "CODEX TWO",
      id: "Nano-Forge",
      name: intl.formatMessage({
        id: "Relics.Nano-Forge.Title",
        description: "Title of Relic: Nano-Forge",
        defaultMessage: "Nano-Forge",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Scepter of Emelpar": {
      description: intl.formatMessage({
        id: "Relics.Scepter of Emelpar.Description",
        description: "Description for Relic: Scepter of Emelpar",
        defaultMessage:
          "When you would spend a token from your strategy pool, you may exhaust this card to spend a token from your reinforcements instead.",
      }),
      expansion: "POK",
      id: "Scepter of Emelpar",
      name: intl.formatMessage({
        id: "Relics.Scepter of Emelpar.Title",
        description: "Title of Relic: Scepter of Emelpar",
        defaultMessage: "Scepter of Emelpar",
      }),
      timing: "PASSIVE",
    },
    "Shard of the Throne": {
      description: intl.formatMessage(
        {
          id: "Relics.Shard of the Throne.Description",
          description: "Description for Relic: Shard of the Throne",
          defaultMessage:
            "When you gain this card, gain 1 victory point. When you lose this card, lose 1 victory point.{br}When a player gains control of a legendary planet you control, or a planet you control in your home system, that player gains this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Shard of the Throne",
      name: intl.formatMessage({
        id: "Relics.Shard of the Throne.Title",
        description: "Title of Relic: Shard of the Throne",
        defaultMessage: "Shard of the Throne",
      }),
      timing: "PASSIVE",
    },
    "Stellar Converter": {
      description: intl.formatMessage({
        id: "Relics.Stellar Converter.Description",
        description: "Description for Relic: Stellar Converter",
        defaultMessage:
          "ACTION: Choose 1 non-home, non-legendary planet other than Mecatol Rex in a system that is adjacent to 1 or more of your units that have BOMBARDMENT; destroy all units on that planet and purge its attachments and its planet card. Then, place the destroyed planet token on that planet and purge this card.",
      }),
      expansion: "POK",
      id: "Stellar Converter",
      name: intl.formatMessage({
        id: "Relics.Stellar Converter.Title",
        description: "Title of Relic: Stellar Converter",
        defaultMessage: "Stellar Converter",
      }),
      timing: "COMPONENT_ACTION",
    },
    "The Codex": {
      description: intl.formatMessage({
        id: "Relics.The Codex.Description",
        description: "Description for Relic: The Codex",
        defaultMessage:
          "ACTION: Purge this card to take up to 3 action cards of your choice from the action card discard pile.",
      }),
      expansion: "POK",
      id: "The Codex",
      name: intl.formatMessage({
        id: "Relics.The Codex.Title",
        description: "Title of Relic: The Codex",
        defaultMessage: "The Codex",
      }),
      timing: "COMPONENT_ACTION",
    },
    "The Crown of Emphidia": {
      description: intl.formatMessage(
        {
          id: "Relics.The Crown of Emphidia.Description",
          description: "Description for Relic: The Crown of Emphidia",
          defaultMessage:
            'After you perform a tactical action, you may exhaust this card to explore 1 planet you control.{br}At the end of the status phase, if you control the "Tomb of Emphidia", you may purge this card to gain 1 Victory Point.',
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "The Crown of Emphidia",
      name: intl.formatMessage({
        id: "Relics.The Crown of Emphidia.Title",
        description: "Title of Relic: The Crown of Emphidia",
        defaultMessage: "The Crown of Emphidia",
      }),
      timing: "STATUS_PHASE_END",
    },
    "The Crown of Thalnos": {
      description: intl.formatMessage({
        id: "Relics.The Crown of Thalnos.Description",
        description: "Description for Relic: The Crown of Thalnos",
        defaultMessage:
          "During each combat round, this card's owner may reroll any number of their dice, applying +1 to the results; any units that reroll dice but do not produce at least 1 hit are destroyed.",
      }),
      expansion: "POK",
      id: "The Crown of Thalnos",
      name: intl.formatMessage({
        id: "Relics.The Crown of Thalnos.Title",
        description: "Title of Relic: The Crown of Thalnos",
        defaultMessage: "The Crown of Thalnos",
      }),
      timing: "PASSIVE",
    },
    "The Obsidian": {
      description: intl.formatMessage(
        {
          id: "Relics.The Obsidian.Description",
          description: "Description for Relic: The Obsidian",
          defaultMessage:
            "When you gain this card, draw 1 secret objective. You can have 1 additional scored or unscored secret objective.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "The Obsidian",
      name: intl.formatMessage({
        id: "Relics.The Obsidian.Title",
        description: "Title of Relic: The Obsidian",
        defaultMessage: "The Obsidian",
      }),
      timing: "PASSIVE",
    },
    "The Prophet's Tears": {
      description: intl.formatMessage({
        id: "Relics.The Prophet's Tears.Description",
        description: "Description for Relic: The Prophet's Tears",
        defaultMessage:
          "When you research a technology, you may exhaust this card to ignore 1 prerequisite or draw 1 action card.",
      }),
      expansion: "POK",
      id: "The Prophet's Tears",
      name: intl.formatMessage({
        id: "Relics.The Prophet's Tears.Title",
        description: "Title of Relic: The Prophet's Tears",
        defaultMessage: "The Prophet's Tears",
      }),
      timing: "PASSIVE",
    },
    ...getCodexFourRelics(intl),
    ...getBaseDiscordantStarsRelics(intl),
  };
}

function getCodexFourRelics(
  intl: IntlShape
): Record<CodexFour.RelicId, BaseRelic> {
  return {
    "Circlet of the Void": {
      description: intl.formatMessage(
        {
          id: "Relics.Circlet of the Void.Description",
          description: "Description for Relic: Circlet of the Void",
          defaultMessage:
            "Your units do not roll for gravity rifts, and you ignore the movement effects of other anomalies.{br}ACTION: Exhaust this card to explore a frontier token in a system that does not contain any other players' ships.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Circlet of the Void",
      name: intl.formatMessage({
        id: "Relics.Circlet of the Void.Title",
        description: "Title of Relic: Circlet of the Void",
        defaultMessage: "Circlet of the Void",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Book of Latvinia": {
      description: intl.formatMessage(
        {
          id: "Relics.Book of Latvinia.Description",
          description: "Description for Relic: Book of Latvinia",
          defaultMessage:
            "When you gain this card, research up to 2 technologies that have no prerequisites.{br}ACTION: Purge this card; if you control planets that have all 4 types of technology specialties, gain 1 victory point. Otherwise, gain the speaker token.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Book of Latvinia",
      name: intl.formatMessage({
        id: "Relics.Book of Latvinia.Title",
        description: "Title of Relic: Book of Latvinia",
        defaultMessage: "Book of Latvinia",
      }),
      timing: "COMPONENT_ACTION",
    },
    Neuraloop: {
      description: intl.formatMessage({
        id: "Relics.Neuraloop.Description",
        description: "Description for Relic: Neuraloop",
        defaultMessage:
          "When a public objective is revealed, you may purge one of your relics to discard that objective and replace it with a random objective from any objective deck; that objective is a public objective, even if it is a secret objective.",
      }),
      expansion: "CODEX FOUR",
      id: "Neuraloop",
      name: intl.formatMessage({
        id: "Relics.Neuraloop.Title",
        description: "Title of Relic: Neuraloop",
        defaultMessage: "Neuraloop",
      }),
      timing: "COMPONENT_ACTION",
    },
  };
}
