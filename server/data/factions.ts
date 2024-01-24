import { IntlShape } from "react-intl";
import { DISCORDANT_STARS_FACTIONS } from "./discordantstars/factions";
import {
  bombardment,
  planetaryShield,
  production,
  spaceCannon,
  sustainDamage,
} from "../../src/util/strings";

export function getBaseFactions(
  intl: IntlShape
): Record<FactionId, BaseFaction> {
  return {
    Arborec: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Arborec.Abilities.Mitosis.Title",
            description: "Title of Faction Ability: Mitosis",
            defaultMessage: "Mitosis",
          }),
          description: intl.formatMessage({
            id: "Arborec.Abilities.Mitosis.Description",
            description: "Description for Faction Ability: Mitosis",
            defaultMessage:
              "Your space docks cannot produce infantry. At the start of the status phase, place 1 infantry from your reinforcements on any planet you control.",
          }),
        },
      ],
      colors: {
        Black: 0.1,
        Blue: 0.1,
        Green: 1.6,
        Yellow: 0.1,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Arborec",
      name: intl.formatMessage({
        id: "Arborec.Name",
        description: "Name of Faction: Arborec",
        defaultMessage: "Arborec",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Arborec.Promissories.Stymie.Title",
            description: "Title of Faction Promissory: Stymie",
            defaultMessage: "Stymie",
          }),
          description: intl.formatMessage(
            {
              id: "Arborec.Promissories.Stymie.Description",
              description: "Description for Faction Promissory: Stymie",
              defaultMessage:
                "ACTION: Place this card face up in your play area.{br}While this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units.{br}If you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player.",
            },
            { br: "\n\n" }
          ),
          omega: {
            name: intl.formatMessage({
              id: "Arborec.Promissories.Stymie.Omega.Title",
              description: "Title of Faction Promissory: Stymie Ω",
              defaultMessage: "Stymie Ω",
            }),
            description: intl.formatMessage({
              id: "Arborec.Promissories.Stymie.Omega.Description",
              description: "Description for Faction Promissory: Stymie Ω",
              defaultMessage:
                "After another player moves ships into a system that contains 1 or more of your units:\n\nYou may place 1 command token from that player's reinforcements in any non-home system.\n\nThen, return this card to the Arborec player.",
            }),
            expansion: "CODEX ONE",
          },
        },
      ],
      shortname: intl.formatMessage({
        id: "Arborec.Shortname",
        description: "Shortened version of Faction name: Arborec",
        defaultMessage: "Arborec",
      }),
      startswith: {
        planets: ["Nestphar"],
        techs: ["Magen Defense Grid"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 4,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Arborec.Units.Duha Menaimon.Description",
            description: "Description of Faction Unit: Duha Menaimon",
            defaultMessage:
              "After you activate this system, you may produce up to 5 units in this system.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Arborec.Units.Duha Menaimon.Title",
            description: "Title of Faction Unit: Duha Menaimon",
            defaultMessage: "Duha Menaimon",
          }),
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 5,
          },
          type: "Flagship",
        },
        {
          abilities: [
            sustainDamage(intl),
            production("2", intl),
            planetaryShield(intl),
          ],
          description: intl.formatMessage({
            id: "Arborec.Units.Letani Behemoth.Description",
            description: "Description for Faction Unit: Letani Behemoth",
            defaultMessage:
              "DEPLOY: When you would use your MITOSIS faction ability you may replace 1 of your infantry with 1 mech from your reinforcements instead.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Arborec.Units.Letani Behemoth.Title",
            description: "Title of Faction Unit: Letani Behemoth",
            defaultMessage: "Letani Behemoth",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [production("1", intl)],
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Arborec.Units.Letani Warrior I.Title",
            description: "Title of Faction Unit: Letani Warrior I",
            defaultMessage: "Letani Warrior I",
          }),
          stats: {
            cost: "1(x2)",
            combat: 8,
          },
          type: "Infantry",
          upgrade: "Letani Warrior II",
        },
      ],
    },
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
    "Barony of Letnev": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Barony of Letnev.Abilities.Munitions Reserve.Title",
            description: "Title of Faction Ability: Munitions Reserve",
            defaultMessage: "Munitions Reserve",
          }),
          description: intl.formatMessage({
            id: "Barony of Letnev.Abilities.Munitions Reserve.Description",
            description: "Description for Faction Ability: Munitions Reserve",
            defaultMessage:
              "At the start of each round of space combat, you may spend 2 trade goods;  you may re-roll any number of your dice during that combat round.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Barony of Letnev.Abilities.Armada.Title",
            description: "Title of Faction Ability: Armada",
            defaultMessage: "Armada",
          }),
          description: intl.formatMessage({
            id: "Barony of Letnev.Abilities.Armada.Description",
            description: "Description for Faction Ability: Armada",
            defaultMessage:
              "The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool.",
          }),
        },
      ],
      colors: {
        Black: 0.8,
        Blue: 0.1,
        Red: 0.95,
      },
      commodities: 2,
      expansion: "BASE",
      id: "Barony of Letnev",
      name: intl.formatMessage({
        id: "Barony of Letnev.Name",
        description: "Name of Faction: Barony of Letnev",
        defaultMessage: "Barony of Letnev",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Barony of Letnev.Promissories.War Funding.Title",
            description: "Title of Faction Promissory: War Funding",
            defaultMessage: "War Funding",
          }),
          description: intl.formatMessage(
            {
              id: "Barony of Letnev.Promissories.War Funding.Description",
              description: "Description for Faction Promissory: War Funding",
              defaultMessage:
                "At the start of a round of space combat:{br}The Letnev player loses 2 trade goods.{br}During this combat round, re-roll any number of your dice.{br}Then, return this card to the Letnev player.",
            },
            { br: "\n\n" }
          ),
          omega: {
            name: intl.formatMessage({
              id: "Barony of Letnev.Promissories.War Funding.Omega.Title",
              description: "Title of Faction Promissory: War Funding Ω",
              defaultMessage: "War Funding Ω",
            }),
            description: intl.formatMessage(
              {
                id: "Barony of Letnev.Promissories.War Funding.Omega.Description",
                description:
                  "Description for Faction Promissory: War Funding Ω",
                defaultMessage:
                  "After you and your opponent roll dice during space combat:{br}You may reroll all of your opponent's dice. You may reroll any number of your dice.{br}Then, return this card to the Letnev player.",
              },
              { br: "\n\n" }
            ),
            expansion: "CODEX ONE",
          },
        },
      ],
      shortname: intl.formatMessage({
        id: "Barony of Letnev.Shortname",
        description: "Shortened version of Faction name: Barony of Letnev",
        defaultMessage: "Letnev",
      }),
      startswith: {
        planets: ["Arc Prime", "Wren Terra"],
        techs: ["Antimass Deflectors", "Plasma Scoring"],
        units: {
          Carrier: 1,
          Destroyer: 1,
          Dreadnought: 1,
          Fighter: 1,
          Infantry: 3,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl), bombardment("5 (x3)", intl)],
          description: intl.formatMessage({
            id: "Barony of Letnev.Units.Arc Secundus.Description",
            description: "Description for Faction Unit: Arc Secundus",
            defaultMessage:
              "Other players' units in this system lose PLANETARY SHIELD.  At the start of each space combat round, repair this ship.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Barony of Letnev.Units.Arc Secundus.Title",
            description: "Title of Faction Unit: Arc Secundus",
            defaultMessage: "Arc Secundus",
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
            id: "Barony of Letnev.Units.Dunlain Reaper.Description",
            description: "Description for Faction Unit: Dunlain Reaper",
            defaultMessage:
              "DEPLOY: At the start of a round of ground combat, you may spend 2 resources to replace 1 of your infantry in that combat with 1 mech.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Barony of Letnev.Units.Dunlain Reaper.Title",
            description: "Title of Faction Unit: Dunlain Reaper",
            defaultMessage: "Dunlain Reaper",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Clan of Saar": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Clan of Saar.Abilities.Scavenge.Title",
            description: "Title of Faction Ability: Scavenge",
            defaultMessage: "Scavenge",
          }),
          description: intl.formatMessage({
            id: "Clan of Saar.Abilities.Scavenge.Description",
            description: "Description for Faction Ability: Scavenge",
            defaultMessage:
              "After you gain control of a planet, gain 1 trade good.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Clan of Saar.Abilities.Nomadic.Title",
            description: "Title of Faction Ability: Nomadic",
            defaultMessage: "Nomadic",
          }),
          description: intl.formatMessage({
            id: "Clan of Saar.Abilities.Nomadic.Description",
            description: "Description for Faction Ability: Nomadic",
            defaultMessage:
              "You can score objectives even if you do not control the planets in your home system.",
          }),
        },
      ],
      colors: {
        Green: 0.5,
        Orange: 0.85,
        Yellow: 0.4,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Clan of Saar",
      name: intl.formatMessage({
        id: "Clan of Saar.Name",
        description: "Name of Faction: Clan of Saar",
        defaultMessage: "Clan of Saar",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Clan of Saar.Promissories.Ragh's Call.Title",
            description: "Title of Faction Promissory: Ragh's Call",
            defaultMessage: "Ragh's Call",
          }),
          description: intl.formatMessage(
            {
              id: "Clan of Saar.Promissories.Ragh's Call.Description",
              description: "Description for Faction Promissory: Ragh's Call",
              defaultMessage:
                "After you commit 1 or more units to land on a planet:{br}Remove all of the Saar player's ground forces from that planet and place them on a planet controlled by the Saar player.{br}Then return this card to the Saar player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Clan of Saar.Shortname",
        description: "Shortened version of Faction name: Clan of Saar",
        defaultMessage: "Saar",
      }),
      startswith: {
        planets: ["Lisis II", "Ragh"],
        techs: ["Antimass Deflectors"],
        units: {
          Carrier: 2,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl), "ANTI-FIGHTER BARRAGE 6 (x4)"],
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Clan of Saar.Units.Son of Ragh.Title",
            description: "Title of Faction Unit: Son of Ragh",
            defaultMessage: "Son of Ragh",
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
            id: "Clan of Saar.Units.Scavenger Zeta.Description",
            description: "Description for Faction Unit: Scavenger Zeta",
            defaultMessage:
              "DEPLOY: After you gain control of a planet, you may spend 1 trade good to place 1 mech on that planet.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Clan of Saar.Units.Scavenger Zeta.Title",
            description: "Title of Faction Unit: Scavenger Zeta",
            defaultMessage: "Scavenger Zeta",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [production("5", intl)],
          description: intl.formatMessage({
            id: "Clan of Saar.Units.Floating Factory I.Description",
            description: "Description for Faction Unit: Floating Factory I",
            defaultMessage:
              "This unit is placed in a space area instead of on a planet.  This unit can move and retreat as if it were a ship.  If this unit is blockaded, it is destroyed.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Clan of Saar.Units.Floating Factory I.Title",
            description: "Title of Faction Unit: Floating Factory I",
            defaultMessage: "Floating Factory I",
          }),
          stats: {
            move: 1,
            capacity: 4,
          },
          type: "Space Dock",
          upgrade: "Floating Factory II",
        },
      ],
    },
    "Council Keleres": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.The Tribunii.Title",
            description: "Title of Faction Ability: The Tribunii",
            defaultMessage: "The Tribunii",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.The Tribunii.Description",
            description: "Description for Faction Ability: The Tribunii",
            defaultMessage:
              "During setup, choose an unplayed faction from among the Mentak, the Xxcha and the Argent Flight; take that faction's home system, command tokens and control markers. Additionally, take the Keleres Hero that corresponds to that faction.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Title",
            description: "Title of Faction Ability: Council Patronage",
            defaultMessage: "Council Patronage",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Description",
            description: "Description for Faction Ability: Council Patronage",
            defaultMessage:
              "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.Law's Order.Title",
            description: "Title of Faction Ability: Law's Order",
            defaultMessage: "Law's Order",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.Law's Order.Description",
            description: "Description for Faction Ability: Law's Order",
            defaultMessage:
              "You may spend 1 influence at the start of your turn to treat all laws as blank until the end of your turn.",
          }),
        },
      ],
      colors: {
        Blue: 0.5,
        Orange: 0.35,
        Purple: 0.7,
        Yellow: 0.35,
      },
      commodities: 2,
      expansion: "CODEX THREE",
      id: "Council Keleres",
      name: intl.formatMessage({
        id: "Council Keleres.Name",
        description: "Name of Faction: Council Keleres",
        defaultMessage: "Council Keleres",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Council Keleres.Promissories.Keleres Rider.Title",
            description: "Title of Faction Promissory: Keleres Rider",
            defaultMessage: "Keleres Rider",
          }),
          description: intl.formatMessage(
            {
              id: "Council Keleres.Promissories.Keleres Rider.Description",
              description: "Description for Faction Promissory: Keleres Rider",
              defaultMessage:
                "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 1 action card and gain 2 trade goods.{br}Then, return this card to the Keleres player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Council Keleres.Shortname",
        description: "Shortened version of Faction name: Council Keleres",
        defaultMessage: "Keleres",
      }),
      startswith: {
        choice: {
          options: [],
          select: 2,
        },
        planetchoice: {
          options: ["Argent Flight", "Mentak Coalition", "Xxcha Kingdom"],
        },
        units: {
          Carrier: 2,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 2,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Council Keleres.Units.Artemiris.Description",
            description: "Description for Faction Unit: Artemiris",
            defaultMessage:
              "Other players must spend 2 influence to activate the system that contains this ship.",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Council Keleres.Units.Artemiris.Title",
            description: "Title of Faction Unit: Artemiris",
            defaultMessage: "Artemiris",
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
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Council Keleres.Units.Omniopiares.Description",
            description: "Description for Faction Unit: Omniopiares",
            defaultMessage:
              "Other players must spend 1 influence to commit ground forces to the planet that contains this unit.",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Council Keleres.Units.Omniopiares.Title",
            description: "Title of Faction Unit: Omniopiares",
            defaultMessage: "Omniopiares",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Embers of Muaat": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Embers of Muaat.Abilities.Star Forge.Title",
            description: "Title of Faction Ability: Star Forge",
            defaultMessage: "Star Forge",
          }),
          description: intl.formatMessage({
            id: "Embers of Muaat.Abilities.Star Forge.Description",
            description: "Description for Faction Ability: Star Forge",
            defaultMessage:
              "ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Embers of Muaat.Abilities.Gashlai Physiology.Title",
            description: "Title of Faction Ability: Gashlai Physiology",
            defaultMessage: "Gashlai Physiology",
          }),
          description: intl.formatMessage({
            id: "Embers of Muaat.Abilities.Gashlai Physiology.Description",
            description: "Description for Faction Ability: Gashlai Physiology",
            defaultMessage: "Your ships can move through supernovas.",
          }),
        },
      ],
      colors: {
        Orange: 0.65,
        Red: 1.25,
      },
      commodities: 4,
      expansion: "BASE",
      id: "Embers of Muaat",
      name: intl.formatMessage({
        id: "Embers of Muaat.Name",
        description: "Name of Faction: Embers of Muaat",
        defaultMessage: "Embers of Muaat",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Embers of Muaat.Promissories.Fires of the Gashlai.Title",
            description: "Title of Faction Promissory: Fires of the Gashlai",
            defaultMessage: "Fires of the Gashlai",
          }),
          description: intl.formatMessage({
            id: "Embers of Muaat.Promissories.Fires of the Gashlai.Description",
            description:
              "Description for Faction Promissory: Fires of the Gashlai",
            defaultMessage:
              "ACTION: Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card.\n\nThen, return this card to the Muaat player.",
          }),
        },
      ],
      shortname: intl.formatMessage({
        id: "Embers of Muaat.Shortname",
        description: "Shortened version of Faction name: Embers of Muaat",
        defaultMessage: "Muaat",
      }),
      startswith: {
        planets: ["Muaat"],
        techs: ["Plasma Scoring"],
        units: {
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
          "War Sun": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Embers of Muaat.Units.The Inferno.Description",
            description: "Description for Faction Unit: The Inferno",
            defaultMessage:
              "ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit's system.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Embers of Muaat.Units.The Inferno.Title",
            description: "Title of Faction Unit: The Inferno",
            defaultMessage: "The Inferno",
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
            id: "Embers of Muaat.Units.Ember Colossus.Description",
            description: "Description for Faction Unit: Ember Colossus",
            defaultMessage:
              "When you use your STAR FORGE faction ability in this system or an adjacent system, you may place 1 infantry from your reinforcements with this unit.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Embers of Muaat.Units.Ember Colossus.Title",
            description: "Title of Faction Unit: Ember Colossus",
            defaultMessage: "Ember Colossus",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [sustainDamage(intl), bombardment("3 (x3)", intl)],
          description: intl.formatMessage({
            id: "Embers of Muaat.Units.Prototype War Sun I.Description",
            description: "Description for Faction Unit: Prototype War Sun I",
            defaultMessage:
              "Other players' units in this system lose PLANETARY SHIELD.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Embers of Muaat.Units.Prototype War Sun I.Title",
            description: "Title of Faction Unit: Prototype War Sun I",
            defaultMessage: "Prototype War Sun I",
          }),
          stats: {
            cost: 12,
            combat: "3(x3)",
            move: 1,
            capacity: 6,
          },
          type: "War Sun",
          upgrade: "Prototype War Sun II",
        },
      ],
    },
    "Emirates of Hacan": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Masters of Trade.Title",
            description: "Title of Faction Ability: Masters of Trade",
            defaultMessage: "Masters of Trade",
          }),
          description: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Masters of Trade.Description",
            description: "Description for Faction Ability: Masters of Trade",
            defaultMessage:
              'You do not have to spend a command token to resolve the secondary ability of the "Trade" strategy card.',
          }),
        },
        {
          name: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Guild Ships.Title",
            description: "Title of Faction Ability: Guild Ships",
            defaultMessage: "Guild Ships",
          }),
          description: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Guild Ships.Description",
            description: "Description for Faction Ability: Guild Ships",
            defaultMessage:
              "You can negotiate transactions with players who are not your neighbor.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Arbiters.Title",
            description: "Title of Faction Ability: Arbiters",
            defaultMessage: "Arbiters",
          }),
          description: intl.formatMessage({
            id: "Emirates of Hacan.Abilities.Arbiters.Description",
            description: "Description for Faction Ability: Arbiters",
            defaultMessage:
              "When you are negotiating a transaction, action cards can be exchanged as part of that transaction.",
          }),
        },
      ],
      colors: {
        Orange: 0.7,
        Yellow: 1.2,
      },
      commodities: 6,
      expansion: "BASE",
      id: "Emirates of Hacan",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Name",
        description: "Name of Faction: Emirates of Hacan",
        defaultMessage: "Emirates of Hacan",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Emirates of Hacan.Promissories.Trade Convoys.Title",
            description: "Title of Faction Promissory: Trade Convoys",
            defaultMessage: "Trade Convoys",
          }),
          description: intl.formatMessage(
            {
              id: "Emirates of Hacan.Promissories.Trade Convoys.Description",
              description: "Description for Faction Promissory: Trade Convoys",
              defaultMessage:
                "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, you may negotiate transactions with players who are not your neighbor.{br}If you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Emirates of Hacan.Shortname",
        description: "Shortened version of Faction name: Emirates of Hacan",
        defaultMessage: "Hacan",
      }),
      startswith: {
        planets: ["Arretze", "Hercant", "Kamdorn"],
        techs: ["Antimass Deflectors", "Sarween Tools"],
        units: {
          Carrier: 2,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Emirates of Hacan.Units.Wrath of Kenara.Description",
            description: "Description for Faction Unit: Wrath of Kenara",
            defaultMessage:
              "After you roll a die during a space combat in this system, you may spend 1 trade good to apply +1 to the result.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Emirates of Hacan.Units.Wrath of Kenara.Title",
            description: "Title of Faction Unit: Wrath of Kenara",
            defaultMessage: "Wrath of Kenara",
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
            id: "Emirates of Hacan.Units.Pride of Kenara.Description",
            description: "Description for Faction Unit: Pride of Kenara",
            defaultMessage:
              "This planet's card may be traded as part of a transaction; if you do, move all of your units from this planet to another planet you control.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Emirates of Hacan.Units.Pride of Kenara.Title",
            description: "Title of Faction Unit: Pride of Kenara",
            defaultMessage: "Pride of Kenara",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
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
    "Federation of Sol": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Federation of Sol.Abilities.Orbital Drop.Title",
            description: "Title of Faction Ability: Orbital Drop",
            defaultMessage: "Orbital Drop",
          }),
          description: intl.formatMessage({
            id: "Federation of Sol.Abilities.Orbital Drop.Description",
            description: "Description for Faction Ability: Orbital Drop",
            defaultMessage:
              "ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Federation of Sol.Abilities.Versatile.Title",
            description: "Title of Faction Ability: Versatile",
            defaultMessage: "Versatile",
          }),
          description: intl.formatMessage({
            id: "Federation of Sol.Abilities.Versatile.Description",
            description: "Description for Faction Ability: Versatile",
            defaultMessage:
              "When you gain command tokens during the status phase, gain 1 additional command token.",
          }),
        },
      ],
      colors: {
        Blue: 1.15,
        Yellow: 0.75,
      },
      commodities: 4,
      expansion: "BASE",
      id: "Federation of Sol",
      name: intl.formatMessage({
        id: "Federation of Sol.Name",
        description: "Name of Faction: Federation of Sol",
        defaultMessage: "Federation of Sol",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Federation of Sol.Promissories.Military Support.Title",
            description: "Title of Faction Promissory: Military Support",
            defaultMessage: "Military Support",
          }),
          description: intl.formatMessage(
            {
              id: "Federation of Sol.Promissories.Military Support.Description",
              description:
                "Description for Faction Promissory: Military Support",
              defaultMessage:
                "At the start of the Sol player's turn:{br}Remove 1 token from the Sol player's strategy pool, if able, and return it to their reinforcements.  Then, you may place 2 infantry from your reinforcements on any planet you control.{br}Then return this card to the Sol player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Federation of Sol.Shortname",
        description: "Shortened version of Faction name: Federation of Sol",
        defaultMessage: "Sol",
      }),
      startswith: {
        planets: ["Jord"],
        techs: ["Antimass Deflectors", "Neural Motivator"],
        units: {
          Carrier: 2,
          Destroyer: 1,
          Fighter: 3,
          Infantry: 5,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Federation of Sol.Units.Genesis.Description",
            description: "Description for Faction Unit: Genesis",
            defaultMessage:
              "At the end of the status phase, place 1 infantry from your reinforcements in this system's space area.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Federation of Sol.Units.Genesis.Title",
            description: "Title of Faction Unit: Genesis",
            defaultMessage: "Genesis",
          }),
          stats: {
            cost: 8,
            combat: "5(x2)",
            move: 1,
            capacity: 12,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Federation of Sol.Units.ZS Thunderbolt M2.Description",
            description: "Description for Faction Unit: ZS Thunderbolt M2",
            defaultMessage:
              "DEPLOY: After you use your ORBITAL DROP faction ability, you may spend 3 resources to place 1 mech on that planet.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Federation of Sol.Units.ZS Thunderbolt M2.Title",
            description: "Title of Faction Unit: ZS Thunderbolt M2",
            defaultMessage: "ZS Thunderbolt M2",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [],
          name: intl.formatMessage({
            id: "Federation of Sol.Units.Spec Ops I.Title",
            description: "Title of Faction Unit: Spec Ops I",
            defaultMessage: "Spec Ops I",
          }),
          expansion: "BASE",
          stats: {
            cost: "1(x2)",
            combat: 7,
          },
          type: "Infantry",
          upgrade: "Spec Ops II",
        },
        {
          abilities: [],
          name: intl.formatMessage({
            id: "Federation of Sol.Units.Advanced Carrier I.Title",
            description: "Title of Faction Unit: Advanced Carrier I",
            defaultMessage: "Advanced Carrier I",
          }),
          expansion: "BASE",
          stats: {
            cost: 3,
            combat: 9,
            move: 1,
            capacity: 6,
          },
          type: "Carrier",
          upgrade: "Advanced Carrier II",
        },
      ],
    },
    "Ghosts of Creuss": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Quantum Entanglement.Title",
            description: "Title of Faction Ability: Quantum Entanglement",
            defaultMessage: "Quantum Entanglement",
          }),
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Quantum Entanglement.Description",
            description:
              "Description for Faction Ability: Quantum Entanglement",
            defaultMessage:
              "You treat all systems that contain either an alpha or beta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Slipstream.Title",
            description: "Title of Faction Ability: Slipstream",
            defaultMessage: "Slipstream",
          }),
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Slipstream.Description",
            description: "Description for Faction Ability: Slipstream",
            defaultMessage:
              "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system  or in a system that contains either an alpha or beta wormhole.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Creuss Gate.Title",
            description: "Title of Faction Ability: Creuss Gate",
            defaultMessage: "Creuss Gate",
          }),
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Abilities.Creuss Gate.Description",
            description: "Description for Faction Ability: Creuss Gate",
            defaultMessage:
              "When you create the game board, place the Creuss Gate (tile 17) where your home system would normally be placed. The Creuss Gate system is not a home system. Then, place your home system (tile 51) in your play area.",
          }),
        },
      ],
      colors: {
        Black: 0.1,
        Blue: 1.7,
        Purple: 0.1,
      },
      commodities: 4,
      expansion: "BASE",
      id: "Ghosts of Creuss",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Name",
        description: "Name of Faction: Ghosts of Creuss",
        defaultMessage: "Ghosts of Creuss",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Promissories.Creuss Iff.Title",
            description: "Title of Faction Promissory: Creuss Iff",
            defaultMessage: "Creuss Iff",
          }),
          description: intl.formatMessage(
            {
              id: "Ghosts of Creuss.Promissories.Creuss Iff.Description",
              description: "Description for Faction Promissory: Creuss Iff",
              defaultMessage:
                "At the start of your turn during the action phase:{br}Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.{br}Then, return this card to the Creuss player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Ghosts of Creuss.Shortname",
        description: "Shortened version of Faction name: Ghosts of Creuss",
        defaultMessage: "Creuss",
      }),
      startswith: {
        planets: ["Creuss"],
        techs: ["Gravity Drive"],
        units: {
          Carrier: 1,
          Destroyer: 2,
          Fighter: 2,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Units.Hil Colish.Description",
            description: "Description for Faction Unit: Hil Colish",
            defaultMessage:
              "This ship's system contains a delta wormhole. During movement, this ship may move before or after your other ships.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Units.Hil Colish.Title",
            description: "Title of Faction Unit: Hil Colish",
            defaultMessage: "Hil Colish",
          }),
          stats: {
            cost: 8,
            combat: 5,
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Units.Icarus Drive.Description",
            description: "Description for Faction Unit: Icarus Drive",
            defaultMessage:
              "After any player activates a system, you may remove this unit from the game board to place or move a Creuss wormhole token into this system.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Units.Icarus Drive.Title",
            description: "Title of Faction Unit: Icarus Drive",
            defaultMessage: "Icarus Drive",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "L1Z1X Mindnet": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Abilities.Assimilate.Title",
            description: "Title of Faction Ability: Assimilate",
            defaultMessage: "Assimilate",
          }),
          description: intl.formatMessage({
            id: "L1Z1X Mindnet.Abilities.Assimilate.Description",
            description: "Description for Faction Ability: Assimilate",
            defaultMessage:
              "When you gain control of a planet, replace each PDS and space dock that is on that planet with a matching unit from your reinforcements.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Abilities.Harrow.Title",
            description: "Title of Faction Ability: Harrow",
            defaultMessage: "Harrow",
          }),
          description: intl.formatMessage({
            id: "L1Z1X Mindnet.Abilities.Harrow.Description",
            description: "Description for Faction Ability: Harrow",
            defaultMessage:
              "At the end of each round of ground combat, your ships in the active system may use their BOMBARDMENT abilities against your opponent's ground forces on the planet.",
          }),
        },
      ],
      colors: {
        Black: 0.7,
        Blue: 0.6,
        Red: 0.6,
      },
      commodities: 2,
      expansion: "BASE",
      id: "L1Z1X Mindnet",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Name",
        description: "Name of Faction: L1Z1X Mindnet",
        defaultMessage: "L1Z1X Mindnet",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Promissories.Cybernetic Enhancements.Title",
            description: "Title of Faction Promissory: Cybernetic Enhancements",
            defaultMessage: "Cybernetic Enhancements",
          }),
          description: intl.formatMessage(
            {
              id: "L1Z1X Mindnet.Promissories.Cybernetic Enhancements.Description",
              description:
                "Description for Faction Promissory: Cybernetic Enhancements",
              defaultMessage:
                "At the start of your turn:{br}Remove 1 token from the L1Z1X player's strategy pool and return it to their reinforcements. Then, place 1 command token from your reinforcements in your strategy pool.{br}Then, return this card to the L1Z1X player.",
            },
            { br: "\n\n" }
          ),
          omega: {
            name: intl.formatMessage({
              id: "L1Z1X Mindnet.Promissories.Cybernetic Enhancements.Omega.Title",
              description:
                "Title of Faction Promissory: Cybernetic Enhancements Ω",
              defaultMessage: "Cybernetic Enhancements Ω",
            }),
            description: intl.formatMessage(
              {
                id: "L1Z1X Mindnet.Promissories.Cybernetic Enhancements.Omega.Description",
                description:
                  "Description for Faction Promissory: Cybernetic Enhancements Ω",
                defaultMessage:
                  "When you gain command tokens during the status phase:{br}Gain 1 additional command token.{br}Then, return this card to the L1Z1X player.",
              },
              { br: "\n\n" }
            ),
            expansion: "CODEX ONE",
          },
        },
      ],
      shortname: intl.formatMessage({
        id: "L1Z1X Mindnet.Shortname",
        description: "Shortened version of Faction name: L1Z1X Mindnet",
        defaultMessage: "L1Z1X",
      }),
      startswith: {
        planets: ["000"],
        techs: ["Neural Motivator", "Plasma Scoring"],
        units: {
          Carrier: 1,
          Dreadnought: 1,
          Fighter: 3,
          Infantry: 5,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "L1Z1X Mindnet.Units.[0.0.1].Description",
            description: "Description for Faction Unit: [0.0.1]",
            defaultMessage:
              "During a space combat, hits produced by this ship and by your dreadnoughts in this system must be assigned to non-fighter ships if able.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Units.[0.0.1].Title",
            description: "Title of Faction Unit: [0.0.1]",
            defaultMessage: "[0.0.1]",
          }),
          stats: {
            cost: 8,
            combat: "5(x2)",
            move: 1,
            capacity: 5,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl), bombardment("8", intl)],
          description: intl.formatMessage({
            id: "L1Z1X Mindnet.Units.Annihilator.Description",
            description: "Description for Faction Unit: Annihilator",
            defaultMessage:
              "While not participating in ground combat, this unit can use its BOMBARDMENT ability on planets in its system as if it were a ship.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Units.Annihilator.Title",
            description: "Title of Faction Unit: Annihilator",
            defaultMessage: "Annihilator",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [sustainDamage(intl), bombardment("5", intl)],
          expansion: "BASE",
          name: intl.formatMessage({
            id: "L1Z1X Mindnet.Units.Super-Dreadnought I.Title",
            description: "Title of Faction Unit: Super-Dreadnought I",
            defaultMessage: "Super-Dreadnought I",
          }),
          stats: {
            cost: 4,
            combat: 5,
            move: 1,
            capacity: 2,
          },
          type: "Dreadnought",
          upgrade: "Super-Dreadnought II",
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
          upgrade: "Crimson Legionnaire I",
        },
      ],
    },
    "Mentak Coalition": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Mentak Coalition.Abilities.Ambush.Title",
            description: "Title of Faction Ability: Ambush",
            defaultMessage: "Ambush",
          }),
          description: intl.formatMessage({
            id: "Mentak Coalition.Abilities.Ambush.Description",
            description: "Description for Faction Ability: Ambush",
            defaultMessage:
              "At the start of a space combat, you may roll 1 die for each of up to 2 of your cruisers or destroyers in the system.  For each result equal to or greater than that ship's combat value, produce 1 hit; your opponent must assign it to 1 of their ships.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Mentak Coalition.Abilities.Pillage.Title",
            description: "Title of Faction Ability: Pillage",
            defaultMessage: "Pillage",
          }),
          description: intl.formatMessage({
            id: "Mentak Coalition.Abilities.Pillage.Description",
            description: "Description for Faction Ability: Pillage",
            defaultMessage:
              "After 1 of your neighbors gains trade goods or resolves a transaction, if they have 3 or more trade goods, you may take 1 of their trade goods or commodities.",
          }),
        },
      ],
      colors: {
        Black: 0.5,
        Orange: 0.95,
        Yellow: 0.45,
      },
      commodities: 2,
      expansion: "BASE",
      id: "Mentak Coalition",
      name: intl.formatMessage({
        id: "Mentak Coalition.Name",
        description: "Name of Faction: Mentak Coalition",
        defaultMessage: "Mentak Coalition",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Mentak Coalition.Promissories.Promise of Protection.Title",
            description: "Title of Faction Promissory: Promise of Protection",
            defaultMessage: "Promise of Protection",
          }),
          description: intl.formatMessage(
            {
              id: "Mentak Coalition.Promissories.Promise of Protection.Description",
              description:
                "Description for Faction Promissory: Promise of Protection",
              defaultMessage:
                "ACTION: Place this card face-up in your play area.{br}While this card is in your play area, the Mentak player cannot use their PILLAGE faction ability against you.{br}If you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Mentak Coalition.Shortname",
        description: "Shortened version of Faction name: Mentak Coalition",
        defaultMessage: "Mentak",
      }),
      startswith: {
        planets: ["Moll Primus"],
        techs: ["Plasma Scoring", "Sarween Tools"],
        units: {
          Carrier: 1,
          Cruiser: 2,
          Fighter: 3,
          Infantry: 4,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Mentak Coalition.Units.Fourth Moon.Description",
            description: "Description for Faction Unit: Fourth Moon",
            defaultMessage:
              "Other players' ships in this system cannot use SUSTAIN DAMAGE.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Mentak Coalition.Units.Fourth Moon.Title",
            description: "Title of Faction Unit: Fourth Moon",
            defaultMessage: "Fourth Moon",
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
            id: "Mentak Coalition.Units.Moll Terminus.Description",
            description: "Description for Faction Unit: Moll Terminus",
            defaultMessage:
              "Other players' ground forces on this planet cannot use SUSTAIN DAMAGE.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Mentak Coalition.Units.Moll Terminus.Title",
            description: "Title of Faction Unit: Moll Terminus",
            defaultMessage: "Moll Terminus",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Naalu Collective": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Naalu Collective.Abilities.Telepathic.Title",
            description: "Title of Faction Ability: Telepathic",
            defaultMessage: "Telepathic",
          }),
          description: intl.formatMessage({
            id: "Naalu Collective.Abilities.Telepathic.Description",
            description: "Description for Faction Ability: Telepathic",
            defaultMessage:
              'At the end of the strategy phase, place the Naalu "0" token on your strategy card; you are first in initiative order.',
          }),
        },
        {
          name: intl.formatMessage({
            id: "Naalu Collective.Abilities.Foresight.Title",
            description: "Title of Faction Ability: Foresight",
            defaultMessage: "Foresight",
          }),
          description: intl.formatMessage({
            id: "Naalu Collective.Abilities.Foresight.Description",
            description: "Description for Faction Ability: Foresight",
            defaultMessage:
              "After another player moves ships into a system that contains 1 or more of your ships, you may place 1 token from your strategy pool in an adjacent system that does not contain another player's ships;  move your ships from the active system into that system.",
          }),
        },
      ],
      colors: {
        Green: 1.15,
        Orange: 0.3,
        Yellow: 0.45,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Naalu Collective",
      name: intl.formatMessage({
        id: "Naalu Collective.Name",
        description: "Name of Faction: Naalu Collective",
        defaultMessage: "Naalu Collective",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Naalu Collective.Promissories.Gift of Prescience.Title",
            description: "Title of Faction Promissory: Gift of Prescience",
            defaultMessage: "Gift of Prescience",
          }),
          description: intl.formatMessage(
            {
              id: "Naalu Collective.Promissories.Gift of Prescience.Description",
              description:
                "Description for Faction Promissory: Gift of Prescience",
              defaultMessage:
                'At the end of the strategy phase:{br}Place this card face-up in your play area and place the Naalu "0" token on your strategy card;  you are first in the initiative order.  The Naalu player cannot use their TELEPATHIC faction ability during this game round.{br}Return this card to the Naalu player at the end of the status phase.',
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Naalu Collective.Shortname",
        description: "Shortened version of Faction name: Naalu Collective",
        defaultMessage: "Naalu",
      }),
      startswith: {
        planets: ["Druaa", "Maaluuk"],
        techs: ["Neural Motivator", "Sarween Tools"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Destroyer: 1,
          Fighter: 3,
          Infantry: 4,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Naalu Collective.Units.Matriarch.Description",
            description: "Description for Faction Unit: Matriarch",
            defaultMessage:
              "During an invasion in this system, you may commit fighters to planets as if they were ground forces. When combat ends, return those units to the space area.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Naalu Collective.Units.Matriarch.Title",
            description: "Title of Faction Unit: Matriarch",
            defaultMessage: "Matriarch",
          }),
          stats: {
            cost: 8,
            combat: "9(x2)",
            move: 1,
            capacity: 6,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Naalu Collective.Units.Iconoclast.Description",
            description: "Description for Faction Unit: Iconoclast",
            defaultMessage:
              "During combat against an opponent who has at least 1 relic fragment, apply +2 to the results of this unit's combat rolls.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Naalu Collective.Units.Iconoclast.Title",
            description: "Title of Faction Unit: Iconoclast",
            defaultMessage: "Iconoclast",
          }),
          omega: {
            name: intl.formatMessage({
              id: "Naalu Collective.Units.Iconoclast.Omega.Title",
              description: "Title of Faction Unit: Iconoclast Ω",
              defaultMessage: "Iconoclast Ω",
            }),
            description: intl.formatMessage({
              id: "Naalu Collective.Units.Iconoclast.Omega.Description",
              description: "Description for Faction Unit: Iconoclast Ω",
              defaultMessage:
                "Other players cannot use ANTI-FIGHTER BARRAGE against your units in this system.",
            }),
            expansion: "CODEX THREE",
          },
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          name: intl.formatMessage({
            id: "Naalu Collective.Units.Hybrid Crystal Fighter I.Title",
            description: "Title of Faction Unit: Hybrid Crystal Fighter I",
            defaultMessage: "Hybrid Crystal Fighter I",
          }),
          expansion: "BASE",
          stats: {
            cost: "1(x2)",
            combat: 8,
          },
          type: "Fighter",
          upgrade: "Hybrid Crystal Fighter II",
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
      colors: {
        Green: 1.6,
        Yellow: 0.3,
      },
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
      ],
    },
    "Nekro Virus": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Nekro Virus.Abilities.Galactic Threat.Title",
            description: "Title of Faction Ability: Galactic Threat",
            defaultMessage: "Galactic Threat",
          }),
          description: intl.formatMessage({
            id: "Nekro Virus.Abilities.Galactic Threat.Description",
            description: "Description for Faction Ability: Galactic Threat",
            defaultMessage:
              "You cannot vote on agendas. Once per agenda phase, after an agenda is revealed, you may predict aloud the outcome of that agenda. If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Nekro Virus.Abilities.Technological Singularity.Title",
            description: "Title of Faction Ability: Technological Singularity",
            defaultMessage: "Technological Singularity",
          }),
          description: intl.formatMessage({
            id: "Nekro Virus.Abilities.Technological Singularity.Description",
            description:
              "Description for Faction Ability: Technological Singularity",
            defaultMessage:
              "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 technology that is owned by that player.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Nekro Virus.Abilities.Propagation.Title",
            description: "Title of Faction Ability: Propagation",
            defaultMessage: "Propagation",
          }),
          description: intl.formatMessage({
            id: "Nekro Virus.Abilities.Propagation.Description",
            description: "Description for Faction Ability: Propagation",
            defaultMessage:
              "You cannot research technology.  When you would research a technology, gain 3 command tokens instead.",
          }),
        },
      ],
      colors: {
        Black: 0.15,
        Red: 1.75,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Nekro Virus",
      name: intl.formatMessage({
        id: "Nekro Virus.Name",
        description: "Name of Faction: Nekro Virus",
        defaultMessage: "Nekro Virus",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Nekro Virus.Promissories.Antivirus.Title",
            description: "Title of Faction Promissory: Antivirus",
            defaultMessage: "Antivirus",
          }),
          description: intl.formatMessage(
            {
              id: "Nekro Virus.Promissories.Antivirus.Description",
              description: "Description for Faction Promissory: Antivirus",
              defaultMessage:
                "At the start of a combat:{br}Place this card face-up in your play area.{br}While this card is in your play area, the Nekro player cannot use their TECHNOLOGICAL SINGULARITY faction ability against you.{br}If you activate a system that contains 1 or more of the Nekro player's units, return this card to the Nekro player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Nekro Virus.Shortname",
        description: "Shortened version of Faction name: Nekro Virus",
        defaultMessage: "Nekro",
      }),
      startswith: {
        planets: ["Mordai II"],
        techs: ["Daxcive Animators"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Dreadnought: 1,
          Fighter: 2,
          Infantry: 2,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Nekro Virus.Units.The Alastor.Description",
            description: "Description for Faction Unit: The Alastor",
            defaultMessage:
              "At the start of a space combat, choose any number of your ground forces in this system to participate in that combat as if they were ships.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Nekro Virus.Units.The Alastor.Title",
            description: "Title of Faction Unit: The Alastor",
            defaultMessage: "The Alastor",
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
            id: "Nekro Virus.Units.Mordred.Description",
            description: "Description for Faction Unit: Mordred",
            defaultMessage:
              'During combat against an opponent who has an "X" or "Y" token on 1 or more of their technologies, apply +2 to the result of each of this unit\'s combat rolls.',
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Nekro Virus.Units.Mordred.Title",
            description: "Title of Faction Unit: Mordred",
            defaultMessage: "Mordred",
          }),
          stats: {
            cost: 2,
            combat: 6,
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
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Nomad.Units.Memoria.Description",
            description: "Description for Faction Unit: Memoria",
            defaultMessage:
              "You may treat this unit as if it were adjacent to systems that contain one or more of your mechs.",
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
    "Sardakk N'orr": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Sardakk N'orr.Abilities.Unrelenting.Title",
            description: "Title of Faction Ability: Unrelenting",
            defaultMessage: "Unrelenting",
          }),
          description: intl.formatMessage({
            id: "Sardakk N'orr.Abilities.Unrelenting.Description",
            description: "Description for Faction Ability: Unrelenting",
            defaultMessage:
              "Apply +1 to the result of each of your unit's combat rolls.",
          }),
        },
      ],
      colors: {
        Black: 1,
        Red: 0.9,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Sardakk N'orr",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Name",
        description: "Name of Faction: Sardakk N'orr",
        defaultMessage: "Sardakk N'orr",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Sardakk N'orr.Promissories.Tekklar Legion.Title",
            description: "Title of Faction Promissory: Tekklar Legion",
            defaultMessage: "Tekklar Legion",
          }),
          description: intl.formatMessage(
            {
              id: "Sardakk N'orr.Promissories.Tekklar Legion.Description",
              description: "Description for Faction Promissory: Tekklar Legion",
              defaultMessage:
                "At the start of an invasion combat:{br}Apply +1 to the result of each of your unit's combat rolls during this combat.  If your opponent is the N'orr player, apply -1 to the result of each of their unit's combat rolls during this combat.{br}Then, return this card to the N'orr player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Sardakk N'orr.Shortname",
        description: "Shortened version of Faction name: Sardakk N'orr",
        defaultMessage: "N'orr",
      }),
      startswith: {
        planets: ["Quinarra", "Tren'lak"],
        techs: [],
        units: {
          Carrier: 2,
          Cruiser: 1,
          Infantry: 5,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Sardakk N'orr.Units.C'Morran N'orr.Description",
            description: "Description for Faction Unit: C'Morran N'orr",
            defaultMessage:
              "Apply +1 to the result of each of your other ship's combat rolls in this system.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Sardakk N'orr.Units.C'Morran N'orr.Title",
            description: "Title of Faction Unit: C'Morran N'orr",
            defaultMessage: "C'Morran N'orr",
          }),
          stats: {
            cost: 8,
            combat: "6(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Sardakk N'orr.Units.Valkyrie Exoskeleton.Description",
            description: "Description for Faction Unit: Valkyrie Exoskeleton",
            defaultMessage:
              "After this unit uses its SUSTAIN DAMAGE ability during ground combat, it produces 1 hit against your opponent's ground forces on this planet.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Sardakk N'orr.Units.Valkyrie Exoskeleton.Title",
            description: "Title of Faction Unit: Valkyrie Exoskeleton",
            defaultMessage: "Valkyrie Exoskeleton",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
        {
          abilities: [sustainDamage(intl), bombardment("4 (x2)", intl)],
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Sardakk N'orr.Units.Exotrireme I.Title",
            description: "Title of Faction Unit: Exotrireme I",
            defaultMessage: "Exotrireme I",
          }),
          stats: {
            cost: 4,
            combat: 5,
            move: 1,
            capacity: 1,
          },
          type: "Dreadnought",
          upgrade: "Exotrireme II",
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
      ],
    },
    "Universities of Jol-Nar": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Fragile.Title",
            description: "Title of Faction Ability: Fragile",
            defaultMessage: "Fragile",
          }),
          description: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Fragile.Description",
            description: "Description for Faction Ability: Fragile",
            defaultMessage:
              "Apply -1 to the result of each of your unit's combat rolls.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Brilliant.Title",
            description: "Title of Faction Ability: Brilliant",
            defaultMessage: "Brilliant",
          }),
          description: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Brilliant.Description",
            description: "Description for Faction Ability: Brilliant",
            defaultMessage:
              'When you spend a command token to resolve the secondary ability of the "Technology" strategy card, you may resolve the primary ability instead.',
          }),
        },
        {
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Analytical.Title",
            description: "Title of Faction Ability: Analytical",
            defaultMessage: "Analytical",
          }),
          description: intl.formatMessage({
            id: "Universities of Jol-Nar.Abilities.Analytical.Description",
            description: "Description for Faction Ability: Analytical",
            defaultMessage:
              "When you research a technology that is not a unit upgrade technology, you may ignore 1 prerequisite.",
          }),
        },
      ],
      colors: {
        Blue: 1.6,
        Purple: 0.3,
      },
      commodities: 4,
      expansion: "BASE",
      id: "Universities of Jol-Nar",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Name",
        description: "Name of Faction: Universities of Jol-Nar",
        defaultMessage: "Universities of Jol-Nar",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Promissories.Research Agreement.Title",
            description: "Title of Faction Promissory: Research Agreement",
            defaultMessage: "Research Agreement",
          }),
          description: intl.formatMessage(
            {
              id: "Universities of Jol-Nar.Promissories.Research Agreement.Description",
              description:
                "Description for Faction Promissory: Research Agreement",
              defaultMessage:
                "After the Jol-Nar player researches a technology that is not a faction technology:{br}Gain that technology.{br}Then, return this card to the Jol-Nar player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Universities of Jol-Nar.Shortname",
        description:
          "Shortened version of Faction name: Universities of Jol-Nar",
        defaultMessage: "Jol-Nar",
      }),
      startswith: {
        planets: ["Jol", "Nar"],
        techs: [
          "Antimass Deflectors",
          "Neural Motivator",
          "Plasma Scoring",
          "Sarween Tools",
        ],
        units: {
          Carrier: 2,
          Dreadnought: 1,
          Fighter: 1,
          Infantry: 2,
          PDS: 2,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Universities of Jol-Nar.Units.J.N.S. Hylarim.Description",
            description: "Description for Faction Unit: J.N.S. Hylarim",
            defaultMessage:
              "When making a combat roll for this ship, each result of 9 or 10, before applying modifiers, produces 2 additional hits.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Units.J.N.S. Hylarim.Title",
            description: "Title of Faction Unit: J.N.S. Hylarim",
            defaultMessage: "J.N.S. Hylarim",
          }),
          stats: {
            cost: 8,
            combat: "6(x2)",
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Universities of Jol-Nar.Units.Shield Paling.Description",
            description: "Description for Faction Unit: Shield Paling",
            defaultMessage:
              "Your infantry on this planet are not affected by your FRAGILE faction ability.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Universities of Jol-Nar.Units.Shield Paling.Title",
            description: "Title of Faction Unit: Shield Paling",
            defaultMessage: "Shield Paling",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
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
      colors: {
        Black: 0.4,
        Magenta: 0.1,
        Red: 1.35,
      },
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
    Winnu: {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Winnu.Abilities.Blood Ties.Title",
            description: "Title of Faction Ability: Blood Ties",
            defaultMessage: "Blood Ties",
          }),
          description: intl.formatMessage({
            id: "Winnu.Abilities.Blood Ties.Description",
            description: "Description for Faction Ability: Blood Ties",
            defaultMessage:
              "You do not have to spend influence to remove the custodians token from Mecatol Rex.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Winnu.Abilities.Reclamation.Title",
            description: "Title of Faction Ability: Reclamation",
            defaultMessage: "Reclamation",
          }),
          description: intl.formatMessage({
            id: "Winnu.Abilities.Reclamation.Description",
            description: "Description for Faction Ability: Reclamation",
            defaultMessage:
              "After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
          }),
        },
      ],
      colors: {
        Orange: 0.75,
        Purple: 0.6,
        Yellow: 0.55,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Winnu",
      name: intl.formatMessage({
        id: "Winnu.Name",
        description: "Name of Faction: Winnu",
        defaultMessage: "Winnu",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Winnu.Promissories.Acquiescence.Title",
            description: "Title of Faction Ability: Acquiescence",
            defaultMessage: "Acquiescence",
          }),
          description: intl.formatMessage(
            {
              id: "Winnu.Promissories.Acquiescence.Description",
              description: "Description for Faction Ability: Acquiescence",
              defaultMessage:
                "At the end of the strategy phase:{br}Exchange 1 of your strategy cards with a strategy card that was chosen by the Winnu player.{br}Then, return this card to the Winnu player.",
            },
            { br: "\n\n" }
          ),
          omega: {
            name: intl.formatMessage({
              id: "Winnu.Promissories.Acquiescence.Omega.Title",
              description: "Title of Faction Ability: Acquiescence Ω",
              defaultMessage: "Acquiescence Ω",
            }),
            description: intl.formatMessage(
              {
                id: "Winnu.Promissories.Acquiescence.Omega.Description",
                description: "Description for Faction Ability: Acquiescence Ω",
                defaultMessage:
                  "When the Winnu player resolves a strategic action:{br}You do not have to spend or place a command token to resolve the secondary ability of that strategy card.{br}Then, return this card to the Winnu player.",
              },
              { br: "\n\n" }
            ),
            expansion: "CODEX ONE",
          },
        },
      ],
      shortname: intl.formatMessage({
        id: "Winnu.Shortname",
        description: "Shortened version of Faction name: Winnu",
        defaultMessage: "Winnu",
      }),
      startswith: {
        choice: {
          options: [
            "AI Development Algorithm",
            "Antimass Deflectors",
            "Dark Energy Tap",
            "Neural Motivator",
            "Plasma Scoring",
            "Psychoarchaeology",
            "Sarween Tools",
            "Scanlink Drone Network",
          ],
          select: 1,
        },
        planets: ["Winnu"],
        units: {
          Carrier: 1,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 2,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Winnu.Units.Salai Sai Corian.Description",
            description: "Description for Faction Unit: Salai Sai Corian",
            defaultMessage:
              "When this unit makes a combat roll, it rolls a number of dice equal to the number of your opponent's non-fighter ships in this system.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Winnu.Units.Salai Sai Corian.Title",
            description: "Title of Faction Unit: Salai Sai Corian",
            defaultMessage: "Salai Sai Corian",
          }),
          stats: {
            cost: 8,
            combat: 7,
            move: 1,
            capacity: 3,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Winnu.Units.Reclaimer.Description",
            description: "Description for Faction Unit: Reclaimer",
            defaultMessage:
              "After you resolve a tactical action where you gained control of this planet, you may place 1 PDS or 1 Space Dock from your reinforcements on this planet.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Winnu.Units.Reclaimer.Title",
            description: "Title of Faction Unit: Reclaimer",
            defaultMessage: "Reclaimer",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Xxcha Kingdom": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Abilities.Peace Accords.Title",
            description: "Title of Faction Ability: Peace Accords",
            defaultMessage: "Peace Accords",
          }),
          description: intl.formatMessage({
            id: "Xxcha Kingdom.Abilities.Peace Accords.Description",
            description: "Description for Faction Ability: Peace Accords",
            defaultMessage:
              'After you resolve the primary or secondary ability of the "Diplomacy" strategy card, you may gain control of 1 planet other than Mecatol Rex that does not contain any units and is in a system that is adjacent to a planet you control.',
          }),
        },
        {
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Abilities.Quash.Title",
            description: "Title of Faction Ability: Quash",
            defaultMessage: "Quash",
          }),
          description: intl.formatMessage({
            id: "Xxcha Kingdom.Abilities.Quash.Description",
            description: "Description for Faction Ability: Quash",
            defaultMessage:
              "When an agenda is revealed, you may spend 1 token from your strategy pool to discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead.",
          }),
        },
      ],
      colors: {
        Blue: 0.8,
        Green: 1.1,
      },
      commodities: 4,
      expansion: "BASE",
      id: "Xxcha Kingdom",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Name",
        description: "Name of Faction: Xxcha Kingdom",
        defaultMessage: "Xxcha Kingdom",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Promissories.Political Favor.Title",
            description: "Title of Faction Promissory: Political Favor",
            defaultMessage: "Political Favor",
          }),
          description: intl.formatMessage(
            {
              id: "Xxcha Kingdom.Promissories.Political Favor.Description",
              description:
                "Description for Faction Promissory: Political Favor",
              defaultMessage:
                "When an agenda is revealed:{br}Remove 1 token from the Xxcha player's strategy pool and return it to their reinforcements.  Then, discard the revealed agenda and reveal 1 agenda from the top of the deck.  Players vote on this agenda instead.{br}Then, return this card to the Xxcha player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Xxcha Kingdom.Shortname",
        description: "Shortened version of Faction name: Xxcha Kingdom",
        defaultMessage: "Xxcha",
      }),
      startswith: {
        planets: ["Archon Ren", "Archon Tau"],
        techs: ["Graviton Laser System"],
        units: {
          Carrier: 1,
          Cruiser: 2,
          Fighter: 3,
          Infantry: 4,
          PDS: 1,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl), spaceCannon("5 (x3)", intl)],
          description: intl.formatMessage({
            id: "Xxcha Kingdom.Units.Loncara Ssodu.Description",
            description: "Description for Faction Unit: Loncara Ssodu",
            defaultMessage:
              "You may use this unit's SPACE CANNON against ships that are in adjacent systems.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Units.Loncara Ssodu.Title",
            description: "Title of Faction Unit: Loncara Ssodu",
            defaultMessage: "Loncara Ssodu",
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
          abilities: [sustainDamage(intl), spaceCannon("8", intl)],
          description: intl.formatMessage({
            id: "Xxcha Kingdom.Units.Indomitus.Description",
            description: "Description for Faction Unit: Indomitus",
            defaultMessage:
              "You may use this unit's SPACE CANNON ability against ships that are in adjacent systems.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Units.Indomitus.Title",
            description: "Title of Faction Unit: Indomitus",
            defaultMessage: "Indomitus",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Yin Brotherhood": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Yin Brotherhood.Abilities.Indoctrination.Title",
            description: "Title of Faction Ability: Indoctrination",
            defaultMessage: "Indoctrination",
          }),
          description: intl.formatMessage({
            id: "Yin Brotherhood.Abilities.Indoctrination.Description",
            description: "Description for Faction Ability: Indoctrination",
            defaultMessage:
              "At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Yin Brotherhood.Abilities.Devotion.Title",
            description: "Title of Faction Ability: Devotion",
            defaultMessage: "Devotion",
          }),
          description: intl.formatMessage({
            id: "Yin Brotherhood.Abilities.Devotion.Description",
            description: "Description for Faction Ability: Devotion",
            defaultMessage:
              "After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent's ships in that system.",
          }),
        },
      ],
      colors: {
        Black: 0.6,
        Purple: 1.05,
        Yellow: 0.25,
      },
      commodities: 2,
      expansion: "BASE",
      id: "Yin Brotherhood",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Name",
        description: "Name of Faction: Yin Brotherhood",
        defaultMessage: "Yin Brotherhood",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Yin Brotherhood.Promissories.Greyfire Mutagen.Title",
            description: "Title of Faction Promissory: Greyfire Mutagen",
            defaultMessage: "Greyfire Mutagen",
          }),
          description: intl.formatMessage(
            {
              id: "Yin Brotherhood.Promissories.Greyfire Mutagen.Description",
              description:
                "Description for Faction Promissory: Greyfire Mutagen",
              defaultMessage:
                "After a system is activated:{br}The Yin player cannot use faction abilities or faction technology during this tactical action.{br}Then, return this card to the Yin player.",
            },
            { br: "\n\n" }
          ),
          omega: {
            name: intl.formatMessage({
              id: "Yin Brotherhood.Promissories.Greyfire Mutagen.Omega.Title",
              description: "Title of Faction Promissory: Greyfire Mutagen Ω",
              defaultMessage: "Greyfire Mutagen Ω",
            }),
            description: intl.formatMessage(
              {
                id: "Yin Brotherhood.Promissories.Greyfire Mutagen.Omega.Description",
                description:
                  "Description for Faction Promissory: Greyfire Mutagen Ω",
                defaultMessage:
                  "At the start of a ground combat against 2 or more ground forces that are not controlled by the Yin player:{br}Replace 1 of your opponent's infantry with 1 infantry from your reinforcements.{br}Then, return this card to the Yin player.",
              },
              { br: "\n\n" }
            ),
            expansion: "CODEX ONE",
          },
        },
      ],
      shortname: intl.formatMessage({
        id: "Yin Brotherhood.Shortname",
        description: "Shortened version of Faction name: Yin Brotherhood",
        defaultMessage: "Yin",
      }),
      startswith: {
        planets: ["Darien"],
        techs: ["Sarween Tools"],
        units: {
          Carrier: 2,
          Destroyer: 1,
          Fighter: 4,
          Infantry: 4,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Yin Brotherhood.Units.Van Hauge.Description",
            description: "Description for Faction Unit: Van Hauge",
            defaultMessage:
              "When this ship is destroyed, destroy all ships in this system.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Units.Van Hauge.Title",
            description: "Title of Faction Unit: Van Hauge",
            defaultMessage: "Van Hauge",
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
            id: "Yin Brotherhood.Units.Moyin's Ashes.Description",
            description: "Description for Faction Unit: Moyin's Ashes",
            defaultMessage:
              "DEPLOY: When you use your INDOCTRINATION faction ability, you may spend 1 additional influence to replace your opponent's unit with 1 mech instead of 1 infantry.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Units.Moyin's Ashes.Title",
            description: "Title of Faction Unit: Moyin's Ashes",
            defaultMessage: "Moyin's Ashes",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    "Yssaril Tribes": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Stall Tactics.Title",
            description: "Title of Faction Ability: Stall Tactics",
            defaultMessage: "Stall Tactics",
          }),
          description: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Stall Tactics.Description",
            description: "Description for Faction Ability: Stall Tactics",
            defaultMessage: "ACTION: Discard 1 action card from your hand.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Scheming.Title",
            description: "Title of Faction Ability: Scheming",
            defaultMessage: "Scheming",
          }),
          description: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Scheming.Description",
            description: "Description for Faction Ability: Scheming",
            defaultMessage:
              "When you draw 1 or more action cards, draw 1 additional action card.  Then, choose and discard 1 action card from your hand.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Crafty.Title",
            description: "Title of Faction Ability: Crafty",
            defaultMessage: "Crafty",
          }),
          description: intl.formatMessage({
            id: "Yssaril Tribes.Abilities.Crafty.Description",
            description: "Description for Faction Ability: Crafty",
            defaultMessage:
              "You can have any number of action cards in your hand.  Game effects cannot prevent you from using this ability.",
          }),
        },
      ],
      colors: {
        Black: 0.1,
        Green: 0.93,
        Red: 0.25,
        Yellow: 0.63,
      },
      commodities: 3,
      expansion: "BASE",
      id: "Yssaril Tribes",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Name",
        description: "Name of Faction: Yssaril Tribes",
        defaultMessage: "Yssaril Tribes",
      }),
      promissories: [
        {
          name: intl.formatMessage({
            id: "Yssaril Tribes.Promissories.Spy Net.Title",
            description: "Title of Faction Promissory: Spy Net",
            defaultMessage: "Spy Net",
          }),
          description: intl.formatMessage(
            {
              id: "Yssaril Tribes.Promissories.Spy Net.Description",
              description: "Description for Faction Promissory: Spy Net",
              defaultMessage:
                "At the start of your turn:{br}Look at the Yssaril player's hand of action cards.  Choose 1 of those cards and add it to your hand.{br}Then, return this card to the Yssaril player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Yssaril Tribes.Shortname",
        description: "Shortened version of Faction name: Yssaril Tribes",
        defaultMessage: "Yssaril",
      }),
      startswith: {
        planets: ["Retillion", "Shalloq"],
        techs: ["Neural Motivator"],
        units: {
          Carrier: 2,
          Cruiser: 1,
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
            id: "Yssaril Tribes.Units.Y'sia Y'ssrila.Description",
            description: "Description for Faction Unit: Y'sia Y'ssrila",
            defaultMessage:
              "This ship can move through systems that contain other player's ships.",
          }),
          expansion: "BASE",
          name: intl.formatMessage({
            id: "Yssaril Tribes.Units.Y'sia Y'ssrila.Title",
            description: "Title of Faction Unit: Y'sia Y'ssrila",
            defaultMessage: "Y'sia Y'ssrila",
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
            id: "Yssaril Tribes.Units.Blackshade Infiltrator.Description",
            description: "Description for Faction Unit: Blackshade Infiltrator",
            defaultMessage:
              "DEPLOY: After you use your STALL TACTICS faction ability, you may place 1 mech on a planet you control.",
          }),
          expansion: "POK",
          name: intl.formatMessage({
            id: "Yssaril Tribes.Units.Blackshade Infiltrator.Title",
            description: "Title of Faction Unit: Blackshade Infiltrator",
            defaultMessage: "Blackshade Infiltrator",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
    ...DISCORDANT_STARS_FACTIONS,
  };
}
