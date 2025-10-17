import { IntlShape } from "react-intl";

export default function getThundersEdgeComponents(
  intl: IntlShape
): Record<ThundersEdge.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    Avernus: {
      description: intl.formatMessage(
        {
          id: "Planets.Avernus.Ability",
          description: "Planet Ability for Avernus",
          defaultMessage:
            "ACTION: Exhaust this card to use the Embers of Muaat's STAR FORGE faction ability without spending a command token.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Embers of Muaat",
      id: "Avernus",
      name: intl.formatMessage({
        id: "Components.Avernus.Title",
        description: "Title of Component: Avernus",
        defaultMessage: "Avernus",
      }),
      type: "PLANET",
    },
    "Conventions of War Abandoned": {
      description: intl.formatMessage({
        id: "Components.Conventions of War Abandoned.Description",
        description: "Description for Component: Conventions of War Abandoned",
        defaultMessage:
          "ACTION: Exhaust X-89 BACTERIAL WEAPON to choose 1 planet in a system that contains 1 of your units that has BOMBARDMENT; purge its planet card and all attachments or legendary planet ability cards associated with it.",
      }),
      expansion: "THUNDERS EDGE",
      event: "Conventions of War Abandoned",
      id: "Conventions of War Abandoned",
      name: intl.formatMessage({
        id: "Components.Conventions of War Abandoned.Title",
        description: "Title of Component: Conventions of War Abandoned",
        defaultMessage: "Conventions of War Abandoned",
      }),
      requiresTech: "X-89 Bacterial Weapon",
      type: "EVENT",
    },
    "Mercenaries for Hire": {
      description: intl.formatMessage({
        id: "Components.Mercenaries for Hire.Description",
        description: "Description for Component: Mercenaries for Hire",
        defaultMessage:
          "ACTION: Spend 3 trade goods to gain the top card of the mercenary deck and place it in your play area.",
      }),
      expansion: "THUNDERS EDGE",
      event: "Mercenaries for Hire",
      id: "Mercenaries for Hire",
      name: intl.formatMessage({
        id: "Components.Mercenaries for Hire.Title",
        description: "Title of Component: Mercenaries for Hire",
        defaultMessage: "Mercenaries for Hire",
      }),
      type: "EVENT",
    },
    "Puppets of the Blade": {
      description: intl.formatMessage(
        {
          id: "Components.Puppets of the Blade.Description",
          description: "Description for Component: Puppets of the Blade",
          defaultMessage:
            "If you have at least 1 plot card in your play area, gain the following ability:{br}ACTION: Purge The Firmament's faction sheet, leaders, planet cards, and promissory note. Then, gain all of the faction components for The Obsidian.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Firmament",
      id: "Puppets of the Blade",
      name: intl.formatMessage({
        id: "Components.Puppets of the Blade.Title",
        description: "Title of Component: Puppets of the Blade",
        defaultMessage: "Puppets of the Blade",
      }),
      type: "ABILITY",
    },
    "Share Knowledge": {
      description: intl.formatMessage(
        {
          id: "Components.Share Knowledge.Description",
          description: "Description for Component: Share Knowledge",
          defaultMessage:
            "ACTION: Place this card faceup in your play area and gain 1 non-faction, non-unit upgrade technology that the Deepwrought player owns; place this technology on this card.{br}Return that technology to the deck and this card to the Deepwrought player at the end of the status phase.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Deepwrought Scholarate",
      id: "Share Knowledge",
      name: intl.formatMessage({
        id: "Components.Share Knowledge.Title",
        description: "Title of Component: Share Knowledge",
        defaultMessage: "Share Knowledge",
      }),
      type: "PROMISSORY",
    },
    "Stellar Atomics": {
      description: intl.formatMessage({
        id: "Components.Stellar Atomics.Description",
        description: "Description for Component: Stellar Atomics",
        defaultMessage:
          "ACTION: Discard your control token from the Stellar Atomics card to destroy all ground forces and structures on any non-home planet.",
      }),
      expansion: "THUNDERS EDGE",
      event: "Stellar Atomics",
      id: "Stellar Atomics",
      name: intl.formatMessage({
        id: "Components.Stellar Atomics.Title",
        description: "Title of Component: Stellar Atomics",
        defaultMessage: "Stellar Atomics",
      }),
      type: "EVENT",
    },
  };
}
