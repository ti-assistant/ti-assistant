import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  production,
  sustainDamage,
} from "../../../src/util/strings";

export default function getThundersEdgeFactions(
  intl: IntlShape,
): Record<ThundersEdge.FactionId, BaseFaction> {
  return {
    "Crimson Rebellion": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.Sundered.Title",
            description: "Title of Faction Ability: Sundered",
            defaultMessage: "Sundered",
          }),
          description: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.Sundered.Description",
            description: "Description for Faction Ability: Sundered",
            defaultMessage:
              "You cannot use wormholes other than epsilon wormholes. Other players' units that move or are placed into your home system are destroyed.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.Incursion.Title",
            description: "Title of Faction Ability: Incursion",
            defaultMessage: "Incursion",
          }),
          description: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.Incursion.Description",
            description: "Description for Faction Ability: Incursion",
            defaultMessage:
              "When you activate a system that contains a breach, you may flip that breach; systems that contain active breaches are adjacent. At the end of the status phase, any player with ships in a system that contains an active breach may remove that breach.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.The Sorrow.Title",
            description: "Title of Faction Ability: The Sorrow",
            defaultMessage: "The Sorrow",
          }),
          description: intl.formatMessage({
            id: "Crimson Rebellion.Abilities.The Sorrow.Description",
            description: "Description for Faction Ability: The Sorrow",
            defaultMessage:
              "When you create the game board, place The Sorrow (tile 94) where your home system would be placed, and place an active breach in it. The Sorrow is not a home system. Then, place your home system (tile 118) in your play area.",
          }),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Crimson Rebellion.Breakthrough.Resonance Generator.Title",
          description: "Title of Faction Breakthrough: Resonance Generator",
          defaultMessage: "Resonance Generator",
        }),
        description: intl.formatMessage(
          {
            id: "Crimson Rebellion.Breakthrough.Resonance Generator.Description",
            description:
              "Description of Faction Breakthrough: Resonance Generator",
            defaultMessage:
              "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains an active breach.{br}ACTION: Exhaust this card to flip any breach or place an active breach in a non-home system that contains your units.",
          },
          { br: "\n\n" },
        ),
        id: "Resonance Generator",
        synergy: { left: "BLUE", right: "RED" },
        timing: "COMPONENT_ACTION",
      },
      colorList: [
        "Red",
        "Purple",
        "Black",
        "Magenta",
        "Orange",
        "Yellow",
        "Blue",
        "Green",
      ],
      commodities: 2,
      expansion: "THUNDERS EDGE",
      id: "Crimson Rebellion",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Name",
        description: "Name of Faction: Crimson Rebellion",
        defaultMessage: "Crimson Rebellion",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Crimson Rebellion.Promissories.Sever.Title",
            description: "Title of Faction Promissory: Sever",
            defaultMessage: "Sever",
          }),
          description: intl.formatMessage(
            {
              id: "Crimson Rebellion.Promissories.Sever.Description",
              description: "Description for Faction Promissory: Sever",
              defaultMessage:
                "ACTION: Place this card faceup in your play area and place the sever token in a system that contains your units; wormholes in that system have no effect during movement.{br}Remove the sever token and return this card to the Rebellion player at the end of the status phase.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Crimson Rebellion.Shortname",
        description: "Shortened version of Faction name: Crimson Rebellion",
        defaultMessage: "Rebellion",
      }),
      startswith: {
        choice: {
          description: intl.formatMessage({
            id: "Crimson Rebellion.Tech Choice",
            description: "Text of Rebellion's tech choice.",
            defaultMessage:
              "Choose one blue or red technology with no prerequisites.",
          }),
          options: [
            "Antimass Deflectors",
            "Dark Energy Tap",
            "Plasma Scoring",
            "AI Development Algorithm",
          ],
          select: 1,
        },
        planets: ["Ahk Creuxx"],
        units: {
          Carrier: 1,
          Destroyer: 2,
          Fighter: 3,
          Infantry: 4,
          "Space Dock": 1,
          PDS: 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Crimson Rebellion.Units.Quietus.Description",
            description: "Description for Faction Unit: Quietus",
            defaultMessage:
              "While this unit is in a system that contains an active breach, other players' units in systems with active breaches lose all of their unit abilities.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Crimson Rebellion.Units.Quietus.Title",
            description: "Title of Faction Unit: Quietus",
            defaultMessage: "Quietus",
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
            id: "Crimson Rebellion.Units.Revenant.Description",
            description: "Description for Faction Unit: Revenant",
            defaultMessage:
              'DEPLOY: During the "Commit Ground Forces" step of your tactical action in a system that contains an active breach, you may commit 1 mech, even if you have no units in the system.',
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Crimson Rebellion.Units.Revenant.Title",
            description: "Title of Faction Unit: Revenant",
            defaultMessage: "Revenant",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [antiFighterBarrage("9 (x2)", intl)],
          description: intl.formatMessage({
            id: "Crimson Rebellion.Units.Exile I.Description",
            description: "Description for Faction Unit: Exile I",
            defaultMessage:
              "At the end of any player's combat in this unit's system or an adjacent system, you may place 1 inactive breach in that system.",
          }),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Crimson Rebellion.Units.Exile I.Title",
            description: "Title of Faction Unit: Exile I",
            defaultMessage: "Exile I",
          }),
          stats: {
            cost: 1,
            combat: 8,
            move: 2,
          },
          type: "Destroyer",
          upgrade: "Exile II",
        },
      ],
    },
    "Deepwrought Scholarate": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Abilities.Research Team.Title",
            description: "Title of Faction Ability: Research Team",
            defaultMessage: "Research Team",
          }),
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Abilities.Research Team.Description",
            description: "Description for Faction Ability: Research Team",
            defaultMessage:
              "When ground forces are committed, if your units on the planet are not already coexisting, you may choose for your units to coexist.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Abilities.Oceanbound.Title",
            description: "Title of Faction Ability: Oceanbound",
            defaultMessage: "Oceanbound",
          }),
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Abilities.Oceanbound.Description",
            description: "Description for Faction Ability: Oceanbound",
            defaultMessage:
              "When your units begin coexisting on a planet, gain an ocean card and ready it. Any time you have more ocean cards than there are planets that have your coexisting units, discard ocean cards until you do not.",
          }),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Deepwrought Scholarate.Breakthrough.Visionaria Select.Title",
          description: "Title of Faction Breakthrough: Visionaria Select",
          defaultMessage: "Visionaria Select",
        }),
        description: intl.formatMessage(
          {
            id: "Deepwrought Scholarate.Breakthrough.Visionaria Select.Description",
            description:
              "Description of Faction Breakthrough: Visionaria Select",
            defaultMessage:
              "ACTION: Exhaust this card to allow each other player to spend 3 trade goods and give you 1 promissory note. Each player that does may research a non-faction, non-unit upgrade technology. You also gain each technology researched this way.",
          },
          { br: "\n\n" },
        ),
        id: "Visionaria Select",
        synergy: { left: "YELLOW", right: "GREEN" },
        timing: "COMPONENT_ACTION",
      },
      colorList: [
        "Blue",
        "Black",
        "Purple",
        "Green",
        "Yellow",
        "Magenta",
        "Red",
        "Orange",
      ],
      commodities: 3,
      expansion: "THUNDERS EDGE",
      id: "Deepwrought Scholarate",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Name",
        description: "Name of Faction: Deepwrought Scholarate",
        defaultMessage: "Deepwrought Scholarate",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Promissories.Share Knowledge.Title",
            description: "Title of Faction Promissory: Share Knowledge",
            defaultMessage: "Share Knowledge",
          }),
          description: intl.formatMessage(
            {
              id: "Deepwrought Scholarate.Promissories.Share Knowledge.Description",
              description:
                "Description for Faction Promissory: Share Knowledge",
              defaultMessage:
                "ACTION: Place this card faceup in your play area and gain 1 non-faction, non-unit upgrade technology that the Deepwrought player owns; place that technology on this card.{br}Return that technology to the deck and this card to the Deepwrought player at the end of the status phase.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Deepwrought Scholarate.Shortname",
        description:
          "Shortened version of Faction name: Deepwrought Scholarate",
        defaultMessage: "Deepwrought",
      }),
      startswith: {
        choice: {
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Tech Choice",
            description: "Text of Deepwrought's tech choice.",
            defaultMessage: "During setup, research technology twice.",
          }),
          options: [],
          select: 2,
        },
        planets: ["Ikatena"],
        units: {
          Dreadnought: 1,
          Carrier: 1,
          Fighter: 4,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Units.D.W.S Luminous.Description",
            description: "Description for Faction Unit: D.W.S Luminous",
            defaultMessage:
              "This ship can move through systems that contain your units, even if other players units are present: if it would, apply +1 to its move value for each of those systems.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Units.D.W.S Luminous.Title",
            description: "Title of Faction Unit: D.W.S Luminous",
            defaultMessage: "D.W.S Luminous",
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
          abilities: [sustainDamage(intl), production("1", intl)],
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Units.Eanautic.Description",
            description: "Description for Faction Unit: Eanautic",
            defaultMessage:
              "When another player activates this system, if this unit is coexisting, you may move it and any of your infantry on its planet to a planet you control in your home system.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Units.Eanautic.Title",
            description: "Title of Faction Unit: Eanautic",
            defaultMessage: "Eanautic",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    Firmament: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Firmament.Abilities.Plots Within Plots.Title",
            description: "Title of Faction Ability: Plots Within Plots",
            defaultMessage: "Plots Within Plots",
          }),
          description: intl.formatMessage({
            id: "Firmament.Abilities.Plots Within Plots.Description",
            description: "Description for Faction Ability: Plots Within Plots",
            defaultMessage:
              "You can score secret objectives already scored by other players if you fulfill their requirements; this does not count against your secret objective limit or the number you can score in a round. When you score another player's secret objective, do not gain a victory point; instead, place a facedown plot card into your play area with that player's control token on it.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Firmament.Abilities.Puppets of the Blade.Title",
            description: "Title of Faction Ability: Puppets of the Blade",
            defaultMessage: "Puppets of the Blade",
          }),
          description: intl.formatMessage(
            {
              id: "Firmament.Abilities.Puppets of the Blade.Description",
              description:
                "Description for Faction Ability: Puppets of the Blade",
              defaultMessage:
                "If you have at least 1 plot card in your play area, gain the following ability:{br}ACTION: Purge The Firmament's faction sheet, leaders, planet cards, and promissory note. Then, gain all of the faction components for The Obsidian.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Firmament.Breakthrough.The Sowing.Title",
          description: "Title of Faction Breakthrough: The Sowing",
          defaultMessage: "The Sowing",
        }),
        description: intl.formatMessage(
          {
            id: "Firmament.Breakthrough.The Sowing.Description",
            description: "Description of Faction Breakthrough: The Sowing",
            defaultMessage:
              "When you gain this card and at the start of the status phase, you may place up to 3 of your trade goods on this card.{br}Flip this card if you become the Obsidian faction.",
          },
          { br: "\n\n" },
        ),
        id: "The Sowing",
        synergy: { left: "YELLOW", right: "GREEN" },
        timing: "OTHER",
      },
      colorList: [
        "Purple",
        "Black",
        "Blue",
        "Red",
        "Magenta",
        "Orange",
        "Green",
        "Yellow",
      ],
      commodities: 3,
      expansion: "THUNDERS EDGE",
      id: "Firmament",
      name: intl.formatMessage({
        id: "Firmament.Name",
        description: "Name of Faction: Firmament",
        defaultMessage: "Firmament",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Firmament.Promissories.Black Ops.Title",
            description: "Title of Faction Promissory: Black Ops",
            defaultMessage: "Black Ops",
          }),
          description: intl.formatMessage(
            {
              id: "Firmament.Promissories.Black Ops.Description",
              description: "Description for Faction Promissory: Black Ops",
              defaultMessage:
                "When you receive this card, if you are not the Firmament:{br}The Firmament player may place 1 facedown plot card in their play area with your control token on it. Then, gain 2 command tokens, gain 2 trade goods, and purge this card.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Firmament.Shortname",
        description: "Shortened version of Faction name: Firmament",
        defaultMessage: "Firmament",
      }),
      startswith: {
        choice: {
          description: intl.formatMessage({
            id: "Firmament.Tech Choice",
            description: "Text of Firmament's tech choice.",
            defaultMessage:
              "Choose one green or yellow technology that has no prerequisites.",
          }),
          options: [
            "Neural Motivator",
            "Psychoarchaeology",
            "Sarween Tools",
            "Scanlink Drone Network",
          ],
          select: 1,
        },
        planets: ["Cronos", "Tallin"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Destroyer: 1,
          Fighter: 3,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Firmament.Units.Heaven's Eye.Description",
            description: "Description for Faction Unit: Heaven's Eye",
            defaultMessage:
              "If the active system contains units that belong to a player who has a control token on 1 of your plots, apply +1 to this ship's move value and repair it at the end of every combat round.",
          }),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Firmament.Units.Heaven's Eye.Title",
            description: "Title of Faction Unit: Heaven's Eye",
            defaultMessage: "Heaven's Eye",
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
            id: "Firmament.Units.Viper EX-23.Description",
            description: "Description for Faction Unit: Viper EX-23",
            defaultMessage:
              "When ground forces are committed to this planet, you may choose for your units to coexist, if they were not already. Flip this card if your faction becomes the Obsidian.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Firmament.Units.Viper EX-23.Title",
            description: "Title of Faction Unit: Viper EX-23",
            defaultMessage: "Viper EX-23",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
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
      breakthrough: {
        name: intl.formatMessage({
          id: "Last Bastion.Breakthrough.The Icon.Title",
          description: "Title of Faction Breakthrough: The Icon",
          defaultMessage: "The Icon",
        }),
        description: intl.formatMessage(
          {
            id: "Last Bastion.Breakthrough.The Icon.Description",
            description: "Description of Faction Breakthrough: The Icon",
            defaultMessage:
              "When you produce ships, you may exhaust this card to place those ships in a system that contains 1 of your command tokens, at least 1 of your ground forces, and no other player's ships.",
          },
          { br: "\n\n" },
        ),
        id: "The Icon",
        synergy: { left: "RED", right: "YELLOW" },
        timing: "TACTICAL_ACTION",
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
        {
          name: intl.formatMessage({
            id: "Last Bastion.Promissories.Raise the Standard.Title",
            description: "Title of Faction Promissory: Raise the Standard",
            defaultMessage: "Raise the Standard",
          }),
          description: intl.formatMessage(
            {
              id: "Last Bastion.Promissories.Raise the Standard.Description",
              description:
                "Description for Faction Promissory: Raise the Standard",
              defaultMessage:
                "At the end of a combat:{br}Galvanize 1 of your units that participated.{br}Then, return this card to the Last Bastion player.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Last Bastion.Shortname",
        description: "Shortened version of Faction name: Last Bastion",
        defaultMessage: "Last Bastion",
      }),
      startswith: {
        choice: {
          description: intl.formatMessage({
            id: "Last Bastion.Tech Choice",
            description: "Text of Bastion's tech choice.",
            defaultMessage:
              "Choose 1 blue or yellow technology with no prerequisites.",
          }),
          options: [
            "Antimass Deflectors",
            "Dark Energy Tap",
            "Sarween Tools",
            "Scanlink Drone Network",
          ],
          select: 1,
        },
        planets: ["Ordinian", "Revelation"],
        units: {
          Dreadnought: 1,
          Carrier: 1,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 3,
          "Space Dock": 1,
        },
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
              "When this unit is destroyed, if it was galvanized, galvanize up to 3 of your infantry in its system.",
          }),
          expansion: "POK",
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
          description: intl.formatMessage(
            {
              id: 'Last Bastion.Units.4X41C "Helios" V1.Description',
              description: 'Description for Faction Unit: 4X41C "Helios" V1',
              defaultMessage:
                "This unit's PRODUCTION value is equal to 2 more than the resource value of this planet.{br}The resource value of this planet is increased by 1.{br}Up to 3 fighters in this system do not count against your ships' capacity.",
            },
            { br: "\n\n" },
          ),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: 'Last Bastion.Units.4X41C "Helios" VI.Title',
            description: 'Title of Faction Unit: 4X41C "Helios" VI',
            defaultMessage: '4X41C "Helios" VI',
          }),
          stats: {},
          type: "Space Dock",
          upgrade: "4X4IC Helios V2",
        },
      ],
    },
    Obsidian: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Obsidian.Abilities.Nocturne.Title",
            description: "Title of Faction Ability: Nocturne",
            defaultMessage: "Nocturne",
          }),
          description: intl.formatMessage({
            id: "Obsidian.Abilities.Nocturne.Description",
            description: "Description for Faction Ability: Nocturne",
            defaultMessage: "This faction cannot be chosen during setup.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Obsidian.Abilities.The Blade's Orchestra.Title",
            description: "Title of Faction Ability: The Blade's Orchestra",
            defaultMessage: "The Blade's Orchestra",
          }),
          description: intl.formatMessage(
            {
              id: "Obsidian.Abilities.The Blade's Orchestra.Description",
              description:
                "Description for Faction Ability: The Blade's Orchestra",
              defaultMessage:
                "When this faction comes into play, flip your home system, double-sided faction components, and all of your in-play plot cards. Then, ready Cronos Hollow and Tallin Hollow if you control them.",
            },
            { br: "\n\n" },
          ),
        },
        {
          name: intl.formatMessage({
            id: "Obsidian.Abilities.Marionettes.Title",
            description: "Title of Faction Ability: Marionettes",
            defaultMessage: "Marionettes",
          }),
          description: intl.formatMessage(
            {
              id: "Obsidian.Abilities.Marionettes.Description",
              description: "Description for Faction Ability: Marionettes",
              defaultMessage:
                "The player or players whose control tokens are on each plot card are the puppeted players for the plot.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Obsidian.Breakthrough.The Reaping.Title",
          description: "Title of Faction Breakthrough: The Reaping",
          defaultMessage: "The Reaping",
        }),
        description: intl.formatMessage(
          {
            id: "Obsidian.Breakthrough.The Reaping.Description",
            description: "Description of Faction Breakthrough: The Reaping",
            defaultMessage:
              "Place 1 trade good from the supply onto this card each time you win a combat against a puppeted player.{br}At the start of the status phase, gain all trade goods on this card, then gain an equal number of trade goods from the supply.",
          },
          { br: "\n\n" },
        ),
        id: "The Reaping",
        synergy: { left: "YELLOW", right: "GREEN" },
        timing: "OTHER",
      },
      colorList: [
        "Red",
        "Black",
        "Blue",
        "Purple",
        "Magenta",
        "Orange",
        "Green",
        "Yellow",
      ],
      commodities: 3,
      expansion: "THUNDERS EDGE",
      id: "Obsidian",
      locked: true,
      name: intl.formatMessage({
        id: "Obsidian.Name",
        description: "Name of Faction: Obsidian",
        defaultMessage: "Obsidian",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Obsidian.Promissories.Malevolency.Title",
            description: "Title of Faction Promissory: Malevolency",
            defaultMessage: "Malevolency",
          }),
          description: intl.formatMessage(
            {
              id: "Obsidian.Promissories.Malevolency.Description",
              description: "Description for Faction Promissory: Malevolency",
              defaultMessage:
                "At the end of one of your tactical actions:{br}Spend 1 influence to give this card to one of your neighbors; you can use this ability even if you are the Obsidian player.{br}At the end of the status phase, if you are not the Obsidian player, remove 1 command token from your fleet pool and return it to your reinforcements.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Obsidian.Shortname",
        description: "Shortened version of Faction name: Obsidian",
        defaultMessage: "Obsidian",
      }),
      startswith: {
        planets: [],
        units: {},
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Obsidian.Units.Heaven's Hollow.Title",
            description: "Title of Faction Unit: Heaven's Hollow",
            defaultMessage: "Heaven's Hollow",
          }),
          stats: {
            cost: 8,
            combat: "5(x3)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Obsidian.Units.Viper Hollow.Description",
            description: "Description for Faction Unit: Viper Hollow",
            defaultMessage:
              "If this unit was coexisting when this card flipped to this side, gain control of its planet; the other player's units are now coexisting.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Obsidian.Units.Viper Hollow.Title",
            description: "Title of Faction Unit: Viper Hollow",
            defaultMessage: "Viper Hollow",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Ral Nel Consortium": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Abilities.Survival Instinct.Title",
            description: "Title of Faction Ability: Survival Instinct",
            defaultMessage: "Survival Instinct",
          }),
          description: intl.formatMessage({
            id: "Ral Nel Consortium.Abilities.Survival Instinct.Description",
            description: "Description for Faction Ability: Survival Instinct",
            defaultMessage:
              "After another player activates a system that contains your ships, you may move up to 2 of your ships into the active system from adjacent systems that do not contain your command tokens.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Abilities.Miniaturization.Title",
            description: "Title of Faction Ability: Miniaturization",
            defaultMessage: "Miniaturization",
          }),
          description: intl.formatMessage(
            {
              id: "Ral Nel Consortium.Abilities.Miniaturization.Description",
              description: "Description for Faction Ability: Miniaturization",
              defaultMessage:
                "Your structures can be transported by any ship; this does not require or count against capacity. While your structures are in the space area, they cannot use their unit abilities. At the end of your tactical actions, you may place your structures that are in space areas onto planets you control in their respective systems.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Ral Nel Consortium.Breakthrough.Data Skimmer.Title",
          description: "Title of Faction Breakthrough: Data Skimmer",
          defaultMessage: "Data Skimmer",
        }),
        description: intl.formatMessage(
          {
            id: "Ral Nel Consortium.Breakthrough.Data Skimmer.Description",
            description: "Description of Faction Breakthrough: Data Skimmer",
            defaultMessage:
              "During the action phase, if you have not passed, when other players would discard action cards, they are placed on this card instead.{br}When you pass, take 1 action card from this card and discard the rest.",
          },
          { br: "\n\n" },
        ),
        id: "Data Skimmer",
        synergy: { left: "YELLOW", right: "GREEN" },
        timing: "PASSIVE",
      },
      colorList: [
        "Green",
        "Yellow",
        "Black",
        "Blue",
        "Red",
        "Purple",
        "Magenta",
        "Orange",
      ],
      commodities: 4,
      expansion: "THUNDERS EDGE",
      id: "Ral Nel Consortium",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Name",
        description: "Name of Faction: Ral Nel Consortium",
        defaultMessage: "Ral Nel Consortium",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Promissories.Nano-Link Permit.Title",
            description: "Title of Faction Promissory: Nano-Link Permit",
            defaultMessage: "Nano-Link Permit",
          }),
          description: intl.formatMessage(
            {
              id: "Ral Nel Consortium.Promissories.Nano-Link Permit.Description",
              description:
                "Description for Faction Promissory: Nano-Link Permit",
              defaultMessage:
                "After you activate a system:{br}You may move your structures from adjacent systems that do not contain your command tokens onto planets you control in the active system.{br}Then, return this card to the Ral Nel player.",
            },
            { br: "\n\n" },
          ),
        },
      ],
      removedIn: "TWILIGHTS FALL",
      shortname: intl.formatMessage({
        id: "Ral Nel Consortium.Shortname",
        description: "Shortened version of Faction name: Ral Nel Consortium",
        defaultMessage: "Ral Nel",
      }),
      startswith: {
        choice: {
          description: intl.formatMessage({
            id: "Ral Nel Consortium.Tech Choice",
            description: "Text of Ral Nel's tech choice.",
            defaultMessage:
              "Choose 1 green or red technology with no prerequisites.",
          }),
          options: [
            "Neural Motivator",
            "Psychoarchaeology",
            "Plasma Scoring",
            "AI Development Algorithm",
          ],
          select: 1,
        },
        planets: ["Mez Lo Orz Fei Zsha", "Rep Lo Orz Oet"],
        units: {
          Dreadnought: 1,
          Carrier: 1,
          Destroyer: 1,
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
          PDS: 2,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Ral Nel Consortium.Units.Last Dispatch.Description",
            description: "Description for Faction Unit: Last Dispatch",
            defaultMessage:
              "When this unit retreats, you may destroy 1 ship in the active system that does not have SUSTAIN DAMAGE.",
          }),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Units.Last Dispatch.Title",
            description: "Title of Faction Unit: Last Dispatch",
            defaultMessage: "Last Dispatch",
          }),
          stats: {
            cost: 8,
            combat: "8(x2)",
            move: 2,
            capacity: 4,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Ral Nel Consortium.Units.Alarum.Description",
            description: "Description for Faction Unit: Alarum",
            defaultMessage:
              "At the end of a round of combat on this planet, you may move up to 2 of your ground forces to this planet from planets in adjacent systems.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Units.Alarum.Title",
            description: "Title of Faction Unit: Alarum",
            defaultMessage: "Alarum",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [antiFighterBarrage("9 (x2)", intl)],
          description: intl.formatMessage(
            {
              id: "Ral Nel Consortium.Units.Linkship I.Description",
              description: "Description for Faction Unit: Linkship I",
              defaultMessage:
                "This unit can use the SPACE CANNON ability of one of your structures in its space area; each structure can only be triggered once.",
            },
            { br: "\n\n" },
          ),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Ral Nel Consortium.Units.Linkship I.Title",
            description: "Title of Faction Unit: Linkship I",
            defaultMessage: "Linkship I",
          }),
          stats: {
            cost: 1,
            combat: 9,
            move: 3,
          },
          type: "Destroyer",
          upgrade: "Linkship II",
        },
      ],
    },
  };
}
