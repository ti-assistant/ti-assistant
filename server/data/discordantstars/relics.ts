import { IntlShape } from "react-intl";

export default function getDiscordantStarsRelics(
  intl: IntlShape
): Record<DiscordantStars.RelicId, BaseRelic> {
  return {
    "Accretion Engine": {
      description: intl.formatMessage({
        id: "Relics.Accretion Engine.Description",
        description: "Description for Relic: Accretion Engine",
        defaultMessage:
          "Apply +1 to the PRODUCTION value of each of your units with PRODUCTION. When you produce 1 or more units, reduce the combined cost of the produced units by 1.",
      }),
      expansion: "DISCORDANT STARS",
      id: "Accretion Engine",
      name: intl.formatMessage({
        id: "Relics.Accretion Engine.Title",
        description: "Title of Relic: Accretion Engine",
        defaultMessage: "Accretion Engine",
      }),
      timing: "OTHER",
    },
    "Azdel's Key": {
      description: intl.formatMessage({
        id: "Relics.Azdel's Key.Description",
        description: "Description for Relic: Azdel's Key",
        defaultMessage:
          "ACTION: Purge this card to draw 3 system tiles with a blue-colored back at random; place 1 of those tiles at the edge of the game board, adjacent to at least 2 other systems. Purge the rest.",
      }),
      expansion: "DISCORDANT STARS",
      id: "Azdel's Key",
      name: intl.formatMessage({
        id: "Relics.Azdel's Key.Title",
        description: "Title of Relic: Azdel's Key",
        defaultMessage: "Azdel's Key",
      }),
      timing: "COMPONENT_ACTION",
    },
    "E6-G0 Network": {
      description: intl.formatMessage(
        {
          id: "Relics.E6-G0 Network.Description",
          description: "Description for Relic: E6-G0 Network",
          defaultMessage:
            "You may have 2 additional action cards in your hand, game effects cannot prevent you from using this ability.{br}At any time, you may exhaust this card to draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      expansion: "DISCORDANT STARS",
      id: "E6-G0 Network",
      name: intl.formatMessage({
        id: "Relics.E6-G0 Network.Title",
        description: "Title of Relic: E6-G0 Network",
        defaultMessage: "E6-G0 Network",
      }),
      timing: "OTHER",
    },
    "Eye of Vogul": {
      description: intl.formatMessage(
        {
          id: "Relics.Eye of Vogul.Description",
          description: "Description for Relic: Eye of Vogul",
          defaultMessage:
            "After you activate a system:{br}Purge this card to treat 2 of your ships as adjacent to the active system until the end of this tactical action.",
        },
        { br: "\n\n" }
      ),
      expansion: "DISCORDANT STARS",
      id: "Eye of Vogul",
      name: intl.formatMessage({
        id: "Relics.Eye of Vogul.Title",
        description: "Title of Relic: Eye of Vogul",
        defaultMessage: "Eye of Vogul",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Starfall Array": {
      description: intl.formatMessage({
        id: "Relics.Starfall Array.Description",
        description: "Description for Relic: Starfall Array",
        defaultMessage:
          "When 1 or more of your units roll dice for a unit ability, you may apply +1 to the result of each of those dice, and 1 of those units may roll 1 additional die.",
      }),
      expansion: "DISCORDANT STARS",
      id: "Starfall Array",
      name: intl.formatMessage({
        id: "Relics.Starfall Array.Title",
        description: "Title of Relic: Starfall Array",
        defaultMessage: "Starfall Array",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Forgotten Throne": {
      description: intl.formatMessage({
        id: "Relics.Forgotten Throne.Description",
        description: "Description for Relic: Forgotten Throne",
        defaultMessage:
          "ACTION: Purge this card to either gain 1 relic or immediately score 1 scored secret objective, or 1 of your unscored secret objectives, if you fulfill its requirements.",
      }),
      expansion: "DISCORDANT STARS",
      id: "Forgotten Throne",
      name: intl.formatMessage({
        id: "Relics.Forgotten Throne.Title",
        description: "Title of Relic: Forgotten Throne",
        defaultMessage: "Forgotten Throne",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Twilight Mirror": {
      description: intl.formatMessage({
        id: "Relics.Twilight Mirror.Description",
        description: "Description for Relic: Twilight Mirror",
        defaultMessage:
          "At the start of the agenda phase, you may purge this card to resolve 1 non-strategic action.",
      }),
      expansion: "DISCORDANT STARS",
      id: "Twilight Mirror",
      name: intl.formatMessage({
        id: "Relics.Twilight Mirror.Title",
        description: "Title of Relic: Twilight Mirror",
        defaultMessage: "Twilight Mirror",
      }),
      timing: "AGENDA_PHASE_START",
    },
  };
}
