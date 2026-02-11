import { IntlShape } from "react-intl";

export default function getThundersEdgeComponents(
  intl: IntlShape,
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
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      faction: "Embers of Muaat",
      id: "Avernus",
      name: intl.formatMessage({
        id: "Planets.Avernus.Name",
        description: "Name of Planet: Avernus",
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
        id: "Events.Conventions of War Abandoned.Title",
        description: "Title of Event: Conventions of War Abandoned",
        defaultMessage: "Conventions of War Abandoned",
      }),
      requiresTech: "X-89 Bacterial Weapon",
      type: "EVENT",
    },
    "Executive Order": {
      description: intl.formatMessage({
        id: "Council Keleres.Techs.Executive Order.Description",
        description: "Description for Tech: Executive Order",
        defaultMessage:
          "ACTION: Reveal the top or bottom card of the agenda deck and vote on it, being speaker. You may use trade goods to vote.",
      }),
      expansion: "THUNDERS EDGE",
      id: "Executive Order",
      name: intl.formatMessage({
        id: "Council Keleres.Techs.Executive Order.Title",
        description: "Title of Tech: Executive Order",
        defaultMessage: "Executive Order",
      }),
      type: "TECH",
    },
    Nanomachines: {
      description: intl.formatMessage(
        {
          id: "Ral Nel Consortium.Techs.Nanomachines.Description",
          description: "Description for Tech: Nanomachines",
          defaultMessage:
            "ACTION: Exhaust this card to place 1 PDS on a planet you control.{br}ACTION: Exhaust this card to repair all of your damaged units.{br}ACTION: Exhaust this card and discard 1 action card to draw 1 action card.",
        },
        { br: "\n\n" },
      ),
      expansion: "POK",
      id: "Nanomachines",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Techs.Nanomachines.Title",
        description: "Title of Tech: Nanomachines",
        defaultMessage: "Nanomachines",
      }),
      type: "TECH",
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
        id: "Events.Mercenaries for Hire.Title",
        description: "Title of Event: Mercenaries for Hire",
        defaultMessage: "Mercenaries for Hire",
      }),
      type: "EVENT",
    },
    "Puppets of the Blade": {
      description: intl.formatMessage(
        {
          id: "Firmament.Abilities.Puppets of the Blade.Description",
          description: "Description for Faction Ability: Puppets of the Blade",
          defaultMessage:
            "If you have at least 1 plot card in your play area, gain the following ability:{br}ACTION: Purge The Firmament's faction sheet, leaders, planet cards, and promissory note. Then, gain all of the faction components for The Obsidian.",
        },
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      faction: "Firmament",
      id: "Puppets of the Blade",
      name: intl.formatMessage({
        id: "Firmament.Abilities.Puppets of the Blade.Title",
        description: "Title of Faction Ability: Puppets of the Blade",
        defaultMessage: "Puppets of the Blade",
      }),
      type: "ABILITY",
    },
    Sever: {
      description: intl.formatMessage(
        {
          id: "Crimson Rebellion.Promissories.Sever.Description",
          description: "Description for Faction Promissory: Sever",
          defaultMessage:
            "ACTION: Place this card faceup in your play area and place the sever token in a system that contains your units; wormholes in that system have no effect during movement.{br}Remove the sever token and return this card to the Rebellion player at the end of the status phase.",
        },
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      faction: "Crimson Rebellion",
      id: "Sever",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Promissories.Sever.Title",
        description: "Title of Faction Promissory: Sever",
        defaultMessage: "Sever",
      }),
      type: "PROMISSORY",
    },
    "Share Knowledge": {
      description: intl.formatMessage(
        {
          id: "Deepwrought Scholarate.Promissories.Share Knowledge.Description",
          description: "Description for Faction Promissory: Share Knowledge",
          defaultMessage:
            "ACTION: Place this card faceup in your play area and gain 1 non-faction, non-unit upgrade technology that the Deepwrought player owns; place that technology on this card.{br}Return that technology to the deck and this card to the Deepwrought player at the end of the status phase.",
        },
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      faction: "Deepwrought Scholarate",
      id: "Share Knowledge",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Promissories.Share Knowledge.Title",
        description: "Title of Faction Promissory: Share Knowledge",
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
        id: "Events.Stellar Atomics.Title",
        description: "Title of Event: Stellar Atomics",
        defaultMessage: "Stellar Atomics",
      }),
      type: "EVENT",
    },
  };
}
