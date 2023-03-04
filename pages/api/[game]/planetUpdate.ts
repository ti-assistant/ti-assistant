import { fetchAttachments, fetchPlanets } from "../../../server/util/fetch";
import { applyPlanetAttachments } from "../../../src/util/planets";

import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";
import { Planet, PlanetUpdateData } from "../../../src/util/api/planets";
import { Attachment } from "../../../src/util/api/attachments";

export async function shouldUnlockXxchaCommander(
  data: PlanetUpdateData,
  gameData: GameData,
  gamePlanets: Record<string, Planet>,
  attachments: Record<string, Attachment>
) {
  const factionName = "Xxcha Kingdom";
  if (
    !gameData.factions[factionName] ||
    gameData.factions[factionName].commander === "unlocked"
  ) {
    return false;
  }
  const totalInfluence = Object.values(gamePlanets).reduce((count, planet) => {
    if (data.planet === planet.name && data.action === "ADD_PLANET") {
      const updatedPlanet = applyPlanetAttachments(planet, attachments);
      return count + updatedPlanet.influence;
    }
    if (
      data.planet === planet.name &&
      data.action === "ADD_ATTACHMENT" &&
      data.attachment
    ) {
      if (!planet.attachments) {
        planet.attachments = [];
      }
      planet.attachments.push(data.attachment);
    }
    if (planet.owner === factionName) {
      const updatedPlanet = applyPlanetAttachments(planet, attachments);
      return count + updatedPlanet.influence;
    }
    return count;
  }, 0);
  return totalInfluence >= 12;
}

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

  const data = req.body as PlanetUpdateData;

  if (!data.timestamp) {
    res.status(422);
    return;
  }

  const timestampString = `updates.planets.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "ADD_PLANET": {
      if (!data.planet || !data.faction) {
        res.status(422);
        return;
      }
      const ownerString = `planets.${data.planet}.owner`;
      const updates: UpdateData<any> = {
        [ownerString]: data.faction,
        [timestampString]: timestamp,
      };
      if (data.faction === "Xxcha Kingdom") {
        const gamePlanets = await fetchPlanets(gameId);
        const attachments = await fetchAttachments(gameId);
        const shouldUnlock = await shouldUnlockXxchaCommander(
          data,
          gameData,
          gamePlanets,
          attachments
        );

        if (shouldUnlock) {
          updates[`factions.${data.faction}.commander`] = "unlocked";
          updates[`updates.factions.timestamp`] = timestamp;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "REMOVE_PLANET": {
      if (!data.planet || !data.faction) {
        res.status(422);
        return;
      }
      const ownerString = `planets.${data.planet}.owner`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [ownerString]: FieldValue.delete(),
          [timestampString]: timestamp,
        });
      break;
    }
    case "ADD_ATTACHMENT": {
      if (!data.planet || !data.attachment) {
        res.status(422);
        return;
      }
      const planetAttachmentString = `planets.${data.planet}.attachments`;
      const updates: UpdateData<any> = {
        [planetAttachmentString]: FieldValue.arrayUnion(data.attachment),
        [timestampString]: timestamp,
      };

      let planetOwner: string | undefined;
      Object.entries(gameData.planets ?? {}).forEach(([planetId, planet]) => {
        if (!data.attachment) {
          return;
        }
        if (planetId === data.planet) {
          planetOwner = planet.owner;
        }
        const planetRemoveString = `planets.${planetId}.attachments`;
        if ((planet.attachments ?? []).includes(data.attachment)) {
          updates[planetRemoveString] = FieldValue.arrayRemove(data.attachment);
        }
      });
      if (planetOwner === "Xxcha Kingdom") {
        const attachments = await fetchAttachments(gameId);
        const gamePlanets = await fetchPlanets(gameId);
        const shouldUnlock = await shouldUnlockXxchaCommander(
          data,
          gameData,
          gamePlanets,
          attachments
        );
        if (shouldUnlock) {
          updates[`factions.Xxcha Kingdom.commander`] = "unlocked";
          updates[`updates.factions.timestamp`] = timestamp;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "REMOVE_ATTACHMENT": {
      if (!data.planet || !data.attachment) {
        res.status(422);
        return;
      }
      const planetAttachmentString = `planets.${data.planet}.attachments`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [planetAttachmentString]: FieldValue.arrayRemove(data.attachment),
          [timestampString]: timestamp,
        });
      break;
    }
  }

  const response = await fetchPlanets(gameId);

  return res.status(200).json(response);
}
