import { fetchRelics } from "../../../server/util/fetch";

import {
  FieldValue,
  getFirestore,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";
import { RelicUpdateData } from "../../../src/util/api/relics";
import { ComponentState } from "../../../src/util/api/components";

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
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  const data = req.body as RelicUpdateData;

  if (!data.timestamp) {
    res.status(422);
    return;
  }

  const timestampString = `updates.relics.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "GAIN_RELIC": {
      if (!data.relic || !data.faction) {
        res.status(422).send({ message: "Must provide relic and faction." });
        return;
      }
      const relicString = `relics.${data.relic}.owner`;
      const updates: UpdateData<any> = {
        [relicString]: data.faction,
        [timestampString]: timestamp,
      };
      // switch (data.relic) {
      //   case "Shard of the Throne": {
      //     updates[`objectives.Shard of the Throne.selected`] = true;
      //     updates[`objectives.Shard of the Throne.scorers`] = [data.faction];
      //     updates[`updates.objectives.timestamp`] = timestamp;
      //     break;
      //   }
      // }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "LOSE_RELIC": {
      if (!data.relic || !data.faction) {
        res.status(422).send({ message: "Must provide relic and faction." });
        return;
      }
      const relicString = `relics.${data.relic}.owner`;
      const updates: UpdateData<any> = {
        [relicString]: FieldValue.delete(),
        [timestampString]: timestamp,
      };
      // switch (data.relic) {
      //   case "Shard of the Throne": {
      //     updates[`objectives.Shard of the Throne.scorers`] =
      //       FieldValue.arrayRemove(data.faction);
      //     updates[`updates.objectives.timestamp`] = timestamp;
      //     break;
      //   }
      // }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "USE_RELIC": {
      if (!data.relic) {
        res.status(422).send({ message: "Must provide relic." });
        return;
      }
      const updates: UpdateData<any> = {
        [timestampString]: timestamp,
      };
      let relicState: ComponentState = "purged";
      switch (data.relic) {
        case "JR-X455-O":
        case "Scepter of Elempar":
        case "The Prophet's Tears":
          relicState = "exhausted";
          break;
        case "The Crown of Emphidia":
          if (gameData.state.phase === "ACTION") {
            relicState = "exhausted";
          } else if (gameData.state.phase === "STATUS") {
            if (!data.faction) {
              res
                .status(422)
                .send({ message: "Must provide faction when scoring Crown." });
              return;
            }
            updates[`objectives.The Tomb + Crown of Emphidia.scorers`] = [
              data.faction,
            ];
            updates[`updates.objectives.timestamp`] = timestamp;
          }
          break;
      }
      updates[`relics.${data.relic}.state`] = relicState;
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
  }

  const response = await fetchRelics(gameId);

  return res.status(200).json(response);
}
