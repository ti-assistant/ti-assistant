import { BaseLeader } from "../../../src/util/api/components";

export const DISCORDANT_STARS_LEADERS: Record<
  DiscordantStars.LeaderId,
  BaseLeader
> = {
  // Augurs of Ilyxum
  Atropha: {
    abilityName: "Woven Fate",
    description:
      "Draw 3 objective cards from 1 of the public objective decks; choose up to 1 of those cards to replace an objective card on a player's faction sheet, and return the others to the bottom of their corresponding decks. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    name: "Atropha",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Bentor Conglomerate
  // "COO Mgur": {
  //   description:
  //     "Exhaust this card and choose 1 player. For each Fragment token on your faction sheet, that player gains 1 commodity. For each commodity they would gain in excess of their commodity value, they gain 1 trade good instead.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Bentor Conglomerate",
  //   name: "C.O.O. Mgur",
  //   timing: "COMPONENT_ACTION",
  //   type: "AGENT",
  // },
  // "CEO Ken Tucc": {
  //   abilityName: "Primordial Data Core",
  //   description:
  //     "Purge this card to explore each planet you control in any order.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Bentor Conglomerate",
  //   name: "C.E.O. Ken Tucc",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Berserkers of Kjalengard
  // "Ygegnad The Thunder": {
  //   abilityName: "For Eternal Glory",
  //   description:
  //     "For each system that contains a Glory token, remove up to 1 command token in or adjacent to that system from the game board and gain 1 command token, if able. Then, purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Berserkers of Kjalengard",
  //   name: "Ygegnad, The Thunder",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Blex Pestilence
  // Speygh: {
  //   abilityName: "Galactic Blight",
  //   description:
  //     "Attach this card to 1 of your strategy cards. Its initiative value is 9.\n\nNon-Blex Players may only resolve 1 clause of this strategy card's primary ability and must spend 1 additional command token from their strategy pool to resolve the secondary ability of this strategy card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Blex Pestilence",
  //   name: "Speygh",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Cheiran Hordes
  // "Thakt Clqua": {
  //   abilityName: "Biomass Event",
  //   description:
  //     "Gather units from your reinforcements up to equal to your starting units. Place these units, in any combination, in the space area of any systems that contain 1 of your structures and no other players’ ships, or on planets you control. Then, purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Cheiran Hordes",
  //   name: "Thakt Clqua",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Florzen Profiteers
  "Banua Gowen": {
    abilityName: "Shady Acquisitions",
    description:
      "Place 2 fighters from your reinforcements in each system that contains 1 or more planets you control and no other player's ships. Then, you may remove 1 attachment from any planet in a non-home system that contains 1 or more of your ships and attach it to 1 planet in your home system. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    name: "Banua Gowen",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Free Systems Compact
  "Count Otto Pmay": {
    abilityName: "Freedom or Death",
    description:
      "Ready a non-home planet other than Mecatol Rex that you control, remove all units on that planet and attach this card to it.\n\nUnits cannot be committed to, produced on, or placed on this planet.",
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    name: "Count Otto P'may",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Ghemina Raiders
  Korela: {
    abilityName: "Fear and Ash",
    description:
      "Purge this card to destroy all units on a non-home planet other than Mecatol Rex that is adjacent to a system that contains 1 of your flagships.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Korela",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  Kantrus: {
    abilityName: "Alleged Birthright",
    description:
      "Purge this card to choose 1 non-home planet other than Mecatol Rex that does not contain another player's units and is adjacent to a system that contains 1 of your flagships; gain control of that planet. Then, ready that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Kantrus",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Ghoti Wayfarers
  // Nmenmede: {
  //   abilityName: "The Ghoti Arise",
  //   description:
  //     "For each system that contains 1 or more of your ships, you may replace 1 of your non-fighter ships in that system with a ship from your reinforcements that has a cost value of up to 2 greater than the cost value of that ship. Then, purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Ghoti Wayfarers",
  //   name: "Nmenmede",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Gledge Union
  // Gorthrim: {
  //   abilityName: "World Shapers",
  //   description:
  //     "Reveal cards from any non-frontier exploration decks until you reveal up to 3 attachments, if able; attach those cards to any planets you control of the corresponding planet type, and discard the rest. Then, purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Gledge Union",
  //   name: "Gorthrim",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Glimmer of Mortheus
  Bayan: {
    abilityName: "Two by Two",
    description:
      "Purge this card to choose 1 ship you control in each system; for each of those units, you may place 1 unit of that type from your reinforcements in the space area of that unit's system, if able.",
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    name: "Bayan",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Kollecc Society
  "Dorrahn Griphyn": {
    abilityName: "Stealth Expedition",
    description:
      "Draw a number of relic cards up to an amount equal to the number of players in the game, choose 1 to gain, and return the rest to the relic deck. Then, shuffle that deck and purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    name: "Dorrahn Griphyn",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Monks of Kolume
  // "Disciple Fran": {
  //   description:
  //     "Exhaust this card to allow a player to redistribute 1 of their command tokens on their command sheet.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   name: "Disciple Fran",
  //   timing: "COMPONENT_ACTION",
  //   type: "AGENT",
  // },
  // "Wonell the Silent": {
  //   abilityName: "Streaks in the Night",
  //   description:
  //     "Place this card near the game board; during this game round, after you perform a component action, you may use 1 of your unit's SPACE CANNON against ships in or adjacent to that unit's system, without rolling additional dice.\n\nAt the end of this game round, purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   name: "Wonell the Silent",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Lanefir Remnants
  // "The Venerable": {
  //   abilityName: "Broken Legacy",
  //   description:
  //     "Draw and reveal up to 3 relics. For each relic that started this action in a player's play area, gain 1 command token. Then, you may swap that relic for 1 of the revealed relics or relics in a player's play area. Then, shuffle the remaining relics into the relic deck and purge this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Lanefir Remnants",
  //   name: "The Venerable",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Li-Zho Dynasty
  "Khaz-Rin Li-Zho": {
    abilityName: "Closing Moves",
    description:
      "You may attach, or remove and attach, each Trap card to a planet on the game board; place a total of up to 12 fighters in any number of systems that contain 1 or more planets with Trap attachments and no other player's ships. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    name: "Khaz-Rin Li-Zho",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // L'tokk Khrask
  "Vehl-Tikar": {
    abilityName: "Worlds Awaken",
    description:
      "Purge this card to choose up to 4 planets; exhaust or ready each of those planets.",
    expansion: "DISCORDANT STARS",
    faction: "L'tokk Khrask",
    name: "Vehl-Tikar",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Mirveda Protectorate
  "Wrath Machina": {
    abilityName: "Peace at Last",
    description:
      "Place up to 3 PDS units from your reinforcements on planets you control and choose 1 system; your PDS units may use their SPACE CANNON on ships in that system, and BOMBARDMENT against units on 1 planet in that system. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    name: "Wrath Machina",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Myko-Mentori
  "Coprinus Comatus": {
    abilityName: "Rise Again",
    description:
      "When another player’s hero would be purged, instead attach it to this card. You may resolve this card as if it instead had the text of any single hero attached to this card. When this card is purged, purge each of its attachments as well.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    name: "Coprinus Comatus",
    timing: "MULTIPLE",
    type: "HERO",
  },
  // Nivyn Star Kings
  "Kwill Drakkon": {
    abilityName: "Eye of the Abyss",
    description:
      "Each unit on the game board with SUSTAIN DAMAGE, other than your mechs, becomes damaged, if able. Place this card near the game board; you may treat each unit you control as adjacent to the system that contains the Wound token until the end of this game round. At the end of this game round, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Nivyn Star Kings",
    name: "Kwill Drakkon",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Olradin League
  "Pahn Silverfur": {
    abilityName: "Change of Plans",
    description:
      "Place 1 infantry from your reinforcements on each planet you control; you may choose and flip 1 policy card. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    name: "Olradin League",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Savages of Cymiae
  "The Voice United": {
    abilityName: "Symphony of Agony",
    description:
      "Draw and reveal a number of action cards from the action card deck equal to 1 more than the number of players in the game, give 1 to each other player in the game and keep the rest; each other player must discard 1 action card. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    name: "The Voice United",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Shipwrights of Axis
  "Demi-Queen Mdcksssk": {
    abilityName: "Galactic Field Test",
    description:
      "Purge this card and give 1 or more Axis Order cards in your play area to 1 or more other players; for each Axis Order card you give to another player, you may force that player to give you 1 promissory note from their hand.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Demi-Queen Mdcksssk",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Shipmonger Zsknck": {
    description:
      "Exhaust this card to choose 1 player; that player may place 1 cruiser or 1 destroyer from their reinforcements in a system that contains their ships.\n\nThen, if you chose another player, gain 2 commodities.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Shipmonger Zsknck",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  // Vaden Banking Clans
  "Putriv Sirvonsk": {
    abilityName: "Debts Come Due",
    description:
      "For each control token that belongs to another player on your faction sheet, you may return that token. If you do, that player must give you 1 of their trade goods, 2 of their commodities, or 1 promissory note from their hand, if able. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    name: "Putriv Sirvonsk",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Veldyr Sovereignty
  "Auberon Elyrin": {
    abilityName: "A New Dawn",
    description:
      "For each planet that has a Branch Office attachment, you may gain 1 unit upgrade technology of the same unit type as 1 owned by the player that controls that planet. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    name: "Auberon Elyrin",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Zealots of Rhodun
  "Saint Binal": {
    abilityName: "Forgotten Sorcery",
    description:
      "Place this card and up to 3 non-faction technologies near the game board, you gain those technologies. At the start of the next strategy phase, purge all but 1 of those technologies and this card.",
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    name: "Saint Binal",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
};
