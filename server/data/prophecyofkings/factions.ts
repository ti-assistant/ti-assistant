import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  bombardment,
  planetaryShield,
  production,
  spaceCannon,
  sustainDamage,
} from "../../../src/util/strings";

export default function getProphecyOfKingsFactions(
  intl: IntlShape
): Record<ProphecyOfKings.FactionId, BaseFaction> {
  return {
    "Argent Flight": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Argent Flight.Abilities.Zeal.Title",
            description: "Title of Faction Ability: Zeal",
            defaultMessage: "Zeal",
          }),
          description: intl.formatMessage({
            id: "Argent Flight.Abilities.Zeal.Description",
            description: "Description for Faction Ability: Zeal",
            defaultMessage:
              "You always vote first during the agenda phase. When you cast at least 1 vote, cast 1 additional vote for each player in the game including you.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Argent Flight.Abilities.Raid Formation.Title",
            description: "Title of Faction Ability: Raid Formation",
            defaultMessage: "Raid Formation",
          }),
          description: intl.formatMessage({
            id: "Argent Flight.Abilities.Raid Formation.Description",
            description: "Description for Faction Ability: Raid Formation",
            defaultMessage:
              "When 1 or more of your units uses ANTI-FIGHTER BARRAGE, for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has SUSTAIN DAMAGE to become damaged.",
          }),
        },
      ],
      colors: {
        Blue: 0.15,
        Green: 0.15,
        Orange: 1.6,
      },
      colorList: [
        "Orange",
        "Black",
        "Green",
        "Blue",
        "Red",
        "Yellow",
        "Purple",
        "Magenta",
      ],
      commodities: 3,
      expansion: "POK",
      id: "Argent Flight",
      name: intl.formatMessage({
        id: "Argent Flight.Name",
        description: "Name of Faction: Argent Flight",
        defaultMessage: "Argent Flight",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Argent Flight.Promissories.Strike Wing Ambuscade.Title",
            description: "Title of Faction Promissory: Strike Wing Ambuscade",
            defaultMessage: "Strike Wing Ambuscade",
          }),
          description: intl.formatMessage(
            {
              id: "Argent Flight.Promissories.Strike Wing Ambuscade.Description",
              description:
                "Description for Faction Promissory: Strike Wing Ambuscade",
              defaultMessage:
                "When 1 or more of your units make a roll for a unit ability:{br}Choose 1 of those units to roll 1 additional die{br}Then, return this card to the Argent player",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Argent Flight.Shortname",
        description: "Shortened version of Faction name: Argent Flight",
        defaultMessage: "Argent",
      }),
      startswith: {
        choice: {
          options: ["Neural Motivator", "Plasma Scoring", "Sarween Tools"],
          select: 2,
        },
        planets: ["Avar", "Valk", "Ylir"],
        units: {
          Carrier: 1,
          Destroyer: 2,
          Fighter: 2,
          Infantry: 5,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Argent Flight.Units.Quetzecoatl.Description",
            description: "Description for Faction Unit: Quetzecoatl",
            defaultMessage:
              "Other players cannot use SPACE CANNON against your ships in this system.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Argent Flight.Units.Quetzecoatl.Title",
            description: "Title of Faction Unit: Quetzecoatl",
            defaultMessage: "Quetzecoatl",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Argent Flight.Units.Aerie Sentinel.Description",
            description: "Description for Faction Unit: Aerie Sentinel",
            defaultMessage:
              "This unit does not count against capacity if it is being transported or if it is in a space area with 1 or more of your ships that have capacity values.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Argent Flight.Units.Aerie Sentinel.Title",
            description: "Title of Faction Unit: Aerie Sentinel",
            defaultMessage: "Aerie Sentinel",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: ["ANTI-FIGHTER BARRAGE 9 (x2)"],
          expansion: "POK",
          name: intl.formatMessage({
            id: "Argent Flight.Units.Strike Wing Alpha I.Title",
            description: "Title of Faction Unit: Strike Wing Alpha I",
            defaultMessage: "Strike Wing Alpha I",
          }),
          stats: {
            cost: 1,
            combat: 8,
            move: 2,
            capacity: 1,
          },
          type: "Destroyer",
          upgrade: "Strike Wing Alpha II",
        },
      ],
    },
    Empyrean: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Empyrean.Abilities.Voidborn.Title",
            description: "Title of Faction Ability: Voidborn",
            defaultMessage: "Voidborn",
          }),
          description: intl.formatMessage({
            id: "Empyrean.Abilities.Voidborn.Description",
            description: "Description for Faction Ability: Voidborn",
            defaultMessage: "Nebulae do not affect your ships' movement.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Empyrean.Abilities.Aetherpassage.Title",
            description: "Title of Faction Ability: Aetherpassage",
            defaultMessage: "Aetherpassage",
          }),
          description: intl.formatMessage({
            id: "Empyrean.Abilities.Aetherpassage.Description",
            description: "Description for Faction Ability: Aetherpassage",
            defaultMessage:
              "After a player activates a system, you may allow that player to move their ships through systems that contain your ships.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Empyrean.Abilities.Dark Whispers.Title",
            description: "Title of Faction Ability: Dark Whispers",
            defaultMessage: "Dark Whispers",
          }),
          description: intl.formatMessage({
            id: "Empyrean.Abilities.Dark Whispers.Description",
            description: "Description for Faction Ability: Dark Whispers",
            defaultMessage:
              "During setup, take the additional Empyrean faction promissory note; you have 2 faction promissory notes.",
          }),
        },
      ],
      colors: {
        Magenta: 0.15,
        Purple: 1.6,
        Red: 0.15,
      },
      colorList: [
        "Purple",
        "Blue",
        "Black",
        "Magenta",
        "Red",
        "Orange",
        "Yellow",
        "Green",
      ],
      commodities: 4,
      expansion: "POK",
      id: "Empyrean",
      name: intl.formatMessage({
        id: "Empyrean.Name",
        description: "Name of Faction: Empyrean",
        defaultMessage: "Empyrean",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Empyrean.Promissories.Blood Pact.Title",
            description: "Title of Faction Promissory: Blood Pact",
            defaultMessage: "Blood Pact",
          }),
          description: intl.formatMessage(
            {
              id: "Empyrean.Promissories.Blood Pact.Description",
              description: "Description for Faction Promissory: Blood Pact",
              defaultMessage:
                "ACTION: Place this card face up in your play area.{br}When you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome.{br}If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
            },
            { br: "\n\n" }
          ),
        },
        {
          name: intl.formatMessage({
            id: "Empyrean.Promissories.Dark Pact.Title",
            description: "Title of Faction Promissory: Dark Pact",
            defaultMessage: "Dark Pact",
          }),
          description: intl.formatMessage(
            {
              id: "Empyrean.Promissories.Dark Pact.Description",
              description: "Description for Faction Promissory: Dark Pact",
              defaultMessage:
                "ACTION: Place this card face up in your play area.{br}When you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good.{br}If you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Empyrean.Shortname",
        description: "Shortened version of Faction name: Empyrean",
        defaultMessage: "Empyrean",
      }),
      startswith: {
        planets: ["The Dark"],
        techs: ["Dark Energy Tap"],
        units: {
          Carrier: 2,
          Destroyer: 1,
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Empyrean.Units.Dynamo.Description",
            description: "Description for Faction Unit: Dynamo",
            defaultMessage:
              "After any player's unit in this system or an adjacent system uses SUSTAIN DAMAGE, you may spend 2 influence to repair that unit.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Empyrean.Units.Dynamo.Title",
            description: "Title of Faction Unit: Dynamo",
            defaultMessage: "Dynamo",
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
            id: "Empyrean.Units.Watcher.Description",
            description: "Description for Faction Unit: Watcher",
            defaultMessage:
              "You may remove this unit from a system that contains or is adjacent to another player's units to cancel an action card played by that player.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Empyrean.Units.Watcher.Title",
            description: "Title of Faction Unit: Watcher",
            defaultMessage: "Watcher",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Mahact Gene-Sorcerers": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Edict.Title",
            description: "Title of Faction Ability: Edict",
            defaultMessage: "Edict",
          }),
          description: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Edict.Description",
            description: "Description for Faction Ability: Edict",
            defaultMessage:
              "When you win a combat, place 1 command token from your opponent's reinforcements in your fleet pool if it does not already contain 1 of that player's tokens; other player's tokens in your fleet pool increase your fleet limit but cannot be redistributed.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Imperia.Title",
            description: "Title of Faction Ability: Imperia",
            defaultMessage: "Imperia",
          }),
          description: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Imperia.Description",
            description: "Description for Faction Ability: Imperia",
            defaultMessage:
              "While another player's command token is in your fleet pool, you can use the ability of that player's commander, if it is unlocked.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Hubris.Title",
            description: "Title of Faction Ability: Hubris",
            defaultMessage: "Hubris",
          }),
          description: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Abilities.Hubris.Description",
            description: "Description for Faction Ability: Hubris",
            defaultMessage:
              'During setup, purge your "Alliance" promissory note. Other players cannot give you their "Alliance" promissory note.',
          }),
        },
      ],
      colors: {
        Purple: 0.3,
        Yellow: 1.6,
      },
      colorList: [
        "Yellow",
        "Purple",
        "Black",
        "Magenta",
        "Red",
        "Orange",
        "Green",
        "Blue",
      ],
      commodities: 3,
      expansion: "POK",
      id: "Mahact Gene-Sorcerers",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Name",
        description: "Name of Faction: Mahact Gene-Sorcerers",
        defaultMessage: "Mahact Gene-Sorcerers",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Promissories.Scepter of Dominion.Title",
            description: "Title of Faction Promissory: Scepter of Dominion",
            defaultMessage: "Scepter of Dominion",
          }),
          description: intl.formatMessage(
            {
              id: "Mahact Gene-Sorcerers.Promissories.Scepter of Dominion.Description",
              description:
                "Description for Faction Promissory: Scepter of Dominion",
              defaultMessage:
                "At the start of the strategy phase:{br}Choose 1 non-home system that contains your units; each other player who has a token on the Mahact player's command sheet places a token from their reinforcements in that system{br}Then, return this card to the Mahact player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Shortname",
        description: "Shortened version of Faction name: Mahact Gene-Sorcerers",
        defaultMessage: "Mahact",
      }),
      startswith: {
        planets: ["Ixth"],
        techs: ["Bio-Stims", "Predictive Intelligence"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Dreadnought: 1,
          Fighter: 2,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Units.Arvicon Rex.Description",
            description: "Description for Faction Unit: Arvicon Rex",
            defaultMessage:
              "During combat against an opponent whose command token is not in your fleet pool, apply +2 to the results of this unit's combat rolls.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Units.Arvicon Rex.Title",
            description: "Title of Faction Unit: Arvicon Rex",
            defaultMessage: "Arvicon Rex",
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
            id: "Mahact Gene-Sorcerers.Units.Starlancer.Description",
            description: "Description for Faction Unit: Starlancer",
            defaultMessage:
              "After a player whose command token is in your fleet pool activates this system, you may spend their token from your fleet pool to end their turn; they gain that token.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Units.Starlancer.Title",
            description: "Title of Faction Unit: Starlancer",
            defaultMessage: "Starlancer",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          description: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Units.Crimson Legionnaire I.Description",
            description: "Description for Faction Unit: Crimson Legionnaire I",
            defaultMessage:
              "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good.",
          }),
          name: intl.formatMessage({
            id: "Mahact Gene-Sorcerers.Units.Crimson Legionnaire I.Title",
            description: "Title of Faction Unit: Crimson Legionnaire I",
            defaultMessage: "Crimson Legionnaire I",
          }),
          expansion: "POK",
          stats: {
            cost: "1(x2)",
            combat: 8,
          },
          type: "Infantry",
          upgrade: "Crimson Legionnaire II",
        },
      ],
    },
    "Naaz-Rokha Alliance": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Abilities.Distant Suns.Title",
            description: "Title of Faction Ability: Distant Suns",
            defaultMessage: "Distant Suns",
          }),
          description: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Abilities.Distant Suns.Description",
            description: "Description for Faction Ability: Distant Suns",
            defaultMessage:
              "When you explore a planet that contains 1 of your mechs, you may draw 1 additional card; choose 1 to resolve and discard the rest.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Abilities.Fabrication.Title",
            description: "Title of Faction Ability: Fabrication",
            defaultMessage: "Fabrication",
          }),
          description: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Abilities.Fabrication.Description",
            description: "Description for Faction Ability: Fabrication",
            defaultMessage:
              "ACTION: Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token.",
          }),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Naaz-Rokha Alliance.Breakthrough.Absolute Synergy.Title",
          description: "Title of Faction Breakthrough: Absolute Synergy",
          defaultMessage: "Absolute Synergy",
        }),
        description: intl.formatMessage(
          {
            id: "Naaz-Rokha Alliance.Breakthrough.Absolute Synergy.Description",
            description:
              "Description of Faction Breakthrough: Absolute Synergy",
            defaultMessage:
              "When you have 4 mechs in the same system, you may return 3 of those mechs to your reinforcements to flip this card and place it on top of your mech card.",
          },
          { br: "\n\n" }
        ),
        id: "Absolute Synergy",
        synergy: { left: "GREEN", right: "BLUE" },
        timing: "OTHER",
      },
      colors: {
        Green: 1.6,
        Yellow: 0.3,
      },
      colorList: [
        "Green",
        "Yellow",
        "Black",
        "Magenta",
        "Red",
        "Orange",
        "Purple",
        "Blue",
      ],
      commodities: 3,
      expansion: "POK",
      id: "Naaz-Rokha Alliance",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Name",
        description: "Name of Faction: Naaz-Rokha Alliance",
        defaultMessage: "Naaz-Rokha Alliance",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Promissories.Black Market Forgery.Title",
            description: "Title of Faction Promissory: Black Market Forgery",
            defaultMessage: "Black Market Forgery",
          }),
          description: intl.formatMessage(
            {
              id: "Naaz-Rokha Alliance.Promissories.Black Market Forgery.Description",
              description:
                "Description for Faction Promissory: Black Market Forgery",
              defaultMessage:
                "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic.{br}Then return this card to the Naaz-Rokha player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Shortname",
        description: "Shortened version of Faction name: Naaz-Rokha Alliance",
        defaultMessage: "Naaz-Rokha",
      }),
      startswith: {
        planets: ["Naazir", "Rokha"],
        techs: ["AI Development Algorithm", "Psychoarchaeology"],
        units: {
          Carrier: 2,
          Destroyer: 1,
          Fighter: 2,
          Infantry: 3,
          Mech: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Units.Visz el Vir.Description",
            description: "Description for Faction Unit: Visz el Vir",
            defaultMessage:
              "Your mechs in this system roll 1 additional die during combat.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Units.Visz el Vir.Title",
            description: "Title of Faction Unit: Visz el Vir",
            defaultMessage: "Visz el Vir",
          }),
          stats: {
            cost: 8,
            combat: "9(x2)",
            move: 1,
            capacity: 4,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage(
            {
              id: "Naaz-Rokha Alliance.Units.Eidolon.Description",
              description: "Description for Faction Unit: Eidolon",
              defaultMessage:
                "If this unit is in the space area of the active system at the start of a space combat, flip this card.{br}(This card begins the game with this side face up)",
            },
            { br: "\n\n" }
          ),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Units.Eidolon.Title",
            description: "Title of Faction Unit: Eidolon",
            defaultMessage: "Eidolon",
          }),
          stats: {
            cost: 2,
            combat: "6(x2)",
          },
          type: "Mech",
        },
        {
          description: intl.formatMessage(
            {
              id: "Naaz-Rokha Alliance.Units.Z-Grav Eidolon.Description",
              description: "Description for Faction Unit: Z-Grav Eidolon",
              defaultMessage:
                "If this unit is in the space area of the active system, it is also a ship. At the end of a space battle in the active system, flip this card.{br}(This card begins the game with this side face down)",
            },
            { br: "\n\n" }
          ),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Units.Z-Grav Eidolon.Title",
            description: "Title of Faction Unit: Z-Grav Eidolon",
            defaultMessage: "Z-Grav Eidolon",
          }),
          stats: {
            cost: 2,
            combat: "8(x2)",
          },
          type: "Mech",
        },
        {
          description: intl.formatMessage(
            {
              id: "Naaz-Rokha Alliance.Units.Eidolon Maximum.Description",
              description: "Description for Faction Unit: Eidolon Maximum",
              defaultMessage:
                "This unit is both a ship and a ground force. It cannot be assigned hits from unit abilities. Repair it at the start of every combat round. Game effects cannot place or produce your mechs. When this unit is destroyed or removed, flip this card and return it to your play area.",
            },
            { br: "\n\n" }
          ),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Naaz-Rokha Alliance.Units.Eidolon Maximum.Title",
            description: "Title of Faction Unit: Eidolon Maximum",
            defaultMessage: "Eidolon Maximum",
          }),
          stats: {
            combat: "4(x4)",
            move: 3,
          },
          type: "Mech",
        },
      ],
    },
    Nomad: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Nomad.Abilities.The Company.Title",
            description: "Title of Faction Ability: The Company",
            defaultMessage: "The Company",
          }),
          description: intl.formatMessage({
            id: "Nomad.Abilities.The Company.Description",
            description: "Description for Faction Ability: The Company",
            defaultMessage:
              "During setup, take the 2 additional Nomad faction agents and place them next to your faction sheet; you have 3 agents.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Nomad.Abilities.Future Sight.Title",
            description: "Title of Faction Ability: Future Sight",
            defaultMessage: "Future Sight",
          }),
          description: intl.formatMessage({
            id: "Nomad.Abilities.Future Sight.Description",
            description: "Description for Faction Ability: Future Sight",
            defaultMessage:
              "During the Agenda phase, after an outcome that you voted for or predicted is resolved, gain 1 trade good.",
          }),
        },
      ],
      colors: {
        Blue: 1.25,
        Purple: 0.65,
      },
      colorList: [
        "Blue",
        "Purple",
        "Black",
        "Magenta",
        "Red",
        "Orange",
        "Yellow",
        "Green",
      ],
      commodities: 4,
      expansion: "POK",
      id: "Nomad",
      name: intl.formatMessage({
        id: "Nomad.Name",
        description: "Name of Faction: Nomad",
        defaultMessage: "Nomad",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Nomad.Promissories.The Cavalry.Title",
            description: "Title of Faction Promissory: The Cavalry",
            defaultMessage: "The Cavalry",
          }),
          description: intl.formatMessage(
            {
              id: "Nomad.Promissories.The Cavalry.Description",
              description: "Description for Faction Promissory: The Cavalry",
              defaultMessage:
                "At the start of a space combat against a player other than the Nomad:{br}During this combat, treat 1 of your non-fighter ships as if it has the SUSTAIN DAMAGE ability, combat value, and ANTI-FIGHTER BARRAGE value of the Nomad's flagship.{br}Return this card to the Nomad player at the end of this combat.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Nomad.Shortname",
        description: "Shortened version of Faction name: Nomad",
        defaultMessage: "Nomad",
      }),
      startswith: {
        planets: ["Arcturus"],
        techs: ["Sling Relay"],
        units: {
          Carrier: 1,
          Destroyer: 1,
          Fighter: 3,
          Flagship: 1,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl), antiFighterBarrage("8 (x3)", intl)],
          description: intl.formatMessage({
            id: "Nomad.Units.Memoria.Description",
            description: "Description for Faction Unit: Memoria",
            defaultMessage:
              "You may treat this unit as if it were adjacent to systems that contain 1 or more of your mechs.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Nomad.Units.Memoria.Title",
            description: "Title of Faction Unit: Memoria",
            defaultMessage: "Memoria",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
          upgrade: "Memoria II",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Nomad.Units.Quantum Manipulator.Description",
            description: "Description for Faction Unit: Quantum Manipulator",
            defaultMessage:
              "While this unit is in a space area during combat, you may use its SUSTAIN DAMAGE ability to cancel a hit that is produced against your ships in this system.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Nomad.Units.Quantum Manipulator.Title",
            description: "Title of Faction Unit: Quantum Manipulator",
            defaultMessage: "Quantum Manipulator",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Titans of Ul": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Titans of Ul.Abilities.Terragenesis.Title",
            description: "Title of Faction Ability: Terragenesis",
            defaultMessage: "Terragenesis",
          }),
          description: intl.formatMessage({
            id: "Titans of Ul.Abilities.Terragenesis.Description",
            description: "Description for Faction Ability: Terragenesis",
            defaultMessage:
              "After you explore a planet that does not have a sleeper token, you may place or move 1 sleeper token onto that planet.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Titans of Ul.Abilities.Awaken.Title",
            description: "Title of Faction Ability: Awaken",
            defaultMessage: "Awaken",
          }),
          description: intl.formatMessage({
            id: "Titans of Ul.Abilities.Awaken.Description",
            description: "Description for Faction Ability: Awaken",
            defaultMessage:
              "After you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those tokens with 1 PDS from your reinforcements.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Titans of Ul.Abilities.Coalescence.Title",
            description: "Title of Faction Ability: Coalescence",
            defaultMessage: "Coalescence",
          }),
          description: intl.formatMessage({
            id: "Titans of Ul.Abilities.Coalescence.Description",
            description: "Description for Faction Ability: Coalescence",
            defaultMessage:
              'If your flagship or your AWAKEN faction ability places your units into the same space area or onto the same planet as another player\'s units, your units must participate in combat during "Space Combat" or "Ground Combat" steps.',
          }),
        },
      ],
      colors: {
        Magenta: 1.9,
      },
      colorList: [
        "Magenta",
        "Red",
        "Blue",
        "Purple",
        "Yellow",
        "Orange",
        "Green",
        "Black",
      ],
      commodities: 2,
      expansion: "POK",
      id: "Titans of Ul",
      name: intl.formatMessage({
        id: "Titans of Ul.Name",
        description: "Name of Faction: Titans of Ul",
        defaultMessage: "Titans of Ul",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Titans of Ul.Promissories.Terraform.Title",
            description: "Title of Faction Promissory: Terraform",
            defaultMessage: "Terraform",
          }),
          description: intl.formatMessage(
            {
              id: "Titans of Ul.Promissories.Terraform.Description",
              description: "Description for Faction Promissory: Terraform",
              defaultMessage:
                "ACTION: Attach this card to a non-home planet you control other than Mecatol Rex.{br}Its resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Titans of Ul.Shortname",
        description: "Shortened version of Faction name: Titans of Ul",
        defaultMessage: "Titans",
      }),
      startswith: {
        planets: ["Elysium"],
        techs: ["Antimass Deflectors", "Scanlink Drone Network"],
        units: {
          Cruiser: 2,
          Dreadnought: 1,
          Fighter: 2,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Titans of Ul.Units.Ouranos.Description",
            description: "Description for Faction Unit: Ouranos",
            defaultMessage:
              "DEPLOY: After you activate a system that contains 1 or more of your PDS, you may replace 1 of those PDS with this unit.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Titans of Ul.Units.Ouranos.Title",
            description: "Title of Faction Unit: Ouranos",
            defaultMessage: "Ouranos",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Titans of Ul.Units.Hecatoncheires.Description",
            description: "Description for Faction Unit: Hecatoncheires",
            defaultMessage:
              "DEPLOY: When you would place a PDS on a planet, you may place 1 mech and 1 infantry on that planet instead.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Titans of Ul.Units.Hecatoncheires.Title",
            description: "Title of Faction Unit: Hecatoncheires",
            defaultMessage: "Hecatoncheires",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [
            planetaryShield(intl),
            sustainDamage(intl),
            spaceCannon("6", intl),
            production("1", intl),
          ],
          description: intl.formatMessage({
            id: "Titans of Ul.Units.Hel Titan I.Description",
            description: "Description for Faction Unit: Hel Titan I",
            defaultMessage:
              "This unit is treated as both a structure and a ground force. It cannot be transported.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Titans of Ul.Units.Hel Titan I.Title",
            description: "Title of Faction Unit: Hel Titan I",
            defaultMessage: "Hel Titan I",
          }),
          stats: {
            combat: 7,
          },
          type: "PDS",
          upgrade: "Hel Titan II",
        },
        {
          expansion: "POK",
          name: intl.formatMessage({
            id: "Titans of Ul.Units.Saturn Engine I.Title",
            description: "Title of Faction Unit: Saturn Engine I",
            defaultMessage: "Saturn Engine I",
          }),
          stats: {
            cost: 2,
            combat: 7,
            move: 2,
            capacity: 1,
          },
          type: "Cruiser",
          upgrade: "Saturn Engine II",
        },
      ],
    },
    "Vuil'raith Cabal": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Devour.Title",
            description: "Title of Faction Ability: Devour",
            defaultMessage: "Devour",
          }),
          description: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Devour.Description",
            description: "Description for Faction Ability: Devour",
            defaultMessage:
              "Capture your opponent's non-structure units that are destroyed during combat.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Amalgamation.Title",
            description: "Title of Faction Ability: Amalgamation",
            defaultMessage: "Amalgamation",
          }),
          description: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Amalgamation.Description",
            description: "Description for Faction Ability: Amalgamation",
            defaultMessage:
              "When you produce a unit, you may return 1 captured unit of that type to produce that unit without spending resources.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Riftmeld.Title",
            description: "Title of Faction Ability: Riftmeld",
            defaultMessage: "Riftmeld",
          }),
          description: intl.formatMessage({
            id: "Vuil'raith Cabal.Abilities.Riftmeld.Description",
            description: "Description for Faction Ability: Riftmeld",
            defaultMessage:
              "When you research a unit upgrade technology, you may return 1 captured unit of that type to ignore all of the technology's prerequisites.",
          }),
        },
      ],
      breakthrough: {
        name: intl.formatMessage({
          id: "Vuil'raith Cabal.Breakthrough.Al'raith Ix Ianovar.Title",
          description: "Title of Faction Breakthrough: Al'raith Ix Ianovar",
          defaultMessage: "Al'raith Ix Ianovar",
        }),
        description: intl.formatMessage(
          {
            id: "Vuil'raith Cabal.Breakthrough.Al'raith Ix Ianovar.Description",
            description:
              "Description of Faction Breakthrough: Al'raith Ix Ianovar",
            defaultMessage:
              "This breakthrough causes The Fracture to enter play without a roll, if it is not already in play. After this card enters play, move up to 2 ingress tokens into systems that contain gravity rifts.{br}Apply +1 to the MOVE value of each of your ships that start their movement in The Fracture.",
          },
          { br: "\n\n" }
        ),
        id: "Al'raith Ix Ianovar",
        synergy: { left: "RED", right: "GREEN" },
        timing: "TACTICAL_ACTION",
      },
      colors: {
        Black: 0.4,
        Magenta: 0.1,
        Red: 1.35,
      },
      colorList: [
        "Red",
        "Black",
        "Magenta",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple",
      ],
      commodities: 2,
      expansion: "POK",
      id: "Vuil'raith Cabal",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Name",
        description: "Name of Faction: Vuil'raith Cabal",
        defaultMessage: "Vuil'raith Cabal",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Promissories.Crucible.Title",
            description: "Title of Faction Promissory: Crucible",
            defaultMessage: "Crucible",
          }),
          description: intl.formatMessage(
            {
              id: "Vuil'raith Cabal.Promissories.Crucible.Description",
              description: "Description for Faction Promissory: Crucible",
              defaultMessage:
                "After you activate a system:{br}Your ships do not roll for gravity rifts during this movement; apply an additional +1 to the move values of your ships that would move out of or through a gravity rift instead.{br}Then, return this card to the Vuil'raith player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Vuil'raith Cabal.Shortname",
        description: "Shortened version of Faction name: Vuil'raith Cabal",
        defaultMessage: "Vuil'raith",
      }),
      startswith: {
        planets: ["Acheron"],
        techs: ["Self Assembly Routines"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Dreadnought: 1,
          Fighter: 3,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl), bombardment("5", intl)],
          description: intl.formatMessage({
            id: "Vuil'raith Cabal.Units.The Terror Between.Description",
            description: "Description for Faction Unit: The Terror Between",
            defaultMessage:
              "Capture all other non-structure units that are destroyed in this system, including your own.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Units.The Terror Between.Title",
            description: "Title of Faction Unit: The Terror Between",
            defaultMessage: "The Terror Between",
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
            id: "Vuil'raith Cabal.Units.Reanimator.Description",
            description: "Description for Faction Unit: Reanimator",
            defaultMessage:
              "When your infantry on this planet are destroyed, place them on your faction sheet; those units are captured.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Units.Reanimator.Title",
            description: "Title of Faction Unit: Reanimator",
            defaultMessage: "Reanimator",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [production("5", intl)],
          description: intl.formatMessage(
            {
              id: "Vuil'raith Cabal.Units.Dimensional Tear I.Description",
              description: "Description for Faction Unit: Dimensional Tear I",
              defaultMessage:
                "This system is a gravity rift; your ships do not roll for this gravity rift.{br}Place a dimensional tear token beneath this unit as a reminder.{br}Up to 6 fighters in this system do not count against your ships' capacity.",
            },
            { br: "\n\n" }
          ),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Vuil'raith Cabal.Units.Dimensional Tear I.Title",
            description: "Title of Faction Unit: Dimensional Tear I",
            defaultMessage: "Dimensional Tear I",
          }),
          stats: {},
          type: "Space Dock",
          upgrade: "Dimensional Tear II",
        },
      ],
    },
  };
}
