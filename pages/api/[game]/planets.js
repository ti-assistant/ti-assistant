import { fetchPlanets } from '../../../server/util/fetch';

export default async function handler(req, res) {

  const gameid = req.query.game;
  const faction = req.query.faction;

  const planets = await fetchPlanets(gameid, faction);
  
  res.status(200).json(planets);
}