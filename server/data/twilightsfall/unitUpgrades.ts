import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  bombardment,
  planetaryShield,
  production,
  spaceCannon,
  sustainDamage,
} from "../../../src/util/strings";

export default function getTwilightsFallUnitUpgrades(
  intl: IntlShape
): Record<TwilightsFall.TFUnitUpgradeId, TFBaseUnitUpgrade> {
  return {
    "Advanced Carrier": {
      abilities: [sustainDamage(intl)],
      id: "Advanced Carrier",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Advanced Carrier.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Advanced Carrier",
        defaultMessage: "Advanced Carrier",
      }),
      origin: "Federation of Sol",
      stats: {
        cost: 3,
        combat: 9,
        move: 2,
        capacity: 8,
      },
      unitType: "Carrier",
    },
    "Ahk Syl Fier": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Ahk Syl Fier.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Ahk Syl Fier",
        defaultMessage:
          "At the start of your turn, you may place or move a Creuss wormhole token into this system.",
      }),
      id: "Ahk Syl Fier",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Ahk Syl Fier.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Ahk Syl Fier",
        defaultMessage: "Ahk Syl Fier",
      }),
      origin: "Ghosts of Creuss",
      stats: {
        cost: 2,
        combat: 6,
        move: 3,
        capacity: 1,
      },
      unitType: "Cruiser",
    },
    Ambassador: {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Ambassador.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Ambassador",
        defaultMessage:
          "After you commit units, if units transported by Ambassadors are the only units commited to a planet, you may place those units into coexistance instead.",
      }),
      id: "Ambassador",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Ambassador.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Ambassador",
        defaultMessage: "Ambassador",
      }),
      origin: "Deepwrought Scholarate",
      stats: {
        cost: 3,
        combat: 9,
        move: 2,
        capacity: 6,
      },
      unitType: "Carrier",
    },
    Corsair: {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Corsair.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Corsair",
        defaultMessage:
          "If the active system contains another player's non-fighter ships, this unit can move through systems that contain other players' ships.",
      }),
      id: "Corsair",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Corsair.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Corsair",
        defaultMessage: "Corsair",
      }),
      origin: "Mentak Coalition",
      stats: {
        cost: 2,
        combat: 6,
        move: 3,
        capacity: 2,
      },
      unitType: "Cruiser",
    },
    Dawncrusher: {
      abilities: [sustainDamage(intl), bombardment("4", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Dawncrusher.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Dawncrusher",
        defaultMessage:
          'This unit cannot be destroyed by "Spark" action cards.',
      }),
      id: "Dawncrusher",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Dawncrusher.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Dawncrusher",
        defaultMessage: "Dawncrusher",
      }),
      origin: "Barony of Letnev",
      stats: {
        cost: 3,
        combat: 5,
        move: 2,
        capacity: 1,
      },
      unitType: "Dreadnought",
    },
    "Echo of Ascension": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Echo of Ascension.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Echo of Ascension",
        defaultMessage:
          "Keep this card in your play area and adjust the printed values of your flagship by the indicated amounts.",
      }),
      id: "Echo of Ascension",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Echo of Ascension.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Echo of Ascension",
        defaultMessage: "Echo of Ascension",
      }),
      origin: "Nomad",
      stats: {
        combat: "-1 (x2)",
        move: 1,
        capacity: 2,
      },
      unitType: "Flagship",
    },
    "Eidolon Landwaster": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Eidolon Landwaster.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Eidolon Landwaster",
        defaultMessage:
          "Keep this card in your play area; your mechs roll 1 additional die during combat.",
      }),
      expansion: "POK",
      id: "Eidolon Landwaster",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Eidolon Landwaster.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Eidolon Landwaster",
        defaultMessage: "Eidolon Landwaster",
      }),
      origin: "Naaz-Rokha Alliance",
      stats: {
        combat: "0 (x2)",
      },
      unitType: "Mech",
    },
    "Eidolon Terminus": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Eidolon Terminus.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Eidolon Terminus",
        defaultMessage:
          "Keep this card in your play area; the COMBAT value of your mechs is reduced by 1.",
      }),
      expansion: "POK",
      id: "Eidolon Terminus",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Eidolon Terminus.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Eidolon Terminus",
        defaultMessage: "Eidolon Terminus",
      }),
      origin: "Vuil'raith Cabal",
      stats: {
        combat: -1,
      },
      unitType: "Mech",
    },
    Exile: {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Exile.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Exile",
        defaultMessage:
          "This unit can move through systems that contain other player's ships.",
      }),
      id: "Exile",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Exile.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Exile",
        defaultMessage: "Exile",
      }),
      origin: "Crimson Rebellion",
      stats: {
        cost: 1,
        combat: 8,
        move: 4,
      },
      unitType: "Destroyer",
    },
    Exotrireme: {
      abilities: [sustainDamage(intl), bombardment("4 (x2)", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Exotrireme.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Exotrireme",
          defaultMessage:
            'This unit cannot be destroyed by "Spark" action cards.{br}After a round of space combat, you may destroy this unit to destroy up to 2 ships in this system.',
        },
        { br: "\n\n" }
      ),
      id: "Exotrireme",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Exotrireme.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Exotrireme",
        defaultMessage: "Exotrireme",
      }),
      origin: "Sardakk N'orr",
      stats: {
        cost: 4,
        combat: 4,
        move: 2,
        capacity: 1,
      },
      unitType: "Dreadnought",
    },
    "Floating Factories": {
      abilities: [production("7", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Floating Factories.Text",
          description:
            "Text of Twilight's Fall Unit Upgrade: Floating Factories",
          defaultMessage:
            "This unit is placed in the space area instead of on a planet.{br}This unit can move and retreat as if it were a ship. If this unit is blockaded, it is destroyed.",
        },
        { br: "\n\n" }
      ),
      id: "Floating Factories",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Floating Factories.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Floating Factories",
        defaultMessage: "Floating Factories",
      }),
      origin: "Clan of Saar",
      stats: {
        move: 2,
        capacity: 5,
      },
      unitType: "Space Dock",
    },
    "Guild Agents": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Guild Agents.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Guild Agents",
        defaultMessage:
          "After you move this unit into a system that contains another player's units, you may look at that player's action cards and take 1 of them.",
      }),
      id: "Guild Agents",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Guild Agents.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Guild Agents",
        defaultMessage: "Guild Agents",
      }),
      origin: "Yssaril Tribes",
      stats: {
        cost: "1 (x2)",
        combat: 7,
      },
      unitType: "Infantry",
    },
    HelTitan: {
      abilities: [
        planetaryShield(intl),
        spaceCannon("5", intl),
        sustainDamage(intl),
        production("1", intl),
      ],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Hel-Titan.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Hel-Titan",
          defaultMessage:
            "This unit is treated as both a structure and a ground force. It cannot be transported. You may use this unit's SPACE CANNON ability against ships that are adjacent to this unit's system.",
        },
        { br: "\n\n" }
      ),
      id: "HelTitan",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Hel-Titan.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Hel-Titan",
        defaultMessage: "Hel-Titan",
      }),
      origin: "Titans of Ul",
      stats: {
        combat: 5,
      },
      unitType: "PDS",
    },
    "Helios Entity": {
      abilities: [production("X", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Helios Entity.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Helios Entity",
          defaultMessage:
            "This unit's PRODUCTION value is equal to 2 more than the resource value of this planet.{br}The resource value of this planet is increased by 2.{br}Up to 3 fighters in this system do not count against your ships' capacity.",
        },
        { br: "\n\n" }
      ),
      id: "Helios Entity",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Helios Entity.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Helios Entity",
        defaultMessage: "Helios Entity",
      }),
      origin: "Last Bastion",
      stats: {},
      unitType: "Space Dock",
    },
    "Hybrid Crystal Fighter": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Hybrid Crystal Fighter.Text",
        description:
          "Text of Twilight's Fall Unit Upgrade: Hybrid Crystal Fighter",
        defaultMessage:
          "This unit may move without being transported. Each fighter in excess of your ships' capacity counts as 1/2 of a ship against your fleet pool.",
      }),
      id: "Hybrid Crystal Fighter",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Hybrid Crystal Fighter.Name",
        description:
          "Name of Twilight's Fall Unit Upgrade: Hybrid Crystal Fighter",
        defaultMessage: "Hybrid Crystal Fighter",
      }),
      origin: "Naalu Collective",
      stats: {
        cost: "1 (x2)",
        combat: 7,
        move: 2,
      },
      unitType: "Fighter",
    },
    "Justiciar Rall": {
      abilities: [planetaryShield(intl), spaceCannon("5", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Justiciar Rall.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Justiciar Rall",
          defaultMessage:
            "You may use this unit's SPACE CANNON ability against ships that are adjacent to this unit's system.{br}Hits produced by this unit must be assigned to non-fighter ships if able.",
        },
        { br: "\n\n" }
      ),
      id: "Justiciar Rall",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Justiciar Rall.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Justiciar Rall",
        defaultMessage: "Justiciar Rall",
      }),
      origin: "Winnu",
      stats: {},
      unitType: "PDS",
    },
    "Keeper Matrix": {
      abilities: [planetaryShield(intl), spaceCannon("5 (x2)", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Keeper Matrix.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Keeper Matrix",
        defaultMessage:
          "Your may use this unit's SPACE CANNON ability against ships that are adjacent to this unit's system.",
      }),
      id: "Keeper Matrix",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Keeper Matrix.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Keeper Matrix",
        defaultMessage: "Keeper Matrix",
      }),
      origin: "Xxcha Kingdom",
      stats: {},
      unitType: "PDS",
    },
    "Letani Warrior": {
      abilities: [production("2", intl)],
      id: "Letani Warrior",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Letani Warrior.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Letani Warrior",
        defaultMessage: "Letani Warrior",
      }),
      origin: "Arborec",
      stats: {
        cost: "1 (x2)",
        combat: 7,
      },
      unitType: "Infantry",
    },
    Linkship: {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Linkship.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Linkship",
        defaultMessage:
          "When this unit retreats, you may destroy 1 ship in the active system that is damaged or does not have SUSTAIN DAMAGE.",
      }),
      id: "Linkship",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Linkship.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Linkship",
        defaultMessage: "Linkship",
      }),
      origin: "Ral Nel Consortium",
      stats: {
        cost: 1,
        combat: 8,
        move: 2,
      },
      unitType: "Destroyer",
    },
    Morphwing: {
      abilities: [],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Morphwing.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Morphwing",
          defaultMessage:
            "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool. This ship can be committed during an invasion; either return it to the space area or replace it with 1 infantry at the end of combat.",
        },
        { br: "\n\n" }
      ),
      id: "Morphwing",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Morphwing.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Morphwing",
        defaultMessage: "Morphwing",
      }),
      origin: "Naaz-Rokha Alliance",
      stats: {
        cost: "1 (x2)",
        combat: 7,
        move: 2,
      },
      unitType: "Fighter",
    },
    "Production Biomes": {
      abilities: [production("9", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Production Biomes.Text",
          description:
            "Text of Twilight's Fall Unit Upgrade: Production Biomes",
          defaultMessage:
            "Up to 3 fighters in this system do not count against your ships' capacity.{br}When this unit uses PRODUCTION, you may spend 1 token from your strategy pool to gain 4 trade goods and choose another player to gain 2 trade goods.",
        },
        { br: "\n\n" }
      ),
      id: "Production Biomes",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Production Biomes.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Production Biomes",
        defaultMessage: "Production Biomes",
      }),
      origin: "Emirates of Hacan",
      stats: {},
      unitType: "Space Dock",
    },
    "Prototype War Sun": {
      abilities: [sustainDamage(intl), bombardment("3 (x3)", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Prototype War Sun.Text",
          description:
            "Text of Twilight's Fall Unit Upgrade: Prototype War Sun",
          defaultMessage:
            "Other players' units in this system lose PLANETARY SHIELD.{br}This unit and other units moving at the same time can move into and through supernovas.",
        },
        { br: "\n\n" }
      ),
      id: "Prototype War Sun",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Prototype War Sun.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Prototype War Sun",
        defaultMessage: "Prototype War Sun",
      }),
      origin: "Embers of Muaat",
      stats: {
        cost: 12,
        combat: "3 (x3)",
        move: 2,
        capacity: 6,
      },
      unitType: "War Sun",
    },
    Saggitaria: {
      abilities: [sustainDamage(intl)],
      id: "Saggitaria",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Saggitaria.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Saggitaria",
        defaultMessage: "Saggitaria",
      }),
      origin: "Council Keleres",
      stats: {
        cost: 2,
        combat: 6,
        move: 3,
        capacity: 1,
      },
      unitType: "Cruiser",
    },
    "Strike Wing Alpha": {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Strike Wing Alpha.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Strike Wing Alpha",
        defaultMessage:
          "When this unit uses ANTI-FIGHTER BARRAGE, each result of 9 or 10 also destroys 1 of your opponent's infantry in the space area of the active system.",
      }),
      id: "Strike Wing Alpha",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Strike Wing Alpha.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Strike Wing Alpha",
        defaultMessage: "Strike Wing Alpha",
      }),
      origin: "Argent Flight",
      stats: {
        cost: 1,
        combat: 7,
        move: 2,
        capacity: 1,
      },
      unitType: "Destroyer",
    },
    SuperDreadnought: {
      abilities: [sustainDamage(intl), bombardment("4", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Super-Dreadnought.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Super-Dreadnought",
        defaultMessage:
          'This unit cannot be destroyed by "Spark" action cards.',
      }),
      id: "SuperDreadnought",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Super-Dreadnought.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Super-Dreadnought",
        defaultMessage: "Super-Dreadnought",
      }),
      origin: "L1Z1X Mindnet",
      stats: {
        cost: 4,
        combat: 5,
        move: 2,
        capacity: 2,
      },
      unitType: "Dreadnought",
    },
    "The Dragon Freed": {
      abilities: [sustainDamage(intl), bombardment("3 (x3)", intl)],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.The Dragon, Freed.Text",
          description:
            "Text of Twilight's Fall Unit Upgrade: The Dragon, Freed",
          defaultMessage:
            "While you own this card, you can only have 1 war sun.{br}When this unit uses BOMBARDMENT, it uses it against each planet in its system and each adjacent system, even yours, ignoring PLANETARY SHIELD.",
        },
        { br: "\n\n" }
      ),
      id: "The Dragon Freed",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.The Dragon, Freed.Name",
        description: "Name of Twilight's Fall Unit Upgrade: The Dragon, Freed",
        defaultMessage: "The Dragon, Freed",
      }),
      origin: "Obsidian",
      stats: {
        cost: 12,
        combat: "3 (x3)",
        move: 2,
        capacity: 6,
      },
      unitType: "War Sun",
    },
    Triune: {
      abilities: [],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Triune.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Triune",
          defaultMessage:
            "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool. You may remove 3 of your fighters from systems that contain or are adjacent to a player's units to cancel an action card played by that player.",
        },
        { br: "\n\n" }
      ),
      id: "Triune",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Triune.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Triune",
        defaultMessage: "Triune",
      }),
      origin: "Empyrean",
      stats: {
        cost: "1 (x2)",
        combat: 7,
        move: 2,
      },
      unitType: "Fighter",
    },
    "University War Sun": {
      abilities: [sustainDamage(intl), bombardment("4 (x3)", intl)],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.University War Sun.Text",
        description: "Text of Twilight's Fall Unit Upgrade: University War Sun",
        defaultMessage:
          "Other players' units in this system lose PLANETARY SHIELD.",
      }),
      id: "University War Sun",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.University War Sun.Name",
        description: "Name of Twilight's Fall Unit Upgrade: University War Sun",
        defaultMessage: "University War Sun",
      }),
      origin: "Universities of Jol-Nar",
      stats: {
        cost: 10,
        combat: "4 (x3)",
        move: 3,
        capacity: 6,
      },
      unitType: "War Sun",
    },
    "Valefar Prime": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Valefar Prime.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Valefar Prime",
        defaultMessage:
          "Keep this card in your play area; the COST of your mechs is reduced by 1.",
      }),
      expansion: "POK",
      id: "Valefar Prime",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Valefar Prime.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Valefar Prime",
        defaultMessage: "Valefar Prime",
      }),
      origin: "Nekro Virus",
      stats: {
        cost: "-1",
      },
      unitType: "Mech",
    },
    Vortexer: {
      abilities: [],
      description: intl.formatMessage(
        {
          id: "TF.Unit Upgrade.Vortexer.Text",
          description: "Text of Twilight's Fall Unit Upgrade: Vortexer",
          defaultMessage:
            "Capture other players' infantry and fighters that are destroyed or removed in this unit's system or an adjacent system. At the start of your turn, you may spend captured infantry or fighters to place equivalent units from your reinforcements in this system.",
        },
        { br: "\n\n" }
      ),
      id: "Vortexer",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Vortexer.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Vortexer",
        defaultMessage: "Vortexer",
      }),
      origin: "Vuil'raith Cabal",
      stats: {
        cost: 3,
        combat: 9,
        move: 2,
        capacity: 6,
      },
      unitType: "Carrier",
    },
    "Yin Clone": {
      abilities: [],
      description: intl.formatMessage({
        id: "TF.Unit Upgrade.Yin Clone.Text",
        description: "Text of Twilight's Fall Unit Upgrade: Yin Clone",
        defaultMessage:
          "After this unit is destroyed or removed, place the unit on this card. At the start of the status phase, place each unit that is on this card on a planet you control.",
      }),
      id: "Yin Clone",
      name: intl.formatMessage({
        id: "TF.Unit Upgrade.Yin Clone.Name",
        description: "Name of Twilight's Fall Unit Upgrade: Yin Clone",
        defaultMessage: "Yin Clone",
      }),
      origin: "Yin Brotherhood",
      stats: {
        cost: "1 (x2)",
        combat: 7,
      },
      unitType: "Infantry",
    },
  };
}
