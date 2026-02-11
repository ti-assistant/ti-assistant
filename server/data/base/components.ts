import { IntlShape } from "react-intl";

export default function getBaseComponents(
  intl: IntlShape,
): Record<BaseGame.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Fires of the Gashlai": {
      description: intl.formatMessage(
        {
          id: "Embers of Muaat.Promissories.Fires of the Gashlai.Description",
          description:
            "Description for Faction Promissory: Fires of the Gashlai",
          defaultMessage:
            "ACTION: Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card.{br}Then, return this card to the Muaat player.",
        },
        { br: "\n\n" },
      ),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Fires of the Gashlai",
      name: intl.formatMessage({
        id: "Embers of Muaat.Promissories.Fires of the Gashlai.Title",
        description: "Title of Faction Promissory: Fires of the Gashlai",
        defaultMessage: "Fires of the Gashlai",
      }),
      type: "PROMISSORY",
    },
    "Lazax Gate Folding": {
      description: intl.formatMessage({
        id: "Winnu.Techs.Lazax Gate Folding.Description",
        description: "Description for Tech: Lazax Gate Folding",
        defaultMessage:
          "During your tactical actions, if you do not control Mecatol Rex, treat its systems as if it has both an α and β wormhole.{br}ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.",
      }),
      expansion: "BASE",
      faction: "Winnu",
      id: "Lazax Gate Folding",
      name: intl.formatMessage({
        id: "Winnu.Techs.Lazax Gate Folding.Title",
        description: "Title of Tech: Lazax Gate Folding",
        defaultMessage: "Lazax Gate Folding",
      }),
      type: "TECH",
    },
    "Mageon Implants": {
      description: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Mageon Implants.Description",
        description: "Description for Tech: Mageon Implants",
        defaultMessage:
          "ACTION: Exhaust this card to look at another player's hand of action cards.  Choose 1 of those cards and add it to your hand.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Mageon Implants",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Mageon Implants.Title",
        description: "Title of Tech: Mageon Implants",
        defaultMessage: "Mageon Implants",
      }),
      type: "TECH",
    },
    "Orbital Drop": {
      description: intl.formatMessage({
        id: "Federation of Sol.Abilities.Orbital Drop.Description",
        description: "Description for Faction Ability: Orbital Drop",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
      }),
      expansion: "BASE",
      faction: "Federation of Sol",
      id: "Orbital Drop",
      name: intl.formatMessage({
        id: "Federation of Sol.Abilities.Orbital Drop.Title",
        description: "Title of Faction Ability: Orbital Drop",
        defaultMessage: "Orbital Drop",
      }),
      type: "ABILITY",
    },
    "Production Biomes": {
      description: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Production Biomes.Description",
        description: "Description for Tech: Production Biomes",
        defaultMessage:
          "ACTION: Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods.",
      }),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Production Biomes",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Production Biomes.Title",
        description: "Title of Tech: Production Biomes",
        defaultMessage: "Production Biomes",
      }),
      type: "TECH",
    },
    "Promise of Protection": {
      description: intl.formatMessage(
        {
          id: "Mentak Coalition.Promissories.Promise of Protection.Description",
          description:
            "Description for Faction Promissory: Promise of Protection",
          defaultMessage:
            "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, the Mentak player cannot use their PILLAGE faction ability against you.{br}If you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player.",
        },
        { br: "\n\n" },
      ),
      expansion: "BASE",
      faction: "Mentak Coalition",
      id: "Promise of Protection",
      name: intl.formatMessage({
        id: "Mentak Coalition.Promissories.Promise of Protection.Title",
        description: "Title of Faction Promissory: Promise of Protection",
        defaultMessage: "Promise of Protection",
      }),
      type: "PROMISSORY",
    },
    "Stall Tactics": {
      description: intl.formatMessage({
        id: "Yssaril Tribes.Abilities.Stall Tactics.Description",
        description: "Description for Faction Ability: Stall Tactics",
        defaultMessage: "ACTION: Discard 1 action card from your hand.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Stall Tactics",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Abilities.Stall Tactics.Title",
        description: "Title of Faction Ability: Stall Tactics",
        defaultMessage: "Stall Tactics",
      }),
      type: "ABILITY",
    },
    "Star Forge": {
      description: intl.formatMessage({
        id: "Embers of Muaat.Abilities.Star Forge.Description",
        description: "Description for Faction Ability: Star Forge",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.",
      }),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Star Forge",
      name: intl.formatMessage({
        id: "Embers of Muaat.Abilities.Star Forge.Title",
        description: "Title of Faction Ability: Star Forge",
        defaultMessage: "Star Forge",
      }),
      type: "ABILITY",
    },
    Stymie: {
      description: intl.formatMessage(
        {
          id: "Arborec.Promissories.Stymie.Description",
          description: "Description for Faction Promissory: Stymie",
          defaultMessage:
            "ACTION: Place this card face up in your play area.{br}While this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units.{br}If you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player.",
        },
        { br: "\n\n" },
      ),
      expansion: "BASE",
      removedIn: "CODEX ONE",
      faction: "Arborec",
      id: "Stymie",
      name: intl.formatMessage({
        id: "Arborec.Promissories.Stymie.Title",
        description: "Title of Faction Promissory: Stymie",
        defaultMessage: "Stymie",
      }),
      type: "PROMISSORY",
    },
    "The Inferno": {
      description: intl.formatMessage({
        id: "Embers of Muaat.Units.The Inferno.Description",
        description: "Description for Faction Unit: The Inferno",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit's system.",
      }),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "The Inferno",
      name: intl.formatMessage({
        id: "Embers of Muaat.Units.The Inferno.Title",
        description: "Title of Faction Unit: The Inferno",
        defaultMessage: "The Inferno",
      }),
      type: "FLAGSHIP",
    },
    "Trade Convoys": {
      description: intl.formatMessage(
        {
          id: "Emirates of Hacan.Promissories.Trade Convoys.Description",
          description: "Description for Faction Promissory: Trade Convoys",
          defaultMessage:
            "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, you may negotiate transactions with players who are not your neighbor.{br}If you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player.",
        },
        { br: "\n\n" },
      ),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Trade Convoys",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Promissories.Trade Convoys.Title",
        description: "Title of Faction Promissory: Trade Convoys",
        defaultMessage: "Trade Convoys",
      }),
      type: "PROMISSORY",
    },
    "X-89 Bacterial Weapon": {
      description: intl.formatMessage({
        id: "Techs.X-89 Bacterial Weapon.Description",
        description: "Description for Tech: X-89 Bacterial Weapon",
        defaultMessage:
          "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet.",
      }),
      expansion: "BASE",
      removedIn: "CODEX ONE",
      id: "X-89 Bacterial Weapon",
      name: intl.formatMessage({
        id: "Techs.X-89 Bacterial Weapon.Title",
        description: "Title of Tech: X-89 Bacterial Weapon",
        defaultMessage: "X-89 Bacterial Weapon",
      }),
      type: "TECH",
    },
  };
}
