import { IntlShape } from "react-intl";

export default function getProphecyOfKingsAgendas(
  intl: IntlShape,
): Record<ProphecyOfKings.AgendaId, BaseAgenda> {
  return {
    "Armed Forces Standardization": {
      description: intl.formatMessage(
        {
          id: "Agendas.Armed Forces Standardization.Description",
          description:
            "Description for Agenda Card: Armed Forces Standardization",
          defaultMessage:
            "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements.",
        },
        { br: "\n\n" },
      ),
      elect: "Player",
      expansion: "POK",
      id: "Armed Forces Standardization",
      name: intl.formatMessage({
        id: "Agendas.Armed Forces Standardization.Title",
        description: "Title of Agenda Card: Armed Forces Standardization",
        defaultMessage: "Armed Forces Standardization",
      }),
      type: "DIRECTIVE",
    },
    "Articles of War": {
      description: intl.formatMessage(
        {
          id: "Agendas.Articles of War.Description",
          description: "Description for Agenda Card: Articles of War",
          defaultMessage:
            'FOR : All mechs lose their printed abilities except for SUSTAIN DAMAGE.{br}AGAINST : Each player that voted "For" gains 3 trade goods.',
        },
        { br: "\n\n" },
      ),
      elect: "For/Against",
      expansion: "POK",
      id: "Articles of War",
      name: intl.formatMessage({
        id: "Agendas.Articles of War.Title",
        description: "Title of Agenda Card: Articles of War",
        defaultMessage: "Articles of War",
      }),
      type: "LAW",
    },
    "Checks and Balances": {
      description: intl.formatMessage(
        {
          id: "Agendas.Checks and Balances.Description",
          description: "Description for Agenda Card: Checks and Balances",
          defaultMessage:
            "FOR : When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have 1 (or a player that does not have 2 in a three- or four-player game), if able.{br}AGAINST : Each player readies only 3 of their planets at the end of this agenda phase.",
        },
        { br: "\n\n" },
      ),
      elect: "For/Against",
      expansion: "POK",
      id: "Checks and Balances",
      name: intl.formatMessage({
        id: "Agendas.Checks and Balances.Title",
        description: "Title of Agenda Card: Checks and Balances",
        defaultMessage: "Checks and Balances",
      }),
      type: "LAW",
    },
    "Covert Legislation": {
      description: intl.formatMessage(
        {
          id: "Agendas.Covert Legislation.Description",
          description: "Description for Agenda Card: Covert Legislation",
          defaultMessage:
            "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players.{br}Instead, the speaker reads the eligible outcomes aloud (For, Against, Elect Player, etc.); the other players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects.",
        },
        { br: "\n\n" },
      ),
      elect: "???",
      expansion: "POK",
      id: "Covert Legislation",
      name: intl.formatMessage({
        id: "Agendas.Covert Legislation.Title",
        description: "Title of Agenda Card: Covert Legislation",
        defaultMessage: "Covert Legislation",
      }),
      type: "DIRECTIVE",
    },
    "Galactic Crisis Pact": {
      description: intl.formatMessage(
        {
          id: "Agendas.Galactic Crisis Pact.Description",
          description: "Description for Agenda Card: Galactic Crisis Pact",
          defaultMessage:
            "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead.",
        },
        { br: "\n\n" },
      ),
      elect: "Strategy Card",
      expansion: "POK",
      id: "Galactic Crisis Pact",
      name: intl.formatMessage({
        id: "Agendas.Galactic Crisis Pact.Title",
        description: "Title of Agenda Card: Galactic Crisis Pact",
        defaultMessage: "Galactic Crisis Pact",
      }),
      type: "DIRECTIVE",
    },
    "Minister of Antiques": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Antiques.Description",
          description: "Description for Agenda Card: Minister of Antiques",
          defaultMessage: "The elected player gains 1 relic.",
        },
        { br: "\n\n" },
      ),
      elect: "Player",
      expansion: "POK",
      id: "Minister of Antiques",
      name: intl.formatMessage({
        id: "Agendas.Minister of Antiques.Title",
        description: "Title of Agenda Card: Minister of Antiques",
        defaultMessage: "Minister of Antiques",
      }),
      type: "DIRECTIVE",
    },
    "Nexus Sovereignty": {
      description: intl.formatMessage(
        {
          id: "Agendas.Nexus Sovereignty.Description",
          description: "Description for Agenda Card: Nexus Sovereignty",
          defaultMessage:
            "FOR : Alpha and beta wormholes in the wormhole nexus have no effect during movement.{br}AGAINST : Place a gamma wormhole token in the Mecatol Rex system.",
        },
        { br: "\n\n" },
      ),
      elect: "For/Against",
      expansion: "POK",
      id: "Nexus Sovereignty",
      name: intl.formatMessage({
        id: "Agendas.Nexus Sovereignty.Title",
        description: "Title of Agenda Card: Nexus Sovereignty",
        defaultMessage: "Nexus Sovereignty",
      }),
      type: "LAW",
    },
    "Political Censure": {
      description: intl.formatMessage(
        {
          id: "Agendas.Political Censure.Description",
          description: "Description for Agenda Card: Political Censure",
          defaultMessage:
            "The elected player gains this card and 1 victory point.{br}The elected player cannot play action cards.{br}If the owner of this card loses this card, they lose 1 victory point.",
        },
        { br: "\n\n" },
      ),
      elect: "Player",
      expansion: "POK",
      id: "Political Censure",
      name: intl.formatMessage({
        id: "Agendas.Political Censure.Title",
        description: "Title of Agenda Card: Political Censure",
        defaultMessage: "Political Censure",
      }),
      type: "LAW",
    },
    "Rearmament Agreement": {
      description: intl.formatMessage(
        {
          id: "Agendas.Rearmament Agreement.Description",
          description: "Description for Agenda Card: Rearmament Agreement",
          defaultMessage:
            "FOR : Each player places 1 mech from their reinforcements on a planet they control in their home system.{br}AGAINST : Each player replaces each of their mechs with 1 infantry from their reinforcements.",
        },
        { br: "\n\n" },
      ),
      elect: "For/Against",
      expansion: "POK",
      id: "Rearmament Agreement",
      name: intl.formatMessage({
        id: "Agendas.Rearmament Agreement.Title",
        description: "Title of Agenda Card: Rearmament Agreement",
        defaultMessage: "Rearmament Agreement",
      }),
      type: "DIRECTIVE",
    },
    "Research Grant Reallocation": {
      description: intl.formatMessage(
        {
          id: "Agendas.Research Grant Reallocation.Description",
          description:
            "Description for Agenda Card: Research Grant Reallocation",
          defaultMessage:
            "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements.",
        },
        { br: "\n\n" },
      ),
      elect: "Player",
      expansion: "POK",
      id: "Research Grant Reallocation",
      name: intl.formatMessage({
        id: "Agendas.Research Grant Reallocation.Title",
        description: "Title of Agenda Card: Research Grant Reallocation",
        defaultMessage: "Research Grant Reallocation",
      }),
      type: "DIRECTIVE",
    },
    "Search Warrant": {
      description: intl.formatMessage(
        {
          id: "Agendas.Search Warrant.Description",
          description: "Description for Agenda Card: Search Warrant",
          defaultMessage:
            "The elected player gains this card and draws 2 secret objectives.{br}The owner of this card plays with their secret objectives revealed.",
        },
        { br: "\n\n" },
      ),
      elect: "Player",
      expansion: "POK",
      id: "Search Warrant",
      name: intl.formatMessage({
        id: "Agendas.Search Warrant.Title",
        description: "Title of Agenda Card: Search Warrant",
        defaultMessage: "Search Warrant",
      }),
      type: "LAW",
    },
  };
}
