import { fetchAgendas } from '../../../server/util/fetch';

export default async function handler(req, res) {
  const gameid = req.query.game;

  const agendas = await fetchAgendas(gameid);

  res.status(200).json(agendas);
}