import { fetchAgendas } from "../../../server/util/fetch";

import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";
import { AgendaUpdateData, GameAgenda } from "../../../src/util/api/agendas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }
  const data = req.body as AgendaUpdateData;

  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  if (!data.timestamp || !data.action || !data.agenda) {
    res.status(422);
    return;
  }

  const timestampString = `updates.agendas.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "RESOLVE_AGENDA": {
      if (!data.target) {
        res.status(422);
        return;
      }
      const gameData = gameRef.data() as GameData;
      const agendaString = `agendas.${data.agenda}`;
      const agenda: GameAgenda = {
        name: data.agenda,
        passed: data.target !== "Against",
        target: data.target,
        resolved: true,
      };
      switch (data.agenda) {
        case "Anti-Intellectual Revolution": {
          if (data.target === "Against") {
            agenda.activeRound = gameData.state.round + 1;
          }
          break;
        }
        case "Arms Reduction": {
          if (data.target === "Against") {
            agenda.activeRound = gameData.state.round + 1;
          }
          break;
        }
        case "Checks and Balances": {
          if (data.target === "Against") {
            agenda.activeRound = gameData.state.round;
          }
          break;
        }
        case "New Constitution": {
          if (data.target === "For") {
            agenda.activeRound = gameData.state.round + 1;
          }
          break;
        }
        case "Public Execution": {
          agenda.activeRound = gameData.state.round;
          break;
        }
        case "Representative Government": {
          agenda.activeRound = gameData.state.round + 1;
          // TODO: Get the list of users that voted on this.
          break;
        }
      }
      const updates = {
        [agendaString]: {
          ...((gameData.agendas ?? {})[data.agenda] ?? {}),
          ...agenda,
        },
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "REPEAL_AGENDA": {
      const agendaString = `agendas.${data.agenda}`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [agendaString]: FieldValue.delete(),
          [timestampString]: timestamp,
        });
      break;
    }
  }

  const agendas = await fetchAgendas(gameId);

  res.status(200).json(agendas);
}
