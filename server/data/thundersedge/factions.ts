import { IntlShape } from "react-intl";
import { production, sustainDamage } from "../../../src/util/strings";

export default function getThundersEdgeFactions(
  intl: IntlShape
): Record<ThundersEdge.FactionId, BaseFaction> {
  return {
    "Last Bastion": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Last Bastion.Abilities.Liberate.Title",
            description: "Title of Faction Ability: Liberate",
            defaultMessage: "Liberate",
          }),
          description: intl.formatMessage({
            id: "Last Bastion.Abilities.Liberate.Description",
            description: "Description for Faction Ability: Liberate",
            defaultMessage:
              "When you gain control of a planet, ready that planet if it contains a number of your Infantry equal to or greater than that planet's resource value; otherwise, place 1 Infantry on that planet.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Last Bastion.Abilities.Galvanize.Title",
            description: "Title of Faction Ability: Galvanize",
            defaultMessage: "Galvanize",
          }),
          description: intl.formatMessage({
            id: "Last Bastion.Abilities.Galvanize.Description",
            description: "Description for Faction Ability: Galvanize",
            defaultMessage:
              "When a game effect instructs a player to galvanize a unit, they place a galvanize token beneath it if it does not have one. Galvanized units roll 1 additional die for combat rolls and unit abilities.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Last Bastion.Abilities.Pheonix Standard.Title",
            description: "Title of Faction Ability: Pheonix Standard",
            defaultMessage: "Pheonix Standard",
          }),
          description: intl.formatMessage({
            id: "Last Bastion.Abilities.Pheonix Standard.Description",
            description: "Description for Faction Ability: Pheonix Standard",
            defaultMessage:
              "At the end of combat, you may galvanize 1 of your units that participated.",
          }),
        },
      ],
      colors: {
        Orange: 1.6,
      },
      colorList: [
        "Orange",
        "Black",
        "Yellow",
        "Blue",
        "Red",
        "Green",
        "Purple",
        "Magenta",
      ],
      commodities: 1,
      expansion: "THUNDERS EDGE",
      id: "Last Bastion",
      name: intl.formatMessage({
        id: "Last Bastion.Name",
        description: "Name of Faction: Last Bastion",
        defaultMessage: "Last Bastion",
      }),
      promissories: [
        // TODO: Add promissories.
      ],
      shortname: intl.formatMessage({
        id: "Last Bastion.Shortname",
        description: "Shortened version of Faction name: Last Bastion",
        defaultMessage: "Bastion",
      }),
      startswith: {
        // TODO: Add starting stuff.
        techs: [],
        planets: [],
        units: {},
      },
      units: [
        {
          abilities: [sustainDamage(intl), production("1", intl)],
          description: intl.formatMessage({
            id: "Last Bastion.Units.The Egeiro.Description",
            description: "Description for Faction Unit: The Egeiro",
            defaultMessage:
              "Apply +1 to the result of each of this unit's combat rolls for each non-home system that contains a planet you control.",
          }),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Last Bastion.Units.The Egeiro.Title",
            description: "Title of Faction Unit: The Egeiro",
            defaultMessage: "The Egeiro",
          }),
          stats: {
            cost: 8,
            combat: 9,
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Last Bastion.Units.A3 Valiance.Description",
            description: "Description for Faction Unit: A3 Valiance",
            defaultMessage:
              "When this unit is destroyed, if it was galvanized, galvanize up to 3 of your Infantry in its system.",
          }),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Last Bastion.Units.A3 Valiance.Title",
            description: "Title of Faction Unit: A3 Valiance",
            defaultMessage: "A3 Valiance",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [production("X", intl)],
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: 'Last Bastion.Units.4X41C "Helios" VI.Title',
            description: 'Title of Faction Unit: 4X41C "Helios" VI',
            defaultMessage: '4X41C "Helios" VI',
          }),
          stats: {},
          type: "Space Dock",
          // upgrade: '4X41C "Helios" VII',
        },
      ],
    },
  };
}
