import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  bombardment,
  planetaryShield,
  production,
  sustainDamage,
} from "../../../src/util/strings";

export default function getTwilightsFallFactions(
  intl: IntlShape
): Record<TwilightsFall.FactionId, BaseFaction> {
  return {
    "A Sickening Lurch": {
      color: "Black",
      commodities: 2,
      expansion: "TWILIGHTS FALL",
      id: "A Sickening Lurch",
      name: intl.formatMessage({
        id: "A Sickening Lurch.Name",
        description: "Name of Faction: A Sickening Lurch",
        defaultMessage: "A Sickening Lurch",
      }),
      shortname: intl.formatMessage({
        id: "A Sickening Lurch.Shortname",
        description: "Shortened version of Faction name: A Sickening Lurch",
        defaultMessage: "Lurch",
      }),
      units: [
        {
          abilities: [sustainDamage(intl), bombardment("7", intl)],
          description: intl.formatMessage({
            id: "A Sickening Lurch.Units.A Strangled Whisper.Description",
            description: "Description for Faction Unit: A Strangled Whisper",
            defaultMessage:
              "This ship can transport any number of infantry and fighters, and they do not count against this ship's capacity.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "A Sickening Lurch.Units.A Strangled Whisper.Title",
            description: "Title of Faction Unit: A Strangled Whisper",
            defaultMessage: "A Strangled Whisper",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 1,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "A Sickening Lurch.Units.Bone Picked Clean.Description",
            description: "Description for Faction Unit: Bone Picked Clean",
            defaultMessage:
              "When you splice, capture 1 infantry from the reinforcements of any player with adjacent units; you can spend 1 captured infantry after rolling during combat to reroll this unit's dice.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "A Sickening Lurch.Units.Bone Picked Clean.Title",
            description: "Title of Faction Unit: Bone Picked Clean",
            defaultMessage: "Bone Picked Clean",
          }),
          stats: {
            cost: 2,
            combat: "5(x2)",
          },
          type: "Mech",
        },
      ],
    },
    "Avarice Rex": {
      color: "Yellow",
      commodities: 6,
      expansion: "TWILIGHTS FALL",
      id: "Avarice Rex",
      name: intl.formatMessage({
        id: "Avarice Rex.Name",
        description: "Name of Faction: Avarice Rex",
        defaultMessage: "Avarice Rex",
      }),
      shortname: intl.formatMessage({
        id: "Avarice Rex.Shortname",
        description: "Shortened version of Faction name: Avarice Rex",
        defaultMessage: "Avarice",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Avarice Rex.Units.Scintilla.Description",
            description: "Description for Faction Unit: Scintilla",
            defaultMessage:
              "When you splice, gain 2 commodities or convert up to 2 of your commodities to trade goods.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "Avarice Rex.Units.Scintilla.Title",
            description: "Title of Faction Unit: Scintilla",
            defaultMessage: "Scintilla",
          }),
          stats: {
            cost: 8,
            combat: "9(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Avarice Rex.Units.Delver.Description",
            description: "Description for Faction Unit: Delver",
            defaultMessage:
              "When you splice, gain 1 commodity or convert 1 of your commodities to a trade good.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Avarice Rex.Units.Delver.Title",
            description: "Title of Faction Unit: Delver",
            defaultMessage: "Delver",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "El Nen Janovet": {
      color: "Magenta",
      commodities: 3,
      expansion: "TWILIGHTS FALL",
      id: "El Nen Janovet",
      name: intl.formatMessage({
        id: "El Nen Janovet.Name",
        description: "Name of Faction: El Nen Janovet",
        defaultMessage: "El Nen Janovet",
      }),
      shortname: intl.formatMessage({
        id: "El Nen Janovet.Shortname",
        description: "Shortened version of Faction name: El Nen Janovet",
        defaultMessage: "Janovet",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "El Nen Janovet.Units.The Faces of Janovet.Description",
            description: "Description for Faction Unit: The Faces of Janovet",
            defaultMessage:
              "This unit gains the unit abilities and text abilities of your destroyer, cruiser, and dreadnought unit upgrade technologies.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "El Nen Janovet.Units.The Faces of Janovet.Title",
            description: "Title of Faction Unit: The Faces of Janovet",
            defaultMessage: "The Faces of Janovet",
          }),
          stats: {
            cost: 8,
            combat: "5(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "El Nen Janovet.Units.Analyzer.Description",
            description: "Description for Faction Unit: Analyzer",
            defaultMessage:
              "After you win a ground combat in which this unit participated, you may return this unit to your reinforcements to draw 1 unit upgrade.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "El Nen Janovet.Units.Analyzer.Title",
            description: "Title of Faction Unit: Analyzer",
            defaultMessage: "Analyzer",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Il Na Viroset": {
      color: "Purple",
      commodities: 4,
      expansion: "TWILIGHTS FALL",
      id: "Il Na Viroset",
      name: intl.formatMessage({
        id: "Il Na Viroset.Name",
        description: "Name of Faction: Il Na Viroset",
        defaultMessage: "Il Na Viroset",
      }),
      shortname: intl.formatMessage({
        id: "Il Na Viroset.Shortname",
        description: "Shortened version of Faction name: Il Na Viroset",
        defaultMessage: "Viroset",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Il Na Viroset.Units.Enigma.Description",
            description: "Description for Faction Unit: Enigma",
            defaultMessage:
              "This unit ignores the effects of all anomalies. Its MOVE value is reduced by 1 for each unit it would transport.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "Il Na Viroset.Units.Enigma.Title",
            description: "Title of Faction Unit: Enigma",
            defaultMessage: "Enigma",
          }),
          stats: {
            cost: 7,
            combat: 7,
            move: 7,
            capacity: 7,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Il Na Viroset.Units.Starlancer XI.Description",
            description: "Description for Faction Unit: Starlancer XI",
            defaultMessage:
              "This unit participates in space combat as if it were a ship. For each anomaly this unit is in or adjacent to, apply +1 to this unit's combat rolls.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Il Na Viroset.Units.Starlancer XI.Title",
            description: "Title of Faction Unit: Starlancer XI",
            defaultMessage: "Starlancer XI",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Il Sai Lakoe": {
      color: "Green",
      commodities: 3,
      expansion: "TWILIGHTS FALL",
      id: "Il Sai Lakoe",
      name: intl.formatMessage({
        id: "Il Sai Lakoe.Name",
        description: "Name of Faction: Il Sai Lakoe",
        defaultMessage: "Il Sai Lakoe, Herald of Thorns",
      }),
      shortname: intl.formatMessage({
        id: "Il Sai Lakoe.Shortname",
        description: "Shortened version of Faction name: Il Sai Lakoe",
        defaultMessage: "Lakoe",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Il Sai Lakoe.Units.Nightbloom.Description",
            description: "Description for Faction Unit: Nightbloom",
            defaultMessage:
              "When this unit moves, you may resolve the PRODUCTION abilities of your units in the system it started in and each system it moved through.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "Il Sai Lakoe.Units.Nightbloom.Title",
            description: "Title of Faction Unit: Nightbloom",
            defaultMessage: "Nightbloom",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 6,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl), production("2", intl)],
          description: intl.formatMessage({
            id: "Il Sai Lakoe.Units.Lakoe's Roots.Description",
            description: "Description for Faction Unit: Lakoe's Roots",
            defaultMessage:
              "When this unit is produced, place it on any planet you control.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Il Sai Lakoe.Units.Lakoe's Roots.Title",
            description: "Title of Faction Unit: Lakoe's Roots",
            defaultMessage: "Lakoe's Roots",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Radiant Aur": {
      color: "Orange",
      commodities: 4,
      expansion: "TWILIGHTS FALL",
      id: "Radiant Aur",
      name: intl.formatMessage({
        id: "Radiant Aur.Name",
        description: "Name of Faction: Radiant Aur",
        defaultMessage: "Radiant Aur",
      }),
      shortname: intl.formatMessage({
        id: "Radiant Aur.Shortname",
        description: "Shortened version of Faction name: Radiant Aur",
        defaultMessage: "Aur",
      }),
      units: [
        {
          abilities: [sustainDamage(intl), antiFighterBarrage("5 (x3)", intl)],
          description: intl.formatMessage({
            id: "Radiant Aur.Units.Airo Shir Rex.Description",
            description: "Description for Faction Unit: Airo Shir Rex",
            defaultMessage:
              "At the start of the edict phase, if this unit is on the game board, draw and resolve 1 edict.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "Radiant Aur.Units.Airo Shir Rex.Title",
            description: "Title of Faction Unit: Airo Shir Rex",
            defaultMessage: "Airo Shir Rex",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 6,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl), planetaryShield(intl)],
          description: intl.formatMessage({
            id: "Radiant Aur.Units.Starlancer II.Description",
            description: "Description for Faction Unit: Starlancer II",
            defaultMessage:
              "At the start of each round of ground combat, you may spend 1 token from your strategy pool to repair all of your mechs.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Radiant Aur.Units.Starlancer II.Title",
            description: "Title of Faction Unit: Starlancer II",
            defaultMessage: "Starlancer II",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "The Ruby Monarch": {
      color: "Red",
      commodities: 2,
      expansion: "TWILIGHTS FALL",
      id: "The Ruby Monarch",
      name: intl.formatMessage({
        id: "The Ruby Monarch.Name",
        description: "Name of Faction: The Ruby Monarch",
        defaultMessage: "The Ruby Monarch",
      }),
      shortname: intl.formatMessage({
        id: "The Ruby Monarch.Shortname",
        description: "Shortened version of Faction name: The Ruby Monarch",
        defaultMessage: "Monarch",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "The Ruby Monarch.Units.The Scarlet Knife.Description",
            description: "Description for Faction Unit: The Scarlet Knife",
            defaultMessage:
              "DEPLOY: At the start of your turn, you may discard 1 of your abilities or genomes to place this unit from your reinforcements into a system that contains your ships.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "The Ruby Monarch.Units.The Scarlet Knife.Title",
            description: "Title of Faction Unit: The Scarlet Knife",
            defaultMessage: "The Scarlet Knife",
          }),
          stats: {
            cost: 8,
            combat: "5(x2)",
            move: 2,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "The Ruby Monarch.Units.The Sharpened Edge.Description",
            description: "Description for Faction Unit: The Sharpened Edge",
            defaultMessage:
              "DEPLOY: When your flagship is placed, you may place 1 mech into your flagship's space area.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "The Ruby Monarch.Units.The Sharpened Edge.Title",
            description: "Title of Faction Unit: The Sharpened Edge",
            defaultMessage: "The Sharpened Edge",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "The Saint of Swords": {
      color: "Blue",
      commodities: 3,
      expansion: "TWILIGHTS FALL",
      id: "The Saint of Swords",
      name: intl.formatMessage({
        id: "The Saint of Swords.Name",
        description: "Name of Faction: The Saint of Swords",
        defaultMessage: "The Saint of Swords",
      }),
      shortname: intl.formatMessage({
        id: "The Saint of Swords.Shortname",
        description: "Shortened version of Faction name: The Saint of Swords",
        defaultMessage: "Saint",
      }),
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "The Saint of Swords.Units.Tizona.Description",
            description: "Description for Faction Unit: Tizona",
            defaultMessage:
              "Apply +1 to the MOVE value of this ship if it would transport 4 units.",
          }),
          expansion: "TWILIGHTS FALL",
          name: intl.formatMessage({
            id: "The Saint of Swords.Units.Tizona.Title",
            description: "Title of Faction Unit: Tizona",
            defaultMessage: "Tizona",
          }),
          stats: {
            cost: 8,
            combat: 3,
            move: 2,
            capacity: 4,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "The Saint of Swords.Units.Colada.Description",
            description: "Description for Faction Unit: Colada",
            defaultMessage:
              "While this unit is being transported, choose 1 unit in its system that has a capacity value to roll 1 additional die on its combat rolls.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "The Saint of Swords.Units.Colada.Title",
            description: "Title of Faction Unit: Colada",
            defaultMessage: "Colada",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
  };
}
