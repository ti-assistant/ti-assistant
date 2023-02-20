import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchFactions } from "../../../server/util/fetch";
import { FactionUpdateData } from "../../../src/util/api/factions";
import { GameData } from "../../../src/util/api/util";

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

  const data = req.body as FactionUpdateData;

  if (!data.timestamp) {
    res.status(422);
    return;
  }

  const timestampString = `updates.factions.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "ADD_TECH": {
      if (!data.faction || !data.tech) {
        res.status(422);
        return;
      }
      const tech = data.tech
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const readyString = `factions.${data.faction}.techs.${tech}.ready`;
      const updates: UpdateData<any> = {
        [readyString]: true,
        [timestampString]: timestamp,
      };
      if (tech === "IIHQ Modernization") {
        updates[`planets.Custodia Vigilia.owners`] = [data.faction];
        updates[`updates.planets.timestamp`] = timestamp;
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "REMOVE_TECH": {
      if (!data.faction || !data.tech) {
        res.status(422);
        return;
      }
      const tech = data.tech
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const playerTechString = `factions.${data.faction}.techs.${tech}`;
      const updates = {
        [playerTechString]: FieldValue.delete(),
        [timestampString]: timestamp,
      };
      if (tech === "IIHQ Modernization") {
        updates[`planets.Custodia Vigilia.owners`] = FieldValue.delete();
        updates[`updates.planets.timestamp`] = timestamp;
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "CHOOSE_STARTING_TECH": {
      if (!data.faction || !data.tech) {
        res.status(422);
        return;
      }
      const readyString = `factions.${data.faction}.techs.${data.tech}.ready`;
      const factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [readyString]: true,
          [factionStartingTechString]: FieldValue.arrayUnion(data.tech),
          [timestampString]: timestamp,
        });
      break;
    }
    case "REMOVE_STARTING_TECH": {
      if (!data.faction || !data.tech) {
        res.status(422);
        return;
      }
      const playerTechString = `factions.${data.faction}.techs.${data.tech}`;
      const factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [playerTechString]: FieldValue.delete(),
          [factionStartingTechString]: FieldValue.arrayRemove(data.tech),
          [timestampString]: timestamp,
        });
      break;
    }
    case "CHOOSE_SUB_FACTION": {
      if (!data.faction || !data.subFaction) {
        res.status(422);
        return;
      }
      const planetsString = `factions.${data.faction}.planets`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [planetsString]: {},
        });
      let planets = [];
      switch (data.subFaction) {
        case "Argent Flight":
          planets = ["Avar", "Valk", "Ylir"];
          break;
        case "Mentak Coalition":
          planets = ["Moll Primus"];
          break;
        case "Xxcha Kingdom":
          planets = ["Archon Ren", "Archon Tau"];
          break;
      }
      const playerSubFactionString = `factions.${data.faction}.startswith.faction`;
      const startingPlanetsString = `factions.${data.faction}.startswith.planets`;
      const updates = {
        [playerSubFactionString]: data.subFaction,
        [startingPlanetsString]: planets,
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "PASS": {
      if (!data.faction) {
        res.status(422);
        return;
      }
      const factionPassString = `factions.${data.faction}.passed`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [factionPassString]: true,
          [timestampString]: timestamp,
        });
      break;
    }
    case "READY_ALL": {
      const updateVal: UpdateData<any> = {
        [timestampString]: timestamp,
      };
      for (const factionName of Object.keys(gameData.factions ?? {})) {
        const factionPassString = `factions.${factionName}.passed`;
        updateVal[factionPassString] = false;
      }
      await db.collection("games").doc(gameId).update(updateVal);
      break;
    }
    case "MANUAL_VP_ADJUST": {
      if (!data.faction || !data.vps) {
        res.status(422);
        return;
      }
      const vps = gameData.factions[data.faction]?.vps ?? 0;
      const factionString = `factions.${data.faction}.vps`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [factionString]: vps + data.vps,
          [timestampString]: timestamp,
        });
      break;
    }
    case "UPDATE_CAST_VOTES": {
      if (!data.factions) {
        res.status(422);
        return;
      }
      const updates: UpdateData<any> = {
        [timestampString]: timestamp,
      };
      Object.entries(data.factions).forEach(([factionName, votes]) => {
        const factionString = `factions.${factionName}.votes`;
        const value =
          (gameData.factions[factionName]?.votes ?? 0) + votes.votes;
        updates[factionString] = value;
      });
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "RESET_CAST_VOTES": {
      const updates: UpdateData<any> = {
        [timestampString]: timestamp,
      };
      Object.keys(gameData.factions).forEach((factionName) => {
        const factionString = `factions.${factionName}.votes`;
        updates[factionString] = FieldValue.delete();
      });
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
  }

  const factions = await fetchFactions(gameId);

  res.status(200).json(factions);
}
