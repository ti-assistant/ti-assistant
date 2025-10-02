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
  };
}
