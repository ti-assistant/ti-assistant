import { IntlShape } from "react-intl";

export default function getProphecyOfKingsComponents(
  intl: IntlShape
): Record<ProphecyOfKings.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Black Market Forgery": {
      description: intl.formatMessage(
        {
          id: "Components.Black Market Forgery.Description",
          description: "Description for Component: Black Market Forgery",
          defaultMessage:
            "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic.{br}Then return this card to the Naaz-Rokha player.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naaz-Rokha Alliance",
      id: "Black Market Forgery",
      name: intl.formatMessage({
        id: "Components.Black Market Forgery.Title",
        description: "Title of Component: Black Market Forgery",
        defaultMessage: "Black Market Forgery",
      }),
      type: "PROMISSORY",
    },
    "Blood Pact": {
      description: intl.formatMessage(
        {
          id: "Components.Blood Pact.Description",
          description: "Description for Component: Blood Pact",
          defaultMessage:
            "ACTION: Place this card face up in your play area.{br}When you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome.{br}If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Empyrean",
      id: "Blood Pact",
      name: intl.formatMessage({
        id: "Components.Blood Pact.Title",
        description: "Title of Component: Blood Pact",
        defaultMessage: "Blood Pact",
      }),
      type: "PROMISSORY",
    },
    "Dark Pact": {
      description: intl.formatMessage(
        {
          id: "Components.Dark Pact.Description",
          description: "Description for Component: Dark Pact",
          defaultMessage:
            "ACTION: Place this card face up in your play area.{br}When you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good.{br}If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Empyrean",
      id: "Dark Pact",
      name: intl.formatMessage({
        id: "Components.Dark Pact.Title",
        description: "Title of Component: Dark Pact",
        defaultMessage: "Dark Pact",
      }),
      type: "PROMISSORY",
    },
    "Enigmatic Device": {
      description: intl.formatMessage({
        id: "Components.Enigmatic Device.Description",
        description: "Description for Component: Enigmatic Device",
        defaultMessage:
          "ACTION: You may spend 6 resources and purge this card to research 1 technology.",
      }),
      expansion: "POK",
      id: "Enigmatic Device",
      name: intl.formatMessage({
        id: "Components.Enigmatic Device.Title",
        description: "Title of Component: Enigmatic Device",
        defaultMessage: "Enigmatic Device",
      }),
      type: "EXPLORATION",
    },
    Fabrication: {
      description: intl.formatMessage({
        id: "Components.Fabrication.Description",
        description: "Description for Component: Fabrication",
        defaultMessage:
          "ACTION: Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token.",
      }),
      expansion: "POK",
      faction: "Naaz-Rokha Alliance",
      id: "Fabrication",
      name: intl.formatMessage({
        id: "Components.Fabrication.Title",
        description: "Title of Component: Fabrication",
        defaultMessage: "Fabrication",
      }),
      type: "ABILITY",
    },
    "Gain Relic": {
      description: intl.formatMessage({
        id: "Components.Gain Relic.Description",
        description: "Description for Component: Gain Relic",
        defaultMessage:
          "ACTION: Purge 3 of your relic fragments of the same type to gain 1 Relic.",
      }),
      expansion: "POK",
      id: "Gain Relic",
      name: intl.formatMessage({
        id: "Components.Gain Relic.Title",
        description: "Title of Component: Gain Relic",
        defaultMessage: "Gain Relic",
      }),
      type: "EXPLORATION",
    },
    "Sling Relay": {
      description: intl.formatMessage({
        id: "Components.Sling Relay.Description",
        description: "Description for Component: Sling Relay",
        defaultMessage:
          "ACTION: Exhaust this card to produce 1 ship in any system that contains one of your space docks.",
      }),
      expansion: "POK",
      id: "Sling Relay",
      name: intl.formatMessage({
        id: "Components.Sling Relay.Title",
        description: "Title of Component: Sling Relay",
        defaultMessage: "Sling Relay",
      }),
      type: "TECH",
    },
    Terraform: {
      description: intl.formatMessage(
        {
          id: "Components.Terraform.Description",
          description: "Description for Component: Terraform",
          defaultMessage:
            "ACTION: Attach this card to a non-home planet you control other than Mecatol Rex.{br}Its resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Titans of Ul",
      id: "Terraform",
      name: intl.formatMessage({
        id: "Components.Terraform.Title",
        description: "Title of Component: Terraform",
        defaultMessage: "Terraform",
      }),
      type: "PROMISSORY",
    },
    Vortex: {
      description: intl.formatMessage({
        id: "Components.Vortex.Description",
        description: "Description for Component: Vortex",
        defaultMessage:
          "ACTION: Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements.",
      }),
      expansion: "POK",
      faction: "Vuil'raith Cabal",
      id: "Vortex",
      name: intl.formatMessage({
        id: "Components.Vortex.Title",
        description: "Title of Component: Vortex",
        defaultMessage: "Vortex",
      }),
      type: "TECH",
    },
  };
}
