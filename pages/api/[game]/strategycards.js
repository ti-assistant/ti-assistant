import { fetchStrategyCards } from '../../../server/util/fetch';

export default async function handler(req, res) {
  const strategyCards = await fetchStrategyCards(req.query.game);

  res.status(200).json(strategyCards);
}