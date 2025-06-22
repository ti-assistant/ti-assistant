import { IntlShape } from "react-intl";
import { DISCORDANT_STARS_COMPONENTS } from "./discordantstars/components";
import getCodexFourComponents from "./codexfour/components";
import getCodexOneComponents from "./codexone/components";
import getProphecyOfKingsComponents from "./prophecyofkings/components";

export function getBaseComponents(
  intl: IntlShape
): Record<ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Cripple Defenses": {
      description: intl.formatMessage({
        id: "Components.Cripple Defenses.Description",
        description: "Description for Component: Cripple Defenses",
        defaultMessage:
          "ACTION: Choose 1 planet. Destroy each PDS on that planet",
      }),
      expansion: "BASE",
      id: "Cripple Defenses",
      name: intl.formatMessage({
        id: "Components.Cripple Defenses.Title",
        description: "Title of Component: Cripple Defenses",
        defaultMessage: "Cripple Defenses",
      }),
      type: "CARD",
    },
    "Economic Initiative": {
      description: intl.formatMessage({
        id: "Components.Economic Initiative.Description",
        description: "Description for Component: Economic Initiative",
        defaultMessage: "ACTION: Ready each cultural planet you control.",
      }),
      expansion: "BASE",
      id: "Economic Initiative",
      name: intl.formatMessage({
        id: "Components.Economic Initiative.Title",
        description: "Title of Component: Economic Initiative",
        defaultMessage: "Economic Initiative",
      }),
      type: "CARD",
    },
    "Fires of the Gashlai": {
      description: intl.formatMessage(
        {
          id: "Components.Fires of the Gashlai.Description",
          description: "Description for Component: Fires of the Gashlai",
          defaultMessage:
            "Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card.{br}Then, return this card to the Muaat player.",
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
    "Focused Research": {
      description: intl.formatMessage({
        id: "Components.Focused Research.Description",
        description: "Description for Component: Focused Research",
        defaultMessage: "ACTION: Spend 4 trade goods to research 1 technology.",
      }),
      expansion: "BASE",
      id: "Focused Research",
      name: intl.formatMessage({
        id: "Components.Focused Research.Title",
        description: "Title of Component: Focused Research",
        defaultMessage: "Focused Research",
      }),
      type: "CARD",
    },
    "Frontline Deployment": {
      description: intl.formatMessage({
        id: "Components.Frontline Deployment.Description",
        description: "Description for Component: Frontline Deployment",
        defaultMessage:
          "ACTION: Place 3 infantry from your reinforcements on 1 planet you control.",
      }),
      expansion: "BASE",
      id: "Frontline Deployment",
      name: intl.formatMessage({
        id: "Components.Frontline Deployment.Title",
        description: "Title of Component: Frontline Deployment",
        defaultMessage: "Frontline Deployment",
      }),
      type: "CARD",
    },
    "Ghost Ship": {
      description: intl.formatMessage({
        id: "Components.Ghost Ship.Description",
        description: "Description for Component: Ghost Ship",
        defaultMessage:
          "ACTION: Place 1 destroyer from your reinforcements in a non-home system that contains a wormhole and does not contain other players' ships.",
      }),
      expansion: "BASE",
      id: "Ghost Ship",
      name: intl.formatMessage({
        id: "Components.Ghost Ship.Title",
        description: "Title of Component: Ghost Ship",
        defaultMessage: "Ghost Ship",
      }),
      type: "CARD",
    },
    "Industrial Initiative": {
      description: intl.formatMessage({
        id: "Components.Industrial Initiative.Description",
        description: "Description for Component: Industrial Initiative",
        defaultMessage:
          "ACTION: Gain 1 trade good for each industrial planet you control.",
      }),
      expansion: "BASE",
      id: "Industrial Initiative",
      name: intl.formatMessage({
        id: "Components.Industrial Initiative.Title",
        description: "Title of Component: Industrial Initiative",
        defaultMessage: "Industrial Initiative",
      }),
      type: "CARD",
    },
    Insubordination: {
      description: intl.formatMessage({
        id: "Components.Insubordination.Description",
        description: "Description for Component: Insubordination",
        defaultMessage:
          "ACTION: Remove 1 token from another player's tactic pool and return it to their reinforcements.",
      }),
      expansion: "BASE",
      id: "Insubordination",
      name: intl.formatMessage({
        id: "Components.Insubordination.Title",
        description: "Title of Component: Insubordination",
        defaultMessage: "Insubordination",
      }),
      type: "CARD",
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
    "Lucky Shot": {
      description: intl.formatMessage({
        id: "Components.Lucky Shot.Description",
        description: "Description for Component: Lucky Shot",
        defaultMessage:
          "ACTION: Destroy 1 dreadnought, cruiser, or destroyer in a system that contains a planet you control.",
      }),
      expansion: "BASE",
      id: "Lucky Shot",
      name: intl.formatMessage({
        id: "Components.Lucky Shot.Title",
        description: "Title of Component: Lucky Shot",
        defaultMessage: "Lucky Shot",
      }),
      type: "CARD",
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
    "Mining Initiative": {
      description: intl.formatMessage({
        id: "Components.Mining Initiative.Description",
        description: "Description for Component: Mining Initiative",
        defaultMessage:
          "ACTION: Gain trade goods equal to the resource value of 1 planet you control.",
      }),
      expansion: "BASE",
      id: "Mining Initiative",
      name: intl.formatMessage({
        id: "Components.Mining Initiative.Title",
        description: "Title of Component: Mining Initiative",
        defaultMessage: "Mining Initiative",
      }),
      type: "CARD",
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
    Plague: {
      description: intl.formatMessage({
        id: "Components.Plague.Description",
        description: "Description for Component: Plague",
        defaultMessage:
          "ACTION: Choose 1 planet that is controlled by another player. Roll 1 die for each infantry on that planet. For each result of 6 or greater, destroy 1 of those units.",
      }),
      expansion: "BASE",
      id: "Plague",
      name: intl.formatMessage({
        id: "Components.Plague.Title",
        description: "Title of Component: Plague",
        defaultMessage: "Plague",
      }),
      type: "CARD",
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
            "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, the Mentak player cannot use their Pillage faction ability against you.{br}If you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player.",
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
    "Reactor Meltdown": {
      description: intl.formatMessage({
        id: "Components.Reactor Meltdown.Description",
        description: "Description for Component: Reactor Meltdown",
        defaultMessage: "ACTION: Destroy 1 space dock in a non-home system.",
      }),
      expansion: "BASE",
      id: "Reactor Meltdown",
      name: intl.formatMessage({
        id: "Components.Reactor Meltdown.Title",
        description: "Title of Component: Reactor Meltdown",
        defaultMessage: "Reactor Meltdown",
      }),
      type: "CARD",
    },
    "Repeal Law": {
      description: intl.formatMessage({
        id: "Components.Repeal Law.Description",
        description: "Description for Component: Repeal Law",
        defaultMessage: "ACTION: Discard 1 law from play.",
      }),
      expansion: "BASE",
      id: "Repeal Law",
      name: intl.formatMessage({
        id: "Components.Repeal Law.Title",
        description: "Title of Component: Repeal Law",
        defaultMessage: "Repeal Law",
      }),
      type: "CARD",
    },
    "Rise of a Messiah": {
      description: intl.formatMessage({
        id: "Components.Rise of a Messiah.Description",
        description: "Description for Component: Rise of a Messiah",
        defaultMessage:
          "ACTION: Place 1 infantry from your reinforcements on each planet you control.",
      }),
      expansion: "BASE",
      id: "Rise of a Messiah",
      name: intl.formatMessage({
        id: "Components.Rise of a Messiah.Title",
        description: "Title of Component: Rise of a Messiah",
        defaultMessage: "Rise of a Messiah",
      }),
      type: "CARD",
    },
    "Signal Jamming": {
      description: intl.formatMessage({
        id: "Components.Signal Jamming.Description",
        description: "Description for Component: Signal Jamming",
        defaultMessage:
          "ACTION: Chose 1 non-home system that contains or is adjacent to 1 of your ships. Place a command token from another player's reinforcements in that system.",
      }),
      expansion: "BASE",
      id: "Signal Jamming",
      name: intl.formatMessage({
        id: "Components.Signal Jamming.Title",
        description: "Title of Component: Signal Jamming",
        defaultMessage: "Signal Jamming",
      }),
      type: "CARD",
    },
    Spy: {
      description: intl.formatMessage({
        id: "Components.Spy.Description",
        description: "Description for Component: Spy",
        defaultMessage:
          "ACTION: Choose 1 player. That player gives you 1 random action card from their hand.",
      }),
      expansion: "BASE",
      id: "Spy",
      name: intl.formatMessage({
        id: "Components.Spy.Title",
        description: "Title of Component: Spy",
        defaultMessage: "Spy",
      }),
      type: "CARD",
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
    "Tactical Bombardment": {
      description: intl.formatMessage({
        id: "Components.Tactical Bombardment.Description",
        description: "Description for Component: Tactical Bombardment",
        defaultMessage:
          "ACTION: Choose 1 system that contains 1 or more of your units that have Bombardment. Exhaust each planet controlled by other players in that system.",
      }),
      expansion: "BASE",
      id: "Tactical Bombardment",
      name: intl.formatMessage({
        id: "Components.Tactical Bombardment.Title",
        description: "Title of Component: Tactical Bombardment",
        defaultMessage: "Tactical Bombardment",
      }),
      type: "CARD",
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
    "Unexpected Action": {
      description: intl.formatMessage({
        id: "Components.Unexpected Action.Description",
        description: "Description for Component: Unexpected Action",
        defaultMessage:
          "ACTION: Remove 1 of your command tokens from the game board and return it to your reinforcements.",
      }),
      expansion: "BASE",
      id: "Unexpected Action",
      name: intl.formatMessage({
        id: "Components.Unexpected Action.Title",
        description: "Title of Component: Unexpected Action",
        defaultMessage: "Unexpected Action",
      }),
      type: "CARD",
    },
    "Unstable Planet": {
      description: intl.formatMessage({
        id: "Components.Unstable Planet.Description",
        description: "Description for Component: Unstable Planet",
        defaultMessage:
          "ACTION: Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it.",
      }),
      expansion: "BASE",
      id: "Unstable Planet",
      name: intl.formatMessage({
        id: "Components.Unstable Planet.Title",
        description: "Title of Component: Unstable Planet",
        defaultMessage: "Unstable Planet",
      }),
      type: "CARD",
    },
    Uprising: {
      description: intl.formatMessage({
        id: "Components.Uprising.Description",
        description: "Description for Component: Uprising",
        defaultMessage:
          "ACTION: Exhaust 1 non-home planet controlled by another player. Then gain trade goods equal to its resource value.",
      }),
      expansion: "BASE",
      id: "Uprising",
      name: intl.formatMessage({
        id: "Components.Uprising.Title",
        description: "Title of Component: Uprising",
        defaultMessage: "Uprising",
      }),
      type: "CARD",
    },
    "War Effort": {
      description: intl.formatMessage({
        id: "Components.War Effort.Description",
        description: "Description for Component: War Effort",
        defaultMessage:
          "ACTION: Place 1 cruiser from your reinforcements in a system that contains 1 or more of your ships.",
      }),
      expansion: "BASE",
      id: "War Effort",
      name: intl.formatMessage({
        id: "Components.War Effort.Title",
        description: "Title of Component: War Effort",
        defaultMessage: "War Effort",
      }),
      type: "CARD",
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
    ...getProphecyOfKingsComponents(intl),
    ...getCodexOneComponents(intl),
    ...getCodexFourComponents(intl),
    ...DISCORDANT_STARS_COMPONENTS,
  };
}
