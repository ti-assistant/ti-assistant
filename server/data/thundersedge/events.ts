import { IntlShape } from "react-intl";

export default function getThundersEdgeEvents(
  intl: IntlShape
): Record<ThundersEdge.EventId, TIEvent> {
  return {
    "Advent of the War Sun": {
      description: intl.formatMessage(
        {
          id: "Events.Advent of the War Sun.Description",
          description: "Description of Event: Advent of the War Sun",
          defaultMessage:
            "At the end of setup, all players other than the Embers of Muaat player gain the War Sun unit upgrade technology.{br}The Embers of Muaat player purges their faction-specific promissory note, unlocks their commander, and places 1 additional War Sun in their home system.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Advent of the War Sun",
      name: intl.formatMessage({
        id: "Events.Advent of the War Sun.Title",
        description: "Title of Event: Advent of the War Sun",
        defaultMessage: "Advent of the War Sun",
      }),
    },
    "Age of Fighters": {
      description: intl.formatMessage(
        {
          id: "Events.Age of Fighters.Description",
          description: "Description of Event: Age of Fighters",
          defaultMessage:
            "During setup, all players gain the Fighter II unit upgrade technology; the Naalu Collective player gains Hybrid Crystal Fighter II technology instead.{br}Fighters that count against your fleet pool have CAPACITY value of 1; fighters cannot transport other fighters.{br}Non-fighter ships are purged when they are destroyed.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Age of Fighters",
      name: intl.formatMessage({
        id: "Events.Age of Fighters.Title",
        description: "Title of Event: Age of Fighters",
        defaultMessage: "Age of Fighters",
      }),
    },
    "Call of the Void": {
      description: intl.formatMessage(
        {
          id: "Events.Call of the Void.Description",
          description: "Description for Event: Call of the Void",
          defaultMessage:
            "After you move 1 or more units into the active system, if that system is in The Fracture, gain 1 command token.{br}When you activate a system in The Fracture, apply +1 to the move values of each of your ships.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Call of the Void",
      name: intl.formatMessage({
        id: "Events.Call of the Void.Title",
        description: "Title of Event: Call of the Void",
        defaultMessage: "Call of the Void",
      }),
    },
    "Civilized Society": {
      description: intl.formatMessage(
        {
          id: "Events.Civilized Society.Description",
          description: "Description for Event: Civilized Society",
          defaultMessage:
            "During setup, turn all public objectives faceup.{br}There is no limit to the number of public objectives a player may score during the status phase.{br}The game does not immediately end when a player reaches the required number of victory points; instead, it ends at the end of that round's status phase, and the player with the most victory points wins. In the case of a tie, the tied players total the influence values of their controlled planets and their unspent trade goods; the player or players with the highest total win the game.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Civilized Society",
      name: intl.formatMessage({
        id: "Events.Civilized Society.Title",
        description: "Title of Event: Civilized Society",
        defaultMessage: "Civilized Society",
      }),
    },
    "Conventions of War Abandoned": {
      description: intl.formatMessage(
        {
          id: "Events.Conventions of War Abandoned.Description",
          description: "Description of Event: Conventions of War Abandoned",
          defaultMessage:
            "Each hit produced by BOMBARDMENT rolls destroys 3 units instead of 1.{br}Players that have the X-89 BACTERIAL WEAPON technology can perform the following action:{br}ACTION: Exhaust X-89 BACTERIAL WEAPON to choose 1 planet in a system that contains 1 of your units that has BOMBARDMENT; purge its planet card and all attachments or legendary planet ability cards associated with it.{br}You are eliminated if all of your home system's planet cards are purged.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Conventions of War Abandoned",
      name: intl.formatMessage({
        id: "Events.Conventions of War Abandoned.Title",
        description: "Title of Event: Conventions of War Abandoned",
        defaultMessage: "Conventions of War Abandoned",
      }),
    },
    "Cosmic Phenomenae": {
      description: intl.formatMessage(
        {
          id: "Events.Cosmic Phenomenae.Description",
          description: "Description of Event: Cosmic Phenomenae",
          defaultMessage:
            "Anomalies are adjusted as follows:{br}Nebulae: The defender applies +3 to each of their ship's combat rolls in the nebula instead.{nl}Asteroid Fields: Fighters without a move value do not participate in space combat in asteroid fields.{nl}Supernovas: Units with PRODUCTION in or adjacent to supernovas have their PRODUCTION values increased by 1.{nl}Gravity Rifts: You may apply an additional +1 to the MOVE values of any of your ships moving out of gravity rifts; if you do, those ships are removed on a roll of 5 or lower.{nl}Entropic Scar: Systems that contain entropic scars are adjacent to each other.",
        },
        { nl: "\n", br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Cosmic Phenomenae",
      name: intl.formatMessage({
        id: "Events.Cosmic Phenomenae.Title",
        description: "Title of Event: Cosmic Phenomenae",
        defaultMessage: "Cosmic Phenomenae",
      }),
    },
    "Cultural Exchange Program": {
      description: intl.formatMessage(
        {
          id: "Events.Cultural Exchange Program.Description",
          description: "Description of Event: Cultural Exchange Program",
          defaultMessage:
            'At the end of setup, shuffle the reference cards that correspond to each faction in play. Each player draws 1 of those cards and takes all leaders that correspond to that faction. They belong to that player for the remainder of the game. Then, each player unlocks their commander.{br}The Obsidian/Firmament player does not participate in the Cultural Exchange Program. Instead, they begin the game with "The Obsidian" relic.',
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Cultural Exchange Program",
      name: intl.formatMessage({
        id: "Events.Cultural Exchange Program.Title",
        description: "Title of Event: Cultural Exchange Program",
        defaultMessage: "Cultural Exchange Program",
      }),
    },
    "Dangerous Wilds": {
      description: intl.formatMessage(
        {
          id: "Events.Dangerous Wilds.Description",
          description: "Description for Event: Dangerous Wilds",
          defaultMessage:
            "During setup, place neutral infantry on each hazardous planet equal to that planet's resource value.{br}At the end of each round, for each hazardous planet that is not controlled, replenish any neutral units that were destroyed during the game round.{br}When a player gains control of a hazardous planet from the planet deck, they may research 1 technology; they may ignore a number of that technology's prerequisites equal to the planet's resource value.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Dangerous Wilds",
      name: intl.formatMessage({
        id: "Events.Dangerous Wilds.Title",
        description: "Title of Event: Dangerous Wilds",
        defaultMessage: "Dangerous Wilds",
      }),
    },
    "Hidden Agenda": {
      description: intl.formatMessage(
        {
          id: "Events.Hidden Agenda.Description",
          description: "Description of Event: Hidden Agenda",
          defaultMessage:
            "During the agenda phase, only the speaker can talk; all other players must remain silent except when declaring action cards. Transactions cannot be performed during this phase.{br}When voting, players secretly and simultaneously write their desired outcome and number of votes and pass them to the speaker. After all players have voted, the speaker secretly tallies the results and reveals only the totals to the other players; the speaker reveals who voted for which outcome only when required to resolve the outcome.{br}The Argent Flight's votes are public and are known before the other players vote.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Hidden Agenda",
      name: intl.formatMessage({
        id: "Events.Hidden Agenda.Title",
        description: "Title of Event: Hidden Agenda",
        defaultMessage: "Hidden Agenda",
      }),
    },
    "Mercenaries for Hire": {
      description: intl.formatMessage(
        {
          id: "Events.Mercenaries for Hire.Description",
          description: "Description of Event: Mercenaries for Hire",
          defaultMessage:
            "At the start of the game, shuffle the alliance cards that correspond to the factions not in play and place them in the common play area with the cards fronts faceup; this is the mercenary deck.{br}All players can perform the following action:{br}ACTION: Spend 3 trade goods to gain the top card of the mercenary deck and place it in your play area.{br}Players can use the abilities of the mercenaries in their play area.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Mercenaries for Hire",
      name: intl.formatMessage({
        id: "Events.Mercenaries for Hire.Title",
        description: "Title of Event: Mercenaries for Hire",
        defaultMessage: "Mercenaries for Hire",
      }),
    },
    "Monuments to the Ages": {
      description: intl.formatMessage(
        {
          id: "Events.Monuments to the Ages.Description",
          description: "Description of Event: Monuments to the Ages",
          defaultMessage:
            "When you would place a structure on a non-home planet, you may spend 5 trade goods to place a neutral space dock instead; this is a monument, and is not considered to be a unit of any type. There can be only 3 monuments in play at once.{br}At the start of the status phase, place 1 commodity beneath each monument; each monument is worth 1 victory point to the player that controls its planet for every 3 commodities beneath it.{br}When a player gains control of a planet that contains a monument, they may destroy that monument.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Monuments to the Ages",
      name: intl.formatMessage({
        id: "Events.Monuments to the Ages.Title",
        description: "Title of Event: Monuments to the Ages",
        defaultMessage: "Monuments to the Ages",
      }),
    },
    "Rapid Mobilization": {
      description: intl.formatMessage(
        {
          id: "Events.Rapid Mobilization.Description",
          description: "Description of Event: Rapid Mobilization",
          defaultMessage:
            "After setup, put The Fracture into play. Then, each player simultaneously resolves the following effects in order:{br}Place 1 infantry onto each planet adjacent to your home system (or the Creuss Gate/The Sorrow, if playing those factions); gain control of and ready those planets but do not explore them.{br}Place 1 space dock on any planet you control and place your flagship and 3 fighters in its system.{br}Gain your breakthrough.{br}Research 1 technology; if you are the Nomad player, research 1 additional technology.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Rapid Mobilization",
      name: intl.formatMessage({
        id: "Events.Rapid Mobilization.Title",
        description: "Title of Event: Rapid Mobilization",
        defaultMessage: "Rapid Mobilization",
      }),
    },
    "Stellar Atomics": {
      description: intl.formatMessage(
        {
          id: "Events.Stellar Atomics.Description",
          description: "Description of Event: Stellar Atomics",
          defaultMessage:
            "During setup, each player places one of their control tokens on this card.{br}All players can perform the following action:{br}ACTION: Discard your control token from this card to destroy all ground forces and structures on any non-home planet.{br}If you do not have a control token on this card, you cannot vote or play action cards during the agenda phase.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Stellar Atomics",
      name: intl.formatMessage({
        id: "Events.Stellar Atomics.Title",
        description: "Title of Event: Stellar Atomics",
        defaultMessage: "Stellar Atomics",
      }),
    },
    "Weird Wormholes": {
      description: intl.formatMessage(
        {
          id: "Events.Weird Wormholes.Description",
          description: "Description of Event: Weird Wormholes",
          defaultMessage:
            "After a ship moves using at least 1 alpha, beta, or gamma wormhole, roll 1 die and consult the following list.{br}Fighter > Destroyer > Cruiser > Dreadnought > Carrier > Flagship > War Sun (if researched){br}For each result of 1-5, replace that ship with the ship before it from your reinforcements, if able.{br}For each result of 6-10, replace that ship with the ship after it from your reinforcements, if able.{br}If there are no ships of that type in your reinforcements, skip that type and replace it with the next available type.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Weird Wormholes",
      name: intl.formatMessage({
        id: "Events.Weird Wormholes.Title",
        description: "Title of Event: Weird Wormholes",
        defaultMessage: "Weird Wormholes",
      }),
    },
    "Wild Wild Galaxy": {
      description: intl.formatMessage(
        {
          id: "Events.Wild Wild Galaxy.Description",
          description: "Description of Event: Wild Wild Galaxy",
          defaultMessage:
            "Action cards are adjusted as follows:{br}Direct Hit: Can be used against mechs{nl}Flank Speed: Applies +2 MOVE instead of +1{nl}Maneuvering Jets: Cancels all SPACE CANNON hits{nl}Morale Boost: Applies +2 to die rolls instead of +1{nl}Sabotage: Also take the canceled action card{nl}Shields Holding: Can be used in ground combat{nl}Skilled Retreat: Does not place a command token{nl}War Machine: Reduces cost by 5 instead of 1{nl}Diplomatic Pressure: Player must give 3 notes{br}Additionally, Stellar Converter and Nova Seed can be used against any planets and systems.",
        },
        { nl: "\n", br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Wild Wild Galaxy",
      name: intl.formatMessage({
        id: "Events.Wild Wild Galaxy.Title",
        description: "Title of Event: Wild Wild Galaxy",
        defaultMessage: "Wild, Wild Galaxy",
      }),
    },
    "Zealous Orthodoxy": {
      description: intl.formatMessage(
        {
          id: "Events.Zealous Orthodoxy.Description",
          description: "Description of Event: Zealous Orthodoxy",
          defaultMessage:
            "The first player to score 2 secret objectives gains 1 victory point.{br}Then, place that faction's alliance card on this card; all players gain that ability. That faction's alliance promissory note is then purged.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Zealous Orthodoxy",
      name: intl.formatMessage({
        id: "Events.Zealous Orthodoxy.Title",
        description: "Title of Event: Zealous Orthodoxy",
        defaultMessage: "Zealous Orthodoxy",
      }),
    },
  };
}
