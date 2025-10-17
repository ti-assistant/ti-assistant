import { IntlShape } from "react-intl";

export default function getCodexFourEvents(
  intl: IntlShape
): Record<CodexFour.EventId, TIEvent> {
  return {
    "Age of Commerce": {
      description: intl.formatMessage(
        {
          id: "Events.Age of Commerce.Description",
          description: "Description of Event: Age of Commerce",
          defaultMessage:
            "Players do not have to be neighbors to perform transactions with each other.{br}Players do not have a maximum number of commodities; when they refresh commodities, they gain a number of commodities equal to their commodities value instead.{br}Players can share non-faction technology with other players as part of a transaction. When sharing technology, the receiving player gains that technology from their own deck; the sharing player does not lose the technology.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Age of Commerce",
      name: intl.formatMessage({
        id: "Events.Age of Commerce.Title",
        description: "Title of Event: Age of Commerce",
        defaultMessage: "Age of Commerce",
      }),
    },
    "Age of Exploration": {
      description: intl.formatMessage(
        {
          id: "Events.Age of Exploration.Description",
          description: "Description of Event: Age of Exploration",
          defaultMessage:
            "Relics only require 2 matching fragments be purged instead of 3.{br}The Naaz-Rokha Alliance's FABRICATION faction ability and BLACK MARKET FORGERY promissory note do not require purged fragments to match.{br}All players can perform the following action:{br}ACTION: Exhaust DARK ENERGY TAP and choose a non-home edge system that contains your ships to roll a 1 die. On a result of 1 - 4, draw a random unused red tile; on a result of 5 - 10, draw an random unused blue tile. Place that tile adjacent to the chosen system so that it is touching 2 non-home systems. Place a frontier token in the system if it does not contain any planets.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Age of Exploration",
      name: intl.formatMessage({
        id: "Events.Age of Exploration.Title",
        description: "Title of Event: Age of Exploration",
        defaultMessage: "Age of Exploration",
      }),
    },
    "Total War": {
      description: intl.formatMessage(
        {
          id: "Events.Total War.Description",
          description: "Description for Event: Total War",
          defaultMessage:
            "When a player destroys or produces a hit that destroys another player's units, they place commodities from the supply equal to the combined cost of the units they destroyed on a planet they control in their home system (infantry and fighters are worth 1 each).{br}When a player gains control of a home system that has commodities, they move those commodities to a planet they control in their own home system.{br}All players can perform the following action:{br}ACTION: Discard 10 commodities from planets in your home system to gain 1 victory point.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Total War",
      name: intl.formatMessage({
        id: "Events.Total War.Title",
        description: "Title of Event: Total War",
        defaultMessage: "Total War",
      }),
    },
    "Minor Factions": {
      description: intl.formatMessage(
        {
          id: "Events.Minor Factions.Description",
          description: "Description for Event: Minor Factions",
          defaultMessage:
            "During setup, players are dealt 1 fewer blue tile. Before creating the galaxy, shuffle the reference cards for factions not being played and deal 1 to each player. In speaker order, each player places that faction's home system in the second ring, equidistant from players' home systems. Then, that player places 3 neutral infantry on that system's planets, split as evenly as possible. These systems are minor faction systems and do not count as home systems.{br}When a player controls each planet in a minor faction system, they take that factions alliance card from the deck or from the player that owned it previously.{br}Planets in minor faction systems gain all three planet traits (cultural, industrial, and hazardous).",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Minor Factions",
      name: intl.formatMessage({
        id: "Events.Minor Factions.Title",
        description: "Title of Event: Minor Factions",
        defaultMessage: "Minor Factions",
      }),
    },
  };
}
