// NOTE: Currently only has leaders that get used as component actions.

import { BaseLeader } from "../../src/util/api/components";
import { DISCORDANT_STARS_LEADERS } from "./discordantstars/leaders";

export type LeaderId =
  | "Airo Shir Aur"
  | "Ahk-Syl Siven"
  | "Conservator Procyon"
  | "Dannel of the Tenth"
  | "Darktalon Treilla"
  | "Ggrocuto Rinn"
  | "Gurno Aggero"
  | "Harka Leeds"
  | "Hesh and Prit"
  | "It Feeds on Carrion"
  | "Jace X 4th Air Legion"
  | "Kyver Blade and Key"
  | "Letani Miasmiala"
  | "Letani Ospha"
  | "Mathis Mathinus"
  | "Mirik Aun Sissiri"
  | "Riftwalker Meian"
  | "Rin The Master's Legacy"
  | "Ssruu"
  | "The Helmsman"
  | "Ul the Progenitor"
  | "Umbat"
  | "UNITDSGNFLAYESH"
  | "Xxekir Grom"
  | "Z'eu"
  | DiscordantStars.LeaderId;

export const BASE_LEADERS: Record<LeaderId, BaseLeader> = {
  "Airo Shir Aur": {
    abilityName: "BENEDICTION",
    description:
      "Move all units in the space area of any system to an adjacent system that contains a different player's ships. Space Combat is resolved in that system; neither player can retreat or resolve abilities that would move their ships\n\nThen, purge this card",
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    name: "Airo Shir Aur",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Ahk-Syl Siven": {
    abilityName: "PROBABILITY MATRIX",
    description:
      "Place this card near the game board; your flagship and units it transports can move out of systems that contain your command tokens during this game round\n\nAt the end of that game round, purge this card",
    expansion: "POK",
    faction: "Nomad",
    name: "Ahk-Syl Siven",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Conservator Procyon": {
    abilityName: "MULTIVERSE SHIFT",
    description:
      "Place 1 frontier token in each system that does not contain any planets and does not already have a frontier token. Then, explore each frontier token that is in a system that contains 1 or more of your ships\n\nThen, purge this card",
    expansion: "POK",
    faction: "Empyrean",
    name: "Conservator Procyon",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Dannel of the Tenth": {
    abilityName: "SPINNER OVERDRIVE",
    description:
      "For each planet that contains any number of your infantry, either ready that planet or place an equal number of infantry from your reinforcements on that planet\n\nThen, purge this card",
    expansion: "POK",
    faction: "Yin Brotherhood",
    name: "Dannel of the Tenth",
    omega: {
      abilityName: "QUANTUM DISSEMINATION Ω",
      description:
        "Commit up to 3 infantry from your reinforcements to any non-home planets and resolve invasions on those planets; players cannot use SPACE CANNON against those units\n\nThen, purge this card",
      expansion: "CODEX THREE",
      name: "Dannel of the Tenth Ω",
    },
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Darktalon Treilla": {
    abilityName: "DARK MATTER AFFINITY",
    description:
      "Place this card near the game board; the number of non-fighter ships you can have in systems is not limited by laws or by the number of command tokens in your fleet pool during this game round\n\nAt the end of that game round, purge this card",
    expansion: "POK",
    faction: "Barony of Letnev",
    name: "Darktalon Treilla",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Ggrocuto Rinn": {
    description:
      "Exhaust this card to ready any planet; if that planet is in a system that is adjacent to a planet you control, you may remove 1 infantry from that planet and return it to its reinforcements",
    expansion: "POK",
    faction: "Xxcha Kingdom",
    name: "Ggrocuto Rinn",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  "Gurno Aggero": {
    abilityName: "ARMAGEDDON RELAY",
    description:
      "Choose 1 system that is adjacent to 1 of your space docks. Destroy all other player's infantry and fighters in that system\n\nThen, purge this card",
    expansion: "POK",
    faction: "Clan of Saar",
    name: "Gurno Aggero",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Harka Leeds": {
    abilityName: "ERWAN'S COVENANT",
    description:
      "Reveal cards from the action card deck until you reveal 3 action cards that have component actions. Draw those cards and shuffle the rest back into the action card deck\n\nThen, purge this card",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Harka Leeds",
    subFaction: "Mentak Coalition",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Hesh and Prit": {
    abilityName: "PERFECT SYNTHESIS",
    description:
      "Gain 1 relic and perform the secondary ability of up to 2 readied or unchosen strategy cards; during this action, spend command tokens from your reinforcements instead of your strategy pool\n\nThen, purge this card",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Hesh and Prit",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "It Feeds on Carrion": {
    abilityName: "DIMENSIONAL ANCHOR",
    description:
      "Each other player rolls a die for each of their non-fighter ships that are in or adjacent to a system that contains a dimensional tear; on a 1-3, capture that unit. If this causes a player's ground forces or fighters to be removed, also capture those units\n\nThen, purge this card",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "It Feeds on Carrion",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Jace X 4th Air Legion": {
    abilityName: "HELIO COMMAND ARRAY",
    description:
      "Remove each of your command tokens from the game board and return them to your reinforcements\n\nThen, purge this card",
    expansion: "POK",
    faction: "Federation of Sol",
    name: "Jace X. 4th Air Legion",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Kyver Blade and Key": {
    abilityName: "GUILD OF SPIES",
    description:
      "Each other player shows you 1 action card from their hand. For each player, you may either take that card or force that player to discard 3 random action cards from their hand\n\nThen, purge this card",
    expansion: "POK",
    faction: "Yssaril Tribes",
    name: "Kyver, Blade and Key",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Letani Miasmiala": {
    abilityName: "ULTRASONIC EMITTER",
    description:
      "Produce any number of units in any number of systems that contain 1 or more of your ground forces\n\nThen, purge this card",
    expansion: "POK",
    faction: "Arborec",
    name: "Letani Miasmiala",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Letani Ospha": {
    description:
      "Exhaust this card and choose a player's non-fighter ship; that player may replace that ship with one from their reinforcements that costs up to 2 more than the replaced ship",
    expansion: "POK",
    faction: "Arborec",
    name: "Letani Ospha",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  "Mathis Mathinus": {
    abilityName: "IMPERIAL SEAL",
    description:
      "Perform the primary ability of any strategy card. Then, choose any number of other players. Those players may perform the secondary ability of that strategy card\n\nThen, purge this card",
    expansion: "POK",
    faction: "Winnu",
    name: "Mathis Mathinus",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Mirik Aun Sissiri": {
    abilityName: "HELIX PROTOCOL",
    description:
      "Move any number of your ships from any systems to any number of other systems that contain 1 of your command tokens and no other players' ships\n\nThen, purge this card",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Mirik Aun Sissiri",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Rin The Master's Legacy": {
    abilityName: "GENETIC MEMORY",
    description:
      "For each non-unit upgrade technology you own, you may replace that technology with any technology of the same color from the deck\n\nThen, purge this card",
    expansion: "POK",
    faction: "Universities of Jol-Nar",
    name: "Rin, The Master's Legacy",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Riftwalker Meian": {
    abilityName: "SINGULARITY REACTOR",
    description:
      "Swap the positions of any 2 systems that contain wormholes or your units, other than the Creuss system and the Wormhole Nexus\n\nThen, purge this card",
    expansion: "POK",
    faction: "Ghosts of Creuss",
    name: "Riftwalker Meian",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  Ssruu: {
    description:
      "This card has the text ability of each other player's agent, even if that agent is exhausted",
    expansion: "POK",
    faction: "Yssaril Tribes",
    name: "Ssruu",
    timing: "MULTIPLE",
    type: "AGENT",
  },
  "The Helmsman": {
    abilityName: "DARK SPACE NAVIGATION",
    description:
      "Choose 1 system that does not contain other players' ships; you may move your flagship and any number of your dreadnoughts from other systems into the chosen system\n\nThen, purge this card",
    expansion: "POK",
    faction: "L1Z1X Mindnet",
    name: "The Helmsman",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Ul the Progenitor": {
    abilityName: "GEOFORM",
    description:
      "Ready Elysium and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNON 5 (x3) ability as if it were a unit",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Ul the Progenitor",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  Umbat: {
    description:
      "Exhaust this card to choose a player; that player may produce up to 2 units that each have a cost of 4 or less in a system that contains one of their war suns or their flagship",
    expansion: "POK",
    faction: "Embers of Muaat",
    name: "Umbat",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  UNITDSGNFLAYESH: {
    abilityName: "POLYMORPHIC ALGORITHM",
    description:
      "Choose a planet that has a technology specialty in a system that contains your units. Destroy any other player's units on that planet. Gain trade goods equal to that planet's combined resource and influence values and gain 1 technology that matches the specialty of that planet\n\nThen, purge this card",
    expansion: "POK",
    faction: "Nekro Virus",
    name: "UNIT.DSGN.FLAYESH",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Xxekir Grom": {
    abilityName: "POLITICAL DATA NEXUS",
    description:
      "You may discard 1 law from play. Look at the top 5 cards of the agenda deck. Choose 2 to reveal, and resolve each as if you had cast 1 vote for an outcome of your choice; discard the rest. Other players cannot resolve abilities during this action\n\nThen, purge this card",
    expansion: "POK",
    faction: "Xxcha Kingdom",
    name: "Xxekir Grom",
    omega: {
      abilityName: "POLITICAL DATA NEXUS Ω",
      description:
        "When you exhaust planets, combine the values of their resources and influence. Treat the combined value as if it were both resources and influence",
      expansion: "CODEX THREE",
      name: "Xxekir Grom Ω",
      timing: "PASSIVE",
    },
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Z'eu": {
    description:
      "After an agenda is revealed: You may exhaust this card to look at the top card of the agenda deck. Then, you may show that card to 1 other player",
    expansion: "POK",
    faction: "Naalu Collective",
    name: "Z'eu",
    omega: {
      description:
        "Exhaust this card and choose a player; that player may perform a tactical action in a non-home system without placing a command token; that system still counts as being activated",
      expansion: "CODEX THREE",
      name: "Z'eu Ω",
      timing: "COMPONENT_ACTION",
    },
    timing: "AGENDA_PHASE",
    type: "AGENT",
  },
  ...DISCORDANT_STARS_LEADERS,
};
