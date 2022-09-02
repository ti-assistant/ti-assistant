const GAME_INFO = {
  phase: "Action",
  agendaUnlocked: false,
  players: [
    {
      faction: "Arborec",
      color: "Green",
      is_speaker: false,
      active_player: true,
      has_passed: false,
      strategy_card: {
        name: "Diplomacy",
        order: 2,
        used: false
      },
      victory_points: [
        {
          amount: 1,
          name: "Custodians Token"
        },
        {
          amount: 1,
          name: "Corner the Market"
        }
      ]
    },
    {
      faction: "Barony of Letnev",
      color: "Red",
      is_speaker: true,
      active_player: false,
      has_passed: false,
      strategy_card: {
        name: "Leadership",
        order: 1,
        used: true
      },
      victory_points: [
        {
          amount: 1,
          name: "Custodians Token"
        },
        {
          amount: 1,
          name: "Corner the Market"
        }
      ]
    },
    {
      faction: "Federation of Sol",
      color: "Blue",
      is_speaker: false,
      active_player: false,
      has_passed: false,
      strategy_card: {
        name: "Warfare",
        order: 6,
        used: false
      },
      victory_points: [
        {
          amount: 1,
          name: "Custodians Token"
        },
        {
          amount: 1,
          name: "Corner the Market"
        }
      ]
    }
  ],
};

export default function handler(req, res) {
  res.status(200).json(GAME_INFO);
}