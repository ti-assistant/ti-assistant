// NOTE: Currently only has leaders that get used as component actions.

import { DISCORDANT_STARS_LEADERS } from "./discordantstars/leaders";

export const BASE_LEADERS: Record<LeaderId, BaseLeader> = {
  "2RAM": {
    description:
      "Units that have PLANETARY SHIELD do not prevent you from using BOMBARDMENT.",
    expansion: "POK",
    faction: "L1Z1X Mindnet",
    name: "2RAM",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 4 dreadnoughts on the Board.",
  },
  Acamar: {
    description:
      "After a player moves ships into a system that does not contain any planets:\n\nYou may exhaust this card; that player gains 1 command token.",
    expansion: "POK",
    faction: "Empyrean",
    name: "Acamar",
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "Adjudicator Ba'al": {
    abilityName: "NOVA SEED",
    description:
      "After you move a war sun into a non-home system other than Mecatol Rex:\n\nYou may destroy all other players' units in that system and replace that system tile with the Muaat supernova tile. If you do, purge this card and each planet card that corresponds to the replaced system tile.",
    expansion: "POK",
    faction: "Embers of Muaat",
    name: "Adjudicator Ba'al",
    timing: "TACTICAL_ACTION",
    type: "HERO",
  },
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
  "Artuno the Betrayer": {
    description:
      "When you gain trade goods from the supply:\n\nYou may exhaust this card to place an equal number of trade goods on this card. When this card readies, gain the trade goods on this card.",
    expansion: "POK",
    faction: "Nomad",
    name: "Artuno the Betrayer",
    timing: "OTHER",
    type: "AGENT",
  },
  "Berekar Berekon": {
    description:
      "When 1 or more of a player's units use PRODUCTION:\n\nYou may exhaust this card to reduce the combined cost of the produced units by 2.",
    expansion: "POK",
    faction: "Winnu",
    name: "Berekar Berekon",
    timing: "OTHER",
    type: "AGENT",
  },
  "Brother Milor": {
    description:
      "After a player's destroyer or cruiser is destroyed:\n\nYou may exhaust this card; if you do, that player may place up to 2 fighters from their reinforcements in that unit's system.",
    expansion: "POK",
    faction: "Yin Brotherhood",
    name: "Brother Milor",
    omega: {
      description:
        "After a player's unit is destroyed:\n\nYou may exhaust this card to allow that player to place 2 fighters in the destroyed unit's system if it was a ship, or 2 infantry on its planet if it was a ground force.",
      expansion: "CODEX THREE",
      name: "Brother Milor Ω",
    },
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "Brother Omar": {
    description:
      "This card satisfies a green technology prerequisite.\n\nYou may produce 1 additional infantry for their cost. These infantry do not count against your production limit.",
    expansion: "POK",
    faction: "Yin Brotherhood",
    name: "Brother Omar",
    omega: {
      description:
        "This card satisfies a green technology prerequisite.\n\nWhen you research a technology owned by another player, you may return 1 of your infantry to reinforcements to ignore its prerequisites.",
      expansion: "CODEX THREE",
      name: "Brother Omar Ω",
      unlock: "Use one of your faction abilities.",
    },
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Use your INDOCTRINATION faction ability.",
  },
  "Captain Mendosa": {
    description:
      "After a player activates a system:\n\nYou may exhaust this card to increase the move value of 1 of that player's ships to match the move value of the ship on the game board that has the highest move value.",
    expansion: "POK",
    faction: "Clan of Saar",
    name: "Captain Mendosa",
    timing: "OTHER",
    type: "AGENT",
  },
  "Carth of Golden Sands": {
    description:
      "During the action phase:\n\nYou may exhaust this card to gain 2 commodities or replenish another player's commodities.",
    expansion: "POK",
    faction: "Emirates of Hacan",
    name: "Carth of Golden Sands",
    timing: "OTHER",
    type: "AGENT",
  },
  "Claire Gibson": {
    description:
      "At the start of a ground combat on a planet you control:\n\nYou may place 1 infantry from your reinforcements on that planet.",
    expansion: "POK",
    faction: "Federation of Sol",
    name: "Claire Gibson",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Control planets that have a combined total of at least 12 resources.",
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
  "Dart and Tai": {
    description:
      "After you gain control of a planet that was controlled by another player:\n\nYou may explore that planet.",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Dart and Tai",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 3 mechs in 3 systems",
  },
  "Dirzuga Rophal": {
    description:
      "After another player activates a system that contains 1 or more of your units that have PRODUCTION:\n\nYou may produce 1 unit in that system.",
    expansion: "POK",
    faction: "Arborec",
    name: "Dirzuga Rophal",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 12 ground forces on planets you control.",
  },
  "Doctor Sucaban": {
    description:
      "When a player spends resources to research:\n\nYou may exhaust this card to allow that player to remove any number of their infantry from the game board. For each unit removed, reduce the resources spent by 1.",
    expansion: "POK",
    faction: "Universities of Jol-Nar",
    name: "Doctor Sucaban",
    timing: "OTHER",
    type: "AGENT",
  },
  "Elder Qanoj": {
    description:
      "Each planet you exhaust to cast votes provides 1 additional vote. Game effects cannot prevent you from voting on an agenda.",
    expansion: "POK",
    faction: "Xxcha Kingdom",
    name: "Elder Qanoj",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Control planets that have a combined value of at least 12 influence.",
  },
  "Emissary Taivra": {
    description:
      "After a player activates a system that contains a non-delta wormhole:\n\nYou may exhaust this card; if you do, that system is adjacent to all other systems that contain a wormhole during this tactical action.",
    expansion: "POK",
    faction: "Ghosts of Creuss",
    name: "Emissary Taivra",
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "Evelyn Delouis": {
    description:
      "At the start of a ground combat round:\n\nYou may exhaust this card to choose 1 ground force in the active system; that ground force rolls 1 additional die during that combat round.",
    expansion: "POK",
    faction: "Federation of Sol",
    name: "Evelyn Delouis",
    timing: "OTHER",
    type: "AGENT",
  },
  "Field Marshal Mercer": {
    description:
      "At the end of a player's turn:\n\nYou may exhaust this card to allow that player to remove up to 2 of their ground forces from the game board and place them on planets they control in the active system.",
    expansion: "POK",
    faction: "Nomad",
    name: "Field Marshal Mercer",
    timing: "OTHER",
    type: "AGENT",
  },
  "Garv and Gunn": {
    description:
      "At the end of a player's turn:\n\nYou may exhaust this card to allow that player to explore 1 of their planets.",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Garv and Gunn",
    timing: "OTHER",
    type: "AGENT",
  },
  "G'hom Sek'kus": {
    description:
      'During the "Commit Ground Forces" step:\n\nYou can commit up to 1 ground force from each planet in the active system and each planet in adjacent systems that do not contain 1 of your command tokens.',
    expansion: "POK",
    faction: "Sardakk N'orr",
    name: "G'hom Sek'kus",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Control 5 planets in non-home systems.",
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
  "Gila the Silvertongue": {
    description:
      "When you cast votes:\n\nYou may spend any number of trade goods; cast 2 additional votes for each trade good spent.",
    expansion: "POK",
    faction: "Emirates of Hacan",
    name: "Gila the Silvertongue",
    timing: "AGENDA_PHASE",
    type: "COMMANDER",
    unlock: "Have 10 trade goods",
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
  "Harrugh Gefhara": {
    abilityName: "GALACTIC SECURITIES NET",
    description:
      "When 1 or more of your units use PRODUCTION:\n\nYou may reduce the cost of each of your units to 0 during this use of PRODUCTION. If you do, purge this card.",
    expansion: "POK",
    faction: "Emirates of Hacan",
    name: "Harrugh Gefhara",
    timing: "OTHER",
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
  I48S: {
    description:
      "After a player activates a system:\n\nYou may exhaust this card to allow that player to replace 1 of their infantry in the active system with 1 mech from their reinforcements.",
    expansion: "POK",
    faction: "L1Z1X Mindnet",
    name: "I48S",
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "Il Na Viroset": {
    description:
      "During your tactical actions, you can activate systems that contain your command tokens. If you do, return both command tokens to your reinforcements and end your turn.",
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    name: "Il Na Viroset",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 2 other factions' command tokens in your fleet pool.",
  },
  "Ipswitch Loose Cannon": {
    abilityName: "SLEEPER CELL",
    description:
      "At the start of space combat that you are participating in:\n\nYou may purge this card; if you do, for each other player's ship that is destroyed during this combat, place 1 ship of that type from your reinforcements in the active system.",
    expansion: "POK",
    faction: "Mentak Coalition",
    name: "Ipswitch, Loose Cannon",
    timing: "TACTICAL_ACTION",
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
  "Jae Mir Kan": {
    description:
      "When you would spend a command token during the secondary ability of a strategic action:\n\nYou may exhaust this card to remove 1 of the active player's command tokens from the board and use it instead.",
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    name: "Jae Mir Kan",
    timing: "OTHER",
    type: "AGENT",
  },
  "Kuuasi Aun Jalatai": {
    abilityName: "OVERWING ZETA",
    description:
      "At the start of a round of space combat in a system that contains a planet you control: Place your flagship and up to a total of 2 cruisers and/or destroyers from your reinforcements in the active system.\n\nThen, purge this card.",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Kuuasi Aun Jalatai",
    subFaction: "Argent Flight",
    timing: "TACTICAL_ACTION",
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
      "ACTION: Produce any number of units in any number of systems that contain 1 or more of your ground forces\n\nThen, purge this card",
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
  "M'aban": {
    description:
      "You may produce 1 additional fighter for their cost; these additional units do not count against your production limit.",
    expansion: "POK",
    faction: "Naalu Collective",
    name: "M'aban",
    omega: {
      description:
        "At any time:\n\nYou may look at your neighbours' hand of promissory notes and the top and bottom card of the agenda deck.",
      expansion: "CODEX THREE",
      name: "M'aban Ω",
      unlock: "Have ground forces in or adjacent to the Mecatol Rex system.",
    },
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 12 fighters on the game board.",
  },
  Magmus: {
    description:
      "After you spend a token from your strategy pool:\n\nYou may gain 1 trade good.",
    expansion: "POK",
    faction: "Embers of Muaat",
    name: "Magmus",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Produce a War Sun.",
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
      "ACTION: Move any number of your ships from any systems to any number of other systems that contain 1 of your command tokens and no other players' ships\n\nThen, purge this card",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Mirik Aun Sissiri",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  "Navarch Feng": {
    description: "You can produce your flagship without spending resources.",
    expansion: "POK",
    faction: "Nomad",
    name: "Navarch Feng",
    timing: "OTHER",
    type: "COMMANDER",
    unlock: "Have 1 scored secret objective.",
  },
  "Nekro Acidos": {
    description: "After you gain a technology:\n\nYou may draw 1 action card.",
    expansion: "POK",
    faction: "Nekro Virus",
    name: "Nekro Acidos",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      'Own 3 technologies. A "Valefar Assimilator" technology counts only if its X or Y token is on a technology.',
  },
  "Nekro Malleon": {
    description:
      "During the action phase:\n\nYou may exhaust this card to choose a player; that player may discard 1 action card or spend 1 command token from their command sheet to gain 2 trade goods.",
    expansion: "POK",
    faction: "Nekro Virus",
    name: "Nekro Malleon",
    timing: "OTHER",
    type: "AGENT",
  },
  "Odlynn Myrr": {
    abilityName: "OPERATION ARCHON",
    description:
      "After an agenda is revealed:\n\nYou may cast up to 6 additional votes on this agenda. Predict aloud an outcome for this agenda. For each player that votes for another outcome, gain 1 trade good and 1 command token.\n\nThen, purge this card.",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Odlynn Myrr",
    subFaction: "Xxcha Kingdom",
    timing: "AGENDA_PHASE",
    type: "HERO",
  },
  "Rickar Rickani": {
    description:
      "During combat: Apply +2 to the result of each of your unit's combat rolls in the Mecatol Rex system, your home system, and each system that contains a legendary planet.",
    expansion: "POK",
    faction: "Winnu",
    name: "Rickar Rickani",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Control Mecatol Rex or enter into a combat in the Mecatol Rex system.",
  },
  "Rear Admiral Farran": {
    description:
      "After 1 of your units uses SUSTAIN DAMAGE:\n\nYou may gain 1 trade good.",
    expansion: "POK",
    faction: "Barony of Letnev",
    name: "Rear Admiral Farran",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 5 non-fighter ships in 1 system.",
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
  "Rowl Sarrig": {
    description:
      "When you produce fighters or infantry:\n\nYou may place each of those units at any of your space docks that are not blockaded.",
    expansion: "POK",
    faction: "Clan of Saar",
    name: "Rowl Sarrig",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 3 space docks on the game board.",
  },
  "Sai Seravus": {
    description:
      "After your ships move:\n\nFor each ship that has a capacity value and moved through 1 or more wormholes, you may place 1 fighter from your reinforcements with that ship if you have unused capacity in the active system.",
    expansion: "POK",
    faction: "Ghosts of Creuss",
    name: "Sai Seravus",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have units in 3 systems that contain alpha or beta wormholes.",
  },
  "Sh'val Harbinger": {
    abilityName: "TEKKLAR CONDITIONING",
    description:
      'After you move ships into the active system:\n\nYou may skip directly to the "Commit Ground Forces" step. If you do, after you commit ground forces to land on planets, purge this card and return each of your ships in the active system to your reinforcements.',
    expansion: "POK",
    faction: "Sardakk N'orr",
    name: "Sh'val, Harbinger",
    timing: "TACTICAL_ACTION",
    type: "HERO",
  },
  "So Ata": {
    description:
      "After another player activates a system that contains your units:\n\nYou may look at that player's action cards, promissory notes, or secret objectives.",
    expansion: "POK",
    faction: "Yssaril Tribes",
    name: "So Ata",
    timing: "OTHER",
    type: "COMMANDER",
    unlock: "Have 7 action cards.",
  },
  "S'Ula Mentarion": {
    description:
      "After you win a space combat:\n\nYou may force your opponent to give you 1 promissory note from their hand.",
    expansion: "POK",
    faction: "Mentak Coalition",
    name: "S'Ula Mentarion",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 4 cruisers on the game board.",
  },
  "Suffi An": {
    description:
      "After the PILLAGE faction ability is used against another player:\n\nYou may exhaust this card; if you do, you and that player each draw 1 action card.",
    expansion: "POK",
    faction: "Mentak Coalition",
    name: "Suffi An",
    timing: "OTHER",
    type: "AGENT",
  },
  "Suffi An (Council)": {
    description:
      "After you perform a component action:\n\nYou may perform an additional action.",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Suffi An",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Spend 1 trade good after you play an action card that has a component action.",
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
  "Ta Zern": {
    description:
      "After you roll dice for a unit ability:\n\nYou may reroll any of those dice.",
    expansion: "POK",
    faction: "Universities of Jol-Nar",
    name: "Ta Zern",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Own 8 technologies.",
  },
  Tellurian: {
    description:
      "When a hit is produced against a unit:\n\nYou may exhaust this card to cancel that hit.",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Tellurian",
    timing: "OTHER",
    type: "AGENT",
  },
  "That Which Molds Flesh": {
    description:
      "When you produce fighter or infantry units:\n\nUp to 2 of those units do not count against your PRODUCTION limit.",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "That Which Molds Flesh",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have units in 3 Gravity Rifts.",
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
  "The Oracle": {
    abilityName: "C-RADIUM GEOMETRY",
    description:
      "At the end of the status phase:\n\nYou may force each other player to give you 1 promissory note from their hand. If you do, purge this card.",
    expansion: "POK",
    faction: "Naalu Collective",
    name: "The Oracle",
    timing: "STATUS_PHASE_END",
    type: "HERO",
  },
  "The Stillness of Stars": {
    description:
      "After another player replenishes commodities:\n\nYou may exhaust this card to convert their commodities to trade goods and capture 1 unit from their reinforcements that has a cost equal to or lower than their commodity value.",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "The Stillness of Stars",
    timing: "OTHER",
    type: "AGENT",
  },
  "The Thundarian": {
    description:
      'After the "Roll Dice" step of combat:\n\nYou may exhaust this card. If you do, hits are not assigned to either players\' units. Return to the start of this combat round\'s "Roll Dice" step',
    expansion: "POK",
    faction: "Nomad",
    name: "The Thundarian",
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "T'ro": {
    description:
      "At the end of a player's tactical action:\n\nYou may exhaust this card; if you do, that player may place 2 infantry from their reinforcements on a planet they control in the active system.",
    expansion: "POK",
    faction: "Sardakk N'orr",
    name: "T'ro",
    timing: "TACTICAL_ACTION",
    type: "AGENT",
  },
  "Trrakan Aun Zulok": {
    description:
      "When 1 or more of your units make a roll for a unit ability:\n\nYou may choose 1 of those units to roll 1 additional die.",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Trrakan Aun Zulok",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have 6 units that have ANTI-FIGHTER BARRAGE, SPACE CANNON or BOMBARDMENT on the game board.",
  },
  "Trillossa Aun Mirik": {
    description:
      "When a player produces ground forces in a system:\n\nYou may exhaust this card; that player may place those units on any planets they control in that system and any adjacent systems.",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Trillossa Aun Mirik",
    timing: "OTHER",
    type: "AGENT",
  },
  Tungstantus: {
    description:
      "When 1 or more of your units use PRODUCTION:\n\nYou may gain 1 trade good.",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Tungstantus",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 5 structures on the game board.",
  },
  "Ul the Progenitor": {
    abilityName: "GEOFORM",
    description:
      "ACTION: Ready Elysium and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNON 5 (x3) ability as if it were a unit",
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
  "Viscount Unlenn": {
    description:
      "At the start of a Space Combat round:\n\nYou may exhaust this card to choose 1 ship in the active system. That ship rolls 1 additional die during this combat round.",
    expansion: "POK",
    faction: "Barony of Letnev",
    name: "Viscount Unlenn",
    timing: "OTHER",
    type: "AGENT",
  },
  "Xander Alexin Victori III": {
    description:
      "At any time:\n\nYou may exhaust this card to allow any player to spend commodities as if they were trade goods.",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Xander Alexin Victori III",
    timing: "OTHER",
    type: "AGENT",
  },
  Xuange: {
    description:
      "After another player moves ships into a system that contains 1 of your command tokens:\n\nYou may return that token to your reinforcements.",
    expansion: "POK",
    faction: "Empyrean",
    name: "Xuange",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Be neighbors with all other players.",
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
      "After an agenda is revealed:\n\nYou may exhaust this card to look at the top card of the agenda deck. Then, you may show that card to 1 other player",
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
