import { IntlShape } from "react-intl";

export default function getBaseComponents(
  intl: IntlShape
): Record<BaseGame.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Fires of the Gashlai": {
      description: intl.formatMessage(
        {
          id: "Components.Fires of the Gashlai.Description",
          description: "Description for Component: Fires of the Gashlai",
          defaultMessage:
            "ACTION: Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card.{br}Then, return this card to the Muaat player.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Fires of the Gashlai",
      name: intl.formatMessage({
        id: "Components.Fires of the Gashlai.Title",
        description: "Title of Component: Fires of the Gashlai",
        defaultMessage: "Fires of the Gashlai",
      }),
      type: "PROMISSORY",
    },
    "Lazax Gate Folding": {
      description: intl.formatMessage({
        id: "Components.Lazax Gate Folding.Description",
        description: "Description for Component: Lazax Gate Folding",
        defaultMessage:
          "ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.",
      }),
      expansion: "BASE",
      faction: "Winnu",
      id: "Lazax Gate Folding",
      name: intl.formatMessage({
        id: "Components.Lazax Gate Folding.Title",
        description: "Title of Component: Lazax Gate Folding",
        defaultMessage: "Lazax Gate Folding",
      }),
      type: "TECH",
    },
    "Mageon Implants": {
      description: intl.formatMessage({
        id: "Components.Mageon Implants.Description",
        description: "Description for Component: Mageon Implants",
        defaultMessage:
          "ACTION: Exhaust this card to look at another player's hand of action cards.  Choose 1 of those cards and add it to your hand.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Mageon Implants",
      name: intl.formatMessage({
        id: "Components.Mageon Implants.Title",
        description: "Title of Component: Mageon Implants",
        defaultMessage: "Mageon Implants",
      }),
      type: "TECH",
    },
    "Orbital Drop": {
      description: intl.formatMessage({
        id: "Components.Orbital Drop.Description",
        description: "Description for Component: Orbital Drop",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
      }),
      expansion: "BASE",
      faction: "Federation of Sol",
      id: "Orbital Drop",
      name: intl.formatMessage({
        id: "Components.Orbital Drop.Title",
        description: "Title of Component: Orbital Drop",
        defaultMessage: "Orbital Drop",
      }),
      type: "ABILITY",
    },
    "Production Biomes": {
      description: intl.formatMessage({
        id: "Components.Production Biomes.Description",
        description: "Description for Component: Production Biomes",
        defaultMessage:
          "ACTION: Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods.",
      }),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Production Biomes",
      name: intl.formatMessage({
        id: "Components.Production Biomes.Title",
        description: "Title of Component: Production Biomes",
        defaultMessage: "Production Biomes",
      }),
      type: "TECH",
    },
    "Promise of Protection": {
      description: intl.formatMessage(
        {
          id: "Components.Promise of Protection.Description",
          description: "Description for Component: Promise of Protection",
          defaultMessage:
            "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, the Mentak player cannot use their PILLAGE faction ability against you.{br}If you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Mentak Coalition",
      id: "Promise of Protection",
      name: intl.formatMessage({
        id: "Components.Promise of Protection.Title",
        description: "Title of Component: Promise of Protection",
        defaultMessage: "Promise of Protection",
      }),
      type: "PROMISSORY",
    },
    "Stall Tactics": {
      description: intl.formatMessage({
        id: "Components.Stall Tactics.Description",
        description: "Description for Component: Stall Tactics",
        defaultMessage: "ACTION: Discard 1 action card from your hand.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Stall Tactics",
      name: intl.formatMessage({
        id: "Components.Stall Tactics.Title",
        description: "Title of Component: Stall Tactics",
        defaultMessage: "Stall Tactics",
      }),
      type: "ABILITY",
    },
    "Star Forge": {
      description: intl.formatMessage({
        id: "Components.Star Forge.Description",
        description: "Description for Component: Star Forge",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.",
      }),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Star Forge",
      name: intl.formatMessage({
        id: "Components.Star Forge.Title",
        description: "Title of Component: Star Forge",
        defaultMessage: "Star Forge",
      }),
      type: "ABILITY",
    },
    Stymie: {
      description: intl.formatMessage(
        {
          id: "Components.Stymie.Description",
          description: "Description for Component: Stymie",
          defaultMessage:
            "ACTION: Place this card face up in your play area.{br}While this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units.{br}If you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE ONLY",
      faction: "Arborec",
      id: "Stymie",
      name: intl.formatMessage({
        id: "Components.Stymie.Title",
        description: "Title of Component: Stymie",
        defaultMessage: "Stymie",
      }),
      type: "PROMISSORY",
    },
    "The Inferno": {
      description: intl.formatMessage({
        id: "Components.The Inferno.Description",
        description: "Description for Component: The Inferno",
        defaultMessage:
          "ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit's system.",
      }),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "The Inferno",
      name: intl.formatMessage({
        id: "Components.The Inferno.Title",
        description: "Title of Component: The Inferno",
        defaultMessage: "The Inferno",
      }),
      type: "FLAGSHIP",
    },
    "Trade Convoys": {
      description: intl.formatMessage(
        {
          id: "Components.Trade Convoys.Description",
          description: "Description for Component: Trade Convoys",
          defaultMessage:
            "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, you may negotiate transactions with players who are not your neighbor.{br}If you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Trade Convoys",
      name: intl.formatMessage({
        id: "Components.Trade Convoys.Title",
        description: "Title of Component: Trade Convoys",
        defaultMessage: "Trade Convoys",
      }),
      type: "PROMISSORY",
    },
    "X-89 Bacterial Weapon": {
      description: intl.formatMessage({
        id: "Components.X-89 Bacterial Weapon.Description",
        description: "Description for Component: X-89 Bacterial Weapon",
        defaultMessage:
          "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet.",
      }),
      expansion: "BASE ONLY",
      id: "X-89 Bacterial Weapon",
      name: intl.formatMessage({
        id: "Components.X-89 Bacterial Weapon.Title",
        description: "Title of Component: X-89 Bacterial Weapon",
        defaultMessage: "X-89 Bacterial Weapon",
      }),
      type: "TECH",
    },
  };
}
