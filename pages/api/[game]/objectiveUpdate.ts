import { fetchObjectives } from "../../../server/util/fetch";

import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";
import {
  BaseObjective,
  ObjectiveUpdateData,
} from "../../../src/util/api/objectives";
import { BASE_OBJECTIVES, ObjectiveId } from "../../../server/data/objectives";

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

  const data = req.body as ObjectiveUpdateData;

  if (!data.action || !data.timestamp || !data.objective) {
    res.status(422);
    return;
  }

  const secret = req.cookies.secret;

  const timestampString = `updates.objectives.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "REVEAL_OBJECTIVE": {
      const objective = BASE_OBJECTIVES[data.objective as ObjectiveId];

      if (objective && objective.type === "SECRET") {
        if (!data.faction) {
          res.status(422);
          return;
        }
        const secret = req.cookies.secret;
        if (typeof secret === "string") {
          const objectiveString = `${secret}.objectives.${data.objective}.selected`;
          const factionString = `${secret}.objectives.${data.objective}.factions`;

          await db
            .collection("games")
            .doc(gameId)
            .update({
              [objectiveString]: true,
              [factionString]: FieldValue.arrayUnion(data.faction),
              [timestampString]: timestamp,
            });
        }
      } else {
        const objectiveString = `objectives.${data.objective}.selected`;
        await db
          .collection("games")
          .doc(gameId)
          .update({
            [objectiveString]: true,
            [timestampString]: timestamp,
          });
      }
      break;
    }
    case "REMOVE_OBJECTIVE": {
      const objective = BASE_OBJECTIVES[data.objective as ObjectiveId];
      if (objective && objective.type === "SECRET") {
        if (!data.faction) {
          res.status(422);
          return;
        }
        const secret = req.cookies.secret;
        if (typeof secret === "string") {
          const objectiveString = `${secret}.objectives.${data.objective}.selected`;
          const factionString = `${secret}.objectives.${data.objective}.factions`;
          await db
            .collection("games")
            .doc(gameId)
            .update({
              [objectiveString]: false,
              [factionString]: FieldValue.arrayRemove(data.faction),
              [timestampString]: timestamp,
            });
        }
      } else {
        const objectiveString = `objectives.${data.objective}.selected`;
        await db
          .collection("games")
          .doc(gameId)
          .update({
            [objectiveString]: false,
            [timestampString]: timestamp,
          });
      }
      break;
    }
    case "SCORE_OBJECTIVE": {
      if (!data.faction) {
        res.status(422);
        return;
      }
      const objective = BASE_OBJECTIVES[data.objective as ObjectiveId];

      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue: FieldValue | string[] = FieldValue.arrayUnion(
        data.faction
      );
      if (objective?.repeatable) {
        const scorers =
          (gameData.objectives ?? {})[data.objective]?.scorers ?? [];
        scorers.push(data.faction);
        updateValue = scorers;
      }
      const updates: UpdateData<any> = {
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: timestamp,
      };
      if (gameData.factions[data.faction]?.hero === "locked") {
        const gameObjectives = await fetchObjectives(gameId, secret ?? "");
        const scoredObjectives = Object.entries(gameObjectives ?? {}).filter(
          ([objectiveID, objective]) => {
            if (!data.faction) {
              return false;
            }
            return (
              objective.type !== "OTHER" &&
              ((objective.scorers ?? []).includes(data.faction) ||
                data.objective === objectiveID)
            );
          }
        ).length;
        if (scoredObjectives >= 3) {
          updates[`factions.${data.faction}.hero`] = "unlocked";
          updates[`updates.factions.timestamp`] = timestamp;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      if (!data.faction) {
        res.status(422);
        return;
      }
      const objective = BASE_OBJECTIVES[data.objective as ObjectiveId];

      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue: FieldValue | string[] = FieldValue.arrayRemove(
        data.faction
      );
      if (objective?.repeatable) {
        const scorers =
          (gameData.objectives ?? {})[data.objective]?.scorers ?? [];
        const lastIndex = scorers.lastIndexOf(data.faction);
        scorers.splice(lastIndex, 1);
        updateValue = scorers;
      }
      const updates: UpdateData<any> = {
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: timestamp,
      };
      if (gameData.factions[data.faction]?.hero === "unlocked") {
        const gameObjectives = await fetchObjectives(gameId, secret ?? "");
        const scoredObjectives = Object.entries(gameObjectives).filter(
          ([objectiveID, objective]) => {
            if (!data.faction) {
              return false;
            }
            return (
              objective.type !== "OTHER" &&
              (objective.scorers ?? []).includes(data.faction) &&
              data.objective !== objectiveID
            );
          }
        ).length;
        if (scoredObjectives < 3) {
          updates[`factions.${data.faction}.hero`] = "locked";
          updates[`updates.factions.timestamp`] = timestamp;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "CHANGE_OBJECTIVE_TYPE": {
      if (!data.type) {
        res.status(422);
        return;
      }
      const typeString = `objectives.${data.objective}.type`;
      const revealedString = `objectives.${data.objective}.selected`;
      const updates: UpdateData<any> = {
        [revealedString]: true,
        [typeString]: data.type,
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
  }

  const objectives = await fetchObjectives(gameId, secret ?? "");

  res.status(200).json(objectives);
}
