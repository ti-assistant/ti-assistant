import { IntlShape } from "react-intl";
import {
  antiFighterBarrage,
  bombardment,
  planetaryShield,
  production,
  spaceCannon,
  sustainDamage,
} from "../../../src/util/strings";

function buildBaseTech(tech: BaseTech): BaseTech {
  tech.removedIn = "TWILIGHTS FALL";
  return tech;
}

export default function getBaseTechs(
  intl: IntlShape
): Record<BaseGame.TechId, BaseTech> {
  return {
    "Advanced Carrier II": buildBaseTech({
      abilities: [sustainDamage(intl)],
      description: "",
      expansion: "BASE",
      faction: "Federation of Sol",
      id: "Advanced Carrier II",
      name: intl.formatMessage({
        id: "Federation of Sol.Techs.Advanced Carrier II.Title",
        description: "Title of Tech: Advanced Carrier II",
        defaultMessage: "Advanced Carrier II",
      }),
      prereqs: ["BLUE", "BLUE"],
      replaces: "Carrier II",
      stats: {
        capacity: 8,
        combat: 9,
        cost: 3,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Carrier",
    }),
    "Antimass Deflectors": buildBaseTech({
      description: intl.formatMessage(
        {
          id: "Techs.Antimass Deflectors.Description",
          description: "Description for Tech: Antimass Deflectors",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When other players' units use SPACE CANNON against your units, apply -1 to the result of each die roll.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      id: "Antimass Deflectors",
      name: intl.formatMessage({
        id: "Techs.Antimass Deflectors.Title",
        description: "Title of Tech: Antimass Deflectors",
        defaultMessage: "Antimass Deflectors",
      }),
      prereqs: [],
      type: "BLUE",
    }),
    "Assault Cannon": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Assault Cannon.Description",
        description: "Description for Tech: Assault Cannon",
        defaultMessage:
          "At the start of a space combat in a system that contains 3 or more of your non-fighter ships, your opponent must destroy 1 of their non-fighter ships.",
      }),
      expansion: "BASE",
      id: "Assault Cannon",
      name: intl.formatMessage({
        id: "Techs.Assault Cannon.Title",
        description: "Title of Tech: Assault Cannon",
        defaultMessage: "Assault Cannon",
      }),
      prereqs: ["RED", "RED", "RED"],
      type: "RED",
    }),
    Bioplasmosis: buildBaseTech({
      description: intl.formatMessage({
        id: "Arborec.Techs.Bioplasmosis.Description",
        description: "Description for Tech: Bioplasmosis",
        defaultMessage:
          "At the end of the status phase, you may remove any number of your infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems.",
      }),
      expansion: "BASE",
      faction: "Arborec",
      id: "Bioplasmosis",
      name: intl.formatMessage({
        id: "Arborec.Techs.Bioplasmosis.Title",
        description: "Title of Tech: Bioplasmosis",
        defaultMessage: "Bioplasmosis",
      }),
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Carrier II": buildBaseTech({
      abilities: [],
      description: "",
      expansion: "BASE",
      id: "Carrier II",
      name: intl.formatMessage({
        id: "Techs.Carrier II.Title",
        description: "Title of Tech: Carrier II",
        defaultMessage: "Carrier II",
      }),
      prereqs: ["BLUE", "BLUE"],
      stats: {
        capacity: 6,
        combat: 9,
        cost: 3,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Carrier",
    }),
    "Chaos Mapping": buildBaseTech({
      description: intl.formatMessage(
        {
          id: "Clan of Saar.Techs.Chaos Mapping.Description",
          description: "Description for Tech: Chaos Mapping",
          defaultMessage:
            "Other players cannot activate asteroid fields that contain 1 or more of your ships.{br}At the start of your turn during the action phase, you may produce 1 unit in a system that contains at least 1 of your units that has PRODUCTION.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Clan of Saar",
      id: "Chaos Mapping",
      name: intl.formatMessage({
        id: "Clan of Saar.Techs.Chaos Mapping.Title",
        description: "Title of Tech: Chaos Mapping",
        defaultMessage: "Chaos Mapping",
      }),
      prereqs: ["BLUE"],
      type: "BLUE",
    }),
    "Cruiser II": buildBaseTech({
      abilities: [],
      expansion: "BASE",
      id: "Cruiser II",
      name: intl.formatMessage({
        id: "Techs.Cruiser II.Title",
        description: "Title of Tech: Cruiser II",
        defaultMessage: "Cruiser II",
      }),
      prereqs: ["GREEN", "YELLOW", "RED"],
      stats: {
        capacity: 1,
        combat: 6,
        cost: 2,
        move: 3,
      },
      type: "UPGRADE",
      unitType: "Cruiser",
    }),
    "Daxcive Animators": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Daxcive Animators.Description",
        description: "Description for Tech: Daxcive Animators",
        defaultMessage:
          "After you win a ground combat, you may place 1 infantry from your reinforcements on that planet.",
      }),
      expansion: "BASE",
      id: "Daxcive Animators",
      name: intl.formatMessage({
        id: "Techs.Daxcive Animators.Title",
        description: "Title of Tech: Daxcive Animators",
        defaultMessage: "Daxcive Animators",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    }),
    "Destroyer II": buildBaseTech({
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      expansion: "BASE",
      id: "Destroyer II",
      name: intl.formatMessage({
        id: "Techs.Destroyer II.Title",
        description: "Title of Tech: Destroyer II",
        defaultMessage: "Destroyer II",
      }),
      prereqs: ["RED", "RED"],
      stats: {
        combat: 8,
        cost: 1,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Destroyer",
    }),
    "Dimensional Splicer": buildBaseTech({
      description: intl.formatMessage({
        id: "Ghosts of Creuss.Techs.Dimensional Splicer.Description",
        description: "Description for Tech: Dimensional Splicer",
        defaultMessage:
          "At the start of space combat in a system that contains a wormhole and 1 or more of your ships, you may produce 1 hit and assign it to 1 of your opponent's ships.",
      }),
      expansion: "BASE",
      faction: "Ghosts of Creuss",
      id: "Dimensional Splicer",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Techs.Dimensional Splicer.Title",
        description: "Title of Tech: Dimensional Splicer",
        defaultMessage: "Dimensional Splicer",
      }),
      prereqs: ["RED"],
      type: "RED",
    }),
    "Dreadnought II": buildBaseTech({
      abilities: [sustainDamage(intl), bombardment("5", intl)],
      description: intl.formatMessage({
        id: "Techs.Dreadnought II.Description",
        description: "Description for Tech: Dreadnought II",
        defaultMessage:
          '"Direct Hit" cards are no longer effective against this type of ship.',
      }),
      expansion: "BASE",
      id: "Dreadnought II",
      name: intl.formatMessage({
        id: "Techs.Dreadnought II.Title",
        description: "Title of Tech: Dreadnought II",
        defaultMessage: "Dreadnought II",
      }),
      prereqs: ["BLUE", "BLUE", "YELLOW"],
      stats: {
        capacity: 1,
        combat: 5,
        cost: 4,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Dreadnought",
    }),
    "Duranium Armor": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Duranium Armor.Description",
        description: "Description for Tech: Duranium Armor",
        defaultMessage:
          "During each combat round, after you assign hits to your units, repair 1 of your damaged units that did not use SUSTAIN DAMAGE during this combat round.",
      }),
      expansion: "BASE",
      id: "Duranium Armor",
      name: intl.formatMessage({
        id: "Techs.Duranium Armor.Title",
        description: "Title of Tech: Duranium Armor",
        defaultMessage: "Duranium Armor",
      }),
      prereqs: ["RED", "RED"],
      type: "RED",
    }),
    "E-Res Siphons": buildBaseTech({
      description: intl.formatMessage({
        id: "Universities of Jol-Nar.Techs.E-Res Siphons.Description",
        description: "Description for Tech: E-Res Siphons",
        defaultMessage:
          "After another player activates a system that contains 1 or more of your ships, gain 4 trade goods.",
      }),
      expansion: "BASE",
      faction: "Universities of Jol-Nar",
      id: "E-Res Siphons",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Techs.E-Res Siphons.Title",
        description: "Title of Tech: E-Res Siphons",
        defaultMessage: "E-Res Siphons",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Exotrireme II": buildBaseTech({
      abilities: [sustainDamage(intl), bombardment("4 (x2)", intl)],
      description: intl.formatMessage(
        {
          id: "Sardakk N'orr.Techs.Exotrireme II.Description",
          description: "Description for Tech: Exotrireme II",
          defaultMessage:
            'After a round of space combat, you may destroy this unit to destroy up to 2 ships in this system.{br}"Direct Hit" cards are no longer effective against this type of ship.',
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Sardakk N'orr",
      id: "Exotrireme II",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Techs.Exotrireme II.Title",
        description: "Title of Tech: Exotrireme II",
        defaultMessage: "Exotrireme II",
      }),
      prereqs: ["BLUE", "BLUE", "YELLOW"],
      replaces: "Dreadnought II",
      stats: {
        capacity: 1,
        combat: 5,
        cost: 4,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Dreadnought",
    }),
    "Fighter II": buildBaseTech({
      abilities: [],
      description: intl.formatMessage({
        id: "Techs.Fighter II.Description",
        description: "Description for Tech: Fighter II",
        defaultMessage:
          "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool.",
      }),
      expansion: "BASE",
      id: "Fighter II",
      name: intl.formatMessage({
        id: "Techs.Fighter II.Title",
        description: "Title of Tech: Fighter II",
        defaultMessage: "Fighter II",
      }),
      prereqs: ["GREEN", "BLUE"],
      stats: {
        combat: 8,
        cost: "1(x2)",
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Fighter",
    }),
    "Fleet Logistics": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Fleet Logistics.Description",
        description: "Description for Tech: Fleet Logistics",
        defaultMessage:
          "During each of your turns of the action phase, you may perform 2 actions instead of 1.",
      }),
      expansion: "BASE",
      id: "Fleet Logistics",
      name: intl.formatMessage({
        id: "Techs.Fleet Logistics.Title",
        description: "Title of Tech: Fleet Logistics",
        defaultMessage: "Fleet Logistics",
      }),
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    }),
    "Floating Factory II": buildBaseTech({
      abilities: [production("7", intl)],
      description: intl.formatMessage({
        id: "Clan of Saar.Techs.Floating Factory II.Description",
        description: "Description for Tech: Floating Factory II",
        defaultMessage:
          "This unit is placed in the space area instead of on a planet. This unit can move and retreat as if it were a ship. If this unit is blockaded, it is destroyed.",
      }),
      expansion: "BASE",
      faction: "Clan of Saar",
      id: "Floating Factory II",
      name: intl.formatMessage({
        id: "Clan of Saar.Techs.Floating Factory II.Title",
        description: "Title of Tech: Floating Factory II",
        defaultMessage: "Floating Factory II",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      replaces: "Space Dock II",
      stats: {
        capacity: 5,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Space Dock",
    }),
    "Graviton Laser System": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Graviton Laser System.Description",
        description: "Description for Tech: Graviton Laser System",
        defaultMessage:
          "You may exhaust this card before 1 or more of your units uses SPACE CANNON; hits produced by those units must be assigned to non-fighter ships if able.",
      }),
      expansion: "BASE",
      id: "Graviton Laser System",
      name: intl.formatMessage({
        id: "Techs.Graviton Laser System.Title",
        description: "Title of Tech: Graviton Laser System",
        defaultMessage: "Graviton Laser System",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    }),
    "Gravity Drive": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Gravity Drive.Description",
        description: "Description for Tech: Gravity Drive",
        defaultMessage:
          "After you activate a system, apply +1 to the move value of 1 of your ships during this tactical action.",
      }),
      expansion: "BASE",
      id: "Gravity Drive",
      name: intl.formatMessage({
        id: "Techs.Gravity Drive.Title",
        description: "Title of Tech: Gravity Drive",
        defaultMessage: "Gravity Drive",
      }),
      prereqs: ["BLUE"],
      type: "BLUE",
    }),
    "Hegemonic Trade Policy": buildBaseTech({
      description: intl.formatMessage({
        id: "Winnu.Techs.Hegemonic Trade Policy.Description",
        description: "Description for Tech: Hegemonic Trade Policy",
        defaultMessage:
          "Exhaust this card when 1 or more of your units use PRODUCTION; swap the resource and influence values of 1 planet you control until the end of your turn.",
      }),
      expansion: "BASE",
      faction: "Winnu",
      id: "Hegemonic Trade Policy",
      name: intl.formatMessage({
        id: "Winnu.Techs.Hegemonic Trade Policy.Title",
        description: "Title of Tech: Hegemonic Trade Policy",
        defaultMessage: "Hegemonic Trade Policy",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Hybrid Crystal Fighter II": buildBaseTech({
      abilities: [],
      description: intl.formatMessage({
        id: "Naalu Collective.Techs.Hybrid Crystal Fighter II.Description",
        description: "Description for Tech: Hybrid Crystal Fighter II",
        defaultMessage:
          "This unit may move without being transported. Each fighter in excess of your ships' capacity counts as 1/2 of a ship against your fleet pool",
      }),
      expansion: "BASE",
      faction: "Naalu Collective",
      id: "Hybrid Crystal Fighter II",
      name: intl.formatMessage({
        id: "Naalu Collective.Techs.Hybrid Crystal Fighter II.Title",
        description: "Title of Tech: Hybrid Crystal Fighter II",
        defaultMessage: "Hybrid Crystal Fighter II",
      }),
      prereqs: ["GREEN", "BLUE"],
      replaces: "Fighter II",
      stats: {
        combat: 7,
        cost: "1(x2)",
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Fighter",
    }),
    "Hyper Metabolism": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Hyper Metabolism.Description",
        description: "Description for Tech: Hyper Metabolism",
        defaultMessage:
          "During the status phase, gain 3 command tokens instead of 2.",
      }),
      expansion: "BASE",
      id: "Hyper Metabolism",
      name: intl.formatMessage({
        id: "Techs.Hyper Metabolism.Title",
        description: "Title of Tech: Hyper Metabolism",
        defaultMessage: "Hyper Metabolism",
      }),
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Impulse Core": buildBaseTech({
      description: intl.formatMessage({
        id: "Yin Brotherhood.Techs.Impulse Core.Description",
        description: "Description for Tech: Impulse Core",
        defaultMessage:
          "At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit against your opponent's ships; that hit must be assigned by your opponent to 1 of their non-fighter ships if able.",
      }),
      expansion: "BASE",
      faction: "Yin Brotherhood",
      id: "Impulse Core",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Techs.Impulse Core.Title",
        description: "Title of Tech: Impulse Core",
        defaultMessage: "Impulse Core",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Infantry II": buildBaseTech({
      abilities: [],
      description: intl.formatMessage({
        id: "Techs.Infantry II.Description",
        description: "Description for Tech: Infantry II",
        defaultMessage:
          "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
      }),
      expansion: "BASE",
      id: "Infantry II",
      name: intl.formatMessage({
        id: "Techs.Infantry II.Title",
        description: "Title of Tech: Infantry II",
        defaultMessage: "Infantry II",
      }),
      prereqs: ["GREEN", "GREEN"],
      stats: {
        combat: 7,
        cost: "1(x2)",
      },
      type: "UPGRADE",
      unitType: "Infantry",
    }),
    "Inheritance Systems": buildBaseTech({
      description: intl.formatMessage({
        id: "L1Z1X Mindnet.Techs.Inheritance Systems.Description",
        description: "Description for Tech: Inheritance Systems",
        defaultMessage:
          "You may exhaust this card and spend 2 resources when you research a technology; ignore all of that technology's prerequisites.",
      }),
      expansion: "BASE",
      faction: "L1Z1X Mindnet",
      id: "Inheritance Systems",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Techs.Inheritance Systems.Title",
        description: "Title of Tech: Inheritance Systems",
        defaultMessage: "Inheritance Systems",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Instinct Training": buildBaseTech({
      description: intl.formatMessage({
        id: "Xxcha Kingdom.Techs.Instinct Training.Description",
        description: "Description for Tech: Instinct Training",
        defaultMessage:
          "You may exhaust this card and spend 1 token from your strategy pool when another player plays an action card; cancel that action card.",
      }),
      expansion: "BASE",
      faction: "Xxcha Kingdom",
      id: "Instinct Training",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Techs.Instinct Training.Title",
        description: "Title of Tech: Instinct Training",
        defaultMessage: "Instinct Training",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    }),
    "Integrated Economy": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Integrated Economy.Description",
        description: "Description for Tech: Integrated Economy",
        defaultMessage:
          "After you gain control of a planet, you may produce any number of units on that planet that have a combined cost equal to or less than that planet's resource value.",
      }),
      expansion: "BASE",
      id: "Integrated Economy",
      name: intl.formatMessage({
        id: "Techs.Integrated Economy.Title",
        description: "Title of Tech: Integrated Economy",
        defaultMessage: "Integrated Economy",
      }),
      prereqs: ["YELLOW", "YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "L4 Disruptors": buildBaseTech({
      description: intl.formatMessage({
        id: "Barony of Letnev.Techs.L4 Disruptors.Description",
        description: "Description for Tech: L4 Disruptors",
        defaultMessage:
          "During an invasion, units cannot use SPACE CANNON against your units.",
      }),
      expansion: "BASE",
      faction: "Barony of Letnev",
      id: "L4 Disruptors",
      name: intl.formatMessage({
        id: "Barony of Letnev.Techs.L4 Disruptors.Title",
        description: "Title of Tech: L4 Disruptors",
        defaultMessage: "L4 Disruptors",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    }),
    "Lazax Gate Folding": buildBaseTech({
      description: intl.formatMessage(
        {
          id: "Winnu.Techs.Lazax Gate Folding.Description",
          description: "Description for Tech: Lazax Gate Folding",
          defaultMessage:
            "During your tactical actions, if you do not control Mecatol Rex, treat its systems as if it has both an α and β wormhole.{br}ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Winnu",
      id: "Lazax Gate Folding",
      name: intl.formatMessage({
        id: "Winnu.Techs.Lazax Gate Folding.Title",
        description: "Title of Tech: Lazax Gate Folding",
        defaultMessage: "Lazax Gate Folding",
      }),
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    }),
    "Letani Warrior II": buildBaseTech({
      abilities: [production("2", intl)],
      description: intl.formatMessage({
        id: "Arborec.Techs.Letani Warrior II.Description",
        description: "Description for Tech: Letani Warrior II",
        defaultMessage:
          "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
      }),
      expansion: "BASE",
      faction: "Arborec",
      id: "Letani Warrior II",
      name: intl.formatMessage({
        id: "Arborec.Techs.Letani Warrior II.Title",
        description: "Title of Tech: Letani Warrior II",
        defaultMessage: "Letani Warrior II",
      }),
      prereqs: ["GREEN", "GREEN"],
      replaces: "Infantry II",
      stats: {
        combat: 7,
        cost: "1(x2)",
      },
      type: "UPGRADE",
      unitType: "Infantry",
    }),
    "LightWave Deflector": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Light/Wave Deflector.Description",
        description: "Description for Tech: Light/Wave Deflector",
        defaultMessage:
          "Your ships can move through systems that contain other players' ships.",
      }),
      expansion: "BASE",
      id: "LightWave Deflector",
      name: intl.formatMessage({
        id: "Techs.Light/Wave Deflector.Title",
        description: "Title of Tech: Light/Wave Deflector",
        defaultMessage: "Light/Wave Deflector",
      }),
      prereqs: ["BLUE", "BLUE", "BLUE"],
      type: "BLUE",
    }),
    "Magen Defense Grid": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Magen Defense Grid.Description",
        description: "Description for Tech: Magen Defense Grid",
        defaultMessage:
          "You may exhaust this card at the start of a round of ground combat on a planet that contains 1 or more of your units that have PLANETARY SHIELD; your opponent cannot make combat rolls this combat round.",
      }),
      expansion: "BASE",
      id: "Magen Defense Grid",
      name: intl.formatMessage({
        id: "Techs.Magen Defense Grid.Title",
        description: "Title of Tech: Magen Defense Grid",
        defaultMessage: "Magen Defense Grid",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Techs.Magen Defense Grid.Omega.Description",
            description: "Description for Tech: Magen Defense Grid Ω",
            defaultMessage:
              "At the start of ground combat on a planet that contains 1 or more of your structures, you may produce 1 hit and assign it to 1 of your opponent's ground forces.",
          }),
          expansion: "CODEX ONE",
          name: intl.formatMessage({
            id: "Techs.Magen Defense Grid.Omega.Title",
            description: "Title of Tech: Magen Defense Grid Ω",
            defaultMessage: "Magen Defense Grid Ω",
          }),
        },
        {
          description: intl.formatMessage(
            {
              id: "Techs.Magen Defense Grid.Codex Four.Description",
              description: "Description for Tech: Magen Defense Grid (Codex 4)",
              defaultMessage:
                "When any player activates a system that contains 1 or more of your structures, place 1 infantry from your reinforcements with each of those structures.{br}At the start of ground combat on a planet that contains 1 or more of your structures, produce 1 hit and assign it to 1 of your opponent's ground forces.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX FOUR",
          name: intl.formatMessage({
            id: "Techs.Magen Defense Grid.Title",
            description: "Title of Tech: Magen Defense Grid",
            defaultMessage: "Magen Defense Grid",
          }),
        },
      ],
      prereqs: ["RED"],
      type: "RED",
    }),
    "Mageon Implants": buildBaseTech({
      description: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Mageon Implants.Description",
        description: "Description for Tech: Mageon Implants",
        defaultMessage:
          "ACTION: Exhaust this card to look at another player's hand of action cards. Choose 1 of those cards and add it to your hand.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Mageon Implants",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Mageon Implants.Title",
        description: "Title of Tech: Mageon Implants",
        defaultMessage: "Mageon Implants",
      }),
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Magmus Reactor": buildBaseTech({
      description: intl.formatMessage(
        {
          id: "Embers of Muaat.Techs.Magmus Reactor.Description",
          description: "Description for Tech: Magmus Reactor",
          defaultMessage:
            "Your ships can move into supernovas.{br}After 1 or more of your units use PRODUCTION in a system that either contains a war sun or is adjacent to a supernova, gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Magmus Reactor",
      name: intl.formatMessage({
        id: "Embers of Muaat.Techs.Magmus Reactor.Title",
        description: "Title of Tech: Magmus Reactor",
        defaultMessage: "Magmus Reactor",
      }),
      omegas: [
        {
          description: intl.formatMessage(
            {
              id: "Embers of Muaat.Techs.Magmus Reactor.Omega.Description",
              description: "Description for Tech: Magmus Reactor Ω",
              defaultMessage:
                "Your ships can move into supernovas.{br}Each supernova that contains 1 or more of your units gains the PRODUCTION 5 ability as if it were one of your units.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX ONE",
          name: intl.formatMessage({
            id: "Embers of Muaat.Techs.Magmus Reactor.Omega.Title",
            description: "Title of Tech: Magmus Reactor Ω",
            defaultMessage: "Magmus Reactor Ω",
          }),
        },
        {
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Embers of Muaat.Techs.Magmus Reactor.Title",
            description: "Title of Tech: Magmus Reactor",
            defaultMessage: "Magmus Reactor",
          }),
        },
      ],
      prereqs: ["RED", "RED"],
      type: "RED",
    }),
    "Mirror Computing": buildBaseTech({
      description: intl.formatMessage({
        id: "Mentak Coalition.Techs.Mirror Computing.Description",
        description: "Description for Tech: Mirror Computing",
        defaultMessage:
          "When you spend trade goods, each trade good is worth 2 resources or influence instead of 1.",
      }),
      expansion: "BASE",
      faction: "Mentak Coalition",
      id: "Mirror Computing",
      name: intl.formatMessage({
        id: "Mentak Coalition.Techs.Mirror Computing.Title",
        description: "Title of Tech: Mirror Computing",
        defaultMessage: "Mirror Computing",
      }),
      prereqs: ["YELLOW", "YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Neural Motivator": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Neural Motivator.Description",
        description: "Description for Tech: Neural Motivator",
        defaultMessage:
          "During the status phase, draw 2 action cards instead of 1.",
      }),
      expansion: "BASE",
      id: "Neural Motivator",
      name: intl.formatMessage({
        id: "Techs.Neural Motivator.Title",
        description: "Title of Tech: Neural Motivator",
        defaultMessage: "Neural Motivator",
      }),
      prereqs: [],
      type: "GREEN",
    }),
    Neuroglaive: buildBaseTech({
      description: intl.formatMessage({
        id: "Naalu Collective.Techs.Neuroglaive.Description",
        description: "Description for Tech: Neuroglaive",
        defaultMessage:
          "After another player activates a system that contains 1 or more of your ships, that player removes 1 token from their fleet pool and returns it to their reinforcements.",
      }),
      expansion: "BASE",
      faction: "Naalu Collective",
      id: "Neuroglaive",
      name: intl.formatMessage({
        id: "Naalu Collective.Techs.Neuroglaive.Title",
        description: "Title of Tech: Neuroglaive",
        defaultMessage: "Neuroglaive",
      }),
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Non-Euclidean Shielding": buildBaseTech({
      description: intl.formatMessage({
        id: "Barony of Letnev.Techs.Non-Euclidean Shielding.Description",
        description: "Description for Tech: Non-Euclidean Shielding",
        defaultMessage:
          "When 1 of your units uses SUSTAIN DAMAGE, cancel 2 hits instead of 1.",
      }),
      expansion: "BASE",
      faction: "Barony of Letnev",
      id: "Non-Euclidean Shielding",
      name: intl.formatMessage({
        id: "Barony of Letnev.Techs.Non-Euclidean Shielding.Title",
        description: "Title of Tech: Non-Euclidean Shielding",
        defaultMessage: "Non-Euclidean Shielding",
      }),
      prereqs: ["RED", "RED"],
      type: "RED",
    }),
    "Nullification Field": buildBaseTech({
      description: intl.formatMessage({
        id: "Xxcha Kingdom.Techs.Nullification Field.Description",
        description: "Description for Tech: Nullification Field",
        defaultMessage:
          "After another player activates a system that contains 1 or more of your ships, you may exhaust this card and spend 1 token from your strategy pool; immediately end that player's turn.",
      }),
      expansion: "BASE",
      faction: "Xxcha Kingdom",
      id: "Nullification Field",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Techs.Nullification Field.Title",
        description: "Title of Tech: Nullification Field",
        defaultMessage: "Nullification Field",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "PDS II": buildBaseTech({
      abilities: [planetaryShield(intl), spaceCannon("5", intl)],
      description: intl.formatMessage({
        id: "Techs.PDS II.Description",
        description: "Description for Tech: PDS II",
        defaultMessage:
          "You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system.",
      }),
      expansion: "BASE",
      id: "PDS II",
      name: intl.formatMessage({
        id: "Techs.PDS II.Title",
        description: "Title of Tech: PDS II",
        defaultMessage: "PDS II",
      }),
      prereqs: ["RED", "YELLOW"],
      stats: {},
      type: "UPGRADE",
      unitType: "PDS",
    }),
    "Plasma Scoring": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Plasma Scoring.Description",
        description: "Description for Tech: Plasma Scoring",
        defaultMessage:
          "When 1 or more of your units use BOMBARDMENT or SPACE CANNON, 1 of those units may roll 1 additional die.",
      }),
      expansion: "BASE",
      id: "Plasma Scoring",
      name: intl.formatMessage({
        id: "Techs.Plasma Scoring.Title",
        description: "Title of Tech: Plasma Scoring",
        defaultMessage: "Plasma Scoring",
      }),
      prereqs: [],
      type: "RED",
    }),
    "Production Biomes": buildBaseTech({
      description: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Production Biomes.Description",
        description: "Description for Tech: Production Biomes",
        defaultMessage:
          "ACTION: Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods.",
      }),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Production Biomes",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Production Biomes.Title",
        description: "Title of Tech: Production Biomes",
        defaultMessage: "Production Biomes",
      }),
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Prototype War Sun II": buildBaseTech({
      abilities: [sustainDamage(intl), bombardment("3 (x3)", intl)],
      description: intl.formatMessage({
        id: "Embers of Muaat.Techs.Prototype War Sun II.Description",
        description: "Description for Tech: Prototype War Sun II",
        defaultMessage:
          "Other players' units in this system lose PLANETARY SHIELD.",
      }),
      expansion: "BASE",
      faction: "Embers of Muaat",
      id: "Prototype War Sun II",
      name: intl.formatMessage({
        id: "Embers of Muaat.Techs.Prototype War Sun II.Title",
        description: "Title of Tech: Prototype War Sun II",
        defaultMessage: "Prototype War Sun II",
      }),
      prereqs: ["RED", "RED", "RED", "YELLOW"],
      replaces: "War Sun",
      stats: {
        capacity: 6,
        combat: "3(x3)",
        cost: 10,
        move: 3,
      },
      type: "UPGRADE",
      unitType: "War Sun",
    }),
    "Quantum Datahub Node": buildBaseTech({
      description: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Quantum Datahub Node.Description",
        description: "Description for Tech: Quantum Datahub Node",
        defaultMessage:
          "At the end of the strategy phase, you may spend 1 token from your strategy pool and give another player 3 of your trade goods. If you do, give 1 of your strategy cards to that player and take 1 of their strategy cards.",
      }),
      expansion: "BASE",
      faction: "Emirates of Hacan",
      id: "Quantum Datahub Node",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Techs.Quantum Datahub Node.Title",
        description: "Title of Tech: Quantum Datahub Node",
        defaultMessage: "Quantum Datahub Node",
      }),
      prereqs: ["YELLOW", "YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Salvage Operations": buildBaseTech({
      description: intl.formatMessage({
        id: "Mentak Coalition.Techs.Salvage Operations.Description",
        description: "Description for Tech: Salvage Operations",
        defaultMessage:
          "After you win or lose a space combat, gain 1 trade good; if you won the combat you may also produce 1 ship in that system of any ship type that was destroyed during the combat.",
      }),
      expansion: "BASE",
      faction: "Mentak Coalition",
      id: "Salvage Operations",
      name: intl.formatMessage({
        id: "Mentak Coalition.Techs.Salvage Operations.Title",
        description: "Title of Tech: Salvage Operations",
        defaultMessage: "Salvage Operations",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Sarween Tools": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Sarween Tools.Description",
        description: "Description for Tech: Sarween Tools",
        defaultMessage:
          "When 1 or more of your units use PRODUCTION, reduce the combined cost of the produced units by 1.",
      }),
      expansion: "BASE",
      id: "Sarween Tools",
      name: intl.formatMessage({
        id: "Techs.Sarween Tools.Title",
        description: "Title of Tech: Sarween Tools",
        defaultMessage: "Sarween Tools",
      }),
      prereqs: [],
      type: "YELLOW",
    }),
    "Space Dock II": buildBaseTech({
      abilities: [production("X", intl)],
      description: intl.formatMessage(
        {
          id: "Techs.Space Dock II.Description",
          description: "Description for Tech: Space Dock II",
          defaultMessage:
            "This unit's PRODUCTION value is equal to 4 more than the resource value of this planet.{br}Up to 3 fighters in this system do not count against your ships' capacity.",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      id: "Space Dock II",
      name: intl.formatMessage({
        id: "Techs.Space Dock II.Title",
        description: "Title of Tech: Space Dock II",
        defaultMessage: "Space Dock II",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      stats: {},
      type: "UPGRADE",
      unitType: "Space Dock",
    }),
    "Spacial Conduit Cylinder": buildBaseTech({
      description: intl.formatMessage({
        id: "Universities of Jol-Nar.Techs.Spacial Conduit Cylinder.Description",
        description: "Description for Tech: Spacial Conduit Cylinder",
        defaultMessage:
          "You may exhaust this card after you activate a system that contains 1 or more of your units; that system is adjacent to all other systems that contain 1 or more of your units during this activation.",
      }),
      expansion: "BASE",
      faction: "Universities of Jol-Nar",
      id: "Spacial Conduit Cylinder",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Techs.Spacial Conduit Cylinder.Title",
        description: "Title of Tech: Spacial Conduit Cylinder",
        defaultMessage: "Spacial Conduit Cylinder",
      }),
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    }),
    "Spec Ops II": buildBaseTech({
      abilities: [],
      description: intl.formatMessage({
        id: "Federation of Sol.Techs.Spec Ops II.Description",
        description: "Description for Tech: Spec Ops II",
        defaultMessage:
          "After this unit is destroyed, roll 1 die. If the result is 5 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
      }),
      expansion: "BASE",
      faction: "Federation of Sol",
      id: "Spec Ops II",
      name: intl.formatMessage({
        id: "Federation of Sol.Techs.Spec Ops II.Title",
        description: "Title of Tech: Spec Ops II",
        defaultMessage: "Spec Ops II",
      }),
      prereqs: ["GREEN", "GREEN"],
      replaces: "Infantry II",
      stats: {
        combat: 6,
        cost: "1(x2)",
      },
      type: "UPGRADE",
      unitType: "Infantry",
    }),
    "Super-Dreadnought II": buildBaseTech({
      abilities: [sustainDamage(intl), bombardment("4", intl)],
      description: intl.formatMessage({
        id: "L1Z1X Mindnet.Techs.Super-Dreadnought II.Description",
        description: "Description for Tech: Super-Dreadnought II",
        defaultMessage:
          '"Direct Hit" cards are no longer effective against this type of ship.',
      }),
      expansion: "BASE",
      faction: "L1Z1X Mindnet",
      id: "Super-Dreadnought II",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Techs.Super-Dreadnought II.Title",
        description: "Title of Tech: Super-Dreadnought II",
        defaultMessage: "Super-Dreadnought II",
      }),
      prereqs: ["BLUE", "BLUE", "YELLOW"],
      replaces: "Dreadnought II",
      stats: {
        capacity: 2,
        combat: 4,
        cost: 4,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Dreadnought",
    }),
    "Transit Diodes": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.Transit Diodes.Description",
        description: "Description for Tech: Transit Diodes",
        defaultMessage:
          "You may exhaust this card at the start of your turn during the action phase; remove up to 4 of your ground forces from the game board and place them on 1 or more planets you control.",
      }),
      expansion: "BASE",
      id: "Transit Diodes",
      name: intl.formatMessage({
        id: "Techs.Transit Diodes.Title",
        description: "Title of Tech: Transit Diodes",
        defaultMessage: "Transit Diodes",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    }),
    "Transparasteel Plating": buildBaseTech({
      description: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Transparasteel Plating.Description",
        description: "Description for Tech: Transparasteel Plating",
        defaultMessage:
          "During your turn of the action phase, players that have passed cannot play action cards.",
      }),
      expansion: "BASE",
      faction: "Yssaril Tribes",
      id: "Transparasteel Plating",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Techs.Transparasteel Plating.Title",
        description: "Title of Tech: Transparasteel Plating",
        defaultMessage: "Transparasteel Plating",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    }),
    "Valkyrie Particle Weave": buildBaseTech({
      description: intl.formatMessage({
        id: "Sardakk N'orr.Techs.Valkyrie Particle Weave.Description",
        description: "Description for Tech: Valkyrie Particle Weave",
        defaultMessage:
          "After making combat rolls during a round of ground combat, if your opponent produced 1 or more hits, you produce 1 additional hit.",
      }),
      expansion: "BASE",
      faction: "Sardakk N'orr",
      id: "Valkyrie Particle Weave",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Techs.Valkyrie Particle Weave.Title",
        description: "Title of Tech: Valkyrie Particle Weave",
        defaultMessage: "Valkyrie Particle Weave",
      }),
      prereqs: ["RED", "RED"],
      type: "RED",
    }),
    "War Sun": buildBaseTech({
      abilities: [sustainDamage(intl), bombardment("3 (x3)", intl)],
      description: intl.formatMessage({
        id: "Techs.War Sun.Description",
        description: "Description for Tech: War Sun",
        defaultMessage:
          "Other players' units in this system lose PLANETARY SHIELD.",
      }),
      expansion: "BASE",
      id: "War Sun",
      name: intl.formatMessage({
        id: "Techs.War Sun.Title",
        description: "Title of Tech: War Sun",
        defaultMessage: "War Sun",
      }),
      prereqs: ["YELLOW", "RED", "RED", "RED"],
      stats: {
        capacity: 6,
        combat: "3(x3)",
        cost: 12,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "War Sun",
    }),
    "Wormhole Generator": buildBaseTech({
      description: intl.formatMessage({
        id: "Ghosts of Creuss.Techs.Wormhole Generator.Description",
        description: "Description for Tech: Wormhole Generator",
        defaultMessage:
          "At the start of the status phase, place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.",
      }),
      expansion: "BASE",
      faction: "Ghosts of Creuss",
      id: "Wormhole Generator",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Techs.Wormhole Generator.Title",
        description: "Title of Tech: Wormhole Generator",
        defaultMessage: "Wormhole Generator",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Techs.Wormhole Generator.Omega.Description",
            description: "Description for Tech: Wormhole Generator Ω",
            defaultMessage:
              "ACTION: Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.",
          }),
          expansion: "CODEX ONE",
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Techs.Wormhole Generator.Omega.Title",
            description: "Title of Tech: Wormhole Generator Ω",
            defaultMessage: "Wormhole Generator Ω",
          }),
        },
        {
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Techs.Wormhole Generator.Title",
            description: "Title of Tech: Wormhole Generator",
            defaultMessage: "Wormhole Generator",
          }),
        },
      ],
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    }),
    "X-89 Bacterial Weapon": buildBaseTech({
      description: intl.formatMessage({
        id: "Techs.X-89 Bacterial Weapon.Description",
        description: "Description for Tech: X-89 Bacterial Weapon",
        defaultMessage:
          "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet.",
      }),
      expansion: "BASE",
      id: "X-89 Bacterial Weapon",
      name: intl.formatMessage({
        id: "Techs.X-89 Bacterial Weapon.Title",
        description: "Title of Tech: X-89 Bacterial Weapon",
        defaultMessage: "X-89 Bacterial Weapon",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Techs.X-89 Bacterial Weapon.Omega.Description",
            description: "Description for Tech: X-89 Bacterial Weapon Ω",
            defaultMessage:
              "After 1 or more of your units use BOMBARDMENT against a planet, if at least 1 of your opponent's infantry was destroyed, you may destroy all of your opponent's infantry on that planet.",
          }),
          expansion: "CODEX ONE",
          name: intl.formatMessage({
            id: "Techs.X-89 Bacterial Weapon.Omega.Tech",
            description: "Title of Tech: X-89 Bacterial Weapon Ω",
            defaultMessage: "X-89 Bacterial Weapon Ω",
          }),
        },
        {
          description: intl.formatMessage(
            {
              id: "Techs.X-89 Bacterial Weapon.Codex Four.Description",
              description:
                "Description for Tech: X-89 Bacterial Weapon (Codex 4)",
              defaultMessage:
                "Double the hits produced by your units' BOMBARDMENT and ground combat rolls.{br}Exhaust each planet you use BOMBARDMENT against.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX FOUR",
          name: intl.formatMessage({
            id: "Techs.X-89 Bacterial Weapon.Tech",
            description: "Title of Tech: X-89 Bacterial Weapon",
            defaultMessage: "X-89 Bacterial Weapon",
          }),
        },
      ],
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    }),
    "Yin Spinner": buildBaseTech({
      description: intl.formatMessage({
        id: "Yin Brotherhood.Techs.Yin Spinner.Description",
        description: "Description for Tech: Yin Spinner",
        defaultMessage:
          "After 1 or more of your units use PRODUCTION, place 1 infantry from your reinforcements on a planet you control in that system.",
      }),
      expansion: "BASE",
      faction: "Yin Brotherhood",
      id: "Yin Spinner",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Techs.Yin Spinner.Title",
        description: "Title of Tech: Yin Spinner",
        defaultMessage: "Yin Spinner",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Yin Brotherhood.Techs.Yin Spinner.Omega.Description",
            description: "Description for Tech: Yin Spinner Ω",
            defaultMessage:
              "After you produce units, place up to 2 infantry from your reinforcements on any planet you control or in any space area that contains 1 or more of your ships.",
          }),
          expansion: "CODEX ONE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Techs.Yin Spinner.Omega.Title",
            description: "Title of Tech: Yin Spinner Ω",
            defaultMessage: "Yin Spinner Ω",
          }),
        },
        {
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Techs.Yin Spinner.Title",
            description: "Title of Tech: Yin Spinner",
            defaultMessage: "Yin Spinner",
          }),
        },
      ],
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    }),
  };
}
