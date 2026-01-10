const STRATEGY_CARD_ORDER: Record<StrategyCardId, number> = {
  Leadership: 1,
  Lux: 1,
  Diplomacy: 2,
  Noctis: 2,
  Politics: 3,
  Tyrannus: 3,
  Construction: 4,
  Civitas: 4,
  Trade: 5,
  Amicus: 5,
  Warfare: 6,
  Calamitas: 6,
  Technology: 7,
  Magus: 7,
  Imperial: 8,
  Aeterna: 8,
} as const;

export function sortStrategyCards(
  strategyCards: StrategyCard[],
  ignoreZero?: boolean
) {
  if (!ignoreZero) {
    strategyCards.sort((a, b) => (a.order > b.order ? 1 : -1));
    return strategyCards;
  }
  strategyCards.sort((a, b) =>
    STRATEGY_CARD_ORDER[a.id] > STRATEGY_CARD_ORDER[b.id] ? 1 : -1
  );
  return strategyCards;
}
