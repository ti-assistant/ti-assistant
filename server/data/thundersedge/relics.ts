import { IntlShape } from "react-intl";

export default function getThundersEdgeRelics(
  intl: IntlShape
): Record<ThundersEdge.RelicId, BaseRelic> {
  return {
    "Heart of Ixth": {
      description: intl.formatMessage(
        {
          id: "Relics.Heart of Ixth.Description",
          description: "Description for Relic: Heart of Ixth",
          defaultMessage:
            "After any die is rolled, you may exhaust this card to add or subtract 1 from its result.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Heart of Ixth",
      name: intl.formatMessage({
        id: "Relics.Heart of Ixth.Title",
        description: "Title of Relic: Heart of Ixth",
        defaultMessage: "Heart of Ixth",
      }),
      timing: "PASSIVE",
    },
    "Lightrail Ordnance": {
      description: intl.formatMessage({
        id: "Relics.Lightrail Ordnance.Description",
        description: "Description for Relic: Lightrail Ordnance",
        defaultMessage:
          "Your space docks gain SPACE CANNON 5 (x2). You may use your space dock's SPACE CANNON against ships that are adjacent to their systems.",
      }),
      expansion: "THUNDERS EDGE",
      id: "Lightrail Ordnance",
      name: intl.formatMessage({
        id: "Relics.Lightrail Ordnance.Title",
        description: "Title of Relic: Lightrail Ordnance",
        defaultMessage: "Lightrail Ordnance",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Metali Void Armaments": {
      description: intl.formatMessage({
        id: "Relics.Metali Void Armaments.Description",
        description: "Description for Relic: Metali Void Armaments",
        defaultMessage:
          'During the "Anti-Fighter Barrage" step of space combat, you may resolve ANTI-FIGHTER BARRAGE 6 (x3) against your opponent\'s units.',
      }),
      expansion: "THUNDERS EDGE",
      id: "Metali Void Armaments",
      name: intl.formatMessage({
        id: "Relics.Metali Void Armaments.Title",
        description: "Title of Relic: Metali Void Armaments",
        defaultMessage: "Metali Void Armaments",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Metali Void Shielding": {
      description: intl.formatMessage({
        id: "Relics.Metali Void Shielding.Description",
        description: "Description for Relic: Metali Void Shielding",
        defaultMessage:
          "Each time hits are produced against 1 or more of your non-fighter ships, 1 of those ships may use SUSTAIN DAMAGE as if it had that ability.",
      }),
      expansion: "THUNDERS EDGE",
      id: "Metali Void Shielding",
      name: intl.formatMessage({
        id: "Relics.Metali Void Shielding.Title",
        description: "Title of Relic: Metali Void Shielding",
        defaultMessage: "Metali Void Shielding",
      }),
      timing: "TACTICAL_ACTION",
    },
    "The Quantumcore": {
      description: intl.formatMessage(
        {
          id: "Relics.The Quantumcore.Description",
          description: "Description for Relic: The Quantumcore",
          defaultMessage:
            "When you gain this card, gain your breakthrough.{br}You have SYNERGY for all technology types.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      removedIn: "TWILIGHTS FALL",
      id: "The Quantumcore",
      name: intl.formatMessage({
        id: "Relics.The Quantumcore.Title",
        description: "Title of Relic: The Quantumcore",
        defaultMessage: "The Quantumcore",
      }),
      timing: "PASSIVE",
    },
    "The Silver Flame": {
      description: intl.formatMessage(
        {
          id: "Relics.The Silver Flame.Description",
          description: "Description for Relic: The Silver Flame",
          defaultMessage:
            "The Silver Flame may be exchanged as part of a transaction.{br}ACTION: Roll 1 die and purge this card; if the result is a 10, gain 1 victory point. Otherwise, purge your home system and all units in it; you cannot score public objectives. Put The Fracture into play if it is not already.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "The Silver Flame",
      name: intl.formatMessage({
        id: "Relics.The Silver Flame.Title",
        description: "Title of Relic: The Silver Flame",
        defaultMessage: "The Silver Flame",
      }),
      timing: "COMPONENT_ACTION",
    },
    "The Triad": {
      description: intl.formatMessage(
        {
          id: "Relics.The Triad.Description",
          description: "Description for Relic: The Triad",
          defaultMessage:
            "This card can be readied and spent as if it were a planet card. Its resource and influence values are equal to 3 plus the number of different types of relic fragments you own.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "The Triad",
      name: intl.formatMessage({
        id: "Relics.The Triad.Title",
        description: "Title of Relic: The Triad",
        defaultMessage: "The Triad",
      }),
      timing: "OTHER",
    },
  };
}
