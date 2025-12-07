import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  planetaryShield,
  production,
  spaceCannon,
  sustainDamage,
} from "../../../src/util/strings";

export default function getProphecyOfKingsTechs(
  intl: IntlShape
): Record<ProphecyOfKings.TechId, BaseTech> {
  return {
    "AI Development Algorithm": {
      description: intl.formatMessage(
        {
          id: "Techs.AI Development Algorithm.Description",
          description: "Description for Tech: AI Development Algorithm",
          defaultMessage:
            "When you research a unit upgrade technology, you may exhaust this card to ignore any 1 prerequisite.{br}When 1 or more of your units use PRODUCTION, you may exhaust this card to reduce the combined cost of the produced units by the number of unit upgrade technologies that you own.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "AI Development Algorithm",
      name: intl.formatMessage({
        id: "Techs.AI Development Algorithm.Title",
        description: "Title of Tech: AI Development Algorithm",
        defaultMessage: "AI Development Algorithm",
      }),
      prereqs: [],
      type: "RED",
    },
    "Aerie Hololattice": {
      description: intl.formatMessage(
        {
          id: "Argent Flight.Techs.Aerie Hololattice.Description",
          description: "Description for Tech: Aerie Hololattice",
          defaultMessage:
            "Other players cannot move ships through systems that contain your structures.{br}Each planet that contains 1 or more of your structures gains the PRODUCTION 1 ability as if it were a unit.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Argent Flight",
      id: "Aerie Hololattice",
      name: intl.formatMessage({
        id: "Argent Flight.Techs.Aerie Hololattice.Title",
        description: "Title of Tech: Aerie Hololattice",
        defaultMessage: "Aerie Hololattice",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    Aetherstream: {
      description: intl.formatMessage({
        id: "Empyrean.Techs.Aetherstream.Description",
        description: "Description for Tech: Aetherstream",
        defaultMessage:
          "After you or one of your neighbors activates a system that is adjacent to an anomaly, you may apply +1 to the move value of all of that player's ships during this tactical action.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Empyrean",
      id: "Aetherstream",
      name: intl.formatMessage({
        id: "Empyrean.Techs.Aetherstream.Title",
        description: "Title of Tech: Aetherstream",
        defaultMessage: "Aetherstream",
      }),
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    },
    "Bio-Stims": {
      description: intl.formatMessage({
        id: "Techs.Bio-Stims.Description",
        description: "Description for Tech: Bio-Stims",
        defaultMessage:
          "You may exhaust this card at the end of your turn to ready 1 of your planets that has a technology specialty or 1 of your other technologies.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Bio-Stims",
      name: intl.formatMessage({
        id: "Techs.Bio-Stims.Title",
        description: "Title of Tech: Bio-Stims",
        defaultMessage: "Bio-Stims",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    "Crimson Legionnaire II": {
      abilities: [],
      description: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Techs.Crimson Legionnaire II.Description",
        description: "Description for Tech: Crimson Legionnaire II",
        defaultMessage:
          "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good. Then, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Mahact Gene-Sorcerers",
      id: "Crimson Legionnaire II",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Techs.Crimson Legionnaire II.Title",
        description: "Title of Tech: Crimson Legionnaire II",
        defaultMessage: "Crimson Legionnaire II",
      }),
      prereqs: ["GREEN", "GREEN"],
      replaces: "Infantry II",
      stats: {
        combat: 7,
        cost: "1(x2)",
      },
      type: "UPGRADE",
      unitType: "Infantry",
    },
    "Dark Energy Tap": {
      description: intl.formatMessage(
        {
          id: "Techs.Dark Energy Tap.Description",
          description: "Description for Tech: Dark Energy Tap",
          defaultMessage:
            "After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.{br}Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Dark Energy Tap",
      name: intl.formatMessage({
        id: "Techs.Dark Energy Tap.Title",
        description: "Title of Tech: Dark Energy Tap",
        defaultMessage: "Dark Energy Tap",
      }),
      prereqs: [],
      type: "BLUE",
    },
    "Dimensional Tear II": {
      abilities: [production("7", intl)],
      description: intl.formatMessage(
        {
          id: "Vuil'raith Cabal.Techs.Dimensional Tear II.Description",
          description: "Description for Tech: Dimensional Tear II",
          defaultMessage:
            "This system is a gravity rift; your ships do not roll for this gravity rift.{br}Place a dimensional tear token beneath this unit as a reminder.{br}Up to 12 fighters in this system do not count against your ships' capacity.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Vuil'raith Cabal",
      id: "Dimensional Tear II",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Techs.Dimensional Tear II.Title",
        description: "Title of Tech: Dimensional Tear II",
        defaultMessage: "Dimensional Tear II",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      replaces: "Space Dock II",
      stats: {},
      type: "UPGRADE",
      unitType: "Space Dock",
    },
    "Genetic Recombination": {
      description: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Techs.Genetic Recombination.Description",
        description: "Description for Tech: Genetic Recombination",
        defaultMessage:
          "You may exhaust this card before a player casts votes; that player must cast at least 1 vote for an outcome of your choice or remove 1 token from their fleet pool and return it to their reinforcements.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Mahact Gene-Sorcerers",
      id: "Genetic Recombination",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Techs.Genetic Recombination.Title",
        description: "Title of Tech: Genetic Recombination",
        defaultMessage: "Genetic Recombination",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    "Hel Titan II": {
      abilities: [
        planetaryShield(intl),
        sustainDamage(intl),
        spaceCannon("5", intl),
        production("1", intl),
      ],
      description: intl.formatMessage({
        id: "Titans of Ul.Techs.Hel Titan II.Description",
        description: "Description for Tech: Hel Titan II",
        defaultMessage:
          "This unit is treated as both a structure and a ground force. It cannot be transported. You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Titans of Ul",
      id: "Hel Titan II",
      name: intl.formatMessage({
        id: "Titans of Ul.Techs.Hel Titan II.Title",
        description: "Title of Tech: Hel Titan II",
        defaultMessage: "Hel Titan II",
      }),
      prereqs: ["RED", "YELLOW"],
      replaces: "PDS II",
      stats: {
        combat: 6,
      },
      type: "UPGRADE",
      unitType: "PDS",
    },
    "Memoria II": {
      abilities: [sustainDamage(intl), antiFighterBarrage("5 (x3)", intl)],
      description: intl.formatMessage({
        id: "Nomad.Techs.Memoria II.Description",
        description: "Description for Tech: Memoria II",
        defaultMessage:
          "You may treat this unit as if it were adjacent to systems that contain 1 or more of your mechs.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Nomad",
      id: "Memoria II",
      name: intl.formatMessage({
        id: "Nomad.Techs.Memoria II.Title",
        description: "Title of Tech: Memoria II",
        defaultMessage: "Memoria II",
      }),
      prereqs: ["GREEN", "BLUE", "YELLOW"],
      stats: {
        capacity: 6,
        combat: "5(x2)",
        cost: 8,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Flagship",
    },
    "Pre-Fab Arcologies": {
      description: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Techs.Pre-Fab Arcologies.Description",
        description: "Description for Tech: Pre-Fab Arcologies",
        defaultMessage: "After you explore a planet, ready that planet.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Naaz-Rokha Alliance",
      id: "Pre-Fab Arcologies",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Techs.Pre-Fab Arcologies.Title",
        description: "Title of Tech: Pre-Fab Arcologies",
        defaultMessage: "Pre-Fab Arcologies",
      }),
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    },
    "Predictive Intelligence": {
      description: intl.formatMessage(
        {
          id: "Techs.Predictive Intelligence.Description",
          description: "Description for Tech: Predictive Intelligence",
          defaultMessage:
            "At the end of your turn, you may exhaust this card to redistribute your command tokens.{br}When you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Predictive Intelligence",
      name: intl.formatMessage({
        id: "Techs.Predictive Intelligence.Title",
        description: "Title of Tech: Predictive Intelligence",
        defaultMessage: "Predictive Intelligence",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    Psychoarchaeology: {
      description: intl.formatMessage(
        {
          id: "Techs.Psychoarchaeology.Description",
          description: "Description for Tech: Psychoarchaeology",
          defaultMessage:
            "You can use technology specialties on planets you control without exhausting them, even if those planets are exhausted.{br}During the Action Phase, you can exhaust planets you control that have technology specialties to gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Psychoarchaeology",
      name: intl.formatMessage({
        id: "Techs.Psychoarchaeology.Title",
        description: "Title of Tech: Psychoarchaeology",
        defaultMessage: "Psychoarchaeology",
      }),
      prereqs: [],
      type: "GREEN",
    },
    "Saturn Engine II": {
      abilities: [sustainDamage(intl)],
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Titans of Ul",
      id: "Saturn Engine II",
      name: intl.formatMessage({
        id: "Titans of Ul.Techs.Saturn Engine II.Title",
        description: "Title of Tech: Saturn Engine II",
        defaultMessage: "Saturn Engine II",
      }),
      prereqs: ["GREEN", "YELLOW", "RED"],
      replaces: "Cruiser II",
      stats: {
        capacity: 2,
        combat: 6,
        cost: 2,
        move: 3,
      },
      type: "UPGRADE",
      unitType: "Cruiser",
    },
    "Scanlink Drone Network": {
      description: intl.formatMessage({
        id: "Techs.Scanlink Drone Network.Description",
        description: "Description for Tech: Scanlink Drone Network",
        defaultMessage:
          "When you activate a system, you may explore 1 planet in that system which contains 1 or more of your units.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Scanlink Drone Network",
      name: intl.formatMessage({
        id: "Techs.Scanlink Drone Network.Title",
        description: "Title of Tech: Scanlink Drone Network",
        defaultMessage: "Scanlink Drone Network",
      }),
      prereqs: [],
      type: "YELLOW",
    },
    "Self Assembly Routines": {
      description: intl.formatMessage(
        {
          id: "Techs.Self Assembly Routines.Description",
          description: "Description for Tech: Self Assembly Routines",
          defaultMessage:
            "After 1 or more of your units use PRODUCTION, you may exhaust this card to place 1 mech from your reinforcements on a planet you control in that system.{br}After 1 of your mechs is destroyed, gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Self Assembly Routines",
      name: intl.formatMessage({
        id: "Techs.Self Assembly Routines.Title",
        description: "Title of Tech: Self Assembly Routines",
        defaultMessage: "Self Assembly Routines",
      }),
      prereqs: ["RED"],
      type: "RED",
    },
    "Sling Relay": {
      description: intl.formatMessage({
        id: "Techs.Sling Relay.Description",
        description: "Description for Tech: Sling Relay",
        defaultMessage:
          "ACTION: Exhaust this card to produce 1 ship in any system that contains 1 of your space docks.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Sling Relay",
      name: intl.formatMessage({
        id: "Techs.Sling Relay.Title",
        description: "Title of Tech: Sling Relay",
        defaultMessage: "Sling Relay",
      }),
      prereqs: ["BLUE"],
      type: "BLUE",
    },
    "Strike Wing Alpha II": {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage({
        id: "Argent Flight.Techs.Strike Wing Alpha II.Description",
        description: "Description for Tech: Strike Wing Alpha II",
        defaultMessage:
          "When this unit uses ANTI-FIGHTER BARRAGE, each result of 9 or 10 also destroys 1 of your opponent's infantry in the space area of the active system.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Argent Flight",
      id: "Strike Wing Alpha II",
      name: intl.formatMessage({
        id: "Argent Flight.Techs.Strike Wing Alpha II.Title",
        description: "Title of Tech: Strike Wing Alpha II",
        defaultMessage: "Strike Wing Alpha II",
      }),
      prereqs: ["RED", "RED"],
      replaces: "Destroyer II",
      stats: {
        capacity: 1,
        combat: 7,
        cost: 1,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Destroyer",
    },
    Supercharge: {
      description: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Techs.Supercharge.Description",
        description: "Description for Tech: Supercharge",
        defaultMessage:
          "At the start of a combat round, you may exhaust this card to apply +1 to the result of each of your unit's combat rolls during this combat round.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Naaz-Rokha Alliance",
      id: "Supercharge",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Techs.Supercharge.Title",
        description: "Title of Tech: Supercharge",
        defaultMessage: "Supercharge",
      }),
      prereqs: ["RED"],
      type: "RED",
    },
    "Temporal Command Suite": {
      description: intl.formatMessage({
        id: "Nomad.Techs.Temporal Command Suite.Description",
        description: "Description for Tech: Temporal Command Suite",
        defaultMessage:
          "After any player's agent becomes exhausted, you may exhaust this card to ready that agent; if you ready another player's agent, you may perform a transaction with that player.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Nomad",
      id: "Temporal Command Suite",
      name: intl.formatMessage({
        id: "Nomad.Techs.Temporal Command Suite.Title",
        description: "Title of Tech: Temporal Command Suite",
        defaultMessage: "Temporal Command Suite",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    Voidwatch: {
      description: intl.formatMessage({
        id: "Empyrean.Techs.Voidwatch.Description",
        description: "Description for Tech: Voidwatch",
        defaultMessage:
          "After a player moves ships into a system that contains 1 or more of your units, they must give you 1 promissory note from their hand, if able.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Empyrean",
      id: "Voidwatch",
      name: intl.formatMessage({
        id: "Empyrean.Techs.Voidwatch.Title",
        description: "Title of Tech: Voidwatch",
        defaultMessage: "Voidwatch",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    Vortex: {
      description: intl.formatMessage({
        id: "Vuil'raith Cabal.Techs.Vortex.Description",
        description: "Description for Tech: Vortex",
        defaultMessage:
          "ACTION: Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      faction: "Vuil'raith Cabal",
      id: "Vortex",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Techs.Vortex.Title",
        description: "Title of Tech: Vortex",
        defaultMessage: "Vortex",
      }),
      prereqs: ["RED"],
      type: "RED",
    },
  };
}
