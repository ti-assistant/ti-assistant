import { IntlShape } from "react-intl";

export default function getThundersEdgeEvents(
  intl: IntlShape
): Record<ThundersEdge.EventId, TIEvent> {
  return {
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
    // TODO: Confirm accuracy
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
  };
}
